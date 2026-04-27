"use client";

import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();

  const bgY    = useTransform(scrollY, [0, 700], [0, 140]);
  const photoY = useTransform(scrollY, [0, 700], [0, 60]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Aurora blobs — Warm Gold ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Blob or principal — haut centre */}
        <div
          className="blob-1 absolute rounded-full"
          style={{
            width: 800, height: 800,
            top: "-25%", left: "20%",
            background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        {/* Blob ambré — droite */}
        <div
          className="aurora-blob absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: "10%", right: "-10%",
            background: "radial-gradient(circle, rgba(180,130,60,0.05) 0%, transparent 65%)",
            filter: "blur(90px)",
          }}
        />
        {/* Blob or pâle — bas gauche */}
        <div
          className="blob-3 absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: "0%", left: "-8%",
            background: "radial-gradient(circle, rgba(220,180,90,0.04) 0%, transparent 65%)",
            filter: "blur(85px)",
          }}
        />
      </div>

      {/* ── Ambient glow (classique) ──────────────────────────────────────── */}
      <div className="hero-glow" />

      {/* ── Fond contrôlé depuis l'admin ──────────────────────────────────── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <HeroBg style={settings.bgStyle} />
      </motion.div>

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
            <span
              className="inline-flex items-center gap-2 text-[0.68rem] rounded-full px-3.5 py-1 font-mono-jb tracking-[0.14em] uppercase"
              style={{
                color: "var(--accent)",
                backgroundColor: "rgba(201,169,110,0.08)",
                border: "1px solid rgba(201,169,110,0.2)",
              }}
            >
              <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
              Disponible
            </span>
          )}
          <span className="text-[0.7rem] tracking-[0.2em] font-mono-jb ml-auto" style={{ color: "var(--text-secondary)" }}>
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
              className="text-[0.7rem] tracking-[0.35em] uppercase font-mono-jb mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              Développeur Lead Full Stack
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
                className="inline-flex items-center gap-2 font-semibold px-7 py-3 rounded-xl text-sm transition-all"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "#0A0806",
                  transition: "opacity 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.boxShadow = "0 0 32px rgba(201,169,110,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <FiDownload size={14} />
                Télécharger CV
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-medium px-7 py-3 rounded-xl text-sm transition-all"
                style={{ border: "1px solid var(--card-border)", color: "var(--text-secondary)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "rgba(201,169,110,0.4)"; }}
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
          <motion.div style={{ y: photoY }} className="lg:w-72 xl:w-80 flex-shrink-0 mx-auto lg:mx-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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

              {/* Glow derrière la photo */}
              <div
                className="absolute inset-0 rounded-[1.75rem] pointer-events-none"
                style={{
                  boxShadow: "0 0 60px rgba(var(--accent-rgb), 0.12), 0 0 120px rgba(var(--accent-rgb), 0.05)",
                  zIndex: -1,
                }}
              />

              <div
                className="relative aspect-[3/4] rounded-[1.75rem] overflow-hidden"
                style={{ border: "1px solid rgba(var(--accent-rgb), 0.12)" }}
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
                    <span className="text-white font-bold text-xs leading-none">{personal.age} ans</span>
                    <span className="w-px h-3 bg-white/20" />
                    <span className="text-white/60 text-xs">{personal.location}</span>
                  </div>
                  <span className="text-base">🇫🇷</span>
                </div>
              </div>
            </div>
          </motion.div>
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
            <span className="text-[0.65rem] tracking-[0.25em] font-mono-jb uppercase">Scroll</span>
          </div>

          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />

          <div className="hidden sm:flex items-center gap-5">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-5" style={{ backgroundColor: "var(--card-border)" }} />}
                <div className="text-right">
                  <p className="font-mono-jb font-bold text-base leading-none" style={{ color: "var(--accent)" }}>
                    {s.value}
                  </p>
                  <p className="text-[0.65rem] mt-0.5 font-mono-jb" style={{ color: "var(--text-secondary)" }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
