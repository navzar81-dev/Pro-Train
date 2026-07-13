const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('c:/Users/User/Downloads/protrain/training_planner_31.html', 'utf-8');
const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost" });
const window = dom.window;
const document = window.document;

setTimeout(() => {
    try {
        const dockBtn = document.querySelector('.chat-header-actions button');
        console.log('isDockedOut before:', window.isDockedOut);
        dockBtn.click();
        
        const chatWindow = document.getElementById('chat-window');
        console.log('Docked class:', chatWindow.classList.contains('docked-out'));
        console.log('Chat left:', chatWindow.style.left);
        
        const header = document.getElementById('chat-header');
        console.log('Dispatching mousedown on header');
        const mousedown = new window.MouseEvent('mousedown', { clientX: 100, clientY: 100, bubbles: true, cancelable: true });
        header.dispatchEvent(mousedown);
        
        console.log('Dispatching mousemove on window');
        const mousemove = new window.MouseEvent('mousemove', { clientX: 150, clientY: 150, bubbles: true, cancelable: true });
        window.dispatchEvent(mousemove);
        
        console.log('Chat left after drag:', chatWindow.style.left);
    } catch(e) {
        console.log('ERROR:', e.message);
    }
}, 500);
