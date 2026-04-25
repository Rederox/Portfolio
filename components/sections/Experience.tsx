"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useExperience } from "@/hooks/useFirestore";
import { getTechIcon } from "@/lib/iconMap";

const TYPE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  CDI:        { color: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.2)"  },
  CDD:        { color: "#60a5fa", bg: "rgba(96,165,250,0.08)",  border: "rgba(96,165,250,0.2)"  },
  Stage:      { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
  Alternance: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.2)"  },
  Freelance:  { color: "#22d3ee", bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.2)"  },
  Intérim:    { color: "#fb7185", bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.2)" },
};

export default function Experience() {
  const { data: experiences } = useExperience();
  const [expanded, setExpanded] = useState<string | null>(null);
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <h2 className="font-display font-bold text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            Expérience
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-[0.7rem]" style={{ color: "var(--accent)" }}>03</span>
        </motion.div>

        {/* Liste avec timeline ───────────────────────────────────────────── */}
        <div className="relative">
          {/* Ligne verticale timeline */}
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px hidden sm:block"
            style={{ background: "linear-gradient(180deg, transparent, rgba(var(--accent-rgb),0.15) 10%, rgba(var(--accent-rgb),0.15) 90%, transparent)" }}
          />

          <div className="space-y-3">
            {sorted.map((exp, i) => {
              const id     = exp.id ?? String(i);
              const isOpen = expanded === id;
              const tc     = TYPE_COLORS[exp.type] ?? { color: "var(--text-secondary)", bg: "var(--card)", border: "var(--card-border)" };

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  className="relative sm:pl-10"
                >
                  {/* Dot timeline */}
                  <div
                    className="absolute left-0 top-6 w-[23px] h-[23px] rounded-full border-2 hidden sm:flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      borderColor: isOpen ? "var(--accent)" : "rgba(var(--accent-rgb),0.2)",
                      backgroundColor: isOpen ? "rgba(var(--accent-rgb),0.15)" : "var(--bg)",
                      boxShadow: isOpen ? "0 0 12px rgba(var(--accent-rgb),0.3)" : "none",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{ backgroundColor: isOpen ? "var(--accent)" : "rgba(var(--accent-rgb),0.4)" }}
                    />
                  </div>

                  {/* Card glassmorphism */}
                  <motion.div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: isOpen ? "rgba(var(--accent-rgb),0.04)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isOpen ? "rgba(var(--accent-rgb),0.18)" : "rgba(255,255,255,0.06)"}`,
                      backdropFilter: "blur(12px)",
                      transition: "background 0.25s ease, border-color 0.25s ease",
                    }}
                    whileHover={{ borderColor: "rgba(var(--accent-rgb),0.14)" }}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : id)}
                      className="w-full text-left px-5 sm:px-6 py-5 flex items-start gap-4"
                    >
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        {/* Titre + période */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <h3
                              className="font-display font-bold text-lg sm:text-xl leading-tight"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {exp.role}
                            </h3>
                            {exp.current && (
                              <span
                                className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0"
                                style={{
                                  color:           "var(--accent)",
                                  backgroundColor: "rgba(var(--accent-rgb), 0.10)",
                                  border:          "1px solid rgba(var(--accent-rgb), 0.20)",
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
                                En cours
                              </span>
                            )}
                          </div>
                          <span className="text-[0.72rem] font-mono-jb flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
                            {exp.period}
                          </span>
                        </div>

                        {/* Entreprise + type */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                            {exp.company}
                          </span>
                          <span
                            className="text-[0.65rem] font-medium border rounded-full px-2 py-0.5"
                            style={{ color: tc.color, backgroundColor: tc.bg, borderColor: tc.border }}
                          >
                            {exp.type}
                          </span>
                        </div>

                        {/* Stack */}
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((t) => {
                            const Icon = getTechIcon(t);
                            return (
                              <span
                                key={t}
                                className="flex items-center gap-1 text-[0.68rem] rounded-lg px-2 py-0.5"
                                style={{
                                  color:   "var(--text-secondary)",
                                  background: "rgba(255,255,255,0.04)",
                                  border:  "1px solid rgba(255,255,255,0.07)",
                                }}
                              >
                                {Icon && <Icon size={10} style={{ color: "var(--text-secondary)", opacity: 0.7 }} />}
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-shrink-0 mt-1"
                        style={{ color: isOpen ? "var(--accent)" : "var(--text-secondary)" }}
                      >
                        <FiChevronDown size={15} />
                      </motion.div>
                    </button>

                    {/* Description dépliée */}
                    <AnimatePresence initial={false}>
                      {isOpen && exp.description.length > 0 && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="px-5 sm:px-6 pb-5 space-y-2.5 border-t" style={{ borderColor: "rgba(var(--accent-rgb),0.1)" }}>
                            {exp.description.map((point, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.04, duration: 0.3 }}
                                className="flex items-start gap-2.5 text-sm leading-relaxed pt-2.5"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <span className="text-[0.55rem] mt-2 flex-shrink-0" style={{ color: "var(--accent)" }}>▸</span>
                                {point}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
