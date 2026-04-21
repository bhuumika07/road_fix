const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'frontend');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const fullPath = path.join(htmlDir, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if navbar.js is already injected
    if (!content.includes('src="js/navbar.js"')) {
        // Find the last occurrence of <script to insert before it
        // Or better yet, just insert it before </body> if no scripts exist, 
        // or just before the first <script> tag close to the body end.
        
        // Find the first script tag that is NOT socket.io
        const scriptMatch = content.match(/<script\s+src="(?!.*socket\.io)[^>]+><\/script>/);
        
        if (scriptMatch) {
            content = content.replace(scriptMatch[0], '<script src="js/navbar.js"></script>\n    ' + scriptMatch[0]);
        } else {
            // fallback, insert before </body>
            content = content.replace('</body>', '<script src="js/navbar.js"></script>\n</body>');
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Injected navbar.js into', file);
    }
});
