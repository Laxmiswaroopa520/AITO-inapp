/// <reference types="node" />
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { HuddlePlanResponse, HuddlePresentationAgent, HuddlePresentationModel } from "../../types";
import { HUDDLE_FONT_STACK } from "./fontStack";
import { createHuddleHtmlExport } from "./exportHuddleHtml";
import { createLearningPlanHtmlExport } from "./exportLearningPlanHtml";
import { escapeHtml, safeExternalUrl } from "./htmlSanitizer";

const huddle: HuddlePresentationModel = {
  identity: { externalId: "topic-1", name: '<img src=x onerror="alert(1)"> Strategic Huddle', description: "A governed <review>.", type: "Prescriptive", durationMinutes: 30 },
  audience: { roleExternalId: "seller", roleName: "Seller & Lead", audienceDescription: null },
  narrative: { todayObjective: "Prepare safely.", useCase: null, whyItMatters: null, desiredOutcome: null },
  agents: { primary: [], secondary: [], unclassified: [] }, mcemStages: [],
  phases: [{ externalId: "phase-1", name: "Preparation", description: null, durationMinutes: 30, displayOrder: 1, activities: [{ externalId: "activity-1", name: "Review", description: null, durationMinutes: 30, displayOrder: 1, prompt: "<script>alert('x')</script> " + "Long content. ".repeat(200), expectedOutput: "Safe output", humanCheckpoint: null, requiredContext: null, bestFitJob: null, practiceTier: "Featured", executionMethod: "Prompt", activitySteps: [], whyThisMatters: null, launchUrl: null, launchLabel: null, prerequisiteActivityExternalId: null, prerequisiteActivityName: null, agents: [], resources: [{ externalId: "bad", title: "Unsafe link", description: null, url: "javascript:alert(1)", type: null, linkLabel: null, displayOrder: 1 }] }] }],
  facilitatorGuide: null, managerGuide: null, resources: [], reflectionPrompt: null, commitmentPrompt: null, keyTakeaway: null,
  contentAvailability: { narrativeComplete: false, facilitatorGuideAvailable: false, phasesAvailable: true, activitiesAvailable: true, agentsAvailable: false, resourcesAvailable: true, reflectionAvailable: false, commitmentAvailable: false, missingFields: ["useCase"] },
};

const catalog = (week: number) => ({ externalId: `topic-${week}`, name: `Huddle ${week}`, description: null, type: "Prescriptive", focusAreaExternalId: null, focusAreaName: null, durationMinutes: 30, recommendationPriority: week, audienceDescription: null, desiredOutcome: null, roles: [], primaryAgents: [], secondaryAgents: [], mcemStages: [], activityCount: 0, placementExternalId: null, featuredActivityCount: null, extendedActivityCount: null, roleTopicName: null, roleTopicDescription: null });
const plan: HuddlePlanResponse = { roleExternalId: "seller", isCustomized: true, rowVersion: "row", items: [8, 4, 2, 7, 3, 6, 5].map((week) => ({ week, recommendedHuddleExternalId: week === 4 ? "recommended-topic" : `topic-${week}`, isCustomized: week === 4, huddle: catalog(week) })) };

