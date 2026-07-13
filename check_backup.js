const fs = require('fs');
const content = fs.readFileSync('training_planner_38.html', 'utf8');
const lines = content.split('\n');

let start = -1;
lines.forEach((line, idx) => {
    if (line.includes('function saveTraining()')) {
        start = idx;
    }
});

if (start !== -1) {
    console.log('Found saveTraining at line:', start + 1);
    for (let i = start - 150; i < start + 50; i++) {
        console.log(`${i+1}: ${lines[i]}`);
    }
}
