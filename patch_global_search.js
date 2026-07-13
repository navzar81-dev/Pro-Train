const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_30.html', 'utf-8');

// 1. Inject the UI
const searchUI = `
                <div style="position:relative; margin-right:12px;" id="global-search-container">
                    <div style="position:relative;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#94a3b8;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" id="global-search-input" placeholder="Ask anything... (e.g. 'Is Sarah free tomorrow?')" style="padding:8px 12px 8px 30px; border:1px solid var(--border); border-radius:20px; font-size:13px; width:280px; outline:none; transition:all 0.2s; background:var(--bg); color:var(--text);" onkeydown="if(event.key==='Enter') executeGlobalSearch(this.value)">
                    </div>
                    <div id="global-search-results" style="display:none; position:absolute; top:100%; right:0; margin-top:8px; width:360px; background:#fff; border:1px solid var(--border); border-radius:8px; box-shadow:0 10px 25px rgba(0,0,0,0.15); z-index:9000; padding:16px;"></div>
                </div>`;

html = html.replace(
    /<div style="display:flex;gap:8px;align-items:center;">/,
    `<div style="display:flex;gap:8px;align-items:center;">` + searchUI
);

// 2. Inject the Logic
const searchLogic = `
        // ===================== GLOBAL QUERY SEARCH =====================
        
        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            const container = document.getElementById('global-search-container');
            const results = document.getElementById('global-search-results');
            if (container && !container.contains(e.target)) {
                if (results) results.style.display = 'none';
            }
        });

        function parseQueryDate(q) {
            const lower = q.toLowerCase();
            const today = new Date();
            
            if (lower.includes('today')) return formatDate(today);
            if (lower.includes('tomorrow')) {
                const tmr = new Date(today);
                tmr.setDate(tmr.getDate() + 1);
                return formatDate(tmr);
            }
            
            // Try to match Month DD (e.g., June 15, Oct 12)
            const monthMatch = lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\s+(\\d{1,2})/);
            if (monthMatch) {
                const monthStr = monthMatch[1];
                const day = parseInt(monthMatch[2]);
                const monthMap = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
                let y = today.getFullYear();
                let m = monthMap[monthStr];
                // If the parsed date is in the past by more than a month, assume next year
                if (m < today.getMonth() - 1) y++; 
                return formatDate(new Date(y, m, day));
            }

            // Fallback to explicit yyyy-mm-dd
            const isoMatch = lower.match(/(\\d{4}-\\d{2}-\\d{2})/);
            if (isoMatch) return isoMatch[1];

            return null; // no date found
        }

        function executeGlobalSearch(query) {
            if (!query.trim()) return;
            const q = query.toLowerCase().trim();
            const resultsDiv = document.getElementById('global-search-results');
            resultsDiv.style.display = 'block';
            resultsDiv.innerHTML = '<div style="color:var(--text-light);font-size:13px;">Thinking...</div>';
            
            let outputHtml = '';
            let handled = false;

            // Type 1: Room Availability (e.g., "free rooms tomorrow")
            if (q.includes('free room') || q.includes('available room') || q.includes('room') && (q.includes('free') || q.includes('available'))) {
                const targetDate = parseQueryDate(q) || formatDate(new Date());
                
                const freeRooms = (data.rooms || []).filter(room => {
                    const occupied = getOccupiedDates('room', room.id);
                    return !occupied.has(targetDate);
                });

                outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--primary);">🏢 Rooms available on \${formatDisplayDate(targetDate)}:</div>\`;
                if (freeRooms.length === 0) {
                    outputHtml += \`<div style="color:var(--text-light);font-size:13px;">No rooms available.</div>\`;
                } else {
                    outputHtml += \`<ul style="margin:0; padding-left:20px; font-size:13px; color:var(--text);">\`;
                    freeRooms.forEach(r => {
                        outputHtml += \`<li>\${r.name} (Cap: \${r.capacity})</li>\`;
                    });
                    outputHtml += \`</ul>\`;
                }
                handled = true;
            }
            
            // Type 2: Trainer Availability (e.g., "Is Sarah free tomorrow?")
            if (!handled && (q.includes('free') || q.includes('available'))) {
                // Look for a trainer name match
                const matchedTrainer = (data.trainers || []).find(t => {
                    const parts = t.name.toLowerCase().split(' ');
                    // match any part of the name that is > 2 chars
                    return parts.some(p => p.length > 2 && q.includes(p));
                });

                if (matchedTrainer) {
                    const targetDate = parseQueryDate(q) || formatDate(new Date());
                    
                    const occupied = getOccupiedDates('trainer', matchedTrainer.id);
                    let isFree = !occupied.has(targetDate);
                    
                    // Check leaves
                    const leaves = (data.leaves || []).filter(l => l.trainerId === matchedTrainer.id);
                    leaves.forEach(l => {
                        if (l.leaveDays && l.leaveDays.includes(targetDate)) isFree = false;
                    });

                    outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--text);">👤 \${matchedTrainer.name}</div>\`;
                    if (isFree) {
                        outputHtml += \`<div style="color:#16a34a; font-size:13px; font-weight:600; padding:8px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px;">✅ Available on \${formatDisplayDate(targetDate)}</div>\`;
                    } else {
                        // Find what they are doing
                        let conflictDetails = "They have a schedule conflict or are on leave.";
                        // check trainings
                        const conflictTraining = (data.trainings || []).find(tr => tr.trainerId === matchedTrainer.id && getTrainingWorkingDays(tr).some(d => formatDate(d) === targetDate));
                        if (conflictTraining) conflictDetails = \`Booked for training: "\${conflictTraining.name}"\`;
                        
                        outputHtml += \`<div style="color:#dc2626; font-size:13px; font-weight:600; padding:8px; background:#fef2f2; border:1px solid #fecaca; border-radius:6px;">❌ Not available on \${formatDisplayDate(targetDate)}</div>\`;
                        outputHtml += \`<div style="margin-top:6px; font-size:12px; color:var(--text-light);">\${conflictDetails}</div>\`;
                    }
                    handled = true;
                }
            }

            // Type 3: Record Lookup & Type 4: Sub-section Filtering
            if (!handled) {
                // Let's check Sub-sections first
                const matchedSub = SUB_SECTIONS.find(s => q.includes(s.toLowerCase()));
                if (matchedSub && (q.includes('trainings') || q.includes('show'))) {
                    outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--text);">📂 Filtering by Sub-section</div>\`;
                    outputHtml += \`<div style="font-size:13px; color:var(--text-light); margin-bottom:12px;">Found sub-section: <strong>\${matchedSub}</strong></div>\`;
                    outputHtml += \`<button class="btn btn-sm btn-primary" onclick="applySearchFilter('\${matchedSub}')" style="width:100%; justify-content:center;">View \${matchedSub} Trainings</button>\`;
                    handled = true;
                } else {
                    // Search for training by name
                    const matchedTrainings = (data.trainings || []).filter(t => t.name.toLowerCase().includes(q));
                    if (matchedTrainings.length > 0) {
                        outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--primary);">🎓 Found \${matchedTrainings.length} Training(s):</div>\`;
                        outputHtml += \`<div style="max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:8px;">\`;
                        matchedTrainings.forEach(t => {
                            const tr = (data.trainers || []).find(x => x.id === t.trainerId);
                            const rm = (data.rooms || []).find(x => x.id === t.roomId);
                            const count = (t.participants || []).length;
                            outputHtml += \`
                                <div style="padding:10px; border:1px solid var(--border); border-radius:6px; background:#f8fafc;">
                                    <div style="font-weight:600; font-size:13px;">\${t.name}</div>
                                    <div style="font-size:11px; color:var(--text-light); margin-top:4px;">
                                        🗓 \${formatDisplayDate(t.startDate)} - \${formatDisplayDate(t.endDate)}<br>
                                        👤 \${tr ? tr.name : 'No Trainer'} | 👥 \${count} Participants
                                    </div>
                                    <button class="btn btn-sm btn-secondary" onclick="document.getElementById('global-search-results').style.display='none'; editTraining('\${t.id}')" style="margin-top:8px; padding:2px 8px; font-size:11px;">Edit / View Roster</button>
                                </div>
                            \`;
                        });
                        outputHtml += \`</div>\`;
                        handled = true;
                    }
                }
            }

            if (!handled) {
                outputHtml = \`
                    <div style="color:var(--text);">
                        <div style="font-weight:600; margin-bottom:4px;">Not understood</div>
                        <div style="font-size:13px; color:var(--text-light); line-height:1.5;">
                            I couldn't quite understand that query. Try asking:<br>
                            • "Is Sarah free tomorrow?"<br>
                            • "Free rooms on June 15"<br>
                            • "Show CC Training"<br>
                            • "[Name of a training]"
                        </div>
                    </div>
                \`;
            }

            resultsDiv.innerHTML = outputHtml;
        }

        // Helper to navigate and apply sub-section filter from search
        window.applySearchFilter = function(subsection) {
            document.getElementById('global-search-results').style.display = 'none';
            // Switch to trainings tab
            document.querySelector('.nav-item[data-page="trainings"]').click();
            // Set filter
            setTimeout(() => {
                const select = document.getElementById('f-subsection');
                if (select) {
                    select.value = subsection;
                    renderTrainings();
                }
            }, 100);
        };
`;

html = html.replace(
    /\/\/ ===================== GLOBAL SCOPE UTILS =====================/,
    searchLogic + '\n        // ===================== GLOBAL SCOPE UTILS ====================='
);

// We need to inject `window.applySearchFilter` to the global scope just to be safe, but since it's already in the script block, it should be global.
// Wait, is there a // ===================== GLOBAL SCOPE UTILS ===================== block?
// Let's use `// ===================== DATE UTILITIES =====================` instead.
html = html.replace(
    /\/\/ ===================== DATE UTILITIES =====================/,
    searchLogic + '\n        // ===================== DATE UTILITIES ====================='
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_30.html', html, 'utf-8');
console.log('Global search patch applied to version 30.');
