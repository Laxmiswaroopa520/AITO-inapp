import { cn } from "@/lib/utils";
import type { HuddleHubKind } from "./HuddleTalkTrackPanel";
import { hubTheme } from "./hubTheme";

/** Identifies which hub is open: Facilitator Hub or Manager Hub. */
export function HubBadge({ hub, className }: { hub: HuddleHubKind; className?: string }) {
  const theme = hubTheme(hub);
  return (
    <span className={cn("inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 ring-1 ring-inset text-[11px] font-semibold", theme.badge, className)}>
      <theme.Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {theme.label}
    </span>
  );
}
