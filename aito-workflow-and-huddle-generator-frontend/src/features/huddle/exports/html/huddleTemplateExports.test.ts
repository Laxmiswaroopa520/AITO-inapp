import { afterEach, describe, expect, it, vi } from "vitest";
import type { HuddlePresentationModel } from "../../types";
import { exportHuddleHtml } from "./exportHuddleHtml";

/** A Huddle as a given role sees it: topic ID, the role's own title, and that role. */
const huddle = (externalId: string, name: string, roleName: string): HuddlePresentationModel => ({
  identity: { externalId, name, description: null, type: "Prescriptive", durationMinutes: 30 },
  audience: { roleExternalId: roleName, roleName, audienceDescription: null },
  narrative: { todayObjective: null, useCase: null, whyItMatters: null, desiredOutcome: null },
  agents: { primary: [], secondary: [], unclassified: [] }, mcemStages: [], phases: [],
  facilitatorGuide: null, managerGuide: null, resources: [], reflectionPrompt: null, commitmentPrompt: null, keyTakeaway: null,
  contentAvailability: { narrativeComplete: false, facilitatorGuideAvailable: false, phasesAvailable: false, activitiesAvailable: false, agentsAvailable: false, resourcesAvailable: false, reflectionAvailable: false, commitmentAvailable: false, missingFields: [] },
});

/** Captures the download link exportHuddleHtml clicks, without a browser. */
function stubDownloads() {
  const links: { href: string; download: string }[] = [];
  vi.stubGlobal("document", {
    createElement: () => {
      const link = { href: "", download: "", style: {} as Record<string, string>, click: vi.fn(), remove: vi.fn() };
      links.push(link);
      return link;
    },
    body: { appendChild: vi.fn() },
  });
  vi.stubGlobal("window", { setTimeout: vi.fn() });
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:generated-huddle");
  return links;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("shared Week 1 and Week 9 HTML templates", () => {
  it("downloads the same predefined Week 9 page for every role", () => {
    const links = stubDownloads();
    const roles: [string, string][] = [["Account Executive", "Reflect on Our Progress & Plan What’s Next"], ["Cloud Solution Architect", "Reflect on Our Progress & Plan What’s Next"], ["All ATU", "Transition to Team-Owned Huddle Practice"]];
    const outputs = roles.map(([role, title]) => exportHuddleHtml(huddle("WF-TRANSITION", title, role)));

    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link.href).toContain("assets/huddle/transition/transition-preview.html"));
    expect(new Set(links.map((link) => link.href)).size).toBe(1);
    outputs.forEach((output) => {
      expect(output.html).toBe("");
      expect(output.fileName).toMatch(/^FA-Huddle_ReflectOnOurProgressAndPlanWhatsNext_/);
    });
  });

  it("keeps downloading the predefined Week 1 orientation page", () => {
    const links = stubDownloads();
    const output = exportHuddleHtml(huddle("WF-ORIENT", "Frontier Accelerator Orientation for Account Executives", "Account Executive"));
    expect(links[0].href).toContain("assets/huddle/orientation/orientation-preview.html");
    expect(output.fileName).toMatch(/^FA-Huddle_FrontierAcceleratorOrientation_/);
  });

  it("keeps generating the role-specific page for Weeks 2 to 8", () => {
    const links = stubDownloads();
    const output = exportHuddleHtml(huddle("WF-CONSUME", "Drive Consumption Through Customer Outcomes", "Cloud Solution Architect"));
    expect(links[0].href).toBe("blob:generated-huddle");
    expect(output.html).toContain("Drive Consumption Through Customer Outcomes");
    expect(output.html).not.toContain("transition-preview");
  });
});
