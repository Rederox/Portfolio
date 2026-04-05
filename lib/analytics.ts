/**
 * Analytics — stocké dans Firestore
 *
 * Collections Firestore nécessaires :
 *   analytics/summary  — compteurs globaux (read: auth, write: public)
 *   visits/{id}        — enregistrements individuels (read: auth, write: public)
 *
 * Règles Firestore à ajouter :
 *   match /visits/{docId} {
 *     allow read:  if request.auth != null;
 *     allow write: if true;
 *   }
 */

import {
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
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

export interface VisitRecord {
  id?: string;
  timestamp: Date;
  country: string;
  countryCode: string;
  city: string;
  device: "mobile" | "tablet" | "desktop";
  os: string;
  referrer: string;
  sessionId: string;
}

export interface AnalyticsSummary {
  totalVisits:          number;
  totalCVDownloads:     number;
  totalContactClicks:   number;
  totalGithubClicks:    number;
  totalLinkedinClicks:  number;
  totalInstagramClicks: number;
  totalProjectClicks:   number;
  totalEmailClicks:     number;
  totalTimeSeconds:     number;
  lastUpdated:          Date | null;
}

// ─── Device / OS helpers (browser-only) ──────────────────────────────────────

function getDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua))      return "Windows";
  if (/mac os x/i.test(ua))     return "macOS";
  if (/android/i.test(ua))      return "Android";
  if (/iphone|ipad/i.test(ua))  return "iOS";
  if (/linux/i.test(ua))        return "Linux";
  return "Autre";
}

function getReferrer(): string {
  try {
    const ref = document.referrer;
    if (!ref) return "Direct";
    return new URL(ref).hostname;
  } catch {
    return "Direct";
  }
}

async function getGeoLocation(): Promise<{ country: string; countryCode: string; city: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error();
    const d = await res.json();
    return {
      country:     d.country_name  ?? "Inconnu",
      countryCode: d.country_code  ?? "XX",
      city:        d.city          ?? "Inconnu",
    };
  } catch {
    return { country: "Inconnu", countryCode: "XX", city: "Inconnu" };
  }
}

// ─── Firestore refs ───────────────────────────────────────────────────────────

function summaryRef() {
  return doc(getDb(), "analytics", "summary");
}

async function incSummary(fields: Record<string, unknown>) {
  await setDoc(
    summaryRef(),
    { ...fields, lastUpdated: serverTimestamp() },
    { merge: true },
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Enregistre une visite (geo + device) et incrémente le compteur global.
 * Renvoie un sessionId pour lier les événements ultérieurs.
 */
export async function recordVisit(): Promise<string> {
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const [geo] = await Promise.all([
      getGeoLocation(),
      incSummary({ totalVisits: increment(1) }),
    ]);

    await addDoc(collection(getDb(), "visits"), {
      timestamp:   serverTimestamp(),
      country:     geo.country,
      countryCode: geo.countryCode,
      city:        geo.city,
      device:      getDeviceType(),
      os:          getOS(),
      referrer:    getReferrer(),
      sessionId,
    });
  } catch { /* silently ignore */ }

  return sessionId;
}

export async function recordDuration(seconds: number): Promise<void> {
  if (seconds < 3) return;
  try {
    await incSummary({ totalTimeSeconds: increment(seconds) });
  } catch { /* silently ignore */ }
}

const FIELD_MAP: Record<EventType, string> = {
  cv_download:     "totalCVDownloads",
  contact_click:   "totalContactClicks",
  github_click:    "totalGithubClicks",
  linkedin_click:  "totalLinkedinClicks",
  instagram_click: "totalInstagramClicks",
  project_click:   "totalProjectClicks",
  email_click:     "totalEmailClicks",
};

export function trackEvent(type: EventType): void {
  const field = FIELD_MAP[type];
  if (!field) return;
  (async () => {
    try { await incSummary({ [field]: increment(1) }); } catch { /* ignore */ }
  })();
}

// ─── Read API (admin only) ────────────────────────────────────────────────────

export async function getSummary(): Promise<AnalyticsSummary | null> {
  try {
    const snap = await getDoc(summaryRef());
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

/** Récupère les visites individuelles des N derniers jours. */
export async function getVisits(days = 90): Promise<VisitRecord[]> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const q = query(
      collection(getDb(), "visits"),
      where("timestamp", ">=", Timestamp.fromDate(since)),
      orderBy("timestamp", "desc"),
      limit(500),
    );

    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id:          d.id,
        timestamp:   data.timestamp?.toDate?.() ?? new Date(),
        country:     data.country     ?? "Inconnu",
        countryCode: data.countryCode ?? "XX",
        city:        data.city        ?? "Inconnu",
        device:      data.device      ?? "desktop",
        os:          data.os          ?? "Autre",
        referrer:    data.referrer    ?? "Direct",
        sessionId:   data.sessionId   ?? "",
      } as VisitRecord;
    });
  } catch {
    return [];
  }
}
