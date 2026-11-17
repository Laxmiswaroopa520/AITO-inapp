import { useState } from "react";
import { Download, RefreshCcw, Route } from "lucide-react";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import type { HuddleCatalogItemResponse, HuddlePlanResponse, HuddleVoteResponse } from "../../types";
import { ComingSoonWeekCard } from "./ComingSoonWeekCard";
import { upcomingWeeksFor } from "./commonRolePathWeeks";
import { RecommendedPathCard } from "./RecommendedPathCard";
import { ReplaceHuddleDialog } from "./ReplaceHuddleDialog";
import { RolePathWeekMenu } from "./RolePathWeekMenu";

/**
 * Week numbers are read from the plan the API returns, never assumed. The workbook defines a role
 * path as a contiguous run starting at W1, and the count differs only if the workbook changes.
 */
function weeksOf(plan: HuddlePlanResponse): number[] {
  return plan.items.map((item) => item.week);
}

interface RecommendedPathProps {
  data?: HuddlePlanResponse;
  catalog: HuddleCatalogItemResponse[];
  isLoading: boolean;
  error: Error | null;
  mutationError: Error | null;
  selectedExternalId: string | null;
  /** The placement open for selectedExternalId, so only that week is highlighted when a topic repeats. */
  selectedPlacementExternalId?: string | null;
  hasRole: boolean;
  /** Audience role name for display; the response only carries the external ID. */
  roleName?: string | null;
  votes: Map<string, HuddleVoteResponse>;
  votePending: boolean;
  savePending: boolean;
  onSelect: (externalId: string, placementExternalId?: string) => void;
  onVote: (externalId: string, value: -1 | 1 | null) => void;
  /** The week card whose HTML download is in progress, if any. */
  htmlExportExternalId: string | null;
  onExportHtml: (huddle: HuddleCatalogItemResponse) => void;
  /** successMessage, when given, is shown as the green confirmation once the save succeeds. */
  onSave: (plan: HuddlePlanResponse, successMessage?: string) => void;
  onReset: () => void;
  onRetry: () => void;
}

async function exportPlan(plan: HuddlePlanResponse, roleName?: string | null): Promise<void> {
  const { exportLearningPlanHtml } = await import("../../exports/html");
  exportLearningPlanHtml(plan, { roleName });
}

