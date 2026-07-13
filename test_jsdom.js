const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_31.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost" });
