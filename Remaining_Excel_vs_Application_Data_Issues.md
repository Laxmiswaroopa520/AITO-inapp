# Remaining Excel vs. Application Data Issues

**Date of review:** 15 October 2026  
**Type of work:** Investigation and reporting only. No application file, data file, SQL script, database record or workbook was changed.

## Sources and method

| Item | What was used |
|---|---|
| Workbook named in the request | Frontier_Accelerator_Huddle_App_Content_Integration_Model_9.16.2026_CORRECTED.xlsx |
| Workbook also checked | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx (the 9.16 workbook cannot be used alone: see DATA-001) |
| Application data checked | static-api-data.json (Workflow data under "reference", Huddle data under "huddle") and commonRolePathWeeks.json. These are the only data files the application loads when it runs. |
| SQL seed scripts | Data_Scripts folder (compared at the id level only; see Section F) |
| How Excel rows are shown | The row number is the worksheet row. Row 1 is the header, so the first data row is row 2. |
| Status labels | Resolved; Still unresolved; Partially resolved; Requires confirmation. "Requires confirmation" means the difference is real, but the workbook cannot tell us the right answer. Anything that could not be checked is labelled "unconfirmed". |


The request calls the 9.16 workbook the latest approved workbook. It is older than the 10.13 workbook and covers only two segments (Enterprise and SME&C). Most items in the request need content that exists only in the 10.13 workbook. So each issue below says which workbook it was checked against. Which workbook is approved is itself an open question (DATA-001).

## A. Summary

| Measure | Count |
|---|---|
| Outstanding issues investigated (DATA-001 to DATA-019) | 19 |
| Items checked and found resolved (not counted as outstanding; Section B2) | 10 |
| Total items investigated | 29 |
| Outstanding: still unresolved | 9 |
| Outstanding: partially resolved | 1 |
| Outstanding: requires confirmation | 9 |
| Outstanding issues that need a manager or content-owner decision (Approval = Yes) | 15 |
| Outstanding issues where only part needs a decision (DATA-013) | 1 |
| Outstanding issues that need no separate approval (DATA-006, DATA-017, DATA-019) | 3 |
| Technical fixes that can be prepared independently once DATA-001 is confirmed | DATA-017 and the topic-link part of DATA-013. DATA-006 and DATA-019 are technical but must wait for the decisions they follow. |
| Priority: High / Medium / Low | 4 / 13 / 2 |


Only counts that were checked against the files are given. The decision counts follow the Approval column in Section B.

### Most important remaining issues

1. **DATA-001** - the named 9.16 workbook cannot be the only source. It does not contain three of the five segments, Week 9, or the Enterprise Sales Manager path.
2. **DATA-002 to DATA-005** - 30 of 54 SME&C weekly slots differ from the 10.13 workbook; 5 Excel placements are missing; 13 mappings are unclear; DSE-HEALTH has no match. All need a content decision.
3. **DATA-016** - agent mapping differs in 112 of 993 shared activities, and the workbook does not say which sheet wins.
4. **DATA-012** - 19 workbook resources are not linked anywhere, so they cannot appear.
5. **DATA-008** - Sales Manager is gone from the Huddle role list, but it still exists in Workflow and as unused Huddle data.

### How the 10 requested rechecks map to the issues

| # | Requested recheck | Result | Issue |
|---|---|---|---|
| 1 | SME&C ordering for DSS, DSE, DCSA, PSS and CE (DAE also differs) | Still unresolved against 10.13: DSS 7, DCSA 6, PSS 6, CE 6, DSE 2 and DAE 3 weeks differ. No difference against 9.16. | DATA-002 |
| 2 | The 5 placements (DAE-W06, CE-W02, CE-W07, DSE-W06, DCSA-W02) | Still unresolved: none of the five is in the application. | DATA-003 |
| 3 | The 13 uncertain placement mappings | Requires confirmation. Count re-derived: 13. | DATA-004 (and DATA-005 for DSE-HEALTH) |
| 4 | sm-mgr versus mgr-ent | Partially resolved: sm-mgr is no longer in the Huddle role list. It remains in Workflow and as unused Huddle data. | DATA-008 |
| 5 | The 19 unlinked resources | Still unresolved: still 19, none in the application. | DATA-012 |
| 6 | Topic description and agent mapping differences | Still unresolved: 13 topics differ in text; 112 activities and 20 topics differ in agents. | DATA-015, DATA-016 (also DATA-017, DATA-019) |
| 7 | Should ROLE-ALL have a weekly path? | Resolved: the workbook defines none. Selection and placement of ALL content need confirmation. | R-07; DATA-010 |
| 8 | Source and correctness of the Enterprise Sales Manager nine-week path | The content matches the workbook (resolved). Its source is marked as not yet validated by the role owner. | R-08; DATA-009 |
| 9 | Commercial Executive (SME&C) and SR-SMEC-ALL | Both need confirmation (a name difference; a role record without content). | DATA-011, DATA-018 |
| 10 | Any other outstanding issues | Found: source workbook conflict, activity differences, older mappings, resource and agent link differences, MCEM stages, internal consistency. | DATA-001, 006, 007, 013, 014, 017, 019 |


## B. Detailed issue table

### B1. Index

| Issue ID | Category | Role / segment | Priority | Status | Approval required |
|---|---|---|---|---|---|
| DATA-001 | Source workbook | All roles and segments | High | Requires confirmation | Yes |
| DATA-002 | Weekly learning path order | SME&C: Digital Account Executive, Commercial Executive (SME&C), Digital Solution Area Specialist, Digital Solution Engineer, Digital Cloud Solution Architect, Partner Solution Sales | High | Still unresolved (against 10.13); no difference against 9.16 | Yes |
| DATA-003 | Missing placements | SME&C: DAE week 6, CE week 2, CE week 7, DSE week 6, DCSA week 2 | High | Still unresolved | Yes |
| DATA-004 | Placement mapping | SME&C: DAE, CE (SME&C), DSS, DCSA | High | Requires confirmation | Yes |
| DATA-005 | Extra application placement | SME&C: Digital Solution Engineer, week 6 | Medium | Requires confirmation | Yes |
| DATA-006 | Topic-to-placement mapping | 15 roles (all 7 Enterprise roles, 6 SME&C roles, ROLE-ALL and the unused sm-mgr entry) | Medium | Still unresolved | No |
| DATA-007 | Activities | SME&C placements (all differences are in SME&C placements) | Medium | Still unresolved | Yes |
| DATA-008 | Role | Sales Manager (sm-mgr) and Enterprise Sales Manager (mgr-ent) | Medium | Partially resolved | Yes |
| DATA-009 | Source of path | Enterprise Sales Manager (mgr-ent) | Medium | Requires confirmation | Yes |
| DATA-010 | Role | All Roles (ROLE-ALL) | Medium | Requires confirmation | Yes |
| DATA-011 | Role name | Commercial Executive (SME&C) (ce-smec) | Low | Requires confirmation | Yes |
| DATA-012 | Resources | All roles | Medium | Still unresolved | Yes |
| DATA-013 | Resource links | All roles (topics and activities) | Medium | Still unresolved | Partly |
| DATA-014 | Resources | Agents Researcher (AGT-006), Customer Success persona (AGT-011), Sales Agent (AGT-001), Deal Agent (AGT-016) | Medium | Requires confirmation | Yes |
| DATA-015 | Topic content | All roles | Medium | Still unresolved | Yes |
| DATA-016 | AI agent mapping | All roles | Medium | Still unresolved | Yes |
| DATA-017 | MCEM stages | All roles | Medium | Still unresolved | No |
| DATA-018 | Role | All Roles under SME&C (SR-SMEC-ALL) | Low | Requires confirmation | Yes |
| DATA-019 | Internal consistency | All roles | Medium | Requires confirmation | No |


### B1. Details

#### DATA-001 - Source workbook

| Field | Detail |
|---|---|
| Issue ID | DATA-001 |
| Category | Source workbook |
| Role / segment | All roles and segments |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_9.16.2026_CORRECTED.xlsx: Segments rows 2-3; Segment_Roles rows 2-16; Role_Paths rows 2-105 (104 rows, weeks 1-8). Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Segments rows 2-6; Segment_Roles rows 2-31; Role_Paths rows 2-253 (252 rows, weeks 1-9). |
| Excel value | The named workbook (9.16.2026 CORRECTED) has 2 segments, 15 segment roles, 104 weekly placements and 506 activities. The workbook dated 10.13.2026 (v2) has 5 segments, 30 segment roles, 252 weekly placements and 1,058 activities. |
| Current application value | The application has 5 segments, 29 roles, 252 weekly slots (28 roles x 9 weeks) and 1,079 activities. All 104 weekly slots in the 9.16 workbook match the application exactly. 56 of the application's 57 resources are in the 10.13 workbook. 15 of the 57 are not in the 9.16 workbook. |
| Difference | The 9.16 workbook cannot be the only source of truth for the application. It does not contain the EPS (Partner), Leader or USPSI segments, the Enterprise Sales Manager path, Week 9, the five placements in DATA-003, or the lineage rows in DATA-004. Every issue below was therefore checked against the 10.13 workbook, and against the 9.16 workbook where the item exists there. |
| Recommended next step | Confirm in writing which workbook is the approved source for each segment. Until then, treat the 10.13 workbook as the reference for the five-segment roles and the 9.16 workbook as the reference for Enterprise and SME&C weeks 1-8. |
| Approval required | Yes - only the content owner can say which workbook is approved. |
| Priority | High |
| Status | Requires confirmation |


#### DATA-002 - Weekly learning path order

| Field | Detail |
|---|---|
| Issue ID | DATA-002 |
| Category | Weekly learning path order |
| Role / segment | SME&C: Digital Account Executive, Commercial Executive (SME&C), Digital Solution Area Specialist, Digital Solution Engineer, Digital Cloud Solution Architect, Partner Solution Sales |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx, Role_Paths: DAE rows 74-82; CE rows 83-91; DSS rows 92-100; DSE rows 101-109; DCSA rows 110-118; PSS rows 119-127. Evidence: ID_Crosswalk and Content_Lineage (see Appendix A). |
| Excel value | Each SME&C role has 9 weekly placements with new PLC-SMEC-... ids. Weeks 1 and 9 match the application. In the other weeks the topic, order or placement differs. |
| Current application value | Each SME&C role has 9 weekly slots. Weeks 1-8 use the older placement ids (for example DSS-SIGNAL). Week 9 uses the new ids. |
| Difference | 30 of the 54 SME&C weekly slots differ from the 10.13 workbook: CE 6, DSS 7, DCSA 6, PSS 6, DAE 3, DSE 2. Against the 9.16 workbook there is no difference: all 48 SME&C weeks 1-8 match it. |
| Recommended next step | Decide whether the application follows the 10.13 order for all six SME&C roles, for some roles, or stays on the 9.16 order. Do not change any week until the decision is made. Week-by-week evidence is in Appendix A. |
| Approval required | Yes - the workbook does not say whether the new order replaces the current order. |
| Priority | High |
| Status | Still unresolved (against 10.13); no difference against 9.16 |


#### DATA-003 - Missing placements

| Field | Detail |
|---|---|
| Issue ID | DATA-003 |
| Category | Missing placements |
| Role / segment | SME&C: DAE week 6, CE week 2, CE week 7, DSE week 6, DCSA week 2 |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx, Digital Account Executive week 6 PLC-SMEC-DAE-W06 (Role_Paths row 79; topic WF-CONSUME; Activities rows 850-852, 889; Placement_Summaries row 12; Preparation/Explore_Practice/Commit row 233; ID_Crosswalk row 132); Commercial Executive (SME&C) week 2 PLC-SMEC-SMEC-CE-W02 (Role_Paths row 84; topic WF-COMM; Activities rows 856-858; Placement_Summaries row 15; Preparation/Explore_Practice/Commit row 235; ID_Crosswalk row 137); Commercial Executive (SME&C) week 7 PLC-SMEC-SMEC-CE-W07 (Role_Paths row 89; topic WF-HANDOFF; Activities rows 862-864; Placement_Summaries row 20; Preparation/Explore_Practice/Commit row 237; ID_Crosswalk row 142); Digital Solution Engineer week 6 PLC-SMEC-DSE-W06 (Role_Paths row 106; topic WF-HANDOFF; Activities rows 868-870; Placement_Summaries row 33; Preparation/Explore_Practice/Commit row 239; ID_Crosswalk row 159); Digital Cloud Solution Architect week 2 PLC-SMEC-DCSA-W02 (Role_Paths row 111; topic WF-CONSUME; Activities rows 871-873; Placement_Summaries row 36; Preparation/Explore_Practice/Commit row 240; ID_Crosswalk row 164) |
| Excel value | Five placements that have no earlier placement in Content_Lineage. ID_Crosswalk gives each an older id (DAE-V16-ROUTE, SMEC-CE-V16-ENGAGE and similar) that is not in the application. |
| Current application value | None of the five placement ids exists in the application. In each of these weeks the application shows a different, older placement: Digital Account Executive week 6: DAE-PARTNER (Hand Over Well and Stay on the Clock); Commercial Executive (SME&C) week 2: SMEC-CE-RENEW (Run the Renewal Workback Across a Book, Not an Account); Commercial Executive (SME&C) week 7: SMEC-CE-ORCH (Get the Approvals Moving When You Do Not Own the Deal); Digital Solution Engineer week 6: DSE-HEALTH (Find the Problem Before the Customer Does); Digital Cloud Solution Architect week 2: DCSA-CONSUME (Prioritize the Covered Consumption Portfolio). |
| Difference | Five Excel placements are missing from the application. CE week 2 also uses topic WF-COMM, which has no counterpart topic in the application (see DATA-015). None of the five exists in the 9.16 workbook. |
| Recommended next step | For each of the five, decide: add, replace the placement now shown in that week, or leave out. Do not add them until DATA-002 is decided, because they change the weeks around them. |
| Approval required | Yes - the workbook does not say whether they replace or sit beside the current placements. |
| Priority | High |
| Status | Still unresolved |


#### DATA-004 - Placement mapping

