# CareerAI — AI-Based Job Opportunity Recommendation System

> **B.Tech Artificial Intelligence Project-Based Learning (PBL) Capstone Project**  
> A client-side, explainable, content-based job recommendation engine and interactive AI algorithm laboratory built with vanilla HTML5, CSS3, and JavaScript.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features & Capabilities](#key-features--capabilities)
3. [Technology Stack & Compliance](#technology-stack--compliance)
4. [Mathematical & Algorithmic Formulations](#mathematical--algorithmic-formulations)
   - [Content-Based TF-IDF & Cosine Similarity](#1-content-based-tf-idf--cosine-similarity)
   - [Multi-Criteria Weighted Scoring](#2-multi-criteria-weighted-scoring)
   - [Breadth-First Search (BFS)](#3-breadth-first-search-bfs)
   - [Depth-First Search (DFS)](#4-depth-first-search-dfs)
   - [A* Heuristic Pathfinding](#5-a-heuristic-pathfinding)
   - [Constraint Satisfaction (CSP) Forward-Checking](#6-constraint-satisfaction-filtering)
5. [Project Architecture & File Directory](#project-architecture--file-directory)
6. [Demo Mode vs. Cloud Firebase Mode](#demo-mode-vs-cloud-firebase-mode)
7. [Local Testing & Execution Guide](#local-testing--execution-guide)
8. [Firebase Setup & Security Rules](#firebase-setup--security-rules)
9. [Vercel Deployment Instructions](#vercel-deployment-instructions)
10. [Academic Integrity & Synthetic Dataset Disclosure](#academic-integrity--synthetic-dataset-disclosure)

---

## 🌟 Project Overview

**CareerAI** is designed to address the disconnect between engineering undergraduate curricula and modern technical recruitment. Traditional job portals rely either on opaque neural embeddings or basic keyword queries that fail to explain *why* a candidate is recommended or *what concrete skills* are missing.

CareerAI solves this with:
- **Zero Framework Bloat:** Implemented 100% in vanilla HTML5, CSS3, and modern JavaScript.
- **Client-Side AI Engine:** Computes TF-IDF vectorization, Cosine Similarity, and multi-criteria scoring directly in the browser with no required external paid APIs.
- **Interactive Algorithm Lab:** Demonstrates BFS, DFS, A* search, and constraint solvers on career transition graphs with live step-by-step visualization and telemetry.
- **Dual Persistence Architecture:** Out-of-the-box browser Demo Mode with full `localStorage` persistence, plus seamless plug-and-play Cloud Firestore & Firebase Auth integration.

---

## 🚀 Key Features & Capabilities

1. **Student Dashboard (`dashboard.html`):**
   - Displays real-time candidate summary, top matched vacancies, normalized compatibility scores, and quick application pipeline stats.
2. **Student Profile & Skills Editor (`profile.html`):**
   - Full control over education, degree, graduation year, CGPA, technical skills with proficiency tags (Beginner, Intermediate, Advanced), projects, certifications, target roles, and location preferences. Profile edits immediately trigger live re-computation of recommendation scores.
3. **Job Explorer & Multi-Facet Filters (`jobs.html`):**
   - Filter 52 vacancies by category, work mode (Remote, Hybrid, On-site), experience level, minimum salary, and keywords. Dynamic compatibility badges appear for logged-in students.
4. **Job Details & Real-Time Fit Breakdown (`job-details.html`):**
   - Comprehensive role description, responsibilities, required vs. preferred competencies, matched skills (green badges), and missing skills (dashed badges). Includes 1-click application logging and bookmarking.
5. **Personalized Recommendations & Weight Tuning (`recommendations.html`):**
   - Interactive sliders allow candidates to re-weight criteria (Technical Skills, Academic Degree, Experience, Role Alignment, Preferences). Ranking re-sorts dynamically in real time.
6. **Skill-Gap Analysis & Automated Roadmap (`skill-gap.html`):**
   - Audits skill deficits against target roles or specific vacancies. Generates an optimal prerequisite learning path using A* search.
7. **Application Pipeline Tracker (`applications.html`):**
   - Kanban board and table views tracking 5 recruitment stages: *Applied*, *Screening*, *Interviewing*, *Offered*, and *Rejected*.
8. **Interactive AI Algorithm Lab (`algorithm-lab.html`):**
   - Visual SVG graph explorer demonstrating BFS, DFS, A* search, and CSP filtering with node highlighting, active path tracing, priority queue inspection, and step-by-step debug terminal.
9. **Protected Administrator Console (`admin.html`):**
   - Protected dashboard to create, edit, and retire vacancies, inspect market skill demand frequencies, and configure persistence modes.
10. **About & Privacy (`about.html`, `privacy.html`):**
    - Rigorous academic documentation, mathematical equations, and privacy guarantees.

---

## 🛠️ Technology Stack & Compliance

| Layer | Technology | Compliance Rules Met |
| :--- | :--- | :--- |
| **Frontend Markup** | HTML5 Semantic Elements | Pure HTML5, accessible form controls, clean tags |
| **Frontend Styling** | Pure CSS3 (Custom Design System) | **No Tailwind, Bootstrap, or utility frameworks.** Navy & Electric Blue palette (`#0f172a`, `#2563eb`), responsive flexbox & grid |
| **Client Scripting** | Vanilla JavaScript (ES6+) | **No React, Next.js, Angular, or Vue.** Pure modular JS running client-side |
| **AI Matching Engine** | Custom JS Recommender (`recommender.js`) | Skill canonicalization, TF-IDF term weighting, Cosine Similarity, multi-criteria scoring |
| **Graph Algorithms** | Custom Graph Engine (`algorithms.js`) | Demonstrable BFS, DFS, A* search with Euclidean heuristic, CSP solver |
| **Authentication** | Dual (Demo Session & Firebase Auth) | Instant 1-click Demo logins; Firebase Auth SDK supported |
| **Database** | Dual (LocalStorage & Cloud Firestore) | `localStorage` for Demo Mode; Firestore SDK abstraction in `db.js` |
| **Hosting** | Static Web Hosting | Vercel-compatible with `vercel.json` routing headers |

---

## 📐 Mathematical & Algorithmic Formulations

### 1. Content-Based TF-IDF & Cosine Similarity
To evaluate similarity between candidate portfolio text $P$ (projects, certifications, bio, and technical skills) and job vacancy text $J$, words are tokenized, stripped of English stopwords, and vectorized using TF-IDF:

$$\text{TF}(t, d) = \frac{\text{count}(t, d)}{\sum_{t' \in d} \text{count}(t', d)}$$

$$\text{IDF}(t) = \ln\left(1 + \frac{N}{1 + \text{DF}(t)}\right)$$

$$\vec{V}(d)_t = \text{TF}(t, d) \times \text{IDF}(t)$$

The angular similarity in multi-dimensional term space is given by Cosine Similarity:

$$\text{Cosine}(\vec{P}, \vec{J}) = \frac{\vec{P} \cdot \vec{J}}{\|\vec{P}\| \|\vec{J}\|} = \frac{\sum_{t} P_t J_t}{\sqrt{\sum_t P_t^2} \sqrt{\sum_t J_t^2}}$$

### 2. Multi-Criteria Weighted Scoring
The final Compatibility Index $S_{\text{overall}} \in [0, 100]$ combines normalized component scores:

$$S_{\text{overall}} = \frac{w_{\text{skills}} S_{\text{skills}} + w_{\text{edu}} S_{\text{edu}} + w_{\text{exp}} S_{\text{exp}} + w_{\text{role}} S_{\text{role}} + w_{\text{pref}} S_{\text{pref}}}{\sum w_i} \times 100$$

- **Default Weights:**
  - $w_{\text{skills}} = 0.50$ (Blends canonical skill overlap and TF-IDF Cosine Similarity)
  - $w_{\text{edu}} = 0.15$ (Hierarchical level match: Ph.D = 5, Master's = 4, Bachelor's/B.Tech = 3, Diploma = 1)
  - $w_{\text{exp}} = 0.15$ (Evaluates candidate experience vs. vacancy minimum experience)
  - $w_{\text{role}} = 0.10$ (Title overlap & category alignment)
  - $w_{\text{pref}} = 0.10$ (Work mode match & geographic location)

### 3. Breadth-First Search (BFS)
- **Application:** Discovers the shortest career transition path through an unweighted skill prerequisite graph (minimizing intermediate hops).
- **Complexity:** Time $O(|V| + |E|)$, Space $O(|V|)$ using a FIFO queue.

### 4. Depth-First Search (DFS)
- **Application:** Explores deep career specialization tracks with recursive backtracking.
- **Complexity:** Time $O(|V| + |E|)$, Space $O(|V|)$ using an execution stack.

### 5. A* Heuristic Pathfinding
- **Application:** Discovers the minimum-effort learning trajectory to bridge skills toward a target career role.
- **Evaluation Function:**
  $$f(n) = g(n) + h(n)$$
  where:
  - $g(n)$: Exact accumulated learning effort (in weeks/difficulty) from start node to $n$.
  - $h(n)$: Admissible Euclidean heuristic in competency coordinate space:
    $$h(n) = 0.012 \times \sqrt{(x_{\text{goal}} - x_n)^2 + (y_{\text{goal}} - y_n)^2}$$
- **Admissibility Guarantee:** Because $h(n) \le h^*(n)$ across all nodes, A* is mathematically guaranteed to identify the optimal (lowest cost) learning trajectory.

### 6. Constraint Satisfaction Filtering
- **Application:** Forward-checking solver applying hard constraints (qualification level, candidate experience vs. minimum experience, allowed work modes, and minimum expected salary) to verify eligibility without bias.

---

## 📁 Project Architecture & File Directory

```
careerai/
├── index.html                 # Landing page with hero, interactive sample, and algorithm previews
├── login.html                 # Authentication with 1-click Demo logins & Firebase integration
├── register.html              # Student onboarding registration wizard
├── dashboard.html             # Student dashboard (metrics, top recommendations, pipeline overview)
├── profile.html              # Student profile & skills editor (with proficiency tags & preferences)
├── jobs.html                 # Job explorer with multi-facet filters & search
├── job-details.html          # Detailed vacancy view with dynamic AI compatibility breakdown
├── recommendations.html       # Personalized recommendations with interactive weight tuning sliders
├── skill-gap.html            # Skill-gap auditor & A*-generated learning roadmap
├── saved-jobs.html           # Bookmarked jobs manager
├── applications.html         # Application pipeline tracker (Kanban & Table views)
├── algorithm-lab.html        # Interactive AI PBL Algorithm Lab (BFS, DFS, A*, CSP solver)
├── admin.html                # Protected admin dashboard (manage vacancies, inspect skill demands)
├── about.html                # Technical architecture, mathematical formulations & PBL documentation
├── privacy.html              # Student data protection & client-side storage policies
│
├── css/
│   └── styles.css            # Pure modern CSS3 design system (Navy & Electric Blue)
│
├── js/
│   ├── firebase-config.js    # Firebase environment detection & configuration manager
│   ├── auth.js               # Unified authentication service (Demo Mode + Firebase Auth)
│   ├── db.js                 # Unified database repository (LocalStorage + Cloud Firestore)
│   ├── recommender.js        # Content-based TF-IDF, Cosine Similarity & Multi-Criteria Scorer
│   ├── algorithms.js         # BFS, DFS, A* Search & Constraint Satisfaction Solver
│   ├── app.js                # Global UI components (navbar, banner, toasts, modals)
│   ├── test-core.js          # Core algorithmic test suite
│   └── validate-integrity.js  # Project integrity and internal link validator
│
├── data/
│   ├── jobs.json             # 52 clearly labeled synthetic benchmark job vacancies
│   ├── career-graph.json     # 25-node, 34-edge skill dependency & transition graph
│   ├── generate_jobs.py      # Synthetic dataset generator
│   └── generate_graph.py     # Career graph generator
│
├── firestore.rules           # Cloud Firestore security rules
├── vercel.json               # Static hosting configuration for Vercel
└── README.md                 # System documentation & setup guide
```

---

## 🔄 Demo Mode vs. Cloud Firebase Mode

| Feature | In-Browser Demo Mode | Live Cloud Firebase Mode |
| :--- | :--- | :--- |
| **External Credentials** | **None required** | Requires Google Firebase Project credentials |
| **Data Storage** | Sandboxed browser `localStorage` | Cloud Firestore database |
| **Authentication** | Pre-seeded accounts (Student & Admin) | Firebase Authentication (Email/Password) |
| **Setup Effort** | **Instant (Zero Setup)** | Configure keys in top banner modal |
| **Data Privacy** | 100% Client-Side | Governed by declarative `firestore.rules` |

### Default Demo Credentials:
- **Student Account:** `student@careerai.demo` / `demo123` (Aarav Sharma — B.Tech AI)
- **Faculty / Admin Account:** `admin@careerai.demo` / `admin123` (Dr. Neha Kapoor)
- *One-click login buttons are provided on `index.html` and `login.html`.*

---

## 💻 Local Testing & Execution Guide

### Option 1: Using Python (Recommended)
Open a terminal in the `careerai` root directory and start a local HTTP server:

```bash
# Python 3
python -m http.server 8000
```
Open your browser at: **`http://localhost:8000`**

### Option 2: Using Node.js
```bash
# Using npx serve
npx serve . -p 8000
```
Open your browser at: **`http://localhost:8000`**

### Running Core Algorithmic Tests:
```bash
node js/test-core.js
```
*Validates the recommendation ranking, TF-IDF scoring, BFS path, DFS stack, A* search, and constraint filtering.*

### Running Firebase & Firestore Integration Flow Tests:
```bash
node js/test-firebase-flow.js
```
*Validates Firebase configuration matching, authentication flow, error mapping, Firestore persistence isolation, and strict non-silent fallback.*

### Running System Integrity Checks:
```bash
node js/validate-integrity.js
```
*Validates that all HTML files, CSS rules, JS scripts, data records, and internal links are 100% intact.*

---

## 🔒 Firebase Setup & Security Rules

CareerAI is pre-configured with Google Cloud Firebase project **`careerai-a4947`**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD7tZGL40KYyAYKhSBuVwLslfrYo2yTF_k",
  authDomain: "careerai-a4947.firebaseapp.com",
  projectId: "careerai-a4947",
  storageBucket: "careerai-a4947.firebasestorage.app",
  messagingSenderId: "142840093345",
  appId: "1:142840093345:web:ab49605bebf726c9cf6ee0",
  measurementId: "G-PY404WWEY9"
};
```

### Exact Firebase Console Setup Steps:

1. **Email/Password Authentication:**
   - In the [Firebase Console](https://console.firebase.google.com/), navigate to **Authentication > Sign-in method**.
   - Enable **Email/Password** provider (Email link passwordless sign-in can remain disabled).
2. **Cloud Firestore Setup:**
   - Navigate to **Firestore Database** and click **Create database**.
   - Choose production mode and select your region (e.g. `asia-south1`).
3. **Deploy Security Rules:**
   - In the Firestore **Rules** tab, paste the contents of [`firestore.rules`](file:///C:/Users/LENOVO/.gemini/antigravity/scratch/careerai/firestore.rules) and click **Publish**:
   ```bash
   # Or using Firebase CLI:
   firebase deploy --only firestore:rules
   ```
4. **Seed Job Vacancies to Firestore:**
   - Log in as an administrator (or click **"Continue as Demo Admin"**).
   - In the top navigation banner or Admin Panel, click **"📦 Seed 52 Jobs to Firestore"**.
   - The application will automatically batch-write the 52 synthetic benchmark listings into the remote `/jobs` collection in Cloud Firestore.
5. **Admin Role Assignment:**
   - When a user registers with an email starting with `admin@` (e.g. `admin@careerai.demo`), or is designated in the Firestore `/users/{uid}` collection with `{ role: 'admin' }`, the client and Firestore security rules grant genuine administrative privileges.
   - Non-administrators cannot write to `/jobs` or access administrative functions; operations are rejected with `permission-denied`.

### Strict Non-Silent Switching Guarantee:
- The top navigation banner displays whether the app is in **● FIREBASE LIVE** or **● DEMO MODE**.
- If any operation fails in Firebase Live Mode (e.g., network failure or Firestore permission denied), the system displays an explicit error alert. It **never silently falls back** to `localStorage` while pretending Cloud Firestore succeeded.

---

## 🚀 Vercel Deployment Instructions

CareerAI is structured for static deployment on Vercel with zero build step:

1. Push this repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. Leave **Framework Preset** as *Other* (Root Directory = `.`).
5. Click **"Deploy"**.
6. The `vercel.json` file automatically applies security headers (`X-Content-Type-Options`, `X-Frame-Options`) and caching directives for static data.

Alternatively, deploy directly from the CLI:
```bash
npm i -g vercel
vercel deploy --prod
```

---

## 🛡️ Academic Integrity & Synthetic Dataset Disclosure

- **Synthetic Records Notice:** All 52 vacancy listings in `data/jobs.json` are synthetic benchmark records developed exclusively for the evaluation of this B.Tech Artificial Intelligence Project-Based Learning project. They are not real recruitment vacancies.
- **Extensible Architecture:** The data access layer (`db.js`) is decoupled from the UI, allowing university placement cells to swap the synthetic dataset with live placement feeds.
- **Transparent Scoring:** Compatibility scores reflect mathematical distance and feature overlap. They are never characterized as hiring guarantees or employment probabilities.

---

*CareerAI — Developed for B.Tech Artificial Intelligence Project-Based Learning (PBL).*
