const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', 'utf-8');

// 1. Dashboard Metric Card - Total Participants Enrolled
html = html.replace(
    /const upcomingTasks = data\.tasks[\s\S]*?\.slice\(0, 3\);/,
    `const upcomingTasks = data.tasks
                .filter(t => new Date(t.startDate) >= new Date())
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .slice(0, 3);
            
            const totalParticipants = data.trainings.reduce((sum, t) => sum + (t.participants ? t.participants.length : 0), 0);`
);

html = html.replace(
    /<div class="stat-card">\s*<div class="stat-value">\$\{data\.rooms\.length\}<\/div>\s*<div class="stat-label">Rooms<\/div>\s*<\/div>/,
    `<div class="stat-card">
                        <div class="stat-value">\${data.rooms.length}</div>
                        <div class="stat-label">Rooms</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">\${totalParticipants}</div>
                        <div class="stat-label">Participants Enrolled</div>
                    </div>`
);

// 2. Dashboard Sub-Section Overview - Participants
html = html.replace(
    /<th>Sub-Section<\/th>\s*<th style="text-align:center;">Sessions<\/th>\s*<th style="text-align:center;">Working Days<\/th>\s*<th style="text-align:center;">Total Hours<\/th>\s*<th style="text-align:center;">Upcoming<\/th>\s*<th style="text-align:center;">Conflicts<\/th>/,
    `<th>Sub-Section</th>
                                <th style="text-align:center;">Sessions</th>
                                <th style="text-align:center;">Participants</th>
                                <th style="text-align:center;">Working Days</th>
                                <th style="text-align:center;">Total Hours</th>
                                <th style="text-align:center;">Upcoming</th>
                                <th style="text-align:center;">Conflicts</th>`
);

html = html.replace(
    /const days  = group\.reduce\(\(s,t\) => s \+ getTrainingWorkingDays\(t\)\.length, 0\);/,
    `const days  = group.reduce((s,t) => s + getTrainingWorkingDays(t).length, 0);
                                    const parts = group.reduce((s,t) => s + (t.participants ? t.participants.length : 0), 0);`
);

html = html.replace(
    /<td style="text-align:center;font-weight:600;">\$\{group\.length\}<\/td>\s*<td style="text-align:center;">\$\{days\}<\/td>/,
    `<td style="text-align:center;font-weight:600;">\${group.length}</td>
                                        <td style="text-align:center;">\${parts}</td>
                                        <td style="text-align:center;">\${days}</td>`
);

// 3. Upcoming Trainings - Enrolled
html = html.replace(
    /<th>Training<\/th><th>Trainer<\/th><th>Room<\/th><th>Start Date<\/th><th>Duration<\/th>/,
    `<th>Training</th><th>Trainer</th><th>Room</th><th>Start Date</th><th>Duration</th><th>Enrolled</th>`
);

html = html.replace(
    /const totalH = days \* hpd;[\s\S]*?return `<tr>/,
    `const totalH = days * hpd;
                                        const capacity = room && room.capacity ? parseInt(room.capacity) : Infinity;
                                        const enrolled = t.participants ? t.participants.length : 0;
                                        let enrolledClass = '';
                                        if (capacity !== Infinity) {
                                            if (enrolled > capacity) enrolledClass = 'color:var(--danger);font-weight:bold;';
                                            else if (enrolled === capacity) enrolledClass = 'color:var(--warning);font-weight:bold;';
                                        }
                                        const enrolledDisplay = \`<span style="\${enrolledClass}">\${enrolled} \${capacity !== Infinity ? '/ ' + capacity : ''}</span>\`;
                                        return \`<tr>`
);

html = html.replace(
    /<td><span class="badge badge-blue">\$\{days\}d × \$\{hpd\}h = \$\{totalH % 1 === 0 \? totalH : totalH\.toFixed\(1\)\}h<\/span><\/td>\s*<\/tr>`/,
    `<td><span class="badge badge-blue">\${days}d × \${hpd}h = \${totalH % 1 === 0 ? totalH : totalH.toFixed(1)}h</span></td>
                                            <td>\${enrolledDisplay}</td>
                                        </tr>\``
);


// 4. Reports Tab - Participant Roster Report Card
const reportCardHtml = `
                    <!-- 1b. Participant Roster Report -->
                    <div class="report-card">
                        <div class="report-card-icon" style="background:#eff6ff;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div class="report-card-title">Participant Roster Report</div>
                        <div class="report-card-desc">Detailed flat list of all participants enrolled in trainings. Includes Participant Name, Emp ID, Email, Department, along with Training Name, Trainer, Room, and Dates. Perfect for pivot tables.</div>
                        <div class="report-card-meta">All Participants · Flat CSV</div>
                        <button class="btn btn-report" onclick="exportParticipantRosterReport()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export CSV
                        </button>
                    </div>
`;

html = html.replace(
    /<!-- 2\. Trainer Occupancy Matrix -->/,
    reportCardHtml + '\n                    <!-- 2. Trainer Occupancy Matrix -->'
);


// 5. Add Export Function logic
const exportLogic = `
        // ===================== EXPORT PARTICIPANT ROSTER =====================
        function exportParticipantRosterReport() {
            const rows = [
                ['Training Name', 'Sub-Section', 'Start Date', 'End Date', 'Trainer Name', 'Room Name', 'Participant Name', 'Employee ID', 'Department', 'Email Address']
            ];
            
            let rosterEmpty = true;
            data.trainings.forEach(t => {
                if (!t.participants || t.participants.length === 0) return;
                
                const tName = t.name || '';
                const tSubSection = t.subSection || 'Unassigned';
                const tStart = formatDisplayDate(t.startDate) || '';
                const tEnd = formatDisplayDate(t.endDate) || '';
                
                const trainer = data.trainers.find(tr => tr.id === t.trainerId);
                const tTrainer = trainer ? trainer.name : 'Unknown';
                
                const room = data.rooms.find(r => r.id === t.roomId);
                const tRoom = room ? room.name : (t.isOnline ? 'Online' : 'Unknown');

                t.participants.forEach(p => {
                    rosterEmpty = false;
                    rows.push([
                        tName, tSubSection, tStart, tEnd, tTrainer, tRoom,
                        p.name || '', p.empId || '', p.department || '', p.email || ''
                    ]);
                });
            });

            if (rosterEmpty) {
                showToast("No participants found across any trainings.");
                return;
            }

            const date = new Date().toISOString().slice(0, 10);
            downloadCSV(\`protrain_participant_roster_\${date}.csv\`, rows);
        }
`;

html = html.replace(
    /\/\/ ---- Trainer Occupancy Summary helpers ----/,
    exportLogic + '\n        // ---- Trainer Occupancy Summary helpers ----'
);


fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', html, 'utf-8');
console.log('Dashboard and Report patch complete.');