| Field | Detail |
|---|---|
| Issue ID | DATA-004 |
| Category | Placement mapping |
| Role / segment | SME&C: DAE, CE (SME&C), DSS, DCSA |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Content_Lineage rows 4-9, 45-46, 51, 54-55, 64, 67; ID_Crosswalk row 143; Role_Paths rows 78, 88, 90, 95, 96, 98, 99, 115 (see Appendix B). |
| Excel value | Content_Lineage and ID_Crosswalk link older placements to new ones. Six Excel placements are merges of two older placements each (DSS-W04, DSS-W05, DAE-W05, CE-W06, CE-W08, DCSA-W06). DSS-VALUE feeds two Excel placements (DSS-W07 and DSS-W08, a split). |
| Current application value | The application keeps each older placement as its own record in its own week. No merge or split has been applied. |
| Difference | The workbook does not say which older content to keep in a merge, or how the content is divided in the split. The 13 items are: 10 older placements that feed a merge, DSS-COMP (counted once, although it feeds both DSS-W04 and DSS-W05), and DSS-VALUE counted twice because it feeds two Excel placements. |
| Recommended next step | For each of the 13 rows, confirm whether the Excel placement is the right replacement and which older content is kept. No match has been forced. |
| Approval required | Yes - content decision. |
| Priority | High |
| Status | Requires confirmation |


#### DATA-005 - Extra application placement

| Field | Detail |
|---|---|
| Issue ID | DATA-005 |
| Category | Extra application placement |
| Role / segment | SME&C: Digital Solution Engineer, week 6 |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: no ID_Crosswalk row and no Content_Lineage row names DSE-HEALTH. Role_Paths row 106 (PLC-SMEC-DSE-W06, DSE week 6) is a different placement. |
| Excel value | No entry for DSE-HEALTH ('Find the Problem Before the Customer Does'). The workbook does not say whether it is retired. |
| Current application value | DSE-HEALTH is in the DSE weekly path at week 6. Of the 21 older SME&C placement ids in the application, it is the only one the workbook never mentions. |
| Difference | The application has a placement that the workbook neither keeps nor retires. |
| Recommended next step | Confirm whether DSE-HEALTH is retired, kept, or moved to Additional Content. |
| Approval required | Yes - content decision. |
| Priority | Medium |
| Status | Requires confirmation |


#### DATA-006 - Topic-to-placement mapping

| Field | Detail |
|---|---|
| Issue ID | DATA-006 |
| Category | Topic-to-placement mapping |
| Role / segment | 15 roles (all 7 Enterprise roles, 6 SME&C roles, ROLE-ALL and the unused sm-mgr entry) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Role_Paths and Additional_Content use only the PLC-... ids. The 21 older ids below are not used as placement ids anywhere in these sheets (see Appendix G). |
| Excel value | Role-to-topic placements use the new PLC-... ids. |
| Current application value | The application's role-to-topic placement table has 547 entries. 31 of them point to one of the 21 older SME&C placement ids. They are in 15 roles, so some Enterprise roles also point at an older SME&C placement. For example ae-ent, ce-ent and ROLE-ALL all map topic WF-X-PARTNER-01 to DAE-PARTNER, a Digital Account Executive placement. Whether that is intended is unconfirmed. |
| Difference | 31 of 547 mappings (5.7%) point to ids the 10.13 workbook does not use. |
| Recommended next step | After DATA-002 to DATA-005 are decided, update these 31 mappings in the same change. This is mechanical and should not be done earlier. |
| Approval required | No - it follows the DATA-002 decision. No separate approval is needed. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-007 - Activities

| Field | Detail |
|---|---|
| Issue ID | DATA-007 |
| Category | Activities |
| Role / segment | SME&C placements (all differences are in SME&C placements) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx, Activities: 1,058 rows. 65 activity ids exist only in the workbook (see Appendix H). |
| Excel value | 1,058 activities. 993 are also in the application. |
| Current application value | 1,079 activities. 993 are also in the workbook; 86 exist only in the application (68 of them in the 21 older placements, 18 in placements that exist in both). |
| Difference | Of the 993 shared activities, 11 have different text (name, prompt, practice tier or expected output) and 10 have a different order. 65 Excel-only activities sit in 25 SME&C placements. |
| Recommended next step | Decide after DATA-002 to DATA-004. Do not delete any application activity; confirm first whether each one is retired. |
| Approval required | Yes - which activities to keep is a content decision. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-008 - Role

| Field | Detail |
|---|---|
| Issue ID | DATA-008 |
| Category | Role |
| Role / segment | Sales Manager (sm-mgr) and Enterprise Sales Manager (mgr-ent) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Roles row 21 (ROLE-MGR); Segment_Roles row 23 (SR-ENT-MGR); Segments rows 2-6 (no 'Manager' segment); Role_Paths rows 65-73. The 9.16 workbook has no manager role. |
| Excel value | One manager role: Enterprise Sales Manager (first-line learner) in the Enterprise segment, with a 9-week path. No Sales Manager role and no Manager segment. |
| Current application value | Huddle role list (29 roles): contains mgr-ent with its 9-week path and does not contain sm-mgr or a Manager segment. Workflow role list (8 roles): still contains Sales Manager (sm-mgr, segment Manager, 20 Workflow activities). Unused Huddle data for sm-mgr is still in the data file: 28 role-to-topic mappings, 0 weekly path items, 0 additional items. |
| Difference | The earlier problem (Huddle showing 'No Role Path for Sales Manager') can no longer come from the role list, because sm-mgr is not in the Huddle list. Two things remain: the 28 unused sm-mgr entries, and whether the Workflow module should keep a Sales Manager role that the workbook does not describe (the workbook covers Huddle only). |
| Recommended next step | Confirm (1) that the unused Huddle sm-mgr entries may stay as they are or be removed later, and (2) whether Workflow keeps Sales Manager. Check in the screen that the Huddle role list has no Manager segment (not yet done). |
| Approval required | Yes - the workbook says nothing about the Workflow module. |
| Priority | Medium |
| Status | Partially resolved |


#### DATA-009 - Source of path

| Field | Detail |
|---|---|
| Issue ID | DATA-009 |
| Category | Source of path |
| Role / segment | Enterprise Sales Manager (mgr-ent) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Role_Paths rows 65-73; Evidence_Sources row 13 (EvidenceSourceID SRC-ENT-MGR-FY27, AuthorityLevel PROPOSAL_PENDING_ROLE_OWNER_VALIDATION, ReviewedOn 2026-09-28, ReviewBy 2026-10-28); Content_Change_Log row 5452. |
| Excel value | The nine-week path exists. Its evidence record is marked as a proposal that the role owner has not yet validated. Note: ATU/STU/CSU manager responsibilities differ; CAIP CSU guidance is not universal. |
| Current application value | The application's nine placements (PLC-ENT-MGR-W01 to W09) have the same title, description, Today's Objective and WIIFM text as Role_Paths rows 65-73 for all nine weeks. |
| Difference | The data is correct against the workbook. Whether the workbook content is itself approved is not confirmed. The evidence file it names (Work Brain/Sources/2026-09-25-enterprise-sales-manager-evidence.md) was not available for this review. |
| Recommended next step | Ask the role owner to confirm the nine weeks before release. The workbook's next review date is 2026-10-28. |
| Approval required | Yes - role-owner validation. |
| Priority | Medium |
| Status | Requires confirmation |


#### DATA-010 - Role

| Field | Detail |
|---|---|
| Issue ID | DATA-010 |
| Category | Role |
| Role / segment | All Roles (ROLE-ALL) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Roles row 9; Segment_Roles rows 9 (SR-ENT-ALL) and 16 (SR-SMEC-ALL); Additional_Content rows 21-29 (9 ALL placements); Role_Paths has no ALL rows; Change Summary row 49 and row 56. |
| Excel value | Change Summary row 49: 'Render an ALL placement in every role's additional content. Do not show All Roles as a selectable role in the role picker.' Row 56: expand SR-ENT-ALL placements only when the segment is Enterprise. |
| Current application value | ROLE-ALL 'All Roles' is in the Huddle role list (segment Enterprise). The role picker code hides it when one role is chosen, and offers it as a separate 'All Roles' entry only in the All Topics multi-role filter (read from the code; no screen was run). It has no weekly path. The 9 ALL placements are stored only under ROLE-ALL's additional path; the other roles' additional paths contain none of them. The ALL placement records do list the Enterprise roles (for example all 7 Enterprise roles on the first one), so role-filtered views may still show them. |
| Difference | Weekly path: no difference (the workbook defines none). Selectable role: the workbook says All Roles should not be a selectable role. The application hides it in single-role pickers but still offers it in the All Topics filter. ALL placements: the workbook says every role's additional content should show them; the application stores them under ROLE-ALL only. Whether a screen already shows them for each Enterprise role was not checked. |
| Recommended next step | Confirm whether All Roles should stay in the All Topics filter. Then open one Enterprise role in the screen to see whether the 9 ALL placements appear in its Additional Content. |
| Approval required | Yes - behaviour decision. |
| Priority | Medium |
| Status | Requires confirmation |


#### DATA-011 - Role name

| Field | Detail |
|---|---|
| Issue ID | DATA-011 |
| Category | Role name |
| Role / segment | Commercial Executive (SME&C) (ce-smec) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Roles row 15 (ROLE-SMEC-CE, RoleName 'Commercial Executive (SME&C)'); Segment_Roles row 11 (SR-SMEC-CE, RoleDisplayName 'Commercial Executive'); Change Summary row 58. |
| Excel value | The role record is named 'Commercial Executive (SME&C)'. The name shown for the learner (RoleDisplayName) is 'Commercial Executive' in both Enterprise and SME&C. Change Summary row 58 says the display name stays 'Commercial Executive' in both segments. |
| Current application value | The Huddle role list shows 'Commercial Executive (SME&C)' for ce-smec. All other 28 roles use the workbook's RoleDisplayName exactly. |
| Difference | One role name differs from RoleDisplayName. |
| Recommended next step | Confirm which name the screen should show for this role. |
| Approval required | Yes - naming decision. |
| Priority | Low |
| Status | Requires confirmation |


#### DATA-012 - Resources

| Field | Detail |
|---|---|
| Issue ID | DATA-012 |
| Category | Resources |
| Role / segment | All roles |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx, Resources rows 18, 24-27, 43-44, 46, 52, 62-71 (Appendix D). Link sheets checked: Topic_Resources rows 2-41; Activity_Resources rows 2-156; Agent_Resources rows 2-37. |
| Excel value | 75 resources. 56 are linked to a topic, activity or agent. 19 are not linked anywhere (5 marked Global). In the 9.16 workbook 11 of its 53 resources are unlinked; 9 of the 19 are the same resources, and the 10 RES-MGR resources do not exist there. |
| Current application value | None of the 19 is in the application. |
| Difference | 19 Excel resources cannot appear in the application because the workbook does not link them. Ten (RES-MGR-01 to RES-MGR-10) look like manager learning material. |
| Recommended next step | For each of the 19, decide where it belongs (topic, activity, agent or global) or that it stays out. |
| Approval required | Yes - the workbook gives no place for them. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-013 - Resource links

| Field | Detail |
|---|---|
| Issue ID | DATA-013 |
| Category | Resource links |
| Role / segment | All roles (topics and activities) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Topic_Resources rows 6-8, 12-15, 17-18, 24, 28-31, 36-38, 41 (the 18 missing links, see Appendix I); Activity_Resources rows 2 and 74 (the only rows for the 7 activities that differ). |
| Excel value | Topic_Resources links resources to topics. Activity_Resources links resources to activities. |
| Current application value | The application is missing 18 topic-resource links that the workbook lists: RES-EPS-SOURCE-01 on 9 topics, RES-001 on 5, RES-003 on 3, RES-MS-FRONTIER-PLAYBOOK-01 on 1. It has no topic-resource link that the workbook lacks. For activities, 7 application activities show one extra resource that Activity_Resources does not link; none is missing. |
| Difference | 18 topic-resource links missing and 7 extra activity-resource links. |
| Recommended next step | Once DATA-001 confirms the source, add the missing links and review the 7 extra ones. Adding the topic links needs no content decision. |
| Approval required | Partly. No for the topic links (the workbook states the answer; apply only after DATA-001 is confirmed). Yes for the 7 extra activity links, because removing them is a content decision. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-014 - Resources

| Field | Detail |
|---|---|
| Issue ID | DATA-014 |
| Category | Resources |
| Role / segment | Agents Researcher (AGT-006), Customer Success persona (AGT-011), Sales Agent (AGT-001), Deal Agent (AGT-016) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Resources has no RES-004 (also absent from the 9.16 workbook). Agent_Resources rows 2-37: AGT-016 is linked to RES-DA-01, RES-DA-02, RES-DA-05, RES-DA-06; AGT-006 and AGT-011 have no extra link. |
| Excel value | RES-004 does not exist in either workbook. |
| Current application value | Resource RES-004 ('Frontier Accelerator Content and Learning Model') is shown on agent AGT-006 (Researcher) in 205 of the 286 placement records. AGT-011 also has RES-CSAM-PERSONA, which the workbook does not link. AGT-001 has RES-DA-01, RES-DA-02, RES-DA-05 and RES-DA-06 (the workbook links those to AGT-016 instead). |
| Difference | 6 agent-resource links exist only in the application: RES-004 on AGT-006, RES-CSAM-PERSONA on AGT-011, and four Deal Agent resources on AGT-001 (the workbook links those four to AGT-016). RES-004 is also in the SQL seed (15_Huddle_Resources.sql). Four agents the workbook lists (SYS-003 to SYS-006) are not used by any application placement, so their links (RES-ECIF-01, RES-008) cannot be compared. |
| Recommended next step | Confirm whether RES-004 and RES-CSAM-PERSONA on the agent cards are approved, and how Deal Agent resources are shown (see DATA-016). |
| Approval required | Yes - content decision. |
| Priority | Medium |
| Status | Requires confirmation |


#### DATA-015 - Topic content

| Field | Detail |
|---|---|
| Issue ID | DATA-015 |
| Category | Topic content |
| Role / segment | All roles |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx, Topics: 23 rows. 13 topics differ (Appendix E): rows 4, 5, 7, 8, 9, 10, 11, 13, 15, 18, 22, 23, 24. Focus_Areas rows 2-13. ID_Crosswalk (TopicID). |
| Excel value | 23 topics with new ids (WF-PLAN and so on). Several older topics join into one new topic. 12 focus areas (FA-00 to FA-11). |
| Current application value | 31 topics, most with older ids (WF-X-PLAN-01 and so on). 10 focus areas (FA-09 and FA-11 are missing). |
| Difference | 13 of the 22 Excel topics that have an application match use different text (name, description, key takeaway or why-it-matters). 5 of them also use a different focus area (WF-CONV, WF-HANDOFF, WF-FISCAL-PLAN, WF-FISCAL-CLOSE, WF-IMPROVE). Excel topic WF-COMM has no application topic. 9 of the 31 application topic ids have no ID_Crosswalk entry and no identical id in Topics; their Excel topic was inferred through their placements and is unconfirmed. |
| Recommended next step | For each of the 13 topics decide which text is correct. Confirm the 9 inferred topic matches and the two missing focus areas. |
| Approval required | Yes - content decision. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-016 - AI agent mapping

