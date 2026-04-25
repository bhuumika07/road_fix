(function() {
  
  // ---- CONSTANTS ----
  const PUBLIC_PAGES = ['login.html']
  const ROLE_COLORS = {
    admin:     '#7c3aed',
    citizen:   '#22c55e'
  }
  
  // ---- GET CURRENT PAGE ----
  function getCurrentPage() {
    const path = window.location.pathname
    const file = path.split('/').pop() 
                 || 'index.html'
    return file
  }
  
  // ---- GET USER FROM STORAGE ----
  function getUser() {
    try {
      const email = localStorage.getItem('userEmail');
      const role = localStorage.getItem('userRole');
      let name = localStorage.getItem('userName');
      if (!name || name === 'undefined' || name === 'null') name = 'User';
      const id = localStorage.getItem('userId');
      if (email && role) {
        return { email, role, name, id };
      }
      return null;
    } catch(e) {
      return null
    }
  }
  
  // ---- AUTH GUARD ----
  function authGuard() {
    const page = getCurrentPage()
    const user = getUser()
    const isPublic = PUBLIC_PAGES.includes(page)
    
    if (!user && !isPublic) {
      window.location.href = 'login.html'
      return false
    }
    if (user && page === 'login.html') {
      window.location.href = 'index.html'
      return false
    }
    return true
  }
  
  // ---- SET ACTIVE LINK ----
  function setActiveLink() {
    const page = getCurrentPage()
    document.querySelectorAll(
      '.nav-links a[data-page]'
    ).forEach(link => {
      link.classList.remove('active')
      const linkPage = link.dataset.page
      if (page.includes(linkPage) && 
          linkPage !== '') {
        link.classList.add('active')
      }
    })
  }
  
  // ---- SHOW ROLE-BASED ELEMENTS ----
  // WHITELIST approach: 
  // Start hidden, show what's needed
  function applyRoleVisibility(user) {
    if (!user) return
    
    const role = user.role
    
    // Show auth-only elements
    document.querySelectorAll('.auth-only')
      .forEach(el => {
        el.style.display = ''
      })
    
    // Show admin-only if admin
    if (role === 'admin') {
      document.querySelectorAll('.admin-only')
        .forEach(el => {
          el.style.display = ''
        })
    }
    
    // Show inspector-only if admin
    if (role === 'admin') {
      document.querySelectorAll(
        '.inspector-only'
      ).forEach(el => {
        el.style.display = ''
      })
    }
    
    // Set user info
    const nameEl = document.getElementById('nav-user-name')
    const badgeEl = document.getElementById('nav-role-badge')
    const avatarEl = document.getElementById('user-avatar')
    
    if (nameEl) nameEl.textContent = user.name
    
    if (badgeEl) {
      badgeEl.textContent = user.role
      badgeEl.style.background = ROLE_COLORS[user.role] || '#64748b'
    }
    
    if (avatarEl) {
      avatarEl.textContent = user.name.charAt(0).toUpperCase()
      avatarEl.style.background = ROLE_COLORS[user.role] || '#64748b'
    }
  }

  function initReportNowLink() {
    document.querySelectorAll('.btn-report-now').forEach((link) => {
      if (link.tagName.toLowerCase() === 'a') {
        link.setAttribute('href', 'report.html')
      }
    })
  }

  function initUserProfileMenu(user) {
    const userInfo = document.querySelector('.user-info.auth-only')
    const navRight = document.querySelector('.nav-right')
    if (!userInfo || !navRight || !user) return

    userInfo.setAttribute('role', 'button')
    userInfo.setAttribute('tabindex', '0')
    userInfo.setAttribute('aria-haspopup', 'true')
    userInfo.setAttribute('aria-expanded', 'false')

    let panel = document.getElementById('nav-user-panel')
    if (!panel) {
      panel = document.createElement('div')
      panel.id = 'nav-user-panel'
      panel.className = 'nav-user-panel'
      panel.innerHTML = `
        <div class="nav-user-panel-header">
          <strong>${user.name || 'User'}</strong>
          <span>${(user.role || 'citizen').toUpperCase()}</span>
        </div>
        <div class="nav-user-panel-row"><i class="fa-regular fa-envelope"></i> ${user.email || 'N/A'}</div>
        <div class="nav-user-panel-row"><i class="fa-regular fa-id-badge"></i> ID: ${user.id || 'N/A'}</div>
        <div class="nav-user-panel-actions">
          <a href="dashboard.html"><i class="fa-solid fa-chart-bar"></i> Dashboard</a>
          <a href="report.html"><i class="fa-solid fa-flag"></i> New Complaint</a>
          <button type="button" id="nav-panel-logout-btn"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        </div>
      `
      navRight.appendChild(panel)
    }

    function closePanel() {
      panel.classList.remove('open')
      userInfo.setAttribute('aria-expanded', 'false')
    }

    function togglePanel() {
      const shouldOpen = !panel.classList.contains('open')
      panel.classList.toggle('open', shouldOpen)
      userInfo.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false')
    }

    userInfo.addEventListener('click', (e) => {
      e.stopPropagation()
      togglePanel()
    })

    userInfo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        togglePanel()
      }
      if (e.key === 'Escape') closePanel()
    })

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !userInfo.contains(e.target)) {
        closePanel()
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePanel()
    })

    const panelLogoutBtn = document.getElementById('nav-panel-logout-btn')
    if (panelLogoutBtn) {
      panelLogoutBtn.addEventListener('click', async () => {
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch(e) {}
        localStorage.clear()
        window.location.href = 'login.html'
      })
    }
  }
  
  // ---- LOGOUT ----
  function initLogout() {
    const btn = document.getElementById(
      'logout-btn')
    if (!btn) return
    
    btn.addEventListener('click', async () => {
      try { await fetch('/api/auth/logout', { method: 'POST' }); } catch(e) {}
      localStorage.clear()
      window.location.href = 'login.html'
    })
  }
  
  // ---- MOBILE MENU ----
  function initMobileMenu() {
    const btn = document.getElementById(
      'mobile-menu-btn')
    const links = document.getElementById(
      'nav-links')
    if (!btn || !links) return
    
    btn.addEventListener('click', () => {
      links.classList.toggle('mobile-open')
      const icon = btn.querySelector('i')
      icon.className = 
        links.classList.contains('mobile-open')
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars'
    })
    
    // Close menu when link clicked
    links.querySelectorAll('a')
      .forEach(a => {
        a.addEventListener('click', () => {
          links.classList.remove('mobile-open')
        })
      })
  }
  
  // ---- INIT ----
  function init() {
    const ok = authGuard()
    if (!ok) return
    
    const user = getUser()
    setActiveLink()
    applyRoleVisibility(user)
    initReportNowLink()
    initUserProfileMenu(user)
    initLogout()
    initMobileMenu()
  }
  
  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener(
      'DOMContentLoaded', init)
  } else {
    init()
  }

})()
