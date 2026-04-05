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
          <span className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            Expérience
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>03</span>
        </motion.div>

        {/* Liste */}
        <div>
          {sorted.map((exp, i) => {
            const id     = exp.id ?? String(i);
            const isOpen = expanded === id;
            const num    = String(i + 1).padStart(2, "0");
            const tc     = TYPE_COLORS[exp.type] ?? { color: "var(--text-secondary)", bg: "var(--card)", border: "var(--card-border)" };

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : id)}
                  className="w-full text-left py-5 sm:py-7 flex items-start gap-4 sm:gap-6"
                >
                  {/* Numéro */}
                  <span
                    className="font-mono text-xs pt-1 flex-shrink-0 w-6 sm:w-8 transition-colors"
                    style={{ color: isOpen ? "var(--accent)" : "var(--border-subtle)" }}
                  >
                    {num}
                  </span>

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
                      <span className="text-[0.72rem] font-mono flex-shrink-0" style={{ color: "var(--text-secondary)" }}>
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
                            className="flex items-center gap-1 text-[0.68rem] rounded px-2 py-0.5"
                            style={{
                              color:           "var(--text-secondary)",
                              backgroundColor: "var(--surface)",
                              border:          "1px solid var(--card-border)",
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
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 mt-1"
                    style={{ color: "var(--text-secondary)" }}
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
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <ul className="pl-10 sm:pl-14 pb-6 space-y-2.5">
                        {exp.description.map((point, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <span className="text-[0.55rem] mt-2 flex-shrink-0" style={{ color: "var(--accent)" }}>▸</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
