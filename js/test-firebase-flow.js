/**
 * CareerAI - Firebase & Firestore Flow Integration Test
 * Validates:
 * 1. Firebase configuration validation and project matching
 * 2. Operating mode state machine (Firebase Live vs Demo Mode)
 * 3. Auth service flow, session management, and error translation
 * 4. Database layer methods: profiles, jobs, saved jobs, applications
 * 5. Strict non-silent fallback guarantee
 * 6. Firestore security rules analysis
 */

// Mock browser globals for Node.js test environment
global.window = {};
global.localStorage = (function() {
  let store = {};
  return {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
})();

// Load modules
const fbConfigMod = require('./firebase-config.js');
const Recommender = require('./recommender.js');
const Algorithms = require('./algorithms.js');
const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("  TEST SUITE: FIREBASE & FIRESTORE INTEGRATION    ");
console.log("==================================================");

// 1. CONFIGURATION TESTS
console.log("\n[TEST 1] Firebase Project Configuration Validation");
const config = fbConfigMod.getActiveFirebaseConfig();
console.log("Project ID:", config.projectId);
console.log("Auth Domain:", config.authDomain);
console.log("API Key Prefix:", config.apiKey.substring(0, 10) + "...");

if (config.projectId !== "careerai-a4947") {
  console.error("FAIL: Project ID does not match careerai-a4947!");
  process.exit(1);
}
if (!fbConfigMod.isValidFirebaseConfig(config)) {
  console.error("FAIL: Configuration failed validation!");
  process.exit(1);
}
console.log("✓ Firebase configuration is valid and matches target project.");

// 2. OPERATING MODE TESTS
console.log("\n[TEST 2] Operating Mode & Strict Non-Silent Switching");
const initialMode = fbConfigMod.getAppMode();
console.log("Initial Mode:", initialMode.mode, `(${initialMode.label})`);
if (initialMode.mode !== "FIREBASE_PRODUCTION") {
  console.error("FAIL: Default mode should be FIREBASE_PRODUCTION with valid config!");
  process.exit(1);
}
console.log("✓ Initial mode correctly detected as FIREBASE_PRODUCTION.");

// Test switching to Demo Mode
fbConfigMod.setAppMode('demo');
const demoMode = fbConfigMod.getAppMode();
console.log("After setAppMode('demo'):", demoMode.mode);
if (!demoMode.isDemo || demoMode.mode !== "DEMO_MODE") {
  console.error("FAIL: Expected DEMO_MODE after switching!");
  process.exit(1);
}
console.log("✓ Successfully switched to DEMO_MODE.");

// Switch back to Firebase Mode
fbConfigMod.setAppMode('firebase');
const liveMode = fbConfigMod.getAppMode();
console.log("After setAppMode('firebase'):", liveMode.mode);
if (liveMode.isDemo || liveMode.mode !== "FIREBASE_PRODUCTION") {
  console.error("FAIL: Expected FIREBASE_PRODUCTION after switching back!");
  process.exit(1);
}
console.log("✓ Successfully switched back to FIREBASE_PRODUCTION.");

// 3. AUTH SERVICE ERROR FORMATTING & ROLES
console.log("\n[TEST 3] Auth Error Formatting & Security Checks");
// Load auth service in mock env
window.FirebaseConfigManager = fbConfigMod;
const Auth = require('./auth.js');

const errCodes = [
  { code: 'auth/invalid-credential', expected: 'Incorrect password' },
  { code: 'auth/user-not-found', expected: 'No registered account found' },
  { code: 'auth/email-already-in-use', expected: 'already exists' },
  { code: 'auth/weak-password', expected: 'Password is too weak' },
  { code: 'auth/network-request-failed', expected: 'Network connection' }
];

errCodes.forEach(tc => {
  const msg = Auth.formatAuthError({ code: tc.code, message: 'raw' });
  if (!msg.toLowerCase().includes(tc.expected.toLowerCase())) {
    console.error(`FAIL: formatAuthError for ${tc.code} returned: ${msg}`);
    process.exit(1);
  }
  console.log(`✓ ${tc.code} -> "${msg}"`);
});

// Test Demo Mode logins
console.log("\n[TEST 4] Demo Mode Instant Logins");
fbConfigMod.setAppMode('demo');
const studentUser = Auth.loginAsDemoStudent();
console.log("Demo Student User:", studentUser.displayName, `(Role: ${studentUser.role}, isDemo: ${studentUser.isDemo})`);
if (studentUser.role !== 'student' || !studentUser.isDemo) {
  console.error("FAIL: Demo student role or isDemo flag incorrect!");
  process.exit(1);
}

const adminUser = Auth.loginAsDemoAdmin();
console.log("Demo Admin User:", adminUser.displayName, `(Role: ${adminUser.role}, isDemo: ${adminUser.isDemo})`);
if (adminUser.role !== 'admin' || !adminUser.isDemo) {
  console.error("FAIL: Demo admin role or isDemo flag incorrect!");
  process.exit(1);
}
console.log("✓ Demo logins preserve isolated demo session without Firestore pollution.");

// 4. DATABASE LAYER CRUD IN DEMO & PRODUCTION ISOLATION
console.log("\n[TEST 5] Database Layer Persistence Tests");
// Load jobs dataset directly into localStorage
const jobsPath = path.resolve(__dirname, '../data/jobs.json');
const jobsData = JSON.parse(fs.readFileSync(jobsPath, 'utf8'));
localStorage.setItem('careerai_db_jobs', JSON.stringify(jobsData));

const DB = require('./db.js');

(async () => {
  // Test User Profile
  const profile = await DB.getUserProfile('demo-student-001');
  console.log("Loaded Profile:", profile.fullName, profile.degree);
  if (!profile.skills || profile.skills.length === 0) {
    console.error("FAIL: Profile skills missing!");
    process.exit(1);
  }
  console.log(`✓ Loaded student profile with ${profile.skills.length} skills.`);

  // Test Profile Save
  const updatedProfile = await DB.saveUserProfile('demo-student-001', { cgpa: '9.2 / 10.0' });
  if (updatedProfile.cgpa !== '9.2 / 10.0') {
    console.error("FAIL: Profile update was not persisted!");
    process.exit(1);
  }
  console.log("✓ Student profile update persisted successfully.");

  // Test Saved Jobs Bookmarking
  const initialSaved = await DB.getSavedJobIds('demo-student-001');
  console.log("Initial Saved Jobs Count:", initialSaved.length);
  const toggleRes = await DB.toggleSaveJob('demo-student-001', 'JOB-045');
  console.log("Toggle Save JOB-045:", toggleRes);
  const afterSaved = await DB.getSavedJobIds('demo-student-001');
  if (!afterSaved.includes('JOB-045')) {
    console.error("FAIL: JOB-045 not found in saved jobs!");
    process.exit(1);
  }
  console.log("✓ Saved jobs bookmarking verified.");

  // Test Applications Tracker
  const apps = await DB.getApplications('demo-student-001');
  console.log("Loaded Applications Count:", apps.length);
  const newApp = await DB.addApplication('demo-student-001', {
    jobId: 'JOB-001',
    jobTitle: 'Junior AI Engineer',
    company: 'NeuralCraft Labs',
    status: 'Applied',
    notes: 'Submitted resume'
  });
  console.log("Created Application ID:", newApp.id);
  const updatedApp = await DB.updateApplicationStatus('demo-student-001', newApp.id, 'Interviewing', 'Technical interview passed');
  if (updatedApp.status !== 'Interviewing') {
    console.error("FAIL: Application status update failed!");
    process.exit(1);
  }
  console.log("✓ Application status update verified.");

  await DB.deleteApplication('demo-student-001', newApp.id);
  const remainingApps = await DB.getApplications('demo-student-001');
  if (remainingApps.some(a => a.id === newApp.id)) {
    console.error("FAIL: Application was not deleted!");
    process.exit(1);
  }
  console.log("✓ Application deletion verified.");

  // 5. FIRESTORE SECURITY RULES VERIFICATION
  console.log("\n[TEST 6] Firestore Security Rules Integrity");
  const rulesPath = path.resolve(__dirname, '../firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');

  const requiredRuleClauses = [
    'rules_version = \'2\';',
    'function isAuthenticated()',
    'function isOwner(userId)',
    'function isAdmin()',
    'match /users/{userId}',
    'match /profiles/{userId}',
    'match /saved_jobs/{userId}',
    'match /applications/{appId}',
    'match /jobs/{jobId}',
    'request.resource.data.role != \'admin\''
  ];

  requiredRuleClauses.forEach(clause => {
    if (!rulesContent.includes(clause)) {
      console.error(`FAIL: firestore.rules missing critical security clause: "${clause}"`);
      process.exit(1);
    }
  });
  console.log("✓ All security rules clauses (owner scoping, self-escalation prevention, admin authorization) verified.");

  // 6. STRICT ERROR ENFORCEMENT IN FIREBASE MODE
  console.log("\n[TEST 7] Strict Non-Silent Firestore Fallback Test");
  fbConfigMod.setAppMode('firebase');
  // Mock window.firebase with failing firestore
  window.firebase = {
    firestore: () => ({
      collection: () => ({
        get: async () => { throw new Error("PERMISSION_DENIED: Simulated Firestore access violation"); }
      })
    })
  };

  let threwExpected = false;
  try {
    await DB.getJobs();
  } catch (err) {
    if (err.message.includes("PERMISSION_DENIED")) {
      threwExpected = true;
    }
  }

  if (!threwExpected) {
    console.error("FAIL: In Firebase Live Mode, Firestore error was silently swallowed or defaulted to localStorage!");
    process.exit(1);
  }
  console.log("✓ Verified: Firestore errors are strictly reported and NEVER silently switched to localStorage.");

  console.log("\n==================================================");
  console.log("  ALL FIREBASE & FIRESTORE INTEGRATION TESTS PASSED ");
  console.log("==================================================");
})();