export function RecommendedPath(props: RecommendedPathProps) {
  const [menuWeek, setMenuWeek] = useState<number | null>(null);
  /** The week whose Replace Huddle pop-up is open. */
  const [replaceWeek, setReplaceWeek] = useState<number | null>(null);

  if (!props.hasRole) {
    return <div className="rounded-xl border border-dashed border-[#8A8886] bg-white px-6 py-10 text-center"><Route className="mx-auto h-8 w-8 text-[#0F6CBD]" /><h3 className="mt-3 text-lg font-semibold">Select an audience to build the Role Path</h3><p className="mt-1 text-sm text-muted-foreground">The recommended Huddles will appear in week order.</p></div>;
  }
  if (props.isLoading) return <LoadingSpinner message="Loading role path..." />;
  if (props.error) return <ErrorState title="Unable to load Role Path" message={props.error.message} onRetry={props.onRetry} />;
  if (!props.data) return null;

  // A role with no weekly path, which is true of All Roles: the workbook gives it additional
  // content but no Weeks 1 to 8. Say so and point at the tab that does have content for it.
  if (props.data.items.length === 0) {
    return <div className="rounded-xl border border-dashed border-[#8A8886] bg-white px-6 py-10 text-center"><Route className="mx-auto h-8 w-8 text-[#8A8886]" /><h3 className="mt-3 text-lg font-semibold">No Role Path for {props.roleName ?? props.data.roleExternalId}</h3><p className="mt-1 text-sm text-muted-foreground">This audience has no weekly Huddle sequence configured. Its Huddles are under All Topics.</p></div>;
  }

  const update = (week: number, action: "up" | "down" | "reset", targetWeek?: number, replacement?: string) => {
    const ordered = [...props.data!.items].sort((left, right) => left.week - right.week);
    const recommendedByPosition = ordered.map((item) => item.recommendedHuddleExternalId);
    const index = ordered.findIndex((item) => item.week === week);
    if (index < 0) return;
    let successMessage: string | undefined;

    if (action === "reset") {
      const expected = recommendedByPosition[index];
      // The catalog holds this role's own placements. A topic can sit on several weeks (WF-PIPE on
      // Weeks 3 and 4), so Reset takes the placement for this exact week before any other.
      const candidates = props.catalog.filter((item) => item.externalId === (replacement ?? expected));
      const huddle = (replacement === undefined
        ? candidates.find((item) => item.placementSequence === ordered[index].week && item.placementPathSection !== "SEC-ADDITIONAL")
        : undefined) ?? candidates[0];
      if (!huddle) return;
      ordered[index] = { ...ordered[index], huddle };
      // Replace Huddle confirms with the title the card shows; Reset this week stays silent.
      if (replacement !== undefined) successMessage = `Replaced Huddle with "${huddle.roleTopicName ?? huddle.name}".`;
    } else {
      const weeks = weeksOf(props.data!);
      const targetIndex = targetWeek === undefined ? index + (action === "up" ? -1 : 1) : weeks.indexOf(targetWeek);
      if (targetIndex < 0 || targetIndex >= ordered.length) return;
      const [moved] = ordered.splice(index, 1);
      ordered.splice(targetIndex, 0, moved);
    }

    const weekNumbers = weeksOf(props.data!);
    const items = ordered.map((item, position) => ({
      ...item,
      week: weekNumbers[position],
      recommendedHuddleExternalId: recommendedByPosition[position],
      isCustomized: item.huddle.externalId !== recommendedByPosition[position],
    }));
    props.onSave({ ...props.data!, isCustomized: items.some((item) => item.isCustomized), items }, successMessage);
    setMenuWeek(null);
  };

  // Common weeks with no Huddle yet (Week 9). They render after the real weeks but stay out of
  // weeksOf() and update(), so they can't be moved to, replaced, saved or exported.
  const upcomingWeeks = upcomingWeeksFor(props.data);

  // Replace Huddle offers this role's own topics that are not already on the path, once each:
  // the menu is keyed by topic, and the catalog can hold more than one placement of a topic.
  const replacementOptions = props.catalog.filter((candidate, position, all) =>
    !props.data!.items.some((existing) => existing.huddle.externalId === candidate.externalId)
    && all.findIndex((other) => other.externalId === candidate.externalId) === position);

  return <section className="space-y-4 [font-family:var(--aito-font-sans)]">
    <div className="flex flex-col gap-3 rounded-xl border border-[#C7E0F4] bg-[#F5F9FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Route className="h-5 w-5 text-[#0F6CBD]" /><h2 className="text-xl font-bold">Role Path</h2>{props.data.isCustomized && <span className="rounded-md bg-[#FFF4CE] px-2 py-1 text-xs font-semibold text-[#8A4B08]">Customized</span>}</div><p className="mt-1 text-sm text-muted-foreground">{props.roleName ?? props.data.roleExternalId} · Weeks {props.data.items[0]?.week ?? 1}–{props.data.items[props.data.items.length - 1]?.week ?? props.data.items.length} · {props.data.items.length} Huddles · 30 minutes each{upcomingWeeks.length > 0 && ` · ${upcomingWeeks.length === 1 ? "Week" : "Weeks"} ${upcomingWeeks.map((entry) => entry.week).join(", ")} coming soon`}</p></div>
      <div data-tour="huddle-path-actions" className="flex flex-wrap gap-2"><button type="button" disabled={!props.data.isCustomized || props.savePending} onClick={props.onReset} className="inline-flex h-9 items-center rounded-md border bg-white px-3 text-sm font-semibold hover:bg-[#E8F2FF] disabled:opacity-40"><RefreshCcw className="mr-2 h-4 w-4" />Reset</button><button type="button" onClick={() => void exportPlan(props.data!, props.roleName)} className="inline-flex h-9 items-center rounded-md bg-[#0F6CBD] px-3 text-sm font-semibold text-white hover:bg-[#115EA3]"><Download className="mr-2 h-4 w-4" />Export Learning Plan</button></div>
    </div>
    {props.mutationError && <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{props.mutationError.message} Refresh the plan before trying again.</p>}
    <div className="space-y-3">{props.data.items.map((item, index) => <RecommendedPathCard key={`${item.week}-${item.huddle.externalId}`} tourFirst={index === 0} week={item.week} huddle={item.huddle} customized={item.isCustomized} selected={props.selectedExternalId === item.huddle.externalId && (!item.huddle.placementExternalId || props.selectedPlacementExternalId === item.huddle.placementExternalId)} vote={props.votes.get(item.huddle.externalId)} votePending={props.votePending} onSelect={props.onSelect} onVote={props.onVote} htmlExportPending={props.htmlExportExternalId === item.huddle.externalId} htmlExportDisabled={props.htmlExportExternalId !== null} onExportHtml={() => props.onExportHtml(item.huddle)} managementMenuOpen={menuWeek === item.week} managementMenu={
      <RolePathWeekMenu tourFirst={index === 0} week={item.week} weeks={weeksOf(props.data!)} isCustomized={item.isCustomized} disabled={props.savePending} open={menuWeek === item.week} onOpenChange={(open) => setMenuWeek(open ? item.week : null)} onMoveToWeek={(targetWeek) => update(item.week, "up", targetWeek)} onOpenReplace={() => setReplaceWeek(item.week)} onReset={() => update(item.week, "reset")} />
    } />)}{upcomingWeeks.map((upcoming, index) => <ComingSoonWeekCard key={`upcoming-${upcoming.week}`} upcoming={upcoming} tourFirst={index === 0} />)}</div>
    <ReplaceHuddleDialog
      open={replaceWeek !== null}
      candidates={replacementOptions}
      disabled={props.savePending}
      onReplace={(externalId) => {
        if (replaceWeek !== null) update(replaceWeek, "reset", undefined, externalId);
        setReplaceWeek(null);
      }}
      onClose={() => setReplaceWeek(null)}
    />
  </section>;
}
