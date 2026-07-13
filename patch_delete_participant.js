const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', 'utf-8');

// 1. Add column to modal header
html = html.replace(
    /<th>Name<\/th>\s*<th>Emp ID<\/th>\s*<th>Department<\/th>\s*<th>Email<\/th>/,
    `<th>Name</th>
                                <th>Emp ID</th>
                                <th>Department</th>
                                <th>Email</th>
                                <th style="width:40px;"></th>`
);

// 2. Add button to rendered rows
html = html.replace(
    /<td>\$\{pmEscapeHTML\(p\.email \|\| '-'\)\}<\/td>\s*<\/tr>/,
    `<td>\${pmEscapeHTML(p.email || '-')}</td>
                    <td style="text-align:right;">
                        \${isAdmin ? \`<button class="btn btn-sm btn-secondary" style="padding:2px 6px; color:var(--danger); border-color:transparent; background:transparent;" onclick="deleteParticipant(\${index})" title="Remove">✕</button>\` : ''}
                    </td>
                </tr>`
);

html = html.replace(
    /tbody\.innerHTML = training\.participants\.map\(p => `/,
    `tbody.innerHTML = training.participants.map((p, index) => \``
);

// If there's a colspan for empty state, increment it from 4 to 5
html = html.replace(
    /<td colspan="4" style="text-align:center;color:var\(--text-light\);padding:20px;">No participants added yet<\/td>/,
    `<td colspan="5" style="text-align:center;color:var(--text-light);padding:20px;">No participants added yet</td>`
);


// 3. Add delete function
const deleteFunc = `
        function deleteParticipant(index) {
            if (!isAdmin) return;
            const training = data.trainings.find(t => t.id === currentParticipantTrainingId);
            if (!training || !training.participants) return;
            
            if (confirm("Remove this participant?")) {
                training.participants.splice(index, 1);
                saveData();
                renderParticipantTable(training);
                renderTrainings(); // updates counts in background
            }
        }
`;

html = html.replace(
    /function clearAllParticipants\(\) \{/,
    deleteFunc + '\n        function clearAllParticipants() {'
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', html, 'utf-8');
console.log('Delete Participant patch complete.');
