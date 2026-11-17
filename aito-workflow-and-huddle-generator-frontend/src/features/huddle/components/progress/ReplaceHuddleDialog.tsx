import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { HuddleCatalogItemResponse } from "../../types";
import { RecommendedPathCard } from "./RecommendedPathCard";

interface ReplaceHuddleDialogProps {
  open: boolean;
  /** The Huddles that can take this week's place: the role's own, not already on the path. */
  candidates: readonly HuddleCatalogItemResponse[];
  disabled: boolean;
  onReplace: (externalId: string) => void;
  onClose: () => void;
}

const noop = () => undefined;

/**
 * Replace Huddle pop-up. Each candidate is drawn as the same card the Role Path weeks use, without
 * the week circle, the "Week N" line or the week controls, and with a Replace button on the right.
 */
export function ReplaceHuddleDialog({ open, candidates, disabled, onReplace, onClose }: ReplaceHuddleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col p-0" aria-labelledby="replace-huddle-title">
        <DialogHeader className="border-b border-[#E1DFDD] px-6 py-4 pr-12">
          <DialogTitle id="replace-huddle-title">Replace Huddle</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#FAFAFA] p-6">
          {candidates.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Every Huddle is already on this path.</p>
          ) : (
            candidates.map((candidate) => (
              <RecommendedPathCard
                key={candidate.placementExternalId ?? candidate.externalId}
                week={0}
                huddle={candidate}
                customized={false}
                selected={false}
                votePending={false}
                managementMenu={null}
                onSelect={noop}
                onVote={noop}
                htmlExportPending={false}
                htmlExportDisabled
                onExportHtml={noop}
                replacementAction={
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onReplace(candidate.externalId)}
                    className="inline-flex h-8 items-center rounded-md bg-[#0F6CBD] px-3 text-xs font-semibold text-white transition-colors hover:bg-[#115EA3] disabled:opacity-50"
                    aria-label={`Replace with ${candidate.roleTopicName ?? candidate.name}`}
                  >
                    Replace
                  </button>
                }
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
