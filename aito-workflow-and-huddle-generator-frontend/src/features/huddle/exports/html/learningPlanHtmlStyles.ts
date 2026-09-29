/**
 * Dedicated, self-contained stylesheet for the Role Path "Export Learning Plan"
 * export (exportLearningPlanHtml.ts) only.
 *
 * Kept separate from the shared huddleHtmlStyles (htmlStyles.ts) -- which the
 * All Topics "Custom Learning Plan" export (exportCustomLearningPlanHtml.ts)
 * still uses -- so that matching the plain, table-based layout requested for
 * this one export can never affect that unrelated export.
 */
export const learningPlanHtmlStyles = `
body{margin:40px;color:#242424;font-family:"Segoe UI", Arial, sans-serif}
h1{color:#0f6cbd}
table{width:100%;margin-top:24px;border-collapse:collapse}
th,td{padding:12px;border:1px solid #d1d1d1;text-align:left;vertical-align:top}
th{background:#f3f6fb}
small{color:#616161}
`;
