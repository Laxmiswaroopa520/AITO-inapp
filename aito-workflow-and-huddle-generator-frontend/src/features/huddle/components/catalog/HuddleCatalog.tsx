import { useMemo, useState } from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSpinner } from "@/components/feedback/LoadingSpinner";
import { mapHuddleCatalogItemToCard } from "../../mappers";
import type { HuddleCatalogItemResponse, HuddleVoteResponse } from "../../types";
import type { IncompleteHuddleSessionResponse } from "../../types";
import { HuddleCatalogCard } from "./HuddleCatalogCard";
import { CustomLearningPlanCard } from "./CustomLearningPlanCard";
import { CustomLearningPlanDialog } from "./CustomLearningPlanDialog";
import { ContinueLearningList } from "../progress";
import { exportCustomLearningPlanHtml } from "../../exports/html/exportCustomLearningPlanHtml";
import type { CustomLearningPlanState } from "../../hooks/useCustomLearningPlan";

interface HuddleCatalogProps {
  data: HuddleCatalogItemResponse[] | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedExternalId: string | null;
  /**
   * The placement the detail panel is showing for selectedExternalId. A topic can have several
   * cards (one per placement), so only the card for this placement is highlighted.
   */
  selectedPlacementExternalId?: string | null;
  audienceRoleIds: string[];
  /**
   * The global role ids (ROLE-AE) behind the selected audiences. Audiences are segment roles
   * (SR-ENT-AE) while a topic's aligned roles are global roles, so multi-audience filtering
   * matches topics on these. Defaults to audienceRoleIds for callers that pass global ids.
   */
  audienceAlignedRoleIds?: string[];
  /** Changes whenever any filter changes, so paging can restart at page one. */
  filterKey: string;
  /**
   * Whether a focus area, AI tool or search term is narrowing the list. Decides which empty state
   * to show: "nothing matches your filter" versus "this audience has no additional content".
   */
  filtersActive?: boolean;
  votes: Map<string, HuddleVoteResponse>;
  votePending: boolean;
  onSelect: (externalId: string, placementExternalId?: string) => void;
  onVote: (externalId: string, value: -1 | 1 | null) => void;
  onRetry: () => void;
  /** Every in-progress session; the list shows the latest and can expand to the rest. */
  continueLearning?: IncompleteHuddleSessionResponse[];
  onContinue: (externalId: string) => void;
  /** Custom learning plan state. Omit to hide the multi-select experience entirely. */
  plan?: CustomLearningPlanState;
  /** Human-readable persona shown on the exported plan. */
  planAudienceLabel?: string | null;
  onCloseDetails?: () => void;
  /** Opens the "Create your own Huddle" (Huddle in a Box) dialog from the footer prompt. */
  onCreateOwnHuddle: () => void;
  /** The topic whose HTML download is in progress, if any (same value the Role Path cards use). */
  htmlExportExternalId?: string | null;
  /** Downloads a topic's HTML the same way the Role Path week cards do. Omit to hide the button. */
  onExportHtml?: (huddle: HuddleCatalogItemResponse) => void;
}

const PAGE_SIZE = 25;

/** Matches HuddleCatalogCardViewModel.cardKey: the placement when the item has one, else the topic. */
function cardKeyOf(item: HuddleCatalogItemResponse): string {
  return item.placementExternalId ?? item.externalId;
}


