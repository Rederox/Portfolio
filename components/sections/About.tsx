"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { personal } from "@/data/portfolio";

const facts = [
  { label: "Âge",          value: `${personal.age} ans`        },
  { label: "Localisation", value: "Argenteuil · France"        },
  { label: "Langues",      value: "Français · Anglais · Tamoul" },
  { label: "Mobilité",     value: "Permis B · Véhiculé"        },
];

const stats = [
  { value: "3+",  label: "Ans d'expérience", icon: "⚡" },
  { value: "15+", label: "Projets réalisés",  icon: "🚀" },
  { value: "5",   label: "Stacks maîtrisées", icon: "🛠" },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay } },
});

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-10 sm:mb-14"
        >
          <span className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            À Propos
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>01</span>
        </motion.div>

        {/* ── Bento Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">

          {/* ─ Cellule A : Bio — grande, 2/3 largeur ─────────────────────── */}
          <motion.div
            variants={fadeUp(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bento-cell sm:col-span-2 lg:col-span-8 p-6 sm:p-7 lg:p-9 flex flex-col justify-between min-h-[220px] sm:min-h-[260px]"
          >
            <div>
              <p
                className="text-[0.6rem] tracking-[0.45em] uppercase font-semibold mb-5"
                style={{ color: "rgba(var(--accent-rgb), 0.8)" }}
              >
                Développeur Lead Full Stack
              </p>
              <p
                className="text-base sm:text-[1.2rem] leading-relaxed font-light"
                style={{ color: "var(--text-primary)" }}
              >
                {personal.bio}
              </p>
            </div>

            {/* Intérêts */}
            <div className="mt-6">
              <p className="text-[0.58rem] tracking-widest uppercase font-semibold mb-3"
                style={{ color: "var(--text-secondary)" }}>
                Centres d'intérêt
              </p>
              <div className="flex flex-wrap gap-2">
                {personal.interests.map(({ emoji, label }) => (
                  <motion.span
                    key={label}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 text-[0.75rem] rounded-full px-3 py-1.5 cursor-default transition-colors"
                    style={{
                      color:           "var(--text-secondary)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border:          "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span>{emoji}</span>
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─ Cellule B : Photo — 1/3 largeur, 2 lignes de hauteur ────────── */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{ y: photoY }}
            className="bento-cell sm:col-span-1 lg:col-span-4 lg:row-span-2 overflow-hidden"
          >
            <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px]">
              <Image
                src="/me.jpg"
                alt={personal.name}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

              {personal.available && (
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold"
                  style={{
                    backgroundColor: "rgba(var(--accent-rgb), 0.18)",
                    backdropFilter: "blur(12px)",
                    border:          "1px solid rgba(var(--accent-rgb), 0.3)",
                    color:           "var(--accent)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: "var(--accent)" }} />
                  Open to work
                </div>
              )}

              {/* Faits en overlay bas */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                {facts.slice(0, 2).map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-1.5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                    <span className="text-[0.58rem] uppercase tracking-widest font-semibold text-white/40">{label}</span>
                    <span className="text-xs font-medium text-white/80">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ─ Cellule C : Stats — 3 mini-cards côte à côte ─────────────── */}
          <motion.div
            variants={fadeUp(0.14)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="sm:col-span-1 lg:col-span-8 grid grid-cols-3 gap-3 sm:gap-4"
          >
            {stats.map(({ value, label, icon }, i) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="bento-cell p-5 flex flex-col gap-3 cursor-default"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p
                    className="font-display font-extrabold text-3xl leading-none"
                    style={{ color: "var(--accent)" }}
                  >
                    {value}
                  </p>
                  <p className="text-[0.68rem] mt-1 leading-tight" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ─ Cellule D : Faits supplémentaires ─────────────────────────── */}
          <motion.div
            variants={fadeUp(0.18)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bento-cell sm:col-span-2 lg:col-span-8 px-5 sm:px-7 py-1"
          >
            {facts.slice(2).map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="text-[0.62rem] uppercase tracking-widest font-semibold"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {label}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {value}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