describe("secure Huddle HTML exports", () => {
  it("escapes markup and rejects script URLs", () => {
    expect(escapeHtml('<script onload="x">')).toBe("&lt;script onload=&quot;x&quot;&gt;");
    expect(safeExternalUrl("javascript:alert(1)")).toBeNull();
  });

  it("renders the Preparation section with three Microsoft-color-striped cards and no Facilitator to bring card", () => {
    const facilitatorGuide = {
      sessionIntroduction: "Intro text", keyTalkingPoints: ["Talking point"], discussionQuestions: ["Discuss question?"], suggestedTransitions: [], wrapUpGuidance: null,
      preparationChecklist: ["Bring this item"], facilitatorQuestions: [], listenFor: [], fallbackGuidance: null, reflectPrompt: null, commitPrompt: null, bringBackEvidence: [],
      exampleScenario: null, roleWorkflowContext: null, facilitatorPreparation: null, facilitationWatchouts: null, managerFacilitatorAlignment: null,
    } as unknown as NonNullable<HuddlePresentationModel["facilitatorGuide"]>;
    const html = createHuddleHtmlExport({ ...huddle, facilitatorGuide }).html;
    const preparation = html.slice(html.indexOf('data-section-panel="preparation"'), html.indexOf('data-section-panel="practice"'));
    expect(preparation).toContain("Session introduction");
    expect(preparation).toContain("Key Talking Points");
    expect(preparation).toContain("Discuss before practicing");
    expect(preparation).toContain("Discuss question?");
    expect(preparation).not.toContain("Facilitator to bring into the conversation");
    expect(preparation).not.toContain("Bring this item");
    // Each Preparation card carries the four-color Microsoft stripe (red, green, blue, yellow).
    expect(html).toMatch(/\.preparation-session-card,\s*\.preparation-talking-card,\s*\.preparation-discuss-card\s*\{\s*border-left: 4px solid transparent;/);
    ["#F25022 0 25%", "#7FBA00 25% 50%", "#00A4EF 50% 75%", "#FFB900 75% 100%"].forEach((stop) => expect(html).toContain(stop));
    expect(html).toMatch(/\.stage-content-grid > \.preparation-discuss-card\s*\{\s*grid-column: 1 \/ -1;/);
  });

  it("exports long Huddle content without scripts, event handlers, or semantic substitution", () => {
    const output = createHuddleHtmlExport(huddle);
    expect(output.html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
    expect(output.html).not.toContain("<img src=x");
    expect(output.html).not.toContain('onerror="');
    expect(output.html).not.toContain("javascript:");
    expect(output.html).not.toContain("<script>alert");
    expect(output.html).not.toContain("Use Case</h3>");
    expect(output.html).toContain("Long content. Long content.");
    // Brand artwork is inlined as data URIs, never fetched from the network.
    expect(output.html).toContain('src="data:image/png;base64,');
    expect(output.html).not.toContain('src="http');
    // The seven-section guide layout from the Frontier Accelerator reference export.
    // Facilitator Notes is deliberately not part of the Download HTML output.
    ["overview", "best-practices", "preparation", "practice", "commit", "closing", "resources"]
      .forEach((section) => expect(output.html).toContain('data-section-panel="' + section + '"'));
    expect(output.html).not.toContain('data-section-panel="notes"');
    expect(output.html).not.toContain('data-section-target="notes"');
    expect(output.html).toContain("Share Your Experience");
    expect(output.html).toContain("Featured activities");
    expect(output.html).toContain('data-activity-tier="optional"');
    expect(output.html).toContain('data-practice-tier="featured"');
    expect(output.html).toContain("data-section-previous");
    expect(output.html).toContain("data-flow-target");
    expect(output.html).toContain("data-copy=");
  });

  it("keeps Extended activities out of the featured list and in the additional section", () => {
    const featured = huddle.phases[0].activities[0];
    const extended = { ...featured, externalId: "activity-2", name: "Optional depth activity", practiceTier: "Extended" };
    const output = createHuddleHtmlExport({ ...huddle, phases: [{ ...huddle.phases[0], activities: [featured, extended] }] });

    const featuredStack = output.html.split('data-activity-tier="featured"')[1].split('data-activity-tier="optional"')[0];
    const optionalStack = output.html.split('data-activity-tier="optional"')[1];
    expect(featuredStack).toContain("Review");
    expect(featuredStack).not.toContain("Optional depth activity");
    expect(optionalStack).toContain("Optional depth activity");
    // Letters run as one sequence across both stacks: A featured, B optional.
    expect(optionalStack).toContain(">B<");
    expect(output.html).toContain("1 featured activity");
    expect(output.html).toContain("1 extended");
    expect(output.html).not.toContain("No additional activities are configured");
  });

  it("shows the Open tool button on every activity tool row, as a placeholder until a URL exists", () => {
    const agent: HuddlePresentationAgent = { externalId: "agent-sales", name: "Sales Agent", shortDescription: null, whatItIs: null, whatItHelpsYouDo: null, whenToUseIt: null, keyBenefits: [], usageType: "Primary", displayLabel: null, showAccessLink: false, accessUrl: null, accessLinkLabel: null, displayOrder: 1, resources: [] };
    // Declared on the Huddle and used by an activity, so it also gets a Resources tool card.
    const withAgent = (value: HuddlePresentationAgent) => createHuddleHtmlExport({ ...huddle, agents: { primary: [value], secondary: [], unclassified: [] }, phases: [{ ...huddle.phases[0], activities: [{ ...huddle.phases[0].activities[0], agents: [value] }] }] }).html;

    const placeholderHtml = withAgent(agent);
    expect(placeholderHtml).toContain('<span class="activity-open-tool is-placeholder" aria-disabled="true" title="Link coming soon">Open Sales Agent ↗</span>');
    expect(placeholderHtml).toContain('<span class="resource-tool-open is-placeholder" aria-disabled="true" title="Link coming soon">Open Sales Agent ↗</span>');

    // showAccessLink stays false: the link follows accessUrl alone.
    const linkedHtml = withAgent({ ...agent, accessUrl: "https://example.com/sales" });
    expect(linkedHtml).toContain('<a class="activity-open-tool" href="https://example.com/sales"');
    expect(linkedHtml).toContain('<a class="resource-tool-open" href="https://example.com/sales"');
    expect(linkedHtml).not.toContain("is-placeholder\" aria-disabled");
  });

  describe("AI tool groups follow the API classification", () => {
    const tool = (externalId: string, name: string, usageType = "Primary", displayLabel: string | null = null): HuddlePresentationAgent => ({ externalId, name, shortDescription: null, whatItIs: null, whatItHelpsYouDo: null, whenToUseIt: null, keyBenefits: [], usageType, displayLabel, showAccessLink: false, accessUrl: null, accessLinkLabel: null, displayOrder: 1, resources: [] });
    const exportWith = (primary: HuddlePresentationAgent[], secondary: HuddlePresentationAgent[]) =>
      createHuddleHtmlExport({ ...huddle, agents: { primary, secondary, unclassified: [] }, phases: [{ ...huddle.phases[0], activities: [{ ...huddle.phases[0].activities[0], agents: [...primary, ...secondary] }] }] }).html;
    const band = (html: string) => {
      const start = html.indexOf('<section class="top-five-agent-band"');
      return start < 0 ? "" : html.slice(start, html.indexOf("</section>", start));
    };

    it("lists Top 5 MCAPS Agents and Additional AI Tools on their own lines in the Overview summary", () => {
      const html = exportWith([tool("AGT-004", "Cowork")], [tool("AGT-003", "Microsoft 365 Copilot", "Secondary")]);
      expect(html).toContain("<small>AI Tools</small><strong>Top 5 MCAPS Agents: Cowork.\nAdditional AI Tools: Microsoft 365 Copilot.</strong>");
    });

    it("keeps Sales Home as its own Additional AI Tool instead of folding it into Sales Agent", () => {
      const html = exportWith([tool("AGT-001", "Sales Agent")], [tool("AGT-013", "Sales Home", "Secondary", "Sales Home (within Sales Agent)")]);
      expect(html).toContain("Top 5 MCAPS Agents: Sales Agent.\nAdditional AI Tools: Sales Home (within Sales Agent).");
      expect(band(html)).toContain("Sales Agent");
      expect(band(html)).not.toContain("Sales Home");
      expect(html).toContain('<div class="resource-tool-badge is-surfaced">Additional AI Tool</div>');
    });

    const pills = (html: string) => [...band(html).matchAll(/<div class="top-five-agent-pill( is-featured)?">.*?<strong class="top-five-agent-title">([^<]*)<\/strong>/g)]
      .map((match) => ({ name: match[2], highlighted: Boolean(match[1]) }));
    const highlighted = (html: string) => pills(html).filter((pill) => pill.highlighted).map((pill) => pill.name);
    const ALL_FIVE = ["Researcher", "Cowork", "Scout", "Sales Agent", "Agent J.ai"];

    it("always shows all five Top 5 MCAPS Agents and highlights only the Primary ones", () => {
      const html = exportWith([tool("AGT-006", "Researcher"), tool("AGT-NEW", "Future Agent")], [tool("AGT-002", "Cowork", "Secondary")]);
      expect(pills(html).map((pill) => pill.name)).toEqual(ALL_FIVE);
      // An agent the API classifies Secondary is never highlighted because of its name.
      expect(highlighted(html)).toEqual(["Researcher"]);
      expect(html).toContain("Top 5 MCAPS Agents: Researcher, Future Agent.");
      expect(html).toContain("2 Top 5 MCAPS Agents");
    });

    it("shows the five agents without highlight when the Huddle uses no Top 5 MCAPS Agent", () => {
      const html = exportWith([], [tool("AGT-003", "Microsoft 365 Copilot", "Secondary")]);
      expect(pills(html).map((pill) => pill.name)).toEqual(ALL_FIVE);
      expect(highlighted(html)).toEqual([]);
      expect(html).toContain("<small>AI Tools</small><strong>Additional AI Tools: Microsoft 365 Copilot.</strong>");
      expect(html).not.toContain("Top 5 MCAPS Agents:");
    });

    it("says Not configured when the Huddle has no AI tools at all", () => {
      const html = exportWith([], []);
      expect(highlighted(html)).toEqual([]);
      expect(html).toContain("<small>AI Tools</small><strong>Not configured</strong>");
    });

    describe("capabilities surfaced through Sales Agent", () => {
      const surfaced = (externalId: string, name: string, capability = name) => tool(externalId, name, "Primary", `${capability} (surfaced through Sales Agent)`);
      const topFiveLine = (html: string) => /Top 5 MCAPS Agents: [^\n<]*\./.exec(html)?.[0] ?? "";

      it.each([
        ["ECIF Agent", "AGT-002", "ECIF Agent"],
        ["Deal Agent", "AGT-016", "Deal Agent"],
        ["CX Vitals", "AGT-001", "Sales Agent"],
      ])("keeps the %s name in the Top 5 line and highlights Sales Agent", (capability, externalId, name) => {
        const html = exportWith([tool("AGT-004", "Cowork"), surfaced(externalId, name, capability)], []);
        expect(topFiveLine(html)).toBe(`Top 5 MCAPS Agents: Cowork, ${capability} (surfaced through Sales Agent).`);
        expect(pills(html).map((pill) => pill.name)).toEqual(ALL_FIVE);
        expect(highlighted(html)).toEqual(["Cowork", "Sales Agent"]);
      });

      it("keeps the full Top 5 list and order, with Deal Agent shown by its own name", () => {
        const html = exportWith([tool("AGT-005", "Scout"), tool("AGT-004", "Cowork"), surfaced("AGT-016", "Deal Agent"), tool("AGT-009", "Agent J.ai"), tool("AGT-099", "Agent K")], []);
        expect(topFiveLine(html)).toBe("Top 5 MCAPS Agents: Scout, Cowork, Deal Agent (surfaced through Sales Agent), Agent J.ai, Agent K.");
        expect(topFiveLine(html)).not.toContain("Cowork, Sales Agent");
        expect(highlighted(html)).toEqual(["Cowork", "Scout", "Sales Agent", "Agent J.ai"]);
        expect(html).toContain("5 Top 5 MCAPS Agents");
      });

      it("keeps direct Sales Agent highlighting and shows one Sales Agent pill for several capabilities", () => {
        const html = exportWith([tool("AGT-001", "Sales Agent", "Primary", "Sales Agent"), surfaced("AGT-002", "ECIF Agent"), surfaced("AGT-001", "Sales Agent", "CX Vitals")], []);
        expect(topFiveLine(html)).toBe("Top 5 MCAPS Agents: Sales Agent, ECIF Agent (surfaced through Sales Agent), CX Vitals (surfaced through Sales Agent).");
        expect(pills(html).filter((pill) => pill.name === "Sales Agent")).toEqual([{ name: "Sales Agent", highlighted: true }]);
        expect(highlighted(html)).toEqual(["Sales Agent"]);
        expect(band(html)).toContain(">Used in Huddle<");
      });

      it("leaves the other agents and the Additional AI Tools unchanged", () => {
        const html = exportWith([tool("AGT-004", "Cowork"), tool("AGT-006", "Researcher")], [
          tool("AGT-008", "MSXI Assist V2", "Secondary", "Proactive Insights in MSXI"),
          tool("AGT-010", "Auto-Fix Pipeline Agent", "Secondary"),
          tool("SYS-001", "MSX Deal Assistance", "Secondary"),
          tool("AGT-014", "Know Your Partner", "Secondary"),
          tool("AGT-013", "Sales Home", "Secondary", "Sales Home (within Sales Agent)"),
        ]);
        expect(topFiveLine(html)).toBe("Top 5 MCAPS Agents: Cowork, Researcher.");
        expect(highlighted(html)).toEqual(["Researcher", "Cowork"]);
        expect(html).toContain("Additional AI Tools: Proactive Insights in MSXI, Auto-Fix Pipeline Agent, MSX Deal Assistance, Know Your Partner, Sales Home (within Sales Agent).");
      });

      it("still shows each capability by its own name on the activity", () => {
        const html = exportWith([surfaced("AGT-002", "ECIF Agent"), surfaced("AGT-016", "Deal Agent"), surfaced("AGT-001", "Sales Agent", "CX Vitals")], []);
        ["ECIF Agent (surfaced through Sales Agent)", "Deal Agent (surfaced through Sales Agent)", "CX Vitals (surfaced through Sales Agent)"]
          .forEach((label) => expect(html).toContain(`Open ${label}`));
      });
    });
  });

  it("orders the persisted learning plan as Weeks 2 through 8", () => {
    const html = createLearningPlanHtmlExport(plan).html;
    const positions = [2, 3, 4, 5, 6, 7, 8].map((week) => html.indexOf(`<td>Week ${week}</td>`));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    // Week 4 is the one customized item in the fixture (recommendedHuddleExternalId
    // "recommended-topic" differs from its huddle's own "topic-4"), so its row should name what
    // it replaced in the Customization column.
    expect(html).toContain("recommended-topic");
  });

  it("renders every generated document in the one font stack", () => {
    // The manager reported the downloaded page not matching the application. The cause was
    // divergent declarations: the app rendered in Segoe UI Variable while the exports declared
    // only Segoe UI, and a missing 800 weight was being faked. One shared constant now feeds
    // both, so a document can never drift from the screen it came from again.
    const documents = [createHuddleHtmlExport(huddle).html, createLearningPlanHtmlExport(plan).html];

    for (const html of documents) {
      // Both the font-family property and the font shorthand, which also carries a family.
      // In-app: the reset rule's `font-family: inherit` is allowed (it only re-applies the body stack).
      const declared = new Set([
        ...[...html.matchAll(/font-family\s*:(?!\s*inherit\b)\s*([^;}]+)/g)].map((match) => match[1].trim()),
        ...[...html.matchAll(/(?<![-a-z])font\s*:\s*(?!inherit)[^;}]*?((?:"|')[^;}]+)/g)].map((match) => match[1].trim()),
      ]);
      expect([...declared]).toEqual([HUDDLE_FONT_STACK]);
      expect(html).toMatch(/font-synthesis:\s*none/);
    }
  });

  it("writes representative files that can be opened locally", async () => {
    const directory = path.resolve(process.cwd(), "..", "..", "docs", "exports", "part23-verification");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "complete-huddle.html"), createHuddleHtmlExport(huddle).html, "utf8");
    await writeFile(path.join(directory, "learning-plan.html"), createLearningPlanHtmlExport(plan).html, "utf8");
  });
});
