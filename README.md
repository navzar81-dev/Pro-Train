# ProTrain

Pro Train is a comprehensive, highly portable training management solution packed into a single HTML container. It delivers full-scale training planning, batch plotting, and reporting capabilities designed for rapid, flexible deployment across enterprise environments.

## Core Features

* **Extreme Portability:** A single HTML file architecture allows you to ship, host, and run the tool anywhere instantly.
* **Enterprise Integration:** Connect seamlessly to your existing database, configure SSO, and publish directly within your own private cloud.
* **Built-in Security:** Equipped with essential sign-in protocols and baseline security features right out of the box.
* **SMART Planner:** Advanced scheduling capabilities designed to automate and optimize complex training timelines.

## Ideal Use Cases

* **High-Volume BPOs:** Purpose-built to meet the heavy operational demands of Indian BPOs and specialized training teams.
* **Ramp Management:** Streamlines the logistical overhead of managing large-scale hiring ramps and multiple, concurrent training batches.

---

## Table of Contents
- [Overview & Highlights](#overview--highlights)
- [Quick Start & Installation](#quick-start--installation)
- [System Architecture](#system-architecture)
- [Key Modules & Capabilities](#key-modules--capabilities)
- [Admin vs. View-Only Security](#admin-vs-view-only-security)
- [Participant Lifecycle & Certification Workflow](#participant-lifecycle--certification-workflow)
- [Version Control & Release History](#version-control--release-history)
- [Data Backup, Restore & Auto-Save](#data-backup-restore--auto-save)
- [Contributing & License](#contributing--license)

---

## Overview & Highlights

ProTrain eliminates the complexity and latency of traditional heavy enterprise training software by running entirely in the browser as a standalone single-page application. Whether deployed offline on secure air-gapped workstations or hosted over corporate intranets, ProTrain provides instant response times, zero server dependencies, and enterprise-grade scheduling logic.

### Highlights at a Glance
- ⚡ **Zero Installation:** No build tools, runtime servers, or database drivers required. Just open the HTML file.
- 📅 **Dynamic Gantt Timeline:** Interactive activity and resource-level views with zoom levels (Day / Week / Month), drag-and-drop support, and conflict overlays.
- 🛡️ **Intelligent Conflict Detection:** Instant detection and visual flagging of overlapping trainer assignments, room overbookings, and trainer annual leave overlaps.
- 🏢 **Room-Only Ad-Hoc Booking:** Book physical conference or training rooms without requiring trainer assignments, while preserving room availability rules.
- 👥 **End-to-End Participant & Attrition Management:** Global master roster with 15-field participant data schemas, inline status updates (`In Training - Active`, `Certified`, `Inactive`), certification date capture, and attrition tracking.
- 📊 **Executive BI & Analytics:** Integrated Chart.js visualizations, live capacity utilisation stats, seat fill-rate monitors, and multi-format CSV exports.

---

## Quick Start & Installation

Because ProTrain is built as an offline-first single-page application, getting started takes seconds:

### Option 1: Direct File Launch (Local / Offline)
1. Clone or download the repository:
   ```bash
   git clone https://github.com/navzar81-dev/Pro-Train.git
   cd Pro-Train
   ```
2. Double-click the latest version file (e.g. `training_planner_46.html`) or open it in any modern browser (**Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, or **Safari**).
3. The application will load immediately with all features accessible offline.

### Option 2: Static Web Server Hosting
You can host ProTrain on any static web server, CDN, internal SharePoint, AWS S3, GitHub Pages, NGINX, or IIS:

```bash
# Example using Python built-in HTTP server
python -m http.server 8080

# Example using Node.js http-server / serve
npx serve .
```
Navigate to `http://localhost:8080/training_planner_46.html` in your browser.

---

## System Architecture

ProTrain utilizes a high-performance, modular client-side architecture contained entirely within a single HTML file:

```
┌─────────────────────────────────────────────────────────────┐
│                       ProTrain UI                           │
├───────────────┬─────────────────────────────┬───────────────┤
│ Navigation    │ Dashboard, Trainings, Gantt │ Reports,      │
│ & Search      │ Trainers, Rooms, Holidays   │ Participants  │
├───────────────┴─────────────────────────────┴───────────────┤
│                      Core Engine Layer                      │
├─────────────────┬───────────────────────────┬───────────────┤
│ SMART Conflict  │ Auto-Suggest Matching &   │ Natural Lang  │
│ Engine          │ Working Days Calculator   │ Assistant     │
├─────────────────┴───────────────────────────┴───────────────┤
│                  Data Persistence & Security                │
├─────────────────┬───────────────────────────┬───────────────┤
│ LocalStorage DB │ Auto-Save Checkpoints &   │ SHA-256 Auth  │
│ & File Backups  │ Undo/Redo Action Stack    │ with Fallback │
└─────────────────┴───────────────────────────┴───────────────┘
```

### Key Technical Specs:
- **Core Technologies:** HTML5, CSS3 (Vanilla design tokens, CSS Grid, Flexbox, responsive layouts), Vanilla JavaScript (ES6+).
- **Visuals & Charts:** Embedded Chart.js for responsive doughnut charts, monthly workload bar charts, and operational KPIs.
- **Data Persistence:** LocalStorage database serialization with automatic recovery snapshots, JSON backup/restore, and File System Access API integration.
- **Security & Integrity:** SHA-256 PIN authentication with pure-JS fallback for offline Edge `file://` contexts.

---

## Key Modules & Capabilities

### 1. Executive Dashboard
- **Top KPI Cards:** Total Scheduled Trainings, Enrolled Participants, Active Trainers, and Available Training Rooms.
- **Interactive Visual Analytics:** 
  - Sub-Section Session Share (Doughnut Chart).
  - Monthly Training Load in total hours (Bar Chart).
- **Room Utilisation & Seat Fill-Rate Monitor:** Real-time calculation of room occupancy percentages and seat utilization against physical room capacity.
- **Live Summaries:** Upcoming training cohorts, resource tasks, and trainer matrix preview cards.

### 2. Trainings & Task Management
- **SMART Scheduling Modal:** Choose between formal training batches or operational resource tasks.
- **Working Days Calculation:** Automatically accounts for weekends and configured company holidays to compute accurate end dates.
- **Ad-Hoc Room-Only Support:** Option to reserve rooms for non-training events without trainer assignment.
- **"On Hold" State Management:** Dedicated toggle to pause trainings/tasks, styling them with striped timeline patterns while keeping resources safely reserved.
- **Decoupled Conflict System:** Date-based status (`Upcoming`, `In Progress`, `Completed`) is cleanly bifurcated from conflict alerts (`[Conflict]` badge with hover popover inspection).

### 3. Interactive Gantt Timeline
- **Multi-View Modes:** Switch between **Activities View** and **Trainers / Rooms Resource Allocation Views**.
- **Zoom Levels:** Slices timeline across **Day**, **Week**, and **Month** views with dynamic column scaling.
- **Diagonal Conflict Stripes:** Conflicting days display a high-contrast diagonal striped red overlay (`.gantt-conflict-overlay`), with activity labels clearly readable on top.
- **Search & Filter:** Real-time Gantt search bar to filter trainers, rooms, and batches with instant clearing.

### 4. Participant & Attrition Management
- **15-Field Master Roster:** Tracks Name, ACD, User ID, Batch No, Department/LOB, Site/Cost Center, Contact No, Email, DOJ, etc.
- **Dynamic Import / Raw Data Paste:** Upload 15-column standard CSV roster templates or copy-paste tab-separated raw data directly from Excel.
- **Communication Hub:** Instant one-click triggers for Outlook Email, MS Teams Chat, WhatsApp, and ICS calendar invite generation.

---

## Admin vs. View-Only Security

ProTrain includes role-based access control directly inside the application:

| Feature | View-Only Mode | Admin Mode (Unlocked) |
| :--- | :---: | :---: |
| Browse Trainings, Trainers & Rooms | ✅ Allowed | ✅ Allowed |
| View Gantt Timelines & Reports | ✅ Allowed | ✅ Allowed |
| Global Search & NLP Assistant | ✅ Allowed | ✅ Allowed |
| Export CSV Reports & Backups | ✅ Allowed | ✅ Allowed |
| Add / Edit / Delete Trainings & Tasks | ❌ Blocked | ✅ Full Access |
| Participant Status & Attrition Updates | ❌ Blocked | ✅ Full Access |
| Multi-Row Bulk Actions | ❌ Blocked | ✅ Full Access |
| Configure Trainers, Rooms & Holidays | ❌ Blocked | ✅ Full Access |

* **Default Admin PIN:** `0110` (customizable via Settings).
* **PIN Verification:** Secured via SHA-256 cryptographic hashing with a client-side JavaScript fallback when running over the local `file://` protocol.

---

## Participant Lifecycle & Certification Workflow

ProTrain features a refined, multi-state participant tracking system:

```
               ┌──────────────────────────────┐
               │     In Training - Active     │ (Default on Enrollment)
               └──────┬────────────────┬──────┘
                      │                │
       Admin Selects  │                │ Admin Selects
      "Set Certified" │                │ "Set Inactive"
                      ▼                ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │   Certification Modal  │    │    Attrition Modal     │
       │ Select: Cert Date      │    │ Select: Type & Reason  │
       └──────────────┬─────────┘    └────────┬───────────────┘
                      │                       │
                      ▼                       ▼
       ┌────────────────────────┐    ┌────────────────────────┐
       │    🎓 Certified        │    │      🔴 Inactive       │
       │ Date: DD-MM-YYYY       │    │ Terminated / Resigned  │
       └────────────────────────┘    └────────────────────────┘
```

1. **`In Training - Active`** (🟢 Blue/Green): Active participant currently undergoing training.
2. **`Certified`** (🎓 Purple): Opens the **Certification Modal** to set/confirm the **Certification Date** (`DD/MM/YYYY`). Displays the date inline beside the status tag.
3. **`Inactive`** (🔴 Red): Opens the **Attrition Modal** requiring:
   - **Attrition Type:** `Terminated` or `Resigned`.
   - **Reason for Attrition:** Dynamic dropdown (Behavior, Assessment Failure, Better Offer, etc.) with custom text support.
   - **Date of Attrition:** Date picker defaulting to current date.

---

## Version Control & Release History

ProTrain maintains strict, traceable version progression across standalone files:

### **Version 46 (Current Latest)** — `training_planner_46.html`
- **Multi-State Status Workflow:** Expanded participant status to `In Training - Active`, `Certified`, and `Inactive`.
- **Certification Date Modal:** Modal prompt to capture certification date on status change.
- **Side-by-Side Horizontal Status Layout:** Certification date and attrition details display inline beside the status pill, keeping row heights compact.
- **Unified Bulk Status Toolbar:** Select multiple participants and batch-update status via a clean `Set Status ▾` dropdown.
- **1-Click Status Filter Chips:** Filter global participants instantly by status.
- **Enhanced CSV Roster Export:** Exports normalized statuses and includes the `Certification Date` column.

### **Version 45** — `training_planner_45.html`
- **"Room Only" Ad-Hoc Booking:** Support reserving rooms for non-training events without trainer assignment.
- **Booker / Contact Details:** Optional requestor name field for room-only bookings.
- **Preserved Physical Conflict Validation:** Strict room double-booking prevention remains active.

### **Version 44** — `training_planner_44.html`
- **Chart.js Dashboard Visualizations:** Sub-Section Session Share (Doughnut) and Monthly Training Load (Bar).
- **Room Utilisation & Fill-Rate Summary:** Live metric cards tracking occupancy and seat fill percentages against room capacity.

### **Version 43** — `training_planner_43.html`
- **Dashboard Summary Integration:** Transferred Data Summary and Trainer Occupancy Live Preview from Reports to the Dashboard.

### **Version 42** — `training_planner_42.html`
- **Table Optimization:** Compact `TR` / `TA` type pills, redesigned `[Conflict]` badges, and compact icon actions (`✏️`, `⏸️`, `🗑️`).
- **Consolidated Modal Comms:** Participant communication actions consolidated cleanly into the Manage Participants Modal.

### **Version 41** — `training_planner_41.html`
- **"On Hold" State Management:** Added `isOnHold` flag, direct table action toggle, dashed purple striped Gantt rendering, and priority status overrides.

### **Version 40** — `training_planner_40.html`
- **Bifurcated Conflict & Batch Status:** Date-based status separated from conflict alerts with a dedicated sortable Conflict column.

### **Version 39** — `training_planner_39.html`
- **Gantt Conflict Overlays:** Diagonal striped red pattern (`.gantt-conflict-overlay`) on conflicting days across Activities and Resource views.
- **Task Scheduling Alignment:** Fully synchronized Start/End date configuration with working day calculation.

### **Versions 28 – 38**
- **V38:** 23-column Agent RAG Scorecard Grid with inline editing and dedicated CSV exports.
- **V37:** Initial Attrition Tracking modal and pure-JS WebCrypto SHA-256 fallback.
- **V36:** Power-BI-grade BI dashboard with dynamic slicers and conditional heatmapping.
- **V35:** Gantt timeline zoom levels (Day/Week/Month) and visual Undo/Redo audit log.
- **V34:** 15-field participant schema upgrade and global master roster view.
- **V31 – V33:** Floating conversational NLP assistant, global search, and filtered CSV exports.
- **V28 – V30:** Smart Auto-Suggest engine, capacity alerts, and participant roster foundation.

*(For full details on every release, refer to [version_history.md](version_history.md).)*

---

## Data Backup, Restore & Auto-Save

ProTrain ensures you never lose training schedules, rosters, or configurations:

1. **Manual Backup (`Save DB`):**
   - Exports the entire application database into a formatted JSON backup file.
   - Utilizes the native OS file picker where supported.
2. **Database Restore (`Load DB`):**
   - Imports any ProTrain JSON backup file, instantly restoring all trainers, rooms, holidays, trainings, tasks, and participant records.
3. **Auto-Save Checkpoints:**
   - Background snapshots are automatically saved to LocalStorage every 30 minutes, retaining recent recovery points.
4. **Undo / Redo Visualizer:**
   - Full action history stack with standard `Ctrl+Z` / `Ctrl+Y` shortcuts and visual audit rollback.

---

## Contributing & License

Contributions, feature suggestions, and enhancements are welcome!

1. Fork the repository (`https://github.com/navzar81-dev/Pro-Train`).
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

**Author:** [navzar81-dev](https://github.com/navzar81-dev)  
**Repository:** [https://github.com/navzar81-dev/Pro-Train](https://github.com/navzar81-dev/Pro-Train)
