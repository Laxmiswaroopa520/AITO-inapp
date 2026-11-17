import { Presentation, Users } from "lucide-react";
import type { HuddleHubKind } from "./HuddleTalkTrackPanel";

/**
 * Presentation-only identity for the two hubs. Both use the application's blue palette; the
 * Manager Hub is set in navy so the two read as related but distinct. Nothing here affects which
 * content a hub shows; that is decided by hubStageContent and the Talk Track panel.
 */
export interface HubTheme {
  label: string;
  Icon: typeof Presentation;
  /** Badge next to the title. */
  badge: string;
  /** Accent text color for eyebrows, active navigation and step numbers. */
  text: string;
  /** Filled accent, used for the active step circle. */
  solid: string;
  /** Light accent background for active navigation rows. */
  soft: string;
  /** Accent bar for the active navigation row (an inset shadow; see HuddleWorkspace's ActivityCard). */
  border: string;
}

const THEMES: Readonly<Record<HuddleHubKind, HubTheme>> = {
  facilitator: {
    label: "Facilitator Hub",
    Icon: Presentation,
    badge: "bg-[#E8F2FF] text-[#0F6CBD] ring-[#C7E0F4]",
    text: "text-[#0F6CBD]",
    solid: "bg-[#0F6CBD] text-white",
    soft: "bg-[#EEF6FC]",
    border: "shadow-[inset_3px_0_0_#0F6CBD]",
  },
  manager: {
    label: "Manager Hub",
    Icon: Users,
    badge: "bg-[#EEF2F8] text-[#1E3252] ring-[#C9D3E3]",
    text: "text-[#1E3252]",
    solid: "bg-[#1E3252] text-white",
    soft: "bg-[#EEF2F8]",
    border: "shadow-[inset_3px_0_0_#1E3252]",
  },
};

export function hubTheme(hub: HuddleHubKind): HubTheme {
  return THEMES[hub === "manager" ? "manager" : "facilitator"];
}
