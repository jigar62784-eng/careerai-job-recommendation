/**
 * Live test to verify real registration, login, token retrieval,
 * and Firestore operations against Google Cloud Firebase project careerai-a4947
 */

const https = require('https');

const apiKey = "AIzaSyD7tZGL40KYyAYKhSBuVwLslfrYo2yTF_k";
const projectId = "careerai-a4947";

function requestJson(url, method, payload, token) {
  return new Promise((resolve) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = JSON.parse(data); } catch(e) { parsed = data; }
        resolve({
          statusCode: res.statusCode,
          data: parsed
        });
      });
    });

    req.on('error', (err) => {
      resolve({ error: err.message });
    });

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

async function runLiveTest() {
  console.log("=== LIVE VERIFICATION: FIREBASE AUTH & CLOUD FIRESTORE ===");
  console.log("Project: " + projectId);

  const testEmail = `verify_${Date.now()}@careerai.demo`;
  const testPassword = "LiveVerification123!";

  console.log(`\n[STEP 1] Testing Real User Registration via Firebase Auth API...`);
  console.log(`Target Email: ${testEmail}`);

  const signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
  const signupRes = await requestJson(signupUrl, 'POST', {
    email: testEmail,
    password: testPassword,
    returnSecureToken: true
  });

  console.log("Signup HTTP Status:", signupRes.statusCode);
  if (signupRes.statusCode !== 200) {
    console.error("Signup failed:", signupRes.data);
    return;
  }

  const { idToken, localId, email } = signupRes.data;
  console.log("✓ Real User Created Successfully in Firebase Auth!");
  console.log("  UID:", localId);
  console.log("  Email:", email);
  console.log("  ID Token (JWT) acquired:", idToken.substring(0, 30) + "...");

  console.log(`\n[STEP 2] Testing Real User Login via Firebase Auth API...`);
  const loginUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const loginRes = await requestJson(loginUrl, 'POST', {
    email: testEmail,
    password: testPassword,
    returnSecureToken: true
  });

  console.log("Login HTTP Status:", loginRes.statusCode);
  if (loginRes.statusCode === 200) {
    console.log("✓ Real User Login Succeeded! ID Token refreshed.");
  } else {
    console.error("Login failed:", loginRes.data);
  }

  console.log(`\n[STEP 3] Testing Real Cloud Firestore Write using User's ID Token...`);
  // Try writing to /users/{localId}
  const firestoreUserDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${localId}?key=${apiKey}`;
  const docPayload = {
    fields: {
      uid: { stringValue: localId },
      email: { stringValue: testEmail },
      role: { stringValue: "student" },
      createdAt: { stringValue: new Date().toISOString() }
    }
  };

  const docRes = await requestJson(firestoreUserDocUrl, 'PATCH', docPayload, idToken);
  console.log("Firestore User Doc Write Status:", docRes.statusCode);
  if (docRes.statusCode === 200) {
    console.log("✓ Firestore Write to /users/" + localId + " Succeeded!");
    console.log("  Document Path:", docRes.data.name);
  } else {
    console.log("Firestore response:", docRes.data);
  }

  console.log(`\n[STEP 4] Testing Real Cloud Firestore Write to /profiles/${localId}...`);
  const firestoreProfileDocUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/profiles/${localId}?key=${apiKey}`;
  const profilePayload = {
    fields: {
      userId: { stringValue: localId },
      fullName: { stringValue: "Live Test Candidate" },
      degree: { stringValue: "B.Tech in Artificial Intelligence" },
      graduationYear: { integerValue: 2026 }
    }
  };

  const profileRes = await requestJson(firestoreProfileDocUrl, 'PATCH', profilePayload, idToken);
  console.log("Firestore Profile Doc Write Status:", profileRes.statusCode);
  if (profileRes.statusCode === 200) {
    console.log("✓ Firestore Write to /profiles/" + localId + " Succeeded!");
    console.log("  Document Path:", profileRes.data.name);
  } else {
    console.log("Firestore response:", profileRes.data);
  }

  console.log(`\n[STEP 5] Testing Real Cloud Firestore Read from /profiles/${localId}...`);
  const readRes = await requestJson(firestoreProfileDocUrl, 'GET', null, idToken);
  console.log("Firestore Profile Doc Read Status:", readRes.statusCode);
  if (readRes.statusCode === 200) {
    console.log("✓ Firestore Read Succeeded! Data retrieved from Google Cloud:");
    console.log("  FullName:", readRes.data.fields.fullName.stringValue);
    console.log("  Degree:", readRes.data.fields.degree.stringValue);
  }

  console.log(`\n[STEP 6] Cleaning up test user from Firebase Auth...`);
  const deleteUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${apiKey}`;
  const deleteRes = await requestJson(deleteUrl, 'POST', { idToken: idToken });
  console.log("User Cleanup Status:", deleteRes.statusCode);
  if (deleteRes.statusCode === 200) {
    console.log("✓ Test user deleted cleanly from Firebase Auth.");
  }

  console.log("\n==================================================");
  console.log("  LIVE GOOGLE CLOUD FIREBASE VERIFICATION COMPLETE ");
  console.log("==================================================");
}

runLiveTest();
