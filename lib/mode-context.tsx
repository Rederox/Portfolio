"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ColorMode = "dark" | "light";

interface ModeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "dark",
  toggleMode: () => {},
});

// ── Tokens par mode ────────────────────────────────────────────────────────────

const DARK_VARS = {
  "--bg":            "#0a0a0a",
  "--surface":       "#0f0f0f",
  "--card":          "#141414",
  "--card-border":   "#1e1e1e",
  "--text-primary":  "#f1f5f9",
  "--text-secondary":"#64748b",
  "--border-subtle": "#1a1a1a",
};

const LIGHT_VARS = {
  "--bg":            "#f0ede6",   // crème chaud — pas trop blanc
  "--surface":       "#e9e5dd",   // surface légèrement plus foncée
  "--card":          "#e1ddd5",   // carte, bien distinct sans contraste agressif
  "--card-border":   "#cbc7be",   // bordure douce
  "--text-primary":  "#2e2b28",   // marron foncé chaud — pas de noir pur
  "--text-secondary":"#7a7570",   // gris chaud — ni trop clair ni trop foncé
  "--border-subtle": "#d5d1c9",   // séparateurs très discrets
};

function applyMode(mode: ColorMode) {
  const root = document.documentElement;

  // 1) data-mode attribute (pour les overrides CSS de selectors)
  root.setAttribute("data-mode", mode);

  // 2) CSS variables via inline style — garanti, contourne tout problème de spécificité CSS
  const vars = mode === "light" ? LIGHT_VARS : DARK_VARS;
  for (const [prop, val] of Object.entries(vars)) {
    root.style.setProperty(prop, val);
  }
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("portfolio-mode") as ColorMode) ?? "dark";
    setMode(saved);
    applyMode(saved);
  }, []);

  const toggleMode = () => {
    const next: ColorMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyMode(next);
    localStorage.setItem("portfolio-mode", next);
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
