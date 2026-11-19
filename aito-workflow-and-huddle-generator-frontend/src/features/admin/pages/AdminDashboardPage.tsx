import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bot, CalendarDays, CheckCircle2, ChevronRight, Clock3, History, LayoutGrid, Layers3, Link2, ListChecks, Loader2, Presentation, ShieldCheck, Table2, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import aitoLogo from "@/assets/AITO New Logo.png";
import { cn } from "@/lib/utils";
import { ContentEditsUnavailableError } from "../api/contentEditsApi";
import { useConfirmContentChange, useContentEdits } from "../hooks/useContentEdits";
import { EDITABLE_FIELDS_BY_TYPE, ENTITY_TYPE_LABELS, type ContentChangeRequest, type ContentEntityType } from "../types/contentEdits.types";

type StatusFilter = "Pending" | "Confirmed" | "All";

interface AdminCategory {
  id: string;
  title: string;
  description: string;
  icon: typeof Bot;
  /** The kinds of edit reviewed in this category; null while the category is not available yet. */
  entityTypes: readonly ContentEntityType[] | null;
}

/**
 * The admin's content areas. Week content and AI tools are live; the others show where the dashboard
 * is heading and open once their editing exists.
 */
const CATEGORIES: readonly AdminCategory[] = [
  { id: "week-content", title: "Week content", description: "Titles, outcomes, objectives and takeaways", icon: CalendarDays, entityTypes: ["placement", "topic"] },
  { id: "ai-tools", title: "AI tools", description: "Tool descriptions and links", icon: Bot, entityTypes: ["agent"] },
  { id: "manager-hub", title: "Manager Hub", description: "Manager guidance before, during and after the Huddle", icon: Users, entityTypes: ["hubGuide", "hubGuideShared"] },
  { id: "facilitator-hub", title: "Facilitator Hub", description: "Facilitator guide before, during and after the Huddle", icon: Presentation, entityTypes: ["facilitatorGuide", "facilitatorGuideShared"] },
  { id: "activities", title: "Activities", description: "Phases and tasks", icon: ListChecks, entityTypes: null },
  { id: "resources", title: "Resources", description: "Links and assets", icon: Link2, entityTypes: null },
  { id: "workbook-import", title: "Workbook Import", description: "Bulk content updates", icon: Table2, entityTypes: null },
];

// Confirming reloads the page (so the app re-reads the confirmed data). This carries the success
// message across that reload; the open category is kept in the address (?category=...) for the
// same reason.
const FLASH_KEY = "aito.admin.flash";

