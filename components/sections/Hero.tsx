"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiDownload, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { personal, stats as sharedStats } from "@/data/portfolio";
import { trackEvent, type EventType } from "@/lib/analytics";
import { useTheme } from "@/lib/theme-context";
import CvDownloadMenu from "@/components/CvDownloadMenu";

const socials: { icon: React.ElementType; href: string; label: string; event: EventType }[] = [
  { icon: FiGithub,    href: personal.github,              label: "GitHub",    event: "github_click" },
  { icon: FiLinkedin,  href: personal.linkedin,            label: "LinkedIn",  event: "linkedin_click" },
  { icon: FiInstagram, href: personal.instagram,           label: "Instagram", event: "instagram_click" },
  { icon: FiMail,      href: `mailto:${personal.email}`,   label: "Email",     event: "email_click" },
];

const stats = sharedStats.map(({ value, short }) => ({ value, label: short }));


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

      {/* ── Fond contrôlé depuis l'admin ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroBg style={settings.bgStyle} />
      </div>

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
            <span
              className="inline-flex items-center gap-2 text-xs font-mono-jb"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
              Disponible pour un poste
            </span>
          )}
        </motion.div>

        {/* ── Contenu principal ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16">

          {/* Gauche — texte + CTAs */}
          <div className="flex-1 min-w-0">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-mono-jb mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {personal.role}
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-bold leading-[0.88] uppercase"
                style={{ fontSize: "clamp(4rem, 10vw, 9rem)", letterSpacing: "-0.04em" }}
              >
                <span className="block" style={{ color: "var(--text-primary)" }}>
                  {personal.firstName}
                </span>
                <span className="block hero-name-outlined">
                  {personal.lastName}.
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-8 max-w-lg leading-relaxed text-[15px]"
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
              <CvDownloadMenu
                align="left"
                trigger={({ toggle }) => (
                  <button
                    onClick={toggle}
                    className="inline-flex items-center gap-2 font-semibold px-7 py-3 rounded-xl text-sm transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: "var(--accent)", color: "#0A0806" }}
                  >
                    <FiDownload size={14} />
                    Télécharger CV
                    <FiChevronDown size={12} />
                  </button>
                )}
              />
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-medium px-7 py-3 rounded-xl text-sm transition-colors duration-150 text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--tint-3)]"
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
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-150 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Droite — photo */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div
                className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <Image src="/me.jpg" alt={personal.name} fill className="object-cover object-top" priority />
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Badge glassmorphism en bas */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div
                    className="flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{
                      background: "rgba(0,0,0,0.45)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <span className="text-white font-medium text-xs leading-none">{personal.age} ans</span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="text-white/60 text-xs">{personal.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>

        {/* ── Barre bas ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-6 pt-10 mt-auto"
        >
          <div className="hidden sm:block flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

          <div className="flex items-center gap-4 sm:gap-5">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-5" style={{ backgroundColor: "var(--card-border)" }} />}
                <div className="sm:text-right">
                  <p className="font-mono-jb font-medium text-base leading-none tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {s.value}
                  </p>
                  <p className="text-xs mt-1 font-mono-jb" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
