# AITO Huddle Generator: AI Tool Mapping Investigation Report

Investigation only. No application file, data file, template or workbook was changed. All numbers below were produced by read-only comparisons of the latest workbook (`Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx`) with the application's runtime data (`src/data/static-api-data.json`) and by reading the source code.

Paths are relative to the project folder `aito-workflow-and-huddle-generator-frontend/` unless stated. Line numbers refer to the files as they are now.

---

## 1. Executive Summary

**Issue 1 (extra AI tools).** The Primary and Secondary AI Tool lists on the Role Path card, and the "AI tools" list in the right-hand detail panel, are not built from the Huddle's activities. They are read from one stored list per Huddle (`primaryAgents` / `secondaryAgents`). In the current data that list is a copy of the workbook sheet **Topic_Agents** for the Huddle's topic (WF-PLAN). WF-PLAN has 8 rows there: Sales Agent, Cowork, Sales Home (Primary) and Scout, Researcher, MSXI Assist V2, Microsoft 365 Copilot, ECIF Agent (Secondary). That is exactly the 3 + 5 = 8 tools shown. The five activities of the Huddle use only five tools (Sales Agent, Scout, Microsoft 365 Copilot, Cowork, ECIF Agent) according to **Activity_Agents**. Sales Home, Researcher and MSXI Assist V2 exist only in the topic-level sheet. The same topic-level list is attached to all 22 Huddles built on that topic, whatever role or segment they belong to. **Status: root cause confirmed.**

**Issue 2 (Enterprise vs SME&C).** The data model and the screens have no notion of "tool by segment". Segment exists only as a grouping on roles (`role.segment`) and the Segment dropdown only narrows which roles and Huddles are listed; it never filters or swaps tools. Sales Home is attached to 13 topics in Topic_Agents with no segment qualifier, so it appears on Enterprise, USPSI, EPS, Leader and SME&C Huddles alike (always together with Sales Agent). Separately, the "Top 5 Agents" lists in the app home page and in the HTML guide are fixed lists written into the code, and both contain Sales Agent. Neither receives the segment. **Status: logic and template behaviour confirmed. The intended business rule cannot be fully verified from the workbook** (see Section 10): for the SME&C example Huddle the workbook contains no Sales Home at all.

**Important context.** The runtime data is the latest synchronized workbook data (0 differences found by the validation pass), so this is not a stale-data problem. For this one Huddle, the data snapshot taken before the 2026-10-15 workbook synchronization showed the five activity tools as Primary plus Researcher and MSXI Assist V2 as Secondary. The synchronization then applied each topic's Topic_Agents list to every Huddle of that topic, which produced the eight-tool list.

---

## 2. Current Application Data Flow

```
Workbook
  Topic_Agents  (TopicID, AgentID, Primary/Secondary, DisplayLabel, DisplayOrder)
  Activity_Agents (ActivityID, AgentID, UsageType, ...)
        |  synchronization into the bundled runtime data
        v
src/data/static-api-data.json  ->  huddle.placementCatalog[<placement>]   (card record)
                                    .primaryAgents / .secondaryAgents       <- topic-level list
                                    huddle.placementDetails[<placement>]    (detail record)
                                    .primaryAgents / .secondaryAgents       <- same topic-level list
                                    .phases[].activities[].agents           <- activity-level list
        |
        v
src/api/localApiClient.ts  (local stand-in for the API; no server)
  recommendedPath()   272-279   returns placementCatalog[...] for each week of the role's path
  huddleCatalog()     183 ff.   returns catalog records (All Topics view, additional content)
  detail endpoint     561-566   returns placementDetails[...] (or defaultDetails[...])
        |
        v
Mappers
  features/huddle/mappers/huddleMappers.ts      mapHuddleCatalogItemToCard()  lines 41-78
        primaryAgentNames / secondaryAgentNames = response.primaryAgents/secondaryAgents names (73-74)
  features/huddle/mappers/createHuddlePresentationModel.ts   lines 133-134
        agents.primary / agents.secondary = mapAgents(detail.primaryAgents / secondaryAgents)
        |
        v
UI
  Role Path card:      features/huddle/components/progress/RecommendedPathCard.tsx   110, 116 (agentLabel at 29-31)
  All Topics card:     features/huddle/components/catalog/HuddleCatalogCard.tsx      81 (agentLabel at 33)
  Right-hand panel:    features/huddle/components/generated/HuddleDetailPanel.tsx    50 and 66
  Activity cards:      features/huddle/components/generated/HuddleWorkspace.tsx      85, 132, 637, 653
  HTML guide:          features/huddle/exports/html/exportHuddleHtml.ts              1199-1236, 1385-1432, 1465
```

