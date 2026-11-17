import { describe, expect, it } from "vitest";
import type { HuddlePresentationFacilitatorGuide, HuddlePresentationManagerGuide } from "../../types";
import { HUB_STAGE_LABELS, hubGuidanceUnavailableMessage, hubHasGuidance, hubStageForPhase, hubStageGuidance, hubStageLabel, type HubGuidanceItem } from "./hubStageContent";

const facilitatorGuide: HuddlePresentationFacilitatorGuide = {
  sessionIntroduction: "Session introduction text",
  keyTalkingPoints: ["Talking point"],
  discussionQuestions: ["Discussion question?"],
  suggestedTransitions: ["Transition"],
  wrapUpGuidance: "Wrap up text",
  preparationChecklist: ["Bring one account"],
  facilitatorQuestions: ["Facilitator question?"],
  listenFor: ["Listen for this"],
  fallbackGuidance: "Fallback text",
  reflectPrompt: "Reflect text",
  commitPrompt: "Commit text",
  bringBackEvidence: ["Bring back this"],
  exampleScenario: "Scenario text",
  roleWorkflowContext: "Workflow context text",
  facilitatorPreparation: "Facilitator preparation text",
  facilitationWatchouts: "Watchouts text",
  managerFacilitatorAlignment: "Alignment text",
};

const managerGuide: HuddlePresentationManagerGuide = {
  managerTeamRelevance: "Team relevance text",
  managerPreparationGuidance: "Manager preparation text",
  managerDuringHuddleGuidance: "During guidance text",
  managerFollowThroughQuestions: "First question?\nSecond question?",
};

const titles = (items: readonly HubGuidanceItem[]) => items.map((item) => item.title);
const values = (items: readonly HubGuidanceItem[]) => items.flatMap((item) => item.text ? [item.text] : [...(item.items ?? [])]);

describe("hub stage labels", () => {
  it("renames the three phases to the hub stages and leaves other names alone", () => {
    expect(hubStageLabel("Preparation")).toBe("Before Huddle");
    expect(hubStageLabel("Explore and Practice")).toBe("During Huddle");
    expect(hubStageLabel("Commit to Action")).toBe("After Huddle");
    expect(hubStageLabel("Something else")).toBe("Something else");
    expect(hubStageForPhase("Something else")).toBeNull();
    expect(Object.values(HUB_STAGE_LABELS)).toEqual(["Before Huddle", "During Huddle", "After Huddle"]);
  });
});

describe("Facilitator Hub guidance", () => {
  it("places each facilitator field in the stage where the facilitator uses it", () => {
    const before = hubStageGuidance("facilitator", "before", facilitatorGuide, managerGuide);
    const during = hubStageGuidance("facilitator", "during", facilitatorGuide, managerGuide);
    const after = hubStageGuidance("facilitator", "after", facilitatorGuide, managerGuide);

    expect(titles(before.lead)).toEqual(["Role and workflow context", "Facilitator preparation", "Manager and facilitator alignment", "Example scenario", "Preparation checklist"]);
    expect(titles(during.lead)).toEqual(["Session introduction", "Key talking points", "Discussion questions"]);
    expect(titles(during.follow)).toEqual(["Facilitator questions", "Listen for", "Suggested transitions", "Facilitation watchouts", "If access or inputs are unavailable"]);
    expect(titles(after.lead)).toEqual(["Wrap Up", "Reflect", "Commit to Action", "Bring Back Next Time"]);
  });

  it("never shows Manager Hub content and never repeats a field across stages", () => {
    const all = (["before", "during", "after"] as const).flatMap((stage) => {
      const guidance = hubStageGuidance("facilitator", stage, facilitatorGuide, managerGuide);
      return values([...guidance.lead, ...guidance.follow]);
    });
    expect(all).not.toEqual(expect.arrayContaining(Object.values(managerGuide)));
    expect(new Set(all).size).toBe(all.length);
  });

  it("drops empty fields and returns nothing when the placement has no facilitator guide", () => {
    const sparse = { ...facilitatorGuide, roleWorkflowContext: null, facilitatorPreparation: "  ", managerFacilitatorAlignment: null, exampleScenario: null, preparationChecklist: [] };
    expect(hubStageGuidance("facilitator", "before", sparse, null)).toEqual({ lead: [], follow: [] });
    expect(hubStageGuidance("facilitator", "during", null, managerGuide)).toEqual({ lead: [], follow: [] });
  });
});

describe("Manager Hub guidance", () => {
  it("places each manager field in its stage and keeps line breaks", () => {
    const before = hubStageGuidance("manager", "before", facilitatorGuide, managerGuide);
    const during = hubStageGuidance("manager", "during", facilitatorGuide, managerGuide);
    const after = hubStageGuidance("manager", "after", facilitatorGuide, managerGuide);

    expect(titles(before.lead)).toEqual(["Why this matters for your team", "Manager preparation", "Manager and facilitator alignment"]);
    expect(values(during.lead)).toEqual(["During guidance text"]);
    expect(values(after.lead)).toEqual(["First question?\nSecond question?"]);
    expect(during.follow).toEqual([]);
  });

  it("shows only manager fields plus the shared alignment field", () => {
    const all = (["before", "during", "after"] as const).flatMap((stage) => values(hubStageGuidance("manager", stage, facilitatorGuide, managerGuide).lead));
    expect(all).toEqual(["Team relevance text", "Manager preparation text", "Alignment text", "During guidance text", "First question?\nSecond question?"]);
  });

  it("returns nothing when the placement has no manager content, rather than falling back to facilitator content", () => {
    const empty = { managerTeamRelevance: null, managerPreparationGuidance: null, managerDuringHuddleGuidance: null, managerFollowThroughQuestions: null };
    for (const stage of ["before", "during", "after"] as const) {
      expect(hubStageGuidance("manager", stage, facilitatorGuide, empty)).toEqual({ lead: [], follow: [] });
    }
    expect(hubStageGuidance("manager", "before", facilitatorGuide, null)).toEqual({ lead: [], follow: [] });
    expect(hubHasGuidance("manager", facilitatorGuide, empty)).toBe(false);
    expect(hubHasGuidance("manager", facilitatorGuide, managerGuide)).toBe(true);
    expect(hubGuidanceUnavailableMessage("manager")).toBe("No Manager Hub guidance has been authored for this role's version of the Huddle yet.");
    expect(hubGuidanceUnavailableMessage("facilitator", true)).toBe("No Facilitator Hub guidance is authored for this stage of the Huddle.");
  });
});
