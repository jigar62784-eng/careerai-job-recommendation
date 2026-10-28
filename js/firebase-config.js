/**
 * CareerAI - Firebase Configuration & Environment Manager
 * 
 * Provides:
 * - Active Firebase configuration with user's verified Firebase Project (careerai-a4947)
 * - Clear mode indicator: DEMO_MODE vs FIREBASE_PRODUCTION
 * - Explicit mode switching with zero silent fallbacks
 * - Safe Firebase SDK initialization
 */

// Active Project Credentials provided by user
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7tZGL40KYyAYKhSBuVwLslfrYo2yTF_k",
  authDomain: "careerai-a4947.firebaseapp.com",
  projectId: "careerai-a4947",
  storageBucket: "careerai-a4947.firebasestorage.app",
  messagingSenderId: "142840093345",
  appId: "1:142840093345:web:ab49605bebf726c9cf6ee0",
  measurementId: "G-PY404WWEY9"
};

const FIREBASE_CONFIG_STORAGE_KEY = 'careerai_firebase_config';
const APP_MODE_STORAGE_KEY = 'careerai_app_mode'; // 'firebase' | 'demo'

/**
 * Validate configuration structure
 */
function isValidFirebaseConfig(cfg) {
  if (!cfg) return false;
  if (!cfg.apiKey || !cfg.projectId || !cfg.authDomain) return false;
  if (cfg.apiKey.includes('YOUR_') || cfg.apiKey === '' || cfg.projectId.includes('your-project')) {
    return false;
  }
  return true;
}

/**
 * Get active Firebase configuration
 */
function getActiveFirebaseConfig() {
  if (typeof window !== 'undefined' && window.FIREBASE_CONFIG && isValidFirebaseConfig(window.FIREBASE_CONFIG)) {
    return window.FIREBASE_CONFIG;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isValidFirebaseConfig(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored Firebase config', e);
    }
  }
  // Default to the project's configured credentials
  if (isValidFirebaseConfig(DEFAULT_FIREBASE_CONFIG)) {
    return DEFAULT_FIREBASE_CONFIG;
  }
  return null;
}

/**
 * Determine the active operating mode
 * Strict rule: Never silently switch between Demo Mode and Firebase Mode!
 */
function getAppMode() {
  const cfg = getActiveFirebaseConfig();
  const explicitMode = typeof localStorage !== 'undefined' ? localStorage.getItem(APP_MODE_STORAGE_KEY) : null;

  // If user explicitly chose demo mode, respect it
  if (explicitMode === 'demo') {
    return {
      mode: 'DEMO_MODE',
      isDemo: true,
      label: 'Demo Mode (Sandboxed LocalStorage)',
      projectId: 'demo-local-store',
      statusNotice: 'Running in Demo Mode. Data is stored locally in your browser and is NOT synced to Firestore.'
    };
  }

  // If valid configuration exists and mode is not demo
  if (cfg && isValidFirebaseConfig(cfg)) {
    const isSdkAvailable = typeof window !== 'undefined' && typeof window.firebase !== 'undefined';
    return {
      mode: 'FIREBASE_PRODUCTION',
      isDemo: false,
      label: 'Firebase Live Mode (Cloud Firestore & Auth)',
      projectId: cfg.projectId,
      sdkLoaded: isSdkAvailable,
      statusNotice: `Connected to Cloud Firestore Project: ${cfg.projectId}. Authentication and data persist directly to Google Cloud.`
    };
  }

  return {
    mode: 'DEMO_MODE',
    isDemo: true,
    label: 'Demo Mode (No Configuration Found)',
    projectId: 'demo-local-store',
    statusNotice: 'Running in Demo Mode because no Firebase configuration was detected.'
  };
}

/**
 * Explicitly set the active operating mode
 */
function setAppMode(targetMode) {
  if (typeof localStorage !== 'undefined') {
    if (targetMode === 'demo') {
      localStorage.setItem(APP_MODE_STORAGE_KEY, 'demo');
    } else {
      localStorage.setItem(APP_MODE_STORAGE_KEY, 'firebase');
    }
  }
}

/**
 * Save Firebase configuration to browser storage
 */
function saveFirebaseConfig(config) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(config));
    localStorage.setItem(APP_MODE_STORAGE_KEY, 'firebase');
  }
}

/**
 * Clear custom configuration and revert to Demo Mode
 */
function clearFirebaseConfig() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(APP_MODE_STORAGE_KEY, 'demo');
  }
}

/**
 * Initialize Firebase App & SDK if available and in Firebase Mode
 */
function initFirebaseApp() {
  const mode = getAppMode();
  if (mode.isDemo) {
    return null;
  }

  if (typeof window !== 'undefined' && typeof window.firebase !== 'undefined') {
    try {
      const config = getActiveFirebaseConfig();
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(config);
        console.log('[CareerAI] Firebase App initialized successfully. Project:', config.projectId);
      }
      return {
        app: window.firebase.app(),
        auth: window.firebase.auth(),
        firestore: window.firebase.firestore()
      };
    } catch (err) {
      console.error('[CareerAI] Error initializing Firebase SDK:', err);
      return null;
    }
  } else {
    console.warn('[CareerAI] Firebase SDK not loaded in DOM yet.');
    return null;
  }
}

// Auto-trigger initialization on script load if SDK is ready
if (typeof window !== 'undefined') {
  window.FirebaseConfigManager = {
    isValidFirebaseConfig,
    getActiveFirebaseConfig,
    saveFirebaseConfig,
    clearFirebaseConfig,
    getAppMode,
    setAppMode,
    initFirebaseApp,
    DEFAULT_CONFIG_TEMPLATE: DEFAULT_FIREBASE_CONFIG
  };

  // Attempt early initialization
  if (typeof window.firebase !== 'undefined') {
    initFirebaseApp();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_FIREBASE_CONFIG,
    isValidFirebaseConfig,
    getActiveFirebaseConfig,
    getAppMode,
    setAppMode
  };
}
