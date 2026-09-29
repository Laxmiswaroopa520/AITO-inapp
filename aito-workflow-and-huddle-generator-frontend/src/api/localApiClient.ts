import staticApiData from "@/data/static-api-data.json";
import commonRolePathWeeks from "@/data/commonRolePathWeeks.json";
import type { CurrentUser } from "@/auth/auth.types";
import type { Activity, ActivityFilters } from "@/features/workflow-builder/types/activity.types";
import type { AiTool } from "@/features/workflow-builder/types/aiTool.types";
import type { Role } from "@/features/workflow-builder/types/role.types";
import type { WorkflowBucket } from "@/features/workflow-builder/types/workflowBucket.types";
import type {
  HuddleCatalogItemResponse,
  HuddleDetailResponse,
  HuddleLaunchPlanResponse,
  HuddlePlanResponse,
  HuddleSessionResponse,
  HuddleUpcomingWeekResponse,
  HuddleVoteResponse,
  IncompleteHuddleSessionResponse,
  RecommendedHuddlePathResponse,
  SaveHuddleLaunchPlanRequest,
  SetHuddleVoteRequest,
} from "@/features/huddle/types";
import type {
  SaveWorkflowInput,
  SavedWorkflow,
  SavedWorkflowSummary,
} from "@/features/saved-workflows/types/savedWorkflow.types";
import { ApiError, type ApiClient } from "./apiClient";

interface StaticApiData {
  reference: {
    roles: Role[];
    aiTools: AiTool[];
    workflowBuckets: WorkflowBucket[];
    activities: Activity[];
  };
  huddle: {
    defaultCatalog: Record<string, HuddleCatalogItemResponse>;
    placementCatalog: Record<string, HuddleCatalogItemResponse>;
    defaultDetails: Record<string, HuddleDetailResponse>;
    placementDetails: Record<string, HuddleDetailResponse>;
    rolePlacements: Record<string, Record<string, string>>;
    weeklyPaths: Record<string, Array<{ week: number; placementExternalId: string; topicExternalId: string }>>;
    additionalPaths: Record<string, Array<{ week: number; placementExternalId: string; topicExternalId: string }>>;
  };
}

interface LocalWorkflowRecord extends SavedWorkflow {}
interface StoredPlanItem {
  week: number;
  huddleExternalId: string;
  placementExternalId?: string | null;
}
interface StoredPlan {
  roleExternalId: string;
  rowVersion: string;
  items: StoredPlanItem[];
}
interface StoredVote {
  value: -1 | 1;
  downvoteReasons: string[] | null;
  comment: string | null;
}
interface StoredSessions {
  [key: string]: HuddleSessionResponse;
}

const DATA = staticApiData as unknown as StaticApiData;
// Hand-maintained weeks shared by every audience (src/data/commonRolePathWeeks.json). Kept out of
// static-api-data.json, which is generated from the SQL seed scripts and would lose hand edits.
const COMMON_ROLE_PATH_WEEKS = commonRolePathWeeks as HuddleUpcomingWeekResponse[];
const WORKFLOWS_KEY = "aito.local.workflows.v1";
const HUDDLE_PLANS_KEY = "aito.local.huddle-plans.v1";
const HUDDLE_LAUNCH_PLAN_KEY = "aito.local.huddle-launch-plan.v1";
const HUDDLE_VOTES_KEY = "aito.local.huddle-votes.v1";
const HUDDLE_SESSIONS_KEY = "aito.local.huddle-sessions.v1";

const LOCAL_USER: CurrentUser = {
  objectId: "local-user",
  email: null,
  displayName: "AITO User",
  roles: [],
  isAuthenticated: true,
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The app remains usable in memory even when browser storage is unavailable.
  }
}

