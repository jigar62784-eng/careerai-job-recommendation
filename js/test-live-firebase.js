/**
 * Live test to verify real Google Cloud Firebase endpoints for project careerai-a4947
 */

const https = require('https');

const apiKey = "AIzaSyD7tZGL40KYyAYKhSBuVwLslfrYo2yTF_k";
const projectId = "careerai-a4947";

function testEndpoint(name, url, options, postData) {
  return new Promise((resolve) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          name,
          statusCode: res.statusCode,
          headers: res.headers,
          body: body.substring(0, 500)
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name,
        error: err.message,
        code: err.code
      });
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function run() {
  console.log("=== PROBING REAL GOOGLE FIREBASE ENDPOINTS FOR project: " + projectId + " ===");

  // 1. Test Firebase Auth endpoint
  const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  const authRes = await testEndpoint(
    "Firebase Auth (SignIn probe)",
    authUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    },
    JSON.stringify({
      email: "probe_nonexistent_user@careerai.demo",
      password: "TestPassword123!",
      returnSecureToken: true
    })
  );

  console.log("\n1. Firebase Auth Probe Result:");
  console.log(authRes);

  // 2. Test Cloud Firestore REST endpoint
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/jobs?key=${apiKey}`;
  const firestoreRes = await testEndpoint(
    "Cloud Firestore (jobs collection probe)",
    firestoreUrl,
    { method: 'GET' }
  );

  console.log("\n2. Cloud Firestore Probe Result:");
  console.log(firestoreRes);
}

run();
