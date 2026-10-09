import type { HuddlePersona } from "@/features/huddle/types/huddlePersona.types";
import type { HuddleViewMode } from "@/features/huddle/store";

export interface TourStep { target: string; title: string; content: string }

const SHELL_TOP: TourStep[] = [
  { target: "brand", title: "AITO home", content: "Return to the application landing page from anywhere." },
  { target: "mode-toggle", title: "Choose your mode", content: "Switch between Workflow and Huddle while each module keeps its own experience." },
];

const WORKFLOW_SEARCH: TourStep = { target: "global-search", title: "Search", content: "Find activities, prompts, and tools from the current experience." };
const HUDDLE_SEARCH: TourStep = { target: "global-search", title: "Search Huddles", content: "Type two or more letters to find Huddles and tools. Choosing a result opens that Huddle in All Topics." };
const HELP: TourStep = { target: "help", title: "Page tips", content: "Reopen these tips any time. They change with your role and the tab you are on." };

/** Workflow tips are matched to the step on screen: a target that is not rendered is dropped when the tour opens. */
const WORKFLOW_CONTENT: TourStep[] = [
  { target: "workflow-progress", title: "Workflow steps", content: "Move through role selection, activity selection, and your generated workflow." },
  { target: "role-selection", title: "Choose your role", content: "Filter the API-backed role catalog by segment and select the role that matches your work." },
  { target: "workflow-benefits", title: "What you will get", content: "Review how AITO builds relevant activities, AI-tool guidance, and a balanced schedule." },
  { target: "activity-select-all", title: "Select or clear all", content: "Selects every activity that matches your filters, or clears them. You can still tick activities one by one." },
  { target: "activity-filters", title: "Filter activities", content: "Narrow the list by AI tool or by how long an activity takes." },
  { target: "saved-workflows", title: "My Workflows", content: "Open, update, copy, favorite, or delete workflows you saved." },
  { target: "activity-build", title: "Build My Day", content: "Turns your selected activities into a schedule. It stays disabled until you select at least one." },
  { target: "activity-list", title: "Choose activities", content: "Tick the activities you want in your day. Expand an activity to read its details before you decide." },
  { target: "workflow-navigation", title: "Edit or start again", content: "Edit Activities goes back to your selection. Start again begins a new workflow." },
  { target: "workflow-timeline-toggle", title: "Timeline range", content: "Switch your schedule between Day, Week, Month, Quarter, and Year." },
  { target: "workflow-view-tabs", title: "Schedule views", content: "Move between your filters, your day's schedule, and the full list of selected activities." },
  { target: "workflow-save", title: "Save your workflow", content: "Save this workflow to My Workflows. When you reopen a saved one you can Update it or Save As a copy." },
  { target: "workflow-calendar", title: "Add to my calendar", content: "Opens a review of your scheduled activities before anything is added to your calendar." },
];

/** Copy is written per role, because each one uses this page for a different job. A key a role does not have is simply not shown to that role. */
const HUDDLE_TIPS: Record<HuddlePersona, Record<string, string>> = {
  manager: {
    "huddle-role": "You are set up as a Manager. Switch experience here if you are standing in for someone else.",
    "huddle-sections": "Role Path is the recommended week-by-week plan for your team's role, and All Topics is where you build extra learning plans.",
    "huddle-launch-planner": "Opens the Launch Planner, for Managers only. Turn a start date into a launch timeline, readiness checklist, and communication package.",
    "huddle-audience": "Pick the audience role. The recommended Huddles change to match it. Use each week's menu to move, replace, or reset a Huddle.",
    "huddle-detail": "Check the outcome, resources, and takeaways so you know what your team walks away with.",
  },
  facilitator: {
    "huddle-role": "You are set up as a Facilitator. Switch experience here if your role changes.",
    "huddle-sections": "Role Path is the week-by-week sequence you run, and All Topics is where you assemble your own running order.",
    "huddle-audience": "Pick the audience you are facilitating for. The recommended Huddles follow that role. Use each week's menu to move, replace, or reset a Huddle.",
    "huddle-detail": "Open Resources and Takeaways before the session. This is your prep view.",
    "huddle-facilitator-hub": "Facilitators only. Opens the full-screen Facilitator Hub for the selected Huddle, with the talk track, phase timings, and activity checkpoints you run from. Use Save Progress to keep your place.",
  },
  "team-member": {
    "huddle-role": "You are set up as a Team Member. Switch experience here if your role changes.",
    "huddle-sections": "Role Path is your week-by-week plan, and All Topics has extra Huddles for your role.",
    "huddle-audience": "Pick your role so the recommended Huddles match the work you actually do. Use each week's menu to move, replace, or reset a Huddle.",
    "huddle-detail": "Read the outcome and today's objective before you start, so you know what you are aiming for.",
  },
};

