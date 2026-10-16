import { describe, expect, it } from "vitest";
import staticApiData from "@/data/static-api-data.json";
import type { HuddleAgentResponse, HuddleCatalogItemResponse, HuddleDetailResponse } from "@/features/huddle/types";
import { applyHuddleToolMapping, primaryToolsFromActivities, type HuddleToolMappingInput } from "./huddleToolMapping";

const agent = (externalId: string, usageType: string, displayOrder = 1): HuddleAgentResponse => ({
  externalId, name: externalId, shortDescription: null, whatItIs: null, whatItHelpsYouDo: null, whenToUseIt: null,
  keyBenefits: [], usageType, displayLabel: null, showAccessLink: false, accessUrl: null, accessLinkLabel: null,
  displayOrder, resources: [], whenNotToUseIt: null, stepsToGetStarted: [],
});

const activity = (externalId: string, displayOrder: number, agents: HuddleAgentResponse[]) => ({ externalId, displayOrder, agents }) as never;

const detail = (topic: string, placement: string | null, phases: Array<{ displayOrder: number; activities: unknown[] }>, topicAgents: { primary?: HuddleAgentResponse[]; secondary?: HuddleAgentResponse[] } = {}) =>
  ({ externalId: topic, placementExternalId: placement, primaryAgents: topicAgents.primary ?? [], secondaryAgents: topicAgents.secondary ?? [], phases: phases.map((phase, index) => ({ externalId: `PH${index}`, ...phase })) }) as unknown as HuddleDetailResponse;

const card = (topic: string, placement: string | null, topicAgents: { primary?: HuddleAgentResponse[]; secondary?: HuddleAgentResponse[] } = {}) =>
  ({ externalId: topic, placementExternalId: placement, primaryAgents: topicAgents.primary ?? [], secondaryAgents: topicAgents.secondary ?? [] }) as unknown as HuddleCatalogItemResponse;

describe("primaryToolsFromActivities", () => {
  const placement = detail("T", "P", [{ displayOrder: 1, activities: [
    activity("A1", 1, [agent("X", "Primary", 2), agent("Y", "Secondary", 1)]),
    activity("A2", 2, [agent("Z", "Primary", 1), agent("X", "Primary", 1)]),
  ] }]);

  it("keeps only Primary-tagged tools, one entry per tool, first tagged row wins", () => {
    expect(primaryToolsFromActivities(placement, "detail").map((tool) => tool.externalId)).toEqual(["X", "Z"]);
  });

  it("returns an empty list when no activity tags a tool Primary (no topic fallback)", () => {
    const secondaryOnly = detail("T", "P", [{ displayOrder: 1, activities: [activity("A1", 1, [agent("Y", "Secondary")])] }], { primary: [agent("TOPIC", "Primary")] });
    expect(primaryToolsFromActivities(secondaryOnly, "card")).toEqual([]);
    expect(primaryToolsFromActivities(undefined, "card")).toEqual([]);
  });

  it("orders cards by activity then tool order, and details by phase, activity and tool order", () => {
    const twoPhases = detail("T", "P", [
      { displayOrder: 2, activities: [activity("B1", 1, [agent("LATE", "Primary", 1)])] },
      { displayOrder: 1, activities: [activity("A1", 5, [agent("EARLY", "Primary", 1)])] },
    ]);
    expect(primaryToolsFromActivities(twoPhases, "detail").map((tool) => tool.externalId)).toEqual(["EARLY", "LATE"]);
    expect(primaryToolsFromActivities(twoPhases, "card").map((tool) => tool.externalId)).toEqual(["LATE", "EARLY"]);
  });
});

