import {
  EDITABLE_FACILITATOR_HUB_FIELDS,
  FACILITATOR_LIST_KEYS,
  MANAGER_GUIDE_KEYS,
  type ApprovedContentEdits,
  type ApprovedEdit,
  type FieldValues,
} from "@/features/admin/types/contentEdits.types";
import type { HuddleAgentResponse } from "@/features/huddle/types";

const AGENT_LISTS = ["primaryAgents", "secondaryAgents", "unclassifiedAgents"] as const;

type Item = Record<string, unknown>;
type Collection = Record<string, Item>;

/**
 * Applies admin-confirmed edits (src/data/approvedContentEdits.json) to the embedded Huddle data, in
 * place. Runs once when the data module loads; confirming an edit triggers a full page reload, so the
 * data is always rebuilt from static-api-data.json plus the latest confirmed edits.
 *
 * - AI tool edits: a tool is copied into every topic and activity that uses it, so each copy is
 *   patched and the edit shows everywhere the tool appears.
 * - Week edits: patch one placement's detail and its card (the Role Path and All Topics cards read
 *   placementCatalog), so only that week of that role's path changes.
 * - Shared Huddle edits: patch every placement of the topic and its topic-level detail.
 */
export function applyApprovedContentEdits(huddle: Item, edits: ApprovedContentEdits): void {
  const agents = edits.agents ?? {};
  const placements = edits.placements ?? {};
  const topics = edits.topics ?? {};
  const collection = (name: string) => (huddle[name] && typeof huddle[name] === "object" ? huddle[name] as Collection : {});

  if (Object.keys(agents).length > 0) {
    const patch = (list: unknown) => {
      if (!Array.isArray(list)) return;
      for (const agent of list as HuddleAgentResponse[]) {
        const edit = agents[agent.externalId];
        if (edit) Object.assign(agent, edit.fields);
      }
    };
    for (const name of ["defaultCatalog", "placementCatalog", "defaultDetails", "placementDetails"]) {
      for (const item of Object.values(collection(name))) {
        AGENT_LISTS.forEach((list) => patch(item[list]));
        const phases = item.phases;
        if (!Array.isArray(phases)) continue;
        for (const phase of phases as Array<{ activities?: Array<{ agents?: unknown }> }>) {
          phase.activities?.forEach((activity) => patch(activity.agents));
        }
      }
    }
  }

  for (const [placementId, edit] of Object.entries(placements)) {
    const detail = collection("placementDetails")[placementId];
    if (detail) Object.assign(detail, edit.fields);
    // The card carries only some of these fields (title, description, outcome); copy just those.
    const card = collection("placementCatalog")[placementId];
    if (card) for (const [key, value] of Object.entries(edit.fields)) if (key in card) card[key] = value;
  }

  if (Object.keys(topics).length > 0) {
    for (const name of ["placementDetails", "defaultDetails"]) {
      for (const item of Object.values(collection(name))) {
        const edit = topics[item.externalId as string];
        if (edit) Object.assign(item, edit.fields);
      }
    }
  }

  // Manager Hub and Facilitator Hub guidance. A shared week's edit is keyed by Huddle and patches every
  // role's copy (and the topic-level detail); a normal week's edit is keyed by placement and patches
  // only that week. Both Hubs show "Manager and facilitator alignment" and "Example scenario", so the
  // edits are applied in the order they were confirmed: the most recently confirmed text wins.
  type HubEdit = { key: string; shared: boolean; edit: ApprovedEdit; apply: (detail: Item, fields: FieldValues) => void };
  const hubEdits: HubEdit[] = [
    ...Object.entries(edits.hubGuidesShared ?? {}).map(([key, edit]) => ({ key, shared: true, edit, apply: applyHubGuide })),
    ...Object.entries(edits.hubGuides ?? {}).map(([key, edit]) => ({ key, shared: false, edit, apply: applyHubGuide })),
    ...Object.entries(edits.facilitatorGuidesShared ?? {}).map(([key, edit]) => ({ key, shared: true, edit, apply: applyFacilitatorGuide })),
    ...Object.entries(edits.facilitatorGuides ?? {}).map(([key, edit]) => ({ key, shared: false, edit, apply: applyFacilitatorGuide })),
  ].sort((left, right) => left.edit.confirmedAtUtc.localeCompare(right.edit.confirmedAtUtc));
  for (const { key, shared, edit, apply } of hubEdits) {
    if (shared) {
      for (const name of ["placementDetails", "defaultDetails"]) {
        for (const item of Object.values(collection(name))) if (item.externalId === key) apply(item, edit.fields);
      }
    } else {
      const detail = collection("placementDetails")[key];
      if (detail) apply(detail, edit.fields);
    }
  }
}

