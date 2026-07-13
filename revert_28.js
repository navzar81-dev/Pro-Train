const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', 'utf-8');

// 1. Remove Auto-Suggest Button
const buttonHtml = `<div class="form-row">
                        <div style="width:100%; display:flex; justify-content:flex-end; margin-bottom:8px;">
                            <button type="button" class="btn btn-sm" style="background:#fef08a; color:#854d0e; border:1px solid #fde047; font-weight:bold; box-shadow:0 2px 4px rgba(0,0,0,0.05);" onclick="autoSuggestResources()">
                                ✨ Auto-Suggest Trainer & Room
                            </button>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Trainer *`;

html = html.replace(buttonHtml, `<div class="form-row">
                        <div class="form-group">
                            <label>Trainer *`);

// 2. Remove the JS function block
// The block starts at `// ===================== AUTO-SUGGEST ENGINE =====================`
// and ends right before `// ===================== MODAL LOGIC =====================`
const regex = /\/\/\s*=====================\s*AUTO-SUGGEST ENGINE\s*=====================[^]+?(?=\/\/\s*=====================\s*MODAL LOGIC\s*=====================)/;
html = html.replace(regex, '');

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_28.html', html, 'utf-8');
console.log('Successfully reverted training_planner_28.html');
