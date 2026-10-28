import json
from datetime import datetime, timedelta
import random

# Seed for reproducibility
random.seed(42)

jobs_raw = [
    # AI & ML Roles
    {
        "title": "Junior AI Engineer",
        "company": "NeuralCraft Labs",
        "category": "AI / Machine Learning",
        "location": "Bangalore, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/AI/Data Science",
        "salaryRange": "₹7,50,000 - ₹11,00,000 / year",
        "minSalaryAnnualINR": 750000,
        "requiredSkills": ["Python", "PyTorch", "Machine Learning", "Git", "NumPy", "Data Structures"],
        "preferredSkills": ["FastAPI", "Docker", "HuggingFace", "Linux"],
        "description": "Join our cognitive systems team building predictive machine learning pipelines and transformer models for conversational interfaces. You will assist in dataset preprocessing, model evaluation, and deployment of lightweight neural networks.",
        "responsibilities": [
            "Implement and fine-tune computer vision and natural language models using PyTorch.",
            "Preprocess large tabular and unstructured datasets with NumPy and Pandas.",
            "Collaborate with backend engineers to expose model inference via REST APIs.",
            "Write reproducible unit tests and benchmark inference latencies."
        ]
    },
    {
        "title": "Graduate Machine Learning Engineer",
        "company": "CognitivePulse Analytics",
        "category": "AI / Machine Learning",
        "location": "Hyderabad, India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT/AI",
        "salaryRange": "₹8,00,000 - ₹12,00,000 / year",
        "minSalaryAnnualINR": 800000,
        "requiredSkills": ["Python", "Scikit-Learn", "TensorFlow", "Pandas", "Linear Algebra", "SQL"],
        "preferredSkills": ["MLflow", "AWS", "Docker", "Flask"],
        "description": "Looking for fresh graduates with a passion for statistical learning and algorithm optimization. You will work on real-world recommendation systems, feature engineering, and model validation pipelines.",
        "responsibilities": [
            "Design cross-validation strategies and monitor predictive drift.",
            "Extract features from transactional datasets using SQL and Pandas.",
            "Implement supervised and unsupervised classification/clustering algorithms.",
            "Contribute to internal ML evaluation tooling and documentation."
        ]
    },
    {
        "title": "Generative AI Developer Intern",
        "company": "Synthetix AI",
        "category": "AI / Machine Learning",
        "location": "Pune, India",
        "workMode": "Remote",
        "employmentType": "Internship",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/AI (Final/Pre-final year)",
        "salaryRange": "₹30,000 - ₹45,000 / month (₹3.6L - ₹5.4L annualized)",
        "minSalaryAnnualINR": 360000,
        "requiredSkills": ["Python", "Prompt Engineering", "LangChain", "Vector Databases", "Git"],
        "preferredSkills": ["OpenAI API", "ChromaDB", "FastAPI", "React"],
        "description": "Exciting internship opportunity for students eager to build next-generation LLM applications, RAG (Retrieval-Augmented Generation) pipelines, and intelligent search agents.",
        "responsibilities": [
            "Construct RAG workflows using LangChain and open-source embedding models.",
            "Benchmark retrieval accuracy and reranking strategies across document corpora.",
            "Build proof-of-concept AI agents with tool-calling capabilities.",
            "Participate in weekly research paper review sessions."
        ]
    },
    {
        "title": "Computer Vision Research Associate",
        "company": "VividVision Systems",
        "category": "AI / Machine Learning",
        "location": "Bangalore, India",
        "workMode": "On-site",
        "employmentType": "Full-time",
        "experienceLevel": "Junior (1-2 yrs)",
        "minExperienceYears": 1,
        "minEducation": "B.Tech / M.Tech in CS/EE/AI",
        "salaryRange": "₹9,00,000 - ₹14,00,000 / year",
        "minSalaryAnnualINR": 900000,
        "requiredSkills": ["Python", "OpenCV", "PyTorch", "Deep Learning", "Convolutional Neural Networks", "C++"],
        "preferredSkills": ["YOLO", "TensorRT", "Edge AI", "CUDA"],
        "description": "Develop automated defect inspection and object detection algorithms running on edge devices and industrial cameras.",
        "responsibilities": [
            "Train and prune object detection models (YOLO / Faster-RCNN).",
            "Optimize inference runtimes using TensorRT and ONNX runtime.",
            "Process image augmentations and synthetic data pipelines.",
            "Document experimental metrics in research logs."
        ]
    },
    {
        "title": "NLP Engineer - Conversational AI",
        "company": "LinguaBot Technologies",
        "category": "AI / Machine Learning",
        "location": "Remote - India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Junior (1-2 yrs)",
        "minExperienceYears": 1,
        "minEducation": "B.Tech / M.Tech in CS/AI",
        "salaryRange": "₹8,50,000 - ₹13,00,000 / year",
        "minSalaryAnnualINR": 850000,
        "requiredSkills": ["Python", "Transformers", "NLP", "PyTorch", "Tokenization", "Spacy"],
        "preferredSkills": ["BERT", "HuggingFace", "Docker", "FastAPI"],
        "description": "Help us enhance multi-lingual customer interaction bots using transformer embeddings, intent classification, and entity extraction models.",
        "responsibilities": [
            "Fine-tune pre-trained BERT/RoBERTa models on domain-specific dialog datasets.",
            "Develop entity recognition algorithms and custom tokenizers.",
            "Evaluate model hallucination and fairness metrics.",
            "Work alongside product managers to translate clinical/financial intents."
        ]
    },

    # Data Science & Analytics
    {
        "title": "Associate Data Scientist",
        "company": "QuantEdge Solutions",
        "category": "Data Science",
        "location": "Mumbai, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.Sc / M.Sc in Statistics/CS/Math",
        "salaryRange": "₹7,00,000 - ₹10,50,000 / year",
        "minSalaryAnnualINR": 700000,
        "requiredSkills": ["Python", "SQL", "Pandas", "Statistical Modeling", "Matplotlib", "Scikit-Learn"],
        "preferredSkills": ["Tableau", "PowerBI", "Seaborn", "A/B Testing"],
        "description": "Transform transactional retail data into predictive churn models, lifetime value estimates, and actionable merchandising insights.",
        "responsibilities": [
            "Perform exploratory data analysis and hypothesis testing on sales data.",
            "Build regression and survival analysis models for customer retention.",
            "Create executive dashboards in Tableau and Matplotlib.",
            "Present data-driven recommendations to commercial stakeholders."
        ]
    },
    {
        "title": "Junior Business Intelligence Analyst",
        "company": "MetroMetrics Consulting",
        "category": "Data Science",
        "location": "Gurgaon, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / BCA / BBA / B.Sc",
        "salaryRange": "₹5,50,000 - ₹8,00,000 / year",
        "minSalaryAnnualINR": 550000,
        "requiredSkills": ["SQL", "PowerBI", "Excel", "Data Analysis", "Data Visualization"],
        "preferredSkills": ["Python", "DAX", "Tableau", "ETL"],
        "description": "Design interactive KPI dashboards, validate financial reporting data marts, and automate routine performance reports.",
        "responsibilities": [
            "Write complex SQL queries, window functions, and CTEs to extract data.",
            "Develop standardized PowerBI reporting templates for corporate clients.",
            "Automate recurring weekly data feeds using Python and Excel macros.",
            "Conduct data hygiene checks and resolve discrepancies."
        ]
    },
    {
        "title": "Big Data Engineer Trainee",
        "company": "CloudStream Datatech",
        "category": "Data Science",
        "location": "Chennai, India",
        "workMode": "On-site",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT",
        "salaryRange": "₹6,50,000 - ₹9,50,000 / year",
        "minSalaryAnnualINR": 650000,
        "requiredSkills": ["Python", "SQL", "Java", "Data Structures", "Linux", "Database Design"],
        "preferredSkills": ["Apache Spark", "Kafka", "Hadoop", "AWS S3"],
        "description": "Start your journey in big data engineering by learning distributed batch pipelines, schema design, and message streaming architectures.",
        "responsibilities": [
            "Implement ingest scripts for structured and semi-structured IoT feeds.",
            "Assist in writing Spark transformations and data lake partition schemes.",
            "Monitor pipeline execution health and alert on pipeline failures.",
            "Participate in schema migration and data governance tasks."
        ]
    },

    # Frontend Development
    {
        "title": "Junior Frontend Developer (React)",
        "company": "PixelCraft Studio",
        "category": "Frontend",
        "location": "Bangalore, India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / BCA / B.Sc in CS/IT",
        "salaryRange": "₹6,00,000 - ₹9,00,000 / year",
        "minSalaryAnnualINR": 600000,
        "requiredSkills": ["JavaScript", "HTML5", "CSS3", "React", "Git", "Responsive Design"],
        "preferredSkills": ["TypeScript", "Redux", "RESTful APIs", "Figma"],
        "description": "Craft responsive web interfaces and user-friendly dashboards for our SaaS collaboration platform. You will translate designer mockups into pixel-perfect modular code.",
        "responsibilities": [
            "Develop reusable UI components using modern React and semantic HTML5.",
            "Optimize web performance, Core Web Vitals, and cross-browser rendering.",
            "Integrate RESTful backend endpoints with robust error handling.",
            "Write unit tests with Jest and React Testing Library."
        ]
    },
    {
        "title": "Web UI/UX Developer",
        "company": "Elevate Digital Labs",
        "category": "Frontend",
        "location": "Pune, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Junior (1-2 yrs)",
        "minExperienceYears": 1,
        "minEducation": "B.Tech / B.Des / BCA",
        "salaryRange": "₹6,50,000 - ₹10,000,00 / year",
        "minSalaryAnnualINR": 650000,
        "requiredSkills": ["HTML5", "CSS3", "JavaScript", "Figma", "UI/UX Design", "Responsive Design"],
        "preferredSkills": ["React", "Sass", "Web Accessibility (a11y)", "Animation CSS"],
        "description": "Bridge the gap between design vision and technical execution by creating micro-interactions, responsive prototypes, and accessible component design systems.",
        "responsibilities": [
            "Build design system components conforming to WCAG 2.1 AA accessibility standards.",
            "Translate high-fidelity Figma prototypes into clean CSS/JS code.",
            "Conduct usability tests and iterate based on user engagement metrics.",
            "Maintain design token libraries and style guides."
        ]
    },
    {
        "title": "Frontend Engineer - Vanilla JS & Core Web",
        "company": "LightSpeed Web Systems",
        "category": "Frontend",
        "location": "Hyderabad, India",
        "workMode": "On-site",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT",
        "salaryRange": "₹5,80,000 - ₹8,50,000 / year",
        "minSalaryAnnualINR": 580000,
        "requiredSkills": ["JavaScript", "DOM Manipulation", "HTML5", "CSS3", "Git", "RESTful APIs"],
        "preferredSkills": ["Webpack", "Browser DevTools", "TypeScript", "PWA"],
        "description": "Focus on extreme frontend performance, zero-dependency lightweight scripts, and native browser APIs for high-throughput consumer web apps.",
        "responsibilities": [
            "Build lightweight single-page workflows using native ES6+ JavaScript.",
            "Diagnose and optimize memory leaks and browser reflow bottlenecks.",
            "Write cross-browser polyfills and custom UI web components.",
            "Collaborate with backend engineers to define JSON response contracts."
        ]
    },

    # Backend Development
    {
        "title": "Junior Python Backend Developer",
        "company": "FinScale Systems",
        "category": "Backend",
        "location": "Bangalore, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT",
        "salaryRange": "₹6,50,000 - ₹10,000,00 / year",
        "minSalaryAnnualINR": 650000,
        "requiredSkills": ["Python", "FastAPI", "SQL", "Git", "RESTful APIs", "Data Structures"],
        "preferredSkills": ["PostgreSQL", "Docker", "Redis", "Celery"],
        "description": "Develop high-throughput RESTful services, transactional banking integrations, and asynchronous task queues using FastAPI and PostgreSQL.",
        "responsibilities": [
            "Implement secure RESTful APIs with Pydantic validation and JWT authentication.",
            "Optimize PostgreSQL database schemas, indexing, and transactional integrity.",
            "Build asynchronous background workers using Celery and Redis.",
            "Write comprehensive API documentation using Swagger / OpenAPI specs."
        ]
    },
    {
        "title": "Junior Node.js / Express Developer",
        "company": "Hyperion Cloud Solutions",
        "category": "Backend",
        "location": "Remote - India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / BCA / MCA in CS",
        "salaryRange": "₹6,00,000 - ₹9,50,000 / year",
        "minSalaryAnnualINR": 600000,
        "requiredSkills": ["JavaScript", "Node.js", "Express", "MongoDB", "RESTful APIs", "Git"],
        "preferredSkills": ["TypeScript", "Mongoose", "Docker", "Jest"],
        "description": "Build event-driven microservices for an e-commerce marketplace platform. Work with document stores, authentication flows, and payment gateway webhooks.",
        "responsibilities": [
            "Construct scalable Express.js controllers and middleware pipelines.",
            "Model document schemas and aggregation pipelines in MongoDB.",
            "Implement webhook listeners and rate-limiting security safeguards.",
            "Execute automated integration tests using Supertest and Jest."
        ]
    },
    {
        "title": "Java Spring Boot Associate Developer",
        "company": "Enterprise Horizon Tech",
        "category": "Backend",
        "location": "Chennai, India",
        "workMode": "On-site",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT/ECE",
        "salaryRange": "₹6,20,000 - ₹9,20,000 / year",
        "minSalaryAnnualINR": 620000,
        "requiredSkills": ["Java", "Spring Boot", "SQL", "OOP", "Data Structures", "Git"],
        "preferredSkills": ["Hibernate", "MySQL", "Maven", "JUnit"],
        "description": "Develop resilient backend enterprise services using Spring Boot, Hibernate ORM, and relational database systems.",
        "responsibilities": [
            "Develop REST endpoints adhering to microservice architecture guidelines.",
            "Write JPA entity mappings and optimized query methods.",
            "Implement unit and integration tests using JUnit and Mockito.",
            "Collaborate in daily Agile scrums and peer code reviews."
        ]
    },

    # Full Stack Engineering
    {
        "title": "Full Stack Developer (MERN)",
        "company": "StackForge Innovations",
        "category": "Full Stack",
        "location": "Bangalore, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Junior (1-2 yrs)",
        "minExperienceYears": 1,
        "minEducation": "B.Tech / B.E / BCA in CS",
        "salaryRange": "₹8,00,000 - ₹12,50,000 / year",
        "minSalaryAnnualINR": 800000,
        "requiredSkills": ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Git"],
        "preferredSkills": ["TypeScript", "Redux", "Docker", "Tailwind CSS"],
        "description": "Take end-to-end ownership of web features from React UI component design through Express middleware down to MongoDB aggregation logic.",
        "responsibilities": [
            "Architect and maintain end-to-end full stack web applications.",
            "Design clean RESTful and WebSocket contracts for live updates.",
            "Manage state with Redux Toolkit and optimize frontend bundle sizes.",
            "Deploy staging environments on cloud instances."
        ]
    },
    {
        "title": "Graduate Full Stack Software Engineer",
        "company": "Apex NextGen Tech",
        "category": "Full Stack",
        "location": "Hyderabad, India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.E in CS/IT",
        "salaryRange": "₹7,00,000 - ₹10,00,000 / year",
        "minSalaryAnnualINR": 700000,
        "requiredSkills": ["Python", "JavaScript", "HTML5", "CSS3", "SQL", "Git"],
        "preferredSkills": ["Django", "React", "PostgreSQL", "Docker"],
        "description": "Comprehensive engineering role for versatile graduates eager to work across frontend and backend technologies with mentorship from senior architects.",
        "responsibilities": [
            "Deliver responsive web modules using standard HTML/CSS/JS and Python.",
            "Write database migrations and CRUD operations.",
            "Implement client-side and server-side form validations.",
            "Participate in bug triage and security vulnerability patching."
        ]
    },

    # Cloud & DevOps
    {
        "title": "Junior DevOps Engineer",
        "company": "CloudNative Orbit",
        "category": "Cloud & DevOps",
        "location": "Bangalore, India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech in CS/IT/ECE",
        "salaryRange": "₹7,20,000 - ₹11,50,000 / year",
        "minSalaryAnnualINR": 720000,
        "requiredSkills": ["Linux", "Bash", "Docker", "Git", "Networking", "Python"],
        "preferredSkills": ["Kubernetes", "AWS", "CI/CD Pipelines", "Terraform"],
        "description": "Automate deployment workflows, maintain continuous integration pipelines, and support containerized staging environments.",
        "responsibilities": [
            "Containerize microservices using Docker multi-stage builds.",
            "Maintain GitHub Actions workflows for automated build and test runs.",
            "Monitor server telemetry, disk usage, and resource bottlenecks.",
            "Write bash and python automation scripts for routine ops tasks."
        ]
    },
    {
        "title": "Cloud Operations Associate",
        "company": "Stratus Core Systems",
        "category": "Cloud & DevOps",
        "location": "Pune, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / B.Sc in CS/IT",
        "salaryRange": "₹6,00,000 - ₹8,80,000 / year",
        "minSalaryAnnualINR": 600000,
        "requiredSkills": ["AWS / Cloud Fundamentals", "Linux", "Networking", "Git", "Bash"],
        "preferredSkills": ["CloudWatch", "Python", "Docker", "Terraform"],
        "description": "Support AWS infrastructure provisioning, IAM security permissions, and operational uptime for mission-critical client services.",
        "responsibilities": [
            "Configure EC2 instances, S3 buckets, and VPC security groups.",
            "Troubleshoot network connectivity and DNS routing issues.",
            "Implement automated cloud backup schedules and health alarms.",
            "Audit cloud costs and identify idle provisioned resources."
        ]
    },

    # Mobile Development
    {
        "title": "Junior Flutter Mobile Developer",
        "company": "AppNova Studios",
        "category": "Mobile App Dev",
        "location": "Bangalore, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / BCA in CS",
        "salaryRange": "₹6,00,000 - ₹9,00,000 / year",
        "minSalaryAnnualINR": 600000,
        "requiredSkills": ["Dart", "Flutter", "Mobile Development", "Git", "RESTful APIs", "OOP"],
        "preferredSkills": ["Firebase", "Bloc State Management", "Android Studio", "iOS"],
        "description": "Build high-performance, cross-platform Android and iOS mobile applications using Flutter and clean architecture patterns.",
        "responsibilities": [
            "Develop smooth, 60fps mobile interfaces with Flutter widgets.",
            "Connect mobile screens to backend REST APIs and offline caches.",
            "Implement push notifications and deep linking schemes.",
            "Publish internal beta builds via TestFlight and Firebase App Distribution."
        ]
    },
    {
        "title": "Junior Android Developer (Kotlin)",
        "company": "Dextra Mobile Labs",
        "category": "Mobile App Dev",
        "location": "Delhi NCR, India",
        "workMode": "On-site",
        "employmentType": "Full-time",
        "experienceLevel": "Junior (1-2 yrs)",
        "minExperienceYears": 1,
        "minEducation": "B.Tech / B.E in CS/IT",
        "salaryRange": "₹6,80,000 - ₹10,20,000 / year",
        "minSalaryAnnualINR": 680000,
        "requiredSkills": ["Kotlin", "Android SDK", "Java", "Git", "RESTful APIs", "OOP"],
        "preferredSkills": ["Jetpack Compose", "Coroutines", "Room DB", "MVVM"],
        "description": "Create native Android applications leveraging modern Jetpack libraries, Kotlin Coroutines, and MVVM architectural patterns.",
        "responsibilities": [
            "Implement native Android layouts using Jetpack Compose and XML.",
            "Manage background asynchronous queries with Coroutines and Flow.",
            "Persist offline app data in local SQLite/Room databases.",
            "Perform unit and UI automated tests on emulator devices."
        ]
    },

    # Cybersecurity & QA
    {
        "title": "Junior Cybersecurity Analyst",
        "company": "CyberShield Defense",
        "category": "Cybersecurity",
        "location": "Hyderabad, India",
        "workMode": "Hybrid",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech in CS/IT/Cybersecurity",
        "salaryRange": "₹6,50,000 - ₹9,80,000 / year",
        "minSalaryAnnualINR": 650000,
        "requiredSkills": ["Networking", "Linux", "Cybersecurity Basics", "Python", "Vulnerability Assessment"],
        "preferredSkills": ["Wireshark", "Nmap", "OWASP", "SIEM"],
        "description": "Assist in security operations center monitoring, threat vulnerability analysis, and incident response triage.",
        "responsibilities": [
            "Monitor network traffic logs and alert on anomalous behavior.",
            "Perform vulnerability scanning using automated tools and manual review.",
            "Assist in evaluating web applications against OWASP Top 10 vulnerabilities.",
            "Document incident reports and recommend mitigation steps."
        ]
    },
    {
        "title": "Associate QA Automation Engineer",
        "company": "TestMatrix Quality Systems",
        "category": "Quality Assurance",
        "location": "Pune, India",
        "workMode": "Remote",
        "employmentType": "Full-time",
        "experienceLevel": "Entry-level (0-1 yrs)",
        "minExperienceYears": 0,
        "minEducation": "B.Tech / BCA / B.Sc in CS",
        "salaryRange": "₹5,20,000 - ₹7,80,000 / year",
        "minSalaryAnnualINR": 520000,
        "requiredSkills": ["Python", "Selenium", "Software Testing", "Git", "SQL"],
        "preferredSkills": ["Postman", "PyTest", "CI/CD Pipelines", "Jira"],
        "description": "Automate functional regression test suites and validate API contract compliance across web applications.",
        "responsibilities": [
            "Author automated end-to-end test scripts using Selenium and PyTest.",
            "Execute API regression runs via Postman and automated test collections.",
            "Report reproducible bugs with detailed stack traces in Jira.",
            "Integrate automated test runs into daily continuous delivery pipelines."
        ]
    }
]