| Field | Detail |
|---|---|
| Issue ID | DATA-016 |
| Category | AI agent mapping |
| Role / segment | All roles |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Activity_Agents rows 2-981 (Appendix F lists the 112 activities); Topic_Agents rows 2-118; Agents rows 2-23. |
| Excel value | Topic_Agents and Activity_Agents list agents with Primary or Secondary usage. The workbook does not say which sheet wins when they disagree. Deal Agent is AGT-016 ('Deal Agent, surfaced through Sales Agent', 15 rows). |
| Current application value | All 22 agent ids match the workbook. Deal Agent appears 10 times as a label under Sales Agent (AGT-001); AGT-016 is not used by any application placement. |
| Difference | Activity level: 993 shared activities; 881 match; 112 differ (55 where the application has extra agents, 57 where the agents themselves differ). Topic level: 20 of the 22 mapped Excel topics differ in at least one placement (198 of 265 placement records). The most common pattern is an agent that is Primary in the application and Secondary in the workbook. |
| Recommended next step | Decide the rule first (topic sheet or activity sheet wins; how Deal Agent is shown). Then apply it to all differences at once. |
| Approval required | Yes - the workbook does not say which sheet wins. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-017 - MCEM stages

| Field | Detail |
|---|---|
| Issue ID | DATA-017 |
| Category | MCEM stages |
| Role / segment | All roles |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Topic_MCEM rows 2-40 (39 rows). |
| Excel value | 39 topic-to-MCEM stage links. |
| Current application value | Each application placement lists its own MCEM stages. In most differing cases the workbook has more, or different, stages than the application. For example WF-CONSUME has none in the application and four in the workbook (MCEM-02 to MCEM-05). In one case (WF-POLICY) the application has an extra stage. |
| Difference | 15 Excel topics differ (123 of 265 placement records): WF-ASSET, WF-CONSUME, WF-CONV, WF-DEAL, WF-HANDOFF, WF-HEALTH, WF-OPP, WF-ORCH, WF-PARTNER, WF-PIPE, WF-PLAN, WF-POLICY, WF-RENEW, WF-SOL, WF-VALUE. |
| Recommended next step | Once DATA-001 confirms the source, update the stage links from Topic_MCEM. This needs no content decision. |
| Approval required | No - the workbook states the answer. Apply only after DATA-001 is confirmed. |
| Priority | Medium |
| Status | Still unresolved |


#### DATA-018 - Role

| Field | Detail |
|---|---|
| Issue ID | DATA-018 |
| Category | Role |
| Role / segment | All Roles under SME&C (SR-SMEC-ALL) |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Segment_Roles row 16 (SR-SMEC-ALL, 'All Roles'); no Role_Paths rows and no Additional_Content rows for it. The same row exists in the 9.16 workbook (row 16). Change Summary row 56: SR-ENT-ALL 'carries no SME&C content, so never use it as a fallback for an SME&C role'. |
| Excel value | The role record exists. It has no content. |
| Current application value | The application has no SME&C All Roles entry. 'All Roles' appears once, under Enterprise. |
| Difference | The application has 29 roles; the workbook has 30 segment roles. The missing one is SR-SMEC-ALL, which has no content, so no learner is affected. |
| Recommended next step | Confirm that leaving it out is intended. No data change is needed unless the content owner wants an SME&C All Roles entry. |
| Approval required | Yes - confirmation only. |
| Priority | Low |
| Status | Requires confirmation |


#### DATA-019 - Internal consistency

| Field | Detail |
|---|---|
| Issue ID | DATA-019 |
| Category | Internal consistency |
| Role / segment | All roles |
| Excel reference | Frontier_Accelerator_Huddle_App_Content_Integration_Model_10.13.2026 v2.xlsx: Topic_Agents rows 2-118 and Topic_MCEM rows 2-40 define agents and MCEM stages once per topic, not per placement. |
| Excel value | One agent list and one MCEM stage list per topic. |
| Current application value | The application stores a topic default and a separate copy for each placement. They do not always agree: agents differ in 195 of 286 placement records (21 topics); MCEM stages differ in 88 placement records (17 topics). |
| Difference | The same topic can show different agents or stages depending on which record a screen reads. Which screens read which record was not checked. |
| Recommended next step | After DATA-016 and DATA-017 are decided, make the placement records and topic defaults agree. Check first which screens use each. |
| Approval required | No - it follows the DATA-016 and DATA-017 decisions. Not independent until then. |
| Priority | Medium |
| Status | Requires confirmation |


### B2. Items checked and resolved

These are not outstanding. They are listed so that nothing is counted twice.

| ID | Item | Evidence | Status |
|---|---|---|---|
| R-01 | Huddle and Workflow role lists | The Huddle role list (29 roles) and the Workflow role list (8 roles) are separate. The Huddle list has the five approved segments: Enterprise 9, SME&C 6, EPS (Partner) 6, Leader 1, USPSI 7. It does not contain Sales Manager (sm-mgr) or a Manager segment. The Workflow list has the 7 Enterprise roles and Sales Manager. The 7 roles in both lists have identical records. Everything else in the data file (Workflow tools, buckets and activities) is unchanged compared with the copy kept before the separation. | Resolved |
| R-02 | Role names and segments | 28 of the 29 Huddle roles use exactly the name and segment in Segment_Roles (RoleDisplayName and SegmentID). The only name difference is DATA-011. The only workbook segment role without an application entry is SR-SMEC-ALL (DATA-018). | Resolved (two exceptions are DATA-011 and DATA-018) |
| R-03 | Weekly paths: Enterprise, Enterprise Sales Manager, EPS, Leader, USPSI | All 22 of these roles have exactly Weeks 1 to 9, once each, and each of the 198 weekly slots has the same placement id and title as Role_Paths in the 10.13 workbook. | Resolved |
| R-04 | Weekly paths against the 9.16 workbook | All 104 weekly placements in Role_Paths of the 9.16 workbook (13 roles x 8 weeks) match the application exactly, including all 48 SME&C weeks 1-8. | Resolved (see DATA-001 and DATA-002 for the 10.13 workbook) |
| R-05 | Week 9 | All 28 Week 9 rows in Role_Paths of the 10.13 workbook (one per role) match the application. The Week 9 "coming soon" entry in commonRolePathWeeks.json is only offered for weeks after a role's last week. Every role already ends at Week 9, so the entry is never shown. It is an unused reference entry, not a data defect. | Resolved |
| R-06 | Additional Content | All 34 rows of Additional_Content match an application additional placement, and the application has no extra additional placement (34 in each). | Resolved |
| R-07 | ROLE-ALL weekly path | The workbook has no Role_Paths rows for ROLE-ALL (SR-ENT-ALL or SR-SMEC-ALL), so the application's empty weekly path agrees with the workbook. No weekly path should be added unless the content owner asks for one. Other ROLE-ALL questions are in DATA-010 and DATA-018. | Resolved |
| R-08 | Enterprise Sales Manager content | For all nine weeks the title, description, Today's Objective and WIIFM text equal Role_Paths rows 65-73 (10.13 workbook). Whether this content is approved is open (DATA-009). | Resolved for the data match; approval is DATA-009 |
| R-09 | Which data files the app uses | Only static-api-data.json and commonRolePathWeeks.json are loaded when the application runs. app-data.json, Roles.json and the other JSON files in the data folder are not imported by any runtime code. Differences that exist only in those files are not application issues. | Resolved (no action) |
| R-10 | Data integrity | 286 of 286 placements in the catalog are used by a role path or additional path, and every path entry exists in the catalog. No role path repeats a placement. The 1,079 activity ids are unique. Every agent id and focus-area id used by a placement exists. Every Workflow activity refers to an existing Workflow role, bucket and AI tool. No data was lost in the role separation. | Resolved |


## C. Manager decisions needed

Options are listed for the manager to choose from. No option has been chosen or applied.

| No. | Issue | Question | Options |
|---|---|---|---|
| C1 | DATA-001 | Which workbook is the approved source? | (a) The 10.13 workbook for all segments. (b) The 9.16 workbook for Enterprise and SME&C weeks 1-8, and the 10.13 workbook for the rest. (c) Another file. |
| C2 | DATA-002 | Which SME&C order should the application follow? | (a) The 10.13 order for all six roles. (b) The 10.13 order for some roles only. (c) Keep the current (9.16) order. |
| C3 | DATA-003 | What should happen to each of the five new placements? | For each: (a) add it, (b) replace the placement now shown in that week, (c) leave it out. |
| C4 | DATA-004 | For each of the 13 mappings, is the Excel placement the right replacement? Which older content is kept in a merge? How is DSS-VALUE divided? | For each: (a) confirm the Excel match, (b) keep the older placement as well, (c) retire the older placement. |
| C5 | DATA-005 | What happens to DSE-HEALTH? | (a) Retire it. (b) Keep it in the DSE path. (c) Move it to Additional Content. |
| C6 | DATA-008 | Does Workflow keep the Sales Manager role? May the unused Huddle sm-mgr entries stay? | (a) Keep Sales Manager in Workflow only. (b) Treat it as the same role as Enterprise Sales Manager (only if confirmed). (c) Remove the unused entries later, after checking whether saved plans use sm-mgr (not checked). |
| C7 | DATA-009 | Has the role owner validated the Enterprise Sales Manager path? | (a) Validated: keep. (b) Not yet validated: keep and mark as pending. (c) Not validated: hold back from release. |
| C8 | DATA-010 | Should All Roles stay in the All Topics filter? Should the 9 ALL placements be stored under each Enterprise role? | (a) Remove All Roles from every picker and show its 9 placements under every Enterprise role. (b) Keep it in the All Topics filter and leave storage as it is. |
| C9 | DATA-011 | Which name should the screen show for the SME&C Commercial Executive? | (a) "Commercial Executive". (b) "Commercial Executive (SME&C)". |
| C10 | DATA-012 | Where should each of the 19 unlinked resources go? | For each: (a) a topic, (b) an activity, (c) an agent, (d) global, (e) stay out. |
| C11 | DATA-014 | Are RES-004 and RES-CSAM-PERSONA approved on the agent cards? How are Deal Agent resources shown? | (a) Keep both. (b) Remove both. (c) Add them to the workbook first. |
| C12 | DATA-015 | Which topic text is correct for each of the 13 topics? Which focus area? Is each inferred topic match right? | For each: (a) the workbook text, (b) the application text, (c) a new text from the owner. |
| C13 | DATA-016 | Which agent sheet wins when Topic_Agents and Activity_Agents disagree? How is Deal Agent (AGT-016) shown? | (a) Topic sheet wins. (b) Activity sheet wins. (c) Each activity is decided one by one. |
| C14 | DATA-018 | Is it intended that the application has no SME&C All Roles entry? | (a) Yes, leave it out. (b) Add an entry with no content. |


## D. Technical fixes you can do independently

These need no content decision. They have not been done. Do them only after DATA-001 confirms the 10.13 workbook as the source, and keep a backup of static-api-data.json first.

| Fix | Issue | What to do | How to check |
|---|---|---|---|
| D1 | DATA-013 | Add the 18 missing topic-resource links listed in Appendix I1 to the topic and placement records. | Re-run the comparison in Appendix I1: 0 missing topic links and no other change. |
| D2 | DATA-017 | Set each placement's MCEM stages from Topic_MCEM for the 15 topics in DATA-017. | Re-run the stage comparison: 0 differences. |
| D3 | DATA-006 | Prepare (do not apply) the list of 31 mappings in Appendix G, ready to update when DATA-002 to DATA-005 are decided. | Every mapped placement id exists in the catalog and in Role_Paths or Additional_Content. |
| D4 | DATA-019 | Prepare a report of every placement whose agents or stages differ from its topic default, so the decisions on DATA-016 and DATA-017 can be applied once. | The count of differing records goes to 0 after the decision. |
| D5 | Testing | Keep the comparison used in this review as a repeatable check outside the app (workbook against data file) and run it after each data change. | The counts in Section A. |


## E. Testing still required

### E1. What was run, and the result

| Check | Result | Notes |
|---|---|---|
| Scripted comparison of workbook and application data (this review) | Run; findings are in Section B | It compares ids, titles, text, agents, resources and MCEM stages. |
| TypeScript type check (tsc, in a scratch copy of the project) | Passed (exit code 0) | Run in this review. No file in the project was changed. |
| Unit tests (vitest, in the scratch copy) | Failed: 38 passed, 2 failed | The two failing tests are in src/features/huddle/exports/html/htmlExports.test.ts: "orders the persisted learning plan as Weeks 2 through 8" and "renders every generated document in the one font stack". They also fail on a copy of the code taken before the role-list separation. Their cause was not investigated here. Whether the first one is caused by data is unconfirmed. |
| Lint | Not run in this review |  |
| Production build | Not run in this review | No application file was changed by this review. |
| Opening the application in a browser and checking screens | Not run | The browser was not available. No screen has been checked. Anything in this report about what a user sees comes from the data and the code, not from a screen. |


### E2. Screens still to verify

| What to check | Roles / segments | Why |
|---|---|---|
| Huddle role picker lists the 5 segments and 29 roles; no Manager segment; no Sales Manager | All | R-01, DATA-008 |
| Workflow role picker lists 8 roles with Sales Manager under Manager | Workflow module | R-01, DATA-008 |
| Each role opens a 9-week path in the right order | Enterprise (7 roles and Enterprise Sales Manager), EPS (6), Leader (1), USPSI (7) | R-03: confirm the screen matches the data |
| Each SME&C role opens a 9-week path, and the order matches the decision on DATA-002 | Digital Account Executive, Commercial Executive (SME&C), Digital Solution Area Specialist, Digital Solution Engineer, Digital Cloud Solution Architect, Partner Solution Sales | DATA-002 to DATA-005 |
| All Roles: it is not offered when one role is chosen, it is offered in the All Topics filter, and whether its 9 placements show in an Enterprise role's Additional Content | All Roles; one Enterprise role | DATA-010 |
| Enterprise Sales Manager nine weeks display | Enterprise Sales Manager | DATA-009 |
| Week 9 shows for every role and no "coming soon" item appears | All roles with a path | R-05 |
| Agent cards, resources and MCEM stages on topics with differences | Topics in DATA-015, DATA-016, DATA-017 | To see what the user sees |


### E3. Automated tests still to write (none exist for this data)

