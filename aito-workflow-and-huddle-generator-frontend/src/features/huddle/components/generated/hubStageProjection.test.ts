import { describe, expect, it } from "vitest";
import { createHuddlePresentationModel } from "../../mappers/createHuddlePresentationModel";
import type { HuddleDetailResponse, HuddleFacilitatorGuideResponse, HuddleManagerGuideResponse } from "../../types";
import { hubHasGuidance, hubStageGuidance, type HubStage } from "./hubStageContent";

// The full data flow for the two placements behind the reported screens: the API detail response,
// the presentation mapper the page uses, then the stage projection. Values are taken from the
// 10.26 content (Preparation, Facilitator_Hub and Manager_Hub sheets) for WF-RENEW week 8.
const renewalFacilitatorGuide: HuddleFacilitatorGuideResponse = {
  sessionIntroduction: "Renewal risk is usually visible before the renewal conversation. Focus on finding it while there is still time to act.",
  keyTalkingPoints: ["Renewal health depends on value evidence, usage or consumption signals, relationship recency, commercial readiness, and expansion logic."],
  discussionQuestions: ["Which upcoming renewal has the weakest value evidence?"],
  suggestedTransitions: ["Move from renewal principles to one account and the action that changes risk this week."],
  wrapUpGuidance: "Renewal and expansion choices depend on evidenced value, risk and customer readiness.",
  preparationChecklist: [],
  facilitatorQuestions: ["What is the largest renewal risk?"],
  listenFor: ["Renewals treated as admin."],
  fallbackGuidance: "If the selected tool is inaccessible, use a sanitized supplied example.",
  reflectPrompt: "What evidence changes the renewal or expansion approach?",
  commitPrompt: "If useful, you could explore an upcoming renewal's risk or value-evidence gap.",
  bringBackEvidence: ["You may share a sanitized renewal assumption checked."],
  exampleScenario: null,
  roleWorkflowContext: null,
  facilitatorPreparation: null,
  facilitationWatchouts: null,
  managerFacilitatorAlignment: null,
};

const enterprise: { guide: HuddleFacilitatorGuideResponse; manager: HuddleManagerGuideResponse } = {
  guide: {
    ...renewalFacilitatorGuide,
    exampleScenario: "Illustrative scenario: An upcoming renewal has positive account sentiment but limited recent value evidence.",
    roleWorkflowContext: "Renewal planning brings together customer value, risk and account context.",
    facilitatorPreparation: "Review the renewal risk signal and the limits of the example's value claim.",
    facilitationWatchouts: "An expansion possibility is not an evidenced customer commitment.",
    managerFacilitatorAlignment: "Agree how to surface the distinction: an expansion possibility is not an evidenced customer commitment.",
  },
  manager: {
    managerTeamRelevance: "This topic matters when an expansion possibility is not an evidenced customer commitment.",
    managerPreparationGuidance: "Agree how to explore renewal risk without presuming an expansion opportunity.",
    managerDuringHuddleGuidance: "Encourage the team to separate risk evidence from expansion hypotheses.",
    managerFollowThroughQuestions: "Which renewal risk changed the next action?\nWhat evidence is still missing?",
  },
};

// USPSI AE week 8: the content source has the Preparation checklist but no Manager_Hub content and
// none of the five newer Facilitator_Hub fields (06_Huddle_Manager_Guides.sql loads all four
// manager columns as NULL for MG-PLC-USPSI-AE-W08).
const uspsi = {
  guide: { ...renewalFacilitatorGuide, preparationChecklist: ["Bring one account renewing in the next planning window and the evidence you currently use to judge risk."] },
  manager: { managerTeamRelevance: null, managerPreparationGuidance: null, managerDuringHuddleGuidance: null, managerFollowThroughQuestions: null },
};

