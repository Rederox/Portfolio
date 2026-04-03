/**
 * Seed Firestore with CV data.
 * Usage: npx tsx scripts/seed-firestore.mjs
 * Requires .env.local with NEXT_PUBLIC_FIREBASE_* variables.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local manually ─────────────────────────────────────────────────
const envPath = resolve(__dirname, "../.env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
  console.log("✓ .env.local loaded");
} catch {
  console.error("✗ .env.local not found — create it from .env.local.example");
  process.exit(1);
}

// ─── Firebase init ────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, deleteDoc, getDocs,
} from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error("✗ Firebase env vars missing in .env.local");
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);
console.log(`✓ Firebase connected → project: ${config.projectId}`);

// ─── Data ─────────────────────────────────────────────────────────────────────

const skills = [
  {
    id: "dev-architecture",
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
    id: "ia-automation",
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
    id: "architecture-api",
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
    id: "devops-outils",
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

const experiences = [
  {
    id: "idla",
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
    id: "chiffr3",
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
    id: "telemaque",
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

const education = [
  {
    id: "master-ensitech",
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
    id: "bachelor-ensitech",
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
    id: "bts-jj",
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

// ─── Seed helper ──────────────────────────────────────────────────────────────

async function clearCollection(colName) {
  const snap = await getDocs(collection(db, colName));
  const deletes = snap.docs.map((d) => deleteDoc(doc(db, colName, d.id)));
  await Promise.all(deletes);
  console.log(`  ✓ Cleared ${snap.size} existing doc(s) in "${colName}"`);
}

async function seedCollection(colName, items) {
  console.log(`\n→ Seeding "${colName}" (${items.length} items)…`);
  await clearCollection(colName);
  for (const item of items) {
    const { id, ...data } = item;
    await setDoc(doc(db, colName, id), data);
    console.log(`  + ${id}`);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Seeding Firestore with CV data…\n");

  await seedCollection("skills", skills);
  await seedCollection("experience", experiences);
  await seedCollection("education", education);

  console.log("\n✅ Seed complete! Your portfolio data is live in Firestore.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});
