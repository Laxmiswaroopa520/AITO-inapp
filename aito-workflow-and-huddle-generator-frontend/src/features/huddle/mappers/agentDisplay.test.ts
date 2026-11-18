import { describe, expect, it } from "vitest";
import type { HuddleCatalogItemResponse } from "../types";
import { agentDisplayKey, agentDisplayName, distinctAgentDisplayNames, surfacedThrough } from "./agentDisplay";
import { mapHuddleCatalogItemToCard } from "./huddleMappers";

const agent = (externalId: string, name: string, displayLabel: string | null = null) => ({ externalId, name, displayLabel });

describe("agent display names", () => {
  it("uses the DisplayLabel when present, else the agent name", () => {
    expect(agentDisplayName(agent("AGT-002", "ECIF Agent", "ECIF Agent (surfaced through Sales Agent)"))).toBe("ECIF Agent (surfaced through Sales Agent)");
    expect(agentDisplayName(agent("AGT-001", "Sales Agent", "  "))).toBe("Sales Agent");
  });

  it("treats one agent under two labels as two entries, and a blank label as the agent name", () => {
    expect(agentDisplayKey(agent("AGT-001", "Sales Agent"))).toBe(agentDisplayKey(agent("AGT-001", "Sales Agent", "Sales Agent")));
    expect(agentDisplayKey(agent("AGT-001", "Sales Agent"))).not.toBe(agentDisplayKey(agent("AGT-001", "Sales Agent", "CX Vitals (surfaced through Sales Agent)")));
    expect(distinctAgentDisplayNames([agent("AGT-001", "Sales Agent"), agent("AGT-001", "Sales Agent", "CX Vitals (surfaced through Sales Agent)"), agent("AGT-001", "Sales Agent", "Sales Agent")]))
      .toEqual(["Sales Agent", "CX Vitals (surfaced through Sales Agent)"]);
  });

  it("reads the host agent from a surfaced-through label", () => {
    expect(surfacedThrough("ECIF Agent (surfaced through Sales Agent)")).toEqual({ capability: "ECIF Agent", host: "Sales Agent" });
    expect(surfacedThrough("CX Vitals, surfaced through Sales Agent")).toEqual({ capability: "CX Vitals", host: "Sales Agent" });
    expect(surfacedThrough("ECIF Agent via Sales Agent")).toEqual({ capability: "ECIF Agent", host: "Sales Agent" });
    ["Sales Home (within Sales Agent)", "Proactive Insights in MSXI", "MSX Deal Assistance (evidence/input source)", "Sales Agent", null].forEach((label) =>
      expect(surfacedThrough(label)).toBeNull());
  });

  it("shows catalog and role path cards with the standard labels", () => {
    const response = {
      externalId: "WF-INVEST", name: "Investments", roles: [], activityCount: 0, durationMinutes: 30,
      primaryAgents: [agent("AGT-001", "Sales Agent"), agent("AGT-001", "Sales Agent", "CX Vitals (surfaced through Sales Agent)"), agent("AGT-002", "ECIF Agent", "ECIF Agent (surfaced through Sales Agent)")],
      secondaryAgents: [agent("AGT-008", "MSXI Assist V2", "Proactive Insights in MSXI")],
    } as unknown as HuddleCatalogItemResponse;
    const card = mapHuddleCatalogItemToCard(response);
    expect(card.primaryAgentNames).toEqual(["Sales Agent", "CX Vitals (surfaced through Sales Agent)", "ECIF Agent (surfaced through Sales Agent)"]);
    expect(card.secondaryAgentNames).toEqual(["Proactive Insights in MSXI"]);
  });
});
