// ─── Personal Info ────────────────────────────────────────────────────────────
export const personal = {
  firstName: "Theivathan",
  lastName: "Thevaraj",
  name: "Theivathan Thevaraj",
  role: "Développeur Full Stack · IA & DevOps",
  email: "theivathan14@gmail.com",
  phone: "+33 7 84 96 88 40",
  location: "Argenteuil, France",
  github: "https://github.com/Rederox",
  linkedin: "https://www.linkedin.com/in/theivathan/",
  instagram: "https://www.instagram.com/theivathan14/",
  cv: "/CV_Thevaraj_Theivathan.pdf",
  cvAts: "/CV_THEIVATHAN_THEVARAJ_ATS.pdf",
  bio: "Je conçois et déploie des applications full stack en production : marketplace créée de A à Z avec CRM interne, migration WordPress → Next.js générant 3 000+ clics SEO par mois, automatisations IA qui économisent 3 h de travail par jour. Recruté en alternance, embauché en CDI.",
  available: true,
  age: 24,
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

// ─── Stats — chiffres vérifiables, alignés sur le CV ─────────────────────────
export const stats = [
  { value: "5 ans",  label: "d'expérience en entreprise", short: "d'expérience" },
  { value: "3 000+", label: "clics SEO organiques / mois", short: "clics SEO/mois" },
  { value: "3 h/j",  label: "économisées par automatisation", short: "automatisées" },
];

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
      { name: "Java", icon: "SiOpenjdk" },
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
      { name: "Mistral AI", icon: "SiMistralai" },
      { name: "Claude", icon: "SiClaude" },
      { name: "Gemini", icon: "SiGooglegemini" },
      { name: "Big Data", icon: "SiApachehadoop" },
      { name: "No-Code / Low-Code", icon: "" },
      { name: "n8n", icon: "SiN8N" },
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
      { name: "Cron jobs", icon: "" },
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
      { name: "AWS", icon: "FaAws" },
      { name: "ELK Stack", icon: "SiElastic" },
      { name: "Git", icon: "SiGit" },
      { name: "GitHub", icon: "SiGithub" },
      { name: "Linux", icon: "SiLinux" },
      { name: "Bash", icon: "SiGnubash" },
      { name: "DNS", icon: "" },
      { name: "pfSense", icon: "SiPfsense" },
      { name: "NAS / Synology", icon: "SiSynology" },
      { name: "Postman", icon: "SiPostman" },
    ],
  },
  {
    category: "Design",
    color: "pink",
    order: 4,
    items: [
      { name: "Figma", icon: "SiFigma" },
      { name: "Adobe XD", icon: "", imageUrl: "https://api.iconify.design/logos/adobe-xd.svg" },
      { name: "Canva", icon: "SiCanva" },
      { name: "Photoshop", icon: "", imageUrl: "https://api.iconify.design/logos/adobe-photoshop.svg" },
      { name: "Premiere Pro", icon: "", imageUrl: "https://api.iconify.design/logos/adobe-premiere.svg" },
    ],
  },
];

