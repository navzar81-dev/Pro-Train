const fs = require('fs');

let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_31.html', 'utf-8');

// 1. Remove the old Global Search UI block
const searchUIStart = html.indexOf('<div style="position:relative; margin-right:12px;" id="global-search-container">');
if (searchUIStart !== -1) {
    const searchUIEnd = html.indexOf('</div>', html.indexOf('id="global-search-results"', searchUIStart)) + 12; // getting past the outer div
    // wait, it's safer to use regex to replace that specific block
    const blockRegex = /<div style="position:relative; margin-right:12px;" id="global-search-container">[\s\S]*?<\/div>\s*<\/div>/;
    html = html.replace(blockRegex, '');
}

// 2. Remove the old logic block
const oldLogicRegex = /\/\/ ===================== GLOBAL QUERY SEARCH =====================[\s\S]*?(?=\/\/ ===================== DATE UTILITIES =====================)/;
html = html.replace(oldLogicRegex, '');

// 3. Inject new CSS into <head>
const chatCSS = `
        /* ===================== CHAT WINDOW UI ===================== */
        .chat-fab {
            position: fixed; bottom: 24px; right: 24px;
            width: 56px; height: 56px; border-radius: 50%;
            background: var(--primary); color: white;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(37,99,235,0.4);
            cursor: pointer; z-index: 9999;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .chat-fab:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(37,99,235,0.5); }
        .chat-fab svg { width: 24px; height: 24px; }
        
        .chat-window {
            position: fixed; bottom: 90px; right: 24px;
            width: 360px; height: 480px; min-width: 250px; min-height: 300px;
            background: #fff; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            display: none; flex-direction: column; z-index: 9998;
            border: 1px solid var(--border); overflow: hidden;
            /* Native CSS resize for bottom-right corner */
            resize: both; 
        }
        .chat-window.visible { display: flex; }
        .chat-window.docked-out {
            /* when docked out, it can be dragged anywhere, removing bottom/right pinning */
            bottom: auto; right: auto; resize: none;
        }

        .chat-header {
            background: var(--primary); color: white;
            padding: 12px 16px; font-size: 14px; font-weight: 600;
            display: flex; justify-content: space-between; align-items: center;
            border-top-left-radius: 11px; border-top-right-radius: 11px;
            cursor: default; user-select: none; flex-shrink: 0;
        }
        .chat-window.docked-out .chat-header { cursor: move; }
        .chat-header-actions { display: flex; gap: 8px; }
        .chat-btn { background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; padding: 2px; }
        .chat-btn:hover { color: white; }

        .chat-body {
            flex: 1; padding: 16px; overflow-y: auto;
            background: #f8fafc; display: flex; flex-direction: column; gap: 12px;
        }
        .chat-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 13px; line-height: 1.5; }
        .chat-msg.user {
            background: var(--primary); color: white;
            align-self: flex-end; border-bottom-right-radius: 2px;
        }
        .chat-msg.system {
            background: white; border: 1px solid var(--border); color: var(--text);
            align-self: flex-start; border-bottom-left-radius: 2px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .chat-input-area {
            padding: 12px; border-top: 1px solid var(--border);
            background: white; display: flex; gap: 8px; align-items: center;
            flex-shrink: 0;
        }
        .chat-input {
            flex: 1; padding: 8px 12px; border: 1px solid var(--border);
            border-radius: 20px; font-size: 13px; outline: none; background: #f8fafc;
        }
        .chat-input:focus { border-color: var(--primary); background: white; }
        .chat-send {
            width: 32px; height: 32px; border-radius: 50%;
            background: var(--primary); color: white; border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: 0.2s; flex-shrink: 0;
        }
        .chat-send:hover { background: var(--primary-dark); }

        /* Custom Resize Handles for Top, Left, and Top-Left */
        .resizer { position: absolute; }
        .resizer-t { top: 0; left: 0; right: 0; height: 6px; cursor: n-resize; z-index: 10; }
        .resizer-l { top: 0; bottom: 0; left: 0; width: 6px; cursor: w-resize; z-index: 10; }
        .resizer-tl { top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize; z-index: 11; }
`;
html = html.replace('</style>', chatCSS + '\n    </style>');

