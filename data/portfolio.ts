// ─── Personal Info ────────────────────────────────────────────────────────────
export const personal = {
  firstName: "Theivathan",
  lastName: "Thevaraj",
  name: "Theivathan Thevaraj",
  role: "Développeur Lead Full Stack",
  email: "theivathan14@gmail.com",
  phone: "+33 7 84 96 88 40",
  location: "Argenteuil, France",
  github: "https://github.com/Rederox",
  linkedin: "https://www.linkedin.com/in/theivathan/",
  instagram: "https://www.instagram.com/theivathan14/",
  cv: "/CV_Thevaraj_Theivathan.pdf",
  bio: "Développeur Lead Full Stack passionné par la création d'expériences web modernes et performantes. Spécialisé en IA, DevOps et architectures scalables, j'aime transformer des idées complexes en solutions concrètes, en autonomie comme en équipe.",
  available: true,
  age: 22,
  languages: ["Français (Bilingue)", "Anglais (C1)", "Tamoul (Bilingue)"],
  drivingLicense: true,
  hasVehicle: true,
  interests: [
    { emoji: "💻", label: "Nouvelles Technologies" },
    { emoji: "🎸", label: "Guitare" },
    { emoji: "🎬", label: "Films" },
    { emoji: "🎮", label: "Jeux vidéo" },
    { emoji: "💪", label: "Musculation / Course" },
    { emoji: "⚡", label: "Électronique" },
  ],
};

