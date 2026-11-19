/**
 * What an edit changes:
 * - "agent": an AI tool. One tool is copied into every Huddle that uses it, so the edit shows everywhere.
 * - "placement": one week of one role's path (its title, description, outcome and objective differ per week).
 * - "topic": content shared by every week that uses the Huddle (its takeaways).
 * - "hubGuide": one week's Manager Hub guidance (stored once per placement).
 * - "hubGuideShared": a shared week's Manager Hub guidance (Week 1 and Week 9 carry the same text in
 *   every role's path), applied to all of those copies at once.
 * - "facilitatorGuide" / "facilitatorGuideShared": the same two scopes for the Facilitator Hub's guide.
 */
export type ContentEntityType = "agent" | "placement" | "topic" | "hubGuide" | "hubGuideShared" | "facilitatorGuide" | "facilitatorGuideShared";

export interface EditableField {
  key: string;
  label: string;
  multiline: boolean;
  /** Heading the field is listed under in the form, such as the Hub stage it appears in. */
  group?: string;
  /** Short note under the label, such as where else the text appears. */
  hint?: string;
}

/**
 * The AI tool (agent) fields a Manager can suggest edits to. Keys match HuddleAgentResponse; labels
 * match where the HTML export shows each one. The data names are counter-intuitive: `whatItIs` is
 * the short subtitle under the tool name ("Orchestrator"), and `shortDescription` is the long
 * "What it is" paragraph (see exportHuddleHtml's identitySubtitle and whatItIsDetail).
 */
export const EDITABLE_AGENT_FIELDS = [
  { key: "whatItIs", label: "Subtitle (shown under the tool name)", multiline: false },
  { key: "shortDescription", label: "What it is", multiline: true },
  { key: "whatItHelpsYouDo", label: "What it helps you do", multiline: true },
  { key: "whenToUseIt", label: "When to use it", multiline: true },
  { key: "accessLinkLabel", label: "Link label", multiline: false },
  { key: "accessUrl", label: "Link URL", multiline: false },
] as const satisfies readonly EditableField[];

/** Week content that differs per placement. Keys match HuddleDetailResponse. */
export const EDITABLE_WEEK_FIELDS = [
  { key: "roleTopicName", label: "Title", multiline: false },
  { key: "roleTopicDescription", label: "Description", multiline: true },
  { key: "desiredOutcome", label: "Outcome", multiline: true },
  { key: "todayObjective", label: "Today's objective", multiline: true },
] as const satisfies readonly EditableField[];

/** Huddle content shared by every week that uses the Huddle (the Takeaways tab). */
export const EDITABLE_TOPIC_FIELDS = [
  { key: "keyTakeaway", label: "Key takeaway", multiline: true },
  { key: "reflectionPrompt", label: "Reflection prompt", multiline: true },
  { key: "commitmentPrompt", label: "Commitment prompt", multiline: true },
] as const satisfies readonly EditableField[];

/**
 * What the Manager Hub shows, grouped by the Hub stage it appears in (see hubStageContent's
 * managerGuidance and the Manager Talk Track). The first four keys live on the placement's
 * managerGuide; the last two on its facilitatorGuide, which the Facilitator Hub also shows.
 */
export const EDITABLE_MANAGER_HUB_FIELDS = [
  { key: "managerTeamRelevance", label: "Why this matters for your team", multiline: true, group: "Before Huddle" },
  { key: "managerPreparationGuidance", label: "Manager preparation", multiline: true, group: "Before Huddle" },
  { key: "managerFacilitatorAlignment", label: "Manager and facilitator alignment", multiline: true, group: "Before Huddle", hint: "Also shown in the Facilitator Hub." },
  { key: "exampleScenario", label: "Example scenario", multiline: true, group: "Before Huddle", hint: "Also shown in the Facilitator Hub." },
  { key: "managerDuringHuddleGuidance", label: "Manager guidance during the Huddle", multiline: true, group: "During Huddle" },
  { key: "managerFollowThroughQuestions", label: "Follow-through questions", multiline: true, group: "After Huddle" },
] as const satisfies readonly EditableField[];

/** Manager Hub keys stored on the placement's managerGuide; the rest are on its facilitatorGuide. */
export const MANAGER_GUIDE_KEYS: ReadonlySet<string> = new Set([
  "managerTeamRelevance",
  "managerPreparationGuidance",
  "managerDuringHuddleGuidance",
  "managerFollowThroughQuestions",
]);

const LIST_HINT = "One item per line.";
const ALSO_MANAGER = "Also shown in the Manager Hub.";

/**
 * What the Facilitator Hub shows, grouped by the Hub stage it appears in (see hubStageContent's
 * facilitatorGuidance and the Facilitator Talk Track). All keys live on the placement's
 * facilitatorGuide; list fields are edited one item per line.
 */
