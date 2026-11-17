/**
 * What an edit changes:
 * - "agent": an AI tool. One tool is copied into every Huddle that uses it, so the edit shows everywhere.
 * - "placement": one week of one role's path (its title, description, outcome and objective differ per week).
 * - "topic": content shared by every week that uses the Huddle (its takeaways).
 */
export type ContentEntityType = "agent" | "placement" | "topic";

export interface EditableField {
  key: string;
  label: string;
  multiline: boolean;
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

export const EDITABLE_FIELDS_BY_TYPE: Record<ContentEntityType, readonly EditableField[]> = {
  agent: EDITABLE_AGENT_FIELDS,
  placement: EDITABLE_WEEK_FIELDS,
  topic: EDITABLE_TOPIC_FIELDS,
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
  before: FieldValues;
  proposed: FieldValues;
}

export const ENTITY_TYPE_LABELS: Record<ContentEntityType, string> = {
  agent: "AI tool",
  placement: "This week",
  topic: "Shared Huddle content",
};
