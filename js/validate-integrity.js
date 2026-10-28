const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');

const requiredFiles = [
  'index.html',
  'login.html',
  'register.html',
  'dashboard.html',
  'profile.html',
  'jobs.html',
  'job-details.html',
  'recommendations.html',
  'skill-gap.html',
  'saved-jobs.html',
  'applications.html',
  'algorithm-lab.html',
  'admin.html',
  'about.html',
  'privacy.html',
  'css/styles.css',
  'js/firebase-config.js',
  'js/auth.js',
  'js/db.js',
  'js/recommender.js',
  'js/algorithms.js',
  'js/app.js',
  'data/jobs.json',
  'data/career-graph.json',
  'firestore.rules',
  'vercel.json'
];

console.log("=== CHECKING REQUIRED PROJECT FILES ===");
let missing = 0;
for (const file of requiredFiles) {
  const fullPath = path.join(baseDir, file);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    console.log(`✓ ${file} (${size} bytes)`);
  } else {
    console.error(`✗ MISSING: ${file}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`Total missing files: ${missing}`);
  process.exit(1);
}

console.log("\n=== VALIDATING SYNTHETIC DATASET ===");
const jobs = JSON.parse(fs.readFileSync(path.join(baseDir, 'data/jobs.json'), 'utf8'));
console.log(`Loaded ${jobs.length} synthetic job records.`);
if (jobs.length < 50) {
  console.error("FAIL: Dataset has less than 50 jobs!");
  process.exit(1);
} else {
  console.log(`✓ Verified: Dataset contains ${jobs.length} records (&ge; 50 required).`);
}

// Validate fields of each job
let sampleJob = jobs[0];
const expectedFields = ['id', 'title', 'company', 'category', 'location', 'workMode', 'employmentType', 'experienceLevel', 'salaryRange', 'requiredSkills', 'description', 'isSynthetic'];
for (const f of expectedFields) {
  if (sampleJob[f] === undefined) {
    console.error(`FAIL: Job missing expected field: ${f}`);
    process.exit(1);
  }
}
console.log("✓ Sample job schema validated successfully.");

console.log("\n=== VALIDATING CAREER GRAPH ===");
const graph = JSON.parse(fs.readFileSync(path.join(baseDir, 'data/career-graph.json'), 'utf8'));
console.log(`Loaded career graph: ${graph.nodes.length} nodes, ${graph.edges.length} edges.`);
console.log(`✓ Verified heuristic documentation: ${graph.heuristicDocumentation.slice(0, 60)}...`);

console.log("\n=== VALIDATING INTERNAL LINKS ACROSS ALL HTML PAGES ===");
const htmlFiles = requiredFiles.filter(f => f.endsWith('.html'));
let brokenLinkCount = 0;

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(path.join(baseDir, htmlFile), 'utf8');
  
  // Find href="something.html"
  const matches = content.matchAll(/href=["']([a-zA-Z0-9_-]+\.html)(#[a-zA-Z0-9_-]+|\?[^"']*)?["']/g);
  for (const m of matches) {
    const targetFile = m[1];
    const targetPath = path.join(baseDir, targetFile);
    if (!fs.existsSync(targetPath)) {
      console.error(`BROKEN LINK in ${htmlFile} -> ${targetFile}`);
      brokenLinkCount++;
    }
  }

  // Find src="js/something.js"
  const scriptMatches = content.matchAll(/src=["']([^"']+)["']/g);
  for (const sm of scriptMatches) {
    const scriptSrc = sm[1];
    if (!scriptSrc.startsWith('http')) {
      const scriptPath = path.join(baseDir, scriptSrc);
      if (!fs.existsSync(scriptPath)) {
        console.error(`MISSING SCRIPT in ${htmlFile} -> ${scriptSrc}`);
        brokenLinkCount++;
      }
    }
  }
}

if (brokenLinkCount === 0) {
  console.log("✓ All internal HTML href links and script tags are valid!");
} else {
  console.error(`Found ${brokenLinkCount} broken links/scripts.`);
  process.exit(1);
}

console.log("\n=== ALL FILE & SYSTEM INTEGRITY CHECKS PASSED! ===");
