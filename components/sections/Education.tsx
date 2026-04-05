"use client";

import { motion } from "framer-motion";
import { useEducation } from "@/hooks/useFirestore";

export default function Education() {
  const { data: education } = useEducation();

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
          <span
            className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}
          >
            Formation
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>05</span>
        </motion.div>

        {/* ── Row list ─────────────────────────────────────────────────────── */}
        <div>
          {sorted.map((edu, i) => {
            const num = String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={edu.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="py-5 sm:py-7 flex items-start gap-4 sm:gap-6"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                {/* Number */}
                <span
                  className="font-mono text-xs pt-1 flex-shrink-0 w-6 sm:w-8"
                  style={{ color: "var(--border-subtle)" }}
                >
                  {num}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        className="font-display font-bold text-base sm:text-lg leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {edu.degree}
                      </h3>
                      {edu.current && (
                        <span
                          className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0"
                          style={{
                            color: "var(--accent)",
                            backgroundColor: "rgba(var(--accent-rgb), 0.10)",
                            border: "1px solid rgba(var(--accent-rgb), 0.20)",
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ backgroundColor: "var(--accent)" }}
                          />
                          En cours
                        </span>
                      )}
                    </div>

                    {/* Period */}
                    <span
                      className="text-[0.72rem] font-mono flex-shrink-0"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {edu.period}
                    </span>
                  </div>

                  {/* School + location */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      {edu.school}
                    </span>
                    {edu.location && (
                      <>
                        <span style={{ color: "var(--border-subtle)" }} className="text-xs">·</span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{edu.location}</span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p
                      className="text-sm leading-relaxed max-w-2xl"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
