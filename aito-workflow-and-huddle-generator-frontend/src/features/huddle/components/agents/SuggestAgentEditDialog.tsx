import { useMemo, useState } from "react";
import { Bot, CalendarDays, Info, Layers3, Loader2, Presentation, Send, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useSubmitContentChange } from "@/features/admin/hooks/useContentEdits";
import {
  EDITABLE_AGENT_FIELDS,
  EDITABLE_FACILITATOR_HUB_FIELDS,
  EDITABLE_MANAGER_HUB_FIELDS,
  EDITABLE_TOPIC_FIELDS,
  EDITABLE_WEEK_FIELDS,
  FACILITATOR_LIST_KEYS,
  MANAGER_GUIDE_KEYS,
  type ContentEntityType,
  type EditableField,
  type FieldValues,
} from "@/features/admin/types/contentEdits.types";
import type { HuddleAgentResponse, HuddleDetailResponse } from "../../types";

interface SuggestAgentEditDialogProps {
  detail: HuddleDetailResponse;
  /** Where week edits apply, for example "Week 5 · Account Executive"; null when not known. */
  contextLabel: string | null;
  /** The role suggesting the edit (Manager, Facilitator or Team Member), shown on the Admin dashboard. */
  submittedBy: string;
  /** Opened from the Manager Hub: adds a "Manager Hub" tab for that Hub's own guidance, and opens on it. */
  showManagerHub?: boolean;
  /** Opened from the Facilitator Hub: adds a "Facilitator Hub" tab for that Hub's own guide, and opens on it. */
  showFacilitatorHub?: boolean;
  onClose: () => void;
  onSubmitted: (message: string) => void;
}

type Tab = "manager" | "facilitator" | "week" | "tools";

/** One editable item in the form: this week, the shared Huddle content, or one AI tool. */
interface EditTarget {
  type: ContentEntityType;
  id: string;
  name: string;
  fields: readonly EditableField[];
  original: Record<string, string>;
}

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

function targetKey(target: Pick<EditTarget, "type" | "id">) {
  return `${target.type}:${target.id}`;
}

/**
 * Form for suggesting edits to the selected Huddle (any role): its week content and its AI tools.
 * Nothing changes in the app when it is submitted: each edited item is saved as a Pending version and
 * reaches users only after an admin confirms it on the Admin dashboard.
 */