function version(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

function parsePath(path: string): { pathname: string; searchParams: URLSearchParams } {
  const url = new URL(path, window.location.origin);
  return { pathname: url.pathname, searchParams: url.searchParams };
}

function notFound(message: string): never {
  throw new ApiError(message, 404);
}

function activitiesFromQuery(searchParams: URLSearchParams): Activity[] {
  const filters: ActivityFilters = {
    roleId: searchParams.get("roleId") ?? undefined,
    workflowBucketId: searchParams.get("workflowBucketId") ?? undefined,
    aiToolId: searchParams.get("aiToolId") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    frequency: searchParams.get("frequency") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    toolCoverageLevel: searchParams.get("toolCoverageLevel") ?? undefined,
    triggerContext: searchParams.get("triggerContext") ?? undefined,
    mcemStage: searchParams.get("mcemStage") ?? undefined,
    search: searchParams.get("search") ?? undefined,
  };
  const text = filters.search?.trim().toLowerCase();
  return DATA.reference.activities.filter((activity) => {
    if (filters.roleId && activity.roleExternalId !== filters.roleId) return false;
    if (filters.workflowBucketId && activity.workflowBucketExternalId !== filters.workflowBucketId) return false;
    if (filters.aiToolId && !activity.aiTools.some((tool) => tool.externalId === filters.aiToolId)) return false;
    if (filters.category && activity.category.toLowerCase() !== filters.category.toLowerCase()) return false;
    if (filters.frequency && activity.frequency.toLowerCase() !== filters.frequency.toLowerCase()) return false;
    if (filters.priority && activity.priority.toLowerCase() !== filters.priority.toLowerCase()) return false;
    if (filters.toolCoverageLevel && activity.toolCoverageLevel.toLowerCase() !== filters.toolCoverageLevel.toLowerCase()) return false;
    if (filters.triggerContext && activity.triggerContext.toLowerCase() !== filters.triggerContext.toLowerCase()) return false;
    if (filters.mcemStage && activity.mcemStage.toLowerCase() !== filters.mcemStage.toLowerCase()) return false;
    if (text) {
      const haystack = `${activity.title} ${activity.description ?? ""} ${activity.businessOutcome ?? ""}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  }).map(clone);
}

function placementCatalogForRole(item: HuddleCatalogItemResponse, roleExternalId: string | null): HuddleCatalogItemResponse {
  if (!roleExternalId) return item;
  const placementId = DATA.huddle.rolePlacements[roleExternalId]?.[item.externalId];
  return placementId && DATA.huddle.placementCatalog[placementId]
    ? DATA.huddle.placementCatalog[placementId]
    : item;
}

function allVotes(): Record<string, StoredVote> {
  return readStorage<Record<string, StoredVote>>(HUDDLE_VOTES_KEY, {});
}

function voteResponse(externalId: string): HuddleVoteResponse {
  const stored = allVotes()[externalId];
  return {
    huddleExternalId: externalId,
    upvotes: stored?.value === 1 ? 1 : 0,
    downvotes: stored?.value === -1 ? 1 : 0,
    currentUserVote: stored?.value ?? null,
  };
}

function huddleCatalog(searchParams: URLSearchParams): HuddleCatalogItemResponse[] {
  const additionalRole = searchParams.get("additionalContentRoleExternalId");
  const additionalOnly = searchParams.get("additionalContentOnly") === "true";
  const rolePathRoles = (searchParams.get("rolePathRoleExternalIds") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const role = searchParams.get("roleExternalId");
  const placementRole = searchParams.get("placementRoleExternalId");
  const focus = searchParams.get("focusAreaExternalId");
  const agent = searchParams.get("agentExternalId");
  const type = searchParams.get("type");
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const sort = searchParams.get("sort")?.toLowerCase() ?? "default";

  // Each entry below names one placement row (one role's use of a topic), so the "seen" guards
  // dedupe by placementExternalId only -- a defensive no-op against a literal duplicate row in
  // the source data. They no longer dedupe by topicExternalId: a topic placed on several role
  // paths (or on Additional Content for several roles) now surfaces once per placement here,
  // each carrying its own role-facing heading/description (see HuddleCatalogItemResponse's
  // roleTopicName/roleTopicDescription and placementCatalogForRole below), instead of collapsing
  // to a single arbitrarily-chosen placement per topic.
  let items: HuddleCatalogItemResponse[];
  if (additionalRole) {
    const seen = new Set<string>();
    items = (DATA.huddle.additionalPaths[additionalRole] ?? [])
      .filter((entry) => !seen.has(entry.placementExternalId) && seen.add(entry.placementExternalId))
      .map((entry) => DATA.huddle.placementCatalog[entry.placementExternalId])
      .filter(Boolean);
  } else if (additionalOnly && rolePathRoles.length > 0) {
    // All Topics' default projection once an audience is in scope: the full Additional_Content
    // set (every role, not just the audience's own) plus that audience's Role Path (weekly)
    // placements, unioned. "Only All Topics" bypasses this and keeps using the
    // additionalOnly-only branch below, unchanged.
    const seen = new Set<string>();
    const additionalEntries = Object.values(DATA.huddle.additionalPaths).flat();
    const rolePathEntries = rolePathRoles.flatMap((roleId) => DATA.huddle.weeklyPaths[roleId] ?? []);
    items = [...additionalEntries, ...rolePathEntries]
      .filter((entry) => !seen.has(entry.placementExternalId) && seen.add(entry.placementExternalId))
      .map((entry) => DATA.huddle.placementCatalog[entry.placementExternalId])
      .filter(Boolean);
  } else if (additionalOnly) {
    const seen = new Set<string>();
    items = Object.values(DATA.huddle.additionalPaths).flat()
      .filter((entry) => !seen.has(entry.placementExternalId) && seen.add(entry.placementExternalId))
      .map((entry) => DATA.huddle.placementCatalog[entry.placementExternalId])
      .filter(Boolean);
  } else {
    // All Topics' default projection when no audience is in scope: every role's Additional
    // Content placements plus every role's Role Path (weekly) placements, unioned -- the same
    // placement-level projection as the audience-scoped branch above, just spanning every role
    // instead of one. defaultCatalog (one pre-picked placement per topic) is intentionally not
    // used here anymore; it remains as-is for the other call sites that still want exactly one
    // representative placement per topic (see voteResponse's topic list and planResponse's
    // fallback further down).
    const seen = new Set<string>();
    const additionalEntries = Object.values(DATA.huddle.additionalPaths).flat();
    const rolePathEntries = Object.values(DATA.huddle.weeklyPaths).flat();
    items = [...additionalEntries, ...rolePathEntries]
      .filter((entry) => !seen.has(entry.placementExternalId) && seen.add(entry.placementExternalId))
      .map((entry) => DATA.huddle.placementCatalog[entry.placementExternalId])
      .filter(Boolean);
  }

  items = items
    .map((item) => placementCatalogForRole(item, placementRole))
    .filter((item) => !role || item.roles.some((candidate) => candidate.externalId === role))
    .filter((item) => !focus || item.focusAreaExternalId === focus)
    .filter((item) => !type || item.type === type)
    .filter((item) => {
      if (!agent) return true;
      if ([...item.primaryAgents, ...item.secondaryAgents].some((candidate) => candidate.externalId === agent)) return true;
      const detail = item.placementExternalId
        ? DATA.huddle.placementDetails[item.placementExternalId]
        : DATA.huddle.defaultDetails[item.externalId];
      return Boolean(detail?.phases.some((phase) => phase.activities.some((activity) => activity.agents.some((candidate) => candidate.externalId === agent))));
    })
    .filter((item) => !search || `${item.name} ${item.description ?? ""}`.toLowerCase().includes(search));

  if (sort === "name") items.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "most-upvoted") items.sort((a, b) => (voteResponse(b.externalId).upvotes - voteResponse(b.externalId).downvotes) - (voteResponse(a.externalId).upvotes - voteResponse(a.externalId).downvotes) || a.name.localeCompare(b.name));
  else if (sort === "role-relevance" && role) {
    const order = new Map((DATA.huddle.weeklyPaths[role] ?? []).map((entry, index) => [entry.topicExternalId, index]));
    items.sort((a, b) => (order.get(a.externalId) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.externalId) ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name));
  } else items.sort((a, b) => (a.recommendationPriority ?? Number.MAX_SAFE_INTEGER) - (b.recommendationPriority ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name));

  return clone(items);
}

function recommendedPath(roleExternalId: string): RecommendedHuddlePathResponse {
  const path = DATA.huddle.weeklyPaths[roleExternalId] ?? [];
  const items = path.map((entry, index) => ({
    week: entry.week,
    pathOrder: index + 1,
    huddle: clone(DATA.huddle.placementCatalog[entry.placementExternalId]),
  }));
  const complete = path.length > 0 && path.every((entry, index) => entry.week === index + 1);
  return {
    roleExternalId,
    isComplete: complete,
    configurationMessage: complete || path.length === 0 ? null : `The role path for '${roleExternalId}' is not contiguous from Week 1.`,
    items,
  };
}

function huddlePlans(): Record<string, StoredPlan> {
  return readStorage<Record<string, StoredPlan>>(HUDDLE_PLANS_KEY, {});
}

/** Common weeks follow the role's own path, so a role with no weekly path (All Roles) gets none. */
function upcomingWeeksAfter(items: { week: number }[]): HuddleUpcomingWeekResponse[] {
  if (items.length === 0) return [];
  const lastWeek = Math.max(...items.map((item) => item.week));
  return clone(COMMON_ROLE_PATH_WEEKS.filter((entry) => entry.week > lastWeek).sort((a, b) => a.week - b.week));
}

function planResponse(roleExternalId: string): HuddlePlanResponse {
  const saved = huddlePlans()[roleExternalId];
  const path = DATA.huddle.weeklyPaths[roleExternalId] ?? [];
  const selected = saved?.items ?? path.map((entry) => ({
    week: entry.week,
    huddleExternalId: entry.topicExternalId,
    placementExternalId: entry.placementExternalId,
  }));
  const recommendedByWeek = new Map(path.map((entry) => [entry.week, entry]));
  const items = selected.map((item) => {
    const recommended = recommendedByWeek.get(item.week);
    const placementId = item.placementExternalId ?? recommended?.placementExternalId ?? DATA.huddle.rolePlacements[roleExternalId]?.[item.huddleExternalId] ?? null;
    const huddle = placementId && DATA.huddle.placementCatalog[placementId]
      ? DATA.huddle.placementCatalog[placementId]
      : DATA.huddle.defaultCatalog[item.huddleExternalId];
    if (!huddle) notFound(`Huddle '${item.huddleExternalId}' was not found.`);
    return {
      week: item.week,
      recommendedHuddleExternalId: recommended?.topicExternalId ?? item.huddleExternalId,
      isCustomized: Boolean(recommended && (recommended.topicExternalId !== item.huddleExternalId || (item.placementExternalId && recommended.placementExternalId !== item.placementExternalId))),
      huddle: clone(huddle),
    };
  });
  return {
    roleExternalId,
    isCustomized: items.some((item) => item.isCustomized),
    rowVersion: saved?.rowVersion ?? null,
    items,
    upcomingWeeks: upcomingWeeksAfter(items),
  };
}

function workflowSummary(workflow: SavedWorkflow): SavedWorkflowSummary {
  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    roleExternalId: workflow.roleExternalId,
    roleName: workflow.roleName,
    roleAbbreviation: workflow.roleAbbreviation,
    activityCount: workflow.activities.length,
    totalDurationMinutes: workflow.totalDurationMinutes,
    isFavorite: workflow.isFavorite,
    createdAtUtc: workflow.createdAtUtc,
    updatedAtUtc: workflow.updatedAtUtc,
    rowVersion: workflow.rowVersion,
  };
}

function buildWorkflow(input: SaveWorkflowInput, current?: SavedWorkflow): SavedWorkflow {
  const role = DATA.reference.roles.find((candidate) => candidate.externalId === input.roleExternalId);
  if (!role) notFound(`Role '${input.roleExternalId}' was not found.`);
  const selected = input.activityExternalIds
    .map((externalId) => DATA.reference.activities.find((activity) => activity.externalId === externalId))
    .filter((activity): activity is Activity => Boolean(activity));
  const now = new Date().toISOString();
  return {
    id: current?.id ?? crypto.randomUUID(),
    name: input.name,
    description: input.description,
    ownerObjectId: LOCAL_USER.objectId,
    roleExternalId: role.externalId,
    roleName: role.name,
    roleAbbreviation: role.abbreviation,
    totalDurationMinutes: selected.reduce((sum, activity) => sum + activity.durationMinutes, 0),
    isFavorite: current?.isFavorite ?? false,
    createdAtUtc: current?.createdAtUtc ?? now,
    updatedAtUtc: current ? now : null,
    rowVersion: version(),
    activities: selected.map((activity) => ({
      id: activity.id,
      externalId: activity.externalId,
      title: activity.title,
      description: activity.description,
      workflowBucketExternalId: activity.workflowBucketExternalId,
      workflowBucketName: activity.workflowBucketName,
      category: activity.category,
      frequency: activity.frequency,
      priority: activity.priority,
      durationMinutes: activity.durationMinutes,
      sortOrder: activity.sortOrder,
    })),
  };
}

function sessionKey(externalId: string, placementExternalId: string | null): string {
  return `${externalId}::${placementExternalId ?? "default"}`;
}

function sessionActivities(externalId: string, placementExternalId: string | null) {
  const detail = placementExternalId
    ? DATA.huddle.placementDetails[placementExternalId]
    : DATA.huddle.defaultDetails[externalId];
  return detail?.phases.flatMap((phase) => phase.activities).map((activity) => activity.externalId) ?? [];
}

function createSession(externalId: string, placementExternalId: string | null): HuddleSessionResponse {
  const now = new Date().toISOString();
  const ids = sessionActivities(externalId, placementExternalId);
  return {
    huddleExternalId: externalId,
    currentPhaseExternalId: null,
    facilitatorNotes: null,
    startedAtUtc: now,
    lastSavedAtUtc: now,
    completedAtUtc: null,
    sessionStatus: "InProgress",
    rowVersion: version(),
    activities: ids.map((activityExternalId) => ({ activityExternalId, isCompleted: false, completedAtUtc: null })),
    removedActivityExternalIds: [],
    validActivityCount: ids.length,
    completedActivityCount: 0,
    canContinue: true,
  };
}

function saveSessions(sessions: StoredSessions): void {
  writeStorage(HUDDLE_SESSIONS_KEY, sessions);
}

function outlookDraftLink(subject: string, body: string): string {
  const query = new URLSearchParams({ subject, body });
  return `https://outlook.office.com/mail/deeplink/compose?${query.toString()}`;
}

async function localGet(path: string): Promise<unknown> {
  const { pathname, searchParams } = parsePath(path);
  if (pathname === "/api/health") return { status: "Healthy", source: "InAppData" };
  if (pathname === "/api/auth/me") return clone(LOCAL_USER);
  if (pathname === "/api/roles") return clone(DATA.reference.roles);
  if (pathname === "/api/ai-tools") return clone(DATA.reference.aiTools);
  if (pathname === "/api/workflow-buckets") return clone(DATA.reference.workflowBuckets);
  if (pathname === "/api/activities") return activitiesFromQuery(searchParams);
  if (pathname.startsWith("/api/activities/by-role/")) {
    const roleExternalId = decodeURIComponent(pathname.slice("/api/activities/by-role/".length));
    return clone(DATA.reference.activities.filter((activity) => activity.roleExternalId === roleExternalId));
  }
  if (/^\/api\/activities\/\d+$/.test(pathname)) {
    const id = Number(pathname.split("/").at(-1));
    const activity = DATA.reference.activities.find((candidate) => candidate.id === id);
    return activity ? clone(activity) : notFound(`Activity '${id}' was not found.`);
  }
  if (pathname === "/api/huddles") return huddleCatalog(searchParams);
  if (pathname === "/api/huddles/recommended-path") {
    const roleExternalId = searchParams.get("roleExternalId") ?? "";
    return recommendedPath(roleExternalId);
  }
  if (pathname === "/api/huddles/votes") {
    return Object.keys(DATA.huddle.defaultCatalog).map(voteResponse);
  }
  if (pathname === "/api/huddle-plans/me") {
    return planResponse(searchParams.get("roleExternalId") ?? "");
  }
  if (pathname === "/api/huddle-launch-plans/me") {
    return readStorage<HuddleLaunchPlanResponse | null>(HUDDLE_LAUNCH_PLAN_KEY, null);
  }
  if (pathname === "/api/huddle-sessions/me/incomplete") {
    const sessions = readStorage<StoredSessions>(HUDDLE_SESSIONS_KEY, {});
    const result: IncompleteHuddleSessionResponse[] = Object.values(sessions)
      .filter((session) => session.sessionStatus === "InProgress")
      .map((session) => {
        const detail = DATA.huddle.defaultDetails[session.huddleExternalId];
        return {
          huddleExternalId: session.huddleExternalId,
          huddleName: detail?.name ?? session.huddleExternalId,
          huddleDescription: detail?.description ?? null,
          huddleType: detail?.type ?? "Prescriptive",
          session,
        };
      });
    return clone(result);
  }
  if (pathname.startsWith("/api/huddle-coaching/coaches/") && pathname.endsWith("/availability")) {
    const coachExternalId = decodeURIComponent(pathname.split("/")[4]);
    return { coachExternalId, coachTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, slots: [] };
  }
  if (pathname === "/api/huddle-coaching/coaches") return [];
  if (pathname.startsWith("/api/huddles/") && pathname.endsWith("/session")) {
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const placementExternalId = searchParams.get("placementExternalId");
    const stored = readStorage<StoredSessions>(HUDDLE_SESSIONS_KEY, {});
    const session = stored[sessionKey(externalId, placementExternalId)];
    return session ? clone(session) : notFound("No saved Huddle session exists yet.");
  }
  if (pathname.startsWith("/api/huddles/")) {
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const placementExternalId = searchParams.get("placementExternalId");
    const detail = placementExternalId
      ? DATA.huddle.placementDetails[placementExternalId]
      : DATA.huddle.defaultDetails[externalId];
    return detail ? clone(detail) : notFound(`Huddle '${externalId}' was not found.`);
  }
  if (pathname === "/api/workflows") {
    const search = searchParams.get("search")?.trim().toLowerCase();
    const favorite = searchParams.get("isFavorite");
    let workflows = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []);
    if (search) workflows = workflows.filter((workflow) => `${workflow.name} ${workflow.description ?? ""}`.toLowerCase().includes(search));
    if (favorite !== null) workflows = workflows.filter((workflow) => workflow.isFavorite === (favorite === "true"));
    return workflows.map(workflowSummary);
  }
  if (pathname.startsWith("/api/workflows/")) {
    const id = decodeURIComponent(pathname.split("/")[3]);
    const workflow = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []).find((candidate) => candidate.id === id);
    return workflow ? clone(workflow) : notFound(`Workflow '${id}' was not found.`);
  }
  notFound(`Local endpoint '${pathname}' is not implemented.`);
}

async function localPost(path: string, body: unknown): Promise<unknown> {
  const { pathname } = parsePath(path);
  if (pathname === "/api/workflows") {
    const workflows = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []);
    const workflow = buildWorkflow(body as SaveWorkflowInput);
    workflows.unshift(workflow);
    writeStorage(WORKFLOWS_KEY, workflows);
    return clone(workflow);
  }
  if (pathname === "/api/workflows/calendar/events") {
    const request = body as {
      events?: Array<{
        requestId: string;
        subject: string;
        body: string;
        startUtc: string;
        endUtc: string;
      }>;
    };
    const events = request.events ?? [];
    let openedCount = 0;
    const eventIds: string[] = [];

    for (const event of events) {
      const params = new URLSearchParams({
        path: "/calendar/action/compose",
        rru: "addevent",
        subject: event.subject,
        body: event.body,
        startdt: event.startUtc,
        enddt: event.endUtc,
      });
      const webLink = `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
      const opened = window.open(webLink, "_blank", "noopener,noreferrer");
      if (opened) openedCount += 1;
      eventIds.push(event.requestId);
    }

    return { createdCount: openedCount, eventIds };
  }
  if (pathname === "/api/huddle-launch-plans/me/email-drafts") {
    const request = body as { subject: string; bodyText: string };
    return { messageId: crypto.randomUUID(), webLink: outlookDraftLink(request.subject, request.bodyText) };
  }
  if (pathname === "/api/huddle-coaching/bookings") {
    const request = body as { coachExternalId: string; startUtc: string; endUtc: string };
    return { eventId: crypto.randomUUID(), coachExternalId: request.coachExternalId, coachDisplayName: "Coach", startUtc: request.startUtc, endUtc: request.endUtc, joinUrl: null, webLink: null };
  }
  if (pathname.startsWith("/api/huddles/") && pathname.endsWith("/session/complete")) {
    const { searchParams } = parsePath(path);
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const placementExternalId = searchParams.get("placementExternalId");
    const sessions = readStorage<StoredSessions>(HUDDLE_SESSIONS_KEY, {});
    const key = sessionKey(externalId, placementExternalId);
    const session = sessions[key] ?? createSession(externalId, placementExternalId);
    const now = new Date().toISOString();
    const next = { ...session, completedAtUtc: now, lastSavedAtUtc: now, sessionStatus: "Completed" as const, rowVersion: version(), canContinue: false };
    sessions[key] = next;
    saveSessions(sessions);
    return clone(next);
  }
  notFound(`Local POST endpoint '${pathname}' is not implemented.`);
}

async function localPut(path: string, body: unknown): Promise<unknown> {
  const { pathname, searchParams } = parsePath(path);
  if (pathname === "/api/huddle-plans/me") {
    const request = body as { roleExternalId: string; items: StoredPlanItem[] };
    const plans = huddlePlans();
    plans[request.roleExternalId] = { roleExternalId: request.roleExternalId, rowVersion: version(), items: request.items };
    writeStorage(HUDDLE_PLANS_KEY, plans);
    return planResponse(request.roleExternalId);
  }
  if (pathname === "/api/huddle-launch-plans/me") {
    const request = body as SaveHuddleLaunchPlanRequest;
    const response: HuddleLaunchPlanResponse = { ...request, rowVersion: version() };
    writeStorage(HUDDLE_LAUNCH_PLAN_KEY, response);
    return clone(response);
  }
  if (pathname.startsWith("/api/huddles/") && pathname.endsWith("/vote")) {
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const request = body as SetHuddleVoteRequest;
    const votes = allVotes();
    votes[externalId] = { value: request.value, downvoteReasons: request.downvoteReasons, comment: request.comment };
    writeStorage(HUDDLE_VOTES_KEY, votes);
    return voteResponse(externalId);
  }
  if (pathname.startsWith("/api/huddles/") && pathname.includes("/session/activities/")) {
    const parts = pathname.split("/");
    const externalId = decodeURIComponent(parts[3]);
    const activityExternalId = decodeURIComponent(parts[6]);
    const placementExternalId = searchParams.get("placementExternalId");
    const request = body as { isCompleted: boolean };
    const sessions = readStorage<StoredSessions>(HUDDLE_SESSIONS_KEY, {});
    const key = sessionKey(externalId, placementExternalId);
    const session = sessions[key] ?? createSession(externalId, placementExternalId);
    const now = new Date().toISOString();
    session.activities = session.activities.map((activity) => activity.activityExternalId === activityExternalId
      ? { ...activity, isCompleted: request.isCompleted, completedAtUtc: request.isCompleted ? now : null }
      : activity);
    session.completedActivityCount = session.activities.filter((activity) => activity.isCompleted).length;
    session.lastSavedAtUtc = now;
    session.rowVersion = version();
    sessions[key] = session;
    saveSessions(sessions);
    return clone(session);
  }
  if (pathname.startsWith("/api/huddles/") && pathname.endsWith("/session")) {
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const placementExternalId = searchParams.get("placementExternalId");
    const request = body as { currentPhaseExternalId: string | null; facilitatorNotes: string | null };
    const sessions = readStorage<StoredSessions>(HUDDLE_SESSIONS_KEY, {});
    const key = sessionKey(externalId, placementExternalId);
    const session = sessions[key] ?? createSession(externalId, placementExternalId);
    session.currentPhaseExternalId = request.currentPhaseExternalId;
    session.facilitatorNotes = request.facilitatorNotes;
    session.lastSavedAtUtc = new Date().toISOString();
    session.rowVersion = version();
    sessions[key] = session;
    saveSessions(sessions);
    return clone(session);
  }
  if (pathname.startsWith("/api/workflows/")) {
    const id = decodeURIComponent(pathname.split("/")[3]);
    const workflows = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []);
    const index = workflows.findIndex((candidate) => candidate.id === id);
    if (index < 0) notFound(`Workflow '${id}' was not found.`);
    const workflow = buildWorkflow(body as SaveWorkflowInput, workflows[index]);
    workflows[index] = workflow;
    writeStorage(WORKFLOWS_KEY, workflows);
    return clone(workflow);
  }
  notFound(`Local PUT endpoint '${pathname}' is not implemented.`);
}

async function localPatch(path: string, body: unknown): Promise<unknown> {
  const { pathname } = parsePath(path);
  if (pathname.startsWith("/api/workflows/") && pathname.endsWith("/favorite")) {
    const id = decodeURIComponent(pathname.split("/")[3]);
    const request = body as { isFavorite: boolean };
    const workflows = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []);
    const workflow = workflows.find((candidate) => candidate.id === id);
    if (!workflow) notFound(`Workflow '${id}' was not found.`);
    workflow.isFavorite = request.isFavorite;
    workflow.updatedAtUtc = new Date().toISOString();
    workflow.rowVersion = version();
    writeStorage(WORKFLOWS_KEY, workflows);
    return workflowSummary(workflow);
  }
  notFound(`Local PATCH endpoint '${pathname}' is not implemented.`);
}

async function localDelete(path: string): Promise<void> {
  const { pathname } = parsePath(path);
  if (pathname === "/api/huddle-launch-plans/me") {
    writeStorage(HUDDLE_LAUNCH_PLAN_KEY, null);
    return;
  }
  if (pathname.startsWith("/api/huddle-plans/me/")) {
    const roleExternalId = decodeURIComponent(pathname.slice("/api/huddle-plans/me/".length));
    const plans = huddlePlans();
    delete plans[roleExternalId];
    writeStorage(HUDDLE_PLANS_KEY, plans);
    return;
  }
  if (pathname.startsWith("/api/huddles/") && pathname.endsWith("/vote")) {
    const externalId = decodeURIComponent(pathname.split("/")[3]);
    const votes = allVotes();
    delete votes[externalId];
    writeStorage(HUDDLE_VOTES_KEY, votes);
    return;
  }
  if (pathname.startsWith("/api/workflows/")) {
    const id = decodeURIComponent(pathname.split("/")[3]);
    const workflows = readStorage<LocalWorkflowRecord[]>(WORKFLOWS_KEY, []).filter((candidate) => candidate.id !== id);
    writeStorage(WORKFLOWS_KEY, workflows);
    return;
  }
  notFound(`Local DELETE endpoint '${pathname}' is not implemented.`);
}

export function createLocalApiClient(): ApiClient {
  return {
    get: async <TResponse>(path: string) => clone(await localGet(path) as TResponse),
    post: async <TResponse, TRequest>(path: string, body: TRequest) => clone(await localPost(path, body) as TResponse),
    put: async <TResponse, TRequest>(path: string, body: TRequest) => clone(await localPut(path, body) as TResponse),
    patch: async <TResponse, TRequest>(path: string, body: TRequest) => clone(await localPatch(path, body) as TResponse),
    delete: localDelete,
  };
}
