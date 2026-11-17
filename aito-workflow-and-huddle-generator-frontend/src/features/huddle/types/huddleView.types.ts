export interface HuddleCatalogCardViewModel {
  id: string;
  /** The placement this card opens, or null for a topic-scoped card. */
  placementExternalId: string | null;
  /**
   * Identifies the card itself: the placement when there is one, otherwise the topic. Two cards for
   * the same topic (a Role Path and an Additional placement) have different keys.
   */
  cardKey: string;
  /** Placement-scoped catalog only: the role the placement belongs to. */
  placementRoleExternalId: string | null;
  /** Placement-scoped catalog only: "Role Path · Week 3 · AE" style label; null otherwise. */
  placementLabel: string | null;
  title: string;
  description: string | null;
  category: string;
  focusArea: string | null;
  /** Pre-formatted `MCEM Stage: Name (n)` label, or null when the topic has no stages. */
  mcemStageLabel: string | null;
  activityCount: number;
  /** Featured count for the placement, or null when the card is topic-scoped. */
  featuredActivityCount: number | null;
  /** Role-facing title for the placement this card opens, when it has one. */
  roleTopicName: string | null;
  /** Role-facing description for that placement. */
  roleTopicDescription: string | null;
  extendedActivityCount: number | null;
  durationMinutes: number | null;
  desiredOutcome: string | null;
  audienceDescription: string | null;
  audienceLabel: string;
  primaryAgentNames: string[];
  secondaryAgentNames: string[];
  primaryAccessUrl: string | null;
  primaryAccessLabel: string | null;
}

export interface RecommendedHuddleWeekViewModel {
  week: number;
  pathOrder: number;
  huddle: HuddleCatalogCardViewModel;
}