Not written and not run: a test that every Huddle role has Weeks 1-9 and every placement exists; a test that the Huddle role list has no Manager segment and no sm-mgr; a test for the module filter on the roles endpoint (Workflow, Huddle, none); a test that every role-to-topic mapping points to an existing placement; a test that every Role_Paths row in the approved workbook matches the application.


## F. Backend and deployment differences (SQL seed scripts)

The application does not read the SQL scripts. It reads only the two JSON files. So none of the differences below changes what the current application shows. They matter only if a backend and database are used later. The comparison is at the id level only; column text was not compared.

| Item | SQL seed | 9.16 workbook | 10.13 workbook | Application | Affects the current app? | Affects a future backend? |
|---|---|---|---|---|---|---|
| Segments | 2 (SEG-ENT, SEG-SMEC) | 2 | 5 | 5 | No | Yes: EPS, Leader and USPSI would be missing |
| Segment roles | 15 | 15 | 30 | 29 | No | Yes: no EPS, Leader, USPSI or Enterprise Sales Manager roles |
| Placements | 138 (ids equal the 9.16 workbook) | 138 | 286 | 286 | No | Yes: 148 placements missing, including all Week 9 placements |
| Topics | 27 (ids equal 9.16) | 27 | 23 | 31 | No | Yes |
| Activities | 506 (ids equal 9.16) | 506 | 1,058 | 1,079 | No | Yes: 573 activities missing |
| Agents | 22 (ids equal) | 22 | 22 | 22 | No | No |
| Resources | 54 | 53 | 75 | 57 | No | Yes. The extra SQL resource is RES-004, which is in neither workbook (DATA-014). |
| Focus areas | 8 (FA-00 to FA-07) | 8 | 12 | 10 | No | Yes |
| Topic to MCEM links | 23 | 23 | 39 | Not directly comparable | No | Yes (DATA-017) |
| Roles table | Workflow roles (including Sales Manager, segment Manager) and Huddle roles are kept in one table | - | - | Two separate lists | No | Yes: the database does not separate the two lists. Whether a backend can filter by module is unconfirmed (the backend was not reviewed). |
| Weekly path | Role-path items use SR-ENT-* and SR-SMEC-* ids only, weeks 1-8 | Weeks 1-8 | Weeks 1-9 | Weeks 1-9 | No | Yes: no Week 9 and no new segments |


The SQL scripts match the 9.16 workbook at the id level for placements, topics, activities and agents. They do not match the 10.13 workbook or the application. If a backend is used, the scripts need to be regenerated from the approved workbook after DATA-001 to DATA-005 are decided. This is not needed for the current application.


## G. Recommended work order

| Order | Work | Issues | Who |
|---|---|---|---|
| 1 | Confirm which workbook is the approved source. | DATA-001 | Content owner |
| 2 | Decide the SME&C path: order, five new placements, 13 mappings, DSE-HEALTH. | DATA-002, 003, 004, 005 | Content owner |
| 3 | Prepare and apply the changes that need no content decision (after step 1). | DATA-013 (topic links), DATA-017 | Technical |
| 4 | Decide the remaining content questions: agent rule, topic text, resources. | DATA-016, 015, 012, 014 | Content owner |
| 5 | Decide the role questions: Sales Manager, All Roles, role name, SR-SMEC-ALL, Enterprise Sales Manager validation. | DATA-008, 010, 011, 018, 009 | Content owner |
| 6 | Apply the follow-on changes together: mappings, activities, internal consistency. | DATA-006, 007, 019 | Technical |
| 7 | Open the application and check the screens in Section E2. Add the automated tests in Section E3. | All | Technical |
| 8 | Regenerate the SQL seed scripts only when a backend is planned. | Section F | Technical |


## Appendix A. SME&C weekly differences against the 10.13 workbook

Role ids used in the tables: dae-smec = Digital Account Executive; ce-smec = Commercial Executive (SME&C); dss-smec = Digital Solution Area Specialist; dse-smec = Digital Solution Engineer; dcsa-smec = Digital Cloud Solution Architect; pss-smec = Partner Solution Sales.

Only weeks that differ are shown (30 slots). Evidence is the Role_Paths row, ID_Crosswalk row or Content_Lineage row named in the table. Weeks not listed match.

| Role | Week | Excel row | Excel placement | Application placement (same week) | How the workbook links them |
|---|---|---|---|---|---|
| dae-smec | 5 | Role_Paths row 78 | PLC-SMEC-DAE-W05 - Advance the Partner-Led Deal and Forecast | DAE-DEAL - Advance a Deal Somebody Else May Close | Merge: DAE-DEAL + DAE-PARTNER (Content_Lineage rows 45-46) |
| dae-smec | 6 | Role_Paths row 79 | PLC-SMEC-DAE-W06 - Route the Opportunity to the Right Scale Engine | DAE-PARTNER - Hand Over Well and Stay on the Clock | New in workbook (no earlier placement in ID_Crosswalk or Content_Lineage) |
| dae-smec | 8 | Role_Paths row 81 | PLC-SMEC-DAE-W08 - Run the Portfolio Health and Expansion Loop | DAE-HEALTH - Read Portfolio Health Without Inspecting Every Account | Replaced by changed content: DAE-HEALTH (Content_Lineage row 48) |
| ce-smec | 2 | Role_Paths row 84 | PLC-SMEC-SMEC-CE-W02 - Triage Commercial Engagement Early | SMEC-CE-RENEW - Run the Renewal Workback Across a Book, Not an Account | New in workbook (no earlier placement in ID_Crosswalk or Content_Lineage) |
| ce-smec | 4 | Role_Paths row 86 | PLC-SMEC-SMEC-CE-W04 - Resolve Policy and Licensing Before Commitment | SMEC-CE-HEALTH - Spot Commercial Risk Across the Portfolio | Same placement as app SMEC-CE-POLICY, now in app week 5 (ID_Crosswalk row 139) |
| ce-smec | 5 | Role_Paths row 87 | PLC-SMEC-SMEC-CE-W05 - Set the Negotiation Strategy and Guardrails | SMEC-CE-POLICY - Resolve Policy and Licensing Before Commitment | Same placement as app SMEC-CE-NEG, now in app week 6 (ID_Crosswalk row 140) |
| ce-smec | 6 | Role_Paths row 88 | PLC-SMEC-SMEC-CE-W06 - Build and Run the Approval Case | SMEC-CE-NEG - Set the Negotiation Strategy and Guardrails | Merge: SMEC-CE-ORCH + SMEC-CE-DEAL2 (Content_Lineage rows 54-55) |
| ce-smec | 7 | Role_Paths row 89 | PLC-SMEC-SMEC-CE-W07 - Transfer the Approved Construct into Execution | SMEC-CE-ORCH - Get the Approvals Moving When You Do Not Own the Deal | New in workbook (no earlier placement in ID_Crosswalk or Content_Lineage) |
| ce-smec | 8 | Role_Paths row 90 | PLC-SMEC-SMEC-CE-W08 - Govern the Renewal Book and Commercial Risk | SMEC-CE-DEAL2 - Make the Commercial Case Reviewable | Merge: SMEC-CE-RENEW (ID_Crosswalk row 143) + SMEC-CE-HEALTH (Content_Lineage rows 51); title is different in the workbook |
| dss-smec | 2 | Role_Paths row 93 | PLC-SMEC-DSS-W02 - Detect and Prioritize Solution-Area Demand | DSS-SIGNAL - Judge Which Engagement Signals Are Real | Replaced by changed content: DSS-SIGNAL (Content_Lineage row 2) |
| dss-smec | 3 | Role_Paths row 94 | PLC-SMEC-DSS-W03 - Create and Qualify Solution-Area Pipeline | DSS-TERRITORY - Find Where Your Solution Area Actually Lands | Replaced by changed content: DSS-TERRITORY (Content_Lineage row 3) |
| dss-smec | 4 | Role_Paths row 95 | PLC-SMEC-DSS-W04 - Shape the Customer Strategy and Decision Criteria | DSS-CONV - Bring Solution Depth to a Conversation You Did Not Arrange | Merge: DSS-CONV + DSS-COMP (Content_Lineage rows 4, 8) |
| dss-smec | 5 | Role_Paths row 96 | PLC-SMEC-DSS-W05 - Prove and Convert the Customer Decision | DSS-DEAL - Move the Solution Decision, Not the Deal | Merge: DSS-DEAL + DSS-COMP (Content_Lineage rows 5, 9) |
| dss-smec | 6 | Role_Paths row 97 | PLC-SMEC-DSS-W06 - Route Co-Sell, Support, and Investment to Delivery | DSS-VALUE - Prove the Solution Did What You Said It Would | Replaced by changed content: DSS-ORCH (Content_Lineage row 10) |
| dss-smec | 7 | Role_Paths row 98 | PLC-SMEC-DSS-W07 - Activate the Solution and Establish Evidence | DSS-COMP - Build a Competitive Position the Customer Would Recognize | Split: DSS-VALUE feeds more than one placement (Content_Lineage rows 6) |
| dss-smec | 8 | Role_Paths row 99 | PLC-SMEC-DSS-W08 - Expand, Renew, and Close the Operating Loop | DSS-ORCH - Make the Ask Specific Enough to Be Accepted | Split: DSS-VALUE feeds more than one placement (Content_Lineage rows 7) |
| dse-smec | 5 | Role_Paths row 105 | PLC-SMEC-DSE-W05 - Close and Communicate the Technical Decision | DSE-CONV - Answer a Question You Were Not Asked Directly | Replaced by changed content: DSE-CONV (Content_Lineage row 59) |
| dse-smec | 6 | Role_Paths row 106 | PLC-SMEC-DSE-W06 - Transfer the Technical Decision into Delivery | DSE-HEALTH - Find the Problem Before the Customer Does | New in workbook (no earlier placement in ID_Crosswalk or Content_Lineage) |
| dcsa-smec | 2 | Role_Paths row 111 | PLC-SMEC-DCSA-W02 - Accept the Consumption and Delivery Handoff | DCSA-CONSUME - Prioritize the Covered Consumption Portfolio | New in workbook (no earlier placement in ID_Crosswalk or Content_Lineage) |
| dcsa-smec | 3 | Role_Paths row 112 | PLC-SMEC-DCSA-W03 - Prioritize the Covered Consumption Portfolio | DCSA-PARTNER - Run the Partner or Scale-Engine Delivery Handoff | Same placement as app DCSA-CONSUME, now in app week 2 (ID_Crosswalk row 165) |
| dcsa-smec | 4 | Role_Paths row 113 | PLC-SMEC-DCSA-W04 - Make the Committed Milestone Delivery-Ready | DCSA-CONV - Make the One Conversation Count | Replaced by changed content: DCSA-ARCH (Content_Lineage row 66) |
| dcsa-smec | 5 | Role_Paths row 114 | PLC-SMEC-DCSA-W05 - Run the Partner or Scale-Engine Delivery Handoff | DCSA-VALUE - Evidence Adoption and Value with Correct Attribution | Same placement as app DCSA-PARTNER, now in app week 3 (ID_Crosswalk row 167) |
| dcsa-smec | 6 | Role_Paths row 115 | PLC-SMEC-DCSA-W06 - Remove the Highest-Cost Adoption or Technical Blocker | DCSA-ARCH - Design Something That Will Run Without You There | Merge: DCSA-CONV + DCSA-HEALTH (Content_Lineage rows 64, 67) |
| dcsa-smec | 7 | Role_Paths row 116 | PLC-SMEC-DCSA-W07 - Evidence Adoption and Value with Correct Attribution | DCSA-HEALTH - Find the Technical Problem Before It Reaches the Number | Same placement as app DCSA-VALUE, now in app week 5 (ID_Crosswalk row 169) |
| pss-smec | 3 | Role_Paths row 121 | PLC-SMEC-PSS-W03 - Qualify Partner-Originated Demand Before the Window Closes | PSS-PARTNER - Keep Pinned-Partner Deals Moving Between Stages | Same placement as app PSS-DEMAND, now in app week 4 (ID_Crosswalk row 174) |
| pss-smec | 4 | Role_Paths row 122 | PLC-SMEC-PSS-W04 - Reconcile Pinned-Partner Pipeline and Forecast | PSS-DEMAND - Qualify Partner-Originated Demand Before the Window Closes | Same placement as app PSS-PARTNER, now in app week 3 (ID_Crosswalk row 175); title is different in the workbook |
| pss-smec | 5 | Role_Paths row 123 | PLC-SMEC-PSS-W05 - Run Partner Deal Clinics to Remove Priority Blockers | PSS-ORCH - Run a Rhythm Across More Partners Than You Can Meet | Replaced by changed content: PSS-ORCH (Content_Lineage row 72) |
| pss-smec | 6 | Role_Paths row 124 | PLC-SMEC-PSS-W06 - Confirm Partner Readiness Before Routing Work | PSS-VALUE - Find Out What Happened After the Partner Closed It | Same placement as app PSS-CAPACITY, now in app week 7 (ID_Crosswalk row 177) |
| pss-smec | 7 | Role_Paths row 125 | PLC-SMEC-PSS-W07 - Transfer the Closed Partner Deal into Delivery | PSS-CAPACITY - Confirm Partner Readiness Before Routing Work | Replaced by changed content: PSS-VALUE (Content_Lineage row 73) |
| pss-smec | 8 | Role_Paths row 126 | PLC-SMEC-PSS-W08 - Run Partner Performance and Expansion Reviews | PSS-CONV - Have the Conversation in the Partner's Economics | Replaced by changed content: PSS-CONV (Content_Lineage row 75) |


Weeks that match, by role: Digital Account Executive 1, 2, 3, 4, 7, 9; Commercial Executive (SME&C) 1, 3, 9; Digital Solution Area Specialist 1, 9; Digital Solution Engineer 1, 2, 3, 4, 7, 8, 9; Digital Cloud Solution Architect 1, 8, 9; Partner Solution Sales 1, 2, 9.


## Appendix B. The 13 uncertain placement mappings