const HUDDLE_LIST_TIPS: Record<HuddlePersona, Partial<Record<HuddleViewMode, string>>> = {
  manager: {
    guided: "Each card is one week of the plan. Select a card to open its details on the right.",
    evergreen: "Browse additional Huddles. Select a card to open its details on the right.",
  },
  facilitator: {
    guided: "Each card shows the week, activity count, and AI tools so you know how long a session will run. Select one to open it on the right.",
    evergreen: "Scan the activity counts to find a topic that fits the room. Select a card to open its details on the right.",
  },
  "team-member": {
    guided: "Each card is one week of your plan. Select a card to read its outcome and objective on the right.",
    evergreen: "Browse extra Huddles for your role. Select a card to read about it on the right.",
  },
};

const ROLE_NAMES: Record<HuddlePersona, string> = { manager: "Manager", facilitator: "Facilitator", "team-member": "Team Member" };

/** Only Managers and Facilitators receive a one-page guide with a Role Path / All Topics HTML download. */
const HTML_GUIDE_NOTE: Record<HuddlePersona, string> = {
  manager: " The one-page 'How to Lead a Huddle' guide also downloads and opens in a popup.",
  facilitator: " The one-page 'How a Huddle Runs' guide also downloads and opens in a popup.",
  "team-member": "",
};

type CommonTip = string | ((persona: HuddlePersona | null, viewMode: HuddleViewMode) => string | null);

/** Copy that is the same for every role, or that only varies a little. */
const COMMON_TIPS: Record<string, CommonTip> = {
  "huddle-breadcrumb": (_persona, viewMode) => viewMode === "orientation"
    ? "Home returns to the Huddle landing page, where you choose your experience. From Role Path or All Topics, select the role name here to come back to this onboarding page."
    : "Home returns to the Huddle landing page, where you choose your experience. The role name takes you back to your onboarding page.",
  "huddle-in-a-box": "Can't find your role, workflow, practice, or tool? Create your own Huddle opens Huddle in a Box. Download its HTML template, open it in your browser, then customize it and run it with your team.",
  "huddle-in-a-box-footer": "Same option as the header button. If the topics above don't cover what your team needs, open Huddle in a Box to download a template and create your own.",
  "huddle-resources": "Search and browse playbooks, guides, AI tool resources, facilitator support, and Huddle materials in one place.",
  "huddle-filters": "Pick one or more audiences, then narrow by Focus Area, AI Tool, or keyword. Sort by Role relevance or Most upvoted, or choose Only All Topics to hide the Role Path topics and show just the additional ones.",
  "huddle-continue": "Resume a Huddle you started. Continue reopens it in the full-screen workspace. If several are in progress, 'Show more in progress' expands the rest.",
  "huddle-plan-select": "Tick a topic to add it to your Custom Learning Plan and open its details. Your picks are saved for this role on this device. Once you tick one, the plan bar appears above the list.",
  "huddle-plan-card": "Your Custom Learning Plan. The badge shows how many topics you ticked. Build Learning Plan opens a dialog to reorder, remove, or export them, Export Learning Plan downloads the plan as HTML, and Clear Selection unticks everything.",
  "huddle-path-actions": "Reset restores the recommended Huddle for every week and is available once you customize the plan. Export Learning Plan downloads the whole path as an HTML file. A Customized badge appears when you change the plan.",
  "huddle-week-html": (persona) => `Downloads this week's Huddle as an HTML file without opening it first.${persona ? HTML_GUIDE_NOTE[persona] : ""}`,
  "huddle-card-html": (persona) => `Downloads this topic as an HTML file without opening it first, the same as the Role Path cards. To download the Huddle open on the right, use the HTML button in its panel.${persona ? HTML_GUIDE_NOTE[persona] : ""}`,
  "huddle-week-menu": "Manage Week. Move to week reorders this Huddle into another week. Replace Huddle swaps in a different Huddle from the catalog. Reset this week restores the recommended Huddle, and is available once the week is Customized.",
  "huddle-vote": "Thumbs up or down tells us which Huddles help. A thumbs down asks you for a reason. Select your vote again to remove it.",
  "huddle-coming-soon": "Weeks marked Coming soon have no Huddle yet. They can't be opened, moved, replaced, rated, or downloaded until they are released.",
  "huddle-detail-html": "Downloads the selected Huddle as an HTML file. Select a Huddle first, then use this button at the bottom of the panel.",
  "huddle-detail-coach": "Meet with a Coach is coming soon. For now it opens a Coming Soon message, and booking isn't available yet.",
  "huddle-onboarding-start": "Explore Role Path takes you to your week-by-week plan.",
  "huddle-onboarding-walkthrough": (persona) => persona === "manager"
    ? "Opens the one-page 'How to Lead a Huddle' guide as an image, with a Download button."
    : persona === "facilitator"
      ? "Opens the one-page 'How a Huddle Runs' guide as an image, with a Download button."
      : null,
  "huddle-onboarding-helps": (persona) => `A summary of how this app supports you as a ${persona ? ROLE_NAMES[persona] : "participant"}.`,
  "huddle-onboarding-timeline": "Your action plan: what to do at each stage of the program, in order.",
  "huddle-onboarding-rhythm": "What to do before, during, and after each Huddle, so the weekly routine stays consistent.",
  "huddle-onboarding-continue": "Ready to continue? Go straight to your Role Path, or choose Explore All Topics to browse additional Huddles.",
  "huddle-experience": "Choose how you take part: Manager, Facilitator, or Team Member. Everything after this is worded for that role.",
  "huddle-agents": "The core AI agents used across Frontier Accelerator, with what each one helps you do.",
  "huddle-journey": "The three connected steps of the motion: understand it, practice by role, then keep expanding through self-directed topics.",
  "huddle-readiness": "Complete these checks before your first role-based Huddle.",
};

