# ProTrain End-to-End User Guide (v47)

Welcome to **ProTrain**, your all-in-one enterprise Training & Resource Planner. ProTrain is a standalone, single-file HTML web application engineered for high portability, extreme speed, and full offline operation. This comprehensive guide covers all system modules, workflows, scheduling rules, and advanced participant lifecycle features up to **Version 47**.

---

## 1. Getting Started & Navigation

ProTrain operates entirely client-side within any standard modern web browser (**Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, **Safari**). No background servers, database installations, or external network connections are required.

### The Sidebar Navigation
The left sidebar provides instant access to all core application modules:
- **📊 Dashboard:** Executive command center featuring live KPI counters, interactive Chart.js analytics, room utilisation summaries, and live training previews.
- **📅 Trainings:** Master schedule table to plan, edit, pause, and track formal training batches and operational tasks.
- **📈 Gantt View:** Visual timeline of all scheduled trainings, tasks, and resource allocations with interactive Day/Week/Month zoom levels and conflict overlays.
- **👨‍🏫 Trainers:** Register trainers, assign skill/expertise tags, and schedule annual leaves.
- **🏢 Rooms:** Manage physical training facilities, seating capacities, and room feature tags.
- **🏖️ Holidays:** Define organization-wide holidays that are automatically skipped during working day calculations.
- **📄 Reports:** Dedicated hub for exporting structured CSV availability matrices and planned schedules.
- **👥 Participants:** Global master roster across all training cohorts with multi-state status controls, inline certification dates, and attrition tracking.
- **💾 Database Backup / Restore:** Instant JSON database exports, imports, and auto-save recovery management.

### Admin Mode vs. View-Only Security
- **View-Only Mode:** General users can browse schedules, view Gantt timelines, search records, use the conversational voice assistant, and export CSV reports, but cannot modify records.
- **Admin Mode:** Click **Admin Login** in the sidebar and enter your PIN (Default: `0110`) to unlock full write, edit, delete, and bulk update capabilities.
- **Cryptographic Security:** Admin PIN authentication is verified via SHA-256 hashing, equipped with an offline JavaScript fallback for Microsoft Edge over the `file://` protocol.

---

## 2. Managing Resources (Trainers & Rooms)

Before scheduling trainings, set up your organization's physical and human resources.

### Trainers & Leave Management
1. Go to the **Trainers** tab and click **+ Add Trainer**.
2. Enter the Trainer's Name, Contact Number, Email, and **Expertise** (e.g., *Customer Service, Technical, Leadership, Compliance*). The Auto-Suggest engine uses expertise tags to recommend trainers automatically.
3. **Annual Leaves:** Edit any trainer profile to add vacation/leave date ranges. The scheduling engine hard-blocks these dates and flags any overlapping training sessions as conflicts.

### Rooms & Feature Tags
1. Go to the **Rooms** tab and click **+ Add Room**.
2. Enter the Room Name, Location, and maximum **Seating Capacity**. Capacity is actively monitored by the Dashboard to prevent overbooking.
3. **Room Feature Tags:** Tag rooms with capabilities (*PC Lab, Projector, Hybrid Video, Whiteboard*). When scheduling, required tags can be selected to filter recommendations automatically.

---

## 3. Scheduling Trainings, Tasks & Room-Only Bookings

### Adding a Formal Training Batch
1. Click **+ Add Training** from the **Trainings** tab.
2. Select the **Sub-Section / Department**, enter the **Training Name**, and pick the **Start Date** and **End Date**.
3. **Working Day Calculation:** The system automatically calculates duration in working days, skipping weekends and configured company holidays.
4. **Auto-Suggest (✨):** Click the Auto-Suggest button to let the engine cross-reference dates against trainer leaves, trainer schedules, and room availability to find the optimal match.
5. **Assign Resources:** Select the designated Trainer and Room.

### "Room Only" Ad-Hoc Booking (v45)
For non-training meetings, town halls, or room reservations:
1. In the Add/Edit Training modal, check **🏢 Room Only Booking**.
2. Trainer assignment becomes optional, and an optional **Booker / Person Name** field appears (e.g., *"Jane Smith (HR)"*).
3. **Conflict Rules:** Trainer conflict checks are bypassed if no trainer is assigned, while physical room conflict detection remains 100% active to prevent double-booking.
4. The main table displays styled `🏢 Room Only: [Person Name]` badges.

