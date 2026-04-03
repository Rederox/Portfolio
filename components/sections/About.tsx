"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { personal } from "@/data/portfolio";

const facts = [
  { label: "Âge",          value: `${personal.age} ans`        },
  { label: "Localisation", value: "Argenteuil · France"        },
  { label: "Langues",      value: "Français · Anglais · Tamoul" },
  { label: "Mobilité",     value: "Permis B · Véhiculé"        },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay } },
});

export default function About() {
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            À Propos
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>01</span>
        </motion.div>

        {/* ── Layout ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">

          {/* ─ Colonne gauche : bio + intérêts + stats ─ */}
          <div>
            {/* Rôle */}
            <motion.p
              variants={fadeUp(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-[0.65rem] tracking-[0.45em] uppercase font-semibold mb-8"
              style={{ color: "rgba(var(--accent-rgb), 0.8)" }}
            >
              Développeur Lead Full Stack
            </motion.p>

            {/* Bio éditoriale */}
            <motion.p
              variants={fadeUp(0.12)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-[1.35rem] leading-relaxed font-light mb-10"
              style={{ color: "var(--text-primary)" }}
            >
              {personal.bio}
            </motion.p>

            {/* Intérêts */}
            <motion.div
              variants={fadeUp(0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-[0.65rem] tracking-widest uppercase font-semibold mb-4"
                style={{ color: "var(--text-secondary)" }}>
                Centres d'intérêt
              </p>
              <div className="flex flex-wrap gap-2">
                {personal.interests.map(({ emoji, label }) => (
                  <span
                    key={label}
                    className="flex items-center gap-1.5 text-[0.78rem] rounded-full px-3 py-1.5 transition-all"
                    style={{
                      color:           "var(--text-secondary)",
                      backgroundColor: "var(--surface)",
                      border:          "1px solid var(--card-border)",
                    }}
                  >
                    <span className="text-sm">{emoji}</span>
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Stats rapides */}
            <motion.div
              variants={fadeUp(0.27)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-0"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              {[
                { value: "3+",  label: "Ans d'expérience" },
                { value: "15+", label: "Projets réalisés" },
                { value: "5",   label: "Stacks maîtrisées" },
              ].map(({ value, label }, i) => (
                <div
                  key={label}
                  className="pt-6"
                  style={{
                    paddingLeft:   i > 0 ? "2rem" : 0,
                    borderLeft:    i > 0 ? `1px solid var(--border-subtle)` : "none",
                    marginLeft:    i > 0 ? "2rem" : 0,
                  }}
                >
                  <p className="font-display font-extrabold text-3xl leading-none mb-1"
                    style={{ color: "var(--accent)" }}>
                    {value}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─ Colonne droite : photo + faits ─ */}
          <motion.div
            variants={fadeUp(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Photo */}
            <div
              className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-0"
              style={{ border: "1px solid var(--card-border)" }}
            >
              <Image
                src="/about.jpg"
                alt={personal.name}
                fill
                className="object-cover object-center"
              />
              {/* Badge disponible */}
              {personal.available && (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.65rem] font-semibold backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(var(--accent-rgb), 0.18)",
                    border:          "1px solid rgba(var(--accent-rgb), 0.35)",
                    color:           "var(--accent)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--accent)" }} />
                  Open to work
                </div>
              )}
            </div>

            {/* Tableau de faits */}
            <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
              {facts.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-4"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span
                    className="text-[0.65rem] uppercase tracking-widest font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
