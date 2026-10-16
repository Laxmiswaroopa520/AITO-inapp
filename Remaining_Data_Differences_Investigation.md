# Remaining Excel vs Application Data Differences - Investigation

Source of truth: `Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx`. Application data inspected: `src/data/static-api-data.json` (the runtime data) and `src/api/localApiClient.ts` (mapping logic). This investigation is read-only: no application file, data, mapping or behavior was changed.

Evidence labels used: **Workbook** = what the workbook says; **App** = what the runtime data says; **UI verified** = seen in the running application; **Code/data** = derived from code and runtime data but not visually checked.

## Issue 1 - Thirteen topics still contain older text

### 1.1 The 13 topics

| App topic ID | App topic name | Workbook topic | Workbook name | Fields still older | Placements carrying a copy |
|---|---|---|---|---|---|
| WF-X-PLAN-01 | Prioritize and Plan the Account | WF-PLAN | Prioritize Work and Allocate Capacity | name, whyItMatters, keyTakeaway, desiredOutcome | 19 |
| WF-X-PIPE-01 | Inspect the Pipeline and Build the Forecast | WF-PIPE | Inspect Pipeline and Commercial Evidence | name, whyItMatters, keyTakeaway, desiredOutcome | 5 |
| WF-X-CONV-01 | Prepare and Lead a Customer Conversation | WF-CONV | Prepare and Lead Customer Engagement | name, whyItMatters, keyTakeaway, desiredOutcome | 22 |
| WF-X-ARCH-01 | Design and Validate the Technical Solution | WF-SOL | Discover, Shape, and Validate a Solution | name, whyItMatters, keyTakeaway, desiredOutcome | 19 |
| WF-X-DISC-01 | Lead Discovery and Define Decision Criteria | WF-SOL | Discover, Shape, and Validate a Solution | name, whyItMatters, keyTakeaway, desiredOutcome | 2 |
| WF-X-HEALTH-01 | Assess Health and Prioritize Risk | WF-HEALTH | Assess Customer and Delivery Health | name, whyItMatters, keyTakeaway, desiredOutcome | 22 |
| WF-X-DEAL-01 | Advance and Structure the Deal | WF-DEAL | Advance a Deal Through Its Next Decision | name, whyItMatters, keyTakeaway, desiredOutcome | 22 |
| WF-X-VALUE-01 | Prove and Communicate Value | WF-VALUE | Prove and Communicate Customer Value | name, whyItMatters, keyTakeaway, desiredOutcome | 20 |
| WF-X-ORCH-01 | Orchestrate the Team, Partners and Delivery | WF-ORCH | Orchestrate Cross-Role Work and Dependencies | name, whyItMatters, keyTakeaway, desiredOutcome | 21 |
| WF-X-HANDOFF-01 | Hand Off Ownership Without Dropping the Customer | WF-HANDOFF | Transfer Work with Accepted Ownership | name, whyItMatters, keyTakeaway, desiredOutcome, focusAreaExternalId | 7 |
| WF-X-SPONSOR-01 | Build and Govern Executive Sponsorship | WF-CONV | Prepare and Lead Customer Engagement | name, whyItMatters, keyTakeaway, desiredOutcome, focusAreaExternalId | 1 |
| WF-X-SIGNAL-01 | Work the Signal Queue Before It Expires | WF-PIPE | Inspect Pipeline and Commercial Evidence | name, whyItMatters, keyTakeaway, desiredOutcome | 2 |
| WF-X-TERRITORY-01 | Plan the Territory With the Partners Who Cover It | WF-PLAN | Prioritize Work and Allocate Capacity | name, whyItMatters, keyTakeaway, desiredOutcome | 3 |

Total placement copies: 165.

### 1.2 Current app value vs workbook value, field by field

**WF-X-PLAN-01** -> workbook `WF-PLAN`

| Field | App (current) | Workbook |
|---|---|---|
| name | Prioritize and Plan the Account | Prioritize Work and Allocate Capacity |
| whyItMatters | Time is the scarcest resource in the week. Deciding where it goes on evidence, rather than by habit or by whoever asked last, is the difference between a quarter you shaped and one that happened to you. | Shared, evidence-based priorities direct limited attention to work that can make progress and expose capacity or authority gaps early. |
| keyTakeaway | Prioritization is a decision about what you will not do. AI can assemble the evidence; the choice stays yours. | Make trade-offs explicit: choose what to advance, defer, or route, and name who owns the next decision. |
| desiredOutcome | Use a repeatable, evidence-backed approach to account prioritization that supports owned actions, explicit deferrals, and reconsideration when customer or commercial signals change. | Make and revisit evidence-based priorities that balance meaningful outcomes, capacity, and decision authority, with clear trade-offs and accountable follow-through. |

**WF-X-PIPE-01** -> workbook `WF-PIPE`

| Field | App (current) | Workbook |
|---|---|---|
| name | Inspect the Pipeline and Build the Forecast | Inspect Pipeline and Commercial Evidence |
| whyItMatters | Every forecast conversation, coverage review and consumption call rests on data somebody has to trust. When the underlying signal is wrong, everything built on it is guesswork wearing a number. | Evidence-based inspection keeps teams focused on the movement and record changes that can alter decisions, customer outcomes, or forecast confidence. |
| keyTakeaway | A forecast is an argument, not a number. AI improves the evidence; it does not make the call. | Separate a signal from a verified deal state; record source, scope, and as-of timing before changing the forecast or route. |
| desiredOutcome | Maintain a more reliable pipeline inspection habit that verifies source meaning, challenges proposed fixes, and keeps deal records aligned with known customer reality. | Interpret commercial and portfolio signals with greater confidence, distinguishing verified movement from assumptions and using material changes to guide accountable decisions. |

**WF-X-CONV-01** -> workbook `WF-CONV`

| Field | App (current) | Workbook |
|---|---|---|
| name | Prepare and Lead a Customer Conversation | Prepare and Lead Customer Engagement |
| whyItMatters | Customer conversations are where decisions actually move. They are won or lost in preparation, and preparation is the first thing dropped when the calendar fills. | Preparation and purposeful engagement help customers make informed decisions and strengthen sponsorship without substituting activity for progress. |
| keyTakeaway | Preparation is where the meeting is decided. AI makes good preparation fast enough to actually happen. | Start with the customer outcome and the decision or relationship move the conversation should enable. |
| desiredOutcome | Present technical choices in business terms with defensible proof and realistic asks, preserving the limits of roadmap statements and available support. | Lead more purposeful customer engagement that clarifies the decision or relationship need, uses credible evidence, and adapts to what customers actually say. |

**WF-X-ARCH-01** -> workbook `WF-SOL`

| Field | App (current) | Workbook |
|---|---|---|
| name | Design and Validate the Technical Solution | Discover, Shape, and Validate a Solution |
| whyItMatters | A design the customer cannot see or test is a document. Proof is what converts technical work into a customer decision, and criteria set afterwards get argued about forever. | A traceable path from problem to validated proof helps teams recommend solutions responsibly and move customer decisions without overstating evidence. |
| keyTakeaway | A design nobody has argued against has not been validated. Proof is what converts a design into a decision. | Connect the technical recommendation and evidence to the agreed customer criteria while making gaps, risks, and decision rights explicit. |
| desiredOutcome | Make traceable architecture recommendations that preserve customer criteria, technical review boundaries, and explicit conditions for reconsideration as validation evidence emerges. | Make more defensible solution choices by connecting customer needs and decision criteria to technical options and proof, keeping validation gaps and human judgment explicit. |

**WF-X-DISC-01** -> workbook `WF-SOL`

| Field | App (current) | Workbook |
|---|---|---|
| name | Lead Discovery and Define Decision Criteria | Discover, Shape, and Validate a Solution |
| whyItMatters | Discovery that ends without agreed decision criteria produces a second discovery meeting. The stated problem is rarely the real one. | A traceable path from problem to validated proof helps teams recommend solutions responsibly and move customer decisions without overstating evidence. |
| keyTakeaway | Discovery that does not end in decision criteria is a conversation, not discovery. | Connect the technical recommendation and evidence to the agreed customer criteria while making gaps, risks, and decision rights explicit. |
| desiredOutcome | Lead technical discovery that establishes a bounded problem and customer-confirmed decision criteria, with enough context for the next technical stage to proceed responsibly. | Make more defensible solution choices by connecting customer needs and decision criteria to technical options and proof, keeping validation gaps and human judgment explicit. |

**WF-X-HEALTH-01** -> workbook `WF-HEALTH`

| Field | App (current) | Workbook |
|---|---|---|
| name | Assess Health and Prioritize Risk | Assess Customer and Delivery Health |
| whyItMatters | Risk found early is a conversation. The same risk found late is an escalation with an audience. Scores tell us something is wrong; they rarely tell us what to do. | Early, evidence-backed risk and satisfaction reviews create time to adjust delivery or engagement before outcomes deteriorate. |
| keyTakeaway | Risk found early is a conversation. The same risk found late is an escalation. | A health signal is actionable when its evidence, accountable owner, and next decision are clear. |
| desiredOutcome | Prioritize commercial interventions by consequence and evidence, distinguishing risks worth acting on from those to monitor and routing decisions within the appropriate authority. | Recognize material customer or delivery risk and choose proportionate interventions, reassessing progress through relevant evidence rather than treating a health signal as a conclusion. |

**WF-X-DEAL-01** -> workbook `WF-DEAL`

| Field | App (current) | Workbook |
|---|---|---|
| name | Advance and Structure the Deal | Advance a Deal Through Its Next Decision |
| whyItMatters | Deals stall on structure more often than on merit. The cost of discovering an approval requirement late is measured in weeks. | Clear decision paths and reciprocal actions reduce avoidable deal friction while preserving each participant's authority and accountability. |
| keyTakeaway | Deals stall on structure more often than on merit. Getting the shape right early is the cheapest work available. | Make the next decision and its prerequisites visible before asking customers, partners, or internal teams to act. |
| desiredOutcome | Recommend commercial options using explicit customer trade-offs and current approval requirements, keeping available structures separate from terms that have actually been authorized. | Advance qualified opportunities through credible customer and internal decisions, resolving prerequisites with accountable owners while distinguishing proposed actions from authorized commitments. |

**WF-X-VALUE-01** -> workbook `WF-VALUE`

| Field | App (current) | Workbook |
|---|---|---|
| name | Prove and Communicate Value | Prove and Communicate Customer Value |
| whyItMatters | Value that is not evidenced reads as opinion, and value never communicated is invisible at renewal. Customers judge us on outcomes they can see. | Credible value evidence supports better customer, renewal, and investment decisions without overstating causal impact. |
| keyTakeaway | Value that is not evidenced is an opinion. Value that is not communicated is invisible. | Make the outcome, evidence, contribution, and limitations visible before communicating value. |
| desiredOutcome | Explain solution value in terms customers can recognize and relay, distinguishing applicable evidence from assumptions and removing claims that cannot withstand scrutiny. | Use credible outcome evidence to explain value and inform business or customer decisions, preserving contribution limits and revisiting claims when stronger evidence emerges. |

**WF-X-ORCH-01** -> workbook `WF-ORCH`