export function HuddleCatalog({ data, isLoading, error, selectedExternalId, selectedPlacementExternalId = null, audienceRoleIds, audienceAlignedRoleIds, filterKey, filtersActive = false, votes, votePending, continueLearning, plan, planAudienceLabel, onSelect, onVote, onRetry, onContinue, onCloseDetails, onCreateOwnHuddle, htmlExportExternalId = null, onExportHtml }: HuddleCatalogProps) {
  const [page, setPage] = useState(1);
  // Tracks the filterKey that `page` was last reset for, so paging can restart at page one
  // without an effect (adjusting state during render instead of in a useEffect, per React's
  // guidance -- avoids the extra render pass a post-commit effect would trigger).
  const [pagingFilterKey, setPagingFilterKey] = useState(filterKey);
  const [planOpen, setPlanOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  // The catalog endpoint filters by one role only. With several selected we request every
  // role and narrow client-side, which keeps the server contract unchanged.
  // A placement-scoped item belongs to exactly one role, so it is kept when that role is selected.
  // Topic-scoped items (no placement role) keep the earlier aligned-role match.
  const visible = useMemo(() => {
    if (audienceRoleIds.length <= 1) return data ?? [];
    const alignedRoleIds = audienceAlignedRoleIds ?? audienceRoleIds;
    return (data ?? []).filter((item) => item.placementSegmentRoleExternalId
      ? audienceRoleIds.includes(item.placementSegmentRoleExternalId)
      : item.roles.some((role) => alignedRoleIds.includes(role.externalId)));
  }, [data, audienceRoleIds, audienceAlignedRoleIds]);
  const cards = useMemo(() => visible.map(mapHuddleCatalogItemToCard), [visible]);
  // The HTML export needs the API item, not the card view model. Cards are keyed by placement
  // (the topic only when the item has no placement), so two cards for one topic stay distinct.
  const itemsByKey = useMemo(() => new Map(visible.map((item) => [cardKeyOf(item), item])), [visible]);

  // Resolve the plan sequence against the full API payload so a card stays in the plan
  // even when the current filters or page would hide it. Entries are card keys; a bare topic id
  // saved by an earlier build resolves to that topic's first card so it is not silently lost.
  const planEntries = useMemo(() => {
    if (!plan) return [];
    const byKey = new Map<string, HuddleCatalogItemResponse>();
    const byTopic = new Map<string, HuddleCatalogItemResponse>();
    for (const item of data ?? []) {
      byKey.set(cardKeyOf(item), item);
      if (!byTopic.has(item.externalId)) byTopic.set(item.externalId, item);
    }
    return plan.sequence
      .map((key) => ({ key, item: byKey.get(key) ?? byTopic.get(key) }))
      .filter((entry): entry is { key: string; item: HuddleCatalogItemResponse } => Boolean(entry.item));
  }, [data, plan]);
  const planHuddles = useMemo(() => planEntries.map((entry) => entry.item), [planEntries]);
  const planKeys = useMemo(() => planEntries.map((entry) => entry.key), [planEntries]);
  const isCardSelected = (huddle: { id: string; placementExternalId: string | null }) =>
    selectedExternalId === huddle.id && (huddle.placementExternalId === null || selectedPlacementExternalId === huddle.placementExternalId);

  const exportPlan = () => {
    setPlanError(null);
    setExporting(true);
    try {
      exportCustomLearningPlanHtml(planHuddles, { personaLabel: planAudienceLabel ?? null });
    } catch (exportFailure) {
      setPlanError(exportFailure instanceof Error ? exportFailure.message : "Unable to export the learning plan.");
    } finally {
      setExporting(false);
    }
  };

  const clearPlan = () => {
    plan?.clear();
    setPlanOpen(false);
    setPlanError(null);
  };
  const totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedCards = cards.slice(pageStart, pageStart + PAGE_SIZE);

  // Filters live above this component now, so restart paging when they change.
  if (filterKey !== pagingFilterKey) {
    setPagingFilterKey(filterKey);
    setPage(1);
  }

  if (isLoading) return <LoadingSpinner message="Loading Huddles..." />;
  if (error) return <ErrorState title="Unable to load Huddles" message={error.message} onRetry={onRetry} />;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 className="text-2xl font-bold">All Topics</h2><p className="mt-1 text-sm text-muted-foreground">Build your own learning plan from additional workflows, tools, and role-relevant Huddles.</p></div>
        <div className="flex items-center gap-2">
          {plan && plan.selectedIds.length > 0 && <span className="rounded-full bg-[#E8F2FF] px-2.5 py-1 text-xs font-semibold text-[#0F6CBD]">{plan.selectedIds.length} {plan.selectedIds.length === 1 ? "topic" : "topics"} selected</span>}
          {selectedExternalId && onCloseDetails && <Button variant="ghost" size="sm" onClick={onCloseDetails}>Close Details</Button>}
        </div>
      </div>
      <ContinueLearningList items={continueLearning} onContinue={onContinue} />
      {plan && plan.selectedIds.length > 0 && <CustomLearningPlanCard selectedCount={plan.selectedIds.length} exporting={exporting} onBuild={() => setPlanOpen(true)} onExport={exportPlan} onClear={clearPlan} />}
      {planError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">{planError}</p>}

      <div className="space-y-3">{pagedCards.map((huddle, index) => <HuddleCatalogCard showManagementMenu tourFirst={index === 0} key={huddle.cardKey} huddle={huddle} selected={isCardSelected(huddle)} vote={votes.get(huddle.id)} votePending={votePending} planChecked={plan?.isSelected(huddle.cardKey) ?? false} onTogglePlan={plan ? plan.toggle : undefined} onSelect={onSelect} onVote={onVote} onExportHtml={onExportHtml ? () => { const item = itemsByKey.get(huddle.cardKey); if (item) onExportHtml(item); } : undefined} htmlExportPending={htmlExportExternalId === huddle.id} htmlExportDisabled={htmlExportExternalId !== null} />)}</div>

      {/* A role can have a Role Path and no additional content, which is the mirror of All Roles
          having additional content and no Role Path. Say which of the two happened. */}
      {cards.length === 0 && <div className="rounded-xl border border-dashed bg-white py-10 text-center text-sm text-muted-foreground">{filtersActive ? "No Huddles match this filter." : "No  Topics are configured for this audience."}</div>}
      {cards.length > 0 && <div className="flex flex-wrap items-center justify-between gap-3 pt-1"><p className="text-xs text-muted-foreground">Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, cards.length)} of {cards.length} Huddles</p>{totalPages > 1 && <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button><span className="min-w-16 text-center text-xs font-medium text-muted-foreground">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button></div>}</div>}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-6"><p className="max-w-lg text-sm text-muted-foreground">Not finding the role, workflow, practice, or tool you&apos;re looking for? Try creating your own Huddle content!</p><button type="button" onClick={onCreateOwnHuddle} className="inline-flex h-10 shrink-0 items-center rounded-lg border border-[#0A6BBA] bg-white px-3 text-sm font-semibold text-[#0A6BBA] hover:bg-[#E2F1F9]"><Box className="mr-2 h-4 w-4" />Create Your Own Huddle</button></div>
      {plan && planOpen && <CustomLearningPlanDialog huddles={planHuddles} itemKeys={planKeys} exporting={exporting} onMove={plan.move} onRemove={plan.remove} onClear={clearPlan} onExport={exportPlan} onClose={() => setPlanOpen(false)} />}
    </section>
  );
}
