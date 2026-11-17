import type { Activity } from "../types/activity.types";
import { TIMELINE_OPTIONS, type TimelineView } from "../types/timeline.types";

const VISIBLE_TIMELINES: Record<string, readonly TimelineView[]> = {
  daily: ["day", "week", "month", "quarter", "year"],
  weekly: ["week", "month", "quarter", "year"],
  monthly: ["month", "quarter", "year"],
  quarterly: ["quarter", "year"],
};

export function filterActivitiesByTimeline(
  activities: readonly Activity[],
  timeline: TimelineView,
): Activity[] {
  return activities.filter(activity =>
    (VISIBLE_TIMELINES[activity.frequency.trim().toLowerCase()] ?? ["year"]).includes(timeline),
  );
}

/** Number of activities each timeline view shows. Views are cumulative: Week also shows Daily work. */
export function countActivitiesByTimeline(
  activities: readonly Activity[],
): Record<TimelineView, number> {
  return Object.fromEntries(
    TIMELINE_OPTIONS.map(option => [option.value, filterActivitiesByTimeline(activities, option.value).length]),
  ) as Record<TimelineView, number>;
}

/**
 * The narrowest view that shows every activity (Day when all are Daily, Quarter when the least
 * frequent is Quarterly, and so on), so the first view never hides selected activities.
 */
export function defaultTimelineFor(
  activities: readonly Activity[],
): TimelineView {
  const counts = countActivitiesByTimeline(activities);
  return TIMELINE_OPTIONS.find(option => counts[option.value] === activities.length)?.value ?? "year";
}

/** The view an activity first appears in, from its frequency: Daily → Day, Weekly → Week, and so on. */
export function homeTimelineFor(
  activity: Activity,
): TimelineView {
  return TIMELINE_OPTIONS.find(option => filterActivitiesByTimeline([activity], option.value).length > 0)?.value ?? "year";
}
