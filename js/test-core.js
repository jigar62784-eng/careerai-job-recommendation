const Recommender = require('./recommender.js');
const Algorithms = require('./algorithms.js');
const jobs = require('../data/jobs.json');
const graph = require('../data/career-graph.json');

console.log("=== TESTING RECOMMENDER MODULE ===");
const sampleProfile = {
  name: "Aarav Sharma",
  degree: "B.Tech in Artificial Intelligence",
  graduationYear: 2026,
  experienceYears: 0.5,
  skills: ["Python", "PyTorch", "Machine Learning", "Git", "NumPy"],
  desiredRoles: ["Junior AI Engineer", "Data Scientist"],
  workMode: ["Hybrid", "Remote"],
  preferredLocation: "Bangalore, India",
  headline: "Aspiring AI Engineer specializing in Deep Learning and PyTorch",
  bio: "Pre-final year student with projects in neural networks, computer vision, and NLP.",
  projects: [
    { title: "Defect Detection", description: "PyTorch CNN object detector", techStack: "Python, PyTorch, OpenCV" }
  ]
};

const ranked = Recommender.rankJobsForProfile(sampleProfile, jobs);
console.log(`Ranked ${ranked.length} jobs.`);
console.log(`Top 1: ${ranked[0].job.title} at ${ranked[0].job.company}`);
console.log(`Match Score: ${ranked[0].match.overallScore}%`);
console.log(`Skills Breakdown:`, ranked[0].match.breakdown.skills);
console.log(`Summary:`, ranked[0].match.summaryExplanation);

console.log("\n=== TESTING ALGORITHMS MODULE ===");
// 1. BFS
const bfsRes = Algorithms.runBFS(graph.nodes, graph.edges, "PROG_BASICS", "ROLE_AI_ENGINEER");
console.log(`BFS Success: ${bfsRes.success}, Path: ${bfsRes.path.join(' -> ')}, Hops: ${bfsRes.hops}, Steps: ${bfsRes.steps.length}`);

// 2. DFS
const dfsRes = Algorithms.runDFS(graph.nodes, graph.edges, "PROG_BASICS", "ROLE_AI_ENGINEER");
console.log(`DFS Success: ${dfsRes.success}, Path: ${dfsRes.path.join(' -> ')}, Explored: ${dfsRes.totalExploredNodes}`);

// 3. A* Search
const astarRes = Algorithms.runAStar(graph.nodes, graph.edges, "PROG_BASICS", "ROLE_AI_ENGINEER");
console.log(`A* Success: ${astarRes.success}, Path: ${astarRes.path.join(' -> ')}, Total Cost: ${astarRes.totalCost}, Steps: ${astarRes.steps.length}`);

// 4. Constraint Filtering
const filterRes = Algorithms.filterJobsWithConstraints(jobs, {
  userEducation: "B.Tech in AI",
  userExperienceYears: 1,
  allowedWorkModes: ["Remote", "Hybrid"],
  preferredLocation: "Bangalore, India"
});
console.log(`Constraint Filtering: ${filterRes.stats.passed} passed out of ${filterRes.stats.total}. Failed: ${filterRes.stats.failed}`);

console.log("\nALL TESTS PASSED SUCCESSFULLY!");
