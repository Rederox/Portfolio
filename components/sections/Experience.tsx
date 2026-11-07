"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useExperience } from "@/hooks/useFirestore";
import { getTechIcon } from "@/lib/iconMap";

export default function Experience() {
  const { data: experiences } = useExperience();
  const [expanded, setExpanded] = useState<string | null>(null);
  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="pt-20 sm:pt-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <h2 className="font-display font-medium text-xl sm:text-2xl"
            style={{ color: "var(--text-primary)" }}>
            Expérience
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>02</span>
        </motion.div>

        {/* Liste avec timeline ───────────────────────────────────────────── */}
        <div className="relative">
          {/* Ligne verticale timeline */}
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px hidden sm:block"
            style={{ backgroundColor: "var(--border-subtle)" }}
          />

          <div className="space-y-3">
            {sorted.map((exp, i) => {
              const id     = exp.id ?? String(i);
              const isOpen = expanded === id;

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="relative sm:pl-10"
                >
                  {/* Dot timeline */}
                  <div
                    className="absolute left-0 top-6 w-6 h-6 rounded-full border hidden sm:flex items-center justify-center flex-shrink-0 transition-colors duration-150"
                    style={{
                      borderColor: exp.current ? "rgba(var(--accent-rgb),0.4)" : "var(--card-border)",
                      backgroundColor: "var(--bg)",
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: exp.current ? "var(--accent)" : "var(--text-secondary)" }}
                    />
                  </div>

                  {/* Card glassmorphism */}
                  <motion.div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: isOpen ? "var(--tint-2)" : "var(--tint-1)",
                      border: `1px solid ${isOpen ? "var(--card-border)" : "var(--border-subtle)"}`,
                      transition: "background-color 0.15s ease, border-color 0.15s ease",
                    }}
                  >
                    <button
                      onClick={() => setExpanded(isOpen ? null : id)}
                      aria-expanded={isOpen}
                      aria-label={`${exp.role} chez ${exp.company} — ${isOpen ? "replier" : "voir"} le détail`}
                      className="w-full text-left px-5 sm:px-6 py-5 flex items-start gap-4"
                    >
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        {/* Titre + période */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                          <div className="flex items-center flex-wrap gap-2">
                            <h3
                              className="font-display font-medium text-lg sm:text-xl leading-tight"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {exp.role}
                            </h3>
                          </div>
                          <span className="text-xs font-mono-jb tabular-nums flex-shrink-0" style={{ color: exp.current ? "var(--accent)" : "var(--text-secondary)" }}>
                            {exp.period}
                          </span>
                        </div>

                        {/* Entreprise + type */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {exp.company}
                          </span>
                          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            · {exp.type}
                          </span>
                        </div>

                        {/* Stack */}
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((t) => {
                            const Icon = getTechIcon(t);
                            return (
                              <span
                                key={t}
                                className="flex items-center gap-1 text-xs rounded-md px-2 py-0.5"
                                style={{
                                  color:   "var(--text-secondary)",
                                  background: "var(--tint-2)",
                                  border:  "1px solid var(--border-subtle)",
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
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="px-5 sm:px-6 pb-5 space-y-2.5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                            {exp.description.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2.5 text-sm leading-relaxed pt-2.5"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <span className="flex-shrink-0" style={{ color: "var(--text-secondary)" }}>–</span>
                                {point}
                              </li>
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
