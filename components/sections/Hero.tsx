"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowDown, FiDownload } from "react-icons/fi";
import Image from "next/image";
import { personal } from "@/data/portfolio";
import { trackEvent, type EventType } from "@/lib/analytics";
import { useTheme } from "@/lib/theme-context";

const socials: { icon: React.ElementType; href: string; label: string; event: EventType }[] = [
  { icon: FiGithub,    href: personal.github,              label: "GitHub",    event: "github_click" },
  { icon: FiLinkedin,  href: personal.linkedin,            label: "LinkedIn",  event: "linkedin_click" },
  { icon: FiInstagram, href: personal.instagram,           label: "Instagram", event: "instagram_click" },
  { icon: FiMail,      href: `mailto:${personal.email}`,   label: "Email",     event: "email_click" },
];

const stats = [
  { value: "3+",  label: "ans d'exp." },
  { value: "15+", label: "projets" },
  { value: "5",   label: "stacks" },
];

const DOT_ROWS = [3, 5, 7, 5, 3];

// ── Fond animé — rendu React (garanti de fonctionner) ─────────────────────────

function HeroBg({ style }: { style: string }) {
  // Statiques — gérés par CSS class
  if (style === "grid" || style === "dots") {
    return (
      <div
        className={`absolute inset-x-0 top-0 pointer-events-none ${style === "grid" ? "hero-bg-grid" : "hero-bg-dots"}`}
        style={{ height: "70%" }}
      />
    );
  }

  // Particules — points qui dérivent
  if (style === "particles") {
    return (
      <div
        className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
        style={{ height: "70%", animation: "bg-drift 20s linear infinite",
          backgroundImage: "radial-gradient(circle, rgba(var(--accent-rgb), 0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px" }}
      />
    );
  }

  // Ondes — cercles qui s'élargissent (Framer Motion)
  if (style === "waves") {
    return (
      <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden flex items-center justify-center" style={{ height: "70%" }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 200, height: 200, border: "1px solid rgba(var(--accent-rgb), 0.12)" }}
            animate={{ scale: [0.2, 6], opacity: [0.5, 0] }}
            transition={{ duration: 7, delay: i * 1.75, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>
    );
  }

  // Lignes diagonales animées
  if (style === "lines") {
    return (
      <div
        className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
        style={{
          height: "70%",
          animation: "lines-slide 14s linear infinite",
          backgroundImage: "repeating-linear-gradient(45deg, rgba(var(--accent-rgb),0.04), rgba(var(--accent-rgb),0.04) 1px, transparent 1px, transparent 38px)",
        }}
      />
    );
  }

  return null;
}

export default function Hero() {
  const { settings } = useTheme();

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Ambient glow ─────────────────────────────────────────────────── */}
      <div className="hero-glow" />

      {/* ── Fond contrôlé depuis l'admin ──────────────────────────────────── */}
      <HeroBg style={settings.bgStyle} />

      {/* ── Arcs concentriques — coin haut-droite ─────────────────────────── */}
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] pointer-events-none overflow-hidden">
        {[
          { offset: "0%",  size: "60%",  opacity: 0.07 },
          { offset: "8%",  size: "78%",  opacity: 0.045 },
          { offset: "16%", size: "96%",  opacity: 0.025 },
        ].map((arc, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              right:  `-${arc.offset}`,
              top:    `-${arc.offset}`,
              width:   arc.size,
              height:  arc.size,
              border: `1px solid rgba(var(--accent-rgb), ${arc.opacity})`,
            }}
          />
        ))}
        <div
          className="absolute top-[18%] right-[18%] w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "rgba(var(--accent-rgb), 0.5)" }}
        />
      </div>

      {/* ── Cluster de points — bas-gauche ────────────────────────────────── */}
      <div className="absolute bottom-28 left-10 pointer-events-none hidden lg:flex flex-col gap-2">
        {DOT_ROWS.map((count, row) => (
          <div key={row} className="flex gap-2 justify-center">
            {Array.from({ length: count }).map((_, col) => (
              <div
                key={col}
                className="w-[3px] h-[3px] rounded-full"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.18)" }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* ── Texte vertical — bord droit ───────────────────────────────────── */}
      <div
        className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden xl:block"
        style={{ writingMode: "vertical-rl" }}
      >
        <span className="text-[0.55rem] tracking-[0.55em] font-mono uppercase"
          style={{ color: "rgba(var(--accent-rgb), 0.25)" }}>
          Full·Stack·Developer·{new Date().getFullYear()}
        </span>
      </div>

      {/* ── Ligne décorative sous la nav ──────────────────────────────────── */}
      <div
        className="absolute top-[72px] inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb),0.06) 40%, rgba(var(--accent-rgb),0.06) 60%, transparent 100%)" }}
      />

      {/* ── Bottom fade ───────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 z-0 pointer-events-none"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 lg:px-14 pt-28 pb-10">

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10 lg:mb-0"
        >
          {personal.available && (
            <span className="accent-badge inline-flex items-center gap-2 text-[0.7rem] rounded-full px-3 py-1 font-semibold tracking-[0.12em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
              Disponible
            </span>
          )}
          <span className="text-[0.7rem] tracking-[0.2em] font-mono ml-auto" style={{ color: "var(--text-secondary)" }}>
            {new Date().getFullYear()}
          </span>
        </motion.div>

        {/* ── Contenu principal ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* Gauche — texte + CTAs */}
          <div className="flex-1 min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs tracking-[0.3em] uppercase font-medium mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Développeur Lead Full Stack
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-extrabold leading-[0.88] uppercase"
                style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.8rem)", color: "var(--text-primary)" }}
              >
                <span className="block tracking-tight">
                  {personal.firstName}
                </span>
                <span className="block hero-name-outlined tracking-tight">
                  {personal.lastName}.
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-7 max-w-md leading-relaxed text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {personal.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 mt-8"
            >
              <a
                href={personal.cv}
                download
                onClick={() => trackEvent("cv_download")}
                className="inline-flex items-center gap-2 accent-bg accent-glow text-white font-bold px-6 py-3 rounded-full text-sm transition-all hover:opacity-88"
              >
                <FiDownload size={14} />
                Télécharger CV
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-sm transition-all"
                style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--text-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
              >
                Me contacter
              </a>

              <div className="w-px h-7 mx-1 hidden sm:block" style={{ backgroundColor: "var(--card-border)" }} />

              {socials.map(({ icon: Icon, href, label, event }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent(event)}
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-all"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Droite — photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-72 xl:w-80 flex-shrink-0 mx-auto lg:mx-0"
          >
            <div className="relative">
              <div
                className="absolute -right-4 top-8 bottom-8 w-px"
                style={{ background: "linear-gradient(180deg, transparent, rgba(var(--accent-rgb),0.2), transparent)" }}
              />
              <div
                className="absolute -right-8 top-16 bottom-16 w-px"
                style={{ background: "linear-gradient(180deg, transparent, rgba(var(--accent-rgb),0.08), transparent)" }}
              />

              <div
                className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <Image src="/me.jpg" alt={personal.name} fill className="object-cover object-top" priority />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{personal.age} ans</p>
                    <p className="text-white/50 text-xs mt-0.5">{personal.location}</p>
                  </div>
                  <span className="text-base">🇫🇷</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Barre bas ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-6 pt-10 mt-auto"
        >
          <div className="flex items-center gap-2.5" style={{ color: "var(--text-secondary)" }}>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <FiArrowDown size={13} />
            </motion.div>
            <span className="text-[0.65rem] tracking-[0.25em] font-medium uppercase">Scroll</span>
          </div>

          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

          <div className="hidden sm:flex items-center gap-5">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-5" style={{ backgroundColor: "var(--card-border)" }} />}
                <div className="text-right">
                  <p className="font-display font-extrabold text-base leading-none" style={{ color: "var(--accent)" }}>
                    {s.value}
                  </p>
                  <p className="text-[0.65rem] mt-0.5" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