function readFlash(): string | null {
  try {
    return window.sessionStorage.getItem(FLASH_KEY);
  } catch {
    return null;
  }
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
const formatDate = (value: string) => dateFormat.format(new Date(value));

const inCategory = (category: AdminCategory, request: ContentChangeRequest) => category.entityTypes?.includes(request.entityType) ?? false;

/** Admin dashboard: content categories, and in each one the edits Managers suggested, to review and confirm. */
export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const contentEdits = useContentEdits();
  const [filter, setFilter] = useState<StatusFilter>("Pending");
  const [flash, setFlash] = useState<string | null>(readFlash);

  useEffect(() => {
    try {
      window.sessionStorage.removeItem(FLASH_KEY);
    } catch {
      // Storage can be unavailable (private mode); the message is only a convenience.
    }
  }, []);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => setFlash(null), 4000);
    return () => window.clearTimeout(timer);
  }, [flash]);

  const category = CATEGORIES.find((item) => item.id === searchParams.get("category") && item.entityTypes) ?? null;
  const openCategory = (next: AdminCategory | null) => {
    setFilter("Pending");
    setSearchParams(next ? { category: next.id } : {});
  };

  const requests = useMemo(
    () => [...(contentEdits.data?.requests ?? [])].sort((a, b) => b.submittedAtUtc.localeCompare(a.submittedAtUtc)),
    [contentEdits.data],
  );
  const pending = requests.filter((request) => request.status === "Pending");
  const confirmed = requests.filter((request) => request.status === "Confirmed");
  const approved = contentEdits.data?.approved;
  const editedItems = [approved?.agents, approved?.placements, approved?.topics, approved?.hubGuides, approved?.hubGuidesShared, approved?.facilitatorGuides, approved?.facilitatorGuidesShared]
    .reduce((total, section) => total + Object.keys(section ?? {}).length, 0);

  const categoryRequests = category ? requests.filter((request) => inCategory(category, request)) : [];
  const categoryPending = categoryRequests.filter((request) => request.status === "Pending");
  const categoryConfirmed = categoryRequests.filter((request) => request.status === "Confirmed");
  const visible = filter === "All" ? categoryRequests : categoryRequests.filter((request) => request.status === filter);
  const CategoryIcon = category?.icon ?? LayoutGrid;

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-white">
        {/* Same width and padding as the app's own header (components/layout/Header.tsx). */}
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10"><img src={aitoLogo} alt="" className="h-7 w-7 object-contain" /></span>
            <div>
              <p className="text-sm font-bold text-foreground">Frontier Accelerator App</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button type="button" onClick={() => navigate("/")} className="inline-flex h-9 items-center rounded-lg border bg-white px-3 text-sm font-semibold transition-colors hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />Back to app
          </button>
        </div>
      </header>

      {/* Same content width as the Huddle pages (HuddlePage.tsx), so the admin pages line up with the app. */}
      <div className="mx-auto max-w-[1540px] space-y-6 p-4 lg:p-6">
        <section className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0F6CBD]/[0.06]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-[#107C10]/[0.04]" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#0F6CBD] text-white shadow-sm"><ShieldCheck className="h-6 w-6" /></span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#0F6CBD]">Content administration</p>
                  <span className="rounded-full border border-[#0F6CBD]/20 bg-[#F5F9FF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F6CBD]">Concept</span>
                </div>
                <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-[#16233A]">Admin dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Review edits suggested by Managers, Facilitators and Team Members. An edit reaches the app only after you confirm it.</p>
              </div>
            </div>
            {contentEdits.data && (pending.length > 0
              ? <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800"><Clock3 className="h-4 w-4" />{pending.length} waiting for review</span>
              : <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-800"><CheckCircle2 className="h-4 w-4" />All caught up</span>)}
          </div>
        </section>

        {flash && <p role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-900"><CheckCircle2 className="h-4 w-4" />{flash}</p>}

        {contentEdits.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />Loading edits…</div>
        ) : contentEdits.error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
            {contentEdits.error instanceof ContentEditsUnavailableError ? contentEdits.error.message : `Edits could not be loaded. ${contentEdits.error.message}`}
          </div>
        ) : category ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F2FF] text-[#0F6CBD]"><CategoryIcon className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-lg font-semibold text-[#16233A]">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
              <button type="button" onClick={() => openCategory(null)} className="inline-flex h-9 items-center rounded-lg border bg-white px-3 text-sm font-semibold transition-colors hover:bg-muted">
                <LayoutGrid className="mr-2 h-4 w-4" />All categories
              </button>
            </div>

            <section className="rounded-2xl border bg-card shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
                <div className="flex items-center gap-2"><History className="h-5 w-5 text-[#0F6CBD]" /><h3 className="text-lg font-semibold text-[#16233A]">Edits and versions</h3></div>
                <div className="inline-flex rounded-lg border bg-[#F7F9FB] p-1" role="tablist" aria-label="Filter edits by status">
                  {(["Pending", "Confirmed", "All"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      role="tab"
                      aria-selected={filter === option}
                      onClick={() => setFilter(option)}
                      className={cn("rounded-md px-3 py-1.5 text-sm font-semibold transition-colors", filter === option ? "bg-[#0F6CBD] text-white" : "text-[#53606E] hover:bg-white")}
                    >
                      {option === "Pending" ? `Pending (${categoryPending.length})` : option === "Confirmed" ? `Confirmed (${categoryConfirmed.length})` : `All (${categoryRequests.length})`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-5">
                {visible.length === 0
                  ? <p className="rounded-xl border border-dashed bg-white py-10 text-center text-sm text-muted-foreground">{filter === "Pending" ? "No edits are waiting for review." : "No edits to show."}</p>
                  : visible.map((request) => <ChangeRequestCard key={request.id} request={request} onConfirmed={setFlash} />)}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryTile icon={Clock3} label="Waiting for review" hint="Edits that need your decision" value={pending.length} tone="amber" />
              <SummaryTile icon={CheckCircle2} label="Confirmed versions" hint="Edits now live in the app" value={confirmed.length} tone="green" />
              <SummaryTile icon={Layers3} label="Items edited" hint="Weeks, Huddles and AI tools changed" value={editedItems} tone="blue" />
            </div>

            <section className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F3F6] text-[#16233A]"><LayoutGrid className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-lg font-semibold text-[#16233A]">Content areas</h2>
                  <p className="text-sm text-muted-foreground">Choose an area to review its edits and versions.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {CATEGORIES.map((item) => <CategoryTile key={item.id} category={item} requests={requests} onOpen={() => openCategory(item)} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function CategoryTile({ category, requests, onOpen }: { category: AdminCategory; requests: readonly ContentChangeRequest[]; onOpen: () => void }) {
  const Icon = category.icon;
  const live = category.entityTypes !== null;
  const own = requests.filter((request) => inCategory(category, request));
  const waiting = own.filter((request) => request.status === "Pending").length;
  const confirmedCount = own.length - waiting;

  const body = (
    <>
      <div className="flex items-start gap-4">
        <span className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors",
          live ? "bg-[#E8F2FF] text-[#0F6CBD] group-hover:bg-[#0F6CBD] group-hover:text-white" : "bg-[#F1F3F6] text-[#8A96A3]",
        )}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className={cn("font-semibold", live ? "text-[#16233A]" : "text-[#616161]")}>{category.title}</p>
            {live && waiting > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">{waiting} new</span>}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed pt-3">
        {live ? (
          <>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-800"><Clock3 className="h-3 w-3" aria-hidden="true" />{waiting} waiting</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-green-800"><CheckCircle2 className="h-3 w-3" aria-hidden="true" />{confirmedCount} confirmed</span>
            </div>
            <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-[#0F6CBD]">
              Review<ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#F1F3F6] px-2 py-1 text-xs font-medium text-[#616161]"><Clock3 className="h-3 w-3" aria-hidden="true" />Available soon</span>
        )}
      </div>
    </>
  );

  return live ? (
    <button type="button" onClick={onOpen} className="group flex h-full flex-col justify-between rounded-xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#8DC8E8] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6CBD]/40">
      {body}
    </button>
  ) : (
    <div aria-disabled="true" className="flex h-full flex-col justify-between rounded-xl border border-dashed bg-[#FAFBFC] p-5">
      {body}
    </div>
  );
}

const SUMMARY_TONES = {
  amber: { icon: "bg-amber-50 text-amber-700", accent: "shadow-[inset_4px_0_0_#C27C0E]" },
  green: { icon: "bg-green-50 text-green-700", accent: "shadow-[inset_4px_0_0_#107C10]" },
  blue: { icon: "bg-[#E8F2FF] text-[#0F6CBD]", accent: "shadow-[inset_4px_0_0_#0F6CBD]" },
} as const;

function SummaryTile({ icon: Icon, label, hint, value, tone }: { icon: typeof Clock3; label: string; hint: string; value: number; tone: keyof typeof SUMMARY_TONES }) {
  return (
    <div className={cn("rounded-2xl border bg-white p-5", SUMMARY_TONES[tone].accent)}>
      <div className="flex items-center gap-4">
        <span className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl", SUMMARY_TONES[tone].icon)}><Icon className="h-5 w-5" /></span>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold leading-none text-[#16233A]">{value}</p>
            <p className="text-sm font-semibold text-[#16233A]">{label}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
    </div>
  );
}

const ENTITY_ICONS: Record<ContentEntityType, typeof Bot> = { agent: Bot, placement: CalendarDays, topic: Layers3, hubGuide: Users, hubGuideShared: Users, facilitatorGuide: Presentation, facilitatorGuideShared: Presentation };

/** Where a confirmed edit applies, in words, so the admin knows how far it reaches. */
function scopeText(request: ContentChangeRequest): string {
  if (request.entityType === "agent") return "Applies to this AI tool everywhere it appears";
  if (request.entityType === "placement" || request.entityType === "hubGuide" || request.entityType === "facilitatorGuide") return request.contextLabel ? `Applies to ${request.contextLabel} only` : "Applies to this week only";
  if (request.entityType === "hubGuideShared" || request.entityType === "facilitatorGuideShared") return request.contextLabel ? `Shared week: applies to ${request.contextLabel}` : "Shared week: applies to every role's copy";
  return "Applies everywhere this Huddle appears";
}

function ChangeRequestCard({ request, onConfirmed }: { request: ContentChangeRequest; onConfirmed: (message: string) => void }) {
  const confirm = useConfirmContentChange();
  const isPending = request.status === "Pending";
  const fields = EDITABLE_FIELDS_BY_TYPE[request.entityType].filter(({ key }) => key in request.proposed);
  const TypeIcon = ENTITY_ICONS[request.entityType];

  const confirmEdit = () => {
    const message = `Version ${request.baseVersion + 1} of ${request.entityName} confirmed. The app now shows the new text.`;
    try { window.sessionStorage.setItem(FLASH_KEY, message); } catch { /* see FLASH_KEY */ }
    confirm.mutate(request.id, {
      // The dev server reloads the page after a confirm; this covers the case where it does not.
      onSuccess: () => onConfirmed(message),
      onError: () => { try { window.sessionStorage.removeItem(FLASH_KEY); } catch { /* see FLASH_KEY */ } },
    });
  };

  return (
    <article className={cn("rounded-xl border bg-white p-5", isPending ? "shadow-[inset_4px_0_0_#C27C0E]" : "shadow-[inset_4px_0_0_#107C10]")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#E8F2FF] px-1.5 py-0.5 text-[11px] font-semibold text-[#0F6CBD]"><TypeIcon className="h-3 w-3" aria-hidden="true" />{ENTITY_TYPE_LABELS[request.entityType]}</span>
            <h3 className="font-semibold text-[#16233A]">{request.entityName}</h3>
            <span className="rounded bg-[#F1F3F6] px-1.5 py-0.5 text-[11px] font-semibold text-[#424242]">Version {request.confirmedVersion ?? request.baseVersion + 1}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", isPending ? "bg-amber-50 text-amber-800" : "bg-green-50 text-green-800")}>{isPending ? "Pending review" : "Confirmed"}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Suggested by {request.submittedBy} on {formatDate(request.submittedAtUtc)}{request.topicName ? ` from "${request.topicName}"` : ""}
            {request.confirmedAtUtc ? ` · Confirmed on ${formatDate(request.confirmedAtUtc)}` : ""}
          </p>
          <p className="mt-0.5 text-xs font-medium text-[#53606E]">{scopeText(request)}</p>
        </div>
        {isPending && (
          <button type="button" onClick={confirmEdit} disabled={confirm.isPending} className="inline-flex h-9 flex-shrink-0 items-center rounded-lg bg-[#0F6CBD] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#115EA3] disabled:opacity-50">
            {confirm.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Confirm
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs font-bold uppercase tracking-wide text-[#424242]">{label}</p>
            <div className="mt-1.5 grid gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-[#F1D4D4] bg-[#FDF6F6] px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#A4262C]">Before</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[#424242]">{request.before[key] || <span className="italic text-muted-foreground">Empty</span>}</p>
              </div>
              <div className="rounded-lg border border-[#CDE8CD] bg-[#F4FBF4] px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#0B6A0B]">After</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[#242424]">{request.proposed[key] || <span className="italic text-muted-foreground">Empty</span>}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirm.error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{confirm.error.message}</p>}
    </article>
  );
}