| No. | Application placement | Excel placement | Excel evidence | Why it is uncertain |
|---|---|---|---|---|
| 1 | DSS-CONV (dss-smec, app week 4) - Bring Solution Depth to a Conversation You Did Not Arrange | PLC-SMEC-DSS-W04 - Shape the Customer Strategy and Decision Criteria (Role_Paths row 95) | Content_Lineage row 4 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 2 | DSS-DEAL (dss-smec, app week 5) - Move the Solution Decision, Not the Deal | PLC-SMEC-DSS-W05 - Prove and Convert the Customer Decision (Role_Paths row 96) | Content_Lineage row 5 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 3 | DSS-VALUE (dss-smec, app week 6) - Prove the Solution Did What You Said It Would | PLC-SMEC-DSS-W07 - Activate the Solution and Establish Evidence (Role_Paths row 98) | Content_Lineage row 6 | One older placement feeds two Excel placements. The workbook does not say how its content is divided. |
| 4 | DSS-VALUE (dss-smec, app week 6) - Prove the Solution Did What You Said It Would | PLC-SMEC-DSS-W08 - Expand, Renew, and Close the Operating Loop (Role_Paths row 99) | Content_Lineage row 7 | One older placement feeds two Excel placements. The workbook does not say how its content is divided. |
| 5 | DSS-COMP (dss-smec, app week 7) - Build a Competitive Position the Customer Would Recognize | PLC-SMEC-DSS-W04 - Shape the Customer Strategy and Decision Criteria (Role_Paths row 95) ; PLC-SMEC-DSS-W05 - Prove and Convert the Customer Decision (Role_Paths row 96) | Content_Lineage rows 8-9 | One older placement feeds two Excel placements that each also merge another older placement. The workbook does not say how it is divided. |
| 6 | DAE-DEAL (dae-smec, app week 5) - Advance a Deal Somebody Else May Close | PLC-SMEC-DAE-W05 - Advance the Partner-Led Deal and Forecast (Role_Paths row 78) | Content_Lineage row 45 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 7 | DAE-PARTNER (dae-smec, app week 6) - Hand Over Well and Stay on the Clock | PLC-SMEC-DAE-W05 - Advance the Partner-Led Deal and Forecast (Role_Paths row 78) | Content_Lineage row 46 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 8 | SMEC-CE-RENEW (ce-smec, app week 2) - Run the Renewal Workback Across a Book, Not an Account | PLC-SMEC-SMEC-CE-W08 - Govern the Renewal Book and Commercial Risk (Role_Paths row 90) | ID_Crosswalk row 143 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 9 | SMEC-CE-HEALTH (ce-smec, app week 4) - Spot Commercial Risk Across the Portfolio | PLC-SMEC-SMEC-CE-W08 - Govern the Renewal Book and Commercial Risk (Role_Paths row 90) | Content_Lineage row 51 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 10 | SMEC-CE-ORCH (ce-smec, app week 7) - Get the Approvals Moving When You Do Not Own the Deal | PLC-SMEC-SMEC-CE-W06 - Build and Run the Approval Case (Role_Paths row 88) | Content_Lineage row 54 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 11 | SMEC-CE-DEAL2 (ce-smec, app week 8) - Make the Commercial Case Reviewable | PLC-SMEC-SMEC-CE-W06 - Build and Run the Approval Case (Role_Paths row 88) | Content_Lineage row 55 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 12 | DCSA-CONV (dcsa-smec, app week 4) - Make the One Conversation Count | PLC-SMEC-DCSA-W06 - Remove the Highest-Cost Adoption or Technical Blocker (Role_Paths row 115) | Content_Lineage row 64 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |
| 13 | DCSA-HEALTH (dcsa-smec, app week 7) - Find the Technical Problem Before It Reaches the Number | PLC-SMEC-DCSA-W06 - Remove the Highest-Cost Adoption or Technical Blocker (Role_Paths row 115) | Content_Lineage row 67 | Two older placements feed this Excel placement. The workbook does not say which is the main source. |


## Appendix C. Excel placements with no application counterpart (21)

| Role | Week | Excel row | Excel placement | Type | Older placement(s) |
|---|---|---|---|---|---|
| ce-smec | 2 | Role_Paths row 84 | PLC-SMEC-SMEC-CE-W02 - Triage Commercial Engagement Early | new | - |
| ce-smec | 6 | Role_Paths row 88 | PLC-SMEC-SMEC-CE-W06 - Build and Run the Approval Case | merge | SMEC-CE-ORCH, SMEC-CE-DEAL2 |
| ce-smec | 7 | Role_Paths row 89 | PLC-SMEC-SMEC-CE-W07 - Transfer the Approved Construct into Execution | new | - |
| dae-smec | 5 | Role_Paths row 78 | PLC-SMEC-DAE-W05 - Advance the Partner-Led Deal and Forecast | merge | DAE-DEAL, DAE-PARTNER |
| dae-smec | 6 | Role_Paths row 79 | PLC-SMEC-DAE-W06 - Route the Opportunity to the Right Scale Engine | new | - |
| dae-smec | 8 | Role_Paths row 81 | PLC-SMEC-DAE-W08 - Run the Portfolio Health and Expansion Loop | one-to-one | DAE-HEALTH |
| dcsa-smec | 2 | Role_Paths row 111 | PLC-SMEC-DCSA-W02 - Accept the Consumption and Delivery Handoff | new | - |
| dcsa-smec | 4 | Role_Paths row 113 | PLC-SMEC-DCSA-W04 - Make the Committed Milestone Delivery-Ready | one-to-one | DCSA-ARCH |
| dcsa-smec | 6 | Role_Paths row 115 | PLC-SMEC-DCSA-W06 - Remove the Highest-Cost Adoption or Technical Blocker | merge | DCSA-CONV, DCSA-HEALTH |
| dse-smec | 5 | Role_Paths row 105 | PLC-SMEC-DSE-W05 - Close and Communicate the Technical Decision | one-to-one | DSE-CONV |
| dse-smec | 6 | Role_Paths row 106 | PLC-SMEC-DSE-W06 - Transfer the Technical Decision into Delivery | new | - |
| dss-smec | 2 | Role_Paths row 93 | PLC-SMEC-DSS-W02 - Detect and Prioritize Solution-Area Demand | one-to-one | DSS-SIGNAL |
| dss-smec | 3 | Role_Paths row 94 | PLC-SMEC-DSS-W03 - Create and Qualify Solution-Area Pipeline | one-to-one | DSS-TERRITORY |
| dss-smec | 4 | Role_Paths row 95 | PLC-SMEC-DSS-W04 - Shape the Customer Strategy and Decision Criteria | merge | DSS-CONV, DSS-COMP |
| dss-smec | 5 | Role_Paths row 96 | PLC-SMEC-DSS-W05 - Prove and Convert the Customer Decision | merge | DSS-DEAL, DSS-COMP |
| dss-smec | 6 | Role_Paths row 97 | PLC-SMEC-DSS-W06 - Route Co-Sell, Support, and Investment to Delivery | one-to-one | DSS-ORCH |
| dss-smec | 7 | Role_Paths row 98 | PLC-SMEC-DSS-W07 - Activate the Solution and Establish Evidence | split | DSS-VALUE |
| dss-smec | 8 | Role_Paths row 99 | PLC-SMEC-DSS-W08 - Expand, Renew, and Close the Operating Loop | split | DSS-VALUE |
| pss-smec | 5 | Role_Paths row 123 | PLC-SMEC-PSS-W05 - Run Partner Deal Clinics to Remove Priority Blockers | one-to-one | PSS-ORCH |
| pss-smec | 7 | Role_Paths row 125 | PLC-SMEC-PSS-W07 - Transfer the Closed Partner Deal into Delivery | one-to-one | PSS-VALUE |
| pss-smec | 8 | Role_Paths row 126 | PLC-SMEC-PSS-W08 - Run Partner Performance and Expansion Reviews | one-to-one | PSS-CONV |


Type: new = no older placement; merge = two older placements feed it; split = one older placement feeds two Excel placements; one-to-one = one older placement replaced by changed content (Content_Lineage).


The application has 21 older placement ids that are not used in Role_Paths or Additional_Content: DAE-DEAL, DAE-HEALTH, DAE-PARTNER, DCSA-ARCH, DCSA-CONV, DCSA-HEALTH, DSE-CONV, DSE-HEALTH, DSS-COMP, DSS-CONV, DSS-DEAL, DSS-ORCH, DSS-SIGNAL, DSS-TERRITORY, DSS-VALUE, PSS-CONV, PSS-ORCH, PSS-VALUE, SMEC-CE-DEAL2, SMEC-CE-HEALTH, SMEC-CE-ORCH. All 21 are SME&C placements. Only DSE-HEALTH is not named in Content_Lineage (DATA-005).


## Appendix D. The 19 unlinked resources

| Resources row | ResourceID | Title | Type | Global |
|---|---|---|---|---|
| 18 | RES-DA-04 | Deal Agent huddle deck | Huddle material | N |
| 24 | RES-SKILLS-CAT | CAT Agent Skills catalog | Skill catalog | Y |
| 25 | RES-SKILLS-SHACK | Skill Shack | Skill catalog | Y |
| 26 | RES-SK-COACH | Skill Authoring Coach | Agent skill | Y |
| 27 | RES-SK-ONEPAGER | Cowork Use Case One-Pager | Agent skill | Y |
| 43 | RES-SK-ROUTE | What to Use When | Agent skill | N |
| 44 | RES-SK-NEG | Stoic Negotiator | Agent skill | N |
| 46 | RES-SK-REDLINE | Redlining Content | Agent skill | N |
| 52 | RES-GLOBAL-03 | Microsoft AI-Powered Selling (MAPS) | Learning program | Y |
| 62 | RES-MGR-01 | Customer Meeting Preparation | Learning resource | N |
| 63 | RES-MGR-02 | Cross Functional Collaboration | Learning resource | N |
| 64 | RES-MGR-03 | Navigating Objections | Learning resource | N |
| 65 | RES-MGR-04 | De-Escalating Emotions | Learning resource | N |
| 66 | RES-MGR-05 | Powerful Introductions | Learning resource | N |
| 67 | RES-MGR-06 | Communicating with Clarity | Learning resource | N |
| 68 | RES-MGR-07 | Executive Presence with Customers | Learning resource | N |
| 69 | RES-MGR-08 | Team-meeting deck | Huddle material | N |
| 70 | RES-MGR-09 | participant guide | Participant guide | N |
| 71 | RES-MGR-10 | AIT Change Agent | Internal resource | N |


## Appendix E. Topic differences

| Excel topic | Application topic(s) (placement records) | Fields that differ | Focus area (Excel / application) |
|---|---|---|---|
| WF-CONV (Topics row 7) | WF-X-CONV-01 x18, WF-X-SPONSOR-01 x1 | description, focus area, key takeaway, name, why it matters | FA-02 / FA-01, FA-02 |
| WF-DEAL (Topics row 10) | WF-X-DEAL-01 x18 | description, key takeaway, name, why it matters | FA-03 / FA-03 |
| WF-FISCAL-CLOSE (Topics row 23) | WF-X-CLOSE-01 x1 | description, focus area, key takeaway, name, why it matters | FA-09 / FA-01 |
| WF-FISCAL-PLAN (Topics row 22) | WF-X-FYPLAN-01 x1 | description, focus area, key takeaway, name, why it matters | FA-09 / FA-01 |
| WF-HANDOFF (Topics row 11) | WF-X-TRANSITION-01 x1, WF-X-HANDOFF-01 x5, WF-X-PARTNER-01 x1 | description, focus area, key takeaway, name, why it matters | FA-07 / FA-01 |
| WF-HEALTH (Topics row 9) | WF-X-HEALTH-01 x18, WF-X-VSAT-01 x1 | description, key takeaway, name, why it matters | FA-06 / FA-06 |
| WF-IMPROVE (Topics row 24) | WF-X-USECASE-01 x1 | description, focus area, key takeaway, name, why it matters | FA-11 / FA-01 |
| WF-INVEST (Topics row 18) | WF-INVEST-01 x14 | description, key takeaway, name, why it matters | FA-07 / FA-07 |
| WF-ORCH (Topics row 15) | WF-X-ORCH-01 x18 | description, key takeaway, name, why it matters | FA-07 / FA-07 |
| WF-PIPE (Topics row 5) | WF-X-PIPE-01 x5, WF-X-SIGNAL-01 x1, WF-X-PARTNER-01 x1 | description, key takeaway, name, why it matters | FA-01 / FA-01 |
| WF-PLAN (Topics row 4) | WF-X-PLAN-01 x19, WF-X-TERRITORY-01 x2 | description, key takeaway, name, why it matters | FA-01 / FA-01 |
| WF-SOL (Topics row 8) | WF-X-ARCH-01 x18, WF-X-DISC-01 x2, WF-X-PROOF-01 x1, WF-X-TECHLEAD-01 x1 | description, key takeaway, name, why it matters | FA-05 / FA-05 |
| WF-VALUE (Topics row 13) | WF-X-VALUE-01 x18 | description, key takeaway, name, why it matters | FA-02 / FA-02 |


Excel topic not in the application: WF-COMM (Topics row 20). Application topic ids with no ID_Crosswalk row and no identical Topics id (their Excel topic was inferred through placements and is unconfirmed): WF-INVEST-01, WF-X-USECASE-01, WF-X-TRANSITION-01, WF-X-FYPLAN-01, WF-X-CLOSE-01, WF-X-PARTNER-01, WF-X-VSAT-01, WF-X-TECHLEAD-01, WF-X-PROOF-01. Focus areas in the workbook but not in the application: FA-09 (Leadership Business Management and Execution) and FA-11 (Workflow Improvement and AI Practice).


## Appendix F. Agent mapping differences

### F1. Topic level (Topic_Agents compared with the application placement records)

