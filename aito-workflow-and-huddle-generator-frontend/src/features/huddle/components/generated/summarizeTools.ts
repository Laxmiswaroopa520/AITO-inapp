import type { HuddlePresentationAgent, HuddlePresentationModel } from "../../types";

export type ToolCategory = "primary" | "secondary" | "other";

/**
 * Which AI tools the Huddle uses, most-used first, split into primary, secondary and "other". Every
 * list comes from the activities' agents (HuddleActivityAgents): primary and secondary are the
 * Huddle's activity-derived lists, and "other" holds activity agents whose usage type is neither
 * Primary nor Secondary (for example Surfaced). The topic's own agents (HuddleTopicAgents, delivered
 * as model.agents.unclassified) are not listed, so a tool appears only when an activity uses it. An
 * unrecognised usage type is never counted as primary. Agents are grouped by their shown name because
 * the same tool can be declared under more than one id.
 */
export function summarizeTools(model: HuddlePresentationModel): Record<ToolCategory, { name: string; activityCount: number }[]> {
  const nameOf = (agent: HuddlePresentationAgent) => agent.displayLabel?.trim() || agent.name;
  const primaryIds = new Set(model.agents.primary.map((agent) => agent.externalId));
  const secondaryIds = new Set(model.agents.secondary.map((agent) => agent.externalId));
  const categoryOf = (agent: HuddlePresentationAgent): ToolCategory =>
    primaryIds.has(agent.externalId) ? "primary"
      : secondaryIds.has(agent.externalId) ? "secondary"
        : agent.usageType === "Primary" ? "primary"
          : agent.usageType === "Secondary" ? "secondary"
            : "other";
  const primary = new Map<string, number>();
  const secondary = new Map<string, number>();
  const other = new Map<string, number>();
  const counts = new Map<ToolCategory, Map<string, number>>([["primary", primary], ["secondary", secondary], ["other", other]]);
  model.agents.primary.forEach((agent) => { if (!primary.has(nameOf(agent))) primary.set(nameOf(agent), 0); });
  model.agents.secondary.forEach((agent) => { if (!secondary.has(nameOf(agent))) secondary.set(nameOf(agent), 0); });
  model.phases.forEach((phase) => phase.activities.forEach((activity) => {
    counts.forEach((categoryCounts, category) => {
      new Set(activity.agents.filter((agent) => categoryOf(agent) === category).map(nameOf)).forEach((name) => categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1));
    });
  }));
  const sorted = (map: Map<string, number>) => [...map.entries()].map(([name, activityCount]) => ({ name, activityCount })).sort((left, right) => right.activityCount - left.activityCount || left.name.localeCompare(right.name));
  return { primary: sorted(primary), secondary: sorted(secondary), other: sorted(other) };
}
