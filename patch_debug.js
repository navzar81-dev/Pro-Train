const fs = require('fs');
let html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', 'utf-8');

html = html.replace(
    /function autoSuggestResources\(\) \{/,
    `function autoSuggestResources() {
            try {`
);

html = html.replace(
    /showToast\("✨ Auto-Suggested: " \+ msg\.join\(" \| "\)\);\s*\}/,
    `showToast("✨ Auto-Suggested: " + msg.join(" | "));
            } catch(e) {
                console.error(e);
                alert("Error in Auto-Suggest: " + e.message);
            }
        }`
);

fs.writeFileSync('c:/Users/User/Downloads/protrain/training_planner_29.html', html, 'utf-8');
console.log('Added try-catch to autoSuggestResources.');
