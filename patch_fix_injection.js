const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', 'utf-8');

const autoSuggestJs = `
        // ===================== AUTO-SUGGEST ENGINE =====================
        function autoSuggestResources() {
            try {
                const nameField = document.getElementById('t-name').value.toLowerCase().trim();
                const startStr = document.getElementById('t-start').value;
                const duration = parseInt(document.getElementById('t-duration').value) || 0;
                const isOnline = document.getElementById('t-online').checked;

                if (!startStr || duration <= 0) {
                    showToast("⚠ Please set a Start Date and Duration first.", true);
                    return;
                }

                const includedDates = Array.from(document.querySelectorAll('.override-day-chip.selected input')).map(cb => cb.value);
                
                const days = [];
                let current = new Date(startStr);
                const includedSet = new Set(includedDates);
                let count = 0;
                
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

                (data.trainers || []).forEach(trainer => {
                    const occupied = getOccupiedDates('trainer', trainer.id, editingId);
                    let isFree = true;
                    days.forEach(d => { if (occupied.has(d)) isFree = false; });
                    
                    const leaves = (data.leaves || []).filter(l => l.trainerId === trainer.id);
                    days.forEach(d => {
                        leaves.forEach(l => {
                            if (l.leaveDays && l.leaveDays.includes(d)) isFree = false;
                        });
                    });

                    if (isFree) {
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
                    (data.rooms || []).forEach(room => {
                        const occupied = getOccupiedDates('room', room.id, editingId);
                        let isFree = true;
                        days.forEach(d => { if (occupied.has(d)) isFree = false; });
                        
                        if (isFree) {
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
            } catch(e) {
                console.error(e);
                alert("Error in Auto-Suggest: " + e.message);
            }
        }
`;

html = html.replace(
    /function openTrainingModal\(training = null\) \{/,
    autoSuggestJs + '\n        function openTrainingModal(training = null) {'
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', html, 'utf-8');
console.log('Injected autoSuggestResources');
