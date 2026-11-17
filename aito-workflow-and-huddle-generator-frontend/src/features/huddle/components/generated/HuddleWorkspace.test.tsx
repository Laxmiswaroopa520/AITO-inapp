import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { HuddlePresentationActivity, HuddlePresentationAgent, HuddlePresentationModel, HuddlePresentationPhase } from "../../types";
import { HuddleWorkspace } from "./HuddleWorkspace";

const phase = (externalId: string, name: string, displayOrder: number): HuddlePresentationPhase =>
  ({ externalId, name, description: null, durationMinutes: null, displayOrder, activities: [] });

const model: HuddlePresentationModel = {
  identity: { externalId: "huddle-1", name: "Huddle", description: null, type: "Prescriptive", durationMinutes: 30 },
  audience: { roleExternalId: null, roleName: null, audienceDescription: null },
  narrative: { todayObjective: null, useCase: null, whyItMatters: null, desiredOutcome: null },
  agents: { primary: [], secondary: [], unclassified: [] },
  mcemStages: [],
  phases: [phase("p1", "Preparation", 1), phase("p2", "Explore and Practice", 2), phase("p3", "Commit to Action", 3)],
  facilitatorGuide: null,
  managerGuide: null,
  resources: [],
  reflectionPrompt: null,
  commitmentPrompt: null,
  keyTakeaway: null,
  contentAvailability: { narrativeComplete: false, facilitatorGuideAvailable: false, phasesAvailable: true, activitiesAvailable: false, agentsAvailable: false, resourcesAvailable: false, reflectionAvailable: false, commitmentAvailable: false, missingFields: [] },
};

function render(hub: "facilitator" | "manager", huddle: HuddlePresentationModel = model): string {
  const pending = () => new Promise<never>(() => undefined);
  return renderToStaticMarkup(<HuddleWorkspace model={huddle} session={null} sessionLoading={false} sessionError={null} mutationPending={false}
    onRefreshSession={pending} onSaveSession={pending} onSetActivityCompletion={pending} onCompleteSession={pending}
    onMeetCoach={() => undefined} onPreviewSlides={() => undefined} onClose={() => undefined} hub={hub} />);
}

describe("HuddleWorkspace hub navigation", () => {
  it.each(["facilitator", "manager"] as const)("labels the Huddle Flow stages and hides Share Your Experience in the %s hub", (hub) => {
    const html = render(hub);
    expect(html).toContain("Before Huddle");
    expect(html).toContain("During Huddle");
    expect(html).toContain("After Huddle");
    expect(html).not.toContain("Share Your Experience");
    expect(html).toContain("Resources");
    expect(html).toContain("Request Coaching Assistance");
  });

  it("labels the open hub and keeps every workspace control", () => {
    const facilitator = render("facilitator");
    const manager = render("manager");
    expect(facilitator).toContain("Facilitator Hub");
    expect(facilitator).not.toContain("Manager Hub");
    expect(manager).toContain("Manager Hub");
    expect(manager).not.toContain("Facilitator Hub");
    for (const html of [facilitator, manager]) {
      ["Huddle Guide", "Overview", "Talk Track", "Save Progress", "Complete Huddle", "Exit to Huddle Library", "HTML",
        "My Notes", "Private", "Key takeaway", "What you&#x27;ll practice", "Objective", "Why It Matters", "Desired Outcome",
        "Duration", "Phases", "Activities", "AI tools"]
        .forEach((text) => expect(html).toContain(text));
      // The workbook has no Use Case content, so the Overview leaves that card out.
      expect(html).not.toContain("Use Case");
    }
  });
});

const agent = (externalId: string, name: string, usageType: string): HuddlePresentationAgent => ({
  externalId, name, shortDescription: null, whatItIs: null, whatItHelpsYouDo: null, whenToUseIt: null, keyBenefits: [], usageType,
  displayLabel: null, showAccessLink: false, accessUrl: null, accessLinkLabel: null, displayOrder: 1, resources: [],
});

const activity = (externalId: string, practiceTier: string, agents: HuddlePresentationAgent[] = []): HuddlePresentationActivity => ({
  externalId, name: `Activity ${externalId}`, description: null, durationMinutes: null, displayOrder: 1, prompt: null, expectedOutput: null,
  humanCheckpoint: null, requiredContext: null, bestFitJob: null, practiceTier, executionMethod: "Prompt", activitySteps: [], whyThisMatters: null,
  launchUrl: null, launchLabel: null, prerequisiteActivityExternalId: null, prerequisiteActivityName: null, agents, resources: [],
});

const withActivities = (activities: HuddlePresentationActivity[], agents = model.agents): HuddlePresentationModel => ({
  ...model, agents, phases: [model.phases[0], { ...model.phases[1], activities }, model.phases[2]],
});

/** The <button> whose text ends with "Complete Huddle" (the header and footer both render one). */
const completeButtons = (html: string) => html.match(/<button[^>]*>(?:(?!<\/button>).)*Complete Huddle<\/button>/g) ?? [];

describe("HuddleWorkspace completion and AI tool groups", () => {
  it("lets a Huddle with no Featured activities be completed without any checkboxes", () => {
    const html = render("facilitator");
    expect(completeButtons(html).length).toBeGreaterThan(0);
    completeButtons(html).forEach((button) => expect(button).not.toMatch(/\sdisabled=""/));
    expect(html).toContain("No featured activities to tick off");
    expect(html).not.toContain("Mark Complete");
    expect(html).not.toContain("0 of 0 activities complete");
  });

  it("keeps the Featured checklist and disables completion until every Featured activity is ticked", () => {
    const html = render("facilitator", withActivities([activity("a1", "Featured"), activity("a2", "Extended")]));
    expect(html).toContain("0 of 1 activities complete");
    completeButtons(html).forEach((button) => expect(button).toMatch(/\sdisabled=""/));
  });

  it("labels the API's Primary and Secondary agents as Top 5 MCAPS Agents and Additional AI Tools", () => {
    const cowork = agent("AGT-004", "Cowork", "Primary");
    const msxi = agent("AGT-008", "MSXI Assist V2", "Secondary");
    const html = render("facilitator", withActivities([activity("a1", "Featured", [cowork, msxi])], { primary: [cowork], secondary: [msxi], unclassified: [] }));
    expect(html).toContain("Top 5 MCAPS Agents");
    expect(html).toContain("Additional AI Tools");
    expect(html).not.toContain("Primary AI tools");
    expect(html).not.toContain("Secondary AI tools");
  });

  it("shows only Additional AI Tools when the Huddle uses no Top 5 MCAPS Agent", () => {
    const m365 = agent("AGT-003", "Microsoft 365 Copilot", "Secondary");
    const html = render("facilitator", withActivities([activity("a1", "Featured", [m365])], { primary: [], secondary: [m365], unclassified: [] }));
    expect(html).toContain("Additional AI Tools");
    expect(html).not.toContain("Top 5 MCAPS Agents");
    expect(html).toContain("Microsoft 365 Copilot");
  });
});
