"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiDroplet } from "react-icons/fi";
import { useTheme } from "@/lib/theme-context";
import { THEME_LIST, isValidHex, lightenHex, type ThemeKey, type BgStyle } from "@/lib/themes";

const BG_OPTIONS: { key: BgStyle; label: string; desc: string; animated?: boolean }[] = [
  { key: "none",      label: "Aucun",       desc: "Fond épuré"              },
  { key: "grid",      label: "Grille",      desc: "Lignes fines"           },
  { key: "dots",      label: "Points",      desc: "Points fixes"           },
  { key: "particles", label: "Particules",  desc: "Points animés",    animated: true },
  { key: "waves",     label: "Ondes",       desc: "Pulsation douce",  animated: true },
  { key: "lines",     label: "Diagonales",  desc: "Lignes en dérive", animated: true },
];

export default function ThemePage() {
  const { settings, theme, setTheme, setCustomColor, setBgStyle } = useTheme();

  const [customHex, setCustomHex] = useState(settings.customAccent ?? "#10b981");
  const [hexInput,  setHexInput]  = useState(settings.customAccent ?? "#10b981");

  // Sync hex input quand settings change
  useEffect(() => {
    if (settings.customAccent) {
      setCustomHex(settings.customAccent);
      setHexInput(settings.customAccent);
    }
  }, [settings.customAccent]);

  const handleHexInput = (val: string) => {
    setHexInput(val);
    if (isValidHex(val)) setCustomHex(val);
  };

  const handleApplyCustom = async () => {
    if (!isValidHex(customHex)) return;
    await setCustomColor(customHex);
  };

  const handleBgStyle = async (style: BgStyle) => {
    await setBgStyle(style);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl text-white mb-1">Thème & Apparence</h1>
        <p className="text-slate-400 text-sm">
          Personnalise les couleurs et le style de ton portfolio. Appliqué en temps réel pour tous les visiteurs.
        </p>
      </div>

      {/* ── Live preview ──────────────────────────────────────────────────── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-4">Aperçu</p>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 border"
            style={{ color: "var(--accent)", backgroundColor: "rgba(var(--accent-rgb), 0.10)", borderColor: "rgba(var(--accent-rgb), 0.20)" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
            Disponible pour un poste
          </span>

          <button
            className="inline-flex items-center gap-2 text-white font-semibold px-5 py-2 rounded-xl text-sm"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Télécharger CV
          </button>

          <button
            className="inline-flex items-center gap-2 border text-white font-semibold px-5 py-2 rounded-xl text-sm"
            style={{ borderColor: "rgba(var(--accent-rgb), 0.30)" }}
          >
            Me contacter →
          </button>

          <span
            className="font-display font-extrabold text-2xl"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            Theivathan.
          </span>
        </div>
      </div>

      {/* ── Palettes prédéfinies ──────────────────────────────────────────── */}
      <div>
        <p className="text-white font-semibold text-sm mb-3">Palettes prédéfinies</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {THEME_LIST.map((t, i) => {
            const active = theme === t.key;
            return (
              <motion.button
                key={t.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setTheme(t.key as ThemeKey)}
                className={`relative group bg-[#111] border rounded-2xl p-4 flex flex-col gap-3 text-left transition-all duration-200 ${
                  active ? "border-white/20 shadow-lg" : "border-[#1e1e1e] hover:border-[#2a2a2a]"
                }`}
              >
                <div className="w-full h-10 rounded-xl" style={{ background: t.preview }} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs font-mono mt-0.5">{t.accent}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${active ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                    style={{ backgroundColor: t.accent }}
                  >
                    <FiCheck size={12} className="text-white" strokeWidth={3} />
                  </div>
                </div>
                {active && (
                  <motion.div
                    layoutId="active-theme-glow"
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `0 0 0 1px ${t.accent}40, 0 0 20px ${t.accent}15` }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Couleur personnalisée ──────────────────────────────────────────── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <FiDroplet size={14} style={{ color: "var(--accent)" }} />
          <p className="text-white font-semibold text-sm">Couleur personnalisée</p>
        </div>
        <p className="text-slate-500 text-xs mb-5">Entre n'importe quelle couleur hex ou utilise le sélecteur. Elle sera appliquée à tous les accents du site.</p>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 mb-4">
          {/* Sélecteur natif */}
          <label className="relative cursor-pointer flex-shrink-0">
            <input
              type="color"
              value={isValidHex(customHex) ? customHex : "#10b981"}
              onChange={(e) => { setCustomHex(e.target.value); setHexInput(e.target.value); }}
              className="sr-only"
            />
            <div
              className="w-12 h-11 rounded-xl border-2 border-white/10 hover:border-white/20 transition-colors"
              style={{ backgroundColor: isValidHex(customHex) ? customHex : "#10b981" }}
            />
          </label>

          {/* Input hex */}
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            placeholder="#10b981"
            maxLength={7}
            className="flex-1 bg-[#0a0a0a] border border-[#1e1e1e] focus:border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm outline-none transition-colors"
          />

          {/* Bouton appliquer */}
          <button
            onClick={handleApplyCustom}
            disabled={!isValidHex(customHex)}
            className="px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            style={{ backgroundColor: isValidHex(customHex) ? customHex : "#333" }}
          >
            Appliquer
          </button>
        </div>

        {/* Barre dégradé preview */}
        {isValidHex(customHex) && (
          <div
            className="h-1.5 rounded-full"
            style={{ background: `linear-gradient(90deg, ${customHex}, ${lightenHex(customHex)})` }}
          />
        )}

        {/* Actif indicator */}
        {theme === "custom" && settings.customAccent && (
          <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
            <FiCheck size={11} strokeWidth={3} />
            Couleur personnalisée active — {settings.customAccent}
          </p>
        )}
      </div>

      {/* ── Style de fond du hero ──────────────────────────────────────────── */}
      <div className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6">
        <p className="text-white font-semibold text-sm mb-1">Fond du hero</p>
        <p className="text-slate-500 text-xs mb-5">Le motif affiché derrière le nom dans la section principale.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BG_OPTIONS.map(({ key, label, desc, animated }) => {
            const active = settings.bgStyle === key;
            return (
              <button
                key={key}
                onClick={() => handleBgStyle(key)}
                className={`relative border rounded-2xl p-4 flex flex-col gap-2 text-left transition-all duration-200 ${
                  active ? "border-white/20 bg-white/4" : "border-[#1e1e1e] hover:border-[#2a2a2a] bg-[#0a0a0a]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-sm font-semibold ${active ? "text-white" : "text-slate-300"}`}>{label}</p>
                  {animated && (
                    <span className="text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(var(--accent-rgb),0.15)", color: "var(--accent)" }}>
                      Animé
                    </span>
                  )}
                </div>
                <p className="text-slate-600 text-xs">{desc}</p>
                {active && (
                  <div
                    className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    <FiCheck size={10} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-slate-700 text-xs">
        Les changements sont sauvegardés dans Firestore et appliqués instantanément à tous les visiteurs.
      </p>
    </div>
  );
}