const HUDDLE_TITLES: Record<string, string> = {
  "huddle-experience": "Choose your experience",
  "huddle-role": "Your experience",
  "huddle-breadcrumb": "Breadcrumb",
  "huddle-in-a-box": "Create your own Huddle",
  "huddle-in-a-box-footer": "Create your own Huddle",
  "huddle-sections": "The two sections",
  "huddle-launch-planner": "Launch Planner",
  "huddle-audience": "Audience",
  "huddle-filters": "Filters and sorting",
  "huddle-continue": "Continue Learning",
  "huddle-plan-select": "Select topics",
  "huddle-plan-card": "Custom Learning Plan",
  "huddle-path-actions": "Role Path actions",
  "huddle-list": "Huddle list",
  "huddle-week-html": "Download as HTML",
  "huddle-card-html": "Download as HTML",
  "huddle-week-menu": "Manage this week",
  "huddle-vote": "Rate a Huddle",
  "huddle-coming-soon": "Coming soon weeks",
  "huddle-detail": "Selected Huddle",
  "huddle-detail-html": "HTML",
  "huddle-facilitator-hub": "Facilitator Hub",
  "huddle-detail-coach": "Meet with a Coach",
  "huddle-resources": "Resources library",
  "huddle-onboarding-start": "Start here",
  "huddle-onboarding-walkthrough": "HTML Walkthrough",
  "huddle-onboarding-helps": "How this app helps",
  "huddle-onboarding-timeline": "Your action plan",
  "huddle-onboarding-rhythm": "The Huddle rhythm",
  "huddle-onboarding-continue": "Ready to continue?",
  "huddle-agents": "Top 5 Agents",
  "huddle-journey": "Learning journey",
  "huddle-readiness": "Before you begin",
};

/** Returns null when the role has no copy for this target, so the step is left out for that role. */
function huddleStep(persona: HuddlePersona | null, viewMode: HuddleViewMode, target: string): TourStep | null {
  const common = COMMON_TIPS[target];
  const resolvedCommon = typeof common === "function" ? common(persona, viewMode) : common;
  const content = (persona ? HUDDLE_TIPS[persona][target] : undefined)
    ?? (target === "huddle-list" && persona ? HUDDLE_LIST_TIPS[persona][viewMode] : undefined)
    ?? resolvedCommon;
  return content ? { target, title: HUDDLE_TITLES[target] ?? target, content } : null;
}

function huddleSteps(persona: HuddlePersona | null, viewMode: HuddleViewMode, targets: string[]): TourStep[] {
  return targets.map((target) => huddleStep(persona, viewMode, target)).filter((step): step is TourStep => step !== null);
}

/** The header actions every Huddle page shares. Launch Planner is only rendered for Managers. */
const HUDDLE_HEADER_TARGETS = ["huddle-breadcrumb", "huddle-in-a-box", "huddle-launch-planner", "huddle-resources"];

