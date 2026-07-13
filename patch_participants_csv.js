const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', 'utf-8');

// Replace the modal HTML
const newModalBody = `
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:10px;">
                    <div>
                        <h4 style="margin:0 0 5px 0;">Current Participants (<span id="pm-count">0</span>)</h4>
                        <div id="pm-capacity-warning" style="color:var(--danger);font-size:13px;font-weight:600;display:none;">⚠ Exceeds room capacity!</div>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-secondary" onclick="clearAllParticipants()" style="margin-right:8px; color:var(--danger); border-color:var(--danger-light);">Clear All</button>
                        <button class="btn btn-sm btn-primary" onclick="downloadParticipantCSVTemplate()">⬇ Download CSV Template</button>
                    </div>
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

                <h4 style="margin:0 0 10px 0;">Bulk Upload CSV</h4>
                <p style="font-size:13px;color:var(--text-light);margin-top:0;">Download the CSV template, fill it out, and upload it here to replace the current list.</p>
                <input type="file" id="pm-csv-upload" accept=".csv" style="display:block; margin-bottom:15px; width:100%; padding:10px; border:1px dashed var(--border); border-radius:6px;">
`;

// Replace from '<div style="display:flex; justify-content:space-between;' to the end of the text area
html = html.replace(
    /<div style="display:flex; justify-content:space-between;[\s\S]*?<\/textarea>/,
    newModalBody.trim()
);

// Replace the "Validate & Save JSON" button
html = html.replace(
    /<button class="btn btn-primary" onclick="saveParticipantsFromJSON\(\)">Validate & Save JSON<\/button>/,
    '<button class="btn btn-primary" onclick="uploadParticipantsCSV()">Upload & Save CSV</button>'
);

// Replace document.getElementById('pm-json-input').value = ...
html = html.replace(
    /document\.getElementById\('pm-json-input'\)\.value[\s\S]*?;/,
    `const fi = document.getElementById('pm-csv-upload'); if (fi) fi.value = '';`
);


// Replace the JSON functions with CSV functions
const csvFunctions = `
        function downloadParticipantCSVTemplate() {
            const template = "Name,Emp ID,Department,Email\\nJane Smith,EMP-001,CC Training,jane@example.com\\nJohn Doe,EMP-002,Retail Sales,john@example.com";
            const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(template);
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", "participant_template.csv");
            dlAnchorElem.click();
        }

        function clearAllParticipants() {
            if (!isAdmin) {
                showToast("⚠ Permission denied.", true);
                return;
            }
            const training = data.trainings.find(t => t.id === currentParticipantTrainingId);
            if (!training) return;
            if (training.participants && training.participants.length > 0) {
                if (confirm("Are you sure you want to remove all participants from this training?")) {
                    training.participants = [];
                    saveData();
                    renderParticipantTable(training);
                    renderTrainings();
                    showToast("✓ Cleared all participants.");
                }
            } else {
                showToast("No participants to clear.");
            }
        }

        function uploadParticipantsCSV() {
            if (!isAdmin) {
                showToast("⚠ You do not have permission to edit participants.", true);
                return;
            }
            
            const training = data.trainings.find(t => t.id === currentParticipantTrainingId);
            if (!training) return;
            
            const fileInput = document.getElementById('pm-csv-upload');
            if (!fileInput.files || fileInput.files.length === 0) {
                showToast("⚠ Please select a CSV file to upload.", true);
                return;
            }
            
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split(/\\r\\n|\\n/);
                const parsed = [];
                
                let startIdx = 0;
                if (lines.length > 0 && lines[0].toLowerCase().includes('name')) {
                    startIdx = 1; // skip header
                }
                
                for (let i = startIdx; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    // Simple CSV split handling quotes
                    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g, '').trim());
                    
                    parsed.push({
                        name: parts[0] || '',
                        empId: parts[1] || '',
                        department: parts[2] || '',
                        email: parts[3] || ''
                    });
                }
                
                let capacity = Infinity;
                if (training.roomId && training.roomId !== NO_ROOM_ID && !training.isOnline) {
                    const room = data.rooms.find(r => r.id === training.roomId);
                    if (room && room.capacity) capacity = parseInt(room.capacity);
                }
                
                if (parsed.length > capacity) {
                    const addAnyway = confirm(\`Warning: You are uploading \${parsed.length} participants, but the room capacity is only \${capacity}.\\n\\nAre you sure you want to add them anyway?\`);
                    if (!addAnyway) return;
                }
                
                training.participants = parsed;
                saveData();
                renderParticipantTable(training);
                renderTrainings();
                showToast(\`✓ Successfully loaded \${parsed.length} participants from CSV!\`);
                fileInput.value = ''; // reset file input
            };
            reader.readAsText(file);
        }
`;

html = html.replace(
    /function downloadParticipantTemplate\(\) \{[\s\S]*?showToast\(\`✓ Successfully saved \${parsed\.length} participants!\`\);\s*\}/,
    csvFunctions.trim()
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', html, 'utf-8');
console.log('CSV Patch complete.');
