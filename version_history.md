# ProTrain Application Version History

This document tracks the major iterations, features, and enhancements implemented in the **Training Planner** application. By maintaining strict versioning, we ensure stability while rapidly prototyping new features.

---

## Version 39 (Current Latest)
**File:** `training_planner_39.html`
**Focus:** Gantt Conflict Overlap Visual Highlighting (Copied from V37)

- **Hashed Red Overlay on Conflict Days:** Overlapping conflict dates on Gantt bars (for **both Trainings and Tasks**) display a high-contrast diagonal red striped pattern (`.gantt-conflict-overlay`).
- **Resource Task Conflict Checking:** Added double-booking validation logic for Tasks (`checkTaskConflicts()`), flagging task overlaps with trainer leaves, trainings, or other tasks.
- **Non-Conflicting Days Intact:** Non-conflicting days on the same bar display the normal theme color.
- **Readable Activity Names:** Activity text labels are layered inside a `<span>` with `z-index: 2` (positioned relatively), rendering clearly on top of the background conflict overlays.
- **Granular Views:** Applied this styling to both the **Activities** view and the **Trainers/Rooms** Gantt chart views.
- **Hover Conflict Popover:** Hovering over any conflicting Gantt bar (training or task) displays a floating popover listing the exact scheduling conflict details, matching the Trainings tab behavior.
- **Task Date Alignment & Sub-Sections:** Replaced the Task Modal's numeric duration field with a fully synchronized "Start Date" and "To Date" (End Date) configuration mirroring the Training modal. Appended "Ad Hoc - Other Team" as a standard option in all sub-section dropdown selects.
- **Robust Working Day Calculations:** Fixed the scheduling calculation logic in `addWorkingDays` to correctly skip weekend/holiday starts when computing task or training end dates.
- **Gantt Cross-Tab Filtering & Search:** Added a search input box in the Gantt toolbar that filters trainers, rooms, and activities in real-time based on names, expertise, sub-sections, or assigned activities, including a dynamic clear ("✕") button.
- **Spacious Activities Layout:** Optimized row heights and labels to `52px` in the Gantt Activities view to provide comfortable spacing and prevent label overlap.

---

## Version 38
**File:** `training_planner_38.html`
**Focus:** CSV Template Alignment & Direct Grid-Based Scorecard Editing

- **Agent RAG Scorecard Grid:** Upgraded the global participants tab to display a 23-column scorecard layout including 9 proficiency metrics, Trainer Feedback, and dynamically computed R/A/G counts and percentages.
- **Dedicated Participant RAG Export:** Added a separate "Participant RAG" card in the Reports tab for exporting the 23-column Agent RAG scorecard as a dedicated CSV, preserving the standard roster report format separately.
- **Inline Scorecard Editing & Clean Popup Modal:** RAG parameters and feedback remarks are edited exclusively directly inline in the global Participants grid, while the details form popup modal displays only standard roster fields, matching Version 37's clean design.
- **Aligned 15-Column CSV Download & Dynamic Import:** Synchronized the download template in Training - Actions (Add Participants) to output exactly the 15 standard participant columns (removing redundant training metadata). The parser dynamically detects and maps these fields onto the database properties, rendering them under `No`, `Name`, `ACD` (blank), `User ID`, `Batch No` (mapped from Section), `LOB` (mapped from Department), and `Site` (mapped from Cost Center) alongside the RAG columns in the global Participants grid.
- **Hover Conflict Popover:** Hovering over any conflicting Gantt bar (training or task) displays a floating popover listing the exact scheduling conflict details, matching the Trainings tab behavior.
- **Task Date Alignment & Sub-Sections:** Replaced the Task Modal's numeric duration field with a fully synchronized "Start Date" and "To Date" (End Date) configuration mirroring the Training modal. Appended "Ad Hoc - Other Team" as a standard option in all sub-section dropdown selects.
- **Robust Working Day Calculations:** Fixed the scheduling calculation logic in `addWorkingDays` to correctly skip weekend/holiday starts when computing task or training end dates.
- **Gantt Cross-Tab Filtering & Search:** Added a search input box in the Gantt toolbar that filters trainers, rooms, and activities in real-time based on names, expertise, sub-sections, or assigned activities, including a dynamic clear ("✕") button.
- **Spacious Activities Layout:** Optimized row heights and labels to `52px` in the Gantt Activities view to provide comfortable spacing and prevent label overlap.

---

## Version 37
**File:** `training_planner_37.html`
**Focus:** Attrition Tracking & Edge Browser PIN Fallback

