import type { ApprovedContentEdits } from "@/features/admin/types/contentEdits.types";
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
}
