const fs = require('fs');

function analyzeFile(name) {
    if (!fs.existsSync(name)) {
        console.log(`${name} does not exist`);
        return;
    }
    const content = fs.readFileSync(name, 'utf8');
    const lines = content.split('\n');
    console.log(`=== Analyzing ${name} ===`);

    // Let's find where the Task modal is defined
    lines.forEach((line, idx) => {
        if (line.includes('id="task-modal"') || line.includes('id="training-modal"') || line.includes('task-date') || line.includes('subSection') || line.includes('sub-section')) {
            console.log(`L${idx+1}: ${line.trim()}`);
        }
    });
}

analyzeFile('training_planner_38.html');
