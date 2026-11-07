"use client";

import { motion } from "framer-motion";
import { personal, stats } from "@/data/portfolio";

const facts = [
  { label: "Âge",          value: `${personal.age} ans` },
  { label: "Localisation", value: "Argenteuil · France" },
  { label: "Langues",      value: "Français · Anglais (C1) · Tamoul" },
  { label: "Mobilité",     value: "Permis B · Véhiculé" },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay } },
});

const reveal = { initial: "hidden", whileInView: "show", viewport: { once: true } } as const;

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Titre ─────────────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp()} {...reveal} className="flex items-center gap-5 mb-10 sm:mb-16">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight"
            style={{ color: "var(--text-primary)" }}>
            À propos
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <span className="font-mono-jb text-xs" style={{ color: "var(--text-secondary)" }}>01</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── Colonne gauche : intro + chiffres ──────────────────────────── */}
          <motion.div variants={fadeUp(0.05)} {...reveal} className="lg:col-span-5 flex flex-col">
            {personal.available && (
              <span
                className="self-start inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-6"
                style={{
                  color:           "var(--accent)",
                  backgroundColor: "rgba(var(--accent-rgb), 0.1)",
                  border:          "1px solid rgba(var(--accent-rgb), 0.25)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                Disponible pour de nouvelles opportunités
              </span>
            )}

            <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>
              {personal.role}
            </p>

            <p className="text-lg sm:text-xl leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {personal.bio}
            </p>

            <dl className="grid grid-cols-3 mt-10 pt-8" style={{ borderTop: "1px solid var(--card-border)" }}>
              {stats.map(({ value, short }, i) => (
                <div
                  key={short}
                  className={i === 0 ? "pr-4" : "px-4"}
                  style={i === 0 ? undefined : { borderLeft: "1px solid var(--card-border)" }}
                >
                  <dt className="sr-only">{short}</dt>
                  <dd className="font-display font-semibold text-2xl sm:text-3xl leading-none"
                    style={{ color: "var(--text-primary)" }}>
                    {value}
                  </dd>
                  <dd className="text-xs sm:text-sm mt-2 leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {short}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* ── Colonne droite : carte infos ───────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.12)}
            {...reveal}
            className="lg:col-span-7 rounded-[20px] p-6 sm:p-10"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--card-border)" }}
          >
            <dl>
              {facts.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-6 py-5"
                  style={i < facts.length - 1 ? { borderBottom: "1px solid var(--card-border)" } : undefined}
                >
                  <dt className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>{label}</dt>
                  <dd className="text-base sm:text-lg font-medium sm:text-right" style={{ color: "var(--text-primary)" }}>
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <p className="text-sm sm:text-base mb-4" style={{ color: "var(--text-secondary)" }}>
                Centres d&apos;intérêt
              </p>
              <ul className="flex flex-wrap gap-2.5">
                {personal.interests.map(({ label }) => (
                  <li
                    key={label}
                    className="text-sm font-medium rounded-lg px-4 py-2.5 transition-colors"
                    style={{
                      color:           "var(--text-primary)",
                      backgroundColor: "var(--card)",
                      border:          "1px solid var(--card-border)",
                    }}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
