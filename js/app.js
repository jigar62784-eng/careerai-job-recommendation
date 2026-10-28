/**
 * CareerAI - Global Application UI Utilities
 * Standardizes layout, navigation, demo banner, modals, toasts, and Firebase config settings.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CareerApp = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  /**
   * Display a floating toast notification
   */
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  }

  /**
   * Open / Close modal helpers
   */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /**
   * Render Top Demo Mode / Firebase Live Banner
   */
  function renderDemoBanner() {
    const bannerElem = document.getElementById('demo-mode-banner');
    if (!bannerElem) return;

    const modeInfo = window.FirebaseConfigManager 
      ? window.FirebaseConfigManager.getAppMode() 
      : { isDemo: true, label: 'Demo Mode' };
    
    bannerElem.className = 'demo-banner';
    
    if (modeInfo.isDemo) {
      bannerElem.innerHTML = `
        <div class="container demo-banner-content">
          <span class="badge-demo">● DEMO MODE</span>
          <span>
            Operating in sandboxed browser <code>localStorage</code> with 52 synthetic records. Cloud Firestore is paused.
          </span>
          <button class="banner-btn" onclick="CareerApp.switchToFirebasePrompt()" style="background-color: var(--blue-600); border-color: var(--blue-500);">
            🚀 Switch to Firebase Live
          </button>
          <button class="banner-btn" onclick="CareerApp.openFirebaseConfigModal()">
            ⚙️ Project Config
          </button>
          <button class="banner-btn" onclick="CareerApp.resetDemoDataPrompt()">
            🔄 Reset Demo Data
          </button>
        </div>
      `;
    } else {
      bannerElem.innerHTML = `
        <div class="container demo-banner-content">
          <span class="badge-live">● FIREBASE LIVE</span>
          <span>
            Connected to <strong>Google Cloud Firestore</strong> (Project: <code>${modeInfo.projectId}</code>). Authentication & data are live.
          </span>
          <button class="banner-btn" onclick="CareerApp.switchToDemoPrompt()">
            🔄 Switch to Demo Mode
          </button>
          <button class="banner-btn" onclick="CareerApp.openFirebaseConfigModal()">
            ⚙️ Cloud Settings
          </button>
        </div>
      `;
    }
  }

  /**
   * Explicit switch to Firebase Live Mode
   */
  function switchToFirebasePrompt() {
    if (confirm('Switch to Live Firebase Mode? Authentication and database operations will persist directly to Cloud Firestore (project: careerai-a4947).')) {
      if (window.FirebaseConfigManager) {
        window.FirebaseConfigManager.setAppMode('firebase');
        showToast('Switched to Live Firebase Mode!', 'success');
        setTimeout(() => location.reload(), 600);
      }
    }
  }

  /**
   * Explicit switch to In-Browser Demo Mode
   */
  function switchToDemoPrompt() {
    if (confirm('Switch to Browser Demo Mode? Offline mock data and localStorage will be used. No requests will be sent to Cloud Firestore.')) {
      if (window.FirebaseConfigManager) {
        window.FirebaseConfigManager.setAppMode('demo');
        showToast('Switched to Demo Mode (LocalStorage)', 'info');
        setTimeout(() => location.reload(), 600);
      }
    }
  }

  /**
   * Render consistent Navbar
   */
  function renderNavbar(activePage) {
    const navElem = document.getElementById('main-navbar');
    if (!navElem) return;

    const user = window.CareerAuth ? window.CareerAuth.getCurrentUser() : null;
    const isStudent = user && user.role === 'student';
    const isAdmin = user && user.role === 'admin';

    navElem.className = 'navbar';
    navElem.innerHTML = `
      <div class="container nav-container">
        <a href="index.html" class="brand-logo">
          <div class="brand-icon">CA</div>
          <span>Career<span style="color: var(--blue-600)">AI</span></span>
        </a>

        <ul class="nav-menu" id="nav-menu">
          ${user ? `
            <li class="nav-item"><a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
            <li class="nav-item"><a href="jobs.html" class="${activePage === 'jobs' ? 'active' : ''}">Job Explorer</a></li>
            <li class="nav-item"><a href="recommendations.html" class="${activePage === 'recommendations' ? 'active' : ''}">Recommendations</a></li>
            <li class="nav-item"><a href="skill-gap.html" class="${activePage === 'skill-gap' ? 'active' : ''}">Skill Gap</a></li>
            <li class="nav-item"><a href="algorithm-lab.html" class="${activePage === 'algorithm-lab' ? 'active' : ''}">Algorithm Lab</a></li>
            <li class="nav-item"><a href="applications.html" class="${activePage === 'applications' ? 'active' : ''}">Tracker</a></li>
            <li class="nav-item"><a href="saved-jobs.html" class="${activePage === 'saved-jobs' ? 'active' : ''}">Saved</a></li>
            ${isAdmin ? `<li class="nav-item"><a href="admin.html" class="${activePage === 'admin' ? 'active' : ''}" style="color: var(--rose-600); font-weight:700;">Admin Panel</a></li>` : ''}
          ` : `
            <li class="nav-item"><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
            <li class="nav-item"><a href="jobs.html" class="${activePage === 'jobs' ? 'active' : ''}">Job Explorer</a></li>
            <li class="nav-item"><a href="algorithm-lab.html" class="${activePage === 'algorithm-lab' ? 'active' : ''}">Algorithm Lab</a></li>
            <li class="nav-item"><a href="about.html" class="${activePage === 'about' ? 'active' : ''}">PBL Architecture</a></li>
          `}
        </ul>

        <div class="nav-actions">
          ${user ? `
            <div class="user-menu-pill" onclick="window.location.href='${user.role === 'admin' ? 'admin.html' : 'profile.html'}'" title="View Profile">
              <div class="user-avatar-circle">
                ${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <span>${(user.displayName || user.email).split(' ')[0]}</span>
              <span style="font-size: 0.72rem; color: var(--slate-400); margin-left: 2px;">
                (${user.role}${user.isDemo ? ' [demo]' : ''})
              </span>
            </div>
            <button class="btn btn-outline btn-sm" onclick="CareerApp.handleLogout()" title="Log out">
              Log out
            </button>
          ` : `
            <a href="login.html" class="btn btn-outline btn-sm">Log in</a>
            <a href="register.html" class="btn btn-primary btn-sm">Get Started</a>
          `}
          <button class="nav-mobile-toggle" onclick="CareerApp.toggleMobileMenu()" aria-label="Toggle navigation">
            ☰
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render consistent Footer
   */
  function renderFooter() {
    const footerElem = document.getElementById('main-footer');
    if (!footerElem) return;

    footerElem.className = 'footer';
    footerElem.innerHTML = `
      <div class="container footer-container">
        <div>
          <div style="font-weight: 700; color: var(--navy-900); margin-bottom: 0.25rem;">
            CareerAI — AI-Based Job Opportunity Recommendation System
          </div>
          <div style="font-size: 0.8rem; color: var(--slate-500);">
            B.Tech Artificial Intelligence Project-Based Learning (PBL) System.
            <br>
            Demonstrating Content-Based TF-IDF, Cosine Similarity, BFS, DFS, A* Search & Constraint Satisfaction.
          </div>
        </div>

        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="jobs.html">Jobs</a></li>
          <li><a href="algorithm-lab.html">Algorithm Lab</a></li>
          <li><a href="about.html">About & Methodology</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
        </ul>
      </div>
    `;
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('nav-menu');
    if (menu) {
      menu.classList.toggle('open');
    }
  }

  async function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
      await window.CareerAuth.logout();
      showToast('Logged out successfully', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    }
  }

  async function resetDemoDataPrompt() {
    if (confirm('Reset demo data to initial factory state? This will restore original sample jobs, demo applications, and default student profile.')) {
      if (window.CareerDB && window.CareerDB.resetDemoData) {
        await window.CareerDB.resetDemoData();
        showToast('Demo storage reset successfully!', 'success');
        setTimeout(() => location.reload(), 600);
      }
    }
  }

  /**
   * Firebase Configuration & Status Modal
   */
  function openFirebaseConfigModal() {
    let modal = document.getElementById('firebase-config-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'firebase-config-modal';
      modal.className = 'modal-backdrop';
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-header">
            <h3>⚙️ Firebase Environment & Cloud Firestore Status</h3>
            <button class="modal-close-btn" onclick="CareerApp.closeModal('firebase-config-modal')">&times;</button>
          </div>
          <div class="modal-body">
            <div id="fb-modal-status-badge" style="margin-bottom: 1rem; padding: 0.75rem; border-radius: var(--radius-md); font-size: 0.88rem;"></div>

            <p style="font-size: 0.85rem; color: var(--slate-600); margin-bottom: 1.25rem;">
              CareerAI is configured with Google Cloud Firestore and Firebase Authentication. You can inspect project identifiers, seed the initial dataset to Firestore, or toggle between Live and Demo modes.
            </p>
            
            <div class="form-group">
              <label class="form-label">Project ID</label>
              <input type="text" id="fb-projectId" class="form-control" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Auth Domain</label>
              <input type="text" id="fb-authDomain" class="form-control" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">API Key</label>
              <input type="text" id="fb-apiKey" class="form-control" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Storage Bucket</label>
              <input type="text" id="fb-storageBucket" class="form-control" readonly>
            </div>

            <!-- Cloud Firestore Seeding Action for Admins -->
            <div style="background-color: var(--slate-50); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-top: 1.25rem;">
              <div style="font-weight: 700; font-size: 0.88rem; color: var(--navy-900); margin-bottom: 0.35rem;">
                📦 Cloud Firestore Dataset Seeder
              </div>
              <p style="font-size: 0.8rem; color: var(--slate-500); margin-bottom: 0.75rem;">
                Seed all 52 synthetic benchmark jobs into your remote Cloud Firestore <code>/jobs</code> collection in one click.
              </p>
              <button class="btn btn-outline btn-sm" id="btn-seed-firestore" onclick="CareerApp.handleSeedFirestore()">
                Seed 52 Jobs to Cloud Firestore
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline btn-sm" id="modal-mode-toggle-btn" onclick="CareerApp.handleToggleModeFromModal()">
              Toggle Operating Mode
            </button>
            <button class="btn btn-primary btn-sm" onclick="CareerApp.closeModal('firebase-config-modal')">
              Done
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const currentCfg = window.FirebaseConfigManager ? window.FirebaseConfigManager.getActiveFirebaseConfig() : null;
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };

    const statusBadge = document.getElementById('fb-modal-status-badge');
    const toggleBtn = document.getElementById('modal-mode-toggle-btn');

    if (mode.isDemo) {
      statusBadge.style.backgroundColor = 'var(--blue-50)';
      statusBadge.style.border = '1px solid var(--blue-200)';
      statusBadge.style.color = 'var(--blue-700)';
      statusBadge.innerHTML = `<strong>Status:</strong> Currently in <strong>Demo Mode</strong>. Changes are stored in browser localStorage only.`;
      toggleBtn.textContent = 'Switch to Firebase Live Mode';
      toggleBtn.className = 'btn btn-primary btn-sm';
    } else {
      statusBadge.style.backgroundColor = 'var(--emerald-50)';
      statusBadge.style.border = '1px solid var(--emerald-200)';
      statusBadge.style.color = 'var(--emerald-700)';
      statusBadge.innerHTML = `<strong>Status:</strong> Currently in <strong>Firebase Live Mode</strong>. Connected to project <code>${mode.projectId}</code>.`;
      toggleBtn.textContent = 'Switch to Demo Mode';
      toggleBtn.className = 'btn btn-outline btn-sm';
    }

    if (currentCfg) {
      document.getElementById('fb-apiKey').value = currentCfg.apiKey || '';
      document.getElementById('fb-authDomain').value = currentCfg.authDomain || '';
      document.getElementById('fb-projectId').value = currentCfg.projectId || '';
      document.getElementById('fb-storageBucket').value = currentCfg.storageBucket || '';
    }

    openModal('firebase-config-modal');
  }

  function handleToggleModeFromModal() {
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
    if (mode.isDemo) {
      switchToFirebasePrompt();
    } else {
      switchToDemoPrompt();
    }
  }

  async function handleSeedFirestore() {
    const btn = document.getElementById('btn-seed-firestore');
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
    if (mode.isDemo) {
      alert('Please switch to Firebase Live Mode first before seeding to Cloud Firestore.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Seeding jobs to Firestore...';

    try {
      if (window.CareerDB && window.CareerDB.seedJobsToFirestore) {
        const count = await window.CareerDB.seedJobsToFirestore();
        showToast(`Successfully seeded ${count} jobs to Cloud Firestore!`, 'success');
        btn.textContent = '✓ 52 Jobs Seeded to Firestore';
      }
    } catch (err) {
      console.error(err);
      alert(`Firestore Seeding Error: ${err.message}`);
      btn.disabled = false;
      btn.textContent = 'Seed 52 Jobs to Cloud Firestore';
    }
  }

  /**
   * Format currency values to INR or readable string
   */
  function formatSalary(amount) {
    if (!amount) return 'Competitive';
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  }

  /**
   * Initialize page common components
   */
  function initPage(activePage) {
    renderDemoBanner();
    renderNavbar(activePage);
    renderFooter();

    if (window.CareerAuth) {
      window.CareerAuth.onAuthStateChange(() => {
        renderNavbar(activePage);
      });
    }
  }

  return {
    showToast,
    openModal,
    closeModal,
    renderDemoBanner,
    renderNavbar,
    renderFooter,
    toggleMobileMenu,
    handleLogout,
    resetDemoDataPrompt,
    openFirebaseConfigModal,
    switchToFirebasePrompt,
    switchToDemoPrompt,
    handleToggleModeFromModal,
    handleSeedFirestore,
    formatSalary,
    initPage
  };
});
