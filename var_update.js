const fs = require('fs');
const content = `[data-theme="dark"] {
    /* DARK MODE (Sleek, Deep Blue/Purple) */
    --primary: #818cf8; /* Soft Indigo */
    --primary-hover: #6366f1;
    --secondary: #38bdf8; /* Luminous blue */
    --bg-main: #0B0F19; /* Extremely deep midnight blue */
    --bg-card: rgba(18, 24, 38, 0.75);
    --bg-solid: #121826;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #94a3b8;
    --border: rgba(51, 65, 85, 0.5);
    --border-strong: #475569;
    --nav-bg: rgba(11, 15, 25, 0.85);
    --input-bg: rgba(18, 24, 38, 0.9);
    --shadow-color: rgba(0, 0, 0, 0.5);
    
    --shadow-md: 0 10px 15px -3px var(--shadow-color);
    --shadow-lg: 0 20px 25px -5px var(--shadow-color);
    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}`;

let css = fs.readFileSync('frontend/css/style.css', 'utf8');
css = css.replace(/\[data-theme="dark"\]\s*\{[\s\S]*?--shadow-xl:[^\}]+\}/, content);

/* Also replace LIGHT MODE */
const lightContent = `:root {
    /* LIGHT MODE (Premium Vibrant) */
    --primary: #4f46e5; /* Intense Indigo */
    --primary-hover: #4338ca;
    --secondary: #0ea5e9; /* Light Ocean Blue */
    --bg-main: #f1f5f9; /* Slate gray background to elevate the white UI cards */
    --bg-card: rgba(255, 255, 255, 0.95);
    --bg-solid: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #334155;
    --text-muted: #64748b;
    --border: rgba(203, 213, 225, 0.6);
    --border-strong: #94a3b8;
    --nav-bg: rgba(255, 255, 255, 0.85);
    --input-bg: #ffffff;
    --shadow-color: rgba(79, 70, 229, 0.08); /* Primary color shadow tint */
    
    /* Semantic Colors */
    --success: #10b981;
    --success-bg: rgba(16, 185, 129, 0.1);
    --warning: #f59e0b;
    --warning-bg: rgba(245, 158, 11, 0.1);
    --danger: #ef4444;
    --danger-bg: rgba(239, 68, 68, 0.1);
    --info: #3b82f6;
    --info-bg: rgba(59, 130, 246, 0.1);

    --radius-sm: 0.5rem;
    --radius-md: 0.85rem; 
    --radius-lg: 1.5rem;
    --radius-full: 9999px;

    /* Elevated Premium Shadows */
    --shadow-sm: 0 4px 6px -1px var(--shadow-color);
    --shadow-md: 0 10px 15px -3px var(--shadow-color);
    --shadow-lg: 0 20px 25px -5px var(--shadow-color);
    --shadow-xl: 0 25px 50px -12px rgba(79, 70, 229, 0.15);
    
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`;
css = css.replace(/:root\s*\{[\s\S]*?--transition:[^\}]+\}/, lightContent);

fs.writeFileSync('frontend/css/style.css', css);
console.log('Variables uplifted.');