// 4. Inject HTML into <body>
const chatHTML = `
    <!-- Chat UI -->
    <div class="chat-fab" id="chat-fab" onclick="toggleChatWindow()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    </div>

    <div class="chat-window" id="chat-window">
        <!-- Resize Handles -->
        <div class="resizer resizer-t" id="resizer-t"></div>
        <div class="resizer resizer-l" id="resizer-l"></div>
        <div class="resizer resizer-tl" id="resizer-tl"></div>

        <div class="chat-header" id="chat-header">
            <div style="display:flex; align-items:center; gap:6px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2zM4 10h16v12H4z"/></svg>
                ProTrain Assistant
            </div>
            <div class="chat-header-actions">
                <button class="chat-btn" onclick="toggleDock(event)" title="Dock / Undock">
                    <svg id="dock-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/></svg>
                </button>
                <button class="chat-btn" onclick="toggleChatWindow(event)" title="Close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
        <div class="chat-body" id="chat-body">
            <div class="chat-msg system">
                Hello! I am your ProTrain Assistant. You can ask me things like:<br>
                • <em>"Is Sarah free tomorrow?"</em><br>
                • <em>"Free rooms on June 15"</em><br>
                • <em>"Show CC Training"</em>
            </div>
        </div>
        <div class="chat-input-area">
            <input type="text" class="chat-input" id="chat-input" placeholder="Type your question..." onkeydown="if(event.key==='Enter') submitChatMessage()">
            <button class="chat-send" onclick="submitChatMessage()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </div>
    </div>
`;
html = html.replace('</body>', chatHTML + '\n</body>');

