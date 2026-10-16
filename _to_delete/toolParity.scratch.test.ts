import { describe, expect, it } from "vitest";

const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, String(v)), removeItem: (k: string) => void store.delete(k), clear: () => store.clear() },
  configurable: true,
});

describe("scratch: html tools vs role path card", () => {
  it("compares every placement", async () => {
    const { createLocalApiClient } = await import("../../../../api/localApiClient");
    const { getHuddleById } = await import("../../api");
    const { createHuddlePresentationModel } = await import("../../mappers/createHuddlePresentationModel");
    const { createHuddleHtmlExport } = await import("./exportHuddleHtml");
    const data = (await import("../../../../data/static-api-data.json")).default as any;
    const api = createLocalApiClient();
    const label = (a: any) => (a.displayLabel?.trim() || a.name) as string;
    const rows: string[] = [];
    let mismatches = 0, checked = 0, topicLeaks = 0;
    for (const [pid, card] of Object.entries<any>(data.huddle.placementCatalog)) {
      const detail = await getHuddleById(api, card.externalId, pid);
      const model = createHuddlePresentationModel(detail, { roleExternalId: null } as any);
      const html = createHuddleHtmlExport(model).html;
      const m = /Top 5:[^<]*|Also used:[^<]*/g;
      const found = html.match(/<strong[^>]*>\s*((?:Top 5:|Also used:)[\s\S]*?)<\/strong>/);
      let summary = found ? found[1] : "";
      const cardAgents = [...card.primaryAgents, ...card.secondaryAgents];
      const expected = new Set(cardAgents.map(label));
      let rest = summary.replace(/Top 5:|Also used:/g, "");
      for (const n of [...expected].sort((a, b) => b.length - a.length)) rest = rest.split(n).join("");
      const leftover = rest.replace(/[\s,.]/g, "");
      const missing = [...expected].filter((n) => !summary.includes(n));
      checked++;
      if (leftover || missing.length) { mismatches++; rows.push(`${pid}: leftover='${leftover}' missing=${JSON.stringify(missing)} summary=${JSON.stringify(summary)}`); }
      const topicNames = [...(data.huddle.defaultCatalog[card.externalId]?.primaryAgents ?? []), ...(data.huddle.defaultCatalog[card.externalId]?.secondaryAgents ?? [])].map(label);
      const extra = topicNames.filter((n) => !expected.has(n) && leftover.includes(n.replace(/[\s,.]/g, "")));
      if (extra.length) topicLeaks++;
      void m;
    }
    console.log(`CHECKED ${checked} MISMATCH ${mismatches} TOPICLEAK ${topicLeaks}`);
    console.log(rows.slice(0, 15).join("\n"));
    expect(true).toBe(true);
  }, 120000);
});