const HUDDLE_DETAIL_TARGETS = ["huddle-detail", "huddle-detail-html", "huddle-facilitator-hub", "huddle-detail-coach"];

/** Page tips per tab, in the order the controls appear on screen. */
const HUDDLE_PAGE_TARGETS: Record<HuddleViewMode, string[]> = {
  orientation: [
    ...HUDDLE_HEADER_TARGETS,
    "huddle-sections",
    "huddle-onboarding-start",
    "huddle-onboarding-walkthrough",
    "huddle-onboarding-helps",
    "huddle-onboarding-timeline",
    "huddle-onboarding-rhythm",
    "huddle-onboarding-continue",
  ],
  guided: [
    ...HUDDLE_HEADER_TARGETS,
    "huddle-sections",
    "huddle-audience",
    "huddle-path-actions",
    "huddle-list",
    "huddle-week-html",
    "huddle-vote",
    "huddle-week-menu",
    "huddle-coming-soon",
    ...HUDDLE_DETAIL_TARGETS,
  ],
  evergreen: [
    ...HUDDLE_HEADER_TARGETS,
    "huddle-sections",
    "huddle-filters",
    "huddle-continue",
    "huddle-plan-card",
    "huddle-list",
    "huddle-plan-select",
    "huddle-card-html",
    "huddle-vote",
    ...HUDDLE_DETAIL_TARGETS,
    "huddle-in-a-box-footer",
  ],
};

/** Shown before an experience is chosen, so there is no role to word the copy for. */
const HUDDLE_LANDING_TARGETS = ["huddle-in-a-box", "huddle-resources", "huddle-agents", "huddle-experience", "huddle-journey", "huddle-readiness"];

const LAUNCH_PLANNER_STEPS: TourStep[] = [
  { target: "planner-config", title: "Configure your launch", content: "Fill in your team, cohort, start date, sponsor, and program lead. These are required. End date, managers, and facilitators are optional." },
  { target: "planner-generate", title: "Generate the plan", content: "Generate launch plan builds your timeline, readiness checklist, and communications once the required fields are filled in." },
  { target: "planner-export", title: "Export launch package", content: "Available after you generate a plan. Downloads one HTML package you can share or print to PDF." },
  { target: "planner-status", title: "Readiness and setup", content: "Launch readiness shows your progress. Edit setup returns to the form, and Reset planner clears the plan after you confirm." },
  { target: "planner-next", title: "What to do next", content: "Your next milestones. Select one to open its checklist and communication templates." },
  { target: "planner-views", title: "Timeline or calendar", content: "Switch between a Timeline and a Calendar of the launch plan. Select any item to open its communication assets." },
];

/** Shown in place of the role-worded step until an experience is chosen. */
const CHOOSE_ROLE_STEP: TourStep = {
  target: "huddle-role",
  title: "Your experience",
  content: "Pick how you take part: Manager, Facilitator, or Team Member. The rest of the page follows that choice.",
};

interface ResolveTourStepsInput {
  isHuddleRoute: boolean;
  persona: HuddlePersona | null;
  viewMode: HuddleViewMode;
  pathname: string;
}

/** The application shell: navigation, mode switching, search, and this help control. */
export function resolveLayoutSteps({ isHuddleRoute, persona, viewMode }: ResolveTourStepsInput): TourStep[] {
  const roleStep = persona ? huddleStep(persona, viewMode, "huddle-role") : null;
  const moduleHeader = isHuddleRoute ? [roleStep ?? CHOOSE_ROLE_STEP] : [];
  return [...SHELL_TOP, ...moduleHeader, isHuddleRoute ? HUDDLE_SEARCH : WORKFLOW_SEARCH, HELP];
}

/**
 * What is on the page right now, worded for the signed-in role. Targets that are absent
 * are dropped by the caller, so conditional controls need no special casing here.
 */
export function resolvePageSteps({ isHuddleRoute, persona, viewMode, pathname }: ResolveTourStepsInput): TourStep[] {
  if (!isHuddleRoute) return WORKFLOW_CONTENT;
  if (pathname.startsWith("/huddle/launch-planner")) return LAUNCH_PLANNER_STEPS;
  if (!persona) return huddleSteps(null, viewMode, HUDDLE_LANDING_TARGETS);
  return huddleSteps(persona, viewMode, HUDDLE_PAGE_TARGETS[viewMode]);
}