| Field | App (current) | Workbook |
|---|---|---|
| name | Orchestrate the Team, Partners and Delivery | Orchestrate Cross-Role Work and Dependencies |
| whyItMatters | Most work stalls in the handoff, not the task. Account teams carry responsibility without authority, and explicit handoffs are the only reliable substitute. | Visible dependencies and ownership help teams resolve blockers without absorbing specialist or customer decision rights. |
| keyTakeaway | Most work stalls in the handoff, not in the task. Orchestration is making handoffs explicit. | Cross-role work moves when every dependency has an accepted input, an accountable owner, and a next decision. |
| desiredOutcome | Run a more responsive customer-success operating rhythm that reconciles execution with the success plan and assigns work through agreement rather than silent absorption. | Coordinate shared work through accepted ownership and visible dependencies, using appropriate checkpoints to resolve blockers while preserving each contributor's decision and execution responsibilities. |

**WF-X-HANDOFF-01** -> workbook `WF-HANDOFF`

| Field | App (current) | Workbook |
|---|---|---|
| name | Hand Off Ownership Without Dropping the Customer | Transfer Work with Accepted Ownership |
| whyItMatters | Opportunities lose weeks in the space between two roles, and the customer experiences that gap as being asked the same questions by a new face. The transfer window is short precisely because the cost of a slow one lands on the customer. | Explicit ownership and preserved context prevent dropped decisions, repeated discovery, and unauthorized assumptions across role or team boundaries. |
| keyTakeaway | A handoff is a gated transfer with exit criteria, not a notification. If the receiving role cannot act on what they were given, the handoff has not happened. | A handoff is complete when the receiving owner accepts the work and knows the decision, evidence, boundaries, and next step. |
| desiredOutcome | Send and recover cross-role handoffs with sufficient verified context and explicit receiver acceptance, recognizing that a completed transfer record alone does not establish ownership. | Transfer work with enough verified context and accepted ownership for the receiver to continue, reducing lost commitments and repeated discovery across role or team boundaries. |
| focusAreaExternalId | FA-01 | FA-07 |

**WF-X-SPONSOR-01** -> workbook `WF-CONV`

| Field | App (current) | Workbook |
|---|---|---|
| name | Build and Govern Executive Sponsorship | Prepare and Lead Customer Engagement |
| whyItMatters | Deals stall and escalations turn ugly at exactly the moment nobody senior on the customer side is invested enough to intervene. That investment is built over quarters and cannot be assembled in a week. | Preparation and purposeful engagement help customers make informed decisions and strengthen sponsorship without substituting activity for progress. |
| keyTakeaway | An executive relationship you only use when you need something is not sponsorship. Sponsorship is the relationship that already exists when you need it. | Start with the customer outcome and the decision or relationship move the conversation should enable. |
| desiredOutcome | Develop more resilient executive relationships by distinguishing demonstrated sponsorship from polite interest and investing in relevant value before asking for support. | Lead more purposeful customer engagement that clarifies the decision or relationship need, uses credible evidence, and adapts to what customers actually say. |
| focusAreaExternalId | FA-01 | FA-02 |

**WF-X-SIGNAL-01** -> workbook `WF-PIPE`

| Field | App (current) | Workbook |
|---|---|---|
| name | Work the Signal Queue Before It Expires | Inspect Pipeline and Commercial Evidence |
| whyItMatters | Signals arrive faster than anyone can work them, and the ones that expire do so silently. Whoever is deliberate about which signals they drop ends up ahead of whoever tries to work them all. | Evidence-based inspection keeps teams focused on the movement and record changes that can alter decisions, customer outcomes, or forecast confidence. |
| keyTakeaway | A signal is an unqualified lead with a clock on it. The skill is deciding quickly which ones deserve your time, not working all of them equally. | Separate a signal from a verified deal state; record source, scope, and as-of timing before changing the forecast or route. |
| desiredOutcome | Your solution-area signals separated into real intent, needs-more-evidence and noise, with one routed and the reasoning recorded. | Interpret commercial and portfolio signals with greater confidence, distinguishing verified movement from assumptions and using material changes to guide accountable decisions. |

**WF-X-TERRITORY-01** -> workbook `WF-PLAN`

| Field | App (current) | Workbook |
|---|---|---|
| name | Plan the Territory With the Partners Who Cover It | Prioritize Work and Allocate Capacity |
| whyItMatters | A territory of roughly fifty accounts cannot be covered account by account, so most of it is covered by partners or not at all. The plan is where that becomes deliberate. Left implicit, the accounts that get worked are the ones that shout, and the ones that quietly lapse were never assigned to anybody. | Shared, evidence-based priorities direct limited attention to work that can make progress and expose capacity or authority gaps early. |
| keyTakeaway | Coverage is a decision whether or not you make it. An account nobody named is an account nobody is working. | Make trade-offs explicit: choose what to advance, defer, or route, and name who owns the next decision. |
| desiredOutcome | Make more defensible coverage trade-offs across the territory, revisiting direct and partner-led routes when priorities, capacity, or ownership evidence changes. | Make and revisit evidence-based priorities that balance meaningful outcomes, capacity, and decision authority, with clear trade-offs and accountable follow-through. |
### 1.3 Where the text is stored (and why it is duplicated)

| Store in `static-api-data.json` | What it holds | Affected records |
|---|---|---|
| `huddle.defaultDetails[topic]` | Topic-level name, why it matters, key takeaway, desired outcome, focus area | 13 |
| `huddle.defaultCatalog[topic]` | Card-level copy of topic name, desired outcome, focus area | 13 |
| `huddle.placementDetails[placement]` | One role's use of the topic. Copies the topic name, why it matters, key takeaway, focus area from the topic, and adds role-specific title, objective, WIIFM and outcome | 165 (name, why it matters, key takeaway; focus area for 8 HANDOFF/SPONSOR placements) |
| `huddle.placementCatalog[placement]` | Card-level copy of the placement | 165 (name; focus area for the same 8) |

So the same topic sentence exists once in the topic record and once in every placement of that topic (for example WF-X-CONV-01 is copied into 22 placements). Updating the topic record alone would change nothing a user normally sees, because the screens read the placement record.

### 1.4 What is already correct (so the gap is narrower than "the topic")

For the 145 of the 165 placements that have a workbook placement, the role-specific fields already equal the workbook `Role_Paths` / `Additional_Content` values: role topic name, today's objective, WIIFM and the role-level desired outcome (all 145 match; checked field by field). What is older is only the shared topic-level text: **name, why it matters, key takeaway**, plus the topic-level default desired outcome and, for two topics, the focus area. The other 20 placements are older SME&C placements with no workbook counterpart (see Issue 2), so there is nothing to compare their role-level text against.

### 1.5 What a user sees (Code/data verified; the title and tools behaviour was also UI verified on other cards)

- **Card and detail title** = `roleTopicName ?? name`. The role topic name already matches the workbook, so the title looks correct. The older topic `name` only appears in: the Custom Learning Plan export (it prints `huddle.name`), search/sort by name, the "incomplete session" label (uses the topic default), and wherever a placement has no role name.
- **Overview > "Why It Matters"** and the **Key takeaway** box read the placement's `whyItMatters` / `keyTakeaway`, so they show the older sentence.
- **Example, Enterprise Account Executive, week 2** (placement `AE-PLAN`, topic `WF-X-PLAN-01`): title shows "Prioritize Accounts and Build an Actionable Account Plan" (matches workbook). "Why It Matters" shows "Time is the scarcest resource in the week. Deciding where it goes on evidence, rather than by habit or by whoever asked last, is the difference between a quarter you shaped and one that happened to you." The workbook says "Shared, evidence-based priorities direct limited attention to work that can make progress and expose capacity or authority gaps early."
- **Focus-area filter** (Code/data): the filter reads the placement catalog's `focusAreaExternalId`. The 7 HANDOFF placements and 1 SPONSOR placement carry FA-01 "Pipeline and Opportunity"; the workbook says FA-07 (HANDOFF) and FA-02 (SPONSOR, merged into WF-CONV). Those huddles appear under the wrong filter.

### 1.6 Decisions and caution

- Five of the 13 app topics are merged into a shared workbook topic: WF-X-ARCH-01 and WF-X-DISC-01 both -> WF-SOL; WF-X-SPONSOR-01 -> WF-CONV (shared with WF-X-CONV-01); WF-X-SIGNAL-01 -> WF-PIPE (shared with WF-X-PIPE-01); WF-X-TERRITORY-01 -> WF-PLAN (shared with WF-X-PLAN-01). Applying the workbook literally makes those topics carry identical name/why/takeaway text. This is what the workbook says, but it removes today's topic-specific wording, so it is worth a one-line confirmation.
- Records to update if approved: 13 `defaultDetails`, 13 `defaultCatalog`, 165 `placementDetails`, 165 `placementCatalog` (356 records), plus the focus-area field on 8 placements.
- Adjacent finding (not in the 13): the topic-level default desired outcome also differs for 10 more topics (WF-X-OPP-01, WF-X-RENEW-01, WF-X-POLICY-01, WF-X-ASSET-01, WF-ORIENT-01, WF-X-CONSUME-01, WF-TRANSITION, WF-COACH, WF-PARTNER, WF-COMM). Placements of those topics keep role-specific outcomes (by design), so this only affects the topic default.
## Issue 2 - Activity lists differ (49 workbook-only, 86 app-only)

Counts: app 1,095 activities; workbook 1,058; 1,009 shared by ID; **49 only in the workbook; 86 only in the app**. Prompt text of every one of the 135 was compared with every activity in the other file (similarity >= 0.70): **no match was found**, so none of the 49 is the same activity under another ID or name, and none of the 86 is a renamed workbook activity.

### Overall explanation

Both lists come from one cause. The workbook's `Content_Lineage` sheet records that the SME&C (Digital Account Executive, Commercial Executive, Digital Solution Specialist, Digital Solution Engineer, Digital Cloud Solution Architect, Partner Solution Sales) role paths were rebuilt in a later content version ("V16"). Old placements were replaced by new ones, and old activities were either replaced by new `*-V16-*` activities, folded into surviving activities, or deferred to draft variants. The application still contains the older SME&C content for most weeks, plus the five placements and the Week-9 transitions added earlier. No Enterprise, USPSI or Partner-segment activity is in either list.

### 2A - The 49 workbook-only activities (not in the app)

Every one is genuinely missing: no activity with the same ID, a matching prompt, or a close name exists in the app. Role and week come from the workbook `Role_Paths`. "App shows instead" is what the app currently places in that role-week slot.

