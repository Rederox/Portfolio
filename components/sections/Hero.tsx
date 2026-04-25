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

      {/* ── Aurora blobs OLED ────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Blob vert (accent) — en haut centre */}
        <div
          className="blob-1 absolute rounded-full"
          style={{
            width: 700, height: 700,
            top: "-20%", left: "25%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb), 0.08) 0%, transparent 65%)`,
            filter: "blur(70px)",
          }}
        />
        {/* Blob bleu/indigo — droite milieu */}
        <div
          className="aurora-blob absolute rounded-full"
          style={{
            width: 550, height: 550,
            top: "15%", right: "-8%",
            background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
        {/* Blob violet — bas gauche */}
        <div
          className="blob-3 absolute rounded-full"
          style={{
            width: 450, height: 450,
            bottom: "5%", left: "-5%",
            background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)",
            filter: "blur(75px)",
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
            <span className="accent-badge inline-flex items-center gap-2 text-[0.7rem] rounded-full px-3 py-1 font-semibold tracking-[0.12em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
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
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-extrabold leading-[0.86] uppercase"
                style={{ fontSize: "clamp(3.8rem, 9vw, 8.5rem)", color: "var(--text-primary)", letterSpacing: "-0.03em" }}
              >
                <span className="block tracking-[-0.02em]">
                  {personal.firstName}
                </span>
                <span className="block hero-name-outlined tracking-[-0.02em]">
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
