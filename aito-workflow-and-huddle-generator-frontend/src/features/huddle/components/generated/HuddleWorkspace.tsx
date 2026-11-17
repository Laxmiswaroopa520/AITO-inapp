import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  Flag,
  Home,
  Info,
  Layers,
  Lightbulb,
  ChevronDown,
  ListChecks,
  MessageSquare,
  MoreHorizontal,
  Sparkles,
  PanelLeftClose,
  StickyNote,
  Target,
  UserRound,
  Users,
  Compass,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMPT_COPIED_MESSAGE, showToast } from "@/components/feedback/showToast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type {
  HuddlePresentationActivity,
  HuddlePresentationModel,
  HuddlePresentationResource,
  HuddleSessionResponse,
} from "../../types";
import { HubBadge, HuddleTalkTrackPanel, hubTheme, type HubTheme, type HuddleHubKind } from "../talk-track";
import { summarizeTools } from "./summarizeTools";
import { hubGuidanceUnavailableMessage, hubHasGuidance, hubStageForPhase, hubStageGuidance, hubStageLabel, type HubGuidanceItem, type HubGuidanceTone } from "./hubStageContent";
import { createHuddleSessionProgressSummary } from "../progress/huddleSessionProgress";

type WorkspaceSection = "overview" | "share-experience" | "activities" | "resources";

interface HuddleWorkspaceProps {
  model: HuddlePresentationModel;
  session: HuddleSessionResponse | null | undefined;
  sessionLoading: boolean;
  sessionError: Error | null;
  mutationPending: boolean;
  onRefreshSession: () => Promise<HuddleSessionResponse | null | undefined>;
  onSaveSession: (currentPhaseExternalId: string | null, facilitatorNotes: string | null) => Promise<HuddleSessionResponse>;
  onSetActivityCompletion: (activityExternalId: string, isCompleted: boolean, currentPhaseExternalId: string | null, facilitatorNotes: string | null) => Promise<HuddleSessionResponse>;
  onCompleteSession: () => Promise<HuddleSessionResponse>;
  /** Absent for Team Members, who are not offered a coach; the coach card and button are then hidden. */
  onMeetCoach?: () => void;
  onPreviewSlides: () => void;
  onClose: () => void;
  /** The hub that opened this workspace; the Manager Hub shows the manager talk track. */
  hub?: HuddleHubKind;
}

// Temporarily hidden. Set to true to bring back the Preview slides and PowerPoint footer buttons.
const SHOW_SLIDE_EXPORTS = false;
// Share Your Experience is participant-facing session content, not Facilitator or Manager Hub
// guidance, so the hubs do not show it. The section and its copy are kept; set to true to restore it.
const SHOW_SHARE_YOUR_EXPERIENCE = false;

/*
 * Layout: a header (hub badge, title, actions, then a compact stats and progress row), a three
 * column body (Huddle Guide navigation, the selected section, the session side panel) and a
 * footer. Below the lg breakpoint the two side columns give way to a section switcher at the top
 * of the content and the side panel's notes and key takeaway below it, so nothing is lost on a
 * narrow screen. Only presentation lives here; content comes from the presentation model and
 * hubStageContent exactly as before.
 */

function OptionalContent({ value }: { value: string | null }) {
  return value ? <p className="mt-2 text-sm leading-6 text-[#424242]">{value}</p> : <p className="mt-2 text-sm text-[#707070]">Content unavailable</p>;
}

function ResourceLink({ resource }: { resource: HuddlePresentationResource }) {
  const content = <><BookOpen className="h-4 w-4" /><span>{resource.title}</span>{resource.url && <ExternalLink className="h-3.5 w-3.5" />}</>;
  const className = "inline-flex items-center gap-2 rounded-lg border border-[#D1DCE6] bg-white px-3 py-2 text-sm font-medium text-[#0F6CBD] transition-colors hover:border-[#8DC8E8] hover:bg-[#F5F9FF]";
  return resource.url ? <a className={className} href={resource.url} target="_blank" rel="noreferrer">{content}</a> : <span className={cn(className, "cursor-default text-[#616161] hover:border-[#D1DCE6] hover:bg-white")}>{content}</span>;
}

/** A white content card, the basic container on every hub page. */
function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("rounded-xl border border-[#E1E7EF] bg-white shadow-[0_1px_2px_rgba(22,35,58,0.04)]", className)}>{children}</section>;
}

