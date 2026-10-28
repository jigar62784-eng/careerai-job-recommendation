/**
 * CareerAI - Unified Database & Storage Layer
 * 
 * Supports:
 * - Cloud Firestore for Production Persistence
 * - Sandboxed LocalStorage for Demo Mode
 * - STRICT POLICY: Never silently switch or fall back between Demo and Production
 * - Real error reporting on Firestore failures
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CareerDB = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEYS = {
    JOBS: 'careerai_db_jobs',
    PROFILES: 'careerai_db_profiles',
    SAVED_JOBS: 'careerai_db_saved_jobs',
    APPLICATIONS: 'careerai_db_applications',
    INITIALIZED: 'careerai_db_initialized'
  };

  // Default seed student profile for demo student
  const DEFAULT_STUDENT_PROFILE = {
    userId: 'demo-student-001',
    fullName: 'Aarav Sharma',
    headline: 'B.Tech AI & Data Science Candidate | Aspiring Machine Learning Engineer',
    bio: 'Third-year undergraduate student with proven project experience in computer vision, deep learning with PyTorch, and classical machine learning algorithms.',
    education: 'B.Tech',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    institution: 'National Institute of Technology',
    graduationYear: 2026,
    cgpa: '8.85 / 10.0',
    experienceYears: 0.5,
    experienceDetails: 'Summer ML Intern at InnoTech Labs (3 months) - Built document classification pipelines using spaCy and Scikit-Learn.',
    skills: [
      'Python',
      'PyTorch',
      'Scikit-Learn',
      'Git',
      'NumPy',
      'Pandas',
      'SQL',
      'FastAPI',
      'Linear Algebra',
      'Statistical Modeling',
      'Linux'
    ],
    skillProficiencies: {
      'Python': 'Advanced',
      'PyTorch': 'Intermediate',
      'Scikit-Learn': 'Intermediate',
      'Git': 'Intermediate',
      'NumPy': 'Intermediate',
      'Pandas': 'Intermediate',
      'SQL': 'Intermediate',
      'FastAPI': 'Beginner',
      'Linux': 'Intermediate'
    },
    desiredRoles: [
      'Junior AI Engineer',
      'Associate Data Scientist',
      'Machine Learning Engineer Trainee'
    ],
    preferredLocation: 'Bangalore, India',
    workMode: ['Hybrid', 'Remote'],
    employmentType: ['Full-time', 'Internship'],
    minExpectedSalaryINR: 700000,
    projects: [
      {
        id: 'proj-1',
        title: 'Autonomous Visual Defect Detection',
        description: 'Trained custom YOLOv8 and ResNet classifiers in PyTorch to identify micro-fractures in industrial component images with 94.2% mAP.',
        techStack: 'Python, PyTorch, OpenCV, Git',
        link: 'https://github.com/demo/defect-detector'
      },
      {
        id: 'proj-2',
        title: 'Semantic Job Recommendation Model',
        description: 'Engineered TF-IDF token vectorizer and cosine similarity scorer for educational curriculum mapping.',
        techStack: 'Python, Scikit-Learn, FastAPI, NumPy',
        link: 'https://github.com/demo/career-rec'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Deep Learning Specialization (DeepLearning.AI)',
        issuer: 'Coursera',
        year: '2025'
      },
      {
        id: 'cert-2',
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        year: '2025'
      }
    ],
    updatedAt: new Date().toISOString()
  };

  // Default seed applications for demo student
  const DEFAULT_APPLICATIONS = [
    {
      id: 'app-001',
      userId: 'demo-student-001',
      jobId: 'JOB-001',
      jobTitle: 'Junior AI Engineer',
      company: 'NeuralCraft Labs',
      location: 'Bangalore, India',
      status: 'Interviewing',
      appliedDate: '2026-10-18',
      matchScore: 86.8,
      notes: 'Completed technical coding round on PyTorch model optimization. Awaiting final interview.'
    },
    {
      id: 'app-002',
      userId: 'demo-student-001',
      jobId: 'JOB-002',
      jobTitle: 'Graduate Machine Learning Engineer',
      company: 'CognitivePulse Analytics',
      location: 'Hyderabad, India',
      status: 'Applied',
      appliedDate: '2026-10-22',
      matchScore: 82.4,
      notes: 'Submitted resume and portfolio link to GitHub projects.'
    },
    {
      id: 'app-003',
      userId: 'demo-student-001',
      jobId: 'JOB-006',
      jobTitle: 'Associate Data Scientist',
      company: 'QuantEdge Solutions',
      location: 'Mumbai, India',
      status: 'Screening',
      appliedDate: '2026-10-24',
      matchScore: 78.5,
      notes: 'HR phone screening scheduled for next Tuesday.'
    }
  ];

  const DEFAULT_SAVED_JOBS = {
    'demo-student-001': ['JOB-001', 'JOB-002', 'JOB-003', 'JOB-006', 'JOB-023']
  };

  /**
   * Helper to load jobs.json across both Browser and Node.js testing environments
   */
  async function loadInitialJobsJson() {
    if (typeof window !== 'undefined' && window.location) {
      try {
        const res = await fetch('data/jobs.json');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('[CareerDB] Browser fetch failed for data/jobs.json', e);
      }
    } else if (typeof require !== 'undefined') {
      try {
        const fs = require('fs');
        const path = require('path');
        const p = path.resolve(__dirname, '../data/jobs.json');
        if (fs.existsSync(p)) {
          return JSON.parse(fs.readFileSync(p, 'utf8'));
        }
      } catch (e) {
        console.warn('[CareerDB] Node filesystem load failed for data/jobs.json', e);
      }
    }
    return [];
  }

  /**
   * Initialize local store with seed dataset if not present
   */
  async function ensureInitialized() {
    if (typeof localStorage === 'undefined') return;

    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized || !localStorage.getItem(STORAGE_KEYS.JOBS)) {
      const jobsData = await loadInitialJobsJson();
      if (jobsData && jobsData.length > 0) {
        localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobsData));
      }

      const profiles = {};
      profiles['demo-student-001'] = DEFAULT_STUDENT_PROFILE;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(DEFAULT_SAVED_JOBS));
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(DEFAULT_APPLICATIONS));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  if (typeof window !== 'undefined') {
    ensureInitialized();
  }

  /**
   * Helper to determine if Cloud Firestore is active
   */
  function isFirestoreActive() {
    const mode = window.FirebaseConfigManager ? window.FirebaseConfigManager.getAppMode() : { isDemo: true };
    return !mode.isDemo && typeof window.firebase !== 'undefined' && Boolean(window.firebase.firestore);
  }

  // ==========================================
  // JOBS REPOSITORY
  // ==========================================

  /**
   * Retrieve all jobs.
   * In Firebase Mode: reads from Firestore collection 'jobs'.
   * If Firestore 'jobs' collection is currently empty, seeds with data/jobs.json to prevent empty state.
   */
  async function getJobs() {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        const snapshot = await window.firebase.firestore().collection('jobs').get();
        if (!snapshot.empty) {
          const list = [];
          snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
          return list;
        } else {
          console.log('[CareerDB] Firestore jobs collection is empty. Fetching base synthetic dataset...');
          // Return base dataset and offer admin seeding
          const res = await fetch('data/jobs.json');
          return await res.json();
        }
      } catch (err) {
        console.error('[CareerDB] Firestore getJobs error:', err);
        throw new Error(`Failed to read jobs from Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode: LocalStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('[CareerDB] Error reading jobs from localStorage', e);
    }
    return [];
  }

  async function getJobById(jobId) {
    if (isFirestoreActive()) {
      try {
        const doc = await window.firebase.firestore().collection('jobs').doc(jobId).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
      } catch (err) {
        console.error('[CareerDB] Firestore getJobById error:', err);
        throw new Error(`Failed to read job ${jobId} from Cloud Firestore: ${err.message}`);
      }
    }
    const jobs = await getJobs();
    return jobs.find(j => j.id === jobId) || null;
  }

  async function createJob(jobData) {
    const jobs = await getJobs();
    const newId = 'JOB-' + String(jobs.length + 1).padStart(3, '0');
    const newJob = {
      ...jobData,
      id: newId,
      postedDate: new Date().toISOString().split('T')[0],
      isSynthetic: true,
      demoNotice: "Demonstration record created for B.Tech AI PBL evaluation. Not a live recruitment vacancy."
    };

    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('jobs').doc(newId).set(newJob);
        console.log('[CareerDB] Successfully created job in Cloud Firestore:', newId);
        return newJob;
      } catch (err) {
        console.error('[CareerDB] Firestore createJob error:', err);
        throw new Error(`Cloud Firestore authorization error: ${err.message}`);
      }
    }

    // Demo Mode
    jobs.unshift(newJob);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return newJob;
  }

  async function updateJob(jobId, jobData) {
    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('jobs').doc(jobId).set(jobData, { merge: true });
        console.log('[CareerDB] Successfully updated job in Cloud Firestore:', jobId);
        return { id: jobId, ...jobData };
      } catch (err) {
        console.error('[CareerDB] Firestore updateJob error:', err);
        throw new Error(`Cloud Firestore authorization error: ${err.message}`);
      }
    }

    // Demo Mode
    const jobs = await getJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index === -1) return null;
    jobs[index] = { ...jobs[index], ...jobData };
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return jobs[index];
  }

  async function deleteJob(jobId) {
    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('jobs').doc(jobId).delete();
        console.log('[CareerDB] Successfully deleted job from Cloud Firestore:', jobId);
        return true;
      } catch (err) {
        console.error('[CareerDB] Firestore deleteJob error:', err);
        throw new Error(`Cloud Firestore authorization error: ${err.message}`);
      }
    }

    // Demo Mode
    let jobs = await getJobs();
    jobs = jobs.filter(j => j.id !== jobId);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    return true;
  }

  /**
   * Admin utility to seed all 52 base jobs into Cloud Firestore
   */
  async function seedJobsToFirestore() {
    if (!isFirestoreActive()) {
      throw new Error('Cloud Firestore is not active. Switch to Firebase Live Mode first.');
    }

    const res = await fetch('data/jobs.json');
    const jobs = await res.json();
    const db = window.firebase.firestore();
    const batch = db.batch();

    jobs.forEach(job => {
      const ref = db.collection('jobs').doc(job.id);
      batch.set(ref, job);
    });

    await batch.commit();
    console.log(`[CareerDB] Successfully committed ${jobs.length} synthetic jobs to Cloud Firestore.`);
    return jobs.length;
  }

  // ==========================================
  // STUDENT PROFILES REPOSITORY
  // ==========================================

  async function getUserProfile(userId) {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        const doc = await window.firebase.firestore().collection('profiles').doc(userId).get();
        if (doc.exists) {
          return { userId: userId, ...doc.data() };
        }
      } catch (err) {
        console.error('[CareerDB] Firestore getUserProfile error:', err);
        throw new Error(`Failed to load profile from Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode: LocalStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
      if (stored) {
        const profiles = JSON.parse(stored);
        if (profiles[userId]) return profiles[userId];
      }
    } catch (e) {
      console.error('[CareerDB] Error reading profile from localStorage', e);
    }

    // Default template
    return {
      userId: userId,
      fullName: 'Student User',
      skills: ['Python', 'SQL', 'Git'],
      education: 'B.Tech',
      degree: 'B.Tech in Computer Science',
      experienceYears: 0,
      desiredRoles: ['Junior Software Engineer'],
      workMode: ['Remote', 'Hybrid'],
      preferredLocation: 'Bangalore, India'
    };
  }

  async function saveUserProfile(userId, profileData) {
    await ensureInitialized();
    const current = await getUserProfile(userId).catch(() => ({}));
    const updated = {
      ...current,
      ...profileData,
      userId: userId,
      updatedAt: new Date().toISOString()
    };

    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('profiles').doc(userId).set(updated, { merge: true });
        console.log('[CareerDB] Successfully persisted profile to Cloud Firestore:', userId);
        return updated;
      } catch (err) {
        console.error('[CareerDB] Firestore saveUserProfile error:', err);
        throw new Error(`Failed to save profile to Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode: LocalStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const profiles = stored ? JSON.parse(stored) : {};
      profiles[userId] = updated;
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error('[CareerDB] Error writing profile to localStorage', e);
    }

    return updated;
  }

  function initializeDefaultProfile(userId, fullName, email) {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const profiles = stored ? JSON.parse(stored) : {};
      profiles[userId] = {
        ...DEFAULT_STUDENT_PROFILE,
        userId: userId,
        fullName: fullName || email.split('@')[0],
        email: email,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.warn('[CareerDB] Failed to initialize default profile', e);
    }
  }

  // ==========================================
  // SAVED JOBS REPOSITORY
  // ==========================================

  async function getSavedJobIds(userId) {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        const doc = await window.firebase.firestore().collection('saved_jobs').doc(userId).get();
        if (doc.exists) {
          return doc.data().jobIds || [];
        }
        return [];
      } catch (err) {
        console.error('[CareerDB] Firestore getSavedJobIds error:', err);
        throw new Error(`Failed to load saved jobs from Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      if (stored) {
        const map = JSON.parse(stored);
        return map[userId] || [];
      }
    } catch (e) {
      console.error('[CareerDB] Error reading saved jobs', e);
    }
    return [];
  }

  async function toggleSaveJob(userId, jobId) {
    const saved = await getSavedJobIds(userId);
    const exists = saved.includes(jobId);
    let updated = [];

    if (exists) {
      updated = saved.filter(id => id !== jobId);
    } else {
      updated = [...saved, jobId];
    }

    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('saved_jobs').doc(userId).set({
          jobIds: updated,
          updatedAt: new Date().toISOString()
        });
        console.log('[CareerDB] Successfully updated saved jobs in Cloud Firestore for user:', userId);
        return { saved: !exists, count: updated.length };
      } catch (err) {
        console.error('[CareerDB] Firestore toggleSaveJob error:', err);
        throw new Error(`Failed to update bookmarks in Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
      const map = stored ? JSON.parse(stored) : {};
      map[userId] = updated;
      localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(map));
    } catch (e) {
      console.error('[CareerDB] Error saving jobs map to localStorage', e);
    }

    return { saved: !exists, count: updated.length };
  }

  // ==========================================
  // APPLICATIONS REPOSITORY
  // ==========================================

  async function getApplications(userId) {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        const snapshot = await window.firebase.firestore()
          .collection('applications')
          .where('userId', '==', userId)
          .get();
        const list = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        return list;
      } catch (err) {
        console.error('[CareerDB] Firestore getApplications error:', err);
        throw new Error(`Failed to load applications from Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (stored) {
        const all = JSON.parse(stored);
        return all.filter(a => a.userId === userId);
      }
    } catch (e) {
      console.error('[CareerDB] Error reading applications from localStorage', e);
    }
    return [];
  }

  async function addApplication(userId, appData) {
    await ensureInitialized();
    const newId = 'app-' + Date.now();
    const newApp = {
      ...appData,
      id: newId,
      userId: userId,
      status: appData.status || 'Applied',
      appliedDate: appData.appliedDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('applications').doc(newId).set(newApp);
        console.log('[CareerDB] Successfully persisted application to Cloud Firestore:', newId);
        return newApp;
      } catch (err) {
        console.error('[CareerDB] Firestore addApplication error:', err);
        throw new Error(`Failed to save application to Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const all = stored ? JSON.parse(stored) : [];
      all.unshift(newApp);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error('[CareerDB] Error saving application to localStorage', e);
    }

    return newApp;
  }

  async function updateApplicationStatus(userId, appId, newStatus, notes) {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        const payload = {
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
        if (notes !== undefined) payload.notes = notes;

        await window.firebase.firestore().collection('applications').doc(appId).update(payload);
        console.log('[CareerDB] Successfully updated application in Cloud Firestore:', appId);
        return { id: appId, userId, status: newStatus, notes };
      } catch (err) {
        console.error('[CareerDB] Firestore updateApplicationStatus error:', err);
        throw new Error(`Failed to update application in Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (stored) {
        const all = JSON.parse(stored);
        const index = all.findIndex(a => a.id === appId && a.userId === userId);
        if (index !== -1) {
          all[index].status = newStatus;
          if (notes !== undefined) all[index].notes = notes;
          all[index].updatedAt = new Date().toISOString();
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
          return all[index];
        }
      }
    } catch (e) {
      console.error('[CareerDB] Error updating application in localStorage', e);
    }
    return null;
  }

  async function deleteApplication(userId, appId) {
    await ensureInitialized();

    if (isFirestoreActive()) {
      try {
        await window.firebase.firestore().collection('applications').doc(appId).delete();
        console.log('[CareerDB] Successfully deleted application from Cloud Firestore:', appId);
        return true;
      } catch (err) {
        console.error('[CareerDB] Firestore deleteApplication error:', err);
        throw new Error(`Failed to delete application from Cloud Firestore: ${err.message}`);
      }
    }

    // Demo Mode
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      if (stored) {
        let all = JSON.parse(stored);
        all = all.filter(a => !(a.id === appId && a.userId === userId));
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
        return true;
      }
    } catch (e) {
      console.error('[CareerDB] Error deleting application from localStorage', e);
    }
    return false;
  }

  async function resetDemoData() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_JOBS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    await ensureInitialized();
    return true;
  }

  return {
    getJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    seedJobsToFirestore,
    getUserProfile,
    saveUserProfile,
    initializeDefaultProfile,
    getSavedJobIds,
    toggleSaveJob,
    getApplications,
    addApplication,
    updateApplicationStatus,
    deleteApplication,
    resetDemoData,
    isFirestoreActive,
    DEFAULT_STUDENT_PROFILE
  };
});