### Resource Tasks vs. Trainings
- **Trainings (`TR`):** Formal sessions with enrolled participants, assigned trainers, and designated rooms.
- **Tasks (`TA`):** Prep work, curriculum development, or administrative assignments. Add Tasks via the **+ Add Task** button. Tasks also respect trainer/room conflict checks.

### "On Hold" State Management (v41)
- Click the **⏸ Hold** icon button in the table row Actions column to place any training or task on hold.
- On-hold items display a purple `On Hold` badge and render on the Gantt timeline with a striped, dashed pattern.
- Assigned trainers and rooms remain safely reserved to prevent accidental scheduling.

---

## 4. Conflict Detection & Visual Highlighting

ProTrain bifurcates lifecycle status (`Upcoming`, `In Progress`, `Completed`) from double-booking alerts:

### Dedicated Conflict Column & Hover Popovers (v40 / v42)
- Conflicting rows display a prominent red **`[Conflict]`** badge.
- Clicking or hovering over the conflict badge displays a floating popover listing the exact overlap (e.g., *"Trainer John Doe is on Leave"* or *"Conference Hall A is already booked by Batch 3"*).

### Gantt Timeline Diagonal Conflict Stripes (v39)
- On the Gantt chart, conflicting date ranges on any bar display a high-contrast diagonal red striped overlay (`.gantt-conflict-overlay`).
- Activity names remain crystal-clear on top (`z-index: 2`).
- Hovering over a conflicting Gantt bar opens the instant conflict details popover.

---

## 5. Global Participant & Certification Management (v46)

ProTrain v46 introduces a comprehensive multi-state participant tracking system:

### Enrolling Participants into a Training
1. In the **Trainings** tab, click the **👤 [Count]** button on any training row to open the **Manage Participants** modal.
2. **CSV Roster Upload:** Click **Attach CSV** using the standard 15-column template (*No, Name, Department, Section, Title, Nationality, Gender, Emp No, DOJ, Agency, Cost Center, User ID, Contact No, Line Manager, Email*).
3. **Paste Raw Data:** If file uploads are restricted, paste tab-separated Excel cells directly into the "Paste Raw Data" area.
4. **Communication Hub:** Click 📧 (Outlook), 💬 (MS Teams), 📱 (WhatsApp), or 📅 (ICS Calendar Invite) to launch communication with participants.

### Global Master Roster (`Participants` Tab)
Navigate to the **Participants** tab to view all enrolled participants across all training batches:
- **1-Click Filter Chips:** Filter the roster instantly by `All`, `🟢 In Training - Active`, `🎓 Certified`, or `🔴 Inactive`.
- **Global Search & Sorting:** Instant live search across participant names, emp IDs, user IDs, departments, and training batch names.

### Multi-State Status Lifecycle & Inline Layout (v46)
In **Admin Mode**, use the inline status pill dropdown on each row:
1. **`🟢 In Training - Active`:** Default state for participants undergoing active training.
2. **`🎓 Certified`:** Selecting Certified opens the **Certification Modal** to set/confirm the **Certification Date** (`DD/MM/YYYY`, defaults to today). The date displays inline side-by-side on the same horizontal line (`Date: 28-08-2026`).
3. **`🔴 Inactive`:** Selecting Inactive opens the **Attrition Modal** requiring:
   - **Attrition Type:** `Terminated` or `Resigned`.
   - **Reason for Attrition:** Dropdown (*Behavior, Assessment Failure, Low Competency, Personal, Family, Better Offer, etc.*) with custom text support.
   - **Attrition Date:** Date picker formatted as `DD/MM/YYYY`.
   - Attrition summary is displayed inline beside the badge (`Resigned: Better Offer (28-08-2026)`).

### Bulk Status Updates
1. Select multiple rows using the checkboxes on the left.
2. Use the top toolbar **`Set Status ▾`** dropdown:
   - **Set: In Training - Active:** Bulk activates selected participants.
   - **Set: Certified (Set Date):** Opens bulk Certification Modal.
   - **Set: Inactive (Set Attrition):** Opens bulk Attrition Modal.