// ─── Experience ───────────────────────────────────────────────────────────────
export const experiences = [
  {
    company: "IDLA — Investir dans l'ancien",
    role: "Développeur Full Stack & DevOps",
    type: "Alternance → CDI",
    period: "09/2023 – Aujourd'hui",
    description: [
      "Recruté en alternance puis embauché en CDI. Création de A à Z d'une marketplace Next.js / TypeScript (front + back), incluant un CRM interne pour la gestion des prospects et des équipes métier.",
      "Migration complète du site vitrine WordPress → Next.js avec optimisation SEO technique (Core Web Vitals, structure, indexation) : plus de 3 000 clics organiques générés par mois.",
      "Intégration IA (Mistral) pour automatiser des calculs financiers complexes (taxes, rentabilité locative) et des analyses de zones d'investissement.",
      "Automatisation des flux métier (facturation, notifications, relances) via Pipedrive et Zapier : plus de 3 heures de travail manuel économisées par jour pour les équipes.",
      "Conversion : Lead Scoring et scénarios de relances automatiques multicanaux (email, SMS), contribuant à une centaine de conversions par mois.",
      "Pilotage technique : coordination de plusieurs prestataires externes (SEO/SEA, design, rédaction) et alignement des objectifs business et techniques — rôle de chef de projet technique.",
      "Acquisition : gestion et optimisation des campagnes SEA (Google Ads, Meta Ads). Qualité : revues de code, standards de développement et documentation technique.",
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
    shortDesc: "Marketplace d'investissement immobilier créée de A à Z — en production.",
    description:
      "Création complète (front + back) de la marketplace d'investissement locatif : annonces avec calculs de rentabilité (brute / nette), recherche sur carte interactive, espace investisseur et CRM interne pour les équipes métier. IA Mistral intégrée pour l'automatisation des calculs financiers (taxes, rentabilité locative) et l'analyse de zones d'investissement. Lead Scoring et relances automatiques multicanaux (email, SMS) contribuant à une centaine de conversions par mois ; automatisations Pipedrive / Zapier économisant 3 h de travail manuel par jour.",
    images: ["/projects/idla-marketplace.jpg"],
    video: "",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Node.js", "Mapbox"],
    github: "",
    live: "https://marketplace.investirdanslancien.fr/",
    featured: true,
    order: 0,
  },
  {
    title: "IDLA — Site Vitrine",
    shortDesc: "Migration WordPress → Next.js avec SEO technique avancé : 3 000+ clics organiques/mois.",
    description:
      "Migration complète du site vitrine de WordPress vers Next.js avec optimisation avancée du SEO technique (Core Web Vitals, structure, indexation) : plus de 3 000 clics organiques générés par mois et une centaine de conversions mensuelles. Refonte des parcours de conversion (prise de RDV, exploration de la marketplace) et gestion des campagnes d'acquisition SEA (Google Ads, Meta Ads).",
    images: ["/projects/idla.jpg"],
    video: "",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "SEO Technique"],
    github: "",
    live: "https://investirdanslancien.fr/",
    featured: true,
    order: 1,
  },
  {
    title: "IDLA — Back Office & CRM",
    shortDesc: "Outil interne de pilotage utilisé quotidiennement par les équipes commerciales et marketing d'IDLA.",
    description:
      "Back-office développé de A à Z pour piloter toute l'activité : dashboard analytics (ventes, DCF créés/envoyés, top villes, types de biens), CRM complet avec pipelines prospects et clients en drag & drop, gestion des dossiers d'investissement (DCF) avec suivi d'ouverture, et campagnes email automatisées via SendGrid (séquences, relances, webhooks entrants, historique). Génération d'emails commerciaux et de descriptions de biens par IA (Mistral Large). CMS intégré pour le site vitrine : articles, guides, FAQ, lexique, témoignages, réalisations et pages « Où investir » par ville. Exports PDF / Excel, système de parrainage, logs d'audit et gestion des rôles et accès (Firebase Auth).",
    images: [],
    video: "",
    technologies: ["Next.js", "TypeScript", "Prisma", "Firebase", "SendGrid", "Mistral AI", "Chart.js", "Mapbox"],
    github: "",
    live: "",
    featured: false,
    order: 2,
  },
  {
    title: "Comusphere",
    shortDesc: "Réseau social communautaire permettant de créer, rejoindre et animer des espaces d'échange autour de centres d'intérêt communs.",
    description:
      "Comusphere est une plateforme communautaire full-stack développée en solo dans le cadre du Master Lead Full Stack. Elle permet aux utilisateurs de créer ou rejoindre des communautés thématiques, de publier du contenu (texte, images), de commenter, réagir, et d'échanger via une messagerie en temps réel.\n\nDéfis techniques : architecture microservices (Spring Boot + Node.js WebSocket), authentification JWT stateless avec Spring Security, gestion des rôles (membre / modérateur / admin), intégration de la stack ELK pour la surveillance des logs, et déploiement cloud hybride (Vercel + VPS Hetzner + Azure MySQL + MongoDB Atlas).\n\nRésultats : MVP fonctionnel et déployé, indexation de 5 000 logs/seconde via ELK, interface responsive mobile-first, conformité RGPD.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1776351105821_Gemini_Generated_Image_oyf1btoyf1btoyf1_(1).png?alt=media&token=1652137d-3a59-46b3-9063-b2d24ba36f3b",
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1776351114046_Gemini_Generated_Image_xgbk5gxgbk5gxgbk_(1).png?alt=media&token=e4366240-71b9-4f54-a023-745956c3d31b",
    ],
    video: "",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Redux", "Java", "Spring Boot", "Node.js", "WebSocket", "MySQL", "MongoDB", "JWT", "Docker", "ELK Stack", "Nginx"],
    github: "https://github.com/Comusphere",
    live: "",
    featured: false,
    order: 3,
  },
  {
    title: "Portfolio & Admin CMS",
    shortDesc: "Ce site — avec son back-office complet développé sur mesure.",
    description:
      "Ce portfolio est lui-même un projet full stack : back-office Firebase (Auth, Firestore, Storage) avec gestion CRUD de tout le contenu, analytics maison (visites par pays et appareil, heatmap mondiale, tracking d'événements), personnalisation du thème en temps réel, formulaire de contact SMTP et suivi de candidatures assisté par IA (Mistral) avec notifications push.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1775512573922_Capture_d'%C3%A9cran_2026-04-06_235606.png?alt=media&token=bd6b5cdf-b1a9-403a-853b-18656b4ea77c",
    ],
    video: "",
    technologies: ["Next.js", "TypeScript", "Firebase", "Tailwind CSS", "Framer Motion", "Nodemailer", "Recharts", "Vercel"],
    github: "",
    live: "https://www.theivathan.fr",
    featured: false,
    order: 4,
  },
  {
    title: "Arène Pokémon",
    shortDesc: "Simulation d'arène Pokémon tour par tour développée en moins de 24h, avec sélection de Pokémon, système d'éléments et combats contre des boss.",
    description:
      "Projet réalisé en moins de 24 heures, Arène Pokémon est une simulation de combat inspirée du système de jeu Pokémon, développée en React et TypeScript. Le joueur choisit parmi 4 Pokémon (types Plante, Eau, Feu, Électrique), sélectionne une carte et une musique, puis affronte l'un des 3 boss de difficulté croissante : Mewtwo, Rayquaza ou Arceus. Les combats se déroulent au tour par tour avec un système de cooldown sur certaines attaques, des faiblesses/résistances élémentaires, un affichage des dégâts en temps réel et un historique détaillé des actions à chaque tour.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1775511791578_Capture_d'%C3%A9cran_2026-04-06_234250.png?alt=media&token=9f4b8036-2312-4177-a3e4-0f7ea62647ee",
    ],
    video: "",
    technologies: ["React", "NextJS", "TypeScript", "Tailwind CSS", "SCSS"],
    github: "https://github.com/Rederox/rpg",
    live: "https://pokearena-silk.vercel.app/",
    featured: false,
    order: 5,
  },
  {
    title: "Socifun",
    shortDesc: "Plateforme de jeux en ligne moderne avec catalogue, filtres par catégories/tags, profils utilisateurs et avatars personnalisables.",
    description:
      "Socifun est une application web construite avec Next.js offrant une expérience complète de découverte de jeux en ligne. Elle intègre un catalogue étendu filtrable par catégories et tags, des pages de jeu détaillées, ainsi que des profils utilisateurs avec avatars entièrement personnalisables. Les données de jeux sont récupérées via l'API Gamedistribution grâce à une intégration GraphQL avec Apollo Client et GraphQL Codegen pour des types TypeScript auto-générés. L'interface est responsive et inclut une pagination dynamique pour naviguer efficacement dans le contenu.",
    images: [
      "/projects/socifun.jpg",
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1775511415654_logoFullBlack_(2).png?alt=media&token=3b775dc0-9678-4d22-a5e8-77e0dc41a689",
    ],
    video: "",
    technologies: ["Next.js", "React", "TypeScript", "GraphQL", "Apollo Client", "Node.js", "GraphQL Codegen"],
    github: "https://github.com/Rederox/socifun",
    live: "https://socifun.theivathan.fr/",
    featured: false,
    order: 6,
  },
  {
    title: "Chatbot IA Discord",
    shortDesc: "Bot Discord intelligent capable de répondre en texte et en voix, propulsé par l'IA OpenAI et intégrant Google Text-to-Speech en français.",
    description:
      "Ce chatbot IA pour Discord utilise le modèle text-davinci-003 d'OpenAI pour générer des réponses contextuelles en français. Il peut rejoindre et quitter des salons vocaux, synthétiser des réponses audio via gTTS, et interagir naturellement lorsqu'il est mentionné. Le principal défi technique a été l'intégration de @discordjs/voice avec le pipeline audio gTTS pour une restitution fluide en salon vocal. Le bot gère également les flux de conversation multi-tours et filtre les réponses avant diffusion.",
    images: [],
    video: "",
    technologies: ["Node.js", "Discord.js", "OpenAI API", "gTTS", "@discordjs/voice", "@discordjs/opus"],
    github: "",
    live: "",
    featured: false,
    order: 7,
  },
  {
    title: "FabLab",
    shortDesc: "Système de gestion d'un FabLab : accès par badge NFC, contrôle des machines, IHM d'administration et statistiques d'utilisation.",
    description:
      "Ce projet consiste en l'installation d'un système de gestion complet pour un FabLab. \n\nIl permet de gérer l'accès aux locaux via une porte connectée et des badges NFC remis à l'inscription. \n\nUne fois à l'intérieur, les membres peuvent allumer les machines et consulter leurs notices d'utilisation grâce à la technologie NFC. Un système d'appel interne facilite la communication entre le personnel. L'administrateur dispose d'une IHM web pour gérer les adhérents (ajout/suppression/remplacement de badge), les données téléphoniques, l'activation des services serveur, ainsi que les statistiques d'activité et de consommation électrique des machines. \n\nL'architecture repose sur des Raspberry Pi en réseau local, avec des serveurs UDP codés en C++ côté Raspberry et des clients UDP intégrés en PHP dans l'interface web.",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/theivathan-e067a.firebasestorage.app/o/projects%2F1775509960755_C-est-quoi-un-fablab-TITRE.webp?alt=media&token=fab2ae5f-80c6-4c37-9392-2f1315ea65e7",
    ],
    video: "",
    technologies: ["Raspberry Pi", "C++", "PHP", "NFC", "HTML/CSS", "MySQL", "JavaScript", "Socket UDP"],
    github: "https://github.com/Rederox/FabLab_Final",
    live: "",
    featured: false,
    order: 8,
  },
];

// ─── Education ────────────────────────────────────────────────────────────────
export const education = [
  {
    degree: "Master — Développeur Lead Full Stack Option IA",
    school: "ENSITECH",
    location: "Cergy",
    period: "2023 – 2025 · Diplômé",
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
