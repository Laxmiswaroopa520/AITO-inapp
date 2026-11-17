import { describe, expect, it } from "vitest";
import type { Activity } from "../types/activity.types";
import { createInitialSchedule, DAY_ZONES } from "./useDaySchedule";

const activity = (id: number, category: string, durationMinutes: number, triggerContext = "Recurring", priority = "High"): Activity => ({
  id, externalId: `activity-${id}`, title: `Activity ${id}`, description: null,
  roleExternalId: "role", roleName: "Role", roleAbbreviation: "R",
  workflowBucketExternalId: "bucket", workflowBucketName: "Bucket",
  category, frequency: "Daily", priority, toolCoverageLevel: "Primary", triggerContext, mcemStage: "Stage",
  durationMinutes, businessOutcome: null, beginnerPrompt: null, advancedPrompt: null, suggestedOutputs: null,
  sortOrder: id, aiTools: [],
});

const zoneOf = (schedule: ReturnType<typeof createInitialSchedule>, id: number) =>
  DAY_ZONES.find(zone => schedule[zone.id].some(item => item.activity.id === id))?.id;

describe("createInitialSchedule", () => {
  it("keeps every activity exactly once", () => {
    const items = Array.from({ length: 12 }, (_, i) => activity(i + 1, "Planning", 45));
    const schedule = createInitialSchedule(items);
    const ids = DAY_ZONES.flatMap(zone => schedule[zone.id].map(item => item.activity.id));
    expect(ids.sort((a, b) => a - b)).toEqual(items.map(item => item.id));
  });

  it("keeps the category zones while the morning has room", () => {
    const schedule = createInitialSchedule([activity(1, "Planning", 45), activity(2, "Engagement", 30), activity(3, "Admin", 30)]);
    expect([zoneOf(schedule, 1), zoneOf(schedule, 2), zoneOf(schedule, 3)]).toEqual(["morning", "midday", "late-day"]);
  });

  it("moves morning work to later zones once the morning is full, instead of stacking it", () => {
    const items = Array.from({ length: 6 }, (_, i) => activity(i + 1, "Insight", 45));
    const schedule = createInitialSchedule(items);
    expect(schedule.morning.reduce((sum, item) => sum + item.activity.durationMinutes, 0)).toBeLessThanOrEqual(180);
    expect(schedule.morning).toHaveLength(4);
    expect(schedule.midday).toHaveLength(2);
  });

  it("uses the trigger context when there is one", () => {
    const schedule = createInitialSchedule([activity(1, "Engagement", 30, "PreMeeting"), activity(2, "Planning", 30, "PostMeeting")]);
    expect(zoneOf(schedule, 1)).toBe("morning");
    expect(zoneOf(schedule, 2)).toBe("late-day");
  });

  it("gives back-to-back start times from each activity's real duration, so nothing overlaps", () => {
    const schedule = createInitialSchedule([activity(1, "Planning", 45), activity(2, "Planning", 30), activity(3, "Planning", 60)]);
    expect(schedule.morning.map(item => item.timeSlot)).toEqual(["8:30 AM", "9:15 AM", "9:45 AM"]);
  });

  it("still schedules everything when the whole day is over capacity", () => {
    const items = Array.from({ length: 12 }, (_, i) => activity(i + 1, "Admin", 60));
    const schedule = createInitialSchedule(items);
    expect(DAY_ZONES.reduce((sum, zone) => sum + schedule[zone.id].length, 0)).toBe(12);
  });
});