Types: `src/features/huddle/types/huddleApi.types.ts` lines 50-51 (catalog item) and 159-160 (detail) define `primaryAgents` / `secondaryAgents` as a single list per Huddle. There is no per-segment or per-role variant of these fields.

Other consumers of the same topic-level lists: `HuddleResourcesRepository.tsx` 54-57 (tool chips and the "All AI Tools" filter), `HuddlePage.tsx` 244-252 (agent filter options), `localApiClient.ts` 253-259 (agent filter), `GlobalSearch.tsx` 112, `CustomLearningPlanDialog.tsx` 62, `exportCustomLearningPlanHtml.ts` 21-22.

---

## 3. Issue 1 Findings: Extra AI Tools

Example: Enterprise > Account Executive > Week 2. In the app this is placement `AE-PLAN` (workbook placement `PLC-ENT-AE-W02`, topic WF-PLAN, runtime topic id `WF-X-PLAN-01`).

Workbook, Activity_Agents for the five activities of this placement (Activities tab has no tool column; tools live in Activity_Agents):

| Activity | Tier (PracticeTier) | Tool in Activity_Agents |
|---|---|---|
| AE-03-P01 Prioritize account action for this week | Featured | Sales Agent (Primary) |
| AE-03-P02 Build or assess the account plan with approval gate | Featured | Scout (Primary) |
| AE-03-ALT-01 Pressure-test the account priority list | Extended | Microsoft 365 Copilot (Primary) |
| AE-03-ALT-02 Create the account follow-through plan | Extended | Cowork (Primary) |
| AE-03-ECIF-01 Assess ECIF fit and investment momentum | Extended | ECIF Agent (Primary), label "ECIF Agent, surfaced through Sales Agent" |

| Tool | Expected in Excel | Displayed in App | Actual Source | Finding |
|---|---|---|---|---|
| Microsoft 365 Copilot | Yes (AE-03-ALT-01, Extended) | Secondary | Topic_Agents WF-PLAN, Secondary row | Present in both; the app shows it as Secondary while the activity uses it as Primary. |
| Cowork | Yes (AE-03-ALT-02, Extended) | Primary | Topic_Agents WF-PLAN, Primary row | Present in both. |
| Sales Agent | Yes (AE-03-P01, Featured) | Primary | Topic_Agents WF-PLAN, Primary row | Present in both. |
| Scout | Yes (AE-03-P02, Featured) | Secondary | Topic_Agents WF-PLAN, Secondary row | Present in both; shown as Secondary although the activity uses it as Primary. |
| ECIF Agent | Not in your list of four, but it IS in the workbook: Activity_Agents row for AE-03-ECIF-01 (Extended) and a Topic_Agents Secondary row | Secondary | Topic_Agents WF-PLAN, Secondary row | Not an extra relative to the workbook. Your list of four omitted the fifth (ECIF) activity. Worth confirming whether ECIF should show. |
| Sales Home | No (no activity of this Huddle uses it) | Primary | Topic_Agents WF-PLAN, Primary row, DisplayLabel empty | Extra. Exists only at topic level, with no segment qualifier. |
| Researcher | No | Secondary | Topic_Agents WF-PLAN, Secondary row | Extra. Topic level only. |
| MSXI Assist V2 | No | Secondary | Topic_Agents WF-PLAN, Secondary row | Extra. Topic level only. |