- **Attrition Dialogue Form Modal:** Intercepts status changes in the global Participants tab. When a participant is toggled to Inactive (or when Set Inactive is clicked in bulk), prompts the administrator with a modal to record:
  - Attrition Type (Radio buttons for Terminated or Resigned).
  - Reason for Attrition (Dropdown list of values: Terminated -> Behavior, Assessment Failure, Low Competency; Resigned -> Personal, Family, Better Offer, Further Education, or Other).
  - Custom Reason (Dynamic text box shown when "Other" is selected).
  - Date of Attrition (HTML date picker defaulted to today).
- **Inline Attrition Grid Rendering:** Renders recorded attrition details directly underneath the status switch inside the Participants tab layout for inactive rows, preventing horizontal table clutter.
- **Attrition Roster CSV Columns:** Appends "Attrition Type", "Attrition Reason", and "Attrition Date" columns to the end of the exported Master Participant Roster CSV, keeping the positions of all existing standard columns intact.
- **PIN Verification Web Crypto Fallback:** Integrates a pure-JavaScript SHA-256 fallback function for PIN checks when run offline or on Microsoft Edge over the `file://` protocol where the Web Crypto API is disabled in insecure contexts.
- **Aligned 15-Column CSV Download & Dynamic Import:** Synchronized the download template in Training - Actions (Add Participants) to output exactly the 15 standard participant columns, enabling seamless upload parsing while keeping active/inactive status and RAG reporting cleanly separate.
- **Hover Conflict Popover:** Hovering over any conflicting Gantt bar (training or task) displays a floating popover listing the exact scheduling conflict details, matching the Trainings tab behavior.
- **Task Date Alignment & Sub-Sections:** Replaced the Task Modal's numeric duration field with a fully synchronized "Start Date" and "To Date" (End Date) configuration mirroring the Training modal. Appended "Ad Hoc - Other Team" as a standard option in all sub-section dropdown selects.
- **Robust Working Day Calculations:** Fixed the scheduling calculation logic in `addWorkingDays` to correctly skip weekend/holiday starts when computing task or training end dates.
- **Gantt Cross-Tab Filtering & Search:** Added a search input box in the Gantt toolbar that filters trainers, rooms, and activities in real-time based on names, expertise, sub-sections, or assigned activities, including a dynamic clear ("✕") button.
- **Spacious Activities Layout:** Optimized row heights and labels to `52px` in the Gantt Activities view to provide comfortable spacing and prevent label overlap.

---

## Version 36
**Focus:** Power-BI-Grade Interactive BI Dashboard & Operational Metrics Splitting

- **Power BI Sidebar Filters Pane:** Redesigned the BI slicers layout into a sticky, scrollable sidebar Filters Pane featuring Handover Month, Partner, Location, and Line of Business (LOB) filters with a single-click "Clear All" action.
- **Closed vs. Active Operational KPI Splitting & Formatting:** Separated analytics metrics calculations based on batch closure status. Calculates absolute finalized performance KPIs (Total Headcount, Average Certification %, Average Throughput (TPUT), and Average First Pass %) exclusively for "Closed" batches. Active/in-flight cohorts (e.g. Training, Evolve, In Progress) are computed separately and reported as running operational numbers. All First Pass metrics, including the KPI card, pivot table columns, and charts, are formatted as percentages (converting fractional decimals or headcount ratios automatically).
- **Chart.js Visualizations:** Integrated the interactive Chart.js plotting library to display high-fidelity canvas charts (Vertical Bar for Certifications, Doughnut for Headcount Share, Horizontal Bar for TPUT, and Line Area for First Time Pass rates). Includes cross-filter triggers (clicking a chart element automatically slices all other charts by that selected location or partner).
- **Conditional Pivot Table Heatmapping:** Color-codes pivot table metrics (Avg First Pass %, Avg Certification, and Avg Throughput) dynamically using conditional formatting (green for high performance >=90%, orange for warning ranges 80-89%, and red for critical alerts <80%) alongside a dedicated Running Operations column.
- **LocalStorage BI Dataset Persistence:** Saves uploaded spreadsheets locally, automatically restoring the dashboard view on system load.
- **Filtered CSV & Excel Export Tabs:** Added tab-styled CSV Export and Excel Export buttons directly above the Pivot Table. Generates formatted outputs containing exactly the sliced data rows visible under current slicer configurations, naming files dynamically based on active filter values (e.g. `BI_Pivot_Table_ISON_Sharjah.xlsx`).

---

## Version 35
**File:** `training_planner_35.html`
**Focus:** Visual Timeline Scaling, Advanced Audit Log, Resource Tagging, & Auto-Save Recovery

