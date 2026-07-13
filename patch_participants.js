const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', 'utf-8');

// 1. Add "Participants" column header
html = html.replace(
    /<th>Days × Hrs\/Day<\/th>\s*<th class="[^"]*".*?>Total Hours<span[^>]*><\/span><\/th>\s*<th class="[^"]*".*?>Status<span[^>]*><\/span><\/th>\s*<th>Actions<\/th>/,
    `<th>Days × Hrs/Day</th>
                                        \${th('totalHours','Total Hours')}
                                        \${th('status','Status')}
                                        <th>Participants</th>
                                        <th>Actions</th>`
);

// 2. Add Participants column cell with button
html = html.replace(
    /<td>\${statusBadge}<\/td>\s*<td>\s*\${isAdmin \? `/g,
    `<td>\${statusBadge}</td>
                                            <td>\${participantsButton}</td>
                                            <td>
                                                \${isAdmin ? \``
);

// 3. Define participantsButton logic inside map(t => {
html = html.replace(
    /const totalDisplay = t\.totalHours % 1 === 0 \? t\.totalHours : t\.totalHours\.toFixed\(1\);/,
    `const totalDisplay = t.totalHours % 1 === 0 ? t.totalHours : t.totalHours.toFixed(1);
                                        const partCount = t.participants ? t.participants.length : 0;
                                        const participantsButton = t.isTask ? '<span style="color:var(--text-light)">—</span>' : 
                                            \`<button class="btn btn-sm btn-secondary" onclick="openParticipantModal('\${t.id}')">👤 \${partCount} <span style="font-weight:bold;margin-left:4px;">+</span></button>\`;`
);

// 4. Add the new Participant Modal HTML (at the end of other modals)
const modalHtml = `
    <!-- Participant Management Modal -->
    <div class="modal-overlay" id="participant-modal">
        <div class="modal" style="max-width: 800px;">
            <div class="modal-header">
                <span class="modal-title" id="pm-title">Manage Participants</span>
                <button class="modal-close" onclick="closeParticipantModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:10px;">
                    <div>
                        <h4 style="margin:0 0 5px 0;">Current Participants (<span id="pm-count">0</span>)</h4>
                        <div id="pm-capacity-warning" style="color:var(--danger);font-size:13px;font-weight:600;display:none;">⚠ Exceeds room capacity!</div>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="downloadParticipantTemplate()">⬇ Download JSON Template</button>
                </div>
                
                <div style="max-height: 200px; overflow-y:auto; border:1px solid var(--border); border-radius:6px; margin-bottom:20px;">
                    <table class="data-table" style="margin:0; border:none; border-radius:0;">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Emp ID</th>
                                <th>Department</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody id="pm-tbody">
                            <!-- Populated by JS -->
                        </tbody>
                    </table>
                </div>

                <h4 style="margin:0 0 10px 0;">Bulk Upload JSON</h4>
                <p style="font-size:13px;color:var(--text-light);margin-top:0;">Paste an array of JSON objects matching the template format to replace the list. Clear to remove all.</p>
                <textarea id="pm-json-input" style="width:100%; height:150px; font-family:monospace; font-size:13px; padding:10px; border:1px solid var(--border); border-radius:6px; resize:vertical;" placeholder='[\\n  {\\n    "name": "John Doe",\\n    "empId": "E123",\\n    "department": "Retail",\\n    "email": "john@example.com"\\n  }\\n]'></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeParticipantModal()">Close</button>
                <button class="btn btn-primary" onclick="saveParticipantsFromJSON()">Validate & Save JSON</button>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- Tooltip -->', modalHtml + '\n    <!-- Tooltip -->');

// 5. Add JavaScript functions
const jsLogic = `
        // ===================== PARTICIPANTS =====================
        let currentParticipantTrainingId = null;

        function pmEscapeHTML(str) {
            if (!str) return '';
            return String(str).replace(/[&<>'"]/g, match => {
                const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
                return map[match];
            });
        }

        function openParticipantModal(trainingId) {
            currentParticipantTrainingId = trainingId;
            const training = data.trainings.find(t => t.id === trainingId);
            if (!training) return;
            
            if (!training.participants) training.participants = [];
            
            document.getElementById('pm-title').textContent = \`Participants: \${training.name}\`;
            document.getElementById('pm-json-input').value = training.participants.length > 0 ? JSON.stringify(training.participants, null, 2) : '';
            
            renderParticipantTable(training);
            
            document.getElementById('participant-modal').classList.add('active');
        }

        function closeParticipantModal() {
            document.getElementById('participant-modal').classList.remove('active');
            currentParticipantTrainingId = null;
        }
        
        function renderParticipantTable(training) {
            const tbody = document.getElementById('pm-tbody');
            const countSpan = document.getElementById('pm-count');
            const warnDiv = document.getElementById('pm-capacity-warning');
            
            if (!training.participants) training.participants = [];
            
            countSpan.textContent = training.participants.length;
            
            let capacity = Infinity;
            if (training.roomId && training.roomId !== NO_ROOM_ID && !training.isOnline) {
                const room = data.rooms.find(r => r.id === training.roomId);
                if (room && room.capacity) capacity = parseInt(room.capacity);
            }
            
            if (training.participants.length > capacity) {
                warnDiv.textContent = \`⚠ Exceeds room capacity (\${capacity})!\`;
                warnDiv.style.display = 'block';
            } else {
                warnDiv.style.display = 'none';
            }
            
            if (training.participants.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-light);padding:20px;">No participants added yet</td></tr>';
                return;
            }
            
            tbody.innerHTML = training.participants.map(p => \`
                <tr>
                    <td>\${pmEscapeHTML(p.name || '-')}</td>
                    <td>\${pmEscapeHTML(p.empId || '-')}</td>
                    <td>\${pmEscapeHTML(p.department || '-')}</td>
                    <td>\${pmEscapeHTML(p.email || '-')}</td>
                </tr>
            \`).join('');
        }

        function downloadParticipantTemplate() {
            const template = [
                {
                    "name": "Jane Smith",
                    "empId": "EMP-001",
                    "department": "CC Training",
                    "email": "jane@example.com"
                },
                {
                    "name": "John Doe",
                    "empId": "EMP-002",
                    "department": "Retail Sales",
                    "email": "john@example.com"
                }
            ];
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(template, null, 2));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "participant_template.json");
            dlAnchorElem.click();
        }

        function saveParticipantsFromJSON() {
            if (!isAdmin) {
                showToast("⚠ You do not have permission to edit participants.", true);
                return;
            }
            
            const training = data.trainings.find(t => t.id === currentParticipantTrainingId);
            if (!training) return;
            
            const inputVal = document.getElementById('pm-json-input').value.trim();
            if (!inputVal) {
                training.participants = [];
                saveData();
                renderParticipantTable(training);
                renderTrainings();
                showToast("✓ Cleared all participants.");
                return;
            }
            
            let parsed = [];
            try {
                parsed = JSON.parse(inputVal);
            } catch (e) {
                showToast("⚠ Invalid JSON format. Please check syntax.", true);
                return;
            }
            
            if (!Array.isArray(parsed)) {
                showToast("⚠ JSON must be an array of objects: [...]", true);
                return;
            }
            
            let capacity = Infinity;
            if (training.roomId && training.roomId !== NO_ROOM_ID && !training.isOnline) {
                const room = data.rooms.find(r => r.id === training.roomId);
                if (room && room.capacity) capacity = parseInt(room.capacity);
            }
            
            if (parsed.length > capacity) {
                const addAnyway = confirm(\`Warning: You are adding \${parsed.length} participants, but the room capacity is only \${capacity}.\\n\\nAre you sure you want to add them anyway?\`);
                if (!addAnyway) return;
            }
            
            training.participants = parsed;
            saveData();
            renderParticipantTable(training);
            renderTrainings();
            showToast(\`✓ Successfully saved \${parsed.length} participants!\`);
        }
`;
html = html.replace('// ---- Trainer Occupancy Summary helpers ----', jsLogic + '\n        // ---- Trainer Occupancy Summary helpers ----');

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', html, 'utf-8');
console.log('Patch complete.');
