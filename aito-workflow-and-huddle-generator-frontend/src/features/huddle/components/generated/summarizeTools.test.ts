import { describe, expect, it } from "vitest";
import type { HuddlePresentationAgent, HuddlePresentationModel } from "../../types";
import { summarizeTools } from "./summarizeTools";

function agent(externalId: string, name: string, usageType: string): HuddlePresentationAgent {
  return { externalId, name, shortDescription: null, whatItIs: null, whatItHelpsYouDo: null, whenToUseIt: null, keyBenefits: [], usageType, displayLabel: null, showAccessLink: null, accessUrl: null, accessLinkLabel: null, displayOrder: 1, resources: [] };
}

function model(agents: HuddlePresentationModel["agents"], activityAgents: HuddlePresentationAgent[]): HuddlePresentationModel {
  return {
    agents,
    phases: [{ externalId: "phase", name: "Explore and Practice", description: null, durationMinutes: null, displayOrder: 2, activities: [{ agents: activityAgents } as unknown as HuddlePresentationModel["phases"][number]["activities"][number]] }],
  } as unknown as HuddlePresentationModel;
}

describe("summarizeTools", () => {
  it("lists only activity agents and ignores unclassified topic agents", () => {
    // Microsoft 365 Copilot and Analyst exist only as unclassified topic agents (HuddleTopicAgents),
    // and Agent J.ai is both a topic agent and an activity's Primary agent.
    const tools = summarizeTools(model(
      { primary: [agent("a1", "Agent J.ai", "Primary")], secondary: [agent("a2", "Researcher", "Secondary")], unclassified: [agent("a3", "Microsoft 365 Copilot", "Unclassified"), agent("a4", "Analyst", "Unclassified"), agent("a1", "Agent J.ai", "Unclassified")] },
      [agent("a1", "Agent J.ai", "Primary"), agent("a2", "Researcher", "Secondary")]));

    expect(tools.primary).toEqual([{ name: "Agent J.ai", activityCount: 1 }]);
    expect(tools.secondary).toEqual([{ name: "Researcher", activityCount: 1 }]);
    expect(tools.other).toEqual([]);
  });

  it("does not count an activity agent with an unrecognised usage type as primary", () => {
    const tools = summarizeTools(model({ primary: [], secondary: [], unclassified: [] }, [agent("a4", "Analyst", "Unclassified"), agent("a5", "Scout", "Surfaced"), agent("a1", "Sales Agent", "Primary")]));

    expect(tools.primary.map((tool) => tool.name)).toEqual(["Sales Agent"]);
    expect(tools.other.map((tool) => tool.name).sort()).toEqual(["Analyst", "Scout"]);
  });
});
