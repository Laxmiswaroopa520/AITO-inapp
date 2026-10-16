import type {
  HuddleAgentResponse,
  HuddleCatalogItemResponse,
  HuddleDetailResponse,
} from "@/features/huddle/types";

/**
 * Tool (AI agent) mapping rules for the standalone Huddle data.
 *
 * These mirror the main application's behavior (HuddleMappings.ToCatalogItem / ToDetail,
 * HuddlePlacementActivityAgents, HuddlePlacementLookup and GetHuddleCatalogQueryHandler):
 *
 *  - A placement's Primary tools are the distinct Primary-tagged tools of that placement's own
 *    activities (Activity_Agents). An empty result is legitimate and never falls back to the topic.
 *  - A placement's Secondary tools are always the topic's own Secondary tools (Topic_Agents).
 *  - A Primary tool is not removed from the Secondary list (and vice versa): the two lists are
 *    built independently, so a tool may legitimately appear in both.
 *  - A topic with no placement named resolves one default placement (role path first, then
 *    orientation, then additional content; then sequence; then placement id) and is mapped exactly
 *    like that placement.
 *  - The AI Tool filter matches a topic when the topic's own mapping or any activity of the topic
 *    (on any placement) uses the tool.
 *
 * The JSON keeps only the topic-level lists on `defaultCatalog` / `defaultDetails`, so those are the
 * source of the topic-level Secondary tools. Everything is computed once at load time from the
 * bundled data; the data itself is never modified.
 */

interface PathEntry {
  week: number;
  placementExternalId: string;
  topicExternalId: string;
}

export interface HuddleToolMappingInput {
  defaultCatalog: Record<string, HuddleCatalogItemResponse>;
  placementCatalog: Record<string, HuddleCatalogItemResponse>;
  defaultDetails: Record<string, HuddleDetailResponse>;
  placementDetails: Record<string, HuddleDetailResponse>;
  weeklyPaths: Record<string, PathEntry[]>;
  additionalPaths: Record<string, PathEntry[]>;
}

export interface HuddleToolIndex {
  /** Topic id -> tools in the topic's own mapping, any usage (Topic_Agents). */
  topicAgentIds: Map<string, Set<string>>;
  /** Topic id -> tools used by any activity of any placement of the topic (Activity_Agents). */
  topicActivityAgentIds: Map<string, Set<string>>;
  /** Topic id -> the placement that a request without a placement id resolves to. */
  defaultPlacementByTopic: Map<string, string>;
}

type MappingMode = "card" | "detail";

const SECTION_ROLE_PATH = 0;
const SECTION_ORIENTATION = 1;
const SECTION_ADDITIONAL = 2;

function byDisplayOrder(left: HuddleAgentResponse, right: HuddleAgentResponse): number {
  return (left.displayOrder ?? 0) - (right.displayOrder ?? 0);
}

/**
 * The distinct Primary-tagged tools across a placement's own activities, one entry per tool (the
 * first tagged row wins).
 *
 *  - detail: phase, then activity, then tool display order (HuddleMappings.PrimaryActivityAgents).
 *  - card: activity display order, then tool display order (HuddlePlacementActivityAgents).
 */
export function primaryToolsFromActivities(
  detail: HuddleDetailResponse | undefined,
  mode: MappingMode,
): HuddleAgentResponse[] {
  if (!detail) return [];
  const rows: Array<{ agent: HuddleAgentResponse; activityOrder: number; sequence: number }> = [];
  let sequence = 0;
  [...detail.phases]
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))
    .forEach((phase) => {
      [...phase.activities]
        .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))
        .forEach((activity) => {
          [...activity.agents].sort(byDisplayOrder).forEach((agent) => {
            if (agent.usageType === "Primary") rows.push({ agent, activityOrder: activity.displayOrder ?? 0, sequence: sequence++ });
          });
        });
    });
  if (mode === "card") {
    rows.sort((left, right) =>
      left.activityOrder - right.activityOrder
      || byDisplayOrder(left.agent, right.agent)
      || left.sequence - right.sequence);
  }
  const seen = new Set<string>();
  const result: HuddleAgentResponse[] = [];
  rows.forEach(({ agent }) => {
    if (seen.has(agent.externalId)) return;
    seen.add(agent.externalId);
    result.push({ ...agent });
  });
  return result;
}

/** The topic's own Secondary tools in topic display order (HuddleMappings, TopicAgents). */
function topicSecondaryTools(source: HuddleAgentResponse[] | undefined): HuddleAgentResponse[] {
  return [...(source ?? [])].sort(byDisplayOrder).map((agent) => ({ ...agent }));
}

/**
 * Placement ordering used to resolve a topic's default placement: role path first, then
 * orientation (week 1 of every role path), then additional content, then sequence, then id.
 */