- **Gantt Zoom & Timeline Slicers:** Replaced the static Gantt layout with interactive zoom levels ("Day", "Week", "Month") and a custom Date Range filter. Dynamically scales cell width, day labels, leave periods, and weekday grids while preventing label overlapping.
- **Interactive Action History (Undo/Redo Visualizer):** Implemented a complete double-stack history model (`historyStack` and `redoStack`) with Ctrl+Z / Ctrl+Y keyboard shortcuts. Added a visual audit log modal permitting administrators to inspect recent actions and rollback the system state.
- **Participant Cohort Presets:** Added the ability to define reusable participant groups (Cohorts). Administrators can manage cohorts, import rosters in bulk, and instantly enroll whole cohorts into individual training courses in one click.
- **Room Feature Tags & Auto-Suggest Filtering:** Enabled assigning feature tags (PC Lab, Projector, Hybrid Device, Whiteboard, Video Conf) to rooms. The scheduler modal allows setting required room features, and the Auto-Suggest engine filters recommendations based on feature compatibility.
- **Customizable Comms Templates:** Added a templates editor modal in Settings, letting administrators customize default text templates for Emails, MS Teams notifications, and Calendar invitations using placeholders like `{training_name}`, `{start_date}`, `{trainer_name}`, etc.
- **Local Database Auto-Save Checkpoints:** Added background timers that perform auto-save snapshots to LocalStorage every 30 minutes (retaining the 5 most recent checkpoints) and enforce a daily baseline checkpoint. Implemented a Recovery & Restore manager to roll back the database, and a sticky header warning banner that triggers if changes have been unsaved for more than 30 minutes.
- **Business Intelligence Dashboard:** Integrated the comprehensive BI analytics screen into the primary application views with cross-filter capabilities.

---

## Version 34
**File:** `training_planner_34.html`
**Focus:** Comprehensive Data Modeling & Participant Management

- **Enhanced Participant Data Model:** Upgraded the underlying JSON database schema and CSV upload parsers to support 15 detailed data points per participant (DOJ, User ID, Contact No, Section, Line Manager, etc.) instead of just 4.
- **Global Participants Tab:** Added a dedicated "Participants" view to the main navigation sidebar, providing a master roster of all participants across every training session.
- **Participant Bulk Actions:** Implemented a mass-selection checkbox UI in the global Participants tab, allowing Admins to instantly "Set Active", "Set Inactive", or "Delete Selected" in bulk across multiple trainings simultaneously.
- **iOS-Style UI Switches:** Replaced clunky status buttons with sleek, animated iOS-style CSS toggle switches for instantaneous Active/Inactive participant state changes.
- **Communication Shortcuts:** Added quick-action icons (Teams, Outlook, WhatsApp, SMS) to individual participant rows inside the Manage Participants modal. These dynamically hook into the participant's Contact No and User ID/Email to instantly launch communication apps.
- **Raw Data Paste Integration:** Added a fallback "Paste Raw Data" text area inside the Manage Participants modal, allowing users to copy-paste tab-separated (Excel) or comma-separated raw data directly into the system if CSV file uploads are blocked.
- **Date Formatting Standardization:** Enforced a strict `dd-mm-yyyy` date formatting standard across the entire application interface, including training modals, reports, and input fields.
- **Massive Participant Roster Export:** The Global "Export Participant Roster" function now generates a comprehensive 21-column CSV report, merging all 15 participant data points with 6 critical system-level training tags.

---

## Version 33
**File:** `training_planner_33.html`
**Focus:** Data Exporting & Advanced Filtering

- **"Save As" Database Backup:** Upgraded the "Save DB" function to trigger the native operating system "Save As" file explorer dialog via the File System Access API (on supported browsers), allowing users to pick their save destination and dynamically rename the backup file. It maintains a graceful fallback to direct downloads on unsupported browsers.
- **Filtered CSV Export:** Added an "📥 Export (CSV)" button directly in the Trainings tab toolbar. This button acts dynamically, exporting only the records that are currently visible on-screen based on the active search and filter chips, providing an easy way to generate tailored mini-reports.
- **Status Filtering:** Introduced a new set of "Status" filter chips (All, Upcoming, In Progress, Completed, Conflict) to the Trainings tab, enabling users to instantly sort and view tasks/trainings based on their lifecycle phase.

---

## Version 32
**File:** `training_planner_32.html`
**Focus:** Productivity Tools, UI Refinements, & Bug Fixes