// ─── Skills ───────────────────────────────────────────────────────────────────
export const skillCategories = [
  {
    category: "Développement & Architecture",
    color: "emerald",
    order: 0,
    items: [
      { name: "React Native", icon: "SiReact" },
      { name: "Next.js", icon: "SiNextdotjs" },
      { name: "Tailwind CSS", icon: "SiTailwindcss" },
      { name: "Angular", icon: "SiAngular" },
      { name: "Flutter", icon: "SiFlutter" },
      { name: "Node.js", icon: "SiNodedotjs" },
      { name: "PHP / Symfony", icon: "SiPhp" },
      { name: "Python", icon: "SiPython" },
      { name: "PostgreSQL", icon: "SiPostgresql" },
      { name: "Supabase", icon: "SiSupabase" },
      { name: "Firebase", icon: "SiFirebase" },
      { name: "TypeScript", icon: "SiTypescript" },
      { name: "Prisma", icon: "SiPrisma" },
    ],
  },
  {
    category: "IA, Automation & Marketing",
    color: "violet",
    order: 1,
    items: [
      { name: "OpenAI", icon: "SiOpenai" },
      { name: "Mistral AI", icon: "", imageUrl: "https://mistral.ai/favicon.ico" },
      { name: "Gemini", icon: "", imageUrl: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06.svg" },
      { name: "n8n", icon: "", imageUrl: "https://n8n.io/favicon.ico" },
      { name: "Zapier", icon: "SiZapier" },
      { name: "Pipedrive", icon: "", imageUrl: "https://www.pipedrive.com/favicon.ico" },
      { name: "SEO Technique", icon: "SiGoogle" },
      { name: "SEA Google/Meta", icon: "SiMeta" },
    ],
  },
  {
    category: "Architecture & API",
    color: "blue",
    order: 2,
    items: [
      { name: "REST API", icon: "" },
      { name: "WebSockets", icon: "SiSocketdotio" },
      { name: "Microservices", icon: "" },
      { name: "GraphQL", icon: "SiGraphql" },
    ],
  },
  {
    category: "DevOps & Outils",
    color: "amber",
    order: 3,
    items: [
      { name: "Docker", icon: "SiDocker" },
      { name: "AWS", icon: "", imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "Git", icon: "SiGit" },
      { name: "GitHub", icon: "SiGithub" },
      { name: "Linux", icon: "SiLinux" },
      { name: "Bash", icon: "SiGnubash" },
      { name: "Figma", icon: "SiFigma" },
      { name: "Postman", icon: "SiPostman" },
    ],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────
export const experiences = [
  {
    company: "IDLA — Investir dans l'ancien",
    role: "Développeur Full Stack & DevOps",
    type: "Alternance",
    period: "09/2023 – 03/2026",
    description: [
      "Pilotage & Coordination : Rôle de Chef de Projet technique, assurant la mise en relation et le suivi de plusieurs prestataires externes (experts SEO/SEA, design, rédaction) pour l'alignement des objectifs business et techniques.",
      "Refonte & Performance : Développement complet (Front/Back) de la Marketplace et du site vitrine avec une optimisation avancée du SEO technique.",
      "IA & Data : Intégration de l'IA (Mistral) pour l'automatisation de calculs financiers complexes (taxes, loyers) et d'analyses de zones.",
      "Automation : Optimisation des flux métier (facturation, notifications) via Pipedrive et Zapier.",
      "Conversion & CRM : Mise en place d'un système de tri intelligent des prospects (Lead Scoring) et déploiement de scénarios de relances automatiques multicanaux pour optimiser le taux de transformation.",
      "Marketing & Growth : Gestion et optimisation des campagnes SEA (Google & Meta) pour accroître la visibilité de la plateforme.",
      "Qualité : Application de standards de code élevés, revues de code et création d'un Backoffice interactif.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Node.js", "PHP"],
    current: true,
    order: 0,
  },
  {
    company: "CHIFFR3",
    role: "Développeur Fullstack",
    type: "Alternance",
    period: "09/2022 – 09/2023",
    description: [
      "Développement & UI : Conception d'architectures PHP Native MVC et création de templates dynamiques (graphiques, tableaux de bord de monitoring) avec JavaScript (ES6+) et Chart.js.",
      "Sécurité & DevOps : Mise en place de protocoles de chiffrement (OpenSSL, AES-256) et automatisation des sauvegardes critiques via scripts Bash sous environnements Docker & Docker Compose.",
      "Infrastructure & Réseau : Configuration de serveurs DNS (Bind9/Unbound), administration de Firewalls (pfSense) et gestion de stockage réseau NAS (Synology).",
    ],
    technologies: ["PHP", "JavaScript", "Chart.js", "Docker", "Bash", "OpenSSL", "DNS"],
    current: false,
    order: 1,
  },
  {
    company: "Télémaque",
    role: "Testeur d'API",
    type: "Stage",
    period: "05/2021 – 07/2021",
    description: [
      "QA & API Testing : Analyse de la structure des données (JSON) et validation systématique des points de terminaison API pour garantir l'intégrité des échanges.",
      "Support & Documentation : Résolution de tickets techniques de support et participation à la rédaction de documentations pour l'aide au développement web.",
    ],
    technologies: ["REST API", "JSON", "Postman"],
    current: false,
    order: 2,
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects = [
  {
    title: "IDLA — Marketplace Immobilière",
    shortDesc: "Marketplace et site vitrine pour l'investissement dans l'immobilier ancien.",
    description:
      "Refonte complète (Front/Back) de la marketplace et du site vitrine avec optimisation SEO avancée. Intégration de l'IA Mistral pour l'automatisation de calculs financiers (taxes, loyers) et analyses de zones. Système de Lead Scoring, CRM automatisé et campagnes SEA.",
    images: [],
    video: "",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Node.js", "PHP"],
    github: "",
    live: "",
    featured: true,
    order: 0,
  },
  {
    title: "Fab Lab",
    shortDesc: "Plateforme de gestion d'un espace de fabrication collaborative.",
    description:
      "Plateforme web pour la gestion et présentation d'un espace de fabrication collaborative. Interface moderne, gestion des membres, projets et ressources.",
    images: ["/Fab_Lab.png"],
    video: "",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/Rederox",
    live: "",
    featured: true,
    order: 1,
  },
];

// ─── Education ────────────────────────────────────────────────────────────────
export const education = [
  {
    degree: "Master — Développeur Lead Full Stack Option IA",
    school: "ENSITECH",
    location: "Cergy",
    period: "2023 – 2025",
    description:
      "Formation avancée en développement Full Stack avec spécialisation en Intelligence Artificielle. Architecture logicielle, microservices, gestion de projets et DevOps.",
    current: false,
    order: 0,
  },
  {
    degree: "Bachelor — Développeur Full Stack",
    school: "ENSITECH",
    location: "Cergy",
    period: "2022 – 2023",
    description:
      "Formation en développement Full Stack orientée pratique : React, Node.js, bases de données relationnelles et non-relationnelles, API REST.",
    current: false,
    order: 1,
  },
  {
    degree: "BTS Systèmes Numériques — Informatique et Réseaux",
    school: "Lycée Jean Jaurès",
    location: "Argenteuil",
    period: "2020 – 2022",
    description:
      "Formation en informatique et réseaux : administration systèmes, développement applicatif, sécurité des réseaux et infrastructure.",
    current: false,
    order: 2,
  },
];