| Excel topic | Topic_Agents rows | Placement records that differ | In application only | In Excel only |
|---|---|---|---|---|
| WF-ASSET | 2-5 | 8 | AGT-005 Primary; AGT-006 Primary | AGT-005 Secondary; AGT-006 Secondary |
| WF-COACH | 6-7 | 3 | AGT-004 Primary; AGT-009 Primary | AGT-004 Secondary |
| WF-CONSUME | 8-11 | 3 | AGT-004 Primary; AGT-006 Primary; AGT-008 Primary | AGT-004 Secondary; AGT-006 Secondary; AGT-008 Secondary |
| WF-CONV | 12-18 | 19 | AGT-001 Primary; AGT-003 Primary; AGT-006 Primary; AGT-009 Primary | AGT-001 Secondary; AGT-003 Secondary; AGT-006 Secondary; AGT-009 Secondary |
| WF-DEAL | 19-27 | 18 | AGT-003 Primary; AGT-004 Primary | AGT-003 Secondary; AGT-004 Secondary; AGT-013 Primary; AGT-016 Primary |
| WF-FISCAL-CLOSE | none | 1 | AGT-001 Primary | - |
| WF-FISCAL-PLAN | none | 1 | AGT-001 Primary | - |
| WF-HANDOFF | 28-35 | 7 | AGT-001 Primary | AGT-001 Secondary; AGT-003 Secondary; AGT-004 Primary; AGT-005 Secondary; AGT-006 Secondary; AGT-009 Secondary; AGT-013 Secondary; AGT-014 Secondary |
| WF-HEALTH | 36-44 | 19 | AGT-001 Primary; AGT-004 Primary; AGT-006 Primary | AGT-001 Secondary; AGT-004 Secondary; AGT-006 Secondary |
| WF-IMPROVE | none | 1 | AGT-003 Primary | - |
| WF-INVEST | 45-50 | 14 | AGT-004 Secondary | AGT-004 Primary |
| WF-OPP | 51-56 | 7 | AGT-003 Primary; AGT-004 Primary; AGT-005 Primary | AGT-003 Secondary; AGT-004 Secondary; AGT-005 Secondary; AGT-013 Primary |
| WF-ORCH | 57-64 | 14 | AGT-001 Primary; AGT-002 Primary; AGT-005 Primary | AGT-001 Secondary; AGT-002 Secondary; AGT-005 Secondary |
| WF-PARTNER | 65-66 | 2 | AGT-005 Primary | - |
| WF-PIPE | 67-76 | 7 | AGT-001 Primary; AGT-004 Secondary; AGT-005 Primary; AGT-010 Primary | AGT-001 Secondary; AGT-004 Primary; AGT-005 Secondary; AGT-009 Secondary; AGT-010 Secondary; AGT-014 Secondary |
| WF-PLAN | 77-84 | 21 | AGT-002 Primary; AGT-003 Primary; AGT-005 Primary | AGT-002 Secondary; AGT-003 Secondary; AGT-005 Secondary; AGT-013 Primary |
| WF-POLICY | 85-90 | 3 | AGT-003 Primary; AGT-004 Primary; AGT-005 Primary; AGT-006 Primary | AGT-003 Secondary; AGT-004 Secondary; AGT-005 Secondary; AGT-006 Secondary; AGT-013 Primary |
| WF-RENEW | 91-100 | 10 | AGT-003 Primary; AGT-004 Primary | AGT-003 Secondary; AGT-004 Secondary; AGT-013 Primary; AGT-016 Primary |
| WF-SOL | 101-109 | 22 | AGT-013 Secondary | AGT-009 Secondary; AGT-013 Primary |
| WF-VALUE | 110-118 | 18 | AGT-003 Primary; AGT-006 Primary; AGT-007 Primary | AGT-003 Secondary; AGT-006 Secondary; AGT-007 Secondary |


(One example set is shown per topic. The most common difference is the same agent listed as Primary in the application and Secondary in the workbook. Total: 198 of 265 placement records.)


### F2. Activity level (112 activities)

| ActivityID | Excel rows | Application placement | Application agents | Excel agents | Difference |
|---|---|---|---|---|---|
| AE-03-ALT-02 | Activities row 12; Activity_Agents rows 113 | AE-PLAN | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-01-P05B | Activities row 6; Activity_Agents rows 137 | AE-PIPE-1 | AGT-001 Primary #1; AGT-005 Primary #2 | AGT-005 Primary #1 | App has extra agent(s) |
| AE-02-P02 | Activities row 10; Activity_Agents rows 134 | AE-PIPE-2 | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-02-ALT-02 | Activities row 8; Activity_Agents rows 139 | AE-PIPE-2 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-04-ALT-02 | Activities row 17; Activity_Agents rows 108 | AE-OPP | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-06-P-AE03 | Activities row 30; Activity_Agents rows 297 | AE-CONV | AGT-006 Primary #1; AGT-001 Alternate #2 | AGT-006 Primary #1 | App has extra agent(s) |
| AE-06-P-AE02 | Activities row 29; Activity_Agents rows 127 | AE-CONV | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-05-DEAL-01 | Activities row 23; Activity_Agents rows 119 | AE-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| AE-05-P01 | Activities row 24; Activity_Agents rows 115 | AE-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| AE-05-P02 | Activities row 25; Activity_Agents rows 116 | AE-DEAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-05-QUOTE-01 | Activities row 26; Activity_Agents rows 262 | AE-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| AE-05-ALT-02 | Activities row 22; Activity_Agents rows 118 | AE-DEAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-07-P01 | Activities row 33; Activity_Agents rows 120 | AE-RENEW | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| AE-07-P02 | Activities row 34; Activity_Agents rows 121 | AE-RENEW | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| AE-07-ALT-02 | Activities row 32; Activity_Agents rows 123 | AE-RENEW | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-X-PLAN-01-P-ATS-INTEL-02 | Activities row 282; Activity_Agents rows 241 | ATS-INTEL | AGT-011 Primary #1; AGT-008 Primary #2 | AGT-008 Primary #1 | App has extra agent(s) |
| WF-X-PLAN-01-P-ATS-03 | Activities row 280; Activity_Agents rows 152 | ATS-INTEL | AGT-011 Primary #1; AGT-008 Primary #2 | AGT-008 Primary #1 | App has extra agent(s) |
| WF-X-CONV-01-P-ATS-03 | Activities row 268; Activity_Agents rows 155 | ATS-NARR | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-X-PLAN-01-P-ATS-01 | Activities row 278; Activity_Agents rows 150, 156 | ATS-WORKLOAD | AGT-004 Primary #1; AGT-011 Primary #2; AGT-008 Secondary #3 | AGT-004 Primary #1; AGT-008 Secondary #1 | App has extra agent(s) |
| WF-X-PLAN-01-P-ATS-02 | Activities row 279; Activity_Agents rows 151, 157 | ATS-WORKLOAD | AGT-011 Primary #1; AGT-006 Primary #2; AGT-008 Secondary #3 | AGT-008 Secondary #1; AGT-006 Primary #1 | App has extra agent(s) |
| WF-LEAD-01-P-SSP-04 | Activities row 229; Activity_Agents rows 285 | SSP-LEAD | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-SOLUTION-01-P-SSP-04 | Activities row 249; Activity_Agents rows 289 | SSP-PLAN | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-VALUE-01-P-SSP-01 | Activities row 252; Activity_Agents rows 187 | SSP-VALUE | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-VTEAM-01-P-SSP-01 | Activities row 258; Activity_Agents rows 191 | SSP-ORCH | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| SSP-INVLINK-01 | Activities row 192; Activity_Agents rows 192 | SSP-ORCH | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-COMP-01-P-SSP-05 | Activities row 214; Activity_Agents rows 279 | SSP-COMP | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-DEAL-01-P-SSP-03 | Activities row 224; Activity_Agents rows 282 | SSP-DEAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-SE-ARCH-01-P-SE-02 | Activities row 233; Activity_Agents rows 22, 384 | SE-ARCH-1 | AGT-003 Primary #1; AGT-004 Primary #2; AGT-015 Secondary #3 | AGT-004 Primary #1; AGT-015 Secondary #2 | App has extra agent(s) |
| SE-INVLINK-01 | Activities row 184; Activity_Agents rows 35 | SE-ARCH-3 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-SE-DISC-01-P-SE-01 | Activities row 240; Activity_Agents rows 2 | SE-DISC | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-SE-DEAL-01-P-SE-02 | Activities row 237; Activity_Agents rows 8 | SE-HEALTH | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-01-ALT-02 | Activities row 83; Activity_Agents rows 39 | CE-HEALTH | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-CE-APPROVAL-01-P-CE-02 | Activities row 197; Activity_Agents rows 51 | CE-DEAL-1 | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-CE-STRUCT-01-P-CE-02 | Activities row 207; Activity_Agents rows 55 | CE-DEAL-2 | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-CE-TRANS-01-P-CE-02 | Activities row 209; Activity_Agents rows 57 | CE-DEAL-2 | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-02-ALT-02 | Activities row 85; Activity_Agents rows 59 | CE-DEAL-2 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-07-ALT-02 | Activities row 100; Activity_Agents rows 67 | CE-DEAL-2 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-02-DEAL-01 | Activities row 87; Activity_Agents rows 60 | CE-DEAL-3 | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| CE-02-BYOD-01 | Activities row 86; Activity_Agents rows 263 | CE-DEAL-3 | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| CE-04-ALT-02 | Activities row 91; Activity_Agents rows 62 | CE-DEAL-3 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-05-ALT-02 | Activities row 93; Activity_Agents rows 64 | CE-ORCH | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-CE-RENEW-01-P-CE-01 | Activities row 202; Activity_Agents rows 44 | CE-RENEW | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| CE-06-ALT-02 | Activities row 97; Activity_Agents rows 47 | CE-RENEW | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-03-ALT-02 | Activities row 89; Activity_Agents rows 43 | CE-POLICY | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CE-INVLINK-01 | Activities row 106; Activity_Agents rows 70 | CE-POLICY | AGT-001 Primary #1; AGT-006 Primary #2 | AGT-006 Primary #1 | App has extra agent(s) |
| WF-CONSUME-01-P-CSA-02 | Activities row 216; Activity_Agents rows 80 | CSA-PIPE | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-TECH-CONV-01-P-CSA-01 | Activities row 250; Activity_Agents rows 75 | CSA-CONV | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CSA-INVLINK-01 | Activities row 128; Activity_Agents rows 104 | CSA-ARCH-2 | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-X-HEALTH-01-P-CSA-01 | Activities row 273; Activity_Agents rows 71 | CSA-HEALTH | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| WF-VALUE-TECH-01-P-CSA-01 | Activities row 256; Activity_Agents rows 96 | CSA-VALUE-2 | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CSAM-HEALTH-P01 | Activities row 139; Activity_Agents rows 211-212 | CSAM-HEALTH | AGT-011 Primary #1; AGT-008 Secondary #2; AGT-001 Secondary #3 | AGT-008 Primary #1; AGT-001 Secondary #3 | App has extra agent(s) |
| CSAM-VALUE-P02 | Activities row 162; Activity_Agents rows 248 | CSAM-VALUE | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CSAM-RENEW-P02 | Activities row 153; Activity_Agents rows 251 | CSAM-RENEW | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CSAM-ESCALATE-P02 | Activities row 132; Activity_Agents rows 255 | CSAM-ESCALATE | AGT-003 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| CSAM-ESCALATE-ALT01 | Activities row 129; Activity_Agents rows 256 | CSAM-ESCALATE | AGT-012 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| DAE-SIGNAL-01 | Activities row 371; Activity_Agents rows 562 | DAE-SIGNAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-013 Primary #1 | Different agents |
| DAE-SIGNAL-02 | Activities row 372; Activity_Agents rows 563 | DAE-SIGNAL | AGT-001 Primary #1; AGT-006 Primary #2 | AGT-013 Primary #1 | Different agents |
| DAE-SIGNAL-03 | Activities row 373; Activity_Agents rows 564 | DAE-SIGNAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| DAE-TERR-01 | Activities row 368; Activity_Agents rows 559 | DAE-TERRITORY | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-001 Primary #1 | App has extra agent(s) |
| DAE-TERR-03 | Activities row 369; Activity_Agents rows 560 | DAE-TERRITORY | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-003 Primary #1 | Different agents |
| DAE-CONV-01 | Activities row 374; Activity_Agents rows 565 | DAE-CONV | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-001 Primary #1 | App has extra agent(s) |
| DAE-CONV-03 | Activities row 375; Activity_Agents rows 566 | DAE-CONV | AGT-001 Primary #1; AGT-009 Primary #2 | AGT-009 Primary #1 | App has extra agent(s) |
| DAE-CONV-04 | Activities row 376; Activity_Agents rows 567 | DAE-CONV | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| DAE-RENEW-01 | Activities row 377; Activity_Agents rows 574 | DAE-RENEW | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| DAE-RENEW-04 | Activities row 378; Activity_Agents rows 575 | DAE-RENEW | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| SMEC-CE-RENEW-01 | Activities row 389; Activity_Agents rows 598 | SMEC-CE-RENEW | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| SMEC-CE-RENEW-03 | Activities row 390; Activity_Agents rows 599 | SMEC-CE-RENEW | AGT-001 Primary #1 | AGT-003 Primary #1 | Different agents |
| SMEC-CE-DEAL-01 | Activities row 380; Activity_Agents rows 583 | SMEC-CE-DEAL | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-016 Primary #1 | Different agents |
| SMEC-CE-DEAL-02 | Activities row 381; Activity_Agents rows 584 | SMEC-CE-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| SMEC-CE-DEAL-03 | Activities row 382; Activity_Agents rows 585 | SMEC-CE-DEAL | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| DSS-SIGNAL-03 | Activities row 346; Activity_Agents rows 603 | DSS-SIGNAL | AGT-001 Primary #1; AGT-009 Primary #2 | AGT-003 Primary #1 | Different agents |
| DSS-CONV-01 | Activities row 350; Activity_Agents rows 607 | DSS-CONV | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-001 Primary #1 | App has extra agent(s) |
| DSS-VALUE-01 | Activities row 362; Activity_Agents rows 619 | DSS-VALUE | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-003 Primary #1 | Different agents |
| DSS-VALUE-02 | Activities row 367; Activity_Agents rows 624 | DSS-VALUE | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| DSS-VALUE-03 | Activities row 363; Activity_Agents rows 620 | DSS-VALUE | AGT-001 Primary #1; AGT-013 Primary #2 | AGT-004 Primary #1 | Different agents |
| ALL-DEAL-01 | Activities row 49; Activity_Agents rows 244 | ALL-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| ALL-DEAL-02 | Activities row 50; Activity_Agents rows 245 | ALL-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| ALL-DEAL-03 | Activities row 51; Activity_Agents rows 246 | ALL-DEAL | AGT-001 Primary #1 | AGT-016 Primary #1 | Different agents |
| PSS-PARTNER-01 | Activities row 425; Activity_Agents rows 673 | PSS-PARTNER | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| PSS-PARTNER-02 | Activities row 426; Activity_Agents rows 674 | PSS-PARTNER | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| DCSA-CONSUME-01 | Activities row 407; Activity_Agents rows 649 | DCSA-CONSUME | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-007 Primary #1 | Different agents |
| DCSA-CONSUME-02 | Activities row 408; Activity_Agents rows 650 | DCSA-CONSUME | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-004 Primary #1 | App has extra agent(s) |
| DCSA-CONSUME-03 | Activities row 409; Activity_Agents rows 651 | DCSA-CONSUME | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| DSE-ARCH-01 | Activities row 395; Activity_Agents rows 628 | DSE-ARCH | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-006 Primary #1 | Different agents |
| DSE-ARCH-02 | Activities row 396; Activity_Agents rows 629 | DSE-ARCH | AGT-001 Primary #1; AGT-004 Primary #2 | AGT-003 Primary #1 | Different agents |
| PSS-JP-01 | Activities row 419; Activity_Agents rows 667 | PSS-JOINTPLAN | AGT-001 Primary #1 | AGT-014 Primary #1 | Different agents |
| PSS-JP-02 | Activities row 420; Activity_Agents rows 668 | PSS-JOINTPLAN | AGT-001 Primary #1 | AGT-004 Primary #1 | Different agents |
| DSE-DISC-02 | Activities row 393; Activity_Agents rows 626 | DSE-DISC | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| DSE-DISC-03 | Activities row 394; Activity_Agents rows 627 | DSE-DISC | AGT-013 Primary #1 | AGT-003 Primary #1 | Different agents |
| DSE-PROOF-01 | Activities row 398; Activity_Agents rows 631 | DSE-PROOF | AGT-013 Primary #1 | AGT-006 Primary #1 | Different agents |
| DSE-PROOF-02 | Activities row 399; Activity_Agents rows 632 | DSE-PROOF | AGT-013 Primary #1 | AGT-003 Primary #1 | Different agents |
| DSE-PROOF-03 | Activities row 400; Activity_Agents rows 633 | DSE-PROOF | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| DCSA-PART-01 | Activities row 410; Activity_Agents rows 655 | DCSA-PARTNER | AGT-013 Primary #1 | AGT-004 Primary #1 | Different agents |
| DCSA-PART-03 | Activities row 412; Activity_Agents rows 657 | DCSA-PARTNER | AGT-013 Primary #1 | AGT-005 Primary #1 | Different agents |
| DCSA-VALUE-01 | Activities row 413; Activity_Agents rows 661 | DCSA-VALUE | AGT-013 Primary #1 | AGT-004 Primary #1 | Different agents |
| DCSA-VALUE-02 | Activities row 414; Activity_Agents rows 662 | DCSA-VALUE | AGT-013 Primary #1 | AGT-003 Primary #1 | Different agents |
| DCSA-VALUE-03 | Activities row 415; Activity_Agents rows 663 | DCSA-VALUE | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| PSS-DEM-01 | Activities row 422; Activity_Agents rows 670 | PSS-DEMAND | AGT-006 Primary #1 | AGT-004 Primary #1 | Different agents |
| PSS-DEM-02 | Activities row 423; Activity_Agents rows 671 | PSS-DEMAND | AGT-013 Primary #1 | AGT-006 Primary #1 | Different agents |
| PSS-DEM-03 | Activities row 424; Activity_Agents rows 672 | PSS-DEMAND | AGT-013 Primary #1 | AGT-003 Primary #1 | Different agents |
| SMEC-CE-POL-01 | Activities row 383; Activity_Agents rows 586 | SMEC-CE-POLICY | AGT-013 Primary #1 | AGT-006 Primary #1 | Different agents |
| SMEC-CE-POL-02 | Activities row 384; Activity_Agents rows 587 | SMEC-CE-POLICY | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| SMEC-CE-NEG-01 | Activities row 386; Activity_Agents rows 589 | SMEC-CE-NEG | AGT-013 Primary #1 | AGT-004 Primary #1 | Different agents |
| SMEC-CE-NEG-02 | Activities row 387; Activity_Agents rows 590 | SMEC-CE-NEG | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| DCSA-EXPAND-01 | Activities row 416; Activity_Agents rows 664 | DCSA-EXPAND | AGT-013 Primary #1 | AGT-008 Primary #1 | Different agents |
| DCSA-EXPAND-03 | Activities row 418; Activity_Agents rows 666 | DCSA-EXPAND | AGT-004 Primary #1 | AGT-001 Primary #1 | Different agents |
| DSE-ASSET-02 | Activities row 402; Activity_Agents rows 641 | DSE-ASSET | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |
| DSE-PARTNER-01 | Activities row 404; Activity_Agents rows 643 | DSE-PARTNER | AGT-013 Primary #1 | AGT-001 Primary #1 | Different agents |
| DSS-COMP-03 | Activities row 352; Activity_Agents rows 609 | DSS-COMP | AGT-004 Primary #1 | AGT-009 Primary #1 | Different agents |
| PSS-CAP-01 | Activities row 428; Activity_Agents rows 679 | PSS-CAPACITY | AGT-013 Primary #1 | AGT-014 Primary #1 | Different agents |
| PSS-CAP-02 | Activities row 429; Activity_Agents rows 680 | PSS-CAPACITY | AGT-009 Primary #1 | AGT-004 Primary #1 | Different agents |
| PSS-CAP-04 | Activities row 430; Activity_Agents rows 681 | PSS-CAPACITY | AGT-004 Primary #1 | AGT-003 Primary #1 | Different agents |


