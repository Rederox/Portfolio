export type ThemeKey = "emerald" | "violet" | "cyan" | "rose" | "amber" | "indigo" | "custom";
export type BgStyle = "none" | "grid" | "dots" | "particles" | "waves" | "lines";

export interface ThemeSettings {
  key: ThemeKey;
  customAccent?: string;  // hex — uniquement quand key === "custom"
  bgStyle: BgStyle;
}

export interface Theme {
  key: Exclude<ThemeKey, "custom">;
  name: string;
  accent: string;
  accentLight: string;
  accentRgb: string;
  preview: string;
}

export const THEMES: Record<Exclude<ThemeKey, "custom">, Theme> = {
  emerald: {
    key: "emerald",
    name: "Emerald",
    accent: "#10b981",
    accentLight: "#34d399",
    accentRgb: "16, 185, 129",
    preview: "linear-gradient(135deg, #10b981, #34d399)",
  },
  violet: {
    key: "violet",
    name: "Violet",
    accent: "#8b5cf6",
    accentLight: "#a78bfa",
    accentRgb: "139, 92, 246",
    preview: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  },
  cyan: {
    key: "cyan",
    name: "Cyan",
    accent: "#06b6d4",
    accentLight: "#22d3ee",
    accentRgb: "6, 182, 212",
    preview: "linear-gradient(135deg, #06b6d4, #22d3ee)",
  },
  rose: {
    key: "rose",
    name: "Rose",
    accent: "#f43f5e",
    accentLight: "#fb7185",
    accentRgb: "244, 63, 94",
    preview: "linear-gradient(135deg, #f43f5e, #fb7185)",
  },
  amber: {
    key: "amber",
    name: "Ambre",
    accent: "#f59e0b",
    accentLight: "#fbbf24",
    accentRgb: "245, 158, 11",
    preview: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  },
  indigo: {
    key: "indigo",
    name: "Indigo",
    accent: "#6366f1",
    accentLight: "#818cf8",
    accentRgb: "99, 102, 241",
    preview: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
};

export const DEFAULT_SETTINGS: ThemeSettings = {
  key: "emerald",
  bgStyle: "none",
};

export const THEME_LIST = Object.values(THEMES);

// ── Utilitaires couleur ────────────────────────────────────────────────────────

export function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function lightenHex(hex: string, amount = 45): string {
  const clean = hex.replace("#", "");
  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + amount);
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + amount);
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}
