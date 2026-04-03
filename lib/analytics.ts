/**
 * Analytics léger — stocké dans Firestore sous analytics/summary
 *
 * ⚠️  Règle Firestore nécessaire pour les écritures publiques :
 *     match /analytics/{docId} {
 *       allow read:  if request.auth != null;
 *       allow write: if true;
 *     }
 */

import {
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "cv_download"
  | "contact_click"
  | "github_click"
  | "linkedin_click"
  | "instagram_click"
  | "project_click"
  | "email_click";

export interface AnalyticsSummary {
  totalVisits:         number;
  totalCVDownloads:    number;
  totalContactClicks:  number;
  totalGithubClicks:   number;
  totalLinkedinClicks: number;
  totalInstagramClicks:number;
  totalProjectClicks:  number;
  totalEmailClicks:    number;
  totalTimeSeconds:    number;
  lastUpdated:         Date | null;
}

const FIELD_MAP: Record<EventType, string> = {
  cv_download:      "totalCVDownloads",
  contact_click:    "totalContactClicks",
  github_click:     "totalGithubClicks",
  linkedin_click:   "totalLinkedinClicks",
  instagram_click:  "totalInstagramClicks",
  project_click:    "totalProjectClicks",
  email_click:      "totalEmailClicks",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ref() {
  return doc(getDb(), "analytics", "summary");
}

/**
 * setDoc avec merge:true — crée le document s'il n'existe pas,
 * sinon fusionne. Pas de race condition entre ensureDoc + updateDoc.
 */
async function inc(fields: Record<string, unknown>): Promise<void> {
  await setDoc(
    ref(),
    { ...fields, lastUpdated: serverTimestamp() },
    { merge: true },
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function recordPageView(): Promise<void> {
  try {
    await inc({ totalVisits: increment(1) });
  } catch { /* silently ignore */ }
}

export async function recordDuration(seconds: number): Promise<void> {
  if (seconds < 3) return; // ignore les visites trop courtes (bots, erreurs)
  try {
    await inc({ totalTimeSeconds: increment(seconds) });
  } catch { /* silently ignore */ }
}

export function trackEvent(type: EventType): void {
  const field = FIELD_MAP[type];
  if (!field) return;
  (async () => {
    try {
      await inc({ [field]: increment(1) });
    } catch { /* silently ignore */ }
  })();
}

export async function getSummary(): Promise<AnalyticsSummary | null> {
  try {
    const snap = await getDoc(ref());
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      totalVisits:          d.totalVisits          ?? 0,
      totalCVDownloads:     d.totalCVDownloads      ?? 0,
      totalContactClicks:   d.totalContactClicks    ?? 0,
      totalGithubClicks:    d.totalGithubClicks     ?? 0,
      totalLinkedinClicks:  d.totalLinkedinClicks   ?? 0,
      totalInstagramClicks: d.totalInstagramClicks  ?? 0,
      totalProjectClicks:   d.totalProjectClicks    ?? 0,
      totalEmailClicks:     d.totalEmailClicks      ?? 0,
      totalTimeSeconds:     d.totalTimeSeconds      ?? 0,
      lastUpdated:          d.lastUpdated?.toDate?.() ?? null,
    };
  } catch {
    return null;
  }
}