# We need at least 50 records. Let's expand systematically with varied locations, companies, and requirements
more_titles = [
    # (Title, Category, MinExp, ExpLabel, SalMin, SalMax, ReqSkills, PrefSkills, WorkMode, Location)
    ("AI Prompt Engineer & Data Curator", "AI / Machine Learning", 0, "Entry-level (0-1 yrs)", 550000, 850000, ["Prompt Engineering", "Python", "NLP", "Text Tokenization"], ["LangChain", "Git", "Content Evaluation"], "Remote", "Bangalore, India"),
    ("Machine Learning Operations (MLOps) Trainee", "AI / Machine Learning", 0, "Entry-level (0-1 yrs)", 700000, 1100000, ["Python", "Docker", "Machine Learning", "Git", "Linux"], ["MLflow", "Kubernetes", "AWS", "CI/CD Pipelines"], "Hybrid", "Hyderabad, India"),
    ("Deep Learning Vision Engineer", "AI / Machine Learning", 1, "Junior (1-2 yrs)", 850000, 1350000, ["PyTorch", "Deep Learning", "Convolutional Neural Networks", "Python"], ["OpenCV", "CUDA", "FastAPI"], "On-site", "Pune, India"),
    ("Data Analyst - Growth & Marketing", "Data Science", 0, "Entry-level (0-1 yrs)", 500000, 750000, ["SQL", "Excel", "Data Analysis", "Data Visualization", "Python"], ["Google Analytics", "PowerBI", "A/B Testing"], "Remote", "Gurgaon, India"),
    ("Junior Data Engineer (ETL/ELT)", "Data Science", 1, "Junior (1-2 yrs)", 720000, 1120000, ["Python", "SQL", "Database Design", "Linux"], ["Apache Spark", "Airflow", "PostgreSQL", "AWS S3"], "Hybrid", "Bangalore, India"),
    ("Quantitative Research Analyst Intern", "Data Science", 0, "Internship", 360000, 480000, ["Python", "Linear Algebra", "Statistical Modeling", "Pandas"], ["NumPy", "Time Series Analysis", "Matplotlib"], "On-site", "Mumbai, India"),
    ("React.js Frontend Specialist", "Frontend", 1, "Junior (1-2 yrs)", 750000, 1100000, ["React", "JavaScript", "HTML5", "CSS3", "TypeScript"], ["Next.js", "Redux", "RESTful APIs", "Jest"], "Remote", "Remote - India"),
    ("Angular Web Application Developer", "Frontend", 1, "Junior (1-2 yrs)", 680000, 1000000, ["JavaScript", "TypeScript", "HTML5", "CSS3", "Git"], ["Angular", "RxJS", "RESTful APIs", "Sass"], "Hybrid", "Chennai, India"),
    ("Junior UI Software Engineer", "Frontend", 0, "Entry-level (0-1 yrs)", 580000, 840000, ["JavaScript", "HTML5", "CSS3", "DOM Manipulation", "Git"], ["Responsive Design", "Figma", "CSS Animations"], "On-site", "Kolkata, India"),
    ("Python Django Backend Engineer", "Backend", 1, "Junior (1-2 yrs)", 700000, 1050000, ["Python", "SQL", "RESTful APIs", "Git", "Database Design"], ["Django", "PostgreSQL", "Docker", "Redis"], "Remote", "Bangalore, India"),
    ("Golang Cloud Backend Trainee", "Backend", 0, "Entry-level (0-1 yrs)", 750000, 1150000, ["Data Structures", "OOP", "Networking", "Git", "Linux"], ["Go", "Docker", "gRPC", "PostgreSQL"], "Hybrid", "Hyderabad, India"),
    ("C++ Systems Software Trainee", "Backend", 0, "Entry-level (0-1 yrs)", 650000, 1000000, ["C++", "Data Structures", "Algorithms", "OOP", "Linux"], ["Multi-threading", "Git", "Memory Management"], "On-site", "Bangalore, India"),
    ("Full Stack Web Developer (Python + Vue)", "Full Stack", 1, "Junior (1-2 yrs)", 780000, 1180000, ["Python", "JavaScript", "HTML5", "CSS3", "SQL"], ["FastAPI", "Vue.js", "Docker", "Git"], "Hybrid", "Pune, India"),
    ("Full Stack JavaScript Associate", "Full Stack", 0, "Entry-level (0-1 yrs)", 650000, 950000, ["JavaScript", "Node.js", "React", "HTML5", "CSS3"], ["Express", "MongoDB", "RESTful APIs", "Git"], "Remote", "Remote - Global"),
    ("Site Reliability Engineering (SRE) Intern", "Cloud & DevOps", 0, "Internship", 400000, 520000, ["Linux", "Bash", "Python", "Networking"], ["Docker", "Prometheus", "Git", "Cloud Infrastructure"], "Remote", "Bangalore, India"),
    ("Kubernetes & Cloud Infrastructure Associate", "Cloud & DevOps", 1, "Junior (1-2 yrs)", 820000, 1300000, ["Docker", "Linux", "Git", "AWS / Cloud Fundamentals"], ["Kubernetes", "Terraform", "Helm", "CI/CD Pipelines"], "Hybrid", "Hyderabad, India"),
    ("iOS Mobile App Engineer (Swift)", "Mobile App Dev", 1, "Junior (1-2 yrs)", 750000, 1150000, ["Mobile Development", "Git", "OOP", "RESTful APIs"], ["Swift", "iOS SDK", "SwiftUI", "Xcode"], "On-site", "Bangalore, India"),
    ("Cross-Platform React Native Developer", "Mobile App Dev", 0, "Entry-level (0-1 yrs)", 620000, 920000, ["JavaScript", "React", "Mobile Development", "Git"], ["React Native", "TypeScript", "RESTful APIs"], "Remote", "Pune, India"),
    ("SOC Security Analyst (Tier 1)", "Cybersecurity", 0, "Entry-level (0-1 yrs)", 600000, 880000, ["Networking", "Linux", "Cybersecurity Basics", "Vulnerability Assessment"], ["SIEM", "Incident Handling", "Wireshark"], "On-site", "Bangalore, India"),
    ("Application Security Associate", "Cybersecurity", 1, "Junior (1-2 yrs)", 780000, 1200000, ["Cybersecurity Basics", "Python", "Networking", "Git"], ["OWASP", "Burp Suite", "SAST/DAST", "Linux"], "Hybrid", "Gurgaon, India"),
    ("Performance & Load Testing Specialist", "Quality Assurance", 1, "Junior (1-2 yrs)", 650000, 950000, ["Software Testing", "Python", "Networking", "Git"], ["JMeter", "Postman", "CI/CD Pipelines"], "Remote", "Chennai, India"),
    ("SDET (Software Development Engineer in Test)", "Quality Assurance", 0, "Entry-level (0-1 yrs)", 700000, 1050000, ["Java", "Data Structures", "Software Testing", "Git", "SQL"], ["Selenium", "TestNG", "CI/CD Pipelines", "Docker"], "Hybrid", "Bangalore, India"),
    ("AI Solutions Associate", "AI / Machine Learning", 0, "Entry-level (0-1 yrs)", 720000, 1080000, ["Python", "Machine Learning", "Data Structures", "SQL"], ["Scikit-Learn", "FastAPI", "Pandas"], "Remote", "Remote - India"),
    ("Applied NLP Researcher", "AI / Machine Learning", 1, "Junior (1-2 yrs)", 900000, 1450000, ["Python", "NLP", "Transformers", "Deep Learning"], ["PyTorch", "HuggingFace", "BERT"], "Hybrid", "Bangalore, India"),
    ("Healthcare Data Analyst", "Data Science", 0, "Entry-level (0-1 yrs)", 580000, 840000, ["SQL", "Python", "Data Analysis", "Excel"], ["Pandas", "Healthcare Informatics", "PowerBI"], "On-site", "Hyderabad, India"),
    ("Financial Quantitative Analyst Trainee", "Data Science", 0, "Entry-level (0-1 yrs)", 800000, 1200000, ["Linear Algebra", "Statistical Modeling", "Python", "SQL"], ["Pandas", "NumPy", "Time Series Analysis"], "Hybrid", "Mumbai, India"),
    ("Frontend Design Systems Engineer", "Frontend", 1, "Junior (1-2 yrs)", 780000, 1140000, ["JavaScript", "HTML5", "CSS3", "React"], ["Storybook", "Figma", "TypeScript", "Web Accessibility (a11y)"], "Remote", "Bangalore, India"),
    ("Micro-Frontend Architect Trainee", "Frontend", 1, "Junior (1-2 yrs)", 800000, 1200000, ["JavaScript", "React", "HTML5", "CSS3", "Git"], ["Webpack", "Module Federation", "TypeScript"], "Hybrid", "Pune, India"),
    ("Microservices Backend Developer", "Backend", 1, "Junior (1-2 yrs)", 760000, 1150000, ["Node.js", "Express", "SQL", "Git", "RESTful APIs"], ["Docker", "MongoDB", "RabbitMQ", "TypeScript"], "Remote", "Hyderabad, India"),
    ("Cloud Security Operations Trainee", "Cybersecurity", 0, "Entry-level (0-1 yrs)", 680000, 980000, ["Networking", "Linux", "AWS / Cloud Fundamentals", "Cybersecurity Basics"], ["IAM Policies", "CloudTrail", "Python"], "On-site", "Bangalore, India")
]

