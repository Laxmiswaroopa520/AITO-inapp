import { HUDDLE_FONT_STACK } from "./fontStack";

/**
 * Shared stylesheet for the Role Path "Export Learning Plan" export
 * (exportLearningPlanHtml.ts) and the All Topics "Custom Learning Plan"
 * export (exportCustomLearningPlanHtml.ts). Both build the same simple
 * shape -- a branded hero header, a plan-summary strip, and a vertical
 * timeline of week/huddle cards -- so they share this one stylesheet.
 *
 * The full downloadable Huddle guide (exportHuddleHtml.ts) is a much
 * richer, tabbed document and intentionally keeps its own separate
 * stylesheet (huddleGuideStyles.ts) rather than sharing this one.
 */
export const huddleHtmlStyles = `
/* Design tokens */
:root{--blue:#0F6CBD;--blue-dark:#115EA3;--blue-soft:#E8F2FF;--surface:#F5F9FF;--navy:#071b31;--text:#242424;--muted:#616161;--border:#dfe4eb;--white:#fff;--green:#107c10;--orange:#ca5010}

/* Base reset */
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:#edf3f8;color:var(--text);font-family:${HUDDLE_FONT_STACK};line-height:1.55}

/* Page shell */
.page{width:min(1180px,calc(100% - 32px));min-height:760px;margin:28px auto;background:var(--white);border:1px solid #dfe3e8;border-radius:18px;box-shadow:0 20px 55px rgba(8,35,56,.12);overflow:hidden}
.content{padding:38px 44px 48px}
.footer{display:flex;justify-content:space-between;gap:16px;padding:17px 44px;border-top:1px solid var(--border);color:#78829c;font-size:11px}

/* Hero header: eyebrow + title + description + meta pills */
.hero{padding:38px 44px 32px;border-bottom:1px solid var(--border)}
.eyebrow{margin:0 0 8px;color:var(--blue);font-size:11px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
h1{max-width:790px;margin:0;color:#0b174d;font-size:clamp(34px,4.6vw,58px);line-height:1.08}
.hero-description{max-width:780px;margin:18px 0 0;color:#536174;font-size:17px}
.meta{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}
.pill{border:1px solid #b5d5f0;border-radius:999px;padding:7px 14px;background:var(--blue-soft);color:var(--blue-dark);font-size:12px;font-weight:700}

/* Plan summary strip */
.plan-summary{display:flex;flex-wrap:wrap;justify-content:space-between;gap:18px;align-items:center;padding:22px;border:1px solid #c7e0f4;border-radius:14px;background:var(--surface)}
.label{display:block;margin-bottom:6px;color:var(--blue-dark);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}

/* Week timeline */
.timeline{position:relative;margin-top:22px;padding-left:74px}
.timeline:before{content:"";position:absolute;left:27px;top:30px;bottom:30px;width:2px;background:#c7e0f4}
.week{position:relative;margin-bottom:16px}
.week-badge{position:absolute;left:-70px;top:12px;z-index:1;display:grid;width:52px;height:52px;place-items:center;border-radius:50%;background:var(--blue);color:#fff;font-weight:800}
.week-card{padding:20px;border:1px solid var(--border);border-radius:14px;background:#fff}
.week-card h3{margin:0;color:var(--navy)}
.week-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.section{margin-top:16px}
.recommended-note{margin-top:12px;padding:10px 12px;border-left:3px solid var(--blue);background:var(--surface);color:var(--muted);font-size:13px}

/* Duration / status / AI-tool tag chips */
.status{border-radius:999px;padding:5px 9px;background:#eaf6ec;color:#176b2c;font-size:12px;font-weight:700}
.status.custom{background:#fff4ce;color:#8a4b08}
.tag{border:1px solid #b5d5f0;border-radius:999px;padding:6px 11px;background:var(--blue-soft);color:var(--blue-dark);font-size:12px;font-weight:600}
.tag-list{display:flex;flex-wrap:wrap;gap:8px}

@media(max-width:760px){
  .page{width:100%;margin:0;border:0;border-radius:0}
  .hero{padding:28px 18px 22px}
  .content{padding:28px 18px}
  .footer{padding:16px 18px;flex-direction:column}
  .timeline{padding-left:58px}
  .week-badge{left:-57px;width:44px;height:44px}
}

@media print{
  body{background:#fff}
  .page{width:100%;margin:0;border:0;border-radius:0;box-shadow:none}
}
`;