function placementOrdering(input: HuddleToolMappingInput): Map<string, { section: number; sequence: number }> {
  const ordering = new Map<string, { section: number; sequence: number }>();
  const note = (placementId: string, section: number, sequence: number) => {
    const current = ordering.get(placementId);
    if (!current || section < current.section || (section === current.section && sequence < current.sequence)) {
      ordering.set(placementId, { section, sequence });
    }
  };
  Object.values(input.weeklyPaths).forEach((entries) => entries.forEach((entry) =>
    note(entry.placementExternalId, entry.week === 1 ? SECTION_ORIENTATION : SECTION_ROLE_PATH, entry.week)));
  Object.values(input.additionalPaths).forEach((entries) => entries.forEach((entry, index) =>
    note(entry.placementExternalId, SECTION_ADDITIONAL, entry.week || index + 1)));
  return ordering;
}

function resolveDefaultPlacements(input: HuddleToolMappingInput): Map<string, string> {
  const ordering = placementOrdering(input);
  const candidates = new Map<string, string[]>();
  Object.entries(input.placementCatalog).forEach(([placementId, item]) => {
    candidates.set(item.externalId, [...(candidates.get(item.externalId) ?? []), placementId]);
  });
  const resolved = new Map<string, string>();
  candidates.forEach((placementIds, topicId) => {
    const rank = (placementId: string) => ordering.get(placementId) ?? { section: SECTION_ADDITIONAL + 1, sequence: Number.MAX_SAFE_INTEGER };
    const [first] = [...placementIds].sort((left, right) =>
      rank(left).section - rank(right).section
      || rank(left).sequence - rank(right).sequence
      || (left < right ? -1 : left > right ? 1 : 0));
    if (first) resolved.set(topicId, first);
  });
  return resolved;
}

/**
 * Returns a copy of the Huddle data whose tool lists follow the rules above, plus the lookups the
 * AI Tool filter needs. The input is not modified.
 */
export function applyHuddleToolMapping<T extends HuddleToolMappingInput>(input: T): { huddle: T; index: HuddleToolIndex } {
  const topicAgentIds = new Map<string, Set<string>>();
  const topicActivityAgentIds = new Map<string, Set<string>>();
  const addIds = (target: Map<string, Set<string>>, topicId: string, agents: Iterable<HuddleAgentResponse>) => {
    const ids = target.get(topicId) ?? new Set<string>();
    for (const agent of agents) ids.add(agent.externalId);
    target.set(topicId, ids);
  };

  // Topic-level mapping, captured before the default records' tool lists are replaced below.
  Object.entries(input.defaultCatalog).forEach(([topicId, item]) => addIds(topicAgentIds, topicId, [...item.primaryAgents, ...item.secondaryAgents]));
  Object.entries(input.defaultDetails).forEach(([topicId, detail]) => addIds(topicAgentIds, topicId, [...detail.primaryAgents, ...detail.secondaryAgents]));
  Object.values(input.placementDetails).forEach((detail) => {
    addIds(topicActivityAgentIds, detail.externalId, detail.phases.flatMap((phase) => phase.activities.flatMap((activity) => activity.agents)));
  });

  const topicSecondaryCard = (topicId: string) => topicSecondaryTools(input.defaultCatalog[topicId]?.secondaryAgents);
  const topicSecondaryDetail = (topicId: string) => topicSecondaryTools(input.defaultDetails[topicId]?.secondaryAgents);

  const placementCatalog: Record<string, HuddleCatalogItemResponse> = {};
  Object.entries(input.placementCatalog).forEach(([placementId, item]) => {
    placementCatalog[placementId] = {
      ...item,
      primaryAgents: primaryToolsFromActivities(input.placementDetails[placementId], "card"),
      secondaryAgents: topicSecondaryCard(item.externalId),
    };
  });
  const placementDetails: Record<string, HuddleDetailResponse> = {};
  Object.entries(input.placementDetails).forEach(([placementId, detail]) => {
    placementDetails[placementId] = {
      ...detail,
      primaryAgents: primaryToolsFromActivities(detail, "detail"),
      secondaryAgents: topicSecondaryDetail(detail.externalId),
    };
  });

  // A topic requested without a placement is mapped like its resolved default placement. A topic
  // that has no placement at all keeps its topic-level lists (pre-placement content).
  const defaultPlacementByTopic = resolveDefaultPlacements(input);
  const defaultCatalog: Record<string, HuddleCatalogItemResponse> = {};
  Object.entries(input.defaultCatalog).forEach(([topicId, item]) => {
    const placementId = defaultPlacementByTopic.get(topicId);
    defaultCatalog[topicId] = placementId && input.placementDetails[placementId]
      ? { ...item, primaryAgents: placementCatalog[placementId]?.primaryAgents ?? [], secondaryAgents: topicSecondaryCard(topicId) }
      : item;
  });
  const defaultDetails: Record<string, HuddleDetailResponse> = {};
  Object.entries(input.defaultDetails).forEach(([topicId, detail]) => {
    const placementId = defaultPlacementByTopic.get(topicId);
    defaultDetails[topicId] = placementId && input.placementDetails[placementId]
      ? { ...detail, primaryAgents: placementDetails[placementId]?.primaryAgents ?? [], secondaryAgents: topicSecondaryDetail(topicId) }
      : detail;
  });

  return {
    huddle: { ...input, defaultCatalog, placementCatalog, defaultDetails, placementDetails },
    index: { topicAgentIds, topicActivityAgentIds, defaultPlacementByTopic },
  };
}
