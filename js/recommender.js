/**
 * CareerAI Recommendation Engine
 * Content-based filtering using:
 * - Skill normalization & canonicalization
 * - Text tokenization, stopword removal & TF-IDF term weighting
 * - Cosine similarity calculation between candidate profile and job listing
 * - Multi-criteria weighted scoring (Skills 50%, Education 15%, Experience 15%, Role 10%, Preferences 10%)
 * - Missing skill detection & transparent explanations
 * 
 * Complies strictly with vanilla JavaScript and runs client-side without external dependencies.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CareerRecommender = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // Canonical skill dictionary mapping variations, abbreviations & synonyms to standard terms
  const SKILL_ALIASES = {
    // Programming Languages
    "python": "Python",
    "py": "Python",
    "python3": "Python",
    "javascript": "JavaScript",
    "js": "JavaScript",
    "es6": "JavaScript",
    "es6+": "JavaScript",
    "typescript": "TypeScript",
    "ts": "TypeScript",
    "java": "Java",
    "c++": "C++",
    "cpp": "C++",
    "c#": "C#",
    "csharp": "C#",
    "golang": "Go",
    "go": "Go",
    "kotlin": "Kotlin",
    "swift": "Swift",
    "dart": "Dart",
    "bash": "Bash",
    "shell": "Bash",

    // Web & Frontend
    "html": "HTML5",
    "html5": "HTML5",
    "css": "CSS3",
    "css3": "CSS3",
    "react": "React",
    "reactjs": "React",
    "react.js": "React",
    "redux": "Redux",
    "vue": "Vue.js",
    "vuejs": "Vue.js",
    "angular": "Angular",
    "responsive design": "Responsive Design",
    "dom manipulation": "DOM Manipulation",
    "figma": "Figma",
    "ui/ux": "UI/UX Design",
    "ui/ux design": "UI/UX Design",

    // Backend & Databases
    "node": "Node.js",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "express": "Express",
    "expressjs": "Express",
    "fastapi": "FastAPI",
    "flask": "Flask",
    "django": "Django",
    "spring": "Spring Boot",
    "spring boot": "Spring Boot",
    "sql": "SQL",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "mongo": "MongoDB",
    "redis": "Redis",
    "database design": "Database Design",
    "restful apis": "RESTful APIs",
    "rest": "RESTful APIs",
    "api": "RESTful APIs",

    // Machine Learning & AI
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "dl": "Deep Learning",
    "pytorch": "PyTorch",
    "tensorflow": "TensorFlow",
    "tf": "TensorFlow",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "nlp": "NLP",
    "natural language processing": "NLP",
    "transformers": "Transformers",
    "bert": "BERT",
    "huggingface": "HuggingFace",
    "computer vision": "Convolutional Neural Networks",
    "opencv": "OpenCV",
    "prompt engineering": "Prompt Engineering",
    "langchain": "LangChain",
    "vector databases": "Vector Databases",
    "linear algebra": "Linear Algebra",
    "statistical modeling": "Statistical Modeling",

    // Cloud, DevOps & Tools
    "git": "Git",
    "github": "Git",
    "linux": "Linux",
    "docker": "Docker",
    "kubernetes": "Kubernetes",
    "k8s": "Kubernetes",
    "aws": "AWS / Cloud Fundamentals",
    "aws / cloud fundamentals": "AWS / Cloud Fundamentals",
    "cloud": "AWS / Cloud Fundamentals",
    "ci/cd": "CI/CD Pipelines",
    "ci/cd pipelines": "CI/CD Pipelines",
    "networking": "Networking",
    "cybersecurity basics": "Cybersecurity Basics",
    "vulnerability assessment": "Vulnerability Assessment",
    "software testing": "Software Testing",
    "selenium": "Selenium",
    "powerbi": "PowerBI",
    "excel": "Excel",
    "data analysis": "Data Analysis",
    "data visualization": "Data Visualization",
    "data structures": "Data Structures",
    "algorithms": "Algorithms",
    "oop": "OOP"
  };

  // English Stopwords for text tokenization
  const STOPWORDS = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
    "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
    "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
    "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
    "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more",
    "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's",
    "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they",
    "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under",
    "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
    "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
    "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
    "your", "yours", "yourself", "yourselves", "role", "team", "work", "looking", "join", "working"
  ]);

  // Education hierarchy levels for qualification matching
  const EDUCATION_LEVELS = {
    "phd": 5,
    "doctorate": 5,
    "m.tech": 4,
    "ms": 4,
    "m.s": 4,
    "master": 4,
    "masters": 4,
    "mca": 4,
    "m.sc": 4,
    "b.tech": 3,
    "b.e": 3,
    "be": 3,
    "btech": 3,
    "b.sc": 2,
    "bsc": 2,
    "bca": 2,
    "bachelor": 3,
    "bachelors": 3,
    "diploma": 1,
    "any": 1
  };

  // Default criteria weights
  const DEFAULT_WEIGHTS = {
    skills: 0.50,
    education: 0.15,
    experience: 0.15,
    role: 0.10,
    preferences: 0.10
  };

  /**
   * Normalize an individual skill name to canonical form
   */
  function normalizeSkill(skill) {
    if (!skill || typeof skill !== 'string') return '';
    const clean = skill.trim().toLowerCase();
    if (SKILL_ALIASES[clean]) {
      return SKILL_ALIASES[clean];
    }
    // Title case fallback
    return skill.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  /**
   * Normalize an array or comma-separated string of skills
   */
  function normalizeSkillList(skills) {
    if (!skills) return [];
    let list = [];
    if (Array.isArray(skills)) {
      list = skills;
    } else if (typeof skills === 'string') {
      list = skills.split(/[,;\n]+/);
    }
    const set = new Set();
    list.forEach(s => {
      const norm = normalizeSkill(s);
      if (norm) set.add(norm);
    });
    return Array.from(set);
  }

  /**
   * Tokenize text into normalized tokens, filtering stopwords and punctuation
   */
  function tokenizeText(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length > 1 && !STOPWORDS.has(t));
  }

  /**
   * Compute Term Frequency (TF) map for a list of tokens
   */
  function computeTF(tokens) {
    const tf = {};
    if (!tokens || tokens.length === 0) return tf;
    for (const t of tokens) {
      tf[t] = (tf[t] || 0) + 1;
    }
    const total = tokens.length;
    for (const t in tf) {
      tf[t] = tf[t] / total;
    }
    return tf;
  }

  /**
   * Build an IDF dictionary over an array of documents (each document is an array of tokens)
   */
  function buildIDFCorpus(docTokenLists) {
    const N = docTokenLists.length;
    const df = {};
    for (const tokens of docTokenLists) {
      const unique = new Set(tokens);
      for (const t of unique) {
        df[t] = (df[t] || 0) + 1;
      }
    }
    const idf = {};
    for (const t in df) {
      // Smooth IDF: ln(1 + N / (1 + df))
      idf[t] = Math.log(1 + (N / (1 + df[t])));
    }
    return idf;
  }

  /**
   * Compute TF-IDF vector object for a token list given an IDF dictionary
   */
  function computeTFIDF(tokens, idfDict) {
    const tf = computeTF(tokens);
    const vector = {};
    for (const t in tf) {
      const idf = idfDict[t] || Math.log(2); // fallback for unseen words
      vector[t] = tf[t] * idf;
    }
    return vector;
  }

  /**
   * Calculate Cosine Similarity between two sparse vectors
   */
  function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const key in vecA) {
      normA += vecA[key] * vecA[key];
      if (vecB[key]) {
        dotProduct += vecA[key] * vecB[key];
      }
    }
    for (const key in vecB) {
      normB += vecB[key] * vecB[key];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Extract education level rank from a degree or qualification string
   */
  function parseEducationLevel(eduStr) {
    if (!eduStr || typeof eduStr !== 'string') return 1;
    const clean = eduStr.toLowerCase();
    let maxRank = 1;
    for (const [key, rank] of Object.entries(EDUCATION_LEVELS)) {
      if (clean.includes(key)) {
        if (rank > maxRank) maxRank = rank;
      }
    }
    return maxRank;
  }

  /**
   * Evaluate Education compatibility score (0.0 to 1.0)
   */
  function scoreEducation(userProfile, job) {
    const userRank = parseEducationLevel(userProfile.education || userProfile.degree || '');
    const jobReqRank = parseEducationLevel(job.minEducation || 'b.tech');

    if (userRank >= jobReqRank) {
      return 1.0; // Meets or exceeds requirement
    } else if (userRank === jobReqRank - 1) {
      return 0.70; // 1 level below (e.g. B.Sc for B.Tech requirement)
    } else {
      return 0.40;
    }
  }

  /**
   * Evaluate Experience compatibility score (0.0 to 1.0)
   */
  function scoreExperience(userProfile, job) {
    const userYears = parseFloat(userProfile.experienceYears || 0);
    const jobMinYears = parseFloat(job.minExperienceYears || 0);

    if (userYears >= jobMinYears) {
      return 1.0;
    }
    // Partial score for near fit (e.g. fresh grad with 0.5 yrs vs 1 yr required)
    const diff = jobMinYears - userYears;
    if (diff <= 1.0) {
      return 0.75;
    } else if (diff <= 2.0) {
      return 0.45;
    } else {
      return 0.20;
    }
  }

  /**
   * Evaluate Role alignment score (0.0 to 1.0)
   */
  function scoreRole(userProfile, job) {
    const desiredRoles = userProfile.desiredRoles || [];
    const jobTitle = (job.title || '').toLowerCase();
    const jobCategory = (job.category || '').toLowerCase();

    if (desiredRoles.length === 0) return 0.70; // Neutral baseline if unspecified

    let maxMatch = 0;
    for (const role of desiredRoles) {
      const cleanRole = role.toLowerCase().trim();
      if (jobTitle.includes(cleanRole) || cleanRole.includes(jobTitle)) {
        maxMatch = Math.max(maxMatch, 1.0);
      } else {
        // Token overlap between desired role and job title
        const roleTokens = tokenizeText(cleanRole);
        const titleTokens = tokenizeText(jobTitle);
        const overlap = roleTokens.filter(t => titleTokens.includes(t));
        if (overlap.length > 0) {
          maxMatch = Math.max(maxMatch, overlap.length / Math.max(roleTokens.length, titleTokens.length));
        } else if (jobCategory.includes(cleanRole) || cleanRole.includes(jobCategory)) {
          maxMatch = Math.max(maxMatch, 0.75);
        }
      }
    }
    return Math.max(maxMatch, 0.25);
  }

  /**
   * Evaluate Location & Work Preferences score (0.0 to 1.0)
   */
  function scorePreferences(userProfile, job) {
    let modeScore = 0.5;
    let locScore = 0.5;

    const userModes = Array.isArray(userProfile.workMode) 
      ? userProfile.workMode.map(m => m.toLowerCase()) 
      : [String(userProfile.workMode || 'remote').toLowerCase()];

    const jobMode = (job.workMode || '').toLowerCase();

    if (userModes.includes('any') || userModes.includes(jobMode)) {
      modeScore = 1.0;
    } else if (jobMode === 'remote' || userModes.includes('remote')) {
      modeScore = 0.85; // Remote provides broad compatibility
    } else {
      modeScore = 0.30;
    }

    const userLoc = (userProfile.preferredLocation || '').toLowerCase();
    const jobLoc = (job.location || '').toLowerCase();

    if (!userLoc || userLoc === 'any' || jobLoc.includes('remote') || jobLoc.includes(userLoc) || userLoc.includes(jobLoc)) {
      locScore = 1.0;
    } else {
      locScore = 0.40;
    }

    return (modeScore * 0.5) + (locScore * 0.5);
  }

  /**
   * Main Recommendation Calculation for a single Job against a Student Profile
   */
  function calculateJobMatch(userProfile, job, idfDict, weights) {
    const W = Object.assign({}, DEFAULT_WEIGHTS, weights || {});
    // Normalize weights to sum to 1.0
    const totalW = W.skills + W.education + W.experience + W.role + W.preferences;
    const wSkills = W.skills / totalW;
    const wEdu = W.education / totalW;
    const wExp = W.experience / totalW;
    const wRole = W.role / totalW;
    const wPref = W.preferences / totalW;

    // 1. SKILLS EVALUATION
    const candidateSkills = normalizeSkillList(userProfile.skills || []);
    const requiredSkills = normalizeSkillList(job.requiredSkills || []);
    const preferredSkills = normalizeSkillList(job.preferredSkills || []);

    const candidateSkillSet = new Set(candidateSkills);
    const matchedRequired = requiredSkills.filter(s => candidateSkillSet.has(s));
    const missingSkills = requiredSkills.filter(s => !candidateSkillSet.has(s));
    const matchedPreferred = preferredSkills.filter(s => candidateSkillSet.has(s));

    let skillMatchRatio = 0;
    if (requiredSkills.length > 0) {
      const requiredScore = matchedRequired.length / requiredSkills.length;
      const preferredBonus = preferredSkills.length > 0 ? (matchedPreferred.length / preferredSkills.length) * 0.15 : 0;
      skillMatchRatio = Math.min(1.0, requiredScore + preferredBonus);
    } else {
      skillMatchRatio = 0.70;
    }

    // 2. TEXT SIMILARITY (TF-IDF & Cosine Similarity)
    let cosineSim = 0;
    if (idfDict) {
      // Build candidate profile text corpus from projects, bio, certs, skills
      const profileText = [
        (userProfile.headline || ''),
        (userProfile.bio || ''),
        (userProfile.degree || ''),
        (candidateSkills.join(' ')),
        (userProfile.projects ? userProfile.projects.map(p => (p.title || '') + ' ' + (p.description || '') + ' ' + (p.techStack || '')).join(' ') : ''),
        (userProfile.experienceDetails || '')
      ].join(' ');

      const jobText = [
        job.title || '',
        job.category || '',
        job.description || '',
        (job.responsibilities || []).join(' '),
        (job.requiredSkills || []).join(' '),
        (job.preferredSkills || []).join(' ')
      ].join(' ');

      const profileTokens = tokenizeText(profileText);
      const jobTokens = tokenizeText(jobText);

      const vecProfile = computeTFIDF(profileTokens, idfDict);
      const vecJob = computeTFIDF(jobTokens, idfDict);

      cosineSim = cosineSimilarity(vecProfile, vecJob);
    }

    // Blend direct skill match with semantic cosine similarity (80% exact skill overlap, 20% semantic context)
    const combinedSkillScore = (skillMatchRatio * 0.80) + (cosineSim * 0.20);

    // 3. OTHER CRITERIA
    const eduScore = scoreEducation(userProfile, job);
    const expScore = scoreExperience(userProfile, job);
    const roleScore = scoreRole(userProfile, job);
    const prefScore = scorePreferences(userProfile, job);

    // 4. COMPOSITE WEIGHTED SCORE (0.0 to 100.0)
    const rawScore = (
      (combinedSkillScore * wSkills) +
      (eduScore * wEdu) +
      (expScore * wExp) +
      (roleScore * wRole) +
      (prefScore * wPref)
    ) * 100;

    const finalScore = Math.max(1, Math.min(99.5, Math.round(rawScore * 10) / 10));

    // Transparent breakdown details
    return {
      jobId: job.id,
      overallScore: finalScore,
      breakdown: {
        skills: {
          score: Math.round(combinedSkillScore * 100),
          weight: Math.round(wSkills * 100),
          contribution: Math.round(combinedSkillScore * wSkills * 1000) / 10,
          matchedSkills: matchedRequired,
          missingSkills: missingSkills,
          matchedPreferred: matchedPreferred,
          totalRequiredCount: requiredSkills.length
        },
        education: {
          score: Math.round(eduScore * 100),
          weight: Math.round(wEdu * 100),
          contribution: Math.round(eduScore * wEdu * 1000) / 10,
          userEdu: userProfile.degree || userProfile.education || 'Not specified',
          reqEdu: job.minEducation || 'Degree required'
        },
        experience: {
          score: Math.round(expScore * 100),
          weight: Math.round(wExp * 100),
          contribution: Math.round(expScore * wExp * 1000) / 10,
          userExp: (userProfile.experienceYears || 0) + ' yrs',
          reqExp: (job.minExperienceYears || 0) + ' yrs'
        },
        role: {
          score: Math.round(roleScore * 100),
          weight: Math.round(wRole * 100),
          contribution: Math.round(roleScore * wRole * 1000) / 10,
          jobTitle: job.title
        },
        preferences: {
          score: Math.round(prefScore * 100),
          weight: Math.round(wPref * 100),
          contribution: Math.round(prefScore * wPref * 1000) / 10,
          workMode: job.workMode,
          location: job.location
        },
        semanticTextSim: {
          cosineScore: Math.round(cosineSim * 100)
        }
      },
      summaryExplanation: generateExplanationText(finalScore, matchedRequired, missingSkills, eduScore, expScore)
    };
  }

  /**
   * Generate human-readable transparent explanation text
   */
  function generateExplanationText(score, matched, missing, eduScore, expScore) {
    const parts = [];
    if (matched.length > 0) {
      parts.push(`Strong overlap in ${matched.slice(0, 3).join(', ')}${matched.length > 3 ? ` (+${matched.length - 3} more)` : ''}`);
    }
    if (eduScore >= 1.0) {
      parts.push('academic qualification matches the required criteria');
    }
    if (expScore >= 1.0) {
      parts.push('experience level is well-aligned');
    }
    if (missing.length > 0) {
      parts.push(`Recommended skill additions: ${missing.slice(0, 2).join(', ')}`);
    }
    return parts.join('. ') + '.';
  }

  /**
   * Rank all jobs for a user profile
   */
  function rankJobsForProfile(userProfile, jobs, customWeights) {
    if (!jobs || !Array.isArray(jobs)) return [];

    // Pre-build IDF vocabulary from all job descriptions
    const corpusTokens = jobs.map(j => {
      const text = [j.title, j.category, j.description, (j.requiredSkills || []).join(' ')].join(' ');
      return tokenizeText(text);
    });
    const idfDict = buildIDFCorpus(corpusTokens);

    const scoredJobs = jobs.map(job => {
      const matchResult = calculateJobMatch(userProfile, job, idfDict, customWeights);
      return {
        job: job,
        match: matchResult
      };
    });

    // Sort descending by overall match score
    scoredJobs.sort((a, b) => b.match.overallScore - a.match.overallScore);
    return scoredJobs;
  }

  return {
    normalizeSkill,
    normalizeSkillList,
    tokenizeText,
    computeTF,
    buildIDFCorpus,
    computeTFIDF,
    cosineSimilarity,
    calculateJobMatch,
    rankJobsForProfile,
    DEFAULT_WEIGHTS,
    SKILL_ALIASES
  };
});
