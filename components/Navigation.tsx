"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX, HiMenuAlt3 } from "react-icons/hi";
import { FiSun, FiMoon } from "react-icons/fi";
import { personal } from "@/data/portfolio";
import { trackEvent } from "@/lib/analytics";
import { useMode } from "@/lib/mode-context";

const navLinks = [
  { label: "Profil",     href: "#about" },
  { label: "Expérience", href: "#experience" },
  { label: "Projets",    href: "#projects" },
  { label: "Skills",     href: "#skills" },
  { label: "Contact",    href: "#contact" },
];

export default function Navigation() {
  const [scrolled,    setScrolled]   = useState(false);
  const [mobileOpen,  setMobileOpen] = useState(false);
  const [progress,    setProgress]   = useState(0);
  const [activeHash,  setActiveHash] = useState("#home");
  const { mode, toggleMode }         = useMode();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section tracker via IntersectionObserver
  useEffect(() => {
    const sections = navLinks.map((l) => document.querySelector(l.href));
    if (sections.some((s) => !s)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const pillBg = scrolled
    ? "bg-[#0d0d0d]/95 backdrop-blur-2xl border border-[#242424] shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
    : "bg-[#0d0d0d]/65 backdrop-blur-xl border border-white/6";

  const lightPillBg = scrolled
    ? "bg-white/95 backdrop-blur-2xl border border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
    : "bg-white/70 backdrop-blur-xl border border-black/8";

  const activePillBg = mode === "light" ? lightPillBg : pillBg;

  return (
    <>
      {/*
       * Conteneur full-width fixed.
       * La pill est en position ABSOLUTE left-1/2 -translate-x-1/2
       * → centrage GARANTI indépendamment du logo et du CV.
       */}
      {/*
       * Layout : conteneur flex justify-center pour centrage pixel-perfect de la pill.
       * Logo et boutons droits en absolute pour ne pas perturber le flux.
       */}
      {/* ── Barre de progression ─────────────────────────────────────────────── */}
      <div className="fixed inset-x-0 top-0 z-[60] h-[3px] pointer-events-none">
        <div
          className="h-full accent-bg transition-none"
          style={{ width: `${progress}%` }}
        />
        {progress > 2 && (
          <div
            className="absolute top-[6px] text-[10px] font-bold tabular-nums leading-none px-1.5 py-0.5 rounded-full accent-bg text-white"
            style={{ left: `calc(${progress}% - 18px)` }}
          >
            {Math.round(progress)}%
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 top-0 z-50 h-[72px] flex items-start justify-center pt-5 pointer-events-none">

        {/* ── Logo — absolument à gauche ────────────────────────────────────── */}
        <motion.a
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`
            absolute left-7 top-5 pointer-events-auto
            hidden md:block
            font-display font-extrabold text-base
            hover:opacity-60 transition-opacity
          `}
          style={{ color: mode === "light" ? "var(--text-primary)" : "white" }}
        >
          TT<span style={{ color: "var(--accent)" }}>.</span>
        </motion.a>

        {/* ── Pill — centrée par le flex du parent ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          {/* Desktop */}
          <div className={`hidden md:flex items-center gap-0.5 rounded-full px-3 py-2.5 transition-all duration-300 ${activePillBg}`}>
            {navLinks.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative text-[0.83rem] font-medium whitespace-nowrap px-4 py-2 rounded-full transition-colors duration-150"
                  style={{
                    color: isActive
                      ? "var(--accent)"
                      : mode === "light" ? "#7a7570" : "#94a3b8",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: mode === "light"
                          ? "rgba(var(--accent-rgb),0.1)"
                          : "rgba(var(--accent-rgb),0.12)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* Mobile */}
          <div className={`md:hidden flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-300 ${activePillBg}`}>
            <a
              href="#home"
              className="font-display font-extrabold text-sm"
              style={{ color: mode === "light" ? "var(--text-primary)" : "white" }}
            >
              TT<span style={{ color: "var(--accent)" }}>.</span>
            </a>
            <button
              onClick={toggleMode}
              style={{ color: mode === "light" ? "var(--text-secondary)" : "#64748b" }}
              aria-label="Changer le mode"
            >
              {mode === "light" ? <FiMoon size={15} /> : <FiSun size={15} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: mode === "light" ? "var(--text-secondary)" : "#94a3b8" }}
              aria-label="Menu"
            >
              {mobileOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
            </button>
          </div>
        </motion.div>

        {/* ── Droite — toggle + CV (desktop) ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute right-7 top-5 pointer-events-auto hidden md:flex items-center gap-2"
        >
          <button
            onClick={toggleMode}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 backdrop-blur-xl"
            style={mode === "light"
              ? { borderColor: "rgba(0,0,0,0.1)", color: "var(--text-secondary)", backgroundColor: "rgba(255,255,255,0.5)" }
              : { borderColor: "#242424", color: "#64748b", backgroundColor: "rgba(13,13,13,0.65)" }
            }
            aria-label={mode === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
            onMouseEnter={(e) => { e.currentTarget.style.color = mode === "light" ? "var(--text-primary)" : "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = mode === "light" ? "var(--text-secondary)" : "#64748b"; }}
          >
            {mode === "light" ? <FiMoon size={14} /> : <FiSun size={14} />}
          </button>

          <a
            href={personal.cv}
            download
            onClick={() => trackEvent("cv_download")}
            className="inline-flex items-center gap-2 text-[0.83rem] font-bold text-white px-5 py-2.5 rounded-full accent-bg accent-glow transition-all hover:opacity-88"
          >
            CV ↓
          </a>
        </motion.div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[74px] left-0 right-0 mx-auto z-50 w-60"
          >
            <div
              className={`rounded-2xl p-2 shadow-2xl border ${
                mode === "light"
                  ? "bg-white/98 backdrop-blur-2xl border-black/8"
                  : "bg-[#0d0d0d]/98 backdrop-blur-2xl border-[#1e1e1e]"
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center transition-all px-4 py-3 rounded-xl text-sm font-medium ${
                    mode === "light"
                      ? "text-[#555] hover:text-[#111] hover:bg-black/5"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className={`mx-4 my-2 h-px ${mode === "light" ? "bg-black/8" : "bg-[#1e1e1e]"}`} />
              <a
                href={personal.cv}
                download
                onClick={() => { setMobileOpen(false); trackEvent("cv_download"); }}
                className="flex items-center justify-center gap-2 accent-bg text-white font-bold text-sm py-3 px-4 rounded-xl transition-opacity hover:opacity-88"
              >
                Télécharger CV ↓
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
