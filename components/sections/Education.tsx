"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiBook } from "react-icons/fi";
import { useEducation } from "@/hooks/useFirestore";

export default function Education() {
  const { data: education } = useEducation();
  const [expanded, setExpanded] = useState<string | null>(null);
  const sorted = [...education].sort((a, b) => a.order - b.order);

  return (
    <section id="education" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10 sm:mb-14"
        >
          <span className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            Formation
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>05</span>
        </motion.div>

        {/* ── Cards ────────────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {sorted.map((edu, i) => {
            const id     = edu.id ?? String(i);
            const isOpen = expanded === id;
            const hasDesc = !!edu.description;

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20, x: -12 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: isOpen ? "rgba(var(--accent-rgb),0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isOpen ? "rgba(var(--accent-rgb),0.2)" : "rgba(255,255,255,0.06)"}`,
                    backdropFilter: "blur(12px)",
                    transition: "background 0.25s ease, border-color 0.25s ease",
                  }}
                  whileHover={hasDesc ? { borderColor: "rgba(var(--accent-rgb),0.14)" } : {}}
                >
                  {/* Row principale — cliquable si description */}
                  <div
                    className={`flex items-start gap-4 sm:gap-5 px-5 sm:px-6 py-5 ${hasDesc ? "cursor-pointer" : ""}`}
                    onClick={() => hasDesc && setExpanded(isOpen ? null : id)}
                    role={hasDesc ? "button" : undefined}
                    tabIndex={hasDesc ? 0 : undefined}
                    onKeyDown={(e) => e.key === "Enter" && hasDesc && setExpanded(isOpen ? null : id)}
                  >
                    {/* Icône */}
                    <div
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: isOpen
                          ? "rgba(var(--accent-rgb),0.15)"
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isOpen ? "rgba(var(--accent-rgb),0.3)" : "rgba(255,255,255,0.08)"}`,
                        transition: "all 0.25s ease",
                      }}
                    >
                      <FiBook size={14} style={{ color: isOpen ? "var(--accent)" : "var(--text-secondary)" }} />
                    </div>

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* Diplôme + En cours + période */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-1.5">
                        <div className="flex items-center flex-wrap gap-2 min-w-0">
                          <h3
                            className="font-display font-bold text-base sm:text-lg leading-tight"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {edu.degree}
                          </h3>
                          {edu.current && (
                            <span
                              className="inline-flex items-center gap-1.5 text-[0.62rem] font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0"
                              style={{
                                color:           "var(--accent)",
                                backgroundColor: "rgba(var(--accent-rgb),0.10)",
                                border:          "1px solid rgba(var(--accent-rgb),0.20)",
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ backgroundColor: "var(--accent)" }} />
                              En cours
                            </span>
                          )}
                        </div>
                        <span className="text-[0.72rem] font-mono flex-shrink-0"
                          style={{ color: "var(--text-secondary)" }}>
                          {edu.period}
                        </span>
                      </div>

                      {/* École + localisation */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                          {edu.school}
                        </span>
                        {edu.location && (
                          <>
                            <span style={{ color: "var(--border-subtle)" }} className="text-xs select-none">·</span>
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                              {edu.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Chevron si description */}
                    {hasDesc && (
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-shrink-0 mt-1"
                        style={{ color: isOpen ? "var(--accent)" : "var(--text-secondary)" }}
                      >
                        <FiChevronDown size={15} />
                      </motion.div>
                    )}
                  </div>

                  {/* Description dépliée */}
                  <AnimatePresence initial={false}>
                    {isOpen && edu.description && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-5 sm:px-6 pb-5 pt-3 text-sm leading-relaxed"
                          style={{
                            color: "var(--text-secondary)",
                            borderTop: "1px solid rgba(var(--accent-rgb),0.1)",
                          }}
                        >
                          {edu.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}

          {sorted.length === 0 && (
            <div className="text-center py-16">
              <FiBook size={28} className="mx-auto mb-3" style={{ color: "var(--card-border)", opacity: 0.5 }} />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Aucune formation pour le moment.</p>
            </div>
          )}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
