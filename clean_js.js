const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'frontend', 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'navbar.js');

files.forEach(file => {
    const fullPath = path.join(jsDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Find everything between DOMContentLoaded and Dashboard State or similarly patterned logic
    // Actually, I'll regex the blocks.
    let modified = false;

    // Remove Auth Check block if present
    const authRegex = /\s*if\s*\(!role\)\s*\{\s*window\.location\.href\s*=\s*'login\.html';\s*return;\s*\}/g;
    if (authRegex.test(content)) {
        content = content.replace(authRegex, '');
        modified = true;
    }

    // Remove manual theme toggle block
    const themeRegex = /\s*\/\/\s*Theme Toggle[\s\S]*?(?=\/\/\s*Dashboard State|\/\/\s*Fetch|\/\/\s*Filter|logoutBtn\.addEventListener|\/\/\s*Export|\n\n\n|\}\);|let |const |$)/g;
    // Let's replace the whole theme button event listener
    const themeListenerRegex = /\s*themeBtn\.addEventListener\([\s\S]*?\}\);/g;
    const themeIconRegex = /\s*(const\s+(themeBtn|themeIcon)[^\n]+\n|if\s*\(localStorage\.getItem\('theme'\)[^\}]+(\}\n)*)/g;
    
    if (themeListenerRegex.test(content)) {
       content = content.replace(themeListenerRegex, '');
       modified = true;
    }
    
    // Remove logout block
    const logoutRegex = /\s*logoutBtn\.addEventListener\([\s\S]*?\}\);/g;
    if (logoutRegex.test(content)) {
       content = content.replace(logoutRegex, '');
       modified = true;
    }
    
    // Remove Navbar UI Set block
    const uiRegex = /\s*\/\/\s*Set Navbar UI[\s\S]*?(?=\/\/ Theme|\/\/ Show|\/\/ Logout|\/\/\s*Dashboard|if\s*\(role)/g;
    if(uiRegex.test(content)) {
       content = content.replace(uiRegex, '');
       modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Cleaned logic in', file);
    }
});
