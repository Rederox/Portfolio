"use client";

/**
 * AnalyticsTracker — invisible, monté une seule fois dans le layout.
 *
 * Corrections vs version précédente :
 * - Flag `recorded` pour éviter le double-enregistrement de la durée
 *   (visibilitychange → hidden + pagehide pouvaient tous les deux déclencher la sauvegarde)
 * - Utilise `pagehide` au lieu de `beforeunload` (plus fiable sur mobile/Safari)
 * - Réinitialise le timer si l'utilisateur revient sur l'onglet (ne compte que le temps actif)
 * - Ignore les visites < 3 secondes (bots, fermetures accidentelles)
 */

import { useEffect } from "react";
import { recordPageView, recordDuration } from "@/lib/analytics";

export default function AnalyticsTracker() {
  useEffect(() => {
    // ── Visite — une seule fois par session ──────────────────────────────────
    const SESSION_VISIT_KEY = "pf_visited";
    if (!sessionStorage.getItem(SESSION_VISIT_KEY)) {
      sessionStorage.setItem(SESSION_VISIT_KEY, "1");
      recordPageView();
    }

    // ── Durée active ─────────────────────────────────────────────────────────
    let activeStart = Date.now();   // horodatage du dernier "retour en premier plan"
    let accumulated = 0;            // ms actives avant le dernier masquage
    let saved = false;              // guard anti-double-enregistrement

    const save = () => {
      if (saved) return;
      saved = true;
      const totalMs  = accumulated + (Date.now() - activeStart);
      const seconds  = Math.round(totalMs / 1000);
      recordDuration(seconds); // ignore automatiquement < 3 secondes
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        // L'onglet est masqué → on sauvegarde
        accumulated += Date.now() - activeStart;
        save();
      } else {
        // L'onglet revient au premier plan → on repart
        activeStart = Date.now();
        saved = false; // autoriser un nouvel enregistrement à la prochaine sortie
      }
    };

    // pagehide = événement le plus fiable pour la fermeture (mobile inclus)
    const onPageHide = () => save();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, []);

  return null;
}
