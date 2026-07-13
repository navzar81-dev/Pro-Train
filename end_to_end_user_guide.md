# ProTrain End-to-End User Guide (v34)

Welcome to **ProTrain**, your all-in-one Training & Resource Planner. This guide will walk you through the entire system, from basic navigation to advanced participant management and database backups.

---

## 1. Getting Started & Navigation

ProTrain is an offline-capable, single-page web application. It runs entirely in your browser without requiring an active internet connection.

### The Sidebar Navigation
On the left side of your screen, you'll find the main navigation panel:
- **Dashboard:** Your high-level overview. Shows upcoming trainings, capacity alerts, and metrics broken down by sub-section.
- **Trainings:** The core of the app. Add, edit, delete, and view all scheduled training sessions.
- **Gantt View:** A visual timeline of your tasks and trainings. Drag and drop to reschedule.
- **Trainers:** Manage your roster of trainers, their expertise, and their annual leave.
- **Rooms:** Manage physical training locations, their capacities, and special features.
- **Holidays:** Block out company-wide holidays to prevent accidental scheduling.
- **Reports:** View availability matrices for trainers and rooms over a 30-day window.
- **Participants:** A global, master roster of all participants currently enrolled across all trainings.

### Admin Mode vs. View-Only
At the bottom of the sidebar, you'll see a role indicator.
- **View-Only Mode:** Users can browse trainings, view reports, and use the search bar, but cannot add, edit, or delete any data.
- **Admin Login:** Click the "Admin Login" button and enter your PIN (Default: `0110`) to unlock all write capabilities.

---

## 2. Managing Resources

Before you schedule a training, ensure your resources (Trainers and Rooms) are set up.

### Trainers
1. Navigate to the **Trainers** tab.
2. Click **+ Add Trainer**.
3. Enter their Name, Contact Info, and select their **Expertise** (e.g., Technical, Soft Skills, Leadership).
4. **Leaves:** If a trainer is taking vacation, edit their profile and add a Leave. The system will hard-block these dates from being scheduled.

### Rooms
1. Navigate to the **Rooms** tab.
2. Click **+ Add Room**.
3. Enter the Room Name, Location, and critically, its **Capacity**.
4. The capacity is used by the Dashboard to warn you if a training session is overbooked.

---

## 3. Scheduling Trainings & Tasks

### The Trainings Tab
1. Click **+ Add Training** to open the scheduling modal.
2. Fill out the necessary details (Sub-Section, Training Name, Type).
3. **Dates:** Select your Start and End dates. The system will automatically calculate the total working days, skipping weekends and holidays.
4. **Auto-Suggest (✨):** Click this button! The system will cross-reference the required dates with your Trainers' leave and conflict schedules, and your Rooms' booking schedules. It will instantly recommend the best available Trainer (matching the expertise of the Training Name) and the smallest available Room that fits.

### Tasks vs. Trainings
- **Trainings:** Formal sessions with participants, rooms, and trainers.
- **Tasks:** Administrative or prep work. You can add Tasks from the Trainings tab using the "Add Task" button. Tasks still respect trainer/room conflicts.

### Filtering and Exporting
- Use the **Status Filter Chips** (Upcoming, In Progress, Completed, Conflict) to quickly narrow down the list.
- Use the search bar to find specific trainings.
- Click **📥 Export (CSV)** to instantly download a report of exactly what is currently filtered on your screen.

---

## 4. Participant Management

ProTrain v34 features a robust 15-point participant data model.

### Enrolling Participants into a Training
1. In the Trainings tab, find a training and click the **Participants (Users) icon** on its row.
2. **Manual Entry:** You can type their details in row by row.
3. **CSV Upload:** Click **Attach CSV**. Your CSV must have the exact headers specified in the template. The system will instantly parse and load the participants.
4. **Paste Raw Data:** If CSV upload is restricted, click the **"Paste Raw Data"** button. Copy cells directly from Excel (including headers) and paste them into the box to instantly load them.

### Instant Communication
In the Manage Participants modal, you will see quick-action icons next to each participant:
- **Email/Outlook:** Click the mail icon to instantly draft an email to the user (uses their User ID/Email).
- **Teams:** Click the chat icon to instantly open a Microsoft Teams chat with the user.
- **WhatsApp / SMS:** Click the respective icons to open chats using their Contact No.

### Global Participants View & Bulk Actions
Navigate to the **Participants** tab on the left sidebar to see the master roster.
- This table shows every participant from every training.
- **Search & Sort:** Use the search bar to find an employee by Name, User ID, or Department.
- **Status Toggle:** As an Admin, click the iOS-style switch to instantly toggle a participant between Active and Inactive.
- **Bulk Actions:** Check the boxes on the left side of the rows. A top menu will appear allowing you to instantly **Delete Selected** or update their statuses in bulk.
- **Export Roster:** Click the big blue **"Export Participant Roster"** button to download the massive 21-column master report.

---

## 5. The Intelligent Assistant (Chat)

In the bottom right corner, you'll find the floating ProTrain Assistant.
- Click the bubble to open the chat window.
- You can ask natural language questions like: *"Is Sarah free tomorrow?"* or *"Show me CC Trainings."*
- The assistant will instantly parse your query against the database and give you availability answers or automatically navigate you to the correct filtered view.
- You can click the "undock" icon to turn the chat into a free-floating widget that you can drag around and resize.

---

## 6. Saving and Backing Up Your Data

Because ProTrain runs offline, **your data is stored directly in your browser.** If you clear your browser cache, your data will be lost unless you back it up.

### Saving the Database
1. In the sidebar, look under the **Database** section.
2. Click **Save DB**.
3. A "Save As" window will appear. Choose where to save your `.json` backup file on your computer.

### Restoring the Database
1. Click **Import DB** in the sidebar.
2. Select your previously saved `.json` file.
3. The system will instantly load all your Trainings, Participants, Trainers, and settings back into the application.
