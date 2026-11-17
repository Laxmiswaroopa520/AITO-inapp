import type { ReactNode } from "react";
import { ChevronLeft, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HubBadge } from "./HubBadge";
import type { HuddlePresentationFacilitatorGuide, HuddlePresentationManagerGuide } from "../../types";

/** Which hub opened the workspace. The Manager Hub reuses the same panel with manager content. */
export type HuddleHubKind = "facilitator" | "manager";

interface HuddleTalkTrackPanelProps {
  guide: HuddlePresentationFacilitatorGuide | null;
  /** Manager Hub content for the placement; only read when hub is "manager". */
  managerGuide?: HuddlePresentationManagerGuide | null;
  hub?: HuddleHubKind;
  onClose: () => void;
}

export function HuddleTalkTrackPanel({ guide, managerGuide = null, hub = "facilitator", onClose }: HuddleTalkTrackPanelProps) {
  const title = hub === "manager" ? "Manager Talk Track" : "Facilitator Talk Track";
  return (
    <aside aria-label={title} className="absolute inset-y-0 right-0 z-10 flex w-full max-w-xl flex-col border-l border-[#E1E7EF] bg-[#F8FAFC] shadow-[-12px_0_40px_rgba(22,35,58,0.14)]">
      <header className="flex items-start justify-between gap-4 border-b border-[#E1E7EF] bg-white px-6 py-5">
        <div className="min-w-0">
          <HubBadge hub={hub} />
          <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold text-[#16233A]"><MessageSquare className="h-5 w-5 text-[#0F6CBD]" />{title}</h2>
        </div>
        <Button variant="ghost" size="icon" className="text-[#616161]" onClick={onClose} aria-label="Close Talk Track"><X className="h-4 w-4" /></Button>
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-6 text-sm leading-6">
        {hub === "manager" ? <ManagerContent guide={guide} managerGuide={managerGuide} /> : <FacilitatorContent guide={guide} />}
      </div>
      <footer className="flex flex-shrink-0 items-center border-t border-[#E1E7EF] bg-white px-6 py-3">
        <Button variant="ghost" className="text-[#424242]" onClick={onClose}><ChevronLeft className="mr-2 h-4 w-4" />Back to Huddle</Button>
      </footer>
    </aside>
  );
}

function FacilitatorContent({ guide }: { guide: HuddlePresentationFacilitatorGuide | null }) {
  if (!guide) return <Unavailable label="Facilitator guidance" />;
  // The Before-the-Huddle fields only exist for placements the 10.26 workbook filled in, so the
  // group is shown only when at least one of them has content; older placements read as before.
  const hasBefore = Boolean(guide.roleWorkflowContext || guide.facilitatorPreparation || guide.managerFacilitatorAlignment || guide.exampleScenario);
  return <>
    {hasBefore && <TalkTrackGroup title="Before the Huddle">
      <OptionalSection title="Role workflow context" value={guide.roleWorkflowContext} />
      <OptionalSection title="Facilitator preparation" value={guide.facilitatorPreparation} />
      <OptionalSection title="Manager and facilitator alignment" value={guide.managerFacilitatorAlignment} />
      <OptionalSection title="Example scenario" value={guide.exampleScenario} />
    </TalkTrackGroup>}
    <TalkTrackSection title="Session introduction" value={guide.sessionIntroduction} />
    <TalkTrackList title="Key talking points" values={guide.keyTalkingPoints} />
    <TalkTrackList title="Discussion questions" values={guide.discussionQuestions} />
    <TalkTrackList title="Suggested transitions" values={guide.suggestedTransitions} />
    <OptionalSection title="Facilitation watchouts" value={guide.facilitationWatchouts} standalone />
    <TalkTrackSection title="Wrap-up guidance" value={guide.wrapUpGuidance} />
  </>;
}

function ManagerContent({ guide, managerGuide }: { guide: HuddlePresentationFacilitatorGuide | null; managerGuide: HuddlePresentationManagerGuide | null }) {
  const hasContent = Boolean(managerGuide && (managerGuide.managerTeamRelevance || managerGuide.managerPreparationGuidance || managerGuide.managerDuringHuddleGuidance || managerGuide.managerFollowThroughQuestions));
  if (!hasContent) return <Unavailable label="Manager guidance" />;
  return <>
    <TalkTrackGroup title="Before the Huddle">
      <OptionalSection title="Why this matters for your team" value={managerGuide?.managerTeamRelevance ?? null} />
      <OptionalSection title="Manager preparation" value={managerGuide?.managerPreparationGuidance ?? null} />
      <OptionalSection title="Manager and facilitator alignment" value={guide?.managerFacilitatorAlignment ?? null} />
      <OptionalSection title="Example scenario" value={guide?.exampleScenario ?? null} />
    </TalkTrackGroup>
    <TalkTrackGroup title="During the Huddle">
      <TalkTrackSection title="Manager guidance" value={managerGuide?.managerDuringHuddleGuidance ?? null} grouped />
    </TalkTrackGroup>
    <TalkTrackGroup title="After the Huddle">
      <TalkTrackSection title="Follow-through questions" value={managerGuide?.managerFollowThroughQuestions ?? null} grouped />
    </TalkTrackGroup>
  </>;
}

function TalkTrackGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-4 rounded-xl border border-[#E1E7EF] bg-white p-5 shadow-[0_1px_2px_rgba(22,35,58,0.04)]"><h3 className="border-b border-[#EDF1F5] pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0F6CBD]">{title}</h3>{children}</section>;
}

/** Multi-line workbook text keeps its line breaks. */
function TalkTrackText({ value }: { value: string }) {
  return <p className="mt-1 whitespace-pre-line text-[#424242]">{value}</p>;
}

/** Shared card styling for a field shown on its own, outside a Before, During or After group. */
const STANDALONE_CARD = "rounded-xl border border-[#E1E7EF] bg-white p-5 shadow-[0_1px_2px_rgba(22,35,58,0.04)]";

/** `grouped` drops the card styling when the field sits inside a TalkTrackGroup, which is already a card. */
function TalkTrackSection({ title, value, grouped = false }: { title: string; value: string | null; grouped?: boolean }) {
  return <section className={grouped ? undefined : STANDALONE_CARD}><h3 className="font-semibold text-[#16233A]">{title}</h3>{value ? <TalkTrackText value={value} /> : <p className="mt-1 text-[#707070]">Content unavailable</p>}</section>;
}

/** A section for content only some placements carry: hidden rather than shown as unavailable. */
function OptionalSection({ title, value, standalone = false }: { title: string; value: string | null; standalone?: boolean }) {
  return value ? <section className={standalone ? STANDALONE_CARD : undefined}><h3 className="font-semibold text-[#16233A]">{title}</h3><TalkTrackText value={value} /></section> : null;
}

function TalkTrackList({ title, values }: { title: string; values: readonly string[] }) {
  return <section className={STANDALONE_CARD}><h3 className="font-semibold text-[#16233A]">{title}</h3>{values.length > 0 ? <ul className="mt-1 list-disc space-y-1 pl-5 text-[#424242] marker:text-[#8DC8E8]">{values.map((value, index) => <li key={`${index}-${value}`}>{value}</li>)}</ul> : <p className="mt-1 text-[#707070]">Content unavailable</p>}</section>;
}

function Unavailable({ label }: { label: string }) {
  return <div className="rounded-xl border border-dashed border-[#C9D3DD] bg-white p-6 text-center"><p className="font-semibold">{label}</p><p className="mt-1 text-[#707070]">Content unavailable</p></div>;
}
