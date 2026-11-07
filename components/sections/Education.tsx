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
    <section id="education" className="pt-20 sm:pt-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <h2 className="font-display font-medium text-xl sm:text-2xl"
            style={{ color: "var(--text-primary)" }}>
            Formation
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>05</span>
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
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: isOpen ? "var(--tint-2)" : "var(--tint-1)",
                    border: `1px solid ${isOpen ? "var(--card-border)" : "var(--border-subtle)"}`,
                    transition: "background-color 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {/* Row principale — cliquable si description */}
                  <div
                    className={`flex items-start gap-4 sm:gap-5 px-5 sm:px-6 py-5 ${hasDesc ? "cursor-pointer" : ""}`}
                    onClick={() => hasDesc && setExpanded(isOpen ? null : id)}
                    role={hasDesc ? "button" : undefined}
                    aria-expanded={hasDesc ? isOpen : undefined}
                    tabIndex={hasDesc ? 0 : undefined}
                    onKeyDown={(e) => e.key === "Enter" && hasDesc && setExpanded(isOpen ? null : id)}
                  >
                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      {/* Diplôme + En cours + période */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-3 mb-1.5">
                        <div className="flex items-center flex-wrap gap-2 min-w-0">
                          <h3
                            className="font-display font-medium text-base sm:text-lg leading-tight"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {edu.degree}
                          </h3>
                        </div>
                        <span className="text-xs font-mono-jb tabular-nums flex-shrink-0"
                          style={{ color: edu.current ? "var(--accent)" : "var(--text-secondary)" }}>
                          {edu.period}
                        </span>
                      </div>

                      {/* École + localisation */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {edu.school}
                        </span>
                        {edu.location && (
                          <>
                            <span style={{ color: "var(--text-secondary)" }} className="text-sm select-none">·</span>
                            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
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
                        style={{ color: "var(--text-secondary)" }}
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
                            borderTop: "1px solid var(--border-subtle)",
                          }}
                        >
                          {edu.description}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}

          {sorted.length === 0 && (
            <div className="text-center py-16">
              <FiBook size={28} className="mx-auto mb-3" style={{ color: "var(--card-border)", opacity: 0.5 }} />
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Aucune formation pour le moment</p>
            </div>
          )}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