## Appendix G. Role-to-topic mappings that point to older placement ids (31)

| Role | Topic | Placement used |
|---|---|---|
| ae-ent | WF-X-PARTNER-01 | DAE-PARTNER |
| ats-ent | WF-X-PARTNER-01 | DAE-PARTNER |
| ssp-ent | WF-X-PARTNER-01 | DAE-PARTNER |
| se-ent | WF-X-PARTNER-01 | DAE-PARTNER |
| ce-ent | WF-X-PARTNER-01 | DAE-PARTNER |
| csa-ces | WF-X-PARTNER-01 | DAE-PARTNER |
| csam-ces | WF-X-PARTNER-01 | DAE-PARTNER |
| sm-mgr | WF-X-PARTNER-01 | DAE-PARTNER |
| dae-smec | WF-X-HEALTH-01 | DAE-HEALTH |
| dae-smec | WF-X-DEAL-01 | DAE-DEAL |
| dae-smec | WF-X-PARTNER-01 | DAE-PARTNER |
| ce-smec | WF-X-HEALTH-01 | SMEC-CE-HEALTH |
| ce-smec | WF-X-ORCH-01 | SMEC-CE-ORCH |
| ce-smec | WF-X-PARTNER-01 | DAE-PARTNER |
| dss-smec | WF-X-CONV-01 | DSS-CONV |
| dss-smec | WF-X-DEAL-01 | DSS-DEAL |
| dss-smec | WF-X-VALUE-01 | DSS-VALUE |
| dss-smec | WF-X-ORCH-01 | DSS-ORCH |
| dss-smec | WF-X-SIGNAL-01 | DSS-SIGNAL |
| dss-smec | WF-X-PARTNER-01 | DAE-PARTNER |
| dss-smec | WF-X-TERRITORY-01 | DSS-TERRITORY |
| dse-smec | WF-X-CONV-01 | DSE-CONV |
| dse-smec | WF-X-HEALTH-01 | DSE-HEALTH |
| dse-smec | WF-X-PARTNER-01 | DAE-PARTNER |
| dcsa-smec | WF-X-CONV-01 | DCSA-CONV |
| dcsa-smec | WF-X-ARCH-01 | DCSA-ARCH |
| dcsa-smec | WF-X-HEALTH-01 | DCSA-HEALTH |
| pss-smec | WF-X-CONV-01 | PSS-CONV |
| pss-smec | WF-X-VALUE-01 | PSS-VALUE |
| pss-smec | WF-X-ORCH-01 | PSS-ORCH |
| ROLE-ALL | WF-X-PARTNER-01 | DAE-PARTNER |


## Appendix H. Activity differences

Shared activities: 993. Application only: 86. Excel only: 65. Different text: 11. Different order: 10.

### H1. Activities only in the application

| ActivityID | Application placement | Where |
|---|---|---|
| DAE-CONV-02 | DAE-CONV | in a placement that exists in both |
| DAE-DEAL-01 | DAE-DEAL | in an app-only (old) placement |
| DAE-DEAL-02 | DAE-DEAL | in an app-only (old) placement |
| DAE-DEAL-03 | DAE-DEAL | in an app-only (old) placement |
| DAE-DEAL-04 | DAE-DEAL | in an app-only (old) placement |
| DAE-HEALTH-01 | DAE-HEALTH | in an app-only (old) placement |
| DAE-HEALTH-02 | DAE-HEALTH | in an app-only (old) placement |
| DAE-HEALTH-03 | DAE-HEALTH | in an app-only (old) placement |
| DAE-HEALTH-04 | DAE-HEALTH | in an app-only (old) placement |
| DAE-HEALTH-05 | DAE-HEALTH | in an app-only (old) placement |
| DAE-PARTNER-01 | DAE-PARTNER | in an app-only (old) placement |
| DAE-PARTNER-02 | DAE-PARTNER | in an app-only (old) placement |
| DAE-PARTNER-03 | DAE-PARTNER | in an app-only (old) placement |
| DAE-PARTNER-ALT-01 | DAE-PARTNER | in an app-only (old) placement |
| DAE-RENEW-02 | DAE-RENEW | in a placement that exists in both |
| DAE-SIGNAL-ALT-01 | DAE-SIGNAL | in a placement that exists in both |
| DAE-SIGNAL-SCOUT-01 | DAE-SIGNAL | in a placement that exists in both |
| DAE-TERR-02 | DAE-TERRITORY | in a placement that exists in both |
| DAE-TERR-04 | DAE-TERRITORY | in a placement that exists in both |
| DCSA-ARCH-01 | DCSA-ARCH | in an app-only (old) placement |
| DCSA-ARCH-02 | DCSA-ARCH | in an app-only (old) placement |
| DCSA-ARCH-03 | DCSA-ARCH | in an app-only (old) placement |
| DCSA-CONSUME-ALT-01 | DCSA-CONSUME | in a placement that exists in both |
| DCSA-CONV-01 | DCSA-CONV | in an app-only (old) placement |
| DCSA-CONV-02 | DCSA-CONV | in an app-only (old) placement |
| DCSA-CONV-03 | DCSA-CONV | in an app-only (old) placement |
| DCSA-HEALTH-01 | DCSA-HEALTH | in an app-only (old) placement |
| DCSA-HEALTH-02 | DCSA-HEALTH | in an app-only (old) placement |
| DCSA-HEALTH-03 | DCSA-HEALTH | in an app-only (old) placement |
| DCSA-HEALTH-04 | DCSA-HEALTH | in an app-only (old) placement |
| DSE-ARCH-03 | DSE-ARCH | in a placement that exists in both |
| DSE-ARCH-ALT-01 | DSE-ARCH | in a placement that exists in both |
| DSE-CONV-01 | DSE-CONV | in an app-only (old) placement |
| DSE-CONV-02 | DSE-CONV | in an app-only (old) placement |
| DSE-CONV-03 | DSE-CONV | in an app-only (old) placement |
| DSE-HEALTH-01 | DSE-HEALTH | in an app-only (old) placement |
| DSE-HEALTH-02 | DSE-HEALTH | in an app-only (old) placement |
| DSE-HEALTH-03 | DSE-HEALTH | in an app-only (old) placement |
| DSS-COMP-01 | DSS-COMP | in an app-only (old) placement |
| DSS-COMP-02 | DSS-COMP | in an app-only (old) placement |
| DSS-COMP-04 | DSS-COMP | in an app-only (old) placement |
| DSS-CONV-02 | DSS-CONV | in an app-only (old) placement |
| DSS-CONV-03 | DSS-CONV | in an app-only (old) placement |
| DSS-DEAL-01 | DSS-DEAL | in an app-only (old) placement |
| DSS-DEAL-02 | DSS-DEAL | in an app-only (old) placement |
| DSS-DEAL-03 | DSS-DEAL | in an app-only (old) placement |
| DSS-ORCH-01 | DSS-ORCH | in an app-only (old) placement |
| DSS-ORCH-02 | DSS-ORCH | in an app-only (old) placement |
| DSS-ORCH-03 | DSS-ORCH | in an app-only (old) placement |
| DSS-SIGNAL-01 | DSS-SIGNAL | in an app-only (old) placement |
| DSS-SIGNAL-02 | DSS-SIGNAL | in an app-only (old) placement |
| DSS-SIGNAL-ALT-01 | DSS-SIGNAL | in an app-only (old) placement |
| DSS-SIGNAL-SCOUT-01 | DSS-SIGNAL | in an app-only (old) placement |
| DSS-TERR-01 | DSS-TERRITORY | in an app-only (old) placement |
| DSS-TERR-02 | DSS-TERRITORY | in an app-only (old) placement |
| DSS-TERR-03 | DSS-TERRITORY | in an app-only (old) placement |
| DSS-TERR-04 | DSS-TERRITORY | in an app-only (old) placement |
| PSS-CAP-03 | PSS-CAPACITY | in a placement that exists in both |
| PSS-CONV-01 | PSS-CONV | in an app-only (old) placement |
| PSS-CONV-02 | PSS-CONV | in an app-only (old) placement |
| PSS-CONV-03 | PSS-CONV | in an app-only (old) placement |
| PSS-JP-03 | PSS-JOINTPLAN | in a placement that exists in both |
| PSS-JP-04 | PSS-JOINTPLAN | in a placement that exists in both |
| PSS-ORCH-01 | PSS-ORCH | in an app-only (old) placement |
| PSS-ORCH-02 | PSS-ORCH | in an app-only (old) placement |
| PSS-ORCH-03 | PSS-ORCH | in an app-only (old) placement |
| PSS-PARTNER-03 | PSS-PARTNER | in a placement that exists in both |
| PSS-PARTNER-ALT-01 | PSS-PARTNER | in a placement that exists in both |
| PSS-VAL-01 | PSS-VALUE | in an app-only (old) placement |
| PSS-VAL-02 | PSS-VALUE | in an app-only (old) placement |
| PSS-VAL-03 | PSS-VALUE | in an app-only (old) placement |
| SMEC-CE-DEAL-04 | SMEC-CE-DEAL | in a placement that exists in both |
| SMEC-CE-DEAL2-01 | SMEC-CE-DEAL2 | in an app-only (old) placement |
| SMEC-CE-DEAL2-02 | SMEC-CE-DEAL2 | in an app-only (old) placement |
| SMEC-CE-DEAL2-03 | SMEC-CE-DEAL2 | in an app-only (old) placement |
| SMEC-CE-HEALTH-01 | SMEC-CE-HEALTH | in an app-only (old) placement |
| SMEC-CE-HEALTH-02 | SMEC-CE-HEALTH | in an app-only (old) placement |
| SMEC-CE-HEALTH-03 | SMEC-CE-HEALTH | in an app-only (old) placement |
| SMEC-CE-HEALTH-04 | SMEC-CE-HEALTH | in an app-only (old) placement |
| SMEC-CE-HEALTH-05 | SMEC-CE-HEALTH | in an app-only (old) placement |
| SMEC-CE-ORCH-01 | SMEC-CE-ORCH | in an app-only (old) placement |
| SMEC-CE-ORCH-02 | SMEC-CE-ORCH | in an app-only (old) placement |
| SMEC-CE-ORCH-03 | SMEC-CE-ORCH | in an app-only (old) placement |
| SMEC-CE-POL-03 | SMEC-CE-POLICY | in a placement that exists in both |
| SMEC-CE-RENEW-02 | SMEC-CE-RENEW | in a placement that exists in both |
| SMEC-CE-RENEW-04 | SMEC-CE-RENEW | in a placement that exists in both |


