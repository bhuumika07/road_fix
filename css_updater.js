const fs = require('fs');

const cssOverride = `
/* ==========================================================================
   UNIVERSAL NAVBAR (OVERRIDE)
   ========================================================================== */
.navbar { background: #ffffff !important; border-bottom: 1px solid #e5e7eb !important; position: sticky !important; top: 0 !important; z-index: 1000 !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important; height: auto !important; display: block; }
.nav-container { max-width: 1200px !important; margin: 0 auto !important; padding: 0 24px !important; height: 64px !important; display: flex !important; justify-content: space-between !important; align-items: center !important; gap: 24px !important; }
.nav-logo { font-size: 1.25rem !important; font-weight: 800 !important; color: #3b82f6 !important; text-decoration: none !important; display: flex !important; align-items: center !important; gap: 8px !important; white-space: nowrap !important; flex-shrink: 0 !important; }
.nav-links { display: flex !important; list-style: none !important; gap: 4px !important; flex: 1 !important; align-items: center !important; margin: 0; padding: 0; }
.nav-links a { display: flex !important; align-items: center !important; gap: 6px !important; text-decoration: none !important; color: #64748b !important; font-weight: 500 !important; font-size: 0.875rem !important; padding: 7px 12px !important; border-radius: 8px !important; transition: all 0.15s ease !important; white-space: nowrap !important; }
.nav-links a::after { display: none !important; }
.nav-links a:hover { background: #eff6ff !important; color: #3b82f6 !important; }
.nav-links a.active { background: #eff6ff !important; color: #3b82f6 !important; font-weight: 600 !important; }
.nav-right { display: flex !important; align-items: center !important; gap: 8px !important; flex-shrink: 0 !important; }
.user-info { display: flex !important; align-items: center !important; gap: 8px !important; padding: 4px 12px 4px 4px !important; background: #f8fafc !important; border-radius: 24px !important; border: 1px solid #e5e7eb !important; }
.user-avatar { width: 32px !important; height: 32px !important; border-radius: 50% !important; background: #3b82f6 !important; color: white !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 700 !important; font-size: 0.85rem !important; }
.user-details { display: flex !important; flex-direction: column !important; }
.user-name { font-size: 0.8rem !important; font-weight: 600 !important; color: #1e293b !important; line-height: 1 !important; text-transform: none !important; }
.user-role-badge { font-size: 0.65rem !important; font-weight: 700 !important; color: white !important; background-color: #64748b !important; padding: 1px 6px !important; border-radius: 10px !important; margin-top: 2px !important; text-transform: capitalize !important; display: inline-block !important; }
.btn-icon { width: 36px !important; height: 36px !important; border-radius: 8px !important; border: 1px solid #e5e7eb !important; background: white !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #64748b !important; font-size: 0.9rem !important; transition: all 0.15s !important; flex-shrink: 0 !important; }
.btn-icon:hover { background: #f1f5f9 !important; color: #1e293b !important; }
#logout-btn:hover { background: #fef2f2 !important; border-color: #fecaca !important; color: #dc2626 !important; }
.mobile-menu-btn { display: none !important; }
/* Dark mode navbar */
[data-theme="dark"] .navbar { background: #1e293b !important; border-color: #334155 !important; }
[data-theme="dark"] .nav-links a { color: #94a3b8 !important; }
[data-theme="dark"] .nav-links a:hover, [data-theme="dark"] .nav-links a.active { background: #0f172a !important; color: #60a5fa !important; }
[data-theme="dark"] .user-info { background: #0f172a !important; border-color: #334155 !important; }
[data-theme="dark"] .user-name { color: #f1f5f9 !important; }
[data-theme="dark"] .btn-icon { background: #0f172a !important; border-color: #334155 !important; color: #94a3b8 !important; }
[data-theme="dark"] #logout-btn:hover { background: #450a0a !important; border-color: #991b1b !important; color: #fca5a5 !important; }
@media (max-width: 768px) {
  .mobile-menu-btn { display: flex !important; }
  .nav-links { display: none !important; position: absolute !important; top: 64px !important; left: 0 !important; right: 0 !important; background: white !important; flex-direction: column !important; padding: 12px !important; border-bottom: 1px solid #e5e7eb !important; box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; gap: 2px !important; }
  .nav-links.mobile-open { display: flex !important; }
  .nav-links a { padding: 10px 16px !important; border-radius: 8px !important; }
  .user-details { display: none !important; }
  [data-theme="dark"] .nav-links { background: #1e293b !important; border-color: #334155 !important; }
}
`;

fs.appendFileSync('c:/Users/bhumi/OneDrive/Desktop/ro/roadfix/frontend/css/style.css', cssOverride);
console.log('Appended CSS cleanly!');
