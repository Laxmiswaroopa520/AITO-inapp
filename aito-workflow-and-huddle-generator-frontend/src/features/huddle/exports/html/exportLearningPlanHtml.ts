import type { HuddlePlanResponse } from "../../types";
import { createHtmlDocument, downloadHtmlFile } from "./htmlTemplate";
import { escapeHtml, safeHtmlFileName } from "./htmlSanitizer";
import { learningPlanHtmlStyles } from "./learningPlanHtmlStyles";
import type { HtmlExportFile, LearningPlanHtmlExportOptions } from "./html.types";

// Spells out the huddle count the way the reference document does ("Seven
// 30-minute Huddles" rather than "7"). Anything past this range falls back
// to the numeral, which still reads fine.
const HUDDLE_COUNT_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

function huddleCountWord(count: number): string {
  return HUDDLE_COUNT_WORDS[count] ?? String(count);
}

export function createLearningPlanHtmlExport(plan: HuddlePlanResponse, options: LearningPlanHtmlExportOptions = {}): HtmlExportFile {
  const items = [...plan.items].sort((a, b) => a.week - b.week);
  // External IDs like "ae-ent" are internal; show the role name when we have it.
  const audience = options.roleName?.trim() || plan.roleExternalId;

  const weekStart = items[0]?.week;
  const weekEnd = items[items.length - 1]?.week;
  const weekRange = items.length === 0
    ? "No weeks scheduled"
    : weekStart === weekEnd
      ? `Week ${weekStart}`
      : `Weeks ${weekStart}–${weekEnd}`;
  const durations = new Set(items.map((item) => item.huddle.durationMinutes));
  const uniformDuration = durations.size === 1 ? [...durations][0] : null;
  const huddleNoun = items.length === 1 ? "Huddle" : "Huddles";
  const curriculum = items.length === 0
    ? weekRange
    : `${weekRange} · ${huddleCountWord(items.length)}${uniformDuration !== null ? ` ${uniformDuration}-minute` : ""} ${huddleNoun}`;

  const rows = items.map((item) => {
    // A huddle that no longer matches the recommendation is the plan's
    // customization; the item's own isCustomized flag is its path status.
    const changedFromRecommendation = item.huddle.externalId !== item.recommendedHuddleExternalId;
    const customization = changedFromRecommendation ? `Swapped (recommended: ${escapeHtml(item.recommendedHuddleExternalId)})` : "—";
    const duration = item.huddle.durationMinutes === null ? "Duration unavailable" : `${escapeHtml(item.huddle.durationMinutes)} minutes`;
    return `<tr><td>Week ${escapeHtml(item.week)}</td><td>${escapeHtml(item.huddle.name)}</td><td>${item.isCustomized ? "Customized" : "Recommended"}</td><td>${customization}</td><td>${duration}</td></tr>`;
  }).join("");

  const body = `<h1>Role Path</h1><p><strong>Role:</strong> ${escapeHtml(audience)}</p><p><strong>Curriculum:</strong> ${curriculum}</p><table><thead><tr><th>Week</th><th>Huddle</th><th>Path status</th><th>Customization</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table><p><small>This export contains the learning plan only.</small></p>`;

  return {
    html: createHtmlDocument(`${audience} Role Path`, body, learningPlanHtmlStyles),
    fileName: options.fileName ?? safeHtmlFileName(`${audience} - Learning Plan`, "Learning Plan"),
  };
}

export function exportLearningPlanHtml(plan: HuddlePlanResponse, options: LearningPlanHtmlExportOptions = {}): HtmlExportFile {
  const output = createLearningPlanHtmlExport(plan, options);
  downloadHtmlFile(output.html, output.fileName);
  return output;
}
