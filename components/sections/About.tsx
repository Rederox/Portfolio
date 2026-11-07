"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { personal } from "@/data/portfolio";

const facts = [
  { label: "Âge",          value: `${personal.age} ans`        },
  { label: "Localisation", value: "Argenteuil · France"        },
  { label: "Langues",      value: "Français · Anglais (C1) · Tamoul" },
  { label: "Mobilité",     value: "Permis B · Véhiculé"        },
];

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 12 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number], delay } },
});

export default function About() {
  return (
    <section id="about" className="pt-20 sm:pt-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <h2 className="font-display font-medium text-xl sm:text-2xl"
            style={{ color: "var(--text-primary)" }}>
            À propos
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>01</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ─ En bref + centres d'intérêt ─────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bento-cell lg:col-span-8 p-6 sm:p-8 flex flex-col gap-8"
          >
            <dl>
              {facts.map(({ label, value }, i) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-6 py-4"
                  style={i > 0 ? { borderTop: "1px solid var(--border-subtle)" } : undefined}
                >
                  <dt className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</dt>
                  <dd className="text-[15px] text-right" style={{ color: "var(--text-primary)" }}>{value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                Centres d&apos;intérêt
              </p>
              <ul className="flex flex-wrap gap-2">
                {personal.interests.map(({ label }) => (
                  <li
                    key={label}
                    className="text-[13px] rounded-lg px-3 py-1.5"
                    style={{
                      color: "var(--text-primary)",
                      backgroundColor: "var(--tint-2)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ─ Photo ───────────────────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bento-cell lg:col-span-4 overflow-hidden"
          >
            <div className="relative w-full h-full min-h-[360px]">
              <Image
                src="/about.jpg"
                alt={personal.name}
                fill
                sizes="(min-width: 1024px) 380px, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 30%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
