const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend');
const files = [
  'index.html', 'report.html', 'dashboard.html', 
  'audit.html', 'contact.html', 'about.html', 'faq.html'
];

const newNavbar = `    <!-- UNIVERSAL NAVBAR -->
    <nav class="navbar" id="main-navbar">
      <div class="nav-container">
        <a href="index.html" class="nav-logo">
          <i class="fa-solid fa-road"></i>
          <span>RoadFix</span>
        </a>
        <ul class="nav-links" id="nav-links">
          <li><a href="index.html" data-page="index"><i class="fa-solid fa-house"></i> Home</a></li>
          <li><a href="about.html" data-page="about"><i class="fa-solid fa-circle-info"></i> About</a></li>
          <li><a href="report.html" data-page="report"><i class="fa-solid fa-plus"></i> Report Issue</a></li>
          <li><a href="dashboard.html" data-page="dashboard"><i class="fa-solid fa-chart-bar"></i> Dashboard</a></li>
          <li class="admin-only" style="display:none"><a href="audit.html" data-page="audit"><i class="fa-solid fa-shield-halved"></i> Audit Log</a></li>
          <li><a href="faq.html" data-page="faq"><i class="fa-solid fa-circle-question"></i> FAQ</a></li>
          <li><a href="contact.html" data-page="contact"><i class="fa-solid fa-envelope"></i> Contact</a></li>
        </ul>
        
        <div class="nav-right">
          <div class="user-info auth-only" style="display:none">
            <div class="user-avatar" id="user-avatar">U</div>
            <div class="user-details">
              <span class="user-name" id="nav-user-name">User</span>
              <span class="user-role-badge" id="nav-role-badge">citizen</span>
            </div>
          </div>
          <button class="btn-icon auth-only" id="logout-btn" style="display:none" title="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
          <button class="btn-icon" id="theme-toggle" title="Toggle theme"><i class="fa-solid fa-moon" id="theme-icon"></i></button>
          <button class="btn-icon mobile-menu-btn" id="mobile-menu-btn"><i class="fa-solid fa-bars"></i></button>
        </div>
      </div>
    </nav>`;

files.forEach(file => {
   const p = path.join(baseDir, file);
   if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      
      // Regex replace covering EVERYTHING between <nav class="navbar" ...</nav>
      content = content.replace(/<nav class="navbar"[\s\S]*?<\/nav>/i, newNavbar);
      
      fs.writeFileSync(p, content);
      console.log('Updated: ' + file);
   }
});