| # | Activity ID | Name (workbook) | Topic | Workbook placement | Role - week | Origin per lineage | App shows in that slot |
|---|---|---|---|---|---|---|---|
| 1 | DAE-V16-COSELL-01 | Reconcile Microsoft and partner deal evidence | WF-DEAL | PLC-SMEC-DAE-W05 | Digital Account Executive - W5 | replaces DAE-PARTNER-01, DAE-PARTNER-02, DAE-PARTNER-03, DAE-PARTNER-ALT-01 ... | DAE-DEAL (Advance a Deal Somebody Else May Close) |
| 2 | DAE-V16-COSELL-02 | Name the next decision and co-sell ask | WF-DEAL | PLC-SMEC-DAE-W05 | Digital Account Executive - W5 | replaces DAE-PARTNER-01, DAE-PARTNER-02, DAE-PARTNER-03, DAE-PARTNER-ALT-01 ... | DAE-DEAL (Advance a Deal Somebody Else May Close) |
| 3 | DAE-V16-COSELL-03 | Correct stage, close date, and risk | WF-DEAL | PLC-SMEC-DAE-W05 | Digital Account Executive - W5 | replaces DAE-PARTNER-01, DAE-PARTNER-02, DAE-PARTNER-03, DAE-PARTNER-ALT-01 ... | DAE-DEAL (Advance a Deal Somebody Else May Close) |
| 4 | DAE-V16-COVER-03 | Secure and record owner acceptance | WF-PLAN | PLC-SMEC-DAE-W02 | Digital Account Executive - W2 | replaces DAE-TERR-02, DAE-TERR-04 | DAE-TERRITORY (Set the Territory Coverage Plan) |
| 5 | DAE-V16-PORTFOLIO-01 | Identify changes that alter the plan | WF-PIPE | PLC-SMEC-DAE-W08 | Digital Account Executive - W8 | replaces DAE-HEALTH-01, DAE-HEALTH-02, DAE-HEALTH-03, DAE-HEALTH-04 ... | DAE-HEALTH (Read Portfolio Health Without Inspecting Every Account) |
| 6 | DAE-V16-PORTFOLIO-02 | Route the intervention by accountable role | WF-PIPE | PLC-SMEC-DAE-W08 | Digital Account Executive - W8 | replaces DAE-HEALTH-01, DAE-HEALTH-02, DAE-HEALTH-03, DAE-HEALTH-04 ... | DAE-HEALTH (Read Portfolio Health Without Inspecting Every Account) |
| 7 | DAE-V16-PORTFOLIO-03 | Close the loop into growth and forecast | WF-PIPE | PLC-SMEC-DAE-W08 | Digital Account Executive - W8 | replaces DAE-HEALTH-01, DAE-HEALTH-02, DAE-HEALTH-03, DAE-HEALTH-04 ... | DAE-HEALTH (Read Portfolio Health Without Inspecting Every Account) |
| 8 | DCSA-V16-INTERVENE-01 | Validate the blocker hypothesis | WF-CONSUME | PLC-SMEC-DCSA-W06 | Digital Cloud Solution Architect - W6 | replaces DCSA-CONV-01, DCSA-CONV-02, DCSA-CONV-03, DCSA-HEALTH-01 ... | DCSA-ARCH (Design Something That Will Run Without You There) |
| 9 | DCSA-V16-INTERVENE-02 | Choose and assign the smallest intervention | WF-CONSUME | PLC-SMEC-DCSA-W06 | Digital Cloud Solution Architect - W6 | replaces DCSA-CONV-01, DCSA-CONV-02, DCSA-CONV-03, DCSA-HEALTH-01 ... | DCSA-ARCH (Design Something That Will Run Without You There) |
| 10 | DCSA-V16-INTERVENE-03 | Close the customer loop and test movement | WF-CONSUME | PLC-SMEC-DCSA-W06 | Digital Cloud Solution Architect - W6 | replaces DCSA-CONV-01, DCSA-CONV-02, DCSA-CONV-03, DCSA-HEALTH-01 ... | DCSA-ARCH (Design Something That Will Run Without You There) |
| 11 | DCSA-V16-MILESTONE-01 | Trace the milestone to accepted technical intent | WF-CONSUME | PLC-SMEC-DCSA-W04 | Digital Cloud Solution Architect - W4 | replaces DCSA-ARCH-01, DCSA-ARCH-02, DCSA-ARCH-03 | DCSA-CONV (Make the One Conversation Count) |
| 12 | DCSA-V16-MILESTONE-02 | Close delivery prerequisites and ownership | WF-CONSUME | PLC-SMEC-DCSA-W04 | Digital Cloud Solution Architect - W4 | replaces DCSA-ARCH-01, DCSA-ARCH-02, DCSA-ARCH-03 | DCSA-CONV (Make the One Conversation Count) |
| 13 | DCSA-V16-MILESTONE-03 | Define completion and escalation evidence | WF-CONSUME | PLC-SMEC-DCSA-W04 | Digital Cloud Solution Architect - W4 | replaces DCSA-ARCH-01, DCSA-ARCH-02, DCSA-ARCH-03 | DCSA-CONV (Make the One Conversation Count) |
| 14 | DSE-V16-ARCH-03 | Record the architecture recommendation and risk | WF-SOL | PLC-SMEC-DSE-W03 | Digital Solution Engineer - W3 | replaces DSE-ARCH-03, DSE-ARCH-ALT-01 | DSE-ARCH (Design the Decision-Ready Technical Option) |
| 15 | DSE-V16-DECISION-01 | Evaluate every agreed criterion | WF-SOL | PLC-SMEC-DSE-W05 | Digital Solution Engineer - W5 | replaces DSE-CONV-01, DSE-CONV-02, DSE-CONV-03 | DSE-CONV (Answer a Question You Were Not Asked Directly) |
| 16 | DSE-V16-DECISION-02 | State recommendation and residual risk | WF-SOL | PLC-SMEC-DSE-W05 | Digital Solution Engineer - W5 | replaces DSE-CONV-01, DSE-CONV-02, DSE-CONV-03 | DSE-CONV (Answer a Question You Were Not Asked Directly) |
| 17 | DSE-V16-DECISION-03 | Record acceptance and relay-safe summary | WF-SOL | PLC-SMEC-DSE-W05 | Digital Solution Engineer - W5 | replaces DSE-CONV-01, DSE-CONV-02, DSE-CONV-03 | DSE-CONV (Answer a Question You Were Not Asked Directly) |
| 18 | DSS-V16-ACTIVATE-01 | Move from commitment into an owned activation plan | WF-CONSUME | PLC-SMEC-DSS-W07 | Digital Solution Area Specialist - W7 | net-new in V16 package | DSS-COMP (Build a Competitive Position the Customer Would Recognize) |
| 19 | DSS-V16-CONVERT-01 | Name the combined decision and preserve distinct owners | WF-SOL | PLC-SMEC-DSS-W05 | Digital Solution Area Specialist - W5 | replaces DSS-DEAL-01 | DSS-DEAL (Move the Solution Decision, Not the Deal) |
| 20 | DSS-V16-CONVERT-02 | Design proof and conversion together | WF-SOL | PLC-SMEC-DSS-W05 | Digital Solution Area Specialist - W5 | replaces DSS-DEAL-02, DSS-DEAL-03 | DSS-DEAL (Move the Solution Decision, Not the Deal) |
| 21 | DSS-V16-CONVERT-03 | Close the loop from evidence to customer commitment | WF-SOL | PLC-SMEC-DSS-W05 | Digital Solution Area Specialist - W5 | net-new in V16 package | DSS-DEAL (Move the Solution Decision, Not the Deal) |
| 22 | DSS-V16-CONVERT-04 | Stress-test the position against real competitive evidence | WF-SOL | PLC-SMEC-DSS-W05 | Digital Solution Area Specialist - W5 | replaces DSS-CONV-02, DSS-COMP-01, DSS-COMP-02, DSS-COMP-04 | DSS-DEAL (Move the Solution Decision, Not the Deal) |
| 23 | DSS-V16-DEMAND-01 | Read demand in evidence order | WF-PLAN | PLC-SMEC-DSS-W02 | Digital Solution Area Specialist - W2 | replaces DSS-SIGNAL-01, DSS-SIGNAL-ALT-01, DSS-SIGNAL-SCOUT-01 | DSS-SIGNAL (Judge Which Engagement Signals Are Real) |
| 24 | DSS-V16-DEMAND-02 | Assign the action, owner, and route | WF-PLAN | PLC-SMEC-DSS-W02 | Digital Solution Area Specialist - W2 | replaces DSS-SIGNAL-02 | DSS-SIGNAL (Judge Which Engagement Signals Are Real) |
| 25 | DSS-V16-EXPAND-01 | Select the same-account next opportunity from evidence | WF-RENEW | PLC-SMEC-DSS-W08 | Digital Solution Area Specialist - W8 | net-new in V16 package | DSS-ORCH (Make the Ask Specific Enough to Be Accepted) |
| 26 | DSS-V16-EXPAND-02 | Build the renewal and contract-event action plan | WF-RENEW | PLC-SMEC-DSS-W08 | Digital Solution Area Specialist - W8 | net-new in V16 package | DSS-ORCH (Make the Ask Specific Enough to Be Accepted) |
| 27 | DSS-V16-EXPAND-03 | Reconcile the next opportunity, handoffs, CRM, and forecast | WF-RENEW | PLC-SMEC-DSS-W08 | Digital Solution Area Specialist - W8 | net-new in V16 package | DSS-ORCH (Make the Ask Specific Enough to Be Accepted) |
| 28 | DSS-V16-PIPELINE-01 | Qualify, merge, route, or close the demand item | WF-OPP | PLC-SMEC-DSS-W03 | Digital Solution Area Specialist - W3 | replaces DSS-TERR-01, DSS-TERR-03 | DSS-TERRITORY (Find Where Your Solution Area Actually Lands) |
| 29 | DSS-V16-PIPELINE-02 | Route a multi-workload need without fragmenting the customer | WF-OPP | PLC-SMEC-DSS-W03 | Digital Solution Area Specialist - W3 | replaces DSS-TERR-04 | DSS-TERRITORY (Find Where Your Solution Area Actually Lands) |
| 30 | DSS-V16-PIPELINE-03 | Leave an executable CRM and forecast record | WF-OPP | PLC-SMEC-DSS-W03 | Digital Solution Area Specialist - W3 | net-new in V16 package | DSS-TERRITORY (Find Where Your Solution Area Actually Lands) |
| 31 | DSS-V16-ROUTE-01 | Establish the route and eligibility facts | WF-CONSUME | PLC-SMEC-DSS-W06 | Digital Solution Area Specialist - W6 | replaces DSS-ORCH-01 | DSS-VALUE (Prove the Solution Did What You Said It Would) |
| 32 | DSS-V16-ROUTE-02 | Select and secure the co-sell or delivery route | WF-CONSUME | PLC-SMEC-DSS-W06 | Digital Solution Area Specialist - W6 | net-new in V16 package | DSS-VALUE (Prove the Solution Did What You Said It Would) |
| 33 | DSS-V16-ROUTE-03 | Track eligibility, approval, and delivery state | WF-CONSUME | PLC-SMEC-DSS-W06 | Digital Solution Area Specialist - W6 | replaces DSS-ORCH-03 | DSS-VALUE (Prove the Solution Did What You Said It Would) |
| 34 | DSS-V16-ROUTE-04 | Write an ask that preserves the route facts | WF-CONSUME | PLC-SMEC-DSS-W06 | Digital Solution Area Specialist - W6 | replaces DSS-ORCH-02 | DSS-VALUE (Prove the Solution Did What You Said It Would) |
| 35 | DSS-V16-STRATEGY-02 | Build the customer-recognizable solution narrative | WF-SOL | PLC-SMEC-DSS-W04 | Digital Solution Area Specialist - W4 | replaces DSS-CONV-03 | DSS-CONV (Bring Solution Depth to a Conversation You Did Not Arrange) |
| 36 | PSS-V16-CLINIC-01 | Select the blocker worth clinic time | WF-DEAL | PLC-SMEC-PSS-W05 | Partner Solution Sales - W5 | replaces PSS-ORCH-01, PSS-ORCH-02, PSS-ORCH-03 | PSS-ORCH (Run a Rhythm Across More Partners Than You Can Meet) |
| 37 | PSS-V16-CLINIC-02 | Run the decision and record acceptance | WF-DEAL | PLC-SMEC-PSS-W05 | Partner Solution Sales - W5 | replaces PSS-ORCH-01, PSS-ORCH-02, PSS-ORCH-03 | PSS-ORCH (Run a Rhythm Across More Partners Than You Can Meet) |
| 38 | PSS-V16-CLINIC-03 | Test whether the deal moved | WF-DEAL | PLC-SMEC-PSS-W05 | Partner Solution Sales - W5 | replaces PSS-ORCH-01, PSS-ORCH-02, PSS-ORCH-03 | PSS-ORCH (Run a Rhythm Across More Partners Than You Can Meet) |
| 39 | PSS-V16-HANDOFF-01 | Confirm an executable partner deployment plan | WF-HANDOFF | PLC-SMEC-PSS-W07 | Partner Solution Sales - W7 | replaces PSS-VAL-01, PSS-VAL-02, PSS-VAL-03 | PSS-CAPACITY (Confirm Partner Readiness Before Routing Work) |
| 40 | PSS-V16-HANDOFF-02 | Secure route-specific owner acceptance | WF-HANDOFF | PLC-SMEC-PSS-W07 | Partner Solution Sales - W7 | replaces PSS-VAL-01, PSS-VAL-02, PSS-VAL-03 | PSS-CAPACITY (Confirm Partner Readiness Before Routing Work) |
| 41 | PSS-V16-HANDOFF-03 | Set the post-close evidence loop | WF-HANDOFF | PLC-SMEC-PSS-W07 | Partner Solution Sales - W7 | replaces PSS-VAL-01, PSS-VAL-02, PSS-VAL-03 | PSS-CAPACITY (Confirm Partner Readiness Before Routing Work) |
| 42 | PSS-V16-PIPE-03 | Correct the Microsoft forecast narrative | WF-PIPE | PLC-SMEC-PSS-W04 | Partner Solution Sales - W4 | replaces PSS-PARTNER-03, PSS-PARTNER-ALT-01 | PSS-DEMAND (Qualify Partner-Originated Demand Before the Window Closes) |
| 43 | PSS-V16-PLAN-03 | Attach the scalable program or investment route | WF-PLAN | PLC-SMEC-PSS-W02 | Partner Solution Sales - W2 | replaces PSS-JP-03, PSS-JP-04 | PSS-JOINTPLAN (Build the Partner Solution-Area Plan and Route) |
| 44 | PSS-V16-REVIEW-01 | Reconcile plan, pipeline, program, and delivery evidence | WF-PARTNER | PLC-SMEC-PSS-W08 | Partner Solution Sales - W8 | replaces PSS-CONV-01, PSS-CONV-02, PSS-CONV-03 | PSS-CONV (Have the Conversation in the Partner's Economics) |
| 45 | PSS-V16-REVIEW-02 | Frame the decision in partner priorities | WF-PARTNER | PLC-SMEC-PSS-W08 | Partner Solution Sales - W8 | replaces PSS-CONV-01, PSS-CONV-02, PSS-CONV-03 | PSS-CONV (Have the Conversation in the Partner's Economics) |
| 46 | PSS-V16-REVIEW-03 | Agree the next loop and expansion route | WF-PARTNER | PLC-SMEC-PSS-W08 | Partner Solution Sales - W8 | replaces PSS-CONV-01, PSS-CONV-02, PSS-CONV-03 | PSS-CONV (Have the Conversation in the Partner's Economics) |
| 47 | SMEC-CE-V16-APPROVAL-01 | State the approval decision and evidence | WF-COMM | PLC-SMEC-SMEC-CE-W06 | Commercial Executive (SME&C) - W6 | replaces SMEC-CE-ORCH-01, SMEC-CE-ORCH-02, SMEC-CE-ORCH-03, SMEC-CE-DEAL2-01 ... | SMEC-CE-NEG (Set the Negotiation Strategy and Guardrails) |
| 48 | SMEC-CE-V16-APPROVAL-02 | Map and send every required approval | WF-COMM | PLC-SMEC-SMEC-CE-W06 | Commercial Executive (SME&C) - W6 | replaces SMEC-CE-ORCH-01, SMEC-CE-ORCH-02, SMEC-CE-ORCH-03, SMEC-CE-DEAL2-01 ... | SMEC-CE-NEG (Set the Negotiation Strategy and Guardrails) |
| 49 | SMEC-CE-V16-APPROVAL-03 | Resolve exceptions and record the decision | WF-COMM | PLC-SMEC-SMEC-CE-W06 | Commercial Executive (SME&C) - W6 | replaces SMEC-CE-ORCH-01, SMEC-CE-ORCH-02, SMEC-CE-ORCH-03, SMEC-CE-DEAL2-01 ... | SMEC-CE-NEG (Set the Negotiation Strategy and Guardrails) |

**What users miss:** in these 20 role-weeks the workbook's exercises (for example the three approval activities of Commercial Executive week 6, or the demand-triage activities of Digital Solution Specialist week 2) are not available; users get the older exercises instead. By role: Digital Solution Specialist 18, Partner Solution Sales 11, Digital Account Executive 7, Digital Cloud Solution Architect 6, Digital Solution Engineer 4, Commercial Executive 3. Seven are brand-new V16 activities with no predecessor (all Digital Solution Specialist); 42 replace older activities. Sixteen of the 20 workbook placements that hold them do not exist in the app at all (see 2C); for the other 4 activities (`DAE-V16-COVER-03`, `DSE-V16-ARCH-03`, `PSS-V16-PIPE-03`, `PSS-V16-PLAN-03`) the app has the placement, under an older ID, but without that activity.

### 2B - The 86 app-only activities (not in the workbook)

Classification uses the workbook's own lineage (`Content_Lineage`) as evidence:

- **A - Superseded:** lineage says a workbook V16 activity replaced it (67).
- **B - Folded in:** lineage says its content was folded into activities that exist in both files; the activity itself was not carried forward (15).
- **C - Deferred:** lineage says it was deliberately left out of the base journey and parked as a draft variant (4: DSE-HEALTH-01/02/03, DSS-TERR-02).
- **Renamed:** none found. **Application-specific addition:** none found (every one appears in lineage as a predecessor). **Possibly outdated records:** all 86 are older than the V16 content by that lineage, but the lineage says "predecessor", not "delete": whether to keep them is a decision, not a data fix.

| # | Activity ID | Name (app) | App topic | App placement | App role - week | Class | Workbook successor / note |
|---|---|---|---|---|---|---|---|
| 1 | DAE-CONV-02 | Work out what this customer has already been told | WF-X-CONV-01 | DAE-CONV | Digital Account Executive - W4 | B | DAE-CONV-01, DAE-CONV-03, DAE-CONV-04 |
| 2 | DAE-DEAL-01 | Separate what you can see from what you are assuming | WF-X-DEAL-01 | DAE-DEAL | Digital Account Executive - W5 | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 3 | DAE-DEAL-02 | Name the next decision and who actually makes it | WF-X-DEAL-01 | DAE-DEAL | Digital Account Executive - W5 | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 4 | DAE-DEAL-03 | Prepare the specific ask for the partner | WF-X-DEAL-01 | DAE-DEAL | Digital Account Executive - W5 | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 5 | DAE-DEAL-04 | Test the close date against the evidence | WF-X-DEAL-01 | DAE-DEAL | Digital Account Executive - W5 | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 6 | DAE-HEALTH-01 | Find the accounts that changed direction | WF-X-HEALTH-01 | DAE-HEALTH | Digital Account Executive - W8 | A | DAE-V16-PORTFOLIO-01, DAE-V16-PORTFOLIO-02, DAE-V16-PORTFOLIO-03 |
| 7 | DAE-HEALTH-02 | Find out whether it is one account or a pattern | WF-X-HEALTH-01 | DAE-HEALTH | Digital Account Executive - W8 | A | DAE-V16-PORTFOLIO-01, DAE-V16-PORTFOLIO-02, DAE-V16-PORTFOLIO-03 |
| 8 | DAE-HEALTH-03 | Decide what is yours and route the rest | WF-X-HEALTH-01 | DAE-HEALTH | Digital Account Executive - W8 | A | DAE-V16-PORTFOLIO-01, DAE-V16-PORTFOLIO-02, DAE-V16-PORTFOLIO-03 |
| 9 | DAE-HEALTH-04 | Check whether last month's interventions actually worked | WF-X-HEALTH-01 | DAE-HEALTH | Digital Account Executive - W8 | A | DAE-V16-PORTFOLIO-01, DAE-V16-PORTFOLIO-02, DAE-V16-PORTFOLIO-03 |
| 10 | DAE-HEALTH-05 | Let the territory tell you when it moves | WF-X-HEALTH-01 | DAE-HEALTH | Digital Account Executive - W8 | A | DAE-V16-PORTFOLIO-01, DAE-V16-PORTFOLIO-02, DAE-V16-PORTFOLIO-03 |
| 11 | DAE-PARTNER-01 | Decide what genuinely belongs with a partner | WF-X-PARTNER-01 | DAE-PARTNER | not on any role path | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 12 | DAE-PARTNER-02 | Package it so the partner can actually act | WF-X-PARTNER-01 | DAE-PARTNER | not on any role path | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 13 | DAE-PARTNER-03 | Find the referrals that are about to run out of time | WF-X-PARTNER-01 | DAE-PARTNER | not on any role path | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 14 | DAE-PARTNER-ALT-01 | Look at your last few stalled referrals for a common cause | WF-X-PARTNER-01 | DAE-PARTNER | not on any role path | A | DAE-V16-COSELL-01, DAE-V16-COSELL-02, DAE-V16-COSELL-03 |
| 15 | DAE-RENEW-02 | Work out which renewals you can actually evidence | WF-X-RENEW-01 | DAE-RENEW | Digital Account Executive - W7 | B | DAE-RENEW-01, DAE-RENEW-04, DAE-RENEW-03 |
| 16 | DAE-SIGNAL-ALT-01 | Find the pattern in what you keep letting go | WF-X-SIGNAL-01 | DAE-SIGNAL | Digital Account Executive - W3 | B | DAE-SIGNAL-01, DAE-SIGNAL-02, DAE-SIGNAL-03 |
| 17 | DAE-SIGNAL-SCOUT-01 | Be told a signal is expiring instead of finding out | WF-X-SIGNAL-01 | DAE-SIGNAL | Digital Account Executive - W3 | B | DAE-SIGNAL-01, DAE-SIGNAL-02, DAE-SIGNAL-03 |
| 18 | DAE-TERR-02 | Test the plan priorities that were assigned to you | WF-X-TERRITORY-01 | DAE-TERRITORY | Digital Account Executive - W2 | A | DAE-TERR-01, DAE-TERR-03, DAE-V16-COVER-03 |
| 19 | DAE-TERR-04 | Build the coverage position you will defend at Territory Health | WF-X-TERRITORY-01 | DAE-TERRITORY | Digital Account Executive - W2 | A | DAE-TERR-01, DAE-TERR-03, DAE-V16-COVER-03 |
| 20 | DCSA-ARCH-01 | Compare the options on what happens when nobody tunes them | WF-X-ARCH-01 | DCSA-ARCH | Digital Cloud Solution Architect - W6 | A | DCSA-V16-MILESTONE-01, DCSA-V16-MILESTONE-02, DCSA-V16-MILESTONE-03 |
| 21 | DCSA-ARCH-02 | Write the design for the person who will build it | WF-X-ARCH-01 | DCSA-ARCH | Digital Cloud Solution Architect - W6 | A | DCSA-V16-MILESTONE-01, DCSA-V16-MILESTONE-02, DCSA-V16-MILESTONE-03 |
| 22 | DCSA-ARCH-03 | Find what your design assumes the customer has | WF-X-ARCH-01 | DCSA-ARCH | Digital Cloud Solution Architect - W6 | A | DCSA-V16-MILESTONE-01, DCSA-V16-MILESTONE-02, DCSA-V16-MILESTONE-03 |
| 23 | DCSA-CONSUME-ALT-01 | Look for the thing several declining accounts share | WF-X-CONSUME-01 | DCSA-CONSUME | not on any role path | B | DCSA-CONSUME-01, DCSA-CONSUME-02, DCSA-CONSUME-03 |
| 24 | DCSA-CONV-01 | Pick the one thing worth their attention | WF-X-CONV-01 | DCSA-CONV | Digital Cloud Solution Architect - W4 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 25 | DCSA-CONV-02 | Leave something behind that works without you | WF-X-CONV-01 | DCSA-CONV | Digital Cloud Solution Architect - W4 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 26 | DCSA-CONV-03 | Name who has this account after you | WF-X-CONV-01 | DCSA-CONV | Digital Cloud Solution Architect - W4 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 27 | DCSA-HEALTH-01 | Find the accounts where something technical has changed | WF-X-HEALTH-01 | DCSA-HEALTH | Digital Cloud Solution Architect - W7 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 28 | DCSA-HEALTH-02 | Raise a problem the customer has not noticed yet | WF-X-HEALTH-01 | DCSA-HEALTH | Digital Cloud Solution Architect - W7 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 29 | DCSA-HEALTH-03 | Set a standing check so the next one finds you | WF-X-HEALTH-01 | DCSA-HEALTH | Digital Cloud Solution Architect - W7 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 30 | DCSA-HEALTH-04 | Check whether the technical explanation actually holds | WF-X-HEALTH-01 | DCSA-HEALTH | Digital Cloud Solution Architect - W7 | A | DCSA-V16-INTERVENE-01, DCSA-V16-INTERVENE-02, DCSA-V16-INTERVENE-03 |
| 31 | DSE-ARCH-03 | Diagnose something a partner built | WF-X-ARCH-01 | DSE-ARCH | Digital Solution Engineer - W3 | A | DSE-ARCH-01, DSE-ARCH-02, DSE-V16-ARCH-03 |
| 32 | DSE-ARCH-ALT-01 | Work out whether the partner can run this proof instead of you | WF-X-ARCH-01 | DSE-ARCH | Digital Solution Engineer - W3 | A | DSE-ARCH-01, DSE-ARCH-02, DSE-V16-ARCH-03 |
| 33 | DSE-CONV-01 | Work out what was actually asked | WF-X-CONV-01 | DSE-CONV | Digital Solution Engineer - W5 | A | DSE-V16-DECISION-01, DSE-V16-DECISION-02, DSE-V16-DECISION-03 |
| 34 | DSE-CONV-02 | Write an answer that survives being forwarded | WF-X-CONV-01 | DSE-CONV | Digital Solution Engineer - W5 | A | DSE-V16-DECISION-01, DSE-V16-DECISION-02, DSE-V16-DECISION-03 |
| 35 | DSE-CONV-03 | Work out what is not yours to answer | WF-X-CONV-01 | DSE-CONV | Digital Solution Engineer - W5 | A | DSE-V16-DECISION-01, DSE-V16-DECISION-02, DSE-V16-DECISION-03 |
| 36 | DSE-HEALTH-01 | Find who else is running the thing you know breaks | WF-X-HEALTH-01 | DSE-HEALTH | not on any role path | C | draft variant VAR-DSE-CROSSACCOUNT-HEALTH |
| 37 | DSE-HEALTH-02 | Check whether the problem is already being worked | WF-X-HEALTH-01 | DSE-HEALTH | not on any role path | C | draft variant VAR-DSE-CROSSACCOUNT-HEALTH |
| 38 | DSE-HEALTH-03 | Send the fix to whoever can actually apply it | WF-X-HEALTH-01 | DSE-HEALTH | not on any role path | C | draft variant VAR-DSE-CROSSACCOUNT-HEALTH |
| 39 | DSS-COMP-01 | Find out what the competitor actually does well | WF-X-DEAL-01 | DSS-COMP | Digital Solution Area Specialist - W7 | A | DSS-V16-CONVERT-04 |
| 40 | DSS-COMP-02 | Check what this competitor has actually cost you | WF-X-DEAL-01 | DSS-COMP | Digital Solution Area Specialist - W7 | A | DSS-V16-CONVERT-04 |
| 41 | DSS-COMP-04 | Rehearse the objection you know you will get | WF-X-DEAL-01 | DSS-COMP | Digital Solution Area Specialist - W7 | A | DSS-V16-CONVERT-04 |
| 42 | DSS-CONV-02 | Bring what you have learned elsewhere to this customer | WF-X-CONV-01 | DSS-CONV | Digital Solution Area Specialist - W4 | A | DSS-V16-CONVERT-04 |
| 43 | DSS-CONV-03 | Agree the boundary with the DAE before you are in the room | WF-X-CONV-01 | DSS-CONV | Digital Solution Area Specialist - W4 | A | DSS-V16-STRATEGY-02 |
| 44 | DSS-DEAL-01 | Name the solution decision the deal is waiting on | WF-X-DEAL-01 | DSS-DEAL | Digital Solution Area Specialist - W5 | A | DSS-V16-CONVERT-01 |
| 45 | DSS-DEAL-02 | Assemble the evidence that settles it | WF-X-DEAL-01 | DSS-DEAL | Digital Solution Area Specialist - W5 | A | DSS-V16-CONVERT-02 |
| 46 | DSS-DEAL-03 | Check whether you have answered this before | WF-X-DEAL-01 | DSS-DEAL | Digital Solution Area Specialist - W5 | A | DSS-V16-CONVERT-02 |
| 47 | DSS-ORCH-01 | Work out what the opportunity is actually missing | WF-X-ORCH-01 | DSS-ORCH | Digital Solution Area Specialist - W8 | A | DSS-V16-ROUTE-01 |
| 48 | DSS-ORCH-02 | Write the ask so it can be said yes to | WF-X-ORCH-01 | DSS-ORCH | Digital Solution Area Specialist - W8 | A | DSS-V16-ROUTE-04 |
| 49 | DSS-ORCH-03 | Notice when an ask has gone quiet | WF-X-ORCH-01 | DSS-ORCH | Digital Solution Area Specialist - W8 | A | DSS-V16-ROUTE-03 |
| 50 | DSS-SIGNAL-01 | Separate real buying intent from engagement activity | WF-X-SIGNAL-01 | DSS-SIGNAL | Digital Solution Area Specialist - W2 | A | DSS-V16-DEMAND-01 |
| 51 | DSS-SIGNAL-02 | Decide the route before the window closes | WF-X-SIGNAL-01 | DSS-SIGNAL | Digital Solution Area Specialist - W2 | A | DSS-V16-DEMAND-02 |
| 52 | DSS-SIGNAL-ALT-01 | Read what the signals are telling you about your solution area | WF-X-SIGNAL-01 | DSS-SIGNAL | Digital Solution Area Specialist - W2 | A | DSS-V16-DEMAND-01 |
| 53 | DSS-SIGNAL-SCOUT-01 | Watch for the engagement that turns into real intent | WF-X-SIGNAL-01 | DSS-SIGNAL | Digital Solution Area Specialist - W2 | A | DSS-V16-DEMAND-01 |
| 54 | DSS-TERR-01 | Separate propensity from evidence across your solution area | WF-X-TERRITORY-01 | DSS-TERRITORY | Digital Solution Area Specialist - W3 | A | DSS-V16-PIPELINE-01 |
| 55 | DSS-TERR-02 | Find the blocker that repeats across your accounts | WF-X-TERRITORY-01 | DSS-TERRITORY | Digital Solution Area Specialist - W3 | C | draft variant VAR-DSS-BLOCKER-PATTERN |
| 56 | DSS-TERR-03 | Prepare one account for qualification progression | WF-X-TERRITORY-01 | DSS-TERRITORY | Digital Solution Area Specialist - W3 | A | DSS-V16-PIPELINE-01 |
| 57 | DSS-TERR-04 | Test whether you and the DAE are reading the same territory | WF-X-TERRITORY-01 | DSS-TERRITORY | Digital Solution Area Specialist - W3 | A | DSS-V16-PIPELINE-02 |
| 58 | PSS-CAP-03 | Watch for the partner who has stopped moving | WF-X-HEALTH-01 | PSS-CAPACITY | Partner Solution Sales - W7 | B | PSS-CAP-01, PSS-CAP-02, PSS-CAP-04 |
| 59 | PSS-CONV-01 | Assemble what the partner already knows about themselves | WF-X-CONV-01 | PSS-CONV | Partner Solution Sales - W8 | A | PSS-V16-REVIEW-01, PSS-V16-REVIEW-02, PSS-V16-REVIEW-03 |
| 60 | PSS-CONV-02 | Reframe the ask in what their business gains | WF-X-CONV-01 | PSS-CONV | Partner Solution Sales - W8 | A | PSS-V16-REVIEW-01, PSS-V16-REVIEW-02, PSS-V16-REVIEW-03 |
| 61 | PSS-CONV-03 | Rehearse the part where they push back | WF-X-CONV-01 | PSS-CONV | Partner Solution Sales - W8 | A | PSS-V16-REVIEW-01, PSS-V16-REVIEW-02, PSS-V16-REVIEW-03 |
| 62 | PSS-JP-03 | Find where the plan asks more of the partner than it looks like | WF-X-TERRITORY-01 | PSS-JOINTPLAN | Partner Solution Sales - W2 | A | PSS-JP-01, PSS-JP-02, PSS-V16-PLAN-03 |
| 63 | PSS-JP-04 | Set the trigger that tells you the plan has stopped being true | WF-X-TERRITORY-01 | PSS-JOINTPLAN | Partner Solution Sales - W2 | A | PSS-JP-01, PSS-JP-02, PSS-V16-PLAN-03 |
| 64 | PSS-ORCH-01 | Decide which partners need you this month | WF-X-ORCH-01 | PSS-ORCH | Partner Solution Sales - W5 | A | PSS-V16-CLINIC-01, PSS-V16-CLINIC-02, PSS-V16-CLINIC-03 |
| 65 | PSS-ORCH-02 | Give the meeting something to decide | WF-X-ORCH-01 | PSS-ORCH | Partner Solution Sales - W5 | A | PSS-V16-CLINIC-01, PSS-V16-CLINIC-02, PSS-V16-CLINIC-03 |
| 66 | PSS-ORCH-03 | Find out who else is talking to your partner | WF-X-ORCH-01 | PSS-ORCH | Partner Solution Sales - W5 | A | PSS-V16-CLINIC-01, PSS-V16-CLINIC-02, PSS-V16-CLINIC-03 |
| 67 | PSS-PARTNER-03 | Prepare the partner conversation with one specific ask | WF-X-PARTNER-01 | PSS-PARTNER | Partner Solution Sales - W3 | A | PSS-PARTNER-01, PSS-PARTNER-02, PSS-V16-PIPE-03 |
| 68 | PSS-PARTNER-ALT-01 | Look at where your recent deals stopped | WF-X-PARTNER-01 | PSS-PARTNER | Partner Solution Sales - W3 | A | PSS-PARTNER-01, PSS-PARTNER-02, PSS-V16-PIPE-03 |
| 69 | PSS-VAL-01 | Find out what happened after one partner's deals closed | WF-X-VALUE-01 | PSS-VALUE | Partner Solution Sales - W6 | A | PSS-V16-HANDOFF-01, PSS-V16-HANDOFF-02, PSS-V16-HANDOFF-03 |
| 70 | PSS-VAL-02 | Ask the partner something worth answering | WF-X-VALUE-01 | PSS-VALUE | Partner Solution Sales - W6 | A | PSS-V16-HANDOFF-01, PSS-V16-HANDOFF-02, PSS-V16-HANDOFF-03 |
| 71 | PSS-VAL-03 | Get what you learn back to the people who need it | WF-X-VALUE-01 | PSS-VALUE | Partner Solution Sales - W6 | A | PSS-V16-HANDOFF-01, PSS-V16-HANDOFF-02, PSS-V16-HANDOFF-03 |
| 72 | SMEC-CE-DEAL-04 | Check what this deal sets up for the next one | WF-X-DEAL-01 | SMEC-CE-DEAL | Commercial Executive (SME&C) - W3 | B | SMEC-CE-DEAL-01, SMEC-CE-DEAL-02, SMEC-CE-DEAL-03 |
| 73 | SMEC-CE-DEAL2-01 | State the decision you are asking someone to make | WF-X-DEAL-01 | SMEC-CE-DEAL2 | Commercial Executive (SME&C) - W8 | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 74 | SMEC-CE-DEAL2-02 | Make the numbers checkable by someone else | WF-X-DEAL-01 | SMEC-CE-DEAL2 | Commercial Executive (SME&C) - W8 | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 75 | SMEC-CE-DEAL2-03 | Find what you have asserted without showing | WF-X-DEAL-01 | SMEC-CE-DEAL2 | Commercial Executive (SME&C) - W8 | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 76 | SMEC-CE-HEALTH-01 | Scan the book for the gap between bought and used | WF-X-HEALTH-01 | SMEC-CE-HEALTH | Commercial Executive (SME&C) - W4 | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 77 | SMEC-CE-HEALTH-02 | Find the exception you have granted more than once | WF-X-HEALTH-01 | SMEC-CE-HEALTH | Commercial Executive (SME&C) - W4 | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 78 | SMEC-CE-HEALTH-03 | Tell an unattended agreement apart from a partner-covered one | WF-X-HEALTH-01 | SMEC-CE-HEALTH | Commercial Executive (SME&C) - W4 | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 79 | SMEC-CE-HEALTH-04 | Build the case that policy no longer matches practice | WF-X-HEALTH-01 | SMEC-CE-HEALTH | Commercial Executive (SME&C) - W4 | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 80 | SMEC-CE-HEALTH-05 | Keep watching the book between reviews | WF-X-HEALTH-01 | SMEC-CE-HEALTH | Commercial Executive (SME&C) - W4 | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 81 | SMEC-CE-ORCH-01 | Find every approval this structure triggers | WF-X-ORCH-01 | SMEC-CE-ORCH | not on any role path | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 82 | SMEC-CE-ORCH-02 | Replace every implied owner with a named one | WF-X-ORCH-01 | SMEC-CE-ORCH | not on any role path | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 83 | SMEC-CE-ORCH-03 | Find the approval that never landed | WF-X-ORCH-01 | SMEC-CE-ORCH | not on any role path | A | SMEC-CE-V16-APPROVAL-01, SMEC-CE-V16-APPROVAL-02, SMEC-CE-V16-APPROVAL-03 |
| 84 | SMEC-CE-POL-03 | Say out loud what you are relying on | WF-X-POLICY-01 | SMEC-CE-POLICY | Commercial Executive (SME&C) - W5 | B | SMEC-CE-POL-01, SMEC-CE-POL-02, SMEC-CE-POL-04 |
| 85 | SMEC-CE-RENEW-02 | Establish what the agreement actually says versus what is happening | WF-X-RENEW-01 | SMEC-CE-RENEW | not on any role path | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |
| 86 | SMEC-CE-RENEW-04 | Check whether the agreement allows a mid-term change at all | WF-X-RENEW-01 | SMEC-CE-RENEW | not on any role path | B | SMEC-CE-RENEW-01, SMEC-CE-RENEW-03, SMEC-CE-RENEW-05 |

Totals: A=67, B=15, C=4. 68 of the 86 sit in 21 older SME&C placements that have no counterpart in the workbook at all; 18 sit in 12 older placements that do have a workbook counterpart (those placements are kept, but with a different activity set).
### 2C - Where the two lists come from: SME&C role-path slots that differ

Checked all 252 weekly slots across the 30 roles. 227 are in step with the workbook (exact placement or the same slot after the ID rename in `ID_Crosswalk`). The other **25 slots, all SME&C**, differ: 18 hold an older placement that has no workbook equivalent, and 7 hold a placement the workbook has moved to a different week. 16 workbook placements do not exist in the app at all; they hold 45 of the 49 missing activities.

| Role | Week | App placement - title | Workbook placement - title | Workbook topic |
|---|---|---|---|---|
| Commercial Executive (SME&C) | W4 | SMEC-CE-HEALTH - Spot Commercial Risk Across the Portfolio | PLC-SMEC-SMEC-CE-W04 - Resolve Policy and Licensing Before Commitment | WF-POLICY |
| Commercial Executive (SME&C) | W5 | SMEC-CE-POLICY - Resolve Policy and Licensing Before Commitment | PLC-SMEC-SMEC-CE-W05 - Set the Negotiation Strategy and Guardrails | WF-DEAL |
| Commercial Executive (SME&C) | W6 | SMEC-CE-NEG - Set the Negotiation Strategy and Guardrails | PLC-SMEC-SMEC-CE-W06 - Build and Run the Approval Case | WF-COMM |
| Commercial Executive (SME&C) | W8 | SMEC-CE-DEAL2 - Make the Commercial Case Reviewable | PLC-SMEC-SMEC-CE-W08 - Govern the Renewal Book and Commercial Risk | WF-RENEW |
| Digital Account Executive | W5 | DAE-DEAL - Advance a Deal Somebody Else May Close | PLC-SMEC-DAE-W05 - Advance the Partner-Led Deal and Forecast | WF-DEAL |
| Digital Account Executive | W8 | DAE-HEALTH - Read Portfolio Health Without Inspecting Every Account | PLC-SMEC-DAE-W08 - Run the Portfolio Health and Expansion Loop | WF-PIPE |
| Digital Cloud Solution Architect | W3 | DCSA-PARTNER - Run the Partner or Scale-Engine Delivery Handoff | PLC-SMEC-DCSA-W03 - Prioritize the Covered Consumption Portfolio | WF-CONSUME |
| Digital Cloud Solution Architect | W4 | DCSA-CONV - Make the One Conversation Count | PLC-SMEC-DCSA-W04 - Make the Committed Milestone Delivery-Ready | WF-CONSUME |
| Digital Cloud Solution Architect | W5 | DCSA-VALUE - Evidence Adoption and Value with Correct Attribution | PLC-SMEC-DCSA-W05 - Run the Partner or Scale-Engine Delivery Handoff | WF-HANDOFF |
| Digital Cloud Solution Architect | W6 | DCSA-ARCH - Design Something That Will Run Without You There | PLC-SMEC-DCSA-W06 - Remove the Highest-Cost Adoption or Technical Blocker | WF-CONSUME |
| Digital Cloud Solution Architect | W7 | DCSA-HEALTH - Find the Technical Problem Before It Reaches the Number | PLC-SMEC-DCSA-W07 - Evidence Adoption and Value with Correct Attribution | WF-VALUE |
| Digital Solution Engineer | W5 | DSE-CONV - Answer a Question You Were Not Asked Directly | PLC-SMEC-DSE-W05 - Close and Communicate the Technical Decision | WF-SOL |
| Digital Solution Area Specialist | W2 | DSS-SIGNAL - Judge Which Engagement Signals Are Real | PLC-SMEC-DSS-W02 - Detect and Prioritize Solution-Area Demand | WF-PLAN |
| Digital Solution Area Specialist | W3 | DSS-TERRITORY - Find Where Your Solution Area Actually Lands | PLC-SMEC-DSS-W03 - Create and Qualify Solution-Area Pipeline | WF-OPP |
| Digital Solution Area Specialist | W4 | DSS-CONV - Bring Solution Depth to a Conversation You Did Not Arrange | PLC-SMEC-DSS-W04 - Shape the Customer Strategy and Decision Criteria | WF-SOL |
| Digital Solution Area Specialist | W5 | DSS-DEAL - Move the Solution Decision, Not the Deal | PLC-SMEC-DSS-W05 - Prove and Convert the Customer Decision | WF-SOL |
| Digital Solution Area Specialist | W6 | DSS-VALUE - Prove the Solution Did What You Said It Would | PLC-SMEC-DSS-W06 - Route Co-Sell, Support, and Investment to Delivery | WF-CONSUME |
| Digital Solution Area Specialist | W7 | DSS-COMP - Build a Competitive Position the Customer Would Recognize | PLC-SMEC-DSS-W07 - Activate the Solution and Establish Evidence | WF-CONSUME |
| Digital Solution Area Specialist | W8 | DSS-ORCH - Make the Ask Specific Enough to Be Accepted | PLC-SMEC-DSS-W08 - Expand, Renew, and Close the Operating Loop | WF-RENEW |
| Partner Solution Sales | W3 | PSS-PARTNER - Keep Pinned-Partner Deals Moving Between Stages | PLC-SMEC-PSS-W03 - Qualify Partner-Originated Demand Before the Window Closes | WF-OPP |
| Partner Solution Sales | W4 | PSS-DEMAND - Qualify Partner-Originated Demand Before the Window Closes | PLC-SMEC-PSS-W04 - Reconcile Pinned-Partner Pipeline and Forecast | WF-PIPE |
| Partner Solution Sales | W5 | PSS-ORCH - Run a Rhythm Across More Partners Than You Can Meet | PLC-SMEC-PSS-W05 - Run Partner Deal Clinics to Remove Priority Blockers | WF-DEAL |
| Partner Solution Sales | W6 | PSS-VALUE - Find Out What Happened After the Partner Closed It | PLC-SMEC-PSS-W06 - Confirm Partner Readiness Before Routing Work | WF-HEALTH |
| Partner Solution Sales | W7 | PSS-CAPACITY - Confirm Partner Readiness Before Routing Work | PLC-SMEC-PSS-W07 - Transfer the Closed Partner Deal into Delivery | WF-HANDOFF |
| Partner Solution Sales | W8 | PSS-CONV - Have the Conversation in the Partner's Economics | PLC-SMEC-PSS-W08 - Run Partner Performance and Expansion Reviews | WF-PARTNER |

UI verified: the Commercial Executive (SME&C) path in the running app shows week 4 "Spot Commercial Risk Across the Portfolio", week 5 "Resolve Policy and Licensing Before Commitment", week 6 "Set the Negotiation Strategy and Guardrails" and week 8 "Make the Commercial Case Reviewable"; the workbook has "Resolve Policy and Licensing Before Commitment" in week 4, "Set the Negotiation Strategy and Guardrails" in week 5, "Build and Run the Approval Case" in week 6 and "Govern the Renewal Book and Commercial Risk" in week 8. The Digital Cloud Solution Architect path shows week 6 "Design Something That Will Run Without You There" where the workbook has "Remove the Highest-Cost Adoption or Technical Blocker".

### What needs to be decided / updated for Issue 2

1. **Decision:** confirm that the V16 SME&C journey in the workbook replaces the older SME&C weeks in the app (the lineage sheet says so). This is one decision that resolves the 49, the 86, Issue 3 and the 18+7 slot differences together.
2. If yes: add the 16 missing workbook placements (with their 45 activities), re-point the 25 slots, and re-order the 7 shifted weeks. Then decide what happens to the 21 older placements with no workbook counterpart (68 activities): hide from role paths but keep the data, or remove. Lineage records them as predecessors, not as deletions.
3. The 4 deferred activities (class C) are intentionally outside the base journey; keep or drop is a content-owner decision.

## Issue 3 - Six DSS activities associated with different placements

Of 425 activities whose placement ID differs between app and workbook, 419 are only the ID rename recorded in `ID_Crosswalk`. **Six are not**; all belong to the Digital Solution Specialist (role path `dss-smec`). For these six the workbook reuses the activity ID for a rewritten activity in a different week, so the difference is **both the association and the content**.

| Activity ID | App name | Workbook name | App placement (title) - week | Workbook placement (title) - week | Content differs? | Agent |
|---|---|---|---|---|---|---|
| DSS-SIGNAL-03 | Open the conversation without revealing how you found them | Open the conversation without exposing internal signals | DSS-SIGNAL (Judge Which Engagement Signals Are Real) - W2 | PLC-SMEC-DSS-W02 (Detect and Prioritize Solution-Area Demand) - W2 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |
| DSS-CONV-01 | Find out what the DAE has already promised | Recover commitments before shaping the conversation | DSS-CONV (Bring Solution Depth to a Conversation You Did Not Arrange) - W4 | PLC-SMEC-DSS-W04 (Shape the Customer Strategy and Decision Criteria) - W4 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |
| DSS-VALUE-01 | Find where your solution area can actually be evidenced | Separate committed, deployed, active, adopted, and evidenced | DSS-VALUE (Prove the Solution Did What You Said It Would) - W6 | PLC-SMEC-DSS-W07 (Activate the Solution and Establish Evidence) - W7 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |
| DSS-VALUE-02 | Build a proof point you can use with another customer | Build an approved proof point after serving the same account | DSS-VALUE (Prove the Solution Did What You Said It Would) - W6 | PLC-SMEC-DSS-W08 (Expand, Renew, and Close the Operating Loop) - W8 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |
| DSS-VALUE-03 | Work out whose evidence it actually is | Establish who owns the delivery and evidence | DSS-VALUE (Prove the Solution Did What You Said It Would) - W6 | PLC-SMEC-DSS-W07 (Activate the Solution and Establish Evidence) - W7 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |
| DSS-COMP-03 | Write the position against their criteria, not ours | Make customer criteria and deliberate concessions explicit | DSS-COMP (Build a Competitive Position the Customer Would Recognize) - W7 | PLC-SMEC-DSS-W04 (Shape the Customer Strategy and Decision Criteria) - W4 | Yes: name, description, prompt, expected output, human checkpoint, required context, why it matters, launch link | same agent ID in both |

Additional detail per activity (app value -> workbook value): `DSS-SIGNAL-03` launch Sales Home -> Microsoft 365 Copilot, tier Featured -> Extended; `DSS-CONV-01` launch link Sales M365 -> Microsoft 365 Copilot chat; `DSS-COMP-03` launch Cowork -> Agent J.ai; `DSS-VALUE-01` order 1 -> 2, tier Featured -> Extended; `DSS-VALUE-02` order 2 -> 4, tier Featured -> Extended; `DSS-VALUE-03` tier Extended -> Featured.

**Why it matters (plain English):** the placement decides which role and which week an exercise appears in. Today, `DSS-SIGNAL-03` appears in Digital Solution Specialist week 2 under "Judge Which Engagement Signals Are Real"; the workbook puts the (rewritten) exercise in week 2 under "Detect and Prioritize Solution-Area Demand". `DSS-VALUE-01/02/03` appear together in week 6 today, but the workbook splits them across week 7 (activation and evidence) and week 8 (expansion and renewal). `DSS-CONV-01` and `DSS-COMP-03` are both in week 4 in the workbook, whereas the app has them in week 4 and week 7. The role is the same (Digital Solution Specialist) in both files; the week and the surrounding topic are what differ.

**Exact mappings that would be needed (not applied):**

| Activity | Move from app placement | To workbook placement |
|---|---|---|
| DSS-SIGNAL-03 | DSS-SIGNAL | PLC-SMEC-DSS-W02 |
| DSS-CONV-01 | DSS-CONV | PLC-SMEC-DSS-W04 |
| DSS-COMP-03 | DSS-COMP | PLC-SMEC-DSS-W04 |
| DSS-VALUE-01 | DSS-VALUE | PLC-SMEC-DSS-W07 |
| DSS-VALUE-02 | DSS-VALUE | PLC-SMEC-DSS-W08 |
| DSS-VALUE-03 | DSS-VALUE | PLC-SMEC-DSS-W07 |

**Dependency:** `PLC-SMEC-DSS-W02`, `-W04`, `-W07` and `-W08` do not exist in the app yet, so these six cannot simply be re-pointed; the placements (and the other V16 activities in them, Issue 2) must be added first. The workbook lineage also states that the old placements `DSS-SIGNAL`, `DSS-CONV`, `DSS-VALUE` and `DSS-COMP` are predecessors of those new placements, which supports treating this as the same V16 replacement as Issue 2.

**Related finding (needs a quick confirmation):** five more activities keep the same ID **and** a crosswalk-equivalent placement but have different name/prompt text: `SMEC-CE-RENEW-01` app "Sort the book by where commercial options are still open" vs workbook "Rank renewal optionality and commercial risk"; `SMEC-CE-RENEW-03` app "Work out what changes when the partner holds the renewal" vs workbook "Separate CE, DAE, and partner decisions"; `SMEC-CE-RENEW-05` app "Check the renewals that arrived without you" vs workbook "Validate and correct the renewal record"; `PSS-PARTNER-01` app "See where your pinned-partner deals actually sit" vs workbook "Test whether partner stages are evidenced"; `PSS-PARTNER-02` app "Work out what is actually blocking the stalled one" vs workbook "Diagnose and assign the stalled dependency". They are not in your six, but they are the same kind of difference.
## Issue 4 - Nine legacy topics with no workbook topic equivalent

Important framing: none of the nine appears as an old or new topic ID in the workbook's topic crosswalk, but **8 of the 9 are still wired to workbook placements through the placement crosswalk**, and the workbook lists those placements under other topic IDs. So the topic ID has no match, while the placements and their role-facing titles do. This is evidence, not an assumption; the topic *wording* (name, why, takeaway, focus area) never matches.

### 4.1 Summary

| Topic ID | App topic name | App focus area | Placements (activities) | Where it is used | Evidence-based workbook relationship | Assessment |
|---|---|---|---|---|---|---|
| WF-INVEST-01 | Plan, Orchestrate and Realize Customer Investment | FA-07 | 14 placements (54 activities): AE-INVEST, ATS-INVEST, SE-INVEST, CE-INVEST, CSA-INVEST, CSAM-INVEST, SSP-INVEST, DSS/PSS/DAE/DSE/DCSA/SMEC-CE-INVEST, PLC-EPS-PMM-W04 | Additional content for 13 roles; weekly path of Partner Marketing Manager W4 | Same topic under a different ID. All 14 of its placements have workbook placements under topic WF-INVEST (13 Additional Content placements `...-ADD01` plus `PLC-EPS-PMM-W04`, which the workbook itself lists under WF-INVEST), with identical role topic names. Not in `ID_Crosswalk` as a topic row. | Renamed topic (ID only). Strong evidence. |
| WF-X-USECASE-01 | Identify and Test an AI-Assisted Workflow | FA-01 | ALL-USECASE (3) | Additional #1 (all roles) | Placement `ALL-USECASE` -> `PLC-ENT-ALL-ADD01` (crosswalk) under topic WF-IMPROVE "Map and Test an Improved Workflow", focus area FA-11; role topic name identical. | Renamed/re-homed topic. Strong placement evidence; topic wording differs. |
| WF-X-TRANSITION-01 | Transition an Account Without Losing the Customer | FA-01 | ALL-TRANSITION (5) | Additional #3 (all roles) | Placement `ALL-TRANSITION` -> `PLC-ENT-ALL-ADD03` under WF-HANDOFF (same role topic name). Not the workbook topic WF-TRANSITION (that is the Week-9 "Transition to Team-Owned Huddle Practice", which the app already has separately). | Renamed/re-homed topic. Evidence from placement; do not confuse with WF-TRANSITION. |
| WF-X-FYPLAN-01 | Set Up the Fiscal Year and Defend the Territory Plan | FA-01 | ALL-FYPLAN (4) | Additional #6 (all roles) | Placement `ALL-FYPLAN` -> `PLC-ENT-ALL-ADD06` under WF-FISCAL-PLAN "Build and Stress-Test a Fiscal Plan", focus area FA-09; role topic name identical. | Renamed/re-homed topic. Strong placement evidence. |
| WF-X-CLOSE-01 | Land the Fiscal Year and Protect What Books | FA-01 | ALL-CLOSE (4) | Additional #8 (all roles) | Placement `ALL-CLOSE` -> `PLC-ENT-ALL-ADD08` under WF-FISCAL-CLOSE "Close the Fiscal Year with Accurate Records", focus area FA-09; role topic name identical. | Renamed/re-homed topic. Strong placement evidence. |
| WF-X-PARTNER-01 | Hand Work to a Partner and Keep It Moving | FA-01 | DAE-PARTNER (4); PSS-PARTNER (4); DCSA-PARTNER (3) | Partner Solution Sales W3; Digital Cloud Solution Architect W3 | Mixed. `PSS-PARTNER` -> `PLC-SMEC-PSS-W04` (WF-PIPE, but in workbook week 4 not week 3); `DCSA-PARTNER` -> `PLC-SMEC-DCSA-W05` (WF-HANDOFF, workbook week 5 not week 3); `DAE-PARTNER` has no workbook placement (lineage: predecessor of `PLC-SMEC-DAE-W05`). The workbook has a different WF-PARTNER topic ("Plan and Grow Partner Business") that the app also has, with different content. | Legacy SME&C topic, split across several workbook topics. No single equivalent. |
| WF-X-VSAT-01 | Earn Customer Satisfaction on Every Delivery | FA-06 | CSA-VSAT (4) | Additional #2 (Cloud Solution Architect) | Placement `CSA-VSAT` -> `PLC-ENT-CSA-ADD02` under WF-HEALTH (same role topic name). | Re-homed under WF-HEALTH. Evidence from placement. |
| WF-X-TECHLEAD-01 | Build the Technical Credibility the Role Depends On | FA-05 | CSA-TECHLEAD (4) | Additional #3 (Cloud Solution Architect) | Placement `CSA-TECHLEAD` -> `PLC-ENT-CSA-ADD03` under WF-SOL (same role topic name). | Re-homed under WF-SOL. Evidence from placement. |
| WF-X-PROOF-01 | Design and Validate the Technical Solution | FA-05 | DSE-PROOF (3) | Digital Solution Engineer W4 | Placement `DSE-PROOF` -> `PLC-SMEC-DSE-W04` under WF-SOL (same role topic name and slot, DSE week 4). | Re-homed under WF-SOL. Evidence from placement. (App topic name equals WF-X-ARCH-01's name.) |

### 4.2 What each is used for (from code and runtime data)

- The runtime catalog is built only from `weeklyPaths` and `additionalPaths`; every placement listed above (except `DAE-PARTNER`) is reachable that way, so these huddles are visible and runnable today: WF-INVEST-01 and the CSA items as Additional Content, the four `ALL-*` items under "All roles" Additional Content, `DSE-PROOF` in Digital Solution Engineer week 4, `PSS-PARTNER` and `DCSA-PARTNER` in week 3 of their paths, and `PLC-EPS-PMM-W04` in Partner Marketing Manager week 4.
- `DAE-PARTNER` is on no role path. It is only reachable through the `rolePlacements` fallback (a topic-to-placement lookup used when a card for WF-X-PARTNER-01 is shown for a role). It is effectively orphaned content (4 activities).
- `defaultCatalog` still lists all 32 default topics for the voting list, and `defaultDetails` supplies the name for "incomplete session" entries, so a saved session for one of these keeps working only while the topic stays in the data.
- No source code in `src/` references any of the nine IDs; they are used only through data. No UI filter hard-codes them.
- Focus-area consequence: the app defines 10 focus areas (FA-00 to FA-08, FA-10). The workbook's FA-09 "Leadership Business Management and Execution" and FA-11 "Workflow Improvement and AI Practice" do not exist in the app, which is where WF-FISCAL-PLAN / WF-FISCAL-CLOSE (FA-09) and WF-IMPROVE (FA-11) would belong. The legacy topics keep FA-01 meanwhile.

### 4.3 Consequences

| Choice | What happens |
|---|---|
| Keep as-is | No user-visible change; the Additional Content and the three role-path weeks keep working. The topic-level wording stays different from the workbook, and the four workbook topics WF-INVEST, WF-FISCAL-PLAN, WF-FISCAL-CLOSE and WF-IMPROVE have no matching topic record in the app. |
| Re-key / re-label to the workbook topic (data change, placements kept) | Keeps all content and saved plans (sessions key on topic+placement ID, so any topic-ID change must keep the placement ID stable or existing saved progress for it is lost). Brings name/why/takeaway/focus area in line. Needs a decision per topic for the merged ones (USECASE, TRANSITION, FYPLAN, CLOSE, VSAT, TECHLEAD, PROOF), because the workbook files them under a shared family topic. |
| Remove | Deletes huddles users can open today (INVEST alone appears for 13 roles), and breaks saved sessions or plans that reference them. Not supported by the evidence: the workbook still contains the placements. Only `DAE-PARTNER` (on no path; lineage says superseded by `PLC-SMEC-DAE-W05`) has any case for removal, and that belongs to the SME&C decision in Issue 2. |
## Issue 5 - Commercial Executive week 2 (`CE-W02`) has no topic-level agent list in the workbook

### 5.1 IDs
- Role path: Commercial Executive (SME&C), `ce-smec`, week 2. Card title in the app: "Triage Commercial Engagement Early".
- Placement: `PLC-SMEC-SMEC-CE-W02` (old ID `SMEC-CE-V16-ENGAGE`). Topic: `WF-COMM` "Route Commercial Engagement Through Approval" (focus area FA-04; old ID `WF-X-COMMERCIAL-GATE-01`, which the app does not use).
- Activities: `SMEC-CE-V16-ENGAGE-01` (Featured), `-02` (Featured), `-03` (Extended). MCEM: PRE-MCEM, MCEM-01 Listen and Consult, MCEM-02 Inspire and Design.

### 5.2 Agents and tools assigned today, by level

| Level | Workbook | App |
|---|---|---|
| Topic (`Topic_Agents`, WF-COMM) | **No rows.** WF-COMM is one of 6 of the 23 workbook topics with no topic-level list (also WF-ORIENT, WF-TRANSITION, WF-FISCAL-PLAN, WF-FISCAL-CLOSE, WF-IMPROVE) | `defaultDetails` WF-COMM: primary Cowork + Microsoft 365 Copilot; secondary none |
| Activity (`Activity_Agents`) | `-01` Cowork (primary); `-02` Microsoft 365 Copilot (primary); `-03` Microsoft 365 Copilot (primary) | Identical: `-01` Cowork; `-02` and `-03` Microsoft 365 Copilot; launch links match |
| Placement | No structured agent list. `Placement_Summaries` has free text only: use the opportunity, agreement record and approved guidance; a structured brief as fallback; "Cowork or Deal Agent may assemble supplied context where available"; no roadmap dependency; the CE validates every fact | `placementDetails` and `placementCatalog`: primary Cowork + Microsoft 365 Copilot; secondary none |

### 5.3 What the workbook specifies and leaves unspecified
- Specified: the three activity-level tool assignments (agent, label, link, order), the placement text summary, MCEM stages.
- Not specified: any topic-level primary/secondary list for WF-COMM, and therefore any secondary tools. "Deal Agent" appears only as optional wording in the placement summary, not as a mapping, so it was not added.

### 5.4 How the app derives the tools on the card
Cards and the detail panel show the placement's `primaryAgents` and `secondaryAgents` (`huddleMappers.ts`; the detail panel merges both lists). For topics the workbook gives a `Topic_Agents` list, the placements carry that list (primary and secondary). For WF-COMM there is no list, so the placement keeps the tools derived from its own activities: the distinct primary agents of its activities (Cowork, Microsoft 365 Copilot) and no secondaries. Nothing was invented and nothing was removed.

### 5.5 What users see (UI verified in the running app)
Commercial Executive (SME&C), week 2 card: **Primary AI tool: Cowork, Microsoft 365 Copilot. Secondary AI tools: None.** For comparison, the weeks backed by a `Topic_Agents` list show a fuller picture: week 3 (primary Sales Agent, Sales Home, Deal Agent; six secondary tools), week 6 (same), week 7 (primary Cowork; seven secondary tools). Orientation (W1) and Transition (W9) also show "None" because the workbook has neither activities nor a topic list for them.

### 5.6 Genuine mismatch or not?
**Not a data mismatch.** What the app shows equals the workbook's activity-level mapping, and the workbook defines nothing at topic level. It is a field the workbook does not define, which produces a visibly different card (two primary tools, no secondary) from its neighbours. The open question is only a content decision: should WF-COMM get a `Topic_Agents` list (primary and secondary) like the other topics? Until the workbook owner says so, the correct treatment is to leave the current values as they are; an unspecified list is not an instruction to remove data. The same applies to the 5 other workbook topics without a list, and to the workbook's second WF-COMM placement (Commercial Executive week 6, not yet in the app).
## Final summary

### The five issues in simple English

1. **Thirteen topics, older shared text.** The role-specific wording (titles, objectives, WIIFM, role outcomes) is already updated everywhere it can be compared. What is still old is the generic topic sentence: the topic name, "why it matters" and "key takeaway", plus the topic-level default outcome, and the focus area for two topics. Because each placement keeps its own copy of that sentence, users still read the old "Why it matters" and "Key takeaway" on the huddle screens.
2. **135 activity differences, one cause.** The workbook rebuilt the SME&C role paths. 49 new activities are missing from the app and 86 older ones are still in the app. None of them is the same activity under another name. The workbook's own lineage sheet links every one to its predecessor or successor.
3. **Six DSS activities.** The workbook reuses their IDs for rewritten activities in different weeks. The role is the same (Digital Solution Specialist), but the week, the surrounding topic and the content all differ.
4. **Nine legacy topics.** Their topic IDs do not exist in the workbook, but 8 of the 9 are still tied to workbook placements that are filed under other topic IDs. They are live, visible content in the app today (all except one placement, `DAE-PARTNER`).
5. **CE week 2 tools.** Not an error. The workbook assigns tools to the three activities and gives no topic-level list, so the card shows the activity tools (Cowork, Microsoft 365 Copilot) and no secondary tools.

### Records affected

| Issue | Records |
|---|---|
| 1 | 13 topics; 356 records (13 topic details + 13 topic catalog + 165 placement details + 165 placement catalog); 8 placements also have a focus-area difference |
| 2 | 49 workbook-only + 86 app-only activities; 25 SME&C role-path slots differ; 16 workbook placements absent from the app; 21 older app placements with no workbook counterpart |
| 3 | 6 activities (5 further same-ID activities with different text noted) |
| 4 | 9 topics, 24 placements, 92 activities |
| 5 | 1 placement, 3 activities; 0 data differences |

### Confirmed mismatches vs needs further investigation

| Status | Items |
|---|---|
| **Confirmed mismatch** | Issue 1 (topic name, why, takeaway, outcome; 2 focus areas); Issue 2 (49 and 86, one V16 cause); Issue 3 (6 activities, placement and content); the 25 SME&C slot differences |
| **Needs a decision before it can be called a mismatch** | The 5 merged topics in Issue 1 (workbook text makes ARCH/DISC, PLAN/TERRITORY, PIPE/SIGNAL, CONV/SPONSOR identical); the 15 "folded in" and 4 "deferred" activities in 2B; all of Issue 4 (ID/wording gap, not a content gap); the 5 extra same-ID activities in Issue 3 |
| **Not a mismatch** | Issue 5 (field the workbook does not define) |
| **Not verified in the UI** | The Issue 1 "Why it matters" example (checked by code and data only). Verified in the UI: the CE week 2 card, the CE and DCSA role-path titles, and tool lists. |

### Decisions and updates needed next, in recommended order

1. **Confirm that the workbook's V16 SME&C journey replaces the older SME&C weeks** (resolves Issues 2 and 3 and the 25 slot differences together; the lineage sheet says it does).
2. If yes, **add the 16 missing placements and their activities**, then re-point the six DSS activities and the 25 slots; then decide what to do with the 21 older placements (68 activities) that have no counterpart: hide from paths while keeping the data, or remove.
3. **Decide the 5 merged topics** (Issue 1): accept identical workbook text for merged topics, or keep topic-specific wording.
4. **Update the 13 topics' shared text** (name, why, takeaway, outcome, focus area for HANDOFF/SPONSOR) in topic and placement records.
5. **Decide the nine legacy topics**: keep as-is, or re-label to the workbook topic while keeping placement IDs stable (saved progress is keyed to them). Do not remove. If re-labelled, add the workbook focus areas FA-09 and FA-11, which the app does not define.
6. **Ask the workbook owner whether WF-COMM needs a topic-level agent list** (also WF-ORIENT, WF-TRANSITION, WF-FISCAL-PLAN, WF-FISCAL-CLOSE, WF-IMPROVE). Until answered, leave CE week 2 as it is.
