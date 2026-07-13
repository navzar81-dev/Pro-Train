const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', 'utf-8');

// Fix 1: (data.leaves || [])
html = html.replace(
    /const leaves = data\.leaves\.filter\(l => l\.trainerId === trainer\.id\);/,
    `const leaves = (data.leaves || []).filter(l => l.trainerId === trainer.id);`
);

// Fix 2: If data.rooms is undefined? It shouldn't be, but just in case
html = html.replace(
    /data\.rooms\.forEach\(room => \{/,
    `(data.rooms || []).forEach(room => {`
);

// Fix 3: If data.trainers is undefined?
html = html.replace(
    /data\.trainers\.forEach\(trainer => \{/,
    `(data.trainers || []).forEach(trainer => {`
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', html, 'utf-8');
console.log('Applied null-safety patch to Auto-Suggest.');
