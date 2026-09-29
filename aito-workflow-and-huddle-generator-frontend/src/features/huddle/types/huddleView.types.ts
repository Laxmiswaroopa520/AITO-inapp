export interface HuddleCatalogCardViewModel {
  id: string;
  /** The specific placement this card renders, when it is placement-scoped (see mapHuddleCatalogItemToCard).
   *  Null for a genuinely unscoped card. Distinguishes cards that share the same topic id
   *  (`id`) but represent different role placements of that topic. */
  placementExternalId: string | null;
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