/** Card heading with an optional leading icon in a soft blue tile. */
function PanelTitle({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return <h4 className="flex items-center gap-2.5 text-[15px] font-semibold text-[#16233A]">{icon && <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#F0F6FC] text-[#0F6CBD]" aria-hidden="true">{icon}</span>}{children}</h4>;
}

/** Page heading used by every section: a small eyebrow, the title and an optional lead paragraph. */
function SectionHeader({ eyebrow, title, theme, children }: { eyebrow: string; title: ReactNode; theme: HubTheme; children?: ReactNode }) {
  return (
    <div>
      <p className={cn("text-xs font-semibold uppercase tracking-[0.08em]", theme.text)}>{eyebrow}</p>
      <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#16233A]">{title}</h3>
      {children}
    </div>
  );
}

/**
 * One activity, collapsed to a single row until opened.
 *
 * Extended activities carry no completion control: only Featured activities count as the session's
 * work, so ticking an Extended card would inflate a total nobody is expected to reach inside a
 * fifteen-minute segment.
 */
function ActivityCard({ activity, ordinal, completed, disabled, fallbackResources, onToggle, onViewResources }: { activity: HuddlePresentationActivity; ordinal: number; completed: boolean; disabled: boolean; fallbackResources: readonly HuddlePresentationResource[]; onToggle: () => void; onViewResources: () => void }) {
  const [open, setOpen] = useState(false);
  const isFeatured = activity.practiceTier !== "Extended";
  const primaryAgent = activity.agents[0];
  const secondaryAgents = activity.agents.slice(1);
  // The activity's own entry point wins over the agent's generic one. Both can be absent, in which
  // case no launch button renders rather than a dead link.
  const accessUrl = activity.launchUrl ?? (primaryAgent?.showAccessLink ? primaryAgent.accessUrl : null);
  const openLabel = activity.launchLabel ?? (primaryAgent ? `Open in ${primaryAgent.name}` : "Open AI Tool");
  const cardResources = activity.resources.length > 0 ? activity.resources : fallbackResources;
  const toggleOpen = () => setOpen((value) => !value);
  const showDone = isFeatured && completed;

  return (
    // The left accent is an inset shadow, not a border color: the global `*` border-color rule in
    // styles/index.css is unlayered, so it wins over Tailwind border-color utilities.
    <article className={cn("overflow-hidden rounded-xl border bg-white transition-shadow",
      showDone ? "shadow-[inset_4px_0_0_#107C10,0_1px_2px_rgba(22,35,58,0.04)]" : open ? "shadow-[inset_4px_0_0_#0F6CBD,0_4px_14px_rgba(15,108,189,0.10)]" : isFeatured ? "shadow-[inset_4px_0_0_#8DC8E8,0_1px_2px_rgba(22,35,58,0.04)] hover:shadow-[inset_4px_0_0_#0F6CBD,0_4px_14px_rgba(22,35,58,0.06)]" : "shadow-[inset_4px_0_0_#C9D3DD,0_1px_2px_rgba(22,35,58,0.04)] hover:shadow-[inset_4px_0_0_#8A96A3,0_4px_14px_rgba(22,35,58,0.06)]")}>
      {/* A click anywhere on the card header expands or collapses it. The title button keeps it
          reachable by keyboard; its click bubbles here. The action buttons stop their clicks from
          reaching this handler, so they never toggle the card. */}
      <div className="cursor-pointer p-4" onClick={toggleOpen}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span aria-hidden="true" className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold", showDone ? "bg-[#E9F5E9] text-[#0B6A0B]" : isFeatured ? "bg-[#E8F2FF] text-[#0F6CBD]" : "bg-[#F1F3F6] text-[#616161]")}>{showDone ? <Check className="h-3.5 w-3.5" /> : ordinal}</span>
            <button type="button" aria-expanded={open} className="min-w-0 flex-1 text-left">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold leading-6 text-[#16233A]">{activity.name}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", isFeatured ? "bg-[#E8F2FF] text-[#0F6CBD]" : "bg-[#F1F3F6] text-[#616161]")}>{isFeatured ? "Featured" : "Extended"}</span>
              </span>
            </button>
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 pl-10 sm:pl-0" onClick={(event) => event.stopPropagation()}>
            {accessUrl && <Button asChild variant="outline" size="sm" className="hidden border-[#C7E0F4] bg-white text-[#0F6CBD] hover:bg-[#E8F2FF] sm:inline-flex"><a href={accessUrl} target="_blank" rel="noreferrer"><Bot className="mr-2 h-4 w-4" />{openLabel}<ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>}
            {/* Featured activities carry a named action. An unlabelled circle did not tell a
                facilitator what to do, and Extended activities are optional so they get none. */}
            {isFeatured && <Button variant="outline" size="sm" disabled={disabled} onClick={onToggle} aria-pressed={completed} title={completed ? "Mark this activity incomplete" : "Mark this activity complete"} className={cn("flex-shrink-0 disabled:cursor-wait", completed ? "border-[#107C10]/40 bg-[#E9F5E9] text-[#0B6A0B] hover:bg-[#DBEEDB]" : "border-[#0F6CBD] bg-white text-[#0F6CBD] hover:bg-[#E8F2FF]")}>{completed ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}{completed ? "Completed" : "Mark Complete"}</Button>}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#616161]" aria-label={`More options for ${activity.name}`}><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-52">
                {isFeatured && <DropdownMenuItem disabled={disabled} onClick={onToggle}><Check className="mr-2 h-4 w-4" />{completed ? "Mark Incomplete" : "Mark Complete"}</DropdownMenuItem>}
                <DropdownMenuItem disabled={!activity.prompt} onClick={() => { if (activity.prompt) void navigator.clipboard.writeText(activity.prompt).then(() => showToast(PROMPT_COPIED_MESSAGE)); }}><Copy className="mr-2 h-4 w-4" />Copy Prompt</DropdownMenuItem>
                <DropdownMenuItem disabled={!accessUrl} onClick={() => { if (accessUrl) window.open(accessUrl, "_blank", "noopener,noreferrer"); }}><Bot className="mr-2 h-4 w-4" />{openLabel}</DropdownMenuItem>
                <DropdownMenuItem disabled={cardResources.length === 0} onClick={onViewResources}><BookOpen className="mr-2 h-4 w-4" />View Resources</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button type="button" onClick={toggleOpen} aria-label={open ? `Collapse ${activity.name}` : `Expand ${activity.name}`} aria-expanded={open} className="flex h-8 w-8 items-center justify-center rounded-full text-[#616161] transition-colors hover:bg-[#F1F3F6]"><ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} /></button>
          </div>
        </div>

        <div className="pl-10">
          {activity.description && <p className="mt-1 text-sm leading-6 text-[#53606E]">{activity.description}</p>}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#616161]">
            {activity.durationMinutes !== null && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activity.durationMinutes} min</span>}
            {primaryAgent && <span className="inline-flex items-center gap-1 rounded-md border border-[#0F6CBD]/20 bg-[#F0F6FC] px-2 py-0.5 font-medium text-[#0F6CBD]"><Bot className="h-3 w-3" aria-hidden="true" />AI Tool: {primaryAgent.displayLabel?.trim() || primaryAgent.name}</span>}
            {secondaryAgents.map((agent) => <span key={agent.externalId} className="rounded-md border border-[#E1E7EF] bg-white px-2 py-0.5">{agent.displayLabel?.trim() || agent.name}</span>)}
            {activity.prerequisiteActivityName && <span className="rounded-md border border-[#E4D3C3] bg-[#F7F0EA] px-2 py-0.5 text-[#704214]">Requires output from: {activity.prerequisiteActivityName}</span>}
          </div>
        </div>
      </div>

      {open && (
        <div className="space-y-3 border-t border-[#E6ECF2] bg-[#FAFBFD] p-4 sm:pl-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#707070]">Activity {ordinal}</p>
          {/* Context Required and Why this matters come before the prompt, as in the HTML export. */}
          {(activity.requiredContext || activity.whyThisMatters) && <div className="grid gap-3 md:grid-cols-2">
            <ActivityField label="Context Required" value={activity.requiredContext} />
            <ActivityField label="Why this matters" value={activity.whyThisMatters} />
          </div>}
          {activity.prompt && <section className="rounded-lg border border-[#C7E0F4] bg-white px-4 py-3"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#0F6CBD]">Prompt</p><button type="button" onClick={() => void navigator.clipboard.writeText(activity.prompt!).then(() => showToast(PROMPT_COPIED_MESSAGE))} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-[#242424] transition-colors hover:bg-[#F0F6FC] hover:text-[#0F6CBD]"><Copy className="h-3.5 w-3.5" />Copy</button></div><p className="mt-1.5 whitespace-pre-wrap rounded-md bg-[#F7FAFD] px-3 py-2 text-sm leading-6 text-[#242424]">{activity.prompt}</p></section>}
          {activity.activitySteps.length > 0 && <section className="rounded-lg border border-[#E1E7EF] bg-white px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#616161]">How to practice</p><ol className="mt-2 space-y-2">{activity.activitySteps.map((step, index) => <li key={index} className="flex gap-2.5 text-sm leading-6 text-[#242424]"><span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0F6CBD] text-[11px] font-semibold text-white">{index + 1}</span><span>{step}</span></li>)}</ol></section>}
          <div className="grid gap-3 md:grid-cols-2">
            <ActivityField label="Expected output" value={activity.expectedOutput} tone="blue" />
            <ActivityField label="Human checkpoint" value={activity.humanCheckpoint} tone="tan" />
            {/* Best-fit job is deliberately not rendered. Removed on the manager's instruction;
                the value still flows through the API and the presentation model. */}
          </div>
          {cardResources.length > 0 && <div className="pt-1"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#616161]">Resources</p><div className="flex flex-wrap gap-2">{cardResources.map((resource) => <ResourceLink key={resource.externalId} resource={resource} />)}</div></div>}
        </div>
      )}
    </article>
  );
}

function ActivityField({ label, value, tone = "default" }: { label: string; value: string | null; tone?: "default" | "blue" | "tan" }) {
  if (!value) return null;
  return <section className={cn("rounded-lg border bg-white py-3 pl-5 pr-4", tone === "blue" && "bg-[#F7FBFF] shadow-[inset_3px_0_0_#0F6CBD]", tone === "tan" && "bg-[#FCF8F4] shadow-[inset_3px_0_0_#A0673A]", tone === "default" && "shadow-[inset_3px_0_0_#C9D3DD]")}><p className={cn("text-xs font-semibold uppercase tracking-wide", tone === "blue" ? "text-[#0F6CBD]" : tone === "tan" ? "text-[#704214]" : "text-[#616161]")}>{label}</p><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[#242424]">{value}</p></section>;
}

export function HuddleWorkspace({ model, session, sessionLoading, sessionError, mutationPending, onRefreshSession, onSaveSession, onSetActivityCompletion, onCompleteSession, onMeetCoach, onPreviewSlides, onClose, hub = "facilitator" }: HuddleWorkspaceProps) {
  // The hub always opens on Overview so the facilitator starts from the summary of what the Huddle
  // covers. The phase below is still pre-selected, so Huddle Flow opens where the session left off.
  const [section, setSection] = useState<WorkspaceSection>("overview");
  const [activePhaseId, setActivePhaseId] = useState<string | null>(() =>
    session?.currentPhaseExternalId && model.phases.some((phase) => phase.externalId === session.currentPhaseExternalId)
      ? session.currentPhaseExternalId
      // Open on the first phase that actually holds activities. Preparation and Commit to Action
      // carry narrative only in this content model, so landing on phase one showed an empty panel.
      : (model.phases.find((phase) => phase.activities.length > 0) ?? model.phases[0])?.externalId ?? null);
  const [guideCollapsed, setGuideCollapsed] = useState(false);
  const [notes, setNotes] = useState(session?.facilitatorNotes ?? "");
  const [talkTrackOpen, setTalkTrackOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingHtml, setExportingHtml] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const theme = hubTheme(hub);
  const activePhase = model.phases.find((phase) => phase.externalId === activePhaseId) ?? model.phases[0] ?? null;
  const activityCount = useMemo(() => model.phases.reduce((total, phase) => total + phase.activities.length, 0), [model.phases]);
  // Only Featured activities are completable, so they form the progress denominator. The chip
  // above still reports every activity in the placement. The server agrees: the session read is
  // scoped to this placement and to the Featured tier, so validActivityCount matches this number.
  const featuredActivityCount = useMemo(
    () => model.phases.reduce((total, phase) => total + phase.activities.filter((activity) => activity.practiceTier !== "Extended").length, 0),
    [model.phases]);
  const agents = useMemo(() => {
    const unique = new Map([...model.agents.primary, ...model.agents.secondary, ...model.agents.unclassified].map((agent) => [agent.externalId, agent]));
    model.phases.forEach((phase) => phase.activities.forEach((activity) => activity.agents.forEach((agent) => unique.set(agent.externalId, agent))));
    return [...unique.values()];
  }, [model]);
  const allResources = useMemo(() => {
    const unique = new Map(model.resources.map((resource) => [resource.externalId, resource]));
    model.phases.forEach((phase) => phase.activities.forEach((activity) => activity.resources.forEach((resource) => unique.set(resource.externalId, resource))));
    return [...unique.values()].sort((left, right) => left.displayOrder - right.displayOrder || left.externalId.localeCompare(right.externalId));
  }, [model]);
  const progressSummary = useMemo(() => createHuddleSessionProgressSummary(session, featuredActivityCount), [featuredActivityCount, session]);

  const saveProgress = async () => {
    setFeedback(null);
    try {
      await onSaveSession(activePhaseId, notes || null);
      setFeedback({ kind: "success", message: "Progress saved." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to save progress." });
    }
  };

  const toggleActivity = async (activityExternalId: string, isCompleted: boolean) => {
    setFeedback(null);
    try {
      await onSetActivityCompletion(activityExternalId, isCompleted, activePhaseId, notes || null);
      setFeedback({ kind: "success", message: isCompleted ? "Activity marked complete." : "Activity marked incomplete." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to update the activity." });
    }
  };

  const completeHuddle = async () => {
    setFeedback(null);
    try {
      await onCompleteSession();
      setFeedback({ kind: "success", message: "Huddle completed successfully." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to complete the Huddle." });
    }
  };

  const refreshSession = async () => {
    const refreshed = await onRefreshSession();
    if (!refreshed) return;
    setNotes(refreshed.facilitatorNotes ?? "");
    if (refreshed.currentPhaseExternalId && model.phases.some((phase) => phase.externalId === refreshed.currentPhaseExternalId)) {
      setActivePhaseId(refreshed.currentPhaseExternalId);
    }
    setFeedback({ kind: "success", message: "Progress refreshed." });
  };

  const downloadPowerPoint = async () => {
    setFeedback(null);
    setExporting(true);
    try {
      const { exportHuddlePowerPoint } = await import("../../exports/powerpoint");
      await exportHuddlePowerPoint(model);
      setFeedback({ kind: "success", message: "PowerPoint exported." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to export the PowerPoint." });
    } finally {
      setExporting(false);
    }
  };

  const downloadHtml = async () => {
    setFeedback(null);
    setExportingHtml(true);
    try {
      const { exportHuddleHtml } = await import("../../exports/html");
      exportHuddleHtml(model);
      setFeedback({ kind: "success", message: "HTML exported." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to export HTML." });
    } finally {
      setExportingHtml(false);
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [onClose]);

  const stats = [
    { label: "Duration", value: model.identity.durationMinutes === null ? "Unavailable" : `${model.identity.durationMinutes} min`, icon: Clock },
    { label: "Phases", value: String(model.phases.length), icon: Layers },
    { label: "Activities", value: String(activityCount), icon: ListChecks },
    { label: "AI tools", value: String(agents.length), icon: Bot },
  ];
  const completeTitle = progressSummary.canComplete
    ? progressSummary.completesAtSessionLevel ? "This Huddle has no featured activities to tick off. Complete it when the session is done." : undefined
    : progressSummary.completesAtSessionLevel ? "This Huddle is already complete" : "Complete every featured activity first";
  const progressLabel = progressSummary.completesAtSessionLevel
    ? session?.sessionStatus === "Completed" ? "Huddle complete" : "No featured activities to tick off"
    : `${progressSummary.completedCount} of ${progressSummary.totalCount} activities complete`;

  const coachCard = (
    <Panel className="overflow-hidden border-[#C7E0F4]">
      <div className="bg-[#F5F9FF] p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#0F6CBD] ring-1 ring-[#C7E0F4]" aria-hidden="true"><UserRound className="h-4 w-4" /></span>
          <div className="min-w-0">
            <h3 className="font-semibold text-[#16233A]">Need a Coach?</h3>
            <p className="mt-1 text-xs leading-5 text-[#53657D]">Get practical guidance for adapting and facilitating this Huddle.</p>
          </div>
        </div>
        <Button className="mt-3 w-full bg-[#0F6CBD] text-white hover:bg-[#115EA3]" onClick={onMeetCoach}>
          <UserRound className="mr-2 h-4 w-4" />Request Coaching Assistance
        </Button>
      </div>
    </Panel>
  );
  const notesCard = (
    <Panel className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><StickyNote className="h-4 w-4 text-[#0F6CBD]" /><h3 className="font-semibold text-[#16233A]">My Notes</h3></div>
        <span className="rounded-full border border-[#E1E7EF] bg-[#F7F9FB] px-2 py-0.5 text-[10px] font-medium text-[#616161]">Private</span>
      </div>
      <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Write down your thoughts, reminders, or anything you'd like to revisit later..." className="min-h-[140px] w-full resize-y rounded-lg border border-[#E4D3C3] bg-[#FFFDF5] p-3 text-sm leading-6 outline-none transition-colors placeholder:text-[#8A8F98] focus:border-[#0F6CBD] focus:ring-2 focus:ring-[#0F6CBD]/20" />
      <p className="mt-2 text-[11px] leading-4 text-[#707070]">Your notes are private and saved for future reference.</p>
    </Panel>
  );
  const takeawayCard = (
    <Panel className="border-[#CFE5D6] bg-[#F5FBF7] p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-[#0F6CBD]"><Lightbulb className="h-4 w-4 text-[#1A6B42]" aria-hidden="true" />Key takeaway</p>
      <OptionalContent value={model.keyTakeaway} />
    </Panel>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label={`${model.identity.name} workspace`} className="fixed inset-0 z-50 flex h-dvh w-screen flex-col overflow-hidden bg-[#F4F6F9] text-[#242424]">
      <header className="flex-shrink-0 border-b border-[#E1E7EF] bg-white">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-6">
          <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-[#424242]" onClick={onClose} aria-label="Exit generated Huddle"><X className="h-4 w-4" /></Button>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2.5">
              <HubBadge hub={hub} className="hidden sm:inline-flex" />
              <h2 className="truncate text-lg font-semibold text-[#16233A] lg:text-xl" title={model.identity.name}>{model.identity.name}</h2>
            </div>
            {model.identity.description && <p className="mt-0.5 hidden truncate text-sm text-[#616161] sm:block" title={model.identity.description}>{model.identity.description}</p>}
          </div>
          {/* On phones the title needs the width; Save Progress and Complete Huddle stay in the footer. */}
          <div className="hidden flex-shrink-0 items-center gap-2 pl-2 sm:flex">
            <Button variant="outline" size="sm" className="border-[#D1DCE6] text-[#242424]" disabled={sessionLoading || mutationPending} onClick={() => void saveProgress()}><FileText className="mr-2 h-4 w-4" />{mutationPending ? "Saving..." : "Save Progress"}</Button>
            <Button size="sm" disabled={!progressSummary.canComplete || mutationPending} title={completeTitle} onClick={() => void completeHuddle()} className="flex-shrink-0 bg-[#0F6CBD] text-white hover:bg-[#115EA3]"><CheckCircle2 className="mr-2 h-4 w-4" />Complete Huddle</Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#EEF2F6] bg-[#FAFBFD] px-4 py-2.5 lg:px-6">
          <HubBadge hub={hub} className="sm:hidden" />
          <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#0F6CBD] ring-1 ring-[#E1E7EF]" aria-hidden="true"><Icon className="h-3.5 w-3.5" /></span>
                <div className="flex flex-col-reverse leading-tight"><dt className="text-[10px] font-medium uppercase tracking-wide text-[#707070]">{label}</dt><dd className="text-sm font-semibold text-[#16233A]">{value}</dd></div>
              </div>
            ))}
          </dl>
          <div className="w-full sm:ml-auto sm:w-72">
            <div className="mb-1 flex justify-between text-xs text-[#616161]"><span>{progressLabel}</span><span className="font-semibold text-[#16233A]">{progressSummary.percentage}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-[#E3E8EE]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressSummary.percentage} aria-label="Huddle progress"><div className={cn("h-full rounded-full transition-all", progressSummary.percentage === 100 ? "bg-[#107C10]" : "bg-[#0F6CBD]")} style={{ width: `${progressSummary.percentage}%` }} /></div>
          </div>
        </div>
      </header>

      <div className={cn("relative grid min-h-0 flex-1", guideCollapsed ? "lg:grid-cols-[72px_minmax(0,1fr)_312px]" : "lg:grid-cols-[248px_minmax(0,1fr)_312px]")}>
        <aside className="hidden min-h-0 flex-col border-r border-[#E1E7EF] bg-white lg:flex">
          <div className={cn("flex items-center px-4 pb-2 pt-4", guideCollapsed ? "justify-center px-2" : "justify-between")}>
            {!guideCollapsed && <p className="text-sm font-semibold text-[#16233A]">Huddle Guide</p>}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#616161]" onClick={() => setGuideCollapsed((value) => !value)} aria-label="Toggle Huddle Guide"><PanelLeftClose className={cn("h-4 w-4 transition-transform", guideCollapsed && "rotate-180")} /></Button>
          </div>
          <nav aria-label="Huddle Guide" className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <div className="space-y-1">
              <WorkspaceNavButton active={section === "overview"} collapsed={guideCollapsed} theme={theme} icon={<Home className="h-4 w-4" />} label="Overview" onClick={() => setSection("overview")} />
              {SHOW_SHARE_YOUR_EXPERIENCE && <WorkspaceNavButton active={section === "share-experience"} collapsed={guideCollapsed} theme={theme} icon={<Sparkles className="h-4 w-4" />} label="Share Your Experience" onClick={() => setSection("share-experience")} />}
            </div>
            {!guideCollapsed && <p className="px-3 pb-2 pt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#707070]">Huddle Flow</p>}
            <ol className={cn("relative", guideCollapsed && "mt-4")}>
              {model.phases.map((phase, index) => {
                const featuredInPhase = phase.activities.filter((activity) => activity.practiceTier !== "Extended");
                const completedInPhase = featuredInPhase.filter((activity) => progressSummary.completedActivityIds.has(activity.externalId)).length;
                const active = section === "activities" && activePhase?.externalId === phase.externalId;
                const label = hubStageLabel(phase.name);
                return (
                  <li key={phase.externalId} className="relative">
                    {index < model.phases.length - 1 && <span aria-hidden="true" className={cn("absolute top-[38px] h-[calc(100%-22px)] w-px bg-[#D1DCE6]", guideCollapsed ? "left-1/2" : "left-[27px]")} />}
                    <button type="button" title={guideCollapsed ? label : undefined} aria-current={active ? "step" : undefined} onClick={() => { setActivePhaseId(phase.externalId); setSection("activities"); }} className={cn("relative flex w-full items-center gap-3 rounded-lg py-2.5 text-left transition-colors", guideCollapsed ? "justify-center px-0" : "px-3", active ? cn(theme.soft, theme.border, theme.text) : "text-[#424242] hover:bg-[#F4F6F9]")}>
                      <span className={cn("relative z-[1] flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold", active ? theme.solid : "bg-white text-[#424242] ring-1 ring-[#C9D3DD]")}>{index + 1}</span>
                      {!guideCollapsed && <span className="flex min-w-0 flex-1 items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{label}</span>{phase.name === "Explore and Practice" && <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", featuredInPhase.length > 0 && completedInPhase === featuredInPhase.length ? "bg-[#E9F5E9] text-[#0B6A0B]" : "bg-[#F1F3F6] text-[#616161]")}>{completedInPhase}/{featuredInPhase.length}</span>}</span>}
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className={cn("mt-4 border-t border-[#EEF2F6] pt-3", guideCollapsed && "flex justify-center")}>
              <button type="button" onClick={() => setTalkTrackOpen(true)} aria-expanded={talkTrackOpen} title={guideCollapsed ? "Talk Track" : undefined} aria-label={guideCollapsed ? "Talk Track" : undefined} className={cn("flex items-center gap-3 rounded-lg text-left text-sm font-semibold transition-colors", guideCollapsed ? "h-10 w-10 justify-center" : "w-full px-3 py-2.5", talkTrackOpen ? "bg-[#0F6CBD] text-white" : "bg-[#F5F9FF] text-[#0F6CBD] ring-1 ring-inset ring-[#C7E0F4] hover:bg-[#E8F2FF]")}>
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                {!guideCollapsed && <span className="min-w-0"><span className="block">Talk Track</span><span className={cn("block text-[11px] font-normal", talkTrackOpen ? "text-white/80" : "text-[#53657D]")}>{hub === "manager" ? "Manager script for this Huddle" : "Facilitator script for this Huddle"}</span></span>}
              </button>
            </div>
          </nav>
          <div className="border-t border-[#E1E7EF] p-2">
            <WorkspaceNavButton active={section === "resources"} collapsed={guideCollapsed} theme={theme} icon={<BookOpen className="h-4 w-4" />} label="Resources" onClick={() => setSection("resources")} />
          </div>
        </aside>

        <main className="min-h-0 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex gap-1 overflow-x-auto rounded-lg border border-[#E1E7EF] bg-white p-1 lg:hidden" aria-label="Huddle sections">
              <MobileNav label="Overview" active={section === "overview"} onClick={() => setSection("overview")} />
              {SHOW_SHARE_YOUR_EXPERIENCE && <MobileNav label="Share Your Experience" active={section === "share-experience"} onClick={() => setSection("share-experience")} />}
              <MobileNav label="Talk Track" active={talkTrackOpen} onClick={() => setTalkTrackOpen(true)} />
              <MobileNav label="Activities" active={section === "activities"} onClick={() => setSection("activities")} />
              <MobileNav label="Resources" active={section === "resources"} onClick={() => setSection("resources")} />
            </div>

            {sessionError && <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><span className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />{"status" in sessionError && sessionError.status === 409 ? "Progress changed elsewhere. Refresh before retrying." : sessionError.message}</span><Button variant="outline" size="sm" className="flex-shrink-0" onClick={() => void refreshSession()}>Refresh</Button></div>}
            {feedback && <div role="status" className={cn("mb-4 flex items-start gap-2 rounded-lg border p-3 text-sm", feedback.kind === "success" ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900")}>{feedback.kind === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" /> : <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />}<span>{feedback.message}</span></div>}
            {(session?.removedActivityExternalIds.length ?? 0) > 0 && <p className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" /><span>{session!.removedActivityExternalIds.length} saved activity record(s) no longer belong to the current Huddle and were excluded from progress.</span></p>}

            {section === "overview" && <Overview model={model} theme={theme} />}
            {SHOW_SHARE_YOUR_EXPERIENCE && section === "share-experience" && <ShareYourExperience theme={theme} />}
            {section === "activities" && <Activities model={model} hub={hub} theme={theme} activePhase={activePhase} activePhaseId={activePhaseId} completedActivityIds={progressSummary.completedActivityIds} mutationPending={mutationPending} onPhaseChange={setActivePhaseId} onToggle={(activityExternalId, isCompleted) => void toggleActivity(activityExternalId, isCompleted)} onViewResources={() => setSection("resources")} />}
            {section === "resources" && <Resources resources={allResources} theme={theme} />}

            {/* Below lg the side panel is not shown, so its notes and key takeaway follow the
                content here. Meet with a Coach stays in the footer on these screens. */}
            <div className="mt-8 grid items-start gap-3 border-t border-[#E1E7EF] pt-6 md:grid-cols-2 lg:hidden">{notesCard}{takeawayCard}</div>
          </div>
        </main>

        <aside className="hidden min-h-0 overflow-y-auto border-l border-[#E1E7EF] bg-[#F8FAFC] p-4 lg:block">
          <div className="space-y-3">{onMeetCoach && coachCard}{notesCard}{takeawayCard}</div>
        </aside>
      </div>

      <footer className="flex flex-shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#E1E7EF] bg-white px-4 py-2.5 lg:px-6">
        <Button variant="ghost" className="flex-shrink-0 text-[#424242]" onClick={onClose}><ChevronLeft className="mr-2 h-4 w-4" />Exit to Huddle Library</Button>
        <span className="ml-auto hidden flex-shrink-0 items-center gap-1.5 text-xs text-[#707070] xl:flex"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{session ? `Last saved ${new Date(session.lastSavedAtUtc).toLocaleString()}` : "Progress has not been saved yet."}</span>
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 xl:ml-0">
          {onMeetCoach && <Button className="lg:hidden" variant="outline" size="sm" onClick={onMeetCoach}><UserRound className="mr-2 h-4 w-4" />Request Coaching Assistance</Button>}
          {SHOW_SLIDE_EXPORTS && <Button variant="outline" size="sm" onClick={onPreviewSlides}><Eye className="mr-2 h-4 w-4" />Preview Slides</Button>}
          <Button variant="outline" size="sm" className="border-[#D1DCE6]" disabled={exportingHtml} onClick={() => void downloadHtml()}><FileDown className="mr-2 h-4 w-4" />{exportingHtml ? "Exporting..." : "HTML"}</Button>
          {SHOW_SLIDE_EXPORTS && <Button variant="outline" size="sm" disabled={exporting} onClick={() => void downloadPowerPoint()}><FileDown className="mr-2 h-4 w-4" />{exporting ? "Exporting..." : "PowerPoint"}</Button>}
          <Button className="lg:hidden" variant="outline" size="sm" disabled={sessionLoading || mutationPending} onClick={() => void saveProgress()}><FileText className="mr-2 h-4 w-4" />{mutationPending ? "Saving..." : "Save Progress"}</Button>
          <Button size="sm" disabled={!progressSummary.canComplete || mutationPending} title={completeTitle} onClick={() => void completeHuddle()} className="bg-[#0F6CBD] text-white hover:bg-[#115EA3]"><CheckCircle2 className="mr-2 h-4 w-4" />Complete Huddle</Button>
        </div>
      </footer>
      {talkTrackOpen && <div aria-hidden="true" className="absolute inset-0 z-10 bg-[#16233A]/25" onClick={() => setTalkTrackOpen(false)} />}
      {talkTrackOpen && <HuddleTalkTrackPanel guide={model.facilitatorGuide} managerGuide={model.managerGuide} hub={hub} onClose={() => setTalkTrackOpen(false)} />}
    </div>
  );
}

function WorkspaceNavButton({ active, collapsed, theme, icon, label, onClick }: { active: boolean; collapsed: boolean; theme: HubTheme; icon: ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} aria-current={active ? "page" : undefined} className={cn("flex w-full items-center gap-3 rounded-lg py-2.5 text-left text-sm font-medium transition-colors", collapsed ? "justify-center px-0" : "px-3", active ? cn(theme.soft, theme.text, "font-semibold") : "text-[#242424] hover:bg-[#F4F6F9]")}>{icon}{!collapsed && <span>{label}</span>}</button>;
}

function MobileNav({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" aria-current={active ? "page" : undefined} onClick={onClick} className={cn("flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors", active ? "bg-[#0F6CBD] text-white" : "text-[#424242] hover:bg-[#F4F6F9]")}>{label}</button>;
}

/**
 * High-level summary: the Huddle's featured activities, lettered A, B, C as in the downloaded HTML's
 * "What you'll practice" card, alongside the AI tools it relies on.
 */
function OverviewSummary({ model, toolsFooter }: { model: HuddlePresentationModel; toolsFooter?: ReactNode }) {
  const tools = summarizeTools(model);
  const featured = model.phases.flatMap((phase) => phase.activities).filter((activity) => activity.practiceTier !== "Extended");
  return <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
    <Panel className="p-5"><PanelTitle icon={<Target className="h-4 w-4" />}>What you&apos;ll practice</PanelTitle>
      {featured.length === 0 ? <OptionalContent value={null} /> : <ol className="mt-3 divide-y divide-[#EDF1F5]">{featured.map((activity, index) => <li key={activity.externalId} className="flex items-start gap-3 py-3 first:pt-1 last:pb-0"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F6CBD] text-xs font-bold text-white" aria-hidden="true">{index < 26 ? String.fromCharCode(65 + index) : index + 1}</span><span className="min-w-0"><span className="block text-sm font-semibold text-[#16233A]">{activity.name}</span>{activity.description && <span className="mt-0.5 block text-sm leading-5 text-[#616161]">{activity.description}</span>}</span></li>)}</ol>}
    </Panel>
    <Panel className="p-5">
      {tools.primary.length === 0 && tools.secondary.length === 0 && tools.other.length === 0 ? <><PanelTitle icon={<Bot className="h-4 w-4" />}>AI tools</PanelTitle><OptionalContent value={null} /></> : <div className="space-y-5">
        {([["Top 5 MCAPS Agents", tools.primary], ["Additional AI Tools", tools.secondary], ["Other AI tools (usage not specified)", tools.other]] as const).filter(([, list]) => list.length > 0).map(([title, list], index) => <div key={title} className={cn(index > 0 && "border-t border-[#EDF1F5] pt-4")}><PanelTitle icon={<Bot className="h-4 w-4" />}>{title}</PanelTitle>
          <ul className="mt-3 flex flex-wrap gap-2">{list.map((tool) => <li key={tool.name} className="inline-flex items-center gap-1.5 rounded-md border border-[#0F6CBD]/20 bg-[#F0F6FC] px-2.5 py-1.5 text-sm font-medium text-[#0F6CBD]"><Bot className="h-3.5 w-3.5" />{tool.name}</li>)}</ul></div>)}
      </div>}
      {toolsFooter}
    </Panel>
  </div>;
}

/**
 * The hub Overview (Manager and Facilitator). No topic in the workbook has Use Case content, so that
 * card is left out, and Audience and MCEM stages sit under the AI tools, where the summary box had
 * room to spare.
 */
function Overview({ model, theme }: { model: HuddlePresentationModel; theme: HubTheme }) {
  const audience = [model.audience.roleName, model.audience.audienceDescription].filter(Boolean).join(" — ");
  const hasStages = model.mcemStages.length > 0;
  const toolsFooter = (audience || hasStages) ? <div className="mt-5 space-y-5 border-t border-[#EDF1F5] pt-5">
    {audience && <div><PanelTitle icon={<Users className="h-4 w-4" />}>Audience</PanelTitle><OptionalContent value={audience} /></div>}
    {hasStages && <div><PanelTitle icon={<Compass className="h-4 w-4" />}>MCEM stages</PanelTitle><div className="mt-3 flex flex-wrap gap-2">{model.mcemStages.map((stage) => <span key={stage.externalId} className="rounded-md border border-[#0F6CBD]/20 bg-[#F0F6FC] px-2.5 py-1.5 text-sm font-medium text-[#0F6CBD]">{stage.name}</span>)}</div></div>}
  </div> : null;
  return <div className="space-y-6">
    <SectionHeader eyebrow="Overview" title={model.identity.name} theme={theme}><OptionalContent value={model.identity.description} /></SectionHeader>
    <OverviewSummary model={model} toolsFooter={toolsFooter} />
    <div className="grid gap-4 md:grid-cols-3">
      <OverviewCard title="Objective" icon={<Flag className="h-4 w-4" />} value={model.narrative.todayObjective} />
      <OverviewCard title="Why It Matters" icon={<Lightbulb className="h-4 w-4" />} value={model.narrative.whyItMatters} />
      <OverviewCard title="Desired Outcome" icon={<CheckCircle2 className="h-4 w-4" />} value={model.narrative.desiredOutcome} />
    </div>
  </div>;
}

function OverviewCard({ title, icon, value }: { title: string; icon: ReactNode; value: string | null }) {
  return <Panel className="p-5"><PanelTitle icon={icon}>{title}</PanelTitle><OptionalContent value={value} /></Panel>;
}

const SHARE_YOUR_EXPERIENCE_QUESTIONS = [
  { title: "What did you try with AI since the last Huddle?", copy: "Share a real task, prompt, workflow, or moment where you used AI." },
  { title: "What worked well, and what did not?", copy: "Compare useful approaches with outputs, dead ends, or situations where AI was less helpful." },
  { title: "What did you learn, and where did you run into friction?", copy: "Share a discovery others can reuse and any process, data, tool, access, or confidence blockers you encountered." },
] as const;

function ShareYourExperience({ theme }: { theme: HubTheme }) {
  return <div><SectionHeader eyebrow="Session" title="Share Your Experience" theme={theme}><p className="mt-1.5 text-sm leading-6 text-[#616161]">Use this time to share what you tried with AI since the last Huddle. Compare what worked, what did not, what you learned, and where you ran into friction.</p></SectionHeader><div className="mt-5 grid gap-4 md:grid-cols-2">{SHARE_YOUR_EXPERIENCE_QUESTIONS.map((question, index) => <Panel key={question.title} className="p-5"><span className="text-xs font-semibold text-[#0F6CBD]">{String(index + 1).padStart(2, "0")}</span><h4 className="mt-2 font-semibold text-[#16233A]">{question.title}</h4><p className="mt-2 text-sm leading-6 text-[#616161]">{question.copy}</p></Panel>)}</div></div>;
}

/**
 * Explore and Practice, split by practice tier. Featured activities are listed directly; Extended
 * activities sit behind a collapsed disclosure so a fifteen-minute segment is not buried under
 * seventeen optional practices.
 */
function Activities({ model, hub, theme, activePhase, activePhaseId, completedActivityIds, mutationPending, onPhaseChange, onToggle, onViewResources }: { model: HuddlePresentationModel; hub: HuddleHubKind; theme: HubTheme; activePhase: HuddlePresentationModel["phases"][number] | null; activePhaseId: string | null; completedActivityIds: ReadonlySet<string>; mutationPending: boolean; onPhaseChange: (id: string) => void; onToggle: (activityExternalId: string, isCompleted: boolean) => void; onViewResources: () => void }) {
  const [extendedOpen, setExtendedOpen] = useState(false);
  const featured = activePhase?.activities.filter((activity) => activity.practiceTier !== "Extended") ?? [];
  const extended = activePhase?.activities.filter((activity) => activity.practiceTier === "Extended") ?? [];
  if (!activePhase) return <Unavailable title="Huddle activities" />;
  // A phase outside the three known stages has no hub guidance; it keeps showing only its activities.
  const stage = hubStageForPhase(activePhase.name);
  const guidance = stage ? hubStageGuidance(hub, stage, model.facilitatorGuide, model.managerGuide) : null;
  const noGuidance = guidance !== null && guidance.lead.length === 0 && guidance.follow.length === 0;
  const phaseIndex = model.phases.findIndex((phase) => phase.externalId === activePhase.externalId);
  const previousPhase = phaseIndex > 0 ? model.phases[phaseIndex - 1] : null;
  const nextPhase = phaseIndex >= 0 && phaseIndex < model.phases.length - 1 ? model.phases[phaseIndex + 1] : null;
  const guidanceLabel = hub === "manager" ? "Manager Hub guidance" : "Facilitator Hub guidance";

  const card = (activity: HuddlePresentationActivity, index: number) => (
    <ActivityCard key={activity.externalId} activity={activity} ordinal={index + 1}
      completed={completedActivityIds.has(activity.externalId)} disabled={mutationPending}
      fallbackResources={model.resources}
      onToggle={() => onToggle(activity.externalId, !completedActivityIds.has(activity.externalId))}
      onViewResources={onViewResources} />
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto lg:hidden">
        {model.phases.map((phase, index) => <button key={phase.externalId} type="button" onClick={() => onPhaseChange(phase.externalId)} className={cn("flex-shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors", activePhaseId === phase.externalId ? theme.solid : "bg-white text-[#424242] ring-1 ring-[#D1DCE6]")}>{index + 1}. {hubStageLabel(phase.name)}</button>)}
      </div>

      <div className="flex items-start gap-4">
        <span className={cn("flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-base font-semibold", theme.solid)} aria-hidden="true">{phaseIndex + 1}</span>
        <div className="min-w-0">
          <p className={cn("text-xs font-semibold uppercase tracking-[0.08em]", theme.text)}>Stage {phaseIndex + 1} of {model.phases.length}</p>
          <h3 className="mt-0.5 text-2xl font-semibold tracking-tight text-[#16233A]">{hubStageLabel(activePhase.name)}</h3>
          {activePhase.description && <p className="mt-1 text-sm leading-6 text-[#616161]">{activePhase.description}</p>}
        </div>
      </div>

      {noGuidance && <p className="flex items-start gap-3 rounded-xl border border-dashed border-[#C9D3DD] bg-white p-5 text-sm text-[#616161]"><Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#707070]" aria-hidden="true" />{hubGuidanceUnavailableMessage(hub, hubHasGuidance(hub, model.facilitatorGuide, model.managerGuide))}</p>}
      {guidance && guidance.lead.length > 0 && <StageGuidance label={guidanceLabel} items={guidance.lead} />}
      {!guidance && activePhase.activities.length === 0 && <Unavailable title="Activities for this phase" />}

      {featured.length > 0 && (
        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-[#16233A]">Featured activities</h4>
                <span className="rounded-full bg-[#E8F2FF] px-2 py-0.5 text-[11px] font-semibold text-[#0F6CBD]">{featured.length}</span>
              </div>
              <p className="mt-0.5 text-xs text-[#707070]">Start here. These are the priority activities for this Huddle.</p>
            </div>
          </div>
          <div className="space-y-3">{featured.map(card)}</div>
        </section>
      )}

      {extended.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-[#DCE3EE] bg-[#F8FAFE]">
          <button type="button" onClick={() => setExtendedOpen((value) => !value)} aria-expanded={extendedOpen} className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors hover:bg-[#F1F5FB]">
            <span className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#0F6CBD] ring-1 ring-[#DCE3EE]" aria-hidden="true"><Layers className="h-4 w-4" /></span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm font-semibold text-[#16233A]">Additional activities to explore</strong>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-[#616161] ring-1 ring-[#DCE3EE]">{extended.length} extended</span>
                </span>
                <span className="mt-1 block text-xs text-[#707070]">Go deeper beyond the above activities, when they are relevant or the team has additional time.</span>
              </span>
            </span>
            <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-[#616161] transition-transform", extendedOpen && "rotate-180")} />
          </button>
          {extendedOpen && <div className="space-y-3 border-t border-[#DCE3EE] px-4 py-4">{extended.map(card)}</div>}
        </section>
      )}

      {guidance && guidance.follow.length > 0 && <StageGuidance label="Facilitation cues" items={guidance.follow} />}

      {(previousPhase || nextPhase) && (
        <nav aria-label="Huddle Flow stages" className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E7EF] pt-5">
          {previousPhase ? <Button variant="outline" size="sm" className="border-[#D1DCE6] text-[#242424]" onClick={() => onPhaseChange(previousPhase.externalId)}><ArrowLeft className="mr-2 h-4 w-4" />{hubStageLabel(previousPhase.name)}</Button> : <span />}
          {nextPhase && <Button variant="outline" size="sm" className="border-[#D1DCE6] text-[#242424]" onClick={() => onPhaseChange(nextPhase.externalId)}>{hubStageLabel(nextPhase.name)}<ArrowRight className="ml-2 h-4 w-4" /></Button>}
        </nav>
      )}
    </div>
  );
}

/**
 * A stage's hub guidance. Plain fields are grouped into one panel with a divider between each,
 * so a stage reads as one briefing rather than a stack of separate boxes. The closing prompts
 * (fields with a tone) keep their own colored, icon-led cards. Field order is unchanged.
 */
function StageGuidance({ label, items }: { label: string; items: readonly HubGuidanceItem[] }) {
  const groups: { toned: boolean; items: HubGuidanceItem[] }[] = [];
  for (const item of items) {
    const toned = item.tone !== undefined;
    const last = groups[groups.length - 1];
    if (last && last.toned === toned) last.items.push(item);
    else groups.push({ toned, items: [item] });
  }
  return (
    <section aria-label={label} className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#707070]">{label}</p>
      {groups.map((group, index) => group.toned
        ? <div key={index} className="space-y-3">{group.items.map((item) => <GuidanceCard key={item.title} item={item} />)}</div>
        : <Panel key={index} className="divide-y divide-[#EDF1F5]">{group.items.map((item) => <GuidanceRow key={item.title} item={item} />)}</Panel>)}
    </section>
  );
}

function GuidanceText({ item }: { item: HubGuidanceItem }) {
  return <>
    {item.text && <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#424242]">{item.text}</p>}
    {item.items && (item.items.length === 1
      ? <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#424242]">{item.items[0]}</p>
      : <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[#424242] marker:text-[#8DC8E8]">{item.items.map((value, index) => <li key={`${index}-${value}`}>{value}</li>)}</ul>)}
  </>;
}

/** A plain guidance field inside the stage's briefing panel. */
function GuidanceRow({ item }: { item: HubGuidanceItem }) {
  return <div className="px-5 py-4"><h4 className="text-[15px] font-semibold text-[#16233A]">{item.title}</h4><GuidanceText item={item} /></div>;
}

/** A closing prompt (Wrap Up, Reflect, Commit to Action, Bring Back Next Time) with its own accent. */
function GuidanceCard({ item }: { item: HubGuidanceItem }) {
  const Icon = item.title === "Reflect" ? MessageSquare : item.title === "Bring Back Next Time" ? BookOpen : CheckCircle2;
  return (
    <section className={cn("rounded-xl border py-5 pl-6 pr-5", guidanceCardClassName(item.tone))}>
      <div className="flex items-center gap-2"><Icon className={cn("h-4 w-4", item.tone === "green" ? "text-green-700" : "text-[#0F6CBD]")} /><h4 className="text-[15px] font-semibold text-[#16233A]">{item.title}</h4></div>
      <GuidanceText item={item} />
    </section>
  );
}

/** Green marks the team-facing reflection prompts, blue the commitment; other cards stay neutral. */
function guidanceCardClassName(tone: HubGuidanceTone | undefined): string {
  if (tone === "green") return "bg-[#F3FAF4] shadow-[inset_4px_0_0_#2E8540]";
  if (tone === "blue") return "bg-[#F5F9FF] shadow-[inset_4px_0_0_#0F6CBD]";
  return "bg-white shadow-[inset_4px_0_0_#8A96A3]";
}

function Resources({ resources, theme }: { resources: readonly HuddlePresentationResource[]; theme: HubTheme }) {
  if (resources.length === 0) return <Unavailable title="Resources" />;
  return <div><SectionHeader eyebrow="Library" title="Resources" theme={theme}><p className="mt-1.5 text-sm text-[#616161]">Approved topic and activity resources for this Huddle.</p></SectionHeader><div className="mt-5 grid gap-3 md:grid-cols-2">{resources.map((resource) => <Panel key={resource.externalId} className="flex flex-col p-5"><PanelTitle icon={<BookOpen className="h-4 w-4" />}>{resource.title}</PanelTitle>{resource.description && <p className="mt-2 text-sm leading-6 text-[#616161]">{resource.description}</p>}<div className="mt-auto pt-4"><ResourceLink resource={resource} /></div></Panel>)}</div></div>;
}

function Unavailable({ title }: { title: string }) {
  return <div className="rounded-xl border border-dashed border-[#C9D3DD] bg-white p-10 text-center"><p className="font-semibold text-[#16233A]">{title}</p><p className="mt-1 text-sm text-[#707070]">Content unavailable</p></div>;
}



















/*import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  FileDown,
  FileText,
  Home,
  Layers,
  ListChecks,
  MessageSquare,
  PanelLeftClose,
  StickyNote,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  HuddlePresentationActivity,
  HuddlePresentationModel,
  HuddlePresentationResource,
  HuddleSessionResponse,
} from "../../types";
import { HuddleTalkTrackPanel } from "../talk-track";
import { createHuddleSessionProgressSummary } from "../progress/huddleSessionProgress";

type WorkspaceSection = "overview" | "activities" | "resources";

interface HuddleWorkspaceProps {
  model: HuddlePresentationModel;
  session: HuddleSessionResponse | null | undefined;
  sessionLoading: boolean;
  sessionError: Error | null;
  mutationPending: boolean;
  onRefreshSession: () => Promise<HuddleSessionResponse | null | undefined>;
  onSaveSession: (currentPhaseExternalId: string | null, facilitatorNotes: string | null) => Promise<HuddleSessionResponse>;
  onSetActivityCompletion: (activityExternalId: string, isCompleted: boolean, currentPhaseExternalId: string | null, facilitatorNotes: string | null) => Promise<HuddleSessionResponse>;
  onCompleteSession: () => Promise<HuddleSessionResponse>;
  onMeetCoach: () => void;
  onClose: () => void;
}

function OptionalContent({ value }: { value: string | null }) {
  return value ? <p className="mt-2 text-sm leading-6 text-[#424242]">{value}</p> : <p className="mt-2 text-sm text-[#707070]">Content unavailable</p>;
}

function ResourceLink({ resource }: { resource: HuddlePresentationResource }) {
  const content = <><BookOpen className="h-4 w-4" /><span>{resource.title}</span>{resource.url && <ExternalLink className="h-3.5 w-3.5" />}</>;
  const className = "inline-flex items-center gap-2 rounded-md border border-[#d1d1d1] bg-white px-3 py-2 text-sm text-[#0f6cbd] hover:bg-[#f5f9ff]";
  return resource.url ? <a className={className} href={resource.url} target="_blank" rel="noreferrer">{content}</a> : <span className={cn(className, "cursor-default text-[#616161] hover:bg-white")}>{content}</span>;
}

function ActivityCard({ activity, ordinal, completed, disabled, onToggle }: { activity: HuddlePresentationActivity; ordinal: number; completed: boolean; disabled: boolean; onToggle: () => void }) {
  const primaryAgent = activity.agents[0];
  const secondaryAgents = activity.agents.slice(1);
  return (
    <article className="rounded-xl border border-[#dfe3e8] bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <button type="button" disabled={disabled} onClick={onToggle} aria-label={completed ? "Mark activity incomplete" : "Mark activity complete"} aria-pressed={completed} className={cn("group/complete mt-0.5 flex flex-shrink-0 flex-col items-center gap-1 rounded-lg px-1.5 py-1 text-[10px] font-semibold transition-colors disabled:cursor-wait disabled:opacity-60", completed ? "text-[#0F6CBD]" : "text-[#616161] hover:bg-[#F5F9FF] hover:text-[#0F6CBD]")}><span className={cn("flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all", completed ? "border-[#0F6CBD] bg-[#0F6CBD] text-white" : "border-[#0F6CBD] bg-white text-[#0F6CBD] group-hover/complete:bg-[#E8F2FF]")}><Check className={cn("h-4 w-4", !completed && "opacity-55")} /></span><span>{completed ? "Completed" : "Complete"}</span></button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#707070]">Activity {ordinal}</p><h4 className="text-base font-semibold text-[#242424]">{activity.name}</h4>
              <OptionalContent value={activity.description} />
            </div>
            {primaryAgent?.showAccessLink && primaryAgent.accessUrl && <Button asChild variant="outline" size="sm" className="border-[#b5d5f0] bg-[#f5f9ff] text-[#0f6cbd] hover:bg-[#e8f2ff]"><a href={primaryAgent.accessUrl} target="_blank" rel="noreferrer"><Bot className="mr-2 h-4 w-4" />Open in {primaryAgent.name}<ExternalLink className="ml-2 h-3.5 w-3.5" /></a></Button>}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#707070]">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{activity.durationMinutes === null ? "Duration unavailable" : `${activity.durationMinutes} min`}</span>
            {primaryAgent && <span className="rounded border border-[#0f6cbd]/25 bg-[#e8f2ff] px-2 py-1 text-[#0f6cbd]">AI Tool: {primaryAgent.name}</span>}
            {secondaryAgents.map((agent) => <span key={agent.externalId} className="rounded border px-2 py-1">{agent.name}</span>)}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ActivityField label="Prompt" value={activity.prompt} featured />
            <ActivityField label="Expected output" value={activity.expectedOutput} />
            <ActivityField label="Human checkpoint" value={activity.humanCheckpoint} />
            <ActivityField label="Required context" value={activity.requiredContext} />
            <ActivityField label="Best-fit job" value={activity.bestFitJob} />
          </div>
          {activity.resources.length > 0 && <div className="mt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#616161]">Resources</p><div className="flex flex-wrap gap-2">{activity.resources.map((resource) => <ResourceLink key={resource.externalId} resource={resource} />)}</div></div>}
        </div>
      </div>
    </article>
  );
}

function ActivityField({ label, value, featured = false }: { label: string; value: string | null; featured?: boolean }) {
  if (!value) return null;
  return <section className={cn("rounded-lg border px-4 py-3", featured ? "border-[#b5d5f0] bg-[#f5f9ff] md:col-span-2" : "border-[#e1e4e8] bg-[#fbfbfb]")}><p className="text-xs font-semibold uppercase tracking-wide text-[#616161]">{label}</p><p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-[#242424]">{value}</p></section>;
}

export function HuddleWorkspace({ model, session, sessionLoading, sessionError, mutationPending, onRefreshSession, onSaveSession, onSetActivityCompletion, onCompleteSession, onMeetCoach, onClose }: HuddleWorkspaceProps) {
  const [section, setSection] = useState<WorkspaceSection>(model.phases.length > 0 ? "activities" : "overview");
  const [activePhaseId, setActivePhaseId] = useState<string | null>(() =>
    session?.currentPhaseExternalId && model.phases.some((phase) => phase.externalId === session.currentPhaseExternalId)
      ? session.currentPhaseExternalId
      : model.phases[0]?.externalId ?? null);
  const [guideCollapsed, setGuideCollapsed] = useState(false);
  const [notes, setNotes] = useState(session?.facilitatorNotes ?? "");
  const [talkTrackOpen, setTalkTrackOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportingHtml, setExportingHtml] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const activePhase = model.phases.find((phase) => phase.externalId === activePhaseId) ?? model.phases[0] ?? null;
  const activityCount = useMemo(() => model.phases.reduce((total, phase) => total + phase.activities.length, 0), [model.phases]);
  const agents = useMemo(() => {
    const unique = new Map([...model.agents.primary, ...model.agents.secondary].map((agent) => [agent.externalId, agent]));
    model.phases.forEach((phase) => phase.activities.forEach((activity) => activity.agents.forEach((agent) => unique.set(agent.externalId, agent))));
    return [...unique.values()];
  }, [model]);
  const allResources = useMemo(() => {
    const unique = new Map(model.resources.map((resource) => [resource.externalId, resource]));
    model.phases.forEach((phase) => phase.activities.forEach((activity) => activity.resources.forEach((resource) => unique.set(resource.externalId, resource))));
    return [...unique.values()].sort((left, right) => left.displayOrder - right.displayOrder || left.externalId.localeCompare(right.externalId));
  }, [model]);
  const progressSummary = useMemo(() => createHuddleSessionProgressSummary(session, activityCount), [activityCount, session]);

  const saveProgress = async () => {
    setFeedback(null);
    try {
      await onSaveSession(activePhaseId, notes || null);
      setFeedback({ kind: "success", message: "Progress saved." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to save progress." });
    }
  };

  const toggleActivity = async (activityExternalId: string, isCompleted: boolean) => {
    setFeedback(null);
    try {
      await onSetActivityCompletion(activityExternalId, isCompleted, activePhaseId, notes || null);
      setFeedback({ kind: "success", message: isCompleted ? "Activity marked complete." : "Activity marked incomplete." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to update the activity." });
    }
  };

  const completeHuddle = async () => {
    setFeedback(null);
    try {
      await onCompleteSession();
      setFeedback({ kind: "success", message: "Huddle completed successfully." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to complete the Huddle." });
    }
  };

  const refreshSession = async () => {
    const refreshed = await onRefreshSession();
    if (!refreshed) return;
    setNotes(refreshed.facilitatorNotes ?? "");
    if (refreshed.currentPhaseExternalId && model.phases.some((phase) => phase.externalId === refreshed.currentPhaseExternalId)) {
      setActivePhaseId(refreshed.currentPhaseExternalId);
    }
    setFeedback({ kind: "success", message: "Progress refreshed." });
  };

  const downloadPowerPoint = async () => {
    setFeedback(null);
    setExporting(true);
    try {
      const { exportHuddlePowerPoint } = await import("../../exports/powerpoint");
      await exportHuddlePowerPoint(model);
      setFeedback({ kind: "success", message: "PowerPoint exported." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to export the PowerPoint." });
    } finally {
      setExporting(false);
    }
  };

  const downloadHtml = async () => {
    setFeedback(null);
    setExportingHtml(true);
    try {
      const { exportHuddleHtml } = await import("../../exports/html");
      exportHuddleHtml(model);
      setFeedback({ kind: "success", message: "HTML exported." });
    } catch (error) {
      setFeedback({ kind: "error", message: error instanceof Error ? error.message : "Unable to export HTML." });
    } finally {
      setExportingHtml(false);
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${model.identity.name} workspace`} className="fixed inset-0 z-50 flex h-dvh w-screen flex-col overflow-hidden bg-[#f7f8fa] text-[#242424]">
      <header className="flex flex-shrink-0 items-center border-b border-[#e1e4e8] bg-white px-4 py-3 lg:px-5">
        <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="h-9 w-9" onClick={onClose} aria-label="Exit generated Huddle"><X className="h-4 w-4" /></Button><div className="min-w-0"><div className="flex items-center gap-2"><h2 className="truncate text-lg font-semibold lg:text-xl">{model.identity.name}</h2><span className="rounded border border-[#0f6cbd]/25 bg-[#e8f2ff] px-2 py-1 text-xs font-semibold text-[#0f6cbd]">{model.identity.type}</span></div>{model.identity.description && <p className="hidden truncate text-sm text-[#616161] sm:block">{model.identity.description}</p>}</div></div>
        <Button size="sm" disabled={!progressSummary.canComplete || mutationPending} title={progressSummary.canComplete ? undefined : "Complete every current activity first"} onClick={() => void completeHuddle()} className="ml-auto flex-shrink-0 bg-[#0f6cbd] text-white hover:bg-[#115ea3]"><CheckCircle2 className="mr-2 h-4 w-4" />Complete Huddle</Button>
      </header>
      <div className="flex flex-shrink-0 items-center gap-2 overflow-x-auto border-b border-[#e1e4e8] bg-white px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2 overflow-x-auto">{[{ label: "Duration", value: model.identity.durationMinutes === null ? "Unavailable" : `${model.identity.durationMinutes} min`, icon: Clock }, { label: "Phases", value: String(model.phases.length), icon: Layers }, { label: "Activities", value: String(activityCount), icon: ListChecks }, { label: "AI tools", value: String(agents.length), icon: Bot }].map(({ label, value, icon: Icon }) => <div key={label} className="flex flex-shrink-0 items-center gap-2 rounded-lg border border-[#e1e4e8] bg-white px-3 py-2"><Icon className="h-4 w-4 text-[#0f6cbd]" /><div><p className="text-sm font-semibold">{value}</p><p className="text-[10px] uppercase tracking-wide text-[#707070]">{label}</p></div></div>)}<div className="ml-2 hidden min-w-[220px] lg:block"><div className="mb-1 flex justify-between text-xs text-[#616161]"><span>{progressSummary.completedCount} of {progressSummary.totalCount} activities complete</span><span>{progressSummary.percentage}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[#e8eaed]"><div className="h-full rounded-full bg-[#0f6cbd] transition-all" style={{ width: `${progressSummary.percentage}%` }} /></div></div></div>
      </div>
      <div className={cn("relative grid min-h-0 flex-1", guideCollapsed ? "lg:grid-cols-[64px_minmax(0,1fr)_300px]" : "lg:grid-cols-[232px_minmax(0,1fr)_300px]")}>
        <aside className="hidden min-h-0 flex-col border-r border-[#e1e4e8] bg-white lg:flex"><div className="flex items-center justify-between px-4 py-4">{!guideCollapsed && <p className="text-sm font-semibold">Huddle Guide</p>}<Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setGuideCollapsed((value) => !value)} aria-label="Toggle Huddle Guide"><PanelLeftClose className={cn("h-4 w-4 transition-transform", guideCollapsed && "rotate-180")} /></Button></div><nav className="space-y-1 px-2"><WorkspaceNavButton active={section === "overview"} collapsed={guideCollapsed} icon={<Home className="h-4 w-4" />} label="Overview" onClick={() => setSection("overview")} />{!guideCollapsed && <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-[#707070]">Huddle Flow</p>}{model.phases.map((phase, index) => <button key={phase.externalId} type="button" onClick={() => { setActivePhaseId(phase.externalId); setSection("activities"); }} className={cn("flex w-full items-start gap-3 rounded-md border-l-2 px-3 py-3 text-left transition-colors", section === "activities" && activePhase?.externalId === phase.externalId ? "border-[#0f6cbd] bg-[#eef6fc] text-[#0f6cbd]" : "border-transparent text-[#424242] hover:bg-[#f3f3f3]")}><span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold">{index + 1}</span>{!guideCollapsed && <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{phase.name}</p><p className="mt-1 text-xs text-[#707070]">{phase.durationMinutes === null ? "Duration unavailable" : `${phase.durationMinutes} min`} · {phase.activities.length}</p></div>}</button>)}</nav><div className="mt-auto border-t border-[#e1e4e8] p-2"><WorkspaceNavButton active={section === "resources"} collapsed={guideCollapsed} icon={<BookOpen className="h-4 w-4" />} label="Resources" onClick={() => setSection("resources")} /></div></aside>
        <button type="button" onClick={() => setTalkTrackOpen(true)} style={{ writingMode: "vertical-rl" }} className={cn("absolute top-10 z-20 hidden h-28 w-9 items-center justify-center gap-2 rounded-r-md border border-l-0 border-[#C7E0F4] text-xs font-semibold shadow-sm transition-colors lg:flex", guideCollapsed ? "left-16" : "left-[232px]", talkTrackOpen ? "bg-[#0F6CBD] text-white" : "bg-[#F5F9FF] text-[#0F6CBD] hover:bg-[#E8F2FF]")}><MessageSquare className="h-4 w-4" /><span>Talk Track</span></button>
        <main className="min-h-0 overflow-y-auto px-4 py-5 lg:py-6 lg:pl-12 lg:pr-7">
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden"><MobileNav label="Overview" active={section === "overview"} onClick={() => setSection("overview")} /><MobileNav label="Talk Track" active={talkTrackOpen} onClick={() => setTalkTrackOpen(true)} /><MobileNav label="Activities" active={section === "activities"} onClick={() => setSection("activities")} /><MobileNav label="Resources" active={section === "resources"} onClick={() => setSection("resources")} /></div>
          {section === "overview" && <Overview model={model} />}
          {sessionError && <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><span>{"status" in sessionError && sessionError.status === 409 ? "Progress changed elsewhere. Refresh before retrying." : sessionError.message}</span><Button variant="outline" size="sm" onClick={() => void refreshSession()}>Refresh</Button></div>}
          {feedback && <div role="status" className={cn("mb-4 rounded-lg border p-3 text-sm", feedback.kind === "success" ? "border-green-200 bg-green-50 text-green-900" : "border-red-200 bg-red-50 text-red-900")}>{feedback.message}</div>}
          {(session?.removedActivityExternalIds.length ?? 0) > 0 && <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{session!.removedActivityExternalIds.length} saved activity record(s) no longer belong to the current Huddle and were excluded from progress.</p>}
          {section === "activities" && <Activities model={model} activePhase={activePhase} activePhaseId={activePhaseId} completedActivityIds={progressSummary.completedActivityIds} mutationPending={mutationPending} onPhaseChange={setActivePhaseId} onToggle={(activityExternalId, isCompleted) => void toggleActivity(activityExternalId, isCompleted)} />}
          {section === "resources" && <Resources resources={allResources} />}
        </main>
        <aside className="hidden min-h-0 overflow-y-auto border-l border-[#e1e4e8] bg-[#fbfbfb] p-4 lg:block"><div className="space-y-4"><section className="rounded-xl border border-[#e1e4e8] bg-white p-4 shadow-sm"><div className="mb-2 flex items-center justify-between"><div className="flex items-center gap-2"><StickyNote className="h-4 w-4 text-[#0f6cbd]" /><h3 className="font-semibold">My Notes</h3></div><span className="rounded border px-2 py-0.5 text-[10px]">Private</span></div><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add facilitator insights or follow-up actions..." className="min-h-[130px] w-full resize-y rounded-lg border border-[#d1d1d1] bg-[#fffdf2] p-3 text-sm outline-none focus:border-[#0f6cbd] focus:ring-1 focus:ring-[#0f6cbd]" /><p className="mt-2 text-[11px] text-[#707070]">Use Save Progress to persist these notes.</p></section>{model.keyTakeaway && <section className="rounded-xl border border-[#c7e0c9] bg-[#f3faf4] p-4"><p className="text-sm font-semibold text-[#0f6cbd]">Key takeaway</p><p className="mt-2 text-sm leading-6 text-[#424242]">{model.keyTakeaway}</p></section>}{agents.length > 0 && <section className="rounded-xl border border-[#c7e0f4] bg-[#f5f9ff] p-4"><p className="text-sm font-semibold">AI tools</p><div className="mt-3 flex flex-wrap gap-2">{agents.map((agent) => <span key={agent.externalId} className="rounded bg-white px-2 py-1 text-xs text-[#0f6cbd]">{agent.name}</span>)}</div></section>}</div></aside>
      </div>
      <footer className="flex flex-shrink-0 items-center gap-3 overflow-x-auto border-t border-[#e1e4e8] bg-white px-4 py-2.5 lg:px-5"><Button variant="ghost" className="flex-shrink-0" onClick={onClose}><ChevronLeft className="mr-2 h-4 w-4" />Exit to Huddle Library</Button><span className="ml-auto hidden flex-shrink-0 text-xs text-[#707070] xl:block">{session ? `Last saved ${new Date(session.lastSavedAtUtc).toLocaleString()}` : "Progress has not been saved yet."}</span><div className="flex flex-shrink-0 items-center gap-2"><Button variant="outline" size="sm" onClick={onMeetCoach}><UserRound className="mr-2 h-4 w-4" />Meet with a Coach</Button><Button variant="outline" size="sm" disabled={exportingHtml} onClick={() => void downloadHtml()}><FileDown className="mr-2 h-4 w-4" />{exportingHtml ? "Exporting..." : "HTML"}</Button><Button variant="outline" size="sm" disabled={exporting} onClick={() => void downloadPowerPoint()}><FileDown className="mr-2 h-4 w-4" />{exporting ? "Exporting..." : "PowerPoint"}</Button><Button variant="outline" size="sm" disabled={sessionLoading || mutationPending} onClick={() => void saveProgress()}><FileText className="mr-2 h-4 w-4" />{mutationPending ? "Saving..." : "Save Progress"}</Button></div></footer>
      {talkTrackOpen && <HuddleTalkTrackPanel guide={model.facilitatorGuide} onClose={() => setTalkTrackOpen(false)} />}
    </div>
  );
}

function WorkspaceNavButton({ active, collapsed, icon, label, onClick }: { active: boolean; collapsed: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-[#f3f3f3]", active ? "bg-[#e8f2ff] text-[#0f6cbd]" : "text-[#242424]")}>{icon}{!collapsed && <span>{label}</span>}</button>;
}

function MobileNav({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("rounded-md border px-3 py-2 text-sm", active ? "border-[#0f6cbd] bg-[#e8f2ff] text-[#0f6cbd]" : "bg-white")}>{label}</button>;
}

function Overview({ model }: { model: HuddlePresentationModel }) {
  return <div className="mx-auto max-w-4xl space-y-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#0f6cbd]">Overview</p><h3 className="mt-1 text-2xl font-semibold">{model.identity.name}</h3><OptionalContent value={model.identity.description} /></div><div className="grid gap-4 md:grid-cols-2"><OverviewCard title="Today’s Objective" value={model.narrative.todayObjective} /><OverviewCard title="Use Case" value={model.narrative.useCase} /><OverviewCard title="Why It Matters" value={model.narrative.whyItMatters} /><OverviewCard title="Desired Outcome" value={model.narrative.desiredOutcome} /></div>{(model.audience.roleName || model.audience.audienceDescription) && <OverviewCard title="Audience" value={[model.audience.roleName, model.audience.audienceDescription].filter(Boolean).join(" — ")} />}{model.mcemStages.length > 0 && <section className="rounded-xl border border-[#dfe3e8] bg-white p-5"><h4 className="font-semibold">MCEM stages</h4><div className="mt-3 flex flex-wrap gap-2">{model.mcemStages.map((stage) => <span key={stage.externalId} className="rounded border border-[#0f6cbd]/20 bg-[#e8f2ff] px-3 py-1.5 text-sm text-[#0f6cbd]">{stage.name}</span>)}</div></section>}</div>;
}

function OverviewCard({ title, value }: { title: string; value: string | null }) {
  return <section className="min-h-[126px] rounded-xl border border-[#dfe3e8] bg-white p-5"><h4 className="font-semibold">{title}</h4><OptionalContent value={value} /></section>;
}

function Activities({ model, activePhase, activePhaseId, completedActivityIds, mutationPending, onPhaseChange, onToggle }: { model: HuddlePresentationModel; activePhase: HuddlePresentationModel["phases"][number] | null; activePhaseId: string | null; completedActivityIds: ReadonlySet<string>; mutationPending: boolean; onPhaseChange: (id: string) => void; onToggle: (activityExternalId: string, isCompleted: boolean) => void }) {
  if (!activePhase) return <Unavailable title="Huddle activities" />;
  return <div className="mx-auto max-w-4xl space-y-5"><div className="flex gap-2 overflow-x-auto lg:hidden">{model.phases.map((phase, index) => <button key={phase.externalId} type="button" onClick={() => onPhaseChange(phase.externalId)} className={cn("flex-shrink-0 rounded-full border px-3 py-1.5 text-sm", activePhaseId === phase.externalId ? "border-[#0f6cbd] bg-[#e8f2ff] text-[#0f6cbd]" : "bg-white")}>{index + 1}. {phase.name}</button>)}</div><div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2ff] text-sm font-semibold text-[#0f6cbd]">{model.phases.findIndex((phase) => phase.externalId === activePhase.externalId) + 1}</span><h3 className="text-2xl font-semibold">{activePhase.name}</h3></div>{activePhase.description && <p className="ml-10 mt-1 text-sm text-[#616161]">{activePhase.description}</p>}</div>{activePhase.activities.length > 0 ? <div className="space-y-4">{activePhase.activities.map((activity, index) => <ActivityCard key={activity.externalId} activity={activity} ordinal={index + 1} completed={completedActivityIds.has(activity.externalId)} disabled={mutationPending} onToggle={() => onToggle(activity.externalId, !completedActivityIds.has(activity.externalId))} />)}</div> : <Unavailable title="Activities for this phase" />}</div>;
}

function Resources({ resources }: { resources: readonly HuddlePresentationResource[] }) {
  if (resources.length === 0) return <Unavailable title="Resources" />;
  return <div className="mx-auto max-w-4xl"><h3 className="text-2xl font-semibold">Resources</h3><p className="mt-1 text-sm text-[#616161]">Approved topic and activity resources for this Huddle.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{resources.map((resource) => <section key={resource.externalId} className="rounded-xl border border-[#dfe3e8] bg-white p-5"><p className="font-semibold">{resource.title}</p>{resource.description && <p className="mt-2 text-sm leading-6 text-[#616161]">{resource.description}</p>}<div className="mt-4"><ResourceLink resource={resource} /></div></section>)}</div></div>;
}

function Unavailable({ title }: { title: string }) {
  return <div className="mx-auto max-w-4xl rounded-xl border border-dashed border-[#d1d1d1] bg-white p-10 text-center"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-[#707070]">Content unavailable</p></div>;
}
*/
