"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  THEMES,
  DEFAULT_SETTINGS,
  hexToRgb,
  lightenHex,
  type ThemeKey,
  type ThemeSettings,
  type BgStyle,
} from "./themes";

interface ThemeContextValue {
  settings: ThemeSettings;
  setTheme:       (key: ThemeKey) => Promise<void>;
  setCustomColor: (hex: string)   => Promise<void>;
  setBgStyle:     (style: BgStyle) => Promise<void>;
  // Raccourcis pratiques
  theme: ThemeKey;
}

const ThemeContext = createContext<ThemeContextValue>({
  settings:       DEFAULT_SETTINGS,
  theme:          DEFAULT_SETTINGS.key,
  setTheme:       async () => {},
  setCustomColor: async () => {},
  setBgStyle:     async () => {},
});

function applySettings(s: ThemeSettings) {
  const root = document.documentElement;

  if (s.key === "custom" && s.customAccent) {
    const hex = s.customAccent;
    root.style.setProperty("--accent",       hex);
    root.style.setProperty("--accent-light", lightenHex(hex));
    root.style.setProperty("--accent-rgb",   hexToRgb(hex));
  } else if (s.key !== "custom") {
    const t = THEMES[s.key];
    root.style.setProperty("--accent",       t.accent);
    root.style.setProperty("--accent-light", t.accentLight);
    root.style.setProperty("--accent-rgb",   t.accentRgb);
  }

  root.setAttribute("data-bg", s.bgStyle ?? "none");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    import("./firestore")
      .then(({ getThemeSettings }) => getThemeSettings())
      .then((s) => {
        applySettings(s);
        setSettings(s);
      })
      .catch(() => { /* Firestore indispo — thème par défaut */ });
  }, []);

  const persist = async (next: ThemeSettings) => {
    applySettings(next);
    setSettings(next);
    const { saveThemeSettings } = await import("./firestore");
    await saveThemeSettings(next);
  };

  const setTheme = async (key: ThemeKey) =>
    persist({ ...settings, key });

  const setCustomColor = async (hex: string) =>
    persist({ ...settings, key: "custom", customAccent: hex });

  const setBgStyle = async (style: BgStyle) =>
    persist({ ...settings, bgStyle: style });

  return (
    <ThemeContext.Provider value={{ settings, theme: settings.key, setTheme, setCustomColor, setBgStyle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