### H2. Activities only in the workbook

| ActivityID | Excel row | Excel placement |
|---|---|---|
| DAE-V16-COSELL-01 | Activities row 847 | PLC-SMEC-DAE-W05 |
| DAE-V16-COSELL-02 | Activities row 848 | PLC-SMEC-DAE-W05 |
| DAE-V16-COSELL-03 | Activities row 849 | PLC-SMEC-DAE-W05 |
| DAE-V16-COVER-03 | Activities row 370 | PLC-SMEC-DAE-W02 |
| DAE-V16-PORTFOLIO-01 | Activities row 853 | PLC-SMEC-DAE-W08 |
| DAE-V16-PORTFOLIO-02 | Activities row 854 | PLC-SMEC-DAE-W08 |
| DAE-V16-PORTFOLIO-03 | Activities row 855 | PLC-SMEC-DAE-W08 |
| DAE-V16-ROUTE-01 | Activities row 850 | PLC-SMEC-DAE-W06 |
| DAE-V16-ROUTE-02 | Activities row 851 | PLC-SMEC-DAE-W06 |
| DAE-V16-ROUTE-03 | Activities row 852 | PLC-SMEC-DAE-W06 |
| DAE-V16-ROUTE-04 | Activities row 889 | PLC-SMEC-DAE-W06 |
| DCSA-V16-INTAKE-01 | Activities row 871 | PLC-SMEC-DCSA-W02 |
| DCSA-V16-INTAKE-02 | Activities row 872 | PLC-SMEC-DCSA-W02 |
| DCSA-V16-INTAKE-03 | Activities row 873 | PLC-SMEC-DCSA-W02 |
| DCSA-V16-INTERVENE-01 | Activities row 877 | PLC-SMEC-DCSA-W06 |
| DCSA-V16-INTERVENE-02 | Activities row 878 | PLC-SMEC-DCSA-W06 |
| DCSA-V16-INTERVENE-03 | Activities row 879 | PLC-SMEC-DCSA-W06 |
| DCSA-V16-MILESTONE-01 | Activities row 874 | PLC-SMEC-DCSA-W04 |
| DCSA-V16-MILESTONE-02 | Activities row 875 | PLC-SMEC-DCSA-W04 |
| DCSA-V16-MILESTONE-03 | Activities row 876 | PLC-SMEC-DCSA-W04 |
| DSE-V16-ARCH-03 | Activities row 397 | PLC-SMEC-DSE-W03 |
| DSE-V16-DECISION-01 | Activities row 865 | PLC-SMEC-DSE-W05 |
| DSE-V16-DECISION-02 | Activities row 866 | PLC-SMEC-DSE-W05 |
| DSE-V16-DECISION-03 | Activities row 867 | PLC-SMEC-DSE-W05 |
| DSE-V16-HANDOFF-01 | Activities row 868 | PLC-SMEC-DSE-W06 |
| DSE-V16-HANDOFF-02 | Activities row 869 | PLC-SMEC-DSE-W06 |
| DSE-V16-HANDOFF-03 | Activities row 870 | PLC-SMEC-DSE-W06 |
| DSS-V16-ACTIVATE-01 | Activities row 361 | PLC-SMEC-DSS-W07 |
| DSS-V16-CONVERT-01 | Activities row 353 | PLC-SMEC-DSS-W05 |
| DSS-V16-CONVERT-02 | Activities row 354 | PLC-SMEC-DSS-W05 |
| DSS-V16-CONVERT-03 | Activities row 355 | PLC-SMEC-DSS-W05 |
| DSS-V16-CONVERT-04 | Activities row 356 | PLC-SMEC-DSS-W05 |
| DSS-V16-DEMAND-01 | Activities row 344 | PLC-SMEC-DSS-W02 |
| DSS-V16-DEMAND-02 | Activities row 345 | PLC-SMEC-DSS-W02 |
| DSS-V16-EXPAND-01 | Activities row 364 | PLC-SMEC-DSS-W08 |
| DSS-V16-EXPAND-02 | Activities row 365 | PLC-SMEC-DSS-W08 |
| DSS-V16-EXPAND-03 | Activities row 366 | PLC-SMEC-DSS-W08 |
| DSS-V16-PIPELINE-01 | Activities row 347 | PLC-SMEC-DSS-W03 |
| DSS-V16-PIPELINE-02 | Activities row 348 | PLC-SMEC-DSS-W03 |
| DSS-V16-PIPELINE-03 | Activities row 349 | PLC-SMEC-DSS-W03 |
| DSS-V16-ROUTE-01 | Activities row 357 | PLC-SMEC-DSS-W06 |
| DSS-V16-ROUTE-02 | Activities row 358 | PLC-SMEC-DSS-W06 |
| DSS-V16-ROUTE-03 | Activities row 359 | PLC-SMEC-DSS-W06 |
| DSS-V16-ROUTE-04 | Activities row 360 | PLC-SMEC-DSS-W06 |
| DSS-V16-STRATEGY-02 | Activities row 351 | PLC-SMEC-DSS-W04 |
| PSS-V16-CLINIC-01 | Activities row 880 | PLC-SMEC-PSS-W05 |
| PSS-V16-CLINIC-02 | Activities row 881 | PLC-SMEC-PSS-W05 |
| PSS-V16-CLINIC-03 | Activities row 882 | PLC-SMEC-PSS-W05 |
| PSS-V16-HANDOFF-01 | Activities row 883 | PLC-SMEC-PSS-W07 |
| PSS-V16-HANDOFF-02 | Activities row 884 | PLC-SMEC-PSS-W07 |
| PSS-V16-HANDOFF-03 | Activities row 885 | PLC-SMEC-PSS-W07 |
| PSS-V16-PIPE-03 | Activities row 427 | PLC-SMEC-PSS-W04 |
| PSS-V16-PLAN-03 | Activities row 421 | PLC-SMEC-PSS-W02 |
| PSS-V16-REVIEW-01 | Activities row 886 | PLC-SMEC-PSS-W08 |
| PSS-V16-REVIEW-02 | Activities row 887 | PLC-SMEC-PSS-W08 |
| PSS-V16-REVIEW-03 | Activities row 888 | PLC-SMEC-PSS-W08 |
| SMEC-CE-V16-APPROVAL-01 | Activities row 859 | PLC-SMEC-SMEC-CE-W06 |
| SMEC-CE-V16-APPROVAL-02 | Activities row 860 | PLC-SMEC-SMEC-CE-W06 |
| SMEC-CE-V16-APPROVAL-03 | Activities row 861 | PLC-SMEC-SMEC-CE-W06 |
| SMEC-CE-V16-ENGAGE-01 | Activities row 856 | PLC-SMEC-SMEC-CE-W02 |
| SMEC-CE-V16-ENGAGE-02 | Activities row 857 | PLC-SMEC-SMEC-CE-W02 |
| SMEC-CE-V16-ENGAGE-03 | Activities row 858 | PLC-SMEC-SMEC-CE-W02 |
| SMEC-CE-V16-HANDOFF-01 | Activities row 862 | PLC-SMEC-SMEC-CE-W07 |
| SMEC-CE-V16-HANDOFF-02 | Activities row 863 | PLC-SMEC-SMEC-CE-W07 |
| SMEC-CE-V16-HANDOFF-03 | Activities row 864 | PLC-SMEC-SMEC-CE-W07 |


### H3. Shared activities with different text or order

| ActivityID | Activities row | Difference |
|---|---|---|
| SMEC-CE-RENEW-01 | Activities row 389 | different text (name, prompt, practice tier or expected output) |
| SMEC-CE-RENEW-03 | Activities row 390 | different text (name, prompt, practice tier or expected output) |
| SMEC-CE-RENEW-05 | Activities row 391 | different text (name, prompt, practice tier or expected output) |
| DSS-SIGNAL-03 | Activities row 346 | different text (name, prompt, practice tier or expected output) |
| DSS-CONV-01 | Activities row 350 | different text (name, prompt, practice tier or expected output) |
| DSS-VALUE-01 | Activities row 362 | different text (name, prompt, practice tier or expected output) |
| DSS-VALUE-02 | Activities row 367 | different text (name, prompt, practice tier or expected output) |
| DSS-VALUE-03 | Activities row 363 | different text (name, prompt, practice tier or expected output) |
| PSS-PARTNER-01 | Activities row 425 | different text (name, prompt, practice tier or expected output) |
| PSS-PARTNER-02 | Activities row 426 | different text (name, prompt, practice tier or expected output) |
| DSS-COMP-03 | Activities row 352 | different text (name, prompt, practice tier or expected output) |
| DAE-TERR-03 | Activities row 369 | different order (application 3, Excel 2) |
| DAE-CONV-03 | Activities row 375 | different order (application 3, Excel 2) |
| DAE-CONV-04 | Activities row 376 | different order (application 4, Excel 3) |
| DAE-RENEW-04 | Activities row 378 | different order (application 4, Excel 2) |
| SMEC-CE-RENEW-03 | Activities row 390 | different order (application 3, Excel 2) |
| SMEC-CE-RENEW-05 | Activities row 391 | different order (application 5, Excel 3) |
| DSS-VALUE-01 | Activities row 362 | different order (application 1, Excel 2) |
| DSS-VALUE-02 | Activities row 367 | different order (application 2, Excel 4) |
| SMEC-CE-POL-04 | Activities row 385 | different order (application 4, Excel 3) |
| PSS-CAP-04 | Activities row 430 | different order (application 4, Excel 3) |


## Appendix I. Resource link differences

### I1. Topic links in Topic_Resources that the application lacks (18)

| Excel topic | ResourceID | Topic_Resources row | Resources row | Application placements affected |
|---|---|---|---|---|
| WF-CONV | RES-001 | 6 | 3 | 1 |
| WF-CONV | RES-003 | 7 | 5 | 1 |
| WF-CONV | RES-EPS-SOURCE-01 | 8 | 53 | 19 |
| WF-DEAL | RES-EPS-SOURCE-01 | 12 | 53 | 18 |
| WF-HANDOFF | RES-EPS-SOURCE-01 | 13 | 53 | 7 |
| WF-HEALTH | RES-001 | 14 | 3 | 1 |
| WF-HEALTH | RES-EPS-SOURCE-01 | 15 | 53 | 19 |
| WF-IMPROVE | RES-MS-FRONTIER-PLAYBOOK-01 | 17 | 61 | 1 |
| WF-INVEST | RES-EPS-SOURCE-01 | 18 | 53 | 14 |
| WF-ORCH | RES-EPS-SOURCE-01 | 24 | 53 | 18 |
| WF-PIPE | RES-001 | 28 | 3 | 2 |
| WF-PLAN | RES-001 | 29 | 3 | 2 |
| WF-PLAN | RES-003 | 30 | 5 | 2 |
| WF-PLAN | RES-EPS-SOURCE-01 | 31 | 53 | 21 |
| WF-SOL | RES-001 | 36 | 3 | 3 |
| WF-SOL | RES-003 | 37 | 5 | 3 |
| WF-SOL | RES-EPS-SOURCE-01 | 38 | 53 | 22 |
| WF-VALUE | RES-EPS-SOURCE-01 | 41 | 53 | 18 |


### I2. Activities whose application resources differ from Activity_Resources (7)

| ActivityID | Application resources | Excel resources | Excel rows |
|---|---|---|---|
| AE-03-P02 | RES-SK-BRIEF | none | No Activity_Resources row |
| AE-01-P01 | RES-002, RES-007 | RES-007 | Activity_Resources row 2 |
| AE-01-P04 | RES-003 | none | No Activity_Resources row |
| AE-PIPE-SCOUT-01 | RES-SK-CHART | none | No Activity_Resources row |
| AE-OPP-SCOUT-01 | RES-SK-OUT, RES-SK-RADAR | RES-SK-OUT | Activity_Resources row 74 |
| SSP-COMP-SCOUT-01 | RES-SK-VOICE | none | No Activity_Resources row |
| CSAM-ESCALATE-ALT01 | RES-CSAM-HEALTH | none | No Activity_Resources row |


## Appendix J. Runtime data sources and integrity checks

| Check | Result |
|---|---|
| Files loaded when the app runs | static-api-data.json and commonRolePathWeeks.json. No other JSON file in the data folder is imported by runtime code (app-data.ts imports app-data.json, but nothing imports app-data.ts). |
| Roles endpoint | Module "huddle" (any letter case) returns the 29 Huddle roles. Any other or missing module returns the 8 Workflow roles. Read from the code; no screen was run. |
| Data used by Workflow | "reference": 8 roles, 14 AI tools, 9 buckets, 186 activities (Sales Manager has 20 of them). |
| Data used by Huddle | "huddle": 29 roles, 286 placements, 31 topic defaults, 22 agents, 10 focus areas, role paths and additional paths. |
| Placements | 286 catalog entries, 286 detail records, all used by a path; no path entry without a catalog entry. |
| Weekly paths | 28 roles have Weeks 1-9 once each. ROLE-ALL has none (the workbook defines none). sm-mgr has none and is not in the Huddle list. |
| Duplicates | None in role paths and none in the 1,079 activity ids. 7 role ids exist in both the Workflow and Huddle lists with identical records. |
| References | Every agent, focus area and role-to-topic placement reference resolves inside the application. The 31 mappings in DATA-006 resolve to older placement ids that the workbook does not use. |
| Unused reference entry | The Week 9 "coming soon" entry in commonRolePathWeeks.json is never offered because every role already has a Week 9 (R-05). It is not an application issue. |


## Appendix K. Limits of this review (unconfirmed)

- The application was not opened in a browser. No screen was checked.
- The SQL scripts were compared at the id level only. Column text, the weekly path table and the join tables were not compared in full.
- The workbook sheets Placement_MCEM, Variant_Definitions, Variant_Selectors, Variant_Overrides, Execution_Entities, Execution_Relationships, Activity_Execution_Migration and the Huddle in a Box sheets were not compared with the application.
- Topic matches for the 9 application topic ids with no ID_Crosswalk row are inferred through placements and are unconfirmed.
- Which screens read the placement records and which read the topic defaults (DATA-019) was not checked.
- Whether saved plans or other stored data use the sm-mgr role (DATA-008) was not checked.
- The evidence file named in the workbook for the Enterprise Sales Manager path (DATA-009) was not available.
- The backend was not reviewed, so whether it can filter roles by module is unconfirmed.
