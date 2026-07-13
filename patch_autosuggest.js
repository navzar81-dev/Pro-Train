const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', 'utf-8');

// 1. Add the Auto-Suggest Button above Trainer/Room
html = html.replace(
    /<div class="form-row">\s*<div class="form-group">\s*<label>Trainer \*/,
    `<div class="form-row">
                        <div style="width:100%; display:flex; justify-content:flex-end; margin-bottom:8px;">
                            <button type="button" class="btn btn-sm" style="background:#fef08a; color:#854d0e; border:1px solid #fde047; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.05);" onclick="autoSuggestResources()">
                                ✨ Auto-Suggest Trainer & Room
                            </button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Trainer *`
);

// 2. Inject the autoSuggestResources() JS function
const autoSuggestJs = `
        // ===================== AUTO-SUGGEST ENGINE =====================
        function autoSuggestResources() {
            const nameField = document.getElementById('t-name').value.toLowerCase().trim();
            const startStr = document.getElementById('t-start').value;
            const duration = parseInt(document.getElementById('t-duration').value) || 0;
            const isOnline = document.getElementById('t-online').checked;

            if (!startStr || duration <= 0) {
                showToast("⚠ Please set a Start Date and Duration first.", true);
                return;
            }

            // Figure out the exact working days this training spans
            // We use addWorkingDays to jump forward by 'duration' working days
            // Wait, getTrainingWorkingDays uses the actual end date, so let's compute the correct end date
            
            // To get the exact end date, we add (duration - 1) working days to start date
            // But we must also factor in overridden chips
            const includedDates = Array.from(document.querySelectorAll('.override-day-chip.selected input')).map(cb => cb.value);
            
            // Actually, a simpler way is to just generate the days sequentially
            const days = [];
            let current = new Date(startStr);
            const includedSet = new Set(includedDates);
            let count = 0;
            
            // Safety loop breaker
            let maxLoops = 365;
            while (count < duration && maxLoops > 0) {
                const key = formatDate(current);
                if (isWorkingDay(current) || includedSet.has(key)) {
                    days.push(key);
                    count++;
                }
                if (count < duration) current.setDate(current.getDate() + 1);
                maxLoops--;
            }

            // 1. Suggest Trainer
            let bestTrainer = null;
            let bestTrainerScore = -1;

            data.trainers.forEach(trainer => {
                // Check availability
                const occupied = getOccupiedDates('trainer', trainer.id, editingId);
                let isFree = true;
                days.forEach(d => { if (occupied.has(d)) isFree = false; });
                
                // Check leave
                const leaves = data.leaves.filter(l => l.trainerId === trainer.id);
                days.forEach(d => {
                    leaves.forEach(l => {
                        if (l.leaveDays && l.leaveDays.includes(d)) isFree = false;
                    });
                });

                if (isFree) {
                    // Score based on expertise match
                    let score = 0;
                    if (trainer.expertise && nameField) {
                        const keywords = trainer.expertise.toLowerCase().split(',').map(s => s.trim());
                        keywords.forEach(kw => {
                            if (kw && nameField.includes(kw)) score += 10;
                        });
                    }
                    if (score > bestTrainerScore) {
                        bestTrainerScore = score;
                        bestTrainer = trainer;
                    }
                }
            });

            // 2. Suggest Room
            let bestRoom = null;
            if (!isOnline) {
                data.rooms.forEach(room => {
                    const occupied = getOccupiedDates('room', room.id, editingId);
                    let isFree = true;
                    days.forEach(d => { if (occupied.has(d)) isFree = false; });
                    
                    if (isFree) {
                        // Pick the smallest room that fits (assumes capacity exists)
                        if (!bestRoom || parseInt(room.capacity) < parseInt(bestRoom.capacity)) {
                            bestRoom = room;
                        }
                    }
                });
            }

            // Apply suggestions
            let msg = [];
            if (bestTrainer) {
                document.getElementById('t-trainer').value = bestTrainer.id;
                msg.push(\`Trainer: \${bestTrainer.name}\`);
            } else {
                msg.push(\`Trainer: None free\`);
            }

            if (!isOnline) {
                if (bestRoom) {
                    document.getElementById('t-room').value = bestRoom.id;
                    msg.push(\`Room: \${bestRoom.name}\`);
                } else {
                    msg.push(\`Room: None free\`);
                }
            }

            showToast("✨ Auto-Suggested: " + msg.join(" | "));
        }
`;

html = html.replace(
    /\/\/ ===================== MODAL LOGIC =====================/,
    autoSuggestJs + '\n        // ===================== MODAL LOGIC ====================='
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', html, 'utf-8');
console.log('Auto-Suggest patch complete.');