companies = [
    "CognitiveEdge Systems", "Vanguard AI Labs", "InfiniData Dynamics", "BlueWave Digital",
    "Zephyr Cloud Tech", "OmniLogic Software", "Aura Intelligence", "PrismTech Global",
    "Syntropic AI", "TrueNorth Analytics", "AcroByte Solutions", "Kinetix Cyber Systems",
    "PulseWeb Technologies", "InnoSphere Labs", "DeepMatrix Computing", "NovaScale Technologies"
]

all_jobs = list(jobs_raw)

base_date = datetime(2026, 10, 25)

for i, item in enumerate(more_titles):
    title, cat, min_exp, exp_label, sal_min, sal_max, req_sk, pref_sk, w_mode, loc = item
    comp = companies[i % len(companies)]
    
    sal_str = f"₹{sal_min:,} - ₹{sal_max:,} / year" if sal_min > 50000 else f"₹{sal_min:,} / month"
    
    desc = f"Looking for a motivated {title} to contribute to high-impact projects at {comp}. You will collaborate closely with cross-functional product and engineering teams to build robust solutions."
    
    job_record = {
        "title": title,
        "company": comp,
        "category": cat,
        "location": loc,
        "workMode": w_mode,
        "employmentType": "Internship" if "Intern" in title else "Full-time",
        "experienceLevel": exp_label,
        "minExperienceYears": min_exp,
        "minEducation": "B.Tech / B.E in CS/IT/AI" if cat in ["AI / Machine Learning", "Cloud & DevOps"] else "B.Tech / BCA / B.Sc in CS/IT",
        "salaryRange": sal_str,
        "minSalaryAnnualINR": sal_min,
        "requiredSkills": req_sk,
        "preferredSkills": pref_sk,
        "description": desc,
        "responsibilities": [
            f"Deliver key components and modules aligned with {cat} best practices.",
            f"Work with {', '.join(req_sk[:3])} to solve production scale challenges.",
            "Write clean, modular code with accompanying unit tests and documentation.",
            "Participate in sprint planning, code reviews, and design discussions."
        ]
    }
    all_jobs.append(job_record)

