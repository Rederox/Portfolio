/**
 * Seed Firestore with the content of data/portfolio.ts (single source of truth).
 * Usage: npx tsx scripts/seed-firestore.mjs
 * Requires .env.local (or .env) with NEXT_PUBLIC_FIREBASE_* variables.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Load .env.local (fallback .env) ─────────────────────────────────────────
function loadEnv(file) {
  const envContent = readFileSync(resolve(__dirname, "..", file), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
  console.log(`✓ ${file} loaded`);
}

try {
  loadEnv(".env.local");
} catch {
  try {
    loadEnv(".env");
  } catch {
    console.error("✗ Neither .env.local nor .env found");
    process.exit(1);
  }
}

// ─── Firebase init ────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, doc, setDoc, deleteDoc, getDocs,
} from "firebase/firestore";

// Contenu unique : data/portfolio.ts (nécessite tsx pour l'import TypeScript)
import { skillCategories, experiences, education, projects } from "../data/portfolio.ts";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error("✗ Firebase env vars missing in .env.local / .env");
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);
console.log(`✓ Firebase connected → project: ${config.projectId}`);

// ─── Seed helpers ─────────────────────────────────────────────────────────────

const slugify = (s) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

async function clearCollection(colName) {
  const snap = await getDocs(collection(db, colName));
  const deletes = snap.docs.map((d) => deleteDoc(doc(db, colName, d.id)));
  await Promise.all(deletes);
  console.log(`  ✓ Cleared ${snap.size} existing doc(s) in "${colName}"`);
}

async function seedCollection(colName, items, idOf) {
  console.log(`\n→ Seeding "${colName}" (${items.length} items)…`);
  await clearCollection(colName);
  for (const item of items) {
    const id = idOf(item);
    await setDoc(doc(db, colName, id), item);
    console.log(`  + ${id}`);
  }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌱 Seeding Firestore from data/portfolio.ts…\n");

  await seedCollection("skills",     skillCategories, (s) => slugify(s.category));
  await seedCollection("experience", experiences,     (e) => slugify(e.company));
  await seedCollection("education",  education,       (e) => slugify(e.degree));
  await seedCollection("projects",   projects,        (p) => slugify(p.title));

  console.log("\n✅ Seed complete! Your portfolio data is live in Firestore.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err.message);
  process.exit(1);
});