describe("applyHuddleToolMapping", () => {
  const input = (): HuddleToolMappingInput => ({
    defaultCatalog: { T: card("T", "P-ORIENT", { primary: [agent("TOPIC-P", "Primary")], secondary: [agent("S2", "Secondary", 2), agent("X", "Secondary", 1)] }) },
    defaultDetails: { T: detail("T", "P-ORIENT", [], { primary: [agent("TOPIC-P", "Primary")], secondary: [agent("S2", "Secondary", 2), agent("X", "Secondary", 1)] }) },
    placementCatalog: { "P-ORIENT": card("T", "P-ORIENT"), "P-ROLE-W3": card("T", "P-ROLE-W3"), "P-ROLE-W2-B": card("T", "P-ROLE-W2-B"), "P-ROLE-W2-A": card("T", "P-ROLE-W2-A"), "P-ADD": card("T", "P-ADD") },
    placementDetails: {
      "P-ORIENT": detail("T", "P-ORIENT", [{ displayOrder: 1, activities: [activity("A", 1, [agent("O", "Primary")])] }]),
      "P-ROLE-W3": detail("T", "P-ROLE-W3", [{ displayOrder: 1, activities: [activity("A", 1, [agent("W3", "Primary")])] }]),
      "P-ROLE-W2-B": detail("T", "P-ROLE-W2-B", [{ displayOrder: 1, activities: [activity("A", 1, [agent("B", "Primary")])] }]),
      "P-ROLE-W2-A": detail("T", "P-ROLE-W2-A", [{ displayOrder: 1, activities: [activity("A", 1, [agent("X", "Primary"), agent("Q", "Secondary")])] }]),
      "P-ADD": detail("T", "P-ADD", [{ displayOrder: 1, activities: [activity("A", 1, [agent("ADD", "Primary")])] }]),
    },
    weeklyPaths: {
      r1: [{ week: 1, placementExternalId: "P-ORIENT", topicExternalId: "T" }, { week: 3, placementExternalId: "P-ROLE-W3", topicExternalId: "T" }],
      r2: [{ week: 2, placementExternalId: "P-ROLE-W2-B", topicExternalId: "T" }],
      r3: [{ week: 2, placementExternalId: "P-ROLE-W2-A", topicExternalId: "T" }],
    },
    additionalPaths: { r1: [{ week: 1, placementExternalId: "P-ADD", topicExternalId: "T" }] },
  });

  it("gives placements activity-derived Primary tools and the topic's Secondary tools, keeping overlap", () => {
    const { huddle } = applyHuddleToolMapping(input());
    const placement = huddle.placementDetails["P-ROLE-W2-A"]!;
    expect(placement.primaryAgents.map((tool) => tool.externalId)).toEqual(["X"]);
    // X is Primary through the activity and Secondary at topic level: both lists keep it.
    expect(placement.secondaryAgents.map((tool) => tool.externalId)).toEqual(["X", "S2"]);
    expect(huddle.placementCatalog["P-ROLE-W2-A"]!.secondaryAgents.map((tool) => tool.externalId)).toEqual(["X", "S2"]);
    // Q is only Secondary on an activity, so it does not appear in the placement's Secondary list.
    expect(placement.secondaryAgents.some((tool) => tool.externalId === "Q")).toBe(false);
  });

  it("resolves the default placement: role path by sequence then id, before orientation and additional", () => {
    const { huddle, index } = applyHuddleToolMapping(input());
    expect(index.defaultPlacementByTopic.get("T")).toBe("P-ROLE-W2-A");
    expect(huddle.defaultDetails.T!.primaryAgents.map((tool) => tool.externalId)).toEqual(["X"]);
    expect(huddle.defaultCatalog.T!.primaryAgents.map((tool) => tool.externalId)).toEqual(["X"]);
    expect(huddle.defaultDetails.T!.secondaryAgents.map((tool) => tool.externalId)).toEqual(["X", "S2"]);
  });

  it("indexes topic-level and activity-level tools separately for the AI Tool filter", () => {
    const { index } = applyHuddleToolMapping(input());
    expect([...index.topicAgentIds.get("T")!].sort()).toEqual(["S2", "TOPIC-P", "X"]);
    expect(index.topicActivityAgentIds.get("T")!.has("Q")).toBe(true);
    expect(index.topicAgentIds.get("T")!.has("Q")).toBe(false);
  });

  it("does not modify the input data", () => {
    const original = input();
    const snapshot = JSON.stringify(original);
    applyHuddleToolMapping(original);
    expect(JSON.stringify(original)).toBe(snapshot);
  });
});

describe("bundled Huddle data", () => {
  const raw = (staticApiData as unknown as { huddle: HuddleToolMappingInput }).huddle;
  const { huddle, index } = applyHuddleToolMapping(raw);
  const ids = (agents: HuddleAgentResponse[]) => agents.map((tool) => tool.externalId);

  it("maps every placement: Primary from its own activities, Secondary from its topic", () => {
    Object.entries(raw.placementDetails).forEach(([placementId, original]) => {
      const taggedPrimary = new Set(original.phases.flatMap((phase) => phase.activities.flatMap((a) => a.agents.filter((t) => t.usageType === "Primary").map((t) => t.externalId))));
      expect(new Set(ids(huddle.placementDetails[placementId]!.primaryAgents)), placementId).toEqual(taggedPrimary);
      expect(ids(huddle.placementCatalog[placementId]!.primaryAgents).sort(), placementId).toEqual(ids(huddle.placementDetails[placementId]!.primaryAgents).sort());
      const topicSecondary = ids([...(raw.defaultDetails[original.externalId]?.secondaryAgents ?? [])].sort((l, r) => l.displayOrder - r.displayOrder));
      expect(ids(huddle.placementDetails[placementId]!.secondaryAgents), placementId).toEqual(topicSecondary);
      expect(ids(huddle.placementCatalog[placementId]!.secondaryAgents), placementId).toEqual(topicSecondary);
    });
  });

  it("maps every default record like its resolved default placement", () => {
    Object.keys(raw.defaultDetails).forEach((topicId) => {
      const placementId = index.defaultPlacementByTopic.get(topicId)!;
      expect(placementId, topicId).toBeTruthy();
      expect(ids(huddle.defaultDetails[topicId]!.primaryAgents), topicId).toEqual(ids(huddle.placementDetails[placementId]!.primaryAgents));
      expect(ids(huddle.defaultCatalog[topicId]!.primaryAgents), topicId).toEqual(ids(huddle.placementCatalog[placementId]!.primaryAgents));
      expect(ids(huddle.defaultDetails[topicId]!.secondaryAgents), topicId).toEqual(ids(huddle.placementDetails[placementId]!.secondaryAgents));
    });
  });

  it("leaves every other field, and every activity's own tools, untouched", () => {
    const strip = <T extends object>(record: T) => Object.fromEntries(Object.entries(record).filter(([key]) => key !== "primaryAgents" && key !== "secondaryAgents"));
    (["placementCatalog", "placementDetails", "defaultCatalog", "defaultDetails"] as const).forEach((section) => {
      expect(Object.keys(huddle[section])).toEqual(Object.keys(raw[section]));
      Object.keys(raw[section]).forEach((key) => {
        expect(strip(huddle[section][key]!), `${section}.${key}`).toEqual(strip(raw[section][key]!));
      });
    });
  });
});
