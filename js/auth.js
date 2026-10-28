/**
 * CareerAI - Authentication Service
 * 
 * Supports:
 * 1. Firebase Authentication with Cloud Firestore user registry
 * 2. In-Browser Demo Mode for offline evaluation
 * 3. Never silently switches between Demo and Firebase mode
 * 4. Genuine role-based authorization for administrative operations
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CareerAuth = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const DEMO_USER_SESSION_KEY = 'careerai_demo_session';
  const DEMO_ACCOUNTS_KEY = 'careerai_demo_accounts';

  // Seed default demo accounts for Demo Mode
  const DEFAULT_DEMO_ACCOUNTS = [
    {
      uid: 'demo-student-001',
      email: 'student@careerai.demo',
      password: 'demo123',
      displayName: 'Aarav Sharma',
      role: 'student',
      isDemo: true
    },
    {
      uid: 'demo-admin-001',
      email: 'admin@careerai.demo',
      password: 'admin123',
      displayName: 'Dr. Neha Kapoor (Faculty / Admin)',
      role: 'admin',
      isDemo: true
    }
  ];

  function getDemoAccounts() {
    try {
      const stored = localStorage.getItem(DEMO_ACCOUNTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('[CareerAuth] Error reading demo accounts', e);
    }
    localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(DEFAULT_DEMO_ACCOUNTS));
    return DEFAULT_DEMO_ACCOUNTS;
  }

  function saveDemoAccounts(accounts) {
    localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  const authListeners = [];

  function notifyAuthListeners(user) {
    authListeners.forEach(fn => {
      try { fn(user); } catch (e) { console.error('[CareerAuth] Auth listener error', e); }
    });
  }

  /**
   * Translate Firebase Auth error codes into human-readable guidance
   */
  function formatAuthError(err) {
    if (!err) return 'Authentication failed. Please try again.';
    const code = err.code || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'Incorrect password or credentials. Please check and try again.';
      case 'auth/user-not-found':
        return 'No registered account found with this email. Please click "Register as Student".';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please log in.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/network-request-failed':
        return 'Network connection to Firebase failed. Check your internet connectivity.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Access temporarily restricted. Try again later.';
      default:
        return err.message || 'Authentication error occurred.';
    }
  }

  /**
   * Get current authenticated user (synchronous from active session)
   */
  function getCurrentUser() {
    if (typeof localStorage === 'undefined') return null;
    try {
      const session = localStorage.getItem(DEMO_USER_SESSION_KEY);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.warn('[CareerAuth] Error parsing user session', e);
    }
    return null;
  }

  /**
   * Fetch user document from Firestore to verify real role
   */
  async function fetchUserRoleFromFirestore(uid) {
    if (typeof window.firebase === 'undefined' || !window.firebase.firestore) return 'student';
    try {
      const doc = await window.firebase.firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        return doc.data().role || 'student';
      }
    } catch (e) {
      console.warn('[CareerAuth] Failed to fetch role from Firestore, defaulting to student:', e);
    }
    return 'student';
  }

  /**
   * Log in user with email and password
   * Explicitly separates Demo Mode vs Firebase Mode
   */
  async function login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };

    // --- FIREBASE LIVE MODE ---
    if (!mode.isDemo) {
      if (typeof window.firebase === 'undefined' || !window.firebase.auth) {
        return {
          success: false,
          error: 'Firebase SDK not ready. Please refresh or verify network access to Firebase CDN.'
        };
      }

      try {
        const userCredential = await window.firebase.auth().signInWithEmailAndPassword(cleanEmail, password);
        const fbUser = userCredential.user;

        // Check for trusted custom claims on the user's ID token
        let role = 'student';
        try {
          const idTokenResult = await fbUser.getIdTokenResult();
          if (idTokenResult.claims && idTokenResult.claims.admin === true) {
            role = 'admin';
          } else {
            // Fetch registered role from Firestore /users/{uid}
            role = await fetchUserRoleFromFirestore(fbUser.uid);
          }
        } catch (claimErr) {
          console.warn('[CareerAuth] Error checking custom claims, checking user registry:', claimErr);
          role = await fetchUserRoleFromFirestore(fbUser.uid);
        }

        const userObj = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || cleanEmail.split('@')[0],
          role: role,
          isDemo: false
        };

        localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(userObj));
        notifyAuthListeners(userObj);
        return { success: true, user: userObj };

      } catch (err) {
        console.error('[CareerAuth] Firebase Auth sign-in failed:', err);
        // STRICT RULE: Never silently fallback to demo on live Firebase error!
        return {
          success: false,
          error: formatAuthError(err),
          code: err.code
        };
      }
    }

    // --- DEMO MODE ---
    const accounts = getDemoAccounts();
    const match = accounts.find(a => a.email.toLowerCase() === cleanEmail && a.password === password);
    if (match) {
      const userObj = {
        uid: match.uid,
        email: match.email,
        displayName: match.displayName,
        role: match.role || 'student',
        isDemo: true
      };
      localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(userObj));
      notifyAuthListeners(userObj);
      return { success: true, user: userObj };
    }

    return {
      success: false,
      error: 'Invalid email or password in Demo Mode. Use student@careerai.demo (pw: demo123) or click "1-Click Student Demo Login".'
    };
  }

  /**
   * Sign up new user
   * Explicitly separates Demo Mode vs Firebase Mode
   */
  async function signup(displayName, email, password, role = 'student') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password || password.length < 6) {
      return { success: false, error: 'Valid email and password (minimum 6 characters) are required.' };
    }

    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };

    // --- FIREBASE LIVE MODE ---
    if (!mode.isDemo) {
      if (typeof window.firebase === 'undefined' || !window.firebase.auth) {
        return {
          success: false,
          error: 'Firebase SDK not ready. Please refresh or check your internet connection.'
        };
      }

      try {
        const userCredential = await window.firebase.auth().createUserWithEmailAndPassword(cleanEmail, password);
        const fbUser = userCredential.user;

        // Set user profile display name
        if (displayName) {
          await fbUser.updateProfile({ displayName: displayName });
        }

        // Check for trusted admin claim (newly registered users default to student unless custom claim exists)
        let assignedRole = 'student';
        try {
          const idTokenResult = await fbUser.getIdTokenResult();
          if (idTokenResult.claims && idTokenResult.claims.admin === true) {
            assignedRole = 'admin';
          } else if (role && role !== 'admin') {
            assignedRole = role;
          }
        } catch (claimErr) {
          assignedRole = 'student';
        }

        // Create user document in Firestore `/users/{uid}`
        if (window.firebase.firestore) {
          try {
            await window.firebase.firestore().collection('users').doc(fbUser.uid).set({
              uid: fbUser.uid,
              email: cleanEmail,
              displayName: displayName || cleanEmail.split('@')[0],
              role: assignedRole,
              createdAt: new Date().toISOString()
            });
          } catch (docErr) {
            console.error('[CareerAuth] Failed to write Firestore user document:', docErr);
            // Throw so caller knows Firestore failed
            throw new Error(`Firestore user registry error: ${docErr.message}`);
          }
        }

        const userObj = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: displayName || cleanEmail.split('@')[0],
          role: assignedRole,
          isDemo: false
        };

        localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(userObj));
        notifyAuthListeners(userObj);
        return { success: true, user: userObj };

      } catch (err) {
        console.error('[CareerAuth] Firebase Auth signup failed:', err);
        return {
          success: false,
          error: formatAuthError(err),
          code: err.code
        };
      }
    }

    // --- DEMO MODE ---
    const accounts = getDemoAccounts();
    if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists in Demo storage.' };
    }

    const newUid = 'demo-user-' + Date.now();
    const newUser = {
      uid: newUid,
      email: cleanEmail,
      password: password,
      displayName: displayName || cleanEmail.split('@')[0],
      role: role,
      isDemo: true
    };
    accounts.push(newUser);
    saveDemoAccounts(accounts);

    const sessionObj = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      isDemo: true
    };
    localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(sessionObj));

    if (window.CareerDB && window.CareerDB.initializeDefaultProfile) {
      window.CareerDB.initializeDefaultProfile(newUser.uid, newUser.displayName, newUser.email);
    }

    notifyAuthListeners(sessionObj);
    return { success: true, user: sessionObj };
  }

  /**
   * Fast 1-click Demo login as Student (Explicitly switches to Demo Mode if selected)
   */
  function loginAsDemoStudent() {
    if (window.FirebaseConfigManager) {
      window.FirebaseConfigManager.setAppMode('demo');
    }
    const student = getDemoAccounts().find(a => a.role === 'student') || DEFAULT_DEMO_ACCOUNTS[0];
    const sessionObj = {
      uid: student.uid,
      email: student.email,
      displayName: student.displayName,
      role: 'student',
      isDemo: true
    };
    localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(sessionObj));
    notifyAuthListeners(sessionObj);
    return sessionObj;
  }

  /**
   * Fast 1-click Demo login as Admin
   */
  function loginAsDemoAdmin() {
    if (window.FirebaseConfigManager) {
      window.FirebaseConfigManager.setAppMode('demo');
    }
    const admin = getDemoAccounts().find(a => a.role === 'admin') || DEFAULT_DEMO_ACCOUNTS[1];
    const sessionObj = {
      uid: admin.uid,
      email: admin.email,
      displayName: admin.displayName,
      role: 'admin',
      isDemo: true
    };
    localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(sessionObj));
    notifyAuthListeners(sessionObj);
    return sessionObj;
  }

  /**
   * Log out active user
   */
  async function logout() {
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
    if (!mode.isDemo && typeof window.firebase !== 'undefined' && window.firebase.auth) {
      try {
        await window.firebase.auth().signOut();
      } catch (e) {
        console.warn('[CareerAuth] Firebase signout warning', e);
      }
    }
    localStorage.removeItem(DEMO_USER_SESSION_KEY);
    notifyAuthListeners(null);
    return { success: true };
  }

  /**
   * Protect routes with verified role checks
   */
  async function requireAuth(requiredRole, redirectUrl = 'login.html') {
    const user = getCurrentUser();
    if (!user) {
      window.location.href = redirectUrl + '?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }

    // Role check
    if (requiredRole && requiredRole === 'admin') {
      // In Firebase mode, re-verify role directly against Cloud Firestore
      const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
      if (!mode.isDemo && window.firebase && window.firebase.firestore) {
        try {
          const verifiedRole = await fetchUserRoleFromFirestore(user.uid);
          if (verifiedRole !== 'admin') {
            alert('Access Denied: Your authenticated account does not possess administrator privileges in Cloud Firestore.');
            window.location.href = 'dashboard.html';
            return false;
          }
        } catch (e) {
          alert('Could not verify administrator permissions in Cloud Firestore.');
          window.location.href = 'dashboard.html';
          return false;
        }
      } else if (user.role !== 'admin') {
        alert('Access Denied: This console requires administrator privileges.');
        window.location.href = 'dashboard.html';
        return false;
      }
    }

    return true;
  }

  /**
   * Subscribe to auth changes
   */
  function onAuthStateChange(callback) {
    if (typeof callback === 'function') {
      authListeners.push(callback);
      // Trigger immediately with current user
      callback(getCurrentUser());
    }
  }

  // Bind Firebase SDK native onAuthStateChanged listener if in Firebase mode
  function bindFirebaseAuthStateListener() {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.auth) {
      window.firebase.auth().onAuthStateChanged(async (fbUser) => {
        const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
        if (mode.isDemo) return; // Do not overwrite demo session

        if (fbUser) {
          const role = await fetchUserRoleFromFirestore(fbUser.uid);
          const userObj = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email.split('@')[0],
            role: role,
            isDemo: false
          };
          localStorage.setItem(DEMO_USER_SESSION_KEY, JSON.stringify(userObj));
          notifyAuthListeners(userObj);
        } else {
          // If in Firebase mode and user is null in Firebase Auth, clear session
          const current = getCurrentUser();
          if (current && !current.isDemo) {
            localStorage.removeItem(DEMO_USER_SESSION_KEY);
            notifyAuthListeners(null);
          }
        }
      });
    }
  }

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Attempt binding when DOM loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindFirebaseAuthStateListener);
    } else {
      bindFirebaseAuthStateListener();
    }
  }

  return {
    getCurrentUser,
    login,
    signup,
    loginAsDemoStudent,
    loginAsDemoAdmin,
    logout,
    requireAuth,
    onAuthStateChange,
    formatAuthError,
    fetchUserRoleFromFirestore
  };
});
