/**
 * How an AI tool is named on screen and in exports. Display only: membership in Top 5 MCAPS Agents
 * or Additional AI Tools always comes from the API (agents.primary / agents.secondary).
 */
export interface DisplayableAgent {
  readonly externalId: string;
  readonly name: string;
  readonly displayLabel?: string | null;
}

/** The workbook DisplayLabel when present, else the agent name. */
export function agentDisplayName(agent: DisplayableAgent): string {
  return agent.displayLabel?.trim() || agent.name;
}

/**
 * Identity of one listed tool: the agent plus the name it is shown under, matching the backend's
 * placement projection. One agent can carry more than one capability (Sales Agent is also shown as
 * "CX Vitals (surfaced through Sales Agent)"), and each is a separate entry.
 */
export function agentDisplayKey(agent: DisplayableAgent): string {
  return `${agent.externalId}|${agentDisplayName(agent).toLocaleLowerCase()}`;
}

/** Shown names in the given order, each listed once (case-insensitive). */
export function distinctAgentDisplayNames(agents: readonly DisplayableAgent[]): string[] {
  const seen = new Set<string>();
  return agents.map(agentDisplayName).filter((name) => {
    const key = name.toLocaleLowerCase();
    if (!name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const SURFACED_THROUGH = /^(.+?)\s*(?:\(\s*|,\s*|\s)(?:surfaced through|via)\s+([^(),]+?)\s*\)?\s*$/i;

/**
 * Reads a "surfaced through" label: "ECIF Agent (surfaced through Sales Agent)" is the ECIF Agent
 * capability hosted by Sales Agent. The older workbook forms ("..., surfaced through Sales Agent",
 * "... via Sales Agent") are read the same way. Returns null for any other label.
 */
export function surfacedThrough(label: string | null | undefined): { capability: string; host: string } | null {
  const match = label?.trim().match(SURFACED_THROUGH);
  return match ? { capability: match[1].trim(), host: match[2].trim() } : null;
}