Why eight tools instead of four (five by the workbook's activities): the card and panel show `primaryAgents + secondaryAgents`, which equal the 8 Topic_Agents rows of WF-PLAN. Activity tools never feed that list. Confirmed by comparing the stored lists with the workbook for every placement: card tools equal Topic_Agents for 242 topic/placement checks with 0 failures.

Answers to the numbered questions in the request:

1. Source of the list: `huddle.placementCatalog[placement].primaryAgents/secondaryAgents` (cards) and `huddle.placementDetails[placement].primaryAgents/secondaryAgents` (panel), both filled from Topic_Agents.
2. Data flow: Section 2.
3. Activities-equivalent vs topic-level vs role-level: topic-level (Topic_Agents). Not read from activities, not role-level, not a huddle-level free-text field.
4. All activities (featured and extended)? No. Activity tools are not collected into the card or panel list at all. They appear only inside each activity (`HuddleWorkspace.tsx`: first tool as primary, the rest as secondary) and in the HTML guide's "used in huddle" test (`exportHuddleHtml.ts` 1385-1394), which intersects the declared list with activity tools.
5. Do the five activities (2 featured, 3 extended) contribute to a combined list? Not in the app list. Their union is 5 tools; the displayed list is 8.
6. Sales Home, Researcher, MSXI Assist V2 (and ECIF): they come from Topic_Agents WF-PLAN. ECIF also from Activity_Agents.
7. Duplicate, stale, shared, fallback or hardcoded mappings:
   - Shared: all 22 Huddles on topic WF-PLAN carry the identical 8-tool list (checked).
   - Duplicate storage: the card and the detail record each hold their own copy of the list (they agree today).
   - Hardcoded: Top 5 lists (Issue 2). No hardcoded per-Huddle tool lists were found.
   - Fallback: where a topic has no Topic_Agents rows (WF-COMM, WF-FISCAL-CLOSE, WF-FISCAL-PLAN, WF-IMPROVE, WF-ORIENT, WF-TRANSITION), the stored list was left as it was before the synchronization. For the 45 of the 58 workbook placements on those topics that could be matched by identical placement id, the card tools equal the activity-tool union in all 45 (the other 13 were not checked). So two different behaviours coexist in the same app.
8. Latest synchronized data? Yes. The validation pass reports 0 failures for "placement content = workbook" (286 of 286) and "topic agents = Topic_Agents" (242 checks).
9. Workbook available? Yes, compared (above).
10. Exact reason: the card/panel read topic-level Topic_Agents; the workbook's two tool levels (topic and activity) disagree for this Huddle and the workbook does not state which one the card must show.

Scale (runtime data, 286 Huddles): the set of tools on the card equals the set of tools used by the Huddle's own activities in only 64 of 286. Before the synchronization it was 66 of 291. So the card/activity mismatch is general, not specific to Week 2.

---

## 4. Issue 2 Findings: Segment-Specific Tools

| Location | Segment | Expected Tool | Actual Tool | Source of Behavior | Finding |
|---|---|---|---|---|---|
| Enterprise Account Executive, Week 2, Role Path card and panel | Enterprise | Sales Agent (no Sales Home) | Sales Agent, Cowork **and Sales Home** as Primary | Topic_Agents WF-PLAN (no segment column) copied to the placement | Confirmed. Sales Home arrives with the shared topic list. |
| SME&C Commercial Executive, "Triage Commercial Engagement Early" (placement `PLC-SMEC-SMEC-CE-W02`, topic WF-COMM), card and panel | SME&C | Sales Home (stated expectation) | Primary: Cowork, Microsoft 365 Copilot. No Sales Agent, no Sales Home. | WF-COMM has no Topic_Agents rows; the three activities use only Cowork and Microsoft 365 Copilot | Confirmed: the workbook contains no Sales Home for this Huddle, so the app cannot show it. The expectation needs a data decision (Section 10). |
| App home page "Top 5 Agents" card | Not known (shown before a role is chosen) | Sales Home for SME&C, Sales Agent for Enterprise (stated rule) | Researcher, Cowork, Scout, Sales Agent, Agent J.ai for everyone | Fixed array `topAgents` in `HuddleOnboardingExperience.tsx` 104-110, rendered at 441-446 | Confirmed hardcoded. The component receives only `persona`, no role or segment. |
| HTML guide "Top 5 agents" bar (SME&C example) | SME&C | Sales Home in place of Sales Agent | Sales Agent pill always shown (not marked "Used in huddle" in your example) | Fixed `TOP_FIVE_AGENT_NAMES` at `exportHuddleHtml.ts` 1199; band at 1217-1236 | Confirmed hardcoded. The export model has no segment (`createHuddlePresentationModel.ts` carries only `roleExternalId` / `roleName`). Sales Home artwork already exists (`huddleGuideAssets.ts` 40) but is not in the list. |
| Segment dropdown (Role Path and All Topics) | All | Filters tools | Filters roles and Huddles only | `HuddleAudienceSelect.tsx` 57-58, 195-214; `HuddlePage.tsx` 106-107, 160-166 | Confirmed. No tool filtering or substitution exists. |

Answers to the numbered questions in the request:

1. Segment and role: roles carry `segment` (Enterprise 9 roles, USPSI 7, SME&C 6, EPS (Partner) 6, Leader 1). The picked role selects the placements through `weeklyPaths[role]` and `rolePlacements[role]` (`localApiClient.ts`). The segment is derived from the role only for the dropdown (`HuddleAudienceSelect.tsx` 57-58, 99-105).
2. Tool selection driver: topic (card and panel), activity (inside activities), and a global fixed list (Top 5). Not segment and not role.
3. Segment dropdown: it limits the roles offered and, in All Topics, the cards whose roles belong to the segment (`HuddlePage.tsx` 157-199). It does not affect tools.
4. Top 5 on the home page: static array, see table.
5. Top 5 in HTML: static constant, see table.
6. Separate sources? The app home Top 5 and the HTML Top 5 are two separate hardcoded copies of the same five names (images differ). Neither reads from data. The card/panel/HTML tool lists share one data source (the stored placement lists).
7. Why Sales Home shows in Enterprise: Topic_Agents puts Sales Home on 13 topics for all segments. Role_Paths placements on those topics: Enterprise 52, USPSI 47, EPS 33, SME&C 31, Leader 6. Why Sales Agent shows in SME&C: Sales Agent is on 15 topics in Topic_Agents (always together with Sales Home on 13 of them), and it is also used in 24 SME&C activity rows of Activity_Agents (Sales Home is used in only 3). The HTML Top 5 band always shows Sales Agent.
8. Segment-specific mappings supported? No. Neither the workbook sheets Topic_Agents / Activity_Agents nor the runtime types have a segment field. The workbook has a Variants mechanism (`VAR-SMEC-SALESHOME-NOACCESS`), but it only overrides one placement summary text (`PSUM-DAE-SIGNAL`) and the application does not read the Variant sheets.
9. Other affected areas: Section 7.
10. Data alone or code too: Section 6 and Section 8.

Counts of Huddles whose card lists Sales Home / Sales Agent (runtime data):

| Segment (by role) | Huddles | Sales Home + Sales Agent | Sales Agent only | Neither |
|---|---|---|---|---|
| Enterprise | 72 | 52 | 2 | 18 |
| SME&C | 54 | 31 | 7 | 16 |
| USPSI | 63 | 47 | 1 | 15 |
| EPS (Partner) | 54 | 33 | 1 | 20 |
| Leader | 9 | 6 | 1 | 2 |
| Additional content, Enterprise roles | 28 | 20 | 6 | 2 |
| Additional content, SME&C roles | 6 | 6 | 0 | 0 |

No Huddle shows Sales Home without Sales Agent.

---

## 5. Evidence and Code References

| # | File | Function / component | Field or logic | Lines | How it relates |
|---|---|---|---|---|---|
| E1 | `src/data/static-api-data.json` | `huddle.placementCatalog["AE-PLAN"]`, `huddle.placementDetails["AE-PLAN"]` | `primaryAgents` = Sales Agent, Cowork, Sales Home; `secondaryAgents` = Scout, Researcher, MSXI Assist V2, Microsoft 365 Copilot, ECIF Agent; activities' `agents` = one tool each | (single-line JSON; use the key path) | The stored list is the 8 Topic_Agents rows; the activities hold the 5 activity tools. |
| E2 | Workbook `Topic_Agents` | rows with TopicID `WF-PLAN` | 8 rows, Sales Home Primary with empty DisplayLabel | n/a | Source of the eight tools. No segment column. |
| E3 | Workbook `Activity_Agents`, `Activities` | ActivityIDs `AE-03-P01`, `-P02`, `-ALT-01`, `-ALT-02`, `-ECIF-01` | one Primary tool each; PracticeTier Featured/Extended | n/a | Source of the five activity tools. |
| E4 | `src/api/localApiClient.ts` | `recommendedPath()` | `huddle: clone(DATA.huddle.placementCatalog[entry.placementExternalId])` | 272-279 | Role Path cards are the stored catalog records, unmodified. |
| E5 | `src/api/localApiClient.ts` | detail endpoint | returns `placementDetails[placementExternalId]` | 561-566 | The right-hand panel record. |
| E6 | `src/features/huddle/mappers/huddleMappers.ts` | `mapHuddleCatalogItemToCard` | `primaryAgentNames: response.primaryAgents.map(...)`, `secondaryAgentNames: response.secondaryAgents.map(...)` | 73-74 | Card text is the stored list; nothing derived from activities. |
| E7 | `src/features/huddle/components/progress/RecommendedPathCard.tsx` | `RecommendedPathCard`, `agentLabel` | "Primary AI Tool" / "Secondary AI Tools" boxes | 29-31, 110, 116 | Renders E6. |
| E8 | `src/features/huddle/components/generated/HuddleDetailPanel.tsx` | `HuddleDetailPanel` | `const tools = [...data.primaryAgents, ...data.secondaryAgents];` then rendered under "AI tools" | 50, 66 | The 8 pills in the panel (3 + 5). |
| E9 | `src/features/huddle/components/generated/HuddleWorkspace.tsx` | activity card | `activity.agents.slice(1)` shown as secondary | 85, 132, 637, 653 | Activity tools are used only inside activities. |
| E10 | `src/features/huddle/components/onboarding/HuddleOnboardingExperience.tsx` | `topAgents`, `HuddleOnboardingExperience` | fixed array with `name: 'Sales Agent'`; rendered under "Top 5 Agents" | 104-110, 441-446 | Hardcoded home page list. Props are `persona`, `onSelectPersona`, ... only (line 404). |
| E11 | `src/features/huddle/pages/HuddlePage.tsx` | page | renders `HuddleOnboardingExperience` for the orientation view | 517 | No role or segment passed. |
| E12 | `src/features/huddle/exports/html/exportHuddleHtml.ts` | `TOP_FIVE_AGENT_NAMES`, `topFiveAgentBand` | `["Researcher","Cowork","Scout","Sales Agent","Agent J.ai"]`; band built from it | 1199, 1217-1236 | Hardcoded HTML list. |
| E13 | same | declared/used agents | `declaredAgents` = primary + secondary (1385); "used" = declared tools that some activity uses (1389-1394); `topFiveUsedAgents` (1400-1403); summary text (1418-1432); band inserted (1465) | as listed | HTML marks "Used in huddle" only for tools in the declared list. |
| E14 | `src/features/huddle/exports/html/huddleGuideAssets.ts` | `AGENT_ARTWORK` | patterns for `sales home` (line 40) and `sales agent/chat/copilot` (line 41) | 40-41 | Sales Home artwork exists, so a Sales Home pill is technically possible. |
| E15 | `src/features/huddle/components/audience/HuddleAudienceSelect.tsx`; `HuddlePage.tsx` | segment dropdown; `evergreenSegment`, `segmentRoleIds` | segment = `role.segment`, used to list roles and filter cards by role | 57-58, 99-110, 195-214; 106-107, 157-199 | Segment never touches tools. |
| E16 | `src/features/huddle/types/huddleApi.types.ts` | catalog and detail response types | single `primaryAgents` / `secondaryAgents` list, no segment key | 50-51, 159-160 | The model has one list per Huddle. |

Data-level checks (read-only comparisons): "topic agents = Topic_Agents" passed 242 times with 0 failures; "placement content = workbook (incl. activity agents)" passed 286 of 286; card tools equal activity-tool union in 64 of 286 placements.

---

## 6. Data vs. Application Logic

| Problem | Classification | Evidence |
|---|---|---|
| Card and panel show 8 tools (Issue 1) | **Mixed issue** | Application logic: card and panel read the topic-level list and never the activities (E4 to E8). Data: the workbook holds two tool levels that disagree for this Huddle and gives no precedence rule (Topic_Agents vs Activity_Agents). |
| Runtime data older than the workbook | **Not the cause** (stale source ruled out) | 0 failures in the workbook-to-runtime comparison. |
| Sales Home on Enterprise Huddles | **Mixed issue** | Data: Topic_Agents has no segment column and lists Sales Home for all segments. Logic: no segment-aware selection exists (E15, E16). |
| Sales Agent in SME&C | **Mixed issue** | Data: Sales Agent is used in 24 SME&C activity rows and on topic rows. Template: fixed Top 5 lists (E10, E12). |
| App home Top 5 shows Sales Agent for everyone | **UI/template issue** | Hardcoded array (E10); component receives no segment. |
| HTML Top 5 shows Sales Agent for SME&C | **UI/template issue** (plus export model without segment) | Hardcoded constant (E12); model has no segment. |
| "Expected tool: Sales Home" for SME&C Commercial Executive, Triage Commercial Engagement Early | **Unable to determine from the workbook** | WF-COMM has no Topic_Agents rows; its activities use Cowork and Microsoft 365 Copilot only. The expectation is not represented in the data. |
| Segment dropdown does not affect tools | **Application logic issue** (by design today) | E15. |

Can Issue 2 be fixed by data alone? Not completely. Even if the workbook is corrected, (a) the two Top 5 lists are fixed in code, (b) the export model has no segment, and (c) the data model has no place for a segment-specific tool. Data corrections alone can only remove Sales Home from specific topics or Huddles.

---

## 7. Other Potentially Affected Areas

**Confirmed (same mechanism, verified in the data or code):**
- All 22 Huddles on topic WF-PLAN (same eight-tool list), across Enterprise, USPSI, EPS, SME&C and Leader roles.
- The other topics that carry Sales Home in Topic_Agents: WF-CONV, WF-DEAL, WF-HANDOFF, WF-HEALTH, WF-INVEST, WF-OPP, WF-ORCH, WF-PIPE, WF-PLAN, WF-POLICY, WF-RENEW, WF-SOL, WF-VALUE. Role Path Huddles on these topics: Enterprise 52, USPSI 47, EPS 33, SME&C 31, Leader 6; plus additional-content Huddles.
- Card tools differ from activity tools in 222 of 286 Huddles (the general topic-level versus activity-level difference). The most frequent tools shown without any activity using them: Sales Home (193 Huddles), Researcher (149), Agent J.ai (140), Scout (135), Sales Agent (128).
- Other screens reading the same lists: Resources modal tool chips and tool filter, All Topics cards, agent filter, global search subtitle, Custom Learning Plan dialog and its HTML export, the HTML guide's AI tools summary and Resources tool grid.
- Both Top 5 lists (home page and HTML).

**Potential (not verified):**
- `HuddleOrientation.tsx` line 46 has a "Sales Agent" toolkit entry, but the component is only exported (`generated/index.ts` line 5) and no other import was found, so it may be unused.
- PowerPoint export: no tool list handling was found in the files searched; not confirmed.
- Huddles on the six topics without Topic_Agents rows keep an older activity-derived list; their behaviour differs from the other 242 and should be reviewed with the same decision.
- Roles in the USPSI, EPS and Leader segments: no stated rule on Sales Agent versus Sales Home.

---

## 8. Recommended Next Steps for Review (proposals only, nothing implemented)

**Option A: Derive the card and panel tool lists from the Huddle's own activities.**
- Change: build `primaryAgents` / `secondaryAgents` for placements from Activity_Agents (for example Primary = tools of Featured activities, Secondary = tools of Extended activities, or all Primary in activity order), at data-build time or in the mapper.
- Files/layers: synchronization step; or `localApiClient.ts` (catalog and detail records) / `huddleMappers.ts` and `createHuddlePresentationModel.ts`.
- Result: Enterprise AE Week 2 shows Sales Agent, Scout, Microsoft 365 Copilot, Cowork (and ECIF Agent if kept). Sales Home, Researcher and MSXI Assist V2 disappear from that Huddle.
- Risks: Huddles whose activities have few or no tools would show fewer tools; agent filter and Resources tool chips would change; All Topics default records still use topics.
- Needs confirmation: precedence rule; Featured vs Extended mapping to Primary/Secondary; whether ECIF stays.

**Option B: Correct the workbook so the topic level can differ by segment or placement.**
- Change: add a placement-level or segment-level tool sheet (or a SegmentID column on Topic_Agents), then re-synchronize.
- Files/layers: workbook, synchronization, runtime data; the application only if the new level needs to be read.
- Result: the owner controls exactly which tools each segment sees.
- Risks: larger data authoring effort; the runtime must be able to carry the new level (Section 8, Option C).
- Needs confirmation: sheet design and who owns it.

**Option C: Segment-aware tool selection in the application.**
- Change: carry the role's segment into the card/panel/export models and apply a mapping (for example segment to the tool that replaces Sales Agent or Sales Home), or filter the stored lists by segment.
- Files/layers: `localApiClient.ts` (or the API), mappers, `HuddleDetailPanel.tsx`, `RecommendedPathCard.tsx`, `HuddleCatalogCard.tsx`, HTML export model.
- Result: Enterprise shows Sales Agent; SME&C shows Sales Home, without editing every topic row.
- Risks: segment is undefined for "All Roles", additional content and All Topics; users with several roles; extra regression surface across the screens in Section 7.
- Needs confirmation: whether Sales Home replaces or supplements Sales Agent in SME&C, and the rule for other segments.

**Option D: Top 5 Agents by segment (app home page).**
- Change: make `topAgents` data- or config-driven and pass segment from the role or from a new front-door Segment toggle.
- Files: `HuddleOnboardingExperience.tsx`, `HuddlePage.tsx`, possibly a shared config.
- Result: SME&C users see Sales Home, Enterprise users see Sales Agent.
- Risks: the home page appears before a role is chosen; a toggle adds a new control and state to persist.
- Needs confirmation: the front-door toggle versus deriving from the chosen role.

**Option E: Top 5 Agents bar in the HTML guide by segment.**
- Change: pass the segment into the export model and select the Top 5 list from it (one template with a segment-dependent list), or generate a separate SME&C template.
- Files: `createHuddlePresentationModel.ts`, `exportHuddleHtml.ts` (1199-1236, 1400-1403), `huddleGuideAssets.ts` (artwork exists), related tests.
- Result: SME&C guides show Sales Home in that slot.
- Risks: the "used in huddle" matching depends on artwork matching; two templates would need to be kept in step.
- Needs confirmation: one template versus two.

Suggested order for review: decide the precedence rule (A or B) first, then the Sales Home / Sales Agent rule, then the two Top 5 lists.

---

## 9. Validation Checklist (for after an approved fix)

1. **Enterprise Account Executive, Week 2.** Tools on the card and in the panel equal the approved rule. With the activity-based rule: Sales Agent, Scout, Microsoft 365 Copilot, Cowork (and ECIF Agent if approved). Sales Home, Researcher and MSXI Assist V2 are absent.
2. **SME&C Commercial Executive, Triage Commercial Engagement Early.** Card and panel match the approved tools; the HTML Top 5 bar shows Sales Home (not Sales Agent) in the approved slot; "Used in huddle" appears only on tools an activity actually uses.
3. **Segment switching.** Change Segment and Role in Role Path and All Topics: tools and Top 5 follow the segment; no stale tools after switching; "All Segments" and "All Roles" behave as decided.
4. **Featured versus extended activities.** For a Huddle with both tiers (Enterprise AE Week 2 has 2 Featured and 3 Extended), confirm that the tool lists reflect the approved handling of each tier.
5. **Top 5 Agents on the app home page.** Check with no role selected, an Enterprise role and an SME&C role.
6. **Top 5 Agents in the HTML guide.** Export one Enterprise and one SME&C Huddle (Role Path and All Topics); check band, "Top 5 / Also used" summary and Resources tool grid.
7. **Other roles and weeks.** Spot-check a Huddle in each segment (Enterprise, SME&C, USPSI, EPS, Leader), one additional-content Huddle, and each of the six topics without Topic_Agents rows (WF-COMM, WF-FISCAL-CLOSE, WF-FISCAL-PLAN, WF-IMPROVE, WF-ORIENT, WF-TRANSITION).
8. **Other screens.** Resources modal tool chips and tool filter, agent filter on All Topics, global search subtitle, Custom Learning Plan dialog and HTML export.
9. **Data source and reload.** Hard-reload the app (and clear site data) and confirm the lists still match; re-run the workbook-to-runtime comparison (expect 0 differences) so the correct source is used after any re-synchronization.
10. **Regression.** Role Path order, counts, vote buttons, plan saving, HTML export of all Huddles, the existing test suite and the build.

---

## 10. Questions Requiring a Decision

1. **Which tool level is authoritative for a Huddle's card and panel:** Activity_Agents (the Huddle's own activities) or Topic_Agents (the topic)? If both, which wins when they disagree?
2. If activity-based: how do Featured and Extended activities map to Primary and Secondary AI Tools?
3. Should Researcher and MSXI Assist V2 appear for Enterprise AE Week 2 at all (they are topic-level only)?
4. Should ECIF Agent appear for Enterprise AE Week 2? It is in Activity_Agents (Extended activity, "surfaced through Sales Agent"); your list of four did not include it.
5. **Sales Home versus Sales Agent:** does Sales Home replace Sales Agent in SME&C everywhere (which also affects the 24 SME&C activity rows that use Sales Agent), or is it shown in addition? What applies to USPSI, EPS (Partner) and Leader?
6. For SME&C Commercial Executive "Triage Commercial Engagement Early", the workbook has no Sales Home for the Huddle. Should the workbook be extended, or is Sales Home only expected in the Top 5 Agents bar?
7. **Home page Top 5:** should it change by segment, and if so is a Segment toggle on the front page wanted, or should it follow the chosen role (it is shown before a role is chosen today)?
8. **HTML:** one template with a segment-dependent Top 5 list, or a separate SME&C template?
9. For additional-content Huddles and "All Roles" views, which segment's tools apply?