export const EDITABLE_FACILITATOR_HUB_FIELDS = [
  { key: "roleWorkflowContext", label: "Role and workflow context", multiline: true, group: "Before Huddle" },
  { key: "facilitatorPreparation", label: "Facilitator preparation", multiline: true, group: "Before Huddle" },
  { key: "managerFacilitatorAlignment", label: "Manager and facilitator alignment", multiline: true, group: "Before Huddle", hint: ALSO_MANAGER },
  { key: "exampleScenario", label: "Example scenario", multiline: true, group: "Before Huddle", hint: ALSO_MANAGER },
  { key: "preparationChecklist", label: "Preparation checklist", multiline: true, group: "Before Huddle", hint: LIST_HINT },
  { key: "sessionIntroduction", label: "Session introduction", multiline: true, group: "During Huddle" },
  { key: "keyTalkingPoints", label: "Key talking points", multiline: true, group: "During Huddle", hint: LIST_HINT },
  { key: "discussionQuestions", label: "Discussion questions", multiline: true, group: "During Huddle", hint: LIST_HINT },
  { key: "facilitatorQuestions", label: "Facilitator questions", multiline: true, group: "During Huddle", hint: LIST_HINT },
  { key: "listenFor", label: "Listen for", multiline: true, group: "During Huddle", hint: LIST_HINT },
  { key: "suggestedTransitions", label: "Suggested transitions", multiline: true, group: "During Huddle", hint: LIST_HINT },
  { key: "facilitationWatchouts", label: "Facilitation watchouts", multiline: true, group: "During Huddle" },
  { key: "fallbackGuidance", label: "If access or inputs are unavailable", multiline: true, group: "During Huddle" },
  { key: "wrapUpGuidance", label: "Wrap up", multiline: true, group: "After Huddle" },
  { key: "reflectPrompt", label: "Reflect", multiline: true, group: "After Huddle" },
  { key: "commitPrompt", label: "Commit to action", multiline: true, group: "After Huddle" },
  { key: "bringBackEvidence", label: "Bring back next time", multiline: true, group: "After Huddle", hint: LIST_HINT },
] as const satisfies readonly EditableField[];

/** Facilitator guide fields that are lists. In edits they are stored as one item per line. */
export const FACILITATOR_LIST_KEYS: ReadonlySet<string> = new Set([
  "preparationChecklist",
  "keyTalkingPoints",
  "discussionQuestions",
  "facilitatorQuestions",
  "listenFor",
  "suggestedTransitions",
  "bringBackEvidence",
]);

export const EDITABLE_FIELDS_BY_TYPE: Record<ContentEntityType, readonly EditableField[]> = {
  agent: EDITABLE_AGENT_FIELDS,
  placement: EDITABLE_WEEK_FIELDS,
  topic: EDITABLE_TOPIC_FIELDS,
  hubGuide: EDITABLE_MANAGER_HUB_FIELDS,
  hubGuideShared: EDITABLE_MANAGER_HUB_FIELDS,
  facilitatorGuide: EDITABLE_FACILITATOR_HUB_FIELDS,
  facilitatorGuideShared: EDITABLE_FACILITATOR_HUB_FIELDS,
};

export type FieldValues = Record<string, string | null>;

export type ContentChangeStatus = "Pending" | "Confirmed";

/** One suggested edit to one item, kept as a version until an admin confirms it. */
export interface ContentChangeRequest {
  id: string;
  entityType: ContentEntityType;
  /** The AI tool, week placement or Huddle id. */
  entityExternalId: string;
  /** What the admin sees as the item's name: the tool name or the Huddle title. */
  entityName: string;
  /** The Huddle the edit was suggested from. */
  topicExternalId: string | null;
  topicName: string | null;
  /** Where a week edit applies, for example "Week 5 · Account Executive". */
  contextLabel: string | null;
  /** The confirmed version of the item when the edit was suggested (0 = original data). */
  baseVersion: number;
  before: FieldValues;
  proposed: FieldValues;
  status: ContentChangeStatus;
  submittedBy: string;
  submittedAtUtc: string;
  confirmedAtUtc: string | null;
  confirmedVersion: number | null;
}

export interface ApprovedEdit {
  version: number;
  fields: FieldValues;
  confirmedAtUtc: string;
  requestId: string;
}

/** Shape of src/data/approvedContentEdits.json. Sections other than agents may be absent. */
export interface ApprovedContentEdits {
  agents: Record<string, ApprovedEdit>;
  placements?: Record<string, ApprovedEdit>;
  topics?: Record<string, ApprovedEdit>;
  /** Manager Hub guidance for one week, keyed by placement. */
  hubGuides?: Record<string, ApprovedEdit>;
  /** Manager Hub guidance for a shared week, keyed by Huddle; applied to every role's copy. */
  hubGuidesShared?: Record<string, ApprovedEdit>;
  /** Facilitator Hub guide for one week, keyed by placement. */
  facilitatorGuides?: Record<string, ApprovedEdit>;
  /** Facilitator Hub guide for a shared week, keyed by Huddle; applied to every role's copy. */
  facilitatorGuidesShared?: Record<string, ApprovedEdit>;
}

export interface ContentEditsState {
  requests: ContentChangeRequest[];
  approved: ApprovedContentEdits;
}

export interface SubmitContentChangeInput {
  entityType: ContentEntityType;
  entityExternalId: string;
  entityName: string;
  topicExternalId: string | null;
  topicName: string | null;
  contextLabel: string | null;
  /** Manager, Facilitator or Team Member. */
  submittedBy: string;
  before: FieldValues;
  proposed: FieldValues;
}

export const ENTITY_TYPE_LABELS: Record<ContentEntityType, string> = {
  agent: "AI tool",
  placement: "This week",
  topic: "Shared Huddle content",
  hubGuide: "Manager Hub",
  hubGuideShared: "Manager Hub (shared week)",
  facilitatorGuide: "Facilitator Hub",
  facilitatorGuideShared: "Facilitator Hub (shared week)",
};