export function SuggestAgentEditDialog({ detail, contextLabel, submittedBy, showManagerHub = false, showFacilitatorHub = false, onClose, onSubmitted }: SuggestAgentEditDialogProps) {
  const [tab, setTab] = useState<Tab>(showManagerHub ? "manager" : showFacilitatorHub ? "facilitator" : "week");
  // Edited values per item, so switching tabs or tools keeps what was typed.
  const [drafts, setDrafts] = useState<Record<string, Record<string, string>>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = useSubmitContentChange();

  const title = detail.roleTopicName ?? detail.name;

  const weekTarget = useMemo<EditTarget | null>(() => detail.placementExternalId ? {
    type: "placement",
    id: detail.placementExternalId,
    name: title,
    fields: EDITABLE_WEEK_FIELDS,
    // The side card shows the role-facing title and description, falling back to the Huddle's own.
    original: {
      roleTopicName: textOf(detail.roleTopicName ?? detail.name),
      roleTopicDescription: textOf(detail.roleTopicDescription ?? detail.description),
      desiredOutcome: textOf(detail.desiredOutcome),
      todayObjective: textOf(detail.todayObjective),
    },
  } : null, [detail, title]);

  const topicTarget = useMemo<EditTarget>(() => ({
    type: "topic",
    id: detail.externalId,
    name: title,
    fields: EDITABLE_TOPIC_FIELDS,
    original: Object.fromEntries(EDITABLE_TOPIC_FIELDS.map(({ key }) => [key, textOf(detail[key])])),
  }), [detail, title]);

  const agentTargets = useMemo<EditTarget[]>(() => {
    const agents = [...detail.primaryAgents, ...detail.secondaryAgents]
      .filter((agent, index, all) => all.findIndex((candidate) => candidate.externalId === agent.externalId) === index);
    return agents.map((agent: HuddleAgentResponse) => ({
      type: "agent",
      id: agent.externalId,
      name: agent.name,
      fields: EDITABLE_AGENT_FIELDS,
      original: Object.fromEntries(EDITABLE_AGENT_FIELDS.map(({ key }) => [key, textOf(agent[key])])),
    }));
  }, [detail]);

  // Manager Hub guidance. A shared week (Week 1 Orientation, Week 9 Transition) carries the same text
  // in every role's path, so its edit is keyed by Huddle and applies to all of those copies.
  const sharedRoleCount = detail.sharedHubGuideRoleCount ?? 0;
  const isSharedWeek = sharedRoleCount > 1;
  const weekPart = contextLabel?.split(" · ")[0] ?? null;
  const managerTarget = useMemo<EditTarget | null>(() => {
    if (!showManagerHub) return null;
    const id = isSharedWeek ? detail.externalId : detail.placementExternalId;
    if (!id) return null;
    const read = (key: string) => {
      const source = (MANAGER_GUIDE_KEYS.has(key) ? detail.managerGuide : detail.facilitatorGuide) as Record<string, unknown> | null | undefined;
      return textOf(source?.[key]);
    };
    return {
      type: isSharedWeek ? "hubGuideShared" : "hubGuide",
      id,
      name: title,
      fields: EDITABLE_MANAGER_HUB_FIELDS,
      original: Object.fromEntries(EDITABLE_MANAGER_HUB_FIELDS.map(({ key }) => [key, read(key)])),
    };
  }, [showManagerHub, isSharedWeek, detail, title]);

  // Facilitator Hub guide, by the same rule: a shared week's edit applies to every role's copy.
  // List fields (talking points, questions...) are edited one item per line.
  const facilitatorSharedCount = detail.sharedFacilitatorGuideRoleCount ?? 0;
  const isFacilitatorShared = facilitatorSharedCount > 1;
  const facilitatorTarget = useMemo<EditTarget | null>(() => {
    if (!showFacilitatorHub || !detail.facilitatorGuide) return null;
    const id = isFacilitatorShared ? detail.externalId : detail.placementExternalId;
    if (!id) return null;
    const guide = detail.facilitatorGuide as unknown as Record<string, unknown>;
    const read = (key: string) => {
      const value = guide[key];
      return FACILITATOR_LIST_KEYS.has(key) && Array.isArray(value) ? value.join("\n") : textOf(value);
    };
    return {
      type: isFacilitatorShared ? "facilitatorGuideShared" : "facilitatorGuide",
      id,
      name: title,
      fields: EDITABLE_FACILITATOR_HUB_FIELDS,
      original: Object.fromEntries(EDITABLE_FACILITATOR_HUB_FIELDS.map(({ key }) => [key, read(key)])),
    };
  }, [showFacilitatorHub, isFacilitatorShared, detail, title]);

  const [selectedAgentId, setSelectedAgentId] = useState(agentTargets[0]?.id ?? "");
  const selectedAgent = agentTargets.find((target) => target.id === selectedAgentId) ?? agentTargets[0];

  const allTargets = useMemo(
    () => [...(managerTarget ? [managerTarget] : []), ...(facilitatorTarget ? [facilitatorTarget] : []), ...(weekTarget ? [weekTarget] : []), topicTarget, ...agentTargets],
    [managerTarget, facilitatorTarget, weekTarget, topicTarget, agentTargets],
  );
  const valueOf = (target: EditTarget, key: string) => drafts[targetKey(target)]?.[key] ?? target.original[key] ?? "";
  const changedKeys = (target: EditTarget) => target.fields.map(({ key }) => key).filter((key) => valueOf(target, key).trim() !== (target.original[key] ?? "").trim());
  const changedTargets = allTargets.filter((target) => changedKeys(target).length > 0);
  const changedFieldCount = changedTargets.reduce((total, target) => total + changedKeys(target).length, 0);
  const weekTabChanges = [weekTarget, topicTarget].filter((target): target is EditTarget => target !== null).reduce((total, target) => total + changedKeys(target).length, 0);
  const toolsTabChanges = agentTargets.reduce((total, target) => total + changedKeys(target).length, 0);
  const managerTabChanges = managerTarget ? changedKeys(managerTarget).length : 0;
  const facilitatorTabChanges = facilitatorTarget ? changedKeys(facilitatorTarget).length : 0;
  // Shown on the Admin dashboard: which weeks the edit reaches.
  const contextFor = (target: EditTarget) => {
    if (target.type === "placement" || target.type === "hubGuide" || target.type === "facilitatorGuide") return contextLabel;
    if (target.type === "facilitatorGuideShared") return `${weekPart ?? "Shared week"} · all ${facilitatorSharedCount} roles`;
    if (target.type === "hubGuideShared") return `${weekPart ?? "Shared week"} · all ${sharedRoleCount} roles`;
    return null;
  };

  const update = (target: EditTarget, key: string, value: string) => {
    setDrafts((current) => ({ ...current, [targetKey(target)]: { ...(current[targetKey(target)] ?? {}), [key]: value } }));
  };

  const send = async () => {
    if (changedTargets.length === 0) return;
    setSending(true);
    setError(null);
    let sent = 0;
    try {
      for (const target of changedTargets) {
        const before: FieldValues = {};
        const proposed: FieldValues = {};
        changedKeys(target).forEach((key) => {
          before[key] = target.original[key] || null;
          proposed[key] = valueOf(target, key).trim() || null;
        });
        await submit.mutateAsync({
          entityType: target.type,
          entityExternalId: target.id,
          entityName: target.name,
          topicExternalId: detail.externalId,
          topicName: title,
          contextLabel: contextFor(target),
          submittedBy,
          before,
          proposed,
        });
        sent += 1;
        // A sent item is no longer a draft, so a retry after a later failure does not resend it.
        setDrafts((current) => { const next = { ...current }; delete next[targetKey(target)]; return next; });
      }
      onSubmitted(sent === 1 ? "Edit sent for admin review." : `${sent} edits sent for admin review.`);
      onClose();
    } catch (failure) {
      const message = failure instanceof Error ? failure.message : "The edit could not be sent.";
      setError(sent > 0 ? `${sent} edit${sent === 1 ? " was" : "s were"} sent, but the next one failed: ${message}` : message);
    } finally {
      setSending(false);
    }
  };

  const renderFields = (target: EditTarget) => (
    <div className="space-y-4">
      {target.fields.map(({ key, label, multiline, group, hint }, index) => {
        const changed = changedKeys(target).includes(key);
        const fieldClass = cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm leading-6 outline-none transition-colors focus:border-[#0F6CBD] focus:ring-2 focus:ring-[#0F6CBD]/20",
          changed && "border-[#0F6CBD] bg-[#F7FBFF]",
        );
        // A heading each time the Hub stage changes (Before, During, After Huddle).
        const startsGroup = group && group !== target.fields[index - 1]?.group;
        return (
          <div key={key} className="space-y-4">
          {startsGroup && <p className={cn("text-xs font-bold uppercase tracking-wide text-[#0F6CBD]", index > 0 && "border-t pt-4")}>{group}</p>}
          <label className="block">
            <span className="flex items-center gap-2 text-sm font-semibold text-[#16233A]">
              {label}
              {changed && <span className="rounded bg-[#E8F2FF] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0F6CBD]">Edited</span>}
            </span>
            {hint && <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>}
            {multiline
              ? <textarea value={valueOf(target, key)} onChange={(event) => update(target, key, event.target.value)} rows={3} className={cn(fieldClass, "mt-1.5 resize-y")} />
              : <input value={valueOf(target, key)} onChange={(event) => update(target, key, event.target.value)} className={cn(fieldClass, "mt-1.5 h-10")} />}
          </label>
          </div>
        );
      })}
    </div>
  );

  const scopeNote = (icon: typeof Info, text: string) => {
    const Icon = icon;
    return <p className="mb-3 flex items-start gap-2 rounded-lg bg-[#F5F9FF] px-3 py-2 text-xs leading-5 text-[#53606E]"><Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#0F6CBD]" aria-hidden="true" />{text}</p>;
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl p-0">
        <header className="border-b px-6 py-5 pr-12">
          <h2 className="text-lg font-semibold text-[#16233A]">Suggest edits</h2>
          <p className="mt-1 text-sm text-muted-foreground">Changes go to an admin for review. Nothing changes in the app until an admin confirms them.</p>
          <div className="mt-4 inline-flex rounded-lg border bg-[#F7F9FB] p-1" role="tablist" aria-label="What to edit">
            {([
              ...(showManagerHub ? [["manager", "Manager Hub", managerTabChanges] as const] : []),
              ...(showFacilitatorHub ? [["facilitator", "Facilitator Hub", facilitatorTabChanges] as const] : []),
              ["week", "Week content", weekTabChanges] as const,
              ["tools", "AI tools", toolsTabChanges] as const,
            ]).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={cn("rounded-md px-3 py-1.5 text-sm font-semibold transition-colors", tab === value ? "bg-[#0F6CBD] text-white" : "text-[#53606E] hover:bg-white")}
              >
                {label}{count > 0 ? ` (${count})` : ""}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-6 px-6 py-5">
          {tab === "manager" ? (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#424242]"><Users className="h-3.5 w-3.5" aria-hidden="true" />Manager Hub guidance</h3>
              {managerTarget ? (
                <>
                  {isSharedWeek
                    ? scopeNote(Info, `This is a shared week: your edit applies to ${weekPart ?? "this week"} for all ${sharedRoleCount} roles, so every role keeps the same Manager guidance.`)
                    : scopeNote(Info, `Applies to this week only${contextLabel ? ` (${contextLabel})` : ""}. Other weeks keep their own Manager guidance.`)}
                  {renderFields(managerTarget)}
                </>
              ) : scopeNote(Info, "Open this Huddle from a week card to edit its Manager Hub guidance.")}
            </section>
          ) : tab === "facilitator" ? (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#424242]"><Presentation className="h-3.5 w-3.5" aria-hidden="true" />Facilitator Hub guide</h3>
              {facilitatorTarget ? (
                <>
                  {isFacilitatorShared
                    ? scopeNote(Info, `This is a shared week: your edit applies to ${weekPart ?? "this week"} for all ${facilitatorSharedCount} roles, so every role keeps the same Facilitator guide.`)
                    : scopeNote(Info, `Applies to this week only${contextLabel ? ` (${contextLabel})` : ""}. Other weeks and roles keep their own Facilitator guide, even where their text is currently the same.`)}
                  {renderFields(facilitatorTarget)}
                </>
              ) : scopeNote(Info, "Open this Huddle from a week card to edit its Facilitator Hub guide.")}
            </section>
          ) : tab === "week" ? (
            <>
              <section>
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#424242]"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />This week</h3>
                {weekTarget ? (
                  <>
                    {scopeNote(Info, `Applies to this week only${contextLabel ? ` (${contextLabel})` : ""}. Other weeks and roles that use this Huddle keep their own text.`)}
                    {renderFields(weekTarget)}
                  </>
                ) : scopeNote(Info, "Open this Huddle from a week card to edit its title, description, outcome and objective.")}
              </section>
              <section className="border-t pt-5">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#424242]"><Layers3 className="h-3.5 w-3.5" aria-hidden="true" />Takeaways</h3>
                {scopeNote(Info, "Applies everywhere this Huddle appears, in every week and role.")}
                {renderFields(topicTarget)}
              </section>
            </>
          ) : (
            <section>
              {scopeNote(Info, "A confirmed edit applies to this tool everywhere it appears.")}
              <p className="text-xs font-bold uppercase tracking-wide text-[#424242]">AI tool</p>
              <div className="mb-4 mt-2 flex flex-wrap gap-2">
                {agentTargets.map((target) => {
                  const edited = changedKeys(target).length > 0;
                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setSelectedAgentId(target.id)}
                      aria-pressed={target.id === selectedAgent?.id}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        target.id === selectedAgent?.id ? "border-[#0F6CBD] bg-[#0F6CBD] text-white" : "border-[#0F6CBD]/25 bg-[#F5F9FF] text-[#0F6CBD] hover:bg-[#E8F2FF]",
                      )}
                    >
                      <Bot className="h-3.5 w-3.5" aria-hidden="true" />{target.name}{edited ? " •" : ""}
                    </button>
                  );
                })}
              </div>
              {selectedAgent ? renderFields(selectedAgent) : <p className="text-sm text-muted-foreground">This Huddle has no AI tools.</p>}
            </section>
          )}

          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t px-6 py-4">
          <p className="text-xs text-muted-foreground">{changedFieldCount === 0 ? "No changes yet." : `${changedFieldCount} field${changedFieldCount === 1 ? "" : "s"} changed.`}</p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="inline-flex h-10 items-center rounded-lg border bg-white px-4 text-sm font-semibold hover:bg-muted">Cancel</button>
            <button type="button" disabled={changedFieldCount === 0 || sending} onClick={() => void send()} className="inline-flex h-10 items-center rounded-lg bg-[#0F6CBD] px-4 text-sm font-semibold text-white hover:bg-[#115EA3] disabled:opacity-50">
              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}Send for review
            </button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
