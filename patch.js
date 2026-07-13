const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', 'utf-8');

const modalHtml = `
    <!-- Report Date Range Modal -->
    <div class="modal-overlay" id="report-date-modal">
        <div class="modal" style="max-width: 400px;">
            <div class="modal-header">
                <span class="modal-title">Select Date Range</span>
                <button class="modal-close" onclick="closeReportDateModal()">&times;</button>
            </div>
            <div class="modal-body">
                <p style="font-size:13px;color:var(--text-light);margin-bottom:15px;">Please select the date range for the availability report.</p>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" id="report-start-date" class="form-control">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="date" id="report-end-date" class="form-control">
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeReportDateModal()">Cancel</button>
                <button class="btn btn-primary" onclick="generateAvailabilityReport()">Generate</button>
            </div>
        </div>
    </div>
`;
html = html.replace('<!-- Tooltip -->', modalHtml + '\n    <!-- Tooltip -->');

const cardsHtml = `
                    <!-- 3b. Trainer Availability -->
                    <div class="report-card">
                        <div class="report-card-icon" style="background:#f0fdf4;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                        </div>
                        <div class="report-card-title">Trainer Availability Report</div>
                        <div class="report-card-desc">Detailed list of working days a trainer is free within a chosen date range.</div>
                        <div class="report-card-meta">\${trainerCount} trainer(s) · Date Range</div>
                        <button class="btn btn-report-green" onclick="openReportDateModal('trainer_availability')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export CSV
                        </button>
                    </div>

                    <!-- 3c. Room Availability -->
                    <div class="report-card">
                        <div class="report-card-icon" style="background:#faf5ff;">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
                        </div>
                        <div class="report-card-title">Room Availability Report</div>
                        <div class="report-card-desc">Detailed list of working days a room is free within a chosen date range.</div>
                        <div class="report-card-meta">\${roomCount} room(s) · Date Range</div>
                        <button class="btn btn-report-purple" onclick="openReportDateModal('room_availability')">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export CSV
                        </button>
                    </div>
`;
html = html.replace('<!-- 4. Master Data -->', cardsHtml + '\n                    <!-- 4. Master Data -->');

const jsLogic = `
        // ===================== AVAILABILITY REPORTS =====================
        let currentAvailabilityReportType = null;

        function openReportDateModal(type) {
            currentAvailabilityReportType = type;
            const now = new Date();
            const startStr = now.toISOString().slice(0,10);
            
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1);
            const endStr = endDate.toISOString().slice(0,10);
            
            document.getElementById('report-start-date').value = startStr;
            document.getElementById('report-end-date').value = endStr;
            
            document.getElementById('report-date-modal').classList.add('active');
        }

        function closeReportDateModal() {
            document.getElementById('report-date-modal').classList.remove('active');
            currentAvailabilityReportType = null;
        }

        function generateAvailabilityReport() {
            const startStr = document.getElementById('report-start-date').value;
            const endStr = document.getElementById('report-end-date').value;
            
            if (!startStr || !endStr) {
                showToast('⚠ Please select both start and end dates', true);
                return;
            }
            
            const start = new Date(startStr);
            const end = new Date(endStr);
            
            if (start > end) {
                showToast('⚠ Start date must be before end date', true);
                return;
            }

            closeReportDateModal();
            
            if (currentAvailabilityReportType === 'trainer_availability') {
                exportTrainerAvailability(start, end);
            } else if (currentAvailabilityReportType === 'room_availability') {
                exportRoomAvailability(start, end);
            }
        }

        function exportTrainerAvailability(start, end) {
            if (data.trainers.length === 0) { showToast('⚠ No trainers found', true); return; }
            
            const allDays = getAllDaysInRange(start, end);
            const workingDays = allDays.filter(d => !isWeekend(d) && !isHoliday(d));
            
            const header = ['Trainer', 'Total Working Days in Range', 'Days Booked', 'Total Available Days', 'Available Dates'];
            const rows = [header];
            
            data.trainers.forEach(trainer => {
                let bookedDaysCount = 0;
                let availableDates = [];
                
                workingDays.forEach(day => {
                    const dayKey = formatDate(day);
                    
                    const isBookedTraining = data.trainings.some(t => t.trainerId === trainer.id && getTrainingWorkingDays(t).some(wd => formatDate(wd) === dayKey));
                    const isBookedTask = !isBookedTraining && data.tasks.some(t => t.trainerId === trainer.id && getTrainingWorkingDays(t).some(wd => formatDate(wd) === dayKey));
                    
                    if (isBookedTraining || isBookedTask) {
                        bookedDaysCount++;
                    } else {
                        availableDates.push(dayKey);
                    }
                });
                
                rows.push([
                    trainer.name,
                    workingDays.length,
                    bookedDaysCount,
                    availableDates.length,
                    availableDates.join('; ')
                ]);
            });
            
            const date = new Date().toISOString().slice(0,10);
            downloadCSV(\`protrain_trainer_availability_\${date}.csv\`, rows);
            showToast('✓ Trainer Availability Report exported');
        }

        function exportRoomAvailability(start, end) {
            if (data.rooms.length === 0) { showToast('⚠ No rooms found', true); return; }
            
            const allDays = getAllDaysInRange(start, end);
            const workingDays = allDays.filter(d => !isWeekend(d) && !isHoliday(d));
            
            const header = ['Room', 'Capacity', 'Total Working Days in Range', 'Days Booked', 'Total Available Days', 'Available Dates'];
            const rows = [header];
            
            data.rooms.forEach(room => {
                let bookedDaysCount = 0;
                let availableDates = [];
                
                workingDays.forEach(day => {
                    const dayKey = formatDate(day);
                    
                    const isBookedTraining = data.trainings.some(t => t.roomId === room.id && getTrainingWorkingDays(t).some(wd => formatDate(wd) === dayKey));
                    const isBookedTask = !isBookedTraining && data.tasks.some(t => t.roomId === room.id && getTrainingWorkingDays(t).some(wd => formatDate(wd) === dayKey));
                    
                    if (isBookedTraining || isBookedTask) {
                        bookedDaysCount++;
                    } else {
                        availableDates.push(dayKey);
                    }
                });
                
                rows.push([
                    room.name,
                    room.capacity,
                    workingDays.length,
                    bookedDaysCount,
                    availableDates.length,
                    availableDates.join('; ')
                ]);
            });
            
            const date = new Date().toISOString().slice(0,10);
            downloadCSV(\`protrain_room_availability_\${date}.csv\`, rows);
            showToast('✓ Room Availability Report exported');
        }

`;
html = html.replace('// ---- Trainer Occupancy Summary helpers ----', jsLogic + '\n        // ---- Trainer Occupancy Summary helpers ----');

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_27.html', html, 'utf-8');
console.log('Done!');