function detail(placementExternalId: string, facilitatorGuide: HuddleFacilitatorGuideResponse, managerGuide: HuddleManagerGuideResponse): HuddleDetailResponse {
  return {
    placementExternalId, roleTopicName: "Manage Renewal Risk and Expansion Readiness", roleTopicDescription: null, wiifm: null,
    externalId: "WF-RENEW", name: "Renewal", description: "Topic description", type: "Prescriptive", publicationStatus: "Published",
    focusAreaExternalId: null, focusAreaName: null, durationMinutes: 30, recommendationPriority: 1, roles: [], audienceDescription: null,
    todayObjective: "Topic objective", useCase: "Topic use case", whyItMatters: "Topic why", desiredOutcome: "Topic outcome", stepsToGetStarted: [],
    mcemStages: [], primaryAgents: [], secondaryAgents: [], unclassifiedAgents: [],
    phases: [
      { externalId: "P01", name: "Preparation", description: null, durationMinutes: null, displayOrder: 1, activities: [] },
      { externalId: "P02", name: "Explore and Practice", description: null, durationMinutes: null, displayOrder: 2, activities: [] },
      { externalId: "P03", name: "Commit to Action", description: null, durationMinutes: null, displayOrder: 3, activities: [] },
    ],
    facilitatorGuide, managerGuide, topicResources: [], reflectionPrompt: null, commitmentPrompt: null, keyTakeaway: null,
    contentAvailability: { narrativeComplete: true, facilitatorGuideAvailable: true, phasesAvailable: true, activitiesAvailable: false, agentsAvailable: false, resourcesAvailable: false, reflectionAvailable: true, commitmentAvailable: true, missingFields: [] },
  };
}

const audience = { roleExternalId: null, roleName: null };
const stages: readonly HubStage[] = ["before", "during", "after"];

function project(response: HuddleDetailResponse, hub: "facilitator" | "manager") {
  const model = createHuddlePresentationModel(response, audience);
  return Object.fromEntries(stages.map((stage) => {
    const guidance = hubStageGuidance(hub, stage, model.facilitatorGuide, model.managerGuide);
    return [stage, [...guidance.lead, ...guidance.follow].map((item) => item.title)];
  })) as Record<HubStage, string[]>;
}

const topicText = ["Topic description", "Topic objective", "Topic use case", "Topic why", "Topic outcome"];

describe("hub stage projection from the API response", () => {
  it("fills all three Facilitator Hub stages for an Enterprise placement", () => {
    expect(project(detail("PLC-ENT-AE-W08", enterprise.guide, enterprise.manager), "facilitator")).toEqual({
      before: ["Role and workflow context", "Facilitator preparation", "Manager and facilitator alignment", "Example scenario"],
      during: ["Session introduction", "Key talking points", "Discussion questions", "Facilitator questions", "Listen for", "Suggested transitions", "Facilitation watchouts", "If access or inputs are unavailable"],
      after: ["Wrap Up", "Reflect", "Commit to Action", "Bring Back Next Time"],
    });
  });

  it("fills all three Manager Hub stages for an Enterprise placement, with manager fields only", () => {
    const response = detail("PLC-ENT-AE-W08", enterprise.guide, enterprise.manager);
    expect(project(response, "manager")).toEqual({
      before: ["Why this matters for your team", "Manager preparation", "Manager and facilitator alignment"],
      during: ["Manager guidance during the Huddle"],
      after: ["Follow-through questions"],
    });
    const model = createHuddlePresentationModel(response, audience);
    const texts = stages.flatMap((stage) => hubStageGuidance("manager", stage, model.facilitatorGuide, model.managerGuide).lead.map((item) => item.text));
    expect(texts).toContain("Which renewal risk changed the next action?\nWhat evidence is still missing?");
    expect(texts).not.toEqual(expect.arrayContaining(topicText));
  });

  it("still fills all three Facilitator Hub stages for the USPSI placement", () => {
    expect(project(detail("PLC-USPSI-AE-W08", uspsi.guide, uspsi.manager), "facilitator")).toEqual({
      before: ["Preparation checklist"],
      during: ["Session introduction", "Key talking points", "Discussion questions", "Facilitator questions", "Listen for", "Suggested transitions", "If access or inputs are unavailable"],
      after: ["Wrap Up", "Reflect", "Commit to Action", "Bring Back Next Time"],
    });
  });

  it("shows no Manager Hub guidance for the USPSI placement because its source row is empty, and never borrows facilitator or topic text", () => {
    const response = detail("PLC-USPSI-AE-W08", uspsi.guide, uspsi.manager);
    expect(project(response, "manager")).toEqual({ before: [], during: [], after: [] });
    const model = createHuddlePresentationModel(response, audience);
    expect(hubHasGuidance("manager", model.facilitatorGuide, model.managerGuide)).toBe(false);
    expect(hubHasGuidance("facilitator", model.facilitatorGuide, model.managerGuide)).toBe(true);
  });
});
