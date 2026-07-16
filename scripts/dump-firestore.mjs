/**
 * Read-only dump of Firestore collections (debug/inspection).
 * Usage: node scripts/dump-firestore.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv(file) {
  const envContent = readFileSync(resolve(__dirname, "..", file), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    process.env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
  }
}
try { loadEnv(".env.local"); } catch { loadEnv(".env"); }

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

for (const col of ["projects", "experience", "education", "skills"]) {
  try {
    const snap = await getDocs(collection(db, col));
    console.log(`\n=== ${col} (${snap.size} docs) ===`);
    snap.forEach((d) => console.log(JSON.stringify({ id: d.id, ...d.data() }, null, 1)));
  } catch (e) {
    console.log(`\n=== ${col} — ERROR: ${e.message} ===`);
  }
}
process.exit(0);