/** Writes Facilitator Hub fields onto the placement's facilitatorGuide; list fields arrive one item per line. */
function applyFacilitatorGuide(detail: Item, fields: FieldValues): void {
  const guide = detail.facilitatorGuide;
  if (!guide || typeof guide !== "object") return; // the Facilitator Hub needs its full shape; never invent one
  for (const [key, value] of Object.entries(fields)) {
    (guide as Item)[key] = FACILITATOR_LIST_KEYS.has(key)
      ? (value ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
      : value;
  }
}

/** Writes Manager Hub fields to where the Hub reads them: managerGuide, or facilitatorGuide for the two shared fields. */
function applyHubGuide(detail: Item, fields: FieldValues): void {
  for (const [key, value] of Object.entries(fields)) {
    const target = MANAGER_GUIDE_KEYS.has(key) ? "managerGuide" : "facilitatorGuide";
    // A placement with no guide object yet gets one, so guidance can be added where there was none.
    if (!detail[target] || typeof detail[target] !== "object") {
      if (target === "facilitatorGuide") continue; // the Facilitator Hub needs its full shape; never invent one
      detail[target] = { managerTeamRelevance: null, managerPreparationGuidance: null, managerDuringHuddleGuidance: null, managerFollowThroughQuestions: null };
    }
    (detail[target] as Item)[key] = value;
  }
}

/**
 * Marks Huddles whose Manager Hub guidance is the same text in every role's copy, such as the shared
 * Week 1 Orientation and Week 9 Transition (one text copied into 32 role paths). Sets
 * sharedHubGuideRoleCount on each copy and the topic-level detail so the edit form can apply an edit
 * to all of them. Runs on the original data, before any confirmed edits are applied.
 */
export function markSharedHubGuides(huddle: Item): void {
  const details = (huddle.placementDetails && typeof huddle.placementDetails === "object" ? huddle.placementDetails : {}) as Collection;
  const byTopic = new Map<string, Item[]>();
  for (const detail of Object.values(details)) {
    const topicId = detail.externalId as string;
    byTopic.set(topicId, [...(byTopic.get(topicId) ?? []), detail]);
  }
  const defaults = (huddle.defaultDetails && typeof huddle.defaultDetails === "object" ? huddle.defaultDetails : {}) as Collection;
  for (const [topicId, copies] of byTopic) {
    if (copies.length < 2) continue;
    const signature = (detail: Item) => JSON.stringify([detail.managerGuide ?? null, (detail.facilitatorGuide as Item | null)?.managerFacilitatorAlignment ?? null]);
    const first = signature(copies[0]);
    const guide = copies[0].managerGuide as Record<string, unknown> | null;
    const hasContent = Boolean(guide && [...MANAGER_GUIDE_KEYS].some((key) => typeof guide[key] === "string" && (guide[key] as string).trim()));
    if (!hasContent || !copies.every((detail) => signature(detail) === first)) continue;
    for (const detail of copies) detail.sharedHubGuideRoleCount = copies.length;
    if (defaults[topicId]) defaults[topicId].sharedHubGuideRoleCount = copies.length;
  }

  // The Facilitator Hub's guide, by the same rule: every role's copy has the same text in every field.
  // On today's data that is again only the shared Week 1 and Week 9.
  const facilitatorKeys = EDITABLE_FACILITATOR_HUB_FIELDS.map(({ key }) => key);
  for (const [topicId, copies] of byTopic) {
    if (copies.length < 2) continue;
    const signature = (detail: Item) => {
      const guide = detail.facilitatorGuide as Item | null | undefined;
      return JSON.stringify(facilitatorKeys.map((key) => guide?.[key] ?? null));
    };
    const first = signature(copies[0]);
    const guide = copies[0].facilitatorGuide as Item | null | undefined;
    const hasContent = Boolean(guide && facilitatorKeys.some((key) => {
      const value = guide[key];
      return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
    }));
    if (!hasContent || !copies.every((detail) => signature(detail) === first)) continue;
    for (const detail of copies) detail.sharedFacilitatorGuideRoleCount = copies.length;
    if (defaults[topicId]) defaults[topicId].sharedFacilitatorGuideRoleCount = copies.length;
  }
}
