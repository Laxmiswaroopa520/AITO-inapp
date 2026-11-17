import type { HuddleSessionResponse, IncompleteHuddleSessionResponse } from "../../types";

export interface HuddleSessionProgressSummary {
  completedActivityIds: ReadonlySet<string>;
  completedCount: number;
  totalCount: number;
  percentage: number;
  canComplete: boolean;
  /** True when the Huddle has no Featured activities to tick off (the shared Week 1 orientation). */
  completesAtSessionLevel: boolean;
}

export function createHuddleSessionProgressSummary(
  session: HuddleSessionResponse | null | undefined,
  catalogActivityCount: number,
): HuddleSessionProgressSummary {
  const completedActivityIds = new Set(
    (session?.activities ?? [])
      .filter((activity) => activity.isCompleted && !session?.removedActivityExternalIds.includes(activity.activityExternalId))
      .map((activity) => activity.activityExternalId),
  );
  const totalCount = session?.validActivityCount ?? catalogActivityCount;
  const completedCount = session?.completedActivityCount ?? 0;
  const completesAtSessionLevel = totalCount === 0;
  const isCompleted = session?.sessionStatus === "Completed";
  const percentage = totalCount > 0
    ? Math.round((completedCount / totalCount) * 100)
    : isCompleted ? 100 : 0;

  return {
    completedActivityIds,
    completedCount,
    totalCount,
    percentage,
    // With Featured activities, every one must be ticked off. With none, the session itself is
    // completed; when no session exists yet, completing creates it first (see HuddlePage).
    canComplete: completesAtSessionLevel
      ? !isCompleted
      : Boolean(session && session.sessionStatus === "InProgress" && completedCount === totalCount),
    completesAtSessionLevel,
  };
}

export function isContinueLearningAvailable(
  item: IncompleteHuddleSessionResponse | undefined,
): item is IncompleteHuddleSessionResponse {
  return Boolean(
    item
    && item.session.sessionStatus === "InProgress"
    && item.session.canContinue
    && item.session.validActivityCount > item.session.completedActivityCount,
  );
}