# Assign IDs and final metadata
final_dataset = []
for idx, job in enumerate(all_jobs, start=1):
    job_id = f"JOB-{idx:03d}"
    days_ago = random.randint(1, 28)
    posted_date = (base_date - timedelta(days=days_ago)).strftime("%Y-%m-%d")
    
    job_entry = {
        "id": job_id,
        "title": job["title"],
        "company": job["company"],
        "category": job["category"],
        "location": job["location"],
        "workMode": job["workMode"],
        "employmentType": job["employmentType"],
        "experienceLevel": job["experienceLevel"],
        "minExperienceYears": job["minExperienceYears"],
        "minEducation": job["minEducation"],
        "salaryRange": job["salaryRange"],
        "minSalaryAnnualINR": job["minSalaryAnnualINR"],
        "requiredSkills": job["requiredSkills"],
        "preferredSkills": job["preferredSkills"],
        "description": job["description"],
        "responsibilities": job["responsibilities"],
        "qualifications": [
            f"{job['minEducation']} or equivalent qualification.",
            f"Demonstrated proficiency in {', '.join(job['requiredSkills'][:2])}.",
            "Strong problem-solving, analytical thinking, and collaboration skills."
        ],
        "benefits": [
            "Competitive entry-level remuneration package",
            "Continuous learning sponsorship & certification allowances",
            "Health & wellness insurance coverage",
            "Flexible working hours and ergonomic equipment allowance"
        ],
        "postedDate": posted_date,
        "applicationUrl": f"#apply-{job_id}",
        "isSynthetic": True,
        "demoNotice": "Demonstration record created for B.Tech AI PBL evaluation. Not a live recruitment vacancy."
    }
    final_dataset.append(job_entry)

output_path = r"C:\Users\LENOVO\.gemini\antigravity\scratch\careerai\data\jobs.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(final_dataset, f, indent=2, ensure_ascii=False)

print(f"Generated {len(final_dataset)} job records successfully in {output_path}")