// 5. Inject JS logic
const chatJS = `
        // ===================== CHAT UI & LOGIC =====================
        
        const chatWindow = document.getElementById('chat-window');
        const chatBody = document.getElementById('chat-body');
        const chatInput = document.getElementById('chat-input');
        const dockIcon = document.getElementById('dock-icon');
        let isDockedOut = false;

        function toggleChatWindow(e) {
            if(e) e.stopPropagation();
            chatWindow.classList.toggle('visible');
            if(chatWindow.classList.contains('visible')) {
                chatInput.focus();
                chatBody.scrollTop = chatBody.scrollHeight;
            }
        }

        function toggleDock(e) {
            e.stopPropagation();
            isDockedOut = !isDockedOut;
            if (isDockedOut) {
                chatWindow.classList.add('docked-out');
                // Center it initially when undocked
                chatWindow.style.left = (window.innerWidth / 2 - 180) + 'px';
                chatWindow.style.top = (window.innerHeight / 2 - 240) + 'px';
                dockIcon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/>'; // window icon
            } else {
                chatWindow.classList.remove('docked-out');
                // Remove inline position styles to let CSS dock it back to bottom-right
                chatWindow.style.left = '';
                chatWindow.style.top = '';
                chatWindow.style.width = ''; // reset size
                chatWindow.style.height = '';
                dockIcon.innerHTML = '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 3v18"/>'; // dock icon
            }
        }

        // --- Draggable Header (only when docked out) ---
        const chatHeader = document.getElementById('chat-header');
        let isDragging = false, dragStartX, dragStartY, initialWinX, initialWinY;

        chatHeader.addEventListener('mousedown', (e) => {
            if (!isDockedOut || e.target.closest('.chat-btn')) return;
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            initialWinX = chatWindow.offsetLeft;
            initialWinY = chatWindow.offsetTop;
            document.addEventListener('mousemove', onDragMove);
            document.addEventListener('mouseup', onDragEnd);
        });

        function onDragMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            chatWindow.style.left = (initialWinX + dx) + 'px';
            chatWindow.style.top = (initialWinY + dy) + 'px';
        }
        function onDragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', onDragMove);
            document.removeEventListener('mouseup', onDragEnd);
        }

        // --- Custom Resize Handles (Top, Left, Top-Left) ---
        let currentResizer = null, origWidth, origHeight, origX, origY, origMouseX, origMouseY;

        function initResize(e, resizerType) {
            if (!isDockedOut) return; // Only allow custom resize if docked out (or we can allow it always, but docked-out makes more sense for left/top resizing)
            e.preventDefault();
            currentResizer = resizerType;
            origWidth = chatWindow.offsetWidth;
            origHeight = chatWindow.offsetHeight;
            origX = chatWindow.offsetLeft;
            origY = chatWindow.offsetTop;
            origMouseX = e.clientX;
            origMouseY = e.clientY;
            document.addEventListener('mousemove', resizeMove);
            document.addEventListener('mouseup', stopResize);
        }

        document.getElementById('resizer-t').addEventListener('mousedown', e => initResize(e, 't'));
        document.getElementById('resizer-l').addEventListener('mousedown', e => initResize(e, 'l'));
        document.getElementById('resizer-tl').addEventListener('mousedown', e => initResize(e, 'tl'));

        function resizeMove(e) {
            if (!currentResizer) return;
            if (currentResizer === 't' || currentResizer === 'tl') {
                const dy = e.clientY - origMouseY;
                const newHeight = origHeight - dy;
                if (newHeight > 300) { // min height
                    chatWindow.style.height = newHeight + 'px';
                    chatWindow.style.top = (origY + dy) + 'px';
                }
            }
            if (currentResizer === 'l' || currentResizer === 'tl') {
                const dx = e.clientX - origMouseX;
                const newWidth = origWidth - dx;
                if (newWidth > 250) { // min width
                    chatWindow.style.width = newWidth + 'px';
                    chatWindow.style.left = (origX + dx) + 'px';
                }
            }
        }
        function stopResize() {
            currentResizer = null;
            document.removeEventListener('mousemove', resizeMove);
            document.removeEventListener('mouseup', stopResize);
        }

        // --- Chat Query Logic ---
        function submitChatMessage() {
            const val = chatInput.value.trim();
            if(!val) return;
            
            // Add user message
            addMessage(val, 'user');
            chatInput.value = '';

            // Process query
            setTimeout(() => {
                processChatQuery(val);
            }, 300);
        }

        function addMessage(htmlContent, type) {
            const div = document.createElement('div');
            div.className = 'chat-msg ' + type;
            div.innerHTML = htmlContent;
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

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
                if (m < today.getMonth() - 1) y++; 
                return formatDate(new Date(y, m, day));
            }
            // Fallback to explicit yyyy-mm-dd
            const isoMatch = lower.match(/(\\d{4}-\\d{2}-\\d{2})/);
            if (isoMatch) return isoMatch[1];

            return null;
        }

        function processChatQuery(query) {
            const q = query.toLowerCase().trim();
            let outputHtml = '';
            let handled = false;

            // Type 1: Room Availability
            if (q.includes('free room') || q.includes('available room') || (q.includes('room') && (q.includes('free') || q.includes('available')))) {
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
                    freeRooms.forEach(r => outputHtml += \`<li>\${r.name} (Cap: \${r.capacity})</li>\`);
                    outputHtml += \`</ul>\`;
                }
                handled = true;
            }
            
            // Type 2: Trainer Availability
            if (!handled && (q.includes('free') || q.includes('available'))) {
                const matchedTrainer = (data.trainers || []).find(t => {
                    const parts = t.name.toLowerCase().split(' ');
                    return parts.some(p => p.length > 2 && q.includes(p));
                });

                if (matchedTrainer) {
                    const targetDate = parseQueryDate(q) || formatDate(new Date());
                    const occupied = getOccupiedDates('trainer', matchedTrainer.id);
                    let isFree = !occupied.has(targetDate);
                    
                    const leaves = (data.leaves || []).filter(l => l.trainerId === matchedTrainer.id);
                    leaves.forEach(l => { if (l.leaveDays && l.leaveDays.includes(targetDate)) isFree = false; });

                    outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--text);">👤 \${matchedTrainer.name}</div>\`;
                    if (isFree) {
                        outputHtml += \`<div style="color:#16a34a; font-weight:600; padding:6px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; text-align:center;">✅ Available on \${formatDisplayDate(targetDate)}</div>\`;
                    } else {
                        let conflictDetails = "They have a schedule conflict or are on leave.";
                        const conflictTraining = (data.trainings || []).find(tr => tr.trainerId === matchedTrainer.id && getTrainingWorkingDays(tr).some(d => formatDate(d) === targetDate));
                        if (conflictTraining) conflictDetails = \`Booked for training: "\${conflictTraining.name}"\`;
                        
                        outputHtml += \`<div style="color:#dc2626; font-weight:600; padding:6px; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; text-align:center;">❌ Not available on \${formatDisplayDate(targetDate)}</div>\`;
                        outputHtml += \`<div style="margin-top:6px; font-size:11px; color:var(--text-light); text-align:center;">\${conflictDetails}</div>\`;
                    }
                    handled = true;
                }
            }

            // Type 3 & 4
            if (!handled) {
                const matchedSub = SUB_SECTIONS.find(s => q.includes(s.toLowerCase()));
                if (matchedSub && (q.includes('trainings') || q.includes('show'))) {
                    outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--text);">📂 Filtering by Sub-section</div>\`;
                    outputHtml += \`<div style="font-size:13px; color:var(--text-light); margin-bottom:12px;">Found sub-section: <strong>\${matchedSub}</strong></div>\`;
                    outputHtml += \`<button class="btn btn-sm btn-primary" onclick="applySearchFilter('\${matchedSub}')" style="width:100%; justify-content:center;">View \${matchedSub} Trainings</button>\`;
                    handled = true;
                } else {
                    const matchedTrainings = (data.trainings || []).filter(t => t.name.toLowerCase().includes(q));
                    if (matchedTrainings.length > 0) {
                        outputHtml += \`<div style="font-weight:600; margin-bottom:8px; color:var(--primary);">🎓 Found \${matchedTrainings.length} Training(s):</div>\`;
                        outputHtml += \`<div style="display:flex; flex-direction:column; gap:8px;">\`;
                        matchedTrainings.forEach(t => {
                            const tr = (data.trainers || []).find(x => x.id === t.trainerId);
                            const count = (t.participants || []).length;
                            outputHtml += \`
                                <div style="padding:10px; border:1px solid var(--border); border-radius:6px; background:#f8fafc;">
                                    <div style="font-weight:600; font-size:13px;">\${t.name}</div>
                                    <div style="font-size:11px; color:var(--text-light); margin-top:4px;">
                                        🗓 \${formatDisplayDate(t.startDate)}<br>
                                        👤 \${tr ? tr.name : 'No Trainer'} | 👥 \${count} Pax
                                    </div>
                                    <button class="btn btn-sm btn-secondary" onclick="editTraining('\${t.id}')" style="margin-top:8px; padding:2px 8px; font-size:11px; width:100%; justify-content:center;">View Roster</button>
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
                        I couldn't quite understand that. Try asking:<br>
                        • "Is Sarah free tomorrow?"<br>
                        • "Free rooms on June 15"<br>
                        • "Show CC Training"
                    </div>
                \`;
            }

            addMessage(outputHtml, 'system');
        }

        window.applySearchFilter = function(subsection) {
            document.querySelector('.nav-item[data-page="trainings"]').click();
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
    /\/\/ ===================== DATE UTILITIES =====================/,
    chatJS + '\n        // ===================== DATE UTILITIES ====================='
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_31.html', html, 'utf-8');
console.log("Chat UI patch applied successfully.");