- **Multi-Select Bulk Delete:** Added multi-select checkboxes across Trainings, Tasks, Trainers, Rooms, and Holidays tables. Admins can select multiple rows and bulk delete them via a new "Delete Selected" button.
- **Advanced Task Planning:** Upgraded the "Add Task" modal to mirror the robust logic of the "Add Training" modal. Tasks now enforce Sub-Section categorisation, dynamically calculate working days (excluding weekends and holidays), and support optional Trainer/Room resource assignments.
- **Gantt Scroll Retention:** Fixed a usability issue where editing a task on the Gantt chart would reset the scroll to the beginning of the timeline. The timeline now preserves its scroll position after DOM re-renders.
- **Conflict Modal Scroll:** Added internal scrolling (`max-height`, `overflow-y`) to the large conflict pop-up window so action buttons don't fall off the screen.
- **Auto-Suggest & Batching Logic Fixes:** Fixed the Auto-Suggest and Batch Scheduler engines to correctly process and hard-block Trainer Annual Leaves. Additionally, fixed room auto-suggest to select the first available room instead of defaulting to the last.

---

## Version 31
**File:** `training_planner_31.html`
**Focus:** Conversational Assistant & Chat UI

- **Floating Chat Assistant:** Replaced the top header search bar with a modern, floating chat bubble in the bottom-right corner.
- **Message History:** Clicking the bubble opens a full chat window with a persistent message history, allowing users to scroll back through their previous queries and answers.
- **Dock & Undock:** The chat window can be "undocked" via a toggle button in its header, turning it into a free-floating widget that can be dragged anywhere on the screen.
- **Custom Resizing:** Built custom Vanilla JS resize handles allowing the window to be dragged and resized from the top, left, and top-left edges (in addition to the standard CSS bottom-right resize).
- **Conversational Parsing:** Ported the NLP engine into the chat interface so the system responds with conversational message bubbles.

---

## Version 30
**File:** `training_planner_30.html`
**Focus:** Natural Language AI Search & Global Navigation

- **Global Smart Search Box:** Added a persistent search bar in the top-right header that acts as a natural language intent parser.
- **Instant Answers:** Users can query the system conversationally (e.g., *"Is Sarah free tomorrow?"* or *"Free rooms on June 15"*). The parser detects dates, entities, and intent to provide instant availability answers.
- **Deep Linking:** Searching for a specific sub-section (e.g., *"Show CC Trainings"*) instantly redirects the user to the Trainings tab and applies the global filter automatically.
- **Record Lookup:** Searching for a specific training by name pulls up the record inside the search dropdown, allowing one-click access to edit its details or view its roster.

---

## Version 29
**File:** `training_planner_29.html`
**Focus:** Smart Scheduling & Automation

- **Auto-Suggest Engine:** Introduced a powerful, offline "✨ Auto-Suggest Trainer & Room" button inside the scheduling modal.
- **Smart Logic:** When scheduling a new training, the engine analyzes the selected dates and duration to calculate the exact working days required.
- **Availability Matrixing:** Cross-references the calculated dates against Trainer leave schedules, Trainer conflict schedules, and Room booking schedules.
- **Expertise Matching:** Scans the input "Training Name" against Trainer `Expertise` tags to intelligently recommend the best-fit trainer.
- **Capacity Matching:** Suggests the smallest available room that meets basic requirements to optimize space usage.
- **Null Safety:** Added robust error catching and null-reference safety checks to prevent crashes when processing incomplete data profiles.

---

## Version 28
**File:** `training_planner_28.html`
**Focus:** Participant Management & Analytics

- **Participant Roster System:** Added the ability to track individual participants (Name, Emp ID, Department, Email) for each scheduled training.
- **CSV Bulk Upload/Download:** Introduced a seamless CSV upload mechanism inside the Participant Modal, allowing bulk enrollment of 15+ participants at once without manual data entry.
- **Inline Editing:** Added a single-click "✕" delete button to easily remove individual drop-outs without having to clear the whole roster.
- **Capacity Alerts:** The dashboard "Upcoming Trainings" table now displays red/orange alerts if enrolled participants exceed the Room's maximum capacity.
- **Dashboard Integration:** 
  - Added a global **"Participants Enrolled"** top-level metric card.
  - The Sub-Section breakdown table now calculates and displays exact participant headcounts per department.
- **Roster Exporting:** Added a flat-file CSV export feature allowing administrators to download a master list of all participants across all trainings.

---

## Pre-Version 26 Architecture
**Focus:** Foundational Minimum Viable Product (MVP)

- **Single-Page Application:** Built entirely in a single `.html` file containing all CSS, HTML, and Vanilla JavaScript for ultimate portability and offline capability.
- **Core Entities:** Established CRUD (Create, Read, Update, Delete) modals for Trainings, Tasks, Trainers, Rooms, and Holidays.
- **Visual Design:** Implemented a modern, responsive UI using a clean sidebar layout, CSS Grid/Flexbox, and a professional color palette.
- **Conflict Engine:** Built the foundational algorithm that prevents users from accidentally double-booking a room or a trainer on the same date.
