import type { HuddlePresentationFacilitatorGuide, HuddlePresentationManagerGuide } from "../../types";
import type { HuddleHubKind } from "../talk-track";

/**
 * The three Huddle Flow stages a hub shows. Each one replaces one of the placement's three phases:
 * the API still names the phases Preparation, Explore and Practice, and Commit to Action, and the
 * session keeps saving the phase's own id, so only the label and the guidance shown change.
 */
export type HubStage = "before" | "during" | "after";

export const HUB_STAGE_LABELS: Readonly<Record<HubStage, string>> = {
  before: "Before Huddle",
  during: "During Huddle",
  after: "After Huddle",
};

const STAGE_BY_PHASE_NAME = new Map<string, HubStage>([
  ["Preparation", "before"],
  ["Explore and Practice", "during"],
  ["Commit to Action", "after"],
]);

export function hubStageForPhase(phaseName: string): HubStage | null {
  return STAGE_BY_PHASE_NAME.get(phaseName) ?? null;
}

/** The hub label for a phase. A phase outside the three known names keeps its own name. */
export function hubStageLabel(phaseName: string): string {
  switch (hubStageForPhase(phaseName)) {
    case "before": return HUB_STAGE_LABELS.before;
    case "during": return HUB_STAGE_LABELS.during;
    case "after": return HUB_STAGE_LABELS.after;
    default: return phaseName;
  }
}

export type HubGuidanceTone = "neutral" | "green" | "blue";

/** One guidance card: a paragraph (line breaks kept) or a list. */
export interface HubGuidanceItem {
  title: string;
  text?: string;
  items?: readonly string[];
  /** Set for the closing prompts, which keep the colored card style the Commit to Action phase used. */
  tone?: HubGuidanceTone;
}

/**
 * The guidance for one stage. `lead` is shown at the top of the stage; `follow` is shown after the
 * stage's activities (only During Huddle has activities). Both are empty when the hub has no
 * guidance for the stage, so the page can say so instead of showing empty cards.
 */
export interface HubStageGuidance {
  lead: readonly HubGuidanceItem[];
  follow: readonly HubGuidanceItem[];
}

function text(title: string, value: string | null | undefined, tone?: HubGuidanceTone): HubGuidanceItem | null {
  const trimmed = value?.trim();
  return trimmed ? { title, text: trimmed, tone } : null;
}

function list(title: string, values: readonly string[] | undefined, tone?: HubGuidanceTone): HubGuidanceItem | null {
  const items = (values ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
  return items.length > 0 ? { title, items, tone } : null;
}

function present(items: readonly (HubGuidanceItem | null)[]): HubGuidanceItem[] {
  return items.filter((item): item is HubGuidanceItem => item !== null);
}

/**
 * Facilitator Hub: the placement's facilitator guide only (workbook sheets Preparation and
 * Facilitator_Hub). Each field is placed by when the facilitator uses it, not by its sheet:
 * preparation and context before the session, the opening script and live facilitation cues during
 * it, and the closing prompts after the practice.
 */
function facilitatorGuidance(stage: HubStage, guide: HuddlePresentationFacilitatorGuide | null): HubStageGuidance {
  if (!guide) return { lead: [], follow: [] };
  switch (stage) {
    case "before":
      return {
        lead: present([
          text("Role and workflow context", guide.roleWorkflowContext),
          text("Facilitator preparation", guide.facilitatorPreparation),
          text("Manager and facilitator alignment", guide.managerFacilitatorAlignment),
          text("Example scenario", guide.exampleScenario),
          list("Preparation checklist", guide.preparationChecklist),
        ]),
        follow: [],
      };
    case "during":
      return {
        lead: present([
          text("Session introduction", guide.sessionIntroduction),
          list("Key talking points", guide.keyTalkingPoints),
          list("Discussion questions", guide.discussionQuestions),
        ]),
        follow: present([
          list("Facilitator questions", guide.facilitatorQuestions),
          list("Listen for", guide.listenFor),
          list("Suggested transitions", guide.suggestedTransitions),
          text("Facilitation watchouts", guide.facilitationWatchouts),
          text("If access or inputs are unavailable", guide.fallbackGuidance),
        ]),
      };
    case "after":
      return {
        lead: present([
          text("Wrap Up", guide.wrapUpGuidance, "neutral"),
          text("Reflect", guide.reflectPrompt, "green"),
          text("Commit to Action", guide.commitPrompt, "blue"),
          list("Bring Back Next Time", guide.bringBackEvidence, "green"),
        ]),
        follow: [],
      };
  }
}

/**
 * Manager Hub: the placement's manager guide (workbook sheet Manager_Hub), plus the one field
 * written for both roles, Manager and facilitator alignment. No other facilitator field is shown.
 */
function managerGuidance(stage: HubStage, managerGuide: HuddlePresentationManagerGuide | null, guide: HuddlePresentationFacilitatorGuide | null): HubStageGuidance {
  // A placement with no Manager_Hub content shows none, even if the shared alignment field is set.
  const hasManagerContent = Boolean(managerGuide && [managerGuide.managerTeamRelevance, managerGuide.managerPreparationGuidance,
    managerGuide.managerDuringHuddleGuidance, managerGuide.managerFollowThroughQuestions].some((value) => value?.trim()));
  if (!managerGuide || !hasManagerContent) return { lead: [], follow: [] };
  switch (stage) {
    case "before":
      return {
        lead: present([
          text("Why this matters for your team", managerGuide.managerTeamRelevance),
          text("Manager preparation", managerGuide.managerPreparationGuidance),
          text("Manager and facilitator alignment", guide?.managerFacilitatorAlignment),
        ]),
        follow: [],
      };
    case "during":
      return { lead: present([text("Manager guidance during the Huddle", managerGuide.managerDuringHuddleGuidance)]), follow: [] };
    case "after":
      return { lead: present([text("Follow-through questions", managerGuide.managerFollowThroughQuestions)]), follow: [] };
  }
}

/** The guidance one hub shows for one stage. Topic and activity descriptions are never used here. */
export function hubStageGuidance(
  hub: HuddleHubKind,
  stage: HubStage,
  guide: HuddlePresentationFacilitatorGuide | null,
  managerGuide: HuddlePresentationManagerGuide | null,
): HubStageGuidance {
  return hub === "manager" ? managerGuidance(stage, managerGuide, guide) : facilitatorGuidance(stage, guide);
}

/** True when the hub has guidance for at least one stage of this placement. */
export function hubHasGuidance(
  hub: HuddleHubKind,
  guide: HuddlePresentationFacilitatorGuide | null,
  managerGuide: HuddlePresentationManagerGuide | null,
): boolean {
  return (["before", "during", "after"] as const).some((stage) => {
    const guidance = hubStageGuidance(hub, stage, guide, managerGuide);
    return guidance.lead.length > 0 || guidance.follow.length > 0;
  });
}

/**
 * Shown in place of the cards when a stage has no guidance for the hub. When the hub has no
 * guidance for any stage, the message says so, because the content source has none for this
 * role's version of the Huddle; it is not a stage that failed to render.
 */
export function hubGuidanceUnavailableMessage(hub: HuddleHubKind, hubHasAnyGuidance = false): string {
  const name = hub === "manager" ? "Manager Hub" : "Facilitator Hub";
  return hubHasAnyGuidance
    ? `No ${name} guidance is authored for this stage of the Huddle.`
    : `No ${name} guidance has been authored for this role's version of the Huddle yet.`;
}