3. Click **Delete Selected** to bulk remove selected participants.

---

## 6. Executive BI & Reporting

### Interactive Dashboard Visual Analytics (v43 / v44)
- **Sub-Section Session Share (Doughnut Chart):** Visualizes training distribution across departments.
- **Monthly Training Load (Bar Chart):** Tracks monthly scheduled training hours.
- **Room Utilisation & Fill-Rate Summary:** Live progress bars displaying room occupancy percentages and seat fill rates (actual headcount vs. room capacity).
- **Data & Trainer Occupancy Summaries:** Embedded live preview tables showing trainer workdays and room allocation metrics.

### CSV Reports & Exports
- **Export Participant Roster:** Downloads a master CSV report including all 15 participant metadata columns, status, certification date, and attrition details.
- **Filtered Trainings Export:** Click **📥 Export (CSV)** in the Trainings tab to export only the rows currently matched by your active filters and search queries.
- **Reports Tab:** Export standard availability matrices for trainers and rooms over customizable date windows.

---

## 7. Intelligent Two-Way Voice Assistant (v47)

In the bottom-right corner of the application:
- Click the floating 💬 chat bubble to open the **ProTrain Voice Assistant**.
- **Voice Input (Speech-to-Text):** Click the 🎙️ mic button in the input bar or header to speak. An animated soundwave HUD indicates active listening, and speech is transcribed in real-time.
- **Natural Spoken Feedback (Text-to-Speech):** The assistant speaks out answers using high-quality browser neural voices.
- **Speaker Mute / Audio Toggle:** Click the 🔊 / 🔇 icon in the chat header to enable or silence spoken voice output.
- **Dock / Undock:** Click the **Undock** button in the chat header to drag and freely resize the assistant anywhere on your screen.

### Voice Commands & Action Cheat-Sheet:
| Voice Command | Action Executed | Spoken Feedback |
| :--- | :--- | :--- |
| 🗣️ *"Is Sarah free tomorrow?"* | Queries trainer schedule & leaves | 🔊 Verbal confirmation of availability & conflict details |
| 🗣️ *"Free rooms next Monday"* | Checks physical room bookings | 🔊 Verbal list of all vacant training facilities |
| 🗣️ *"Put Batch 2 on hold"* / *"Resume Batch 2"* | Sets `isOnHold` and updates timeline | 🔊 *"Batch 2 is now on hold."* |
| 🗣️ *"Export participant roster"* | Triggers CSV roster download | 🔊 *"Exporting master participant roster to CSV."* |
| 🗣️ *"Show all conflicts"* | Audits schedule & filters conflicting batches | 🔊 *"Found X active conflicts. Navigating to conflicting batches."* |
| 🗣️ *"Go to Gantt view / Show Participants"* | Navigates directly to requested tab | 🔊 *"Navigating to Gantt Timeline."* |

---

## 8. Data Persistence, Backup & Auto-Save

Because ProTrain is serverless, data is stored in your browser's **LocalStorage**. Follow these best practices to safeguard your data:

### Saving the Database (`Save DB`)
1. In the sidebar under **Database**, click **Save DB**.
2. The native OS "Save As" file explorer window opens (on supported browsers). Save your `.json` backup file securely to your drive or network share.

### Restoring the Database (`Load DB`)
1. Click **Load DB** in the sidebar.
2. Select your `.json` backup file. All trainings, tasks, trainers, rooms, holidays, and participant rosters will be restored immediately.

### Auto-Save Checkpoints (v35)
- ProTrain runs background auto-save snapshots every 30 minutes, keeping the 5 most recent recovery points in local storage.
- If unsaved changes exist for more than 30 minutes, a sticky top alert banner reminds you to create a backup file.

### Undo / Redo Audit Stack
- Use **Ctrl+Z** to undo recent actions and **Ctrl+Y** to redo.
- Click **Audit Log** in settings to inspect recent actions and roll back state changes.

---

**Author:** [navzar81-dev](https://github.com/navzar81-dev)  
**Repository:** [https://github.com/navzar81-dev/Pro-Train](https://github.com/navzar81-dev/Pro-Train)
