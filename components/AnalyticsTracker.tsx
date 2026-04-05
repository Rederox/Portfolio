"use client";

/**
 * AnalyticsTracker — invisible, monté une seule fois dans le layout.
 * - Enregistre la visite avec géolocalisation IP + device
 * - Mesure la durée active (temps en premier plan)
 * - Utilise sessionStorage pour éviter le double-comptage
 */

import { useEffect } from "react";
import { recordVisit, recordDuration } from "@/lib/analytics";

export default function AnalyticsTracker() {
  useEffect(() => {
    const SESSION_KEY = "pf_visited_v2";

    // ── Visite — une seule fois par session ──────────────────────────────────
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    // Lance l'enregistrement (async, on ne bloque pas le rendu)
    recordVisit();

    // ── Durée active ─────────────────────────────────────────────────────────
    let activeStart  = Date.now();
    let accumulated  = 0;
    let saved        = false;

    const save = () => {
      if (saved) return;
      saved = true;
      const totalMs = accumulated + (Date.now() - activeStart);
      recordDuration(Math.round(totalMs / 1000));
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        accumulated += Date.now() - activeStart;
        save();
      } else {
        activeStart = Date.now();
        saved = false;
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", save);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", save);
    };
  }, []);

  return null;
}
