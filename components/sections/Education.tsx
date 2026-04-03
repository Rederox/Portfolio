"use client";

import { motion } from "framer-motion";
import { useEducation } from "@/hooks/useFirestore";

export default function Education() {
  const { data: education } = useEducation();

  const sorted = [...education].sort((a, b) => a.order - b.order);

  return (
    <section id="education" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="text-white font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase">
            Formation
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>05</span>
        </motion.div>

        {/* ── Row list ─────────────────────────────────────────────────────── */}
        <div className="divide-y divide-[#141414]">
          {sorted.map((edu, i) => {
            const num = String(i + 1).padStart(2, "0");

            return (
              <motion.div
                key={edu.id ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="py-7 flex items-start gap-6 group"
              >
                {/* Number */}
                <span className="font-mono text-xs pt-1 flex-shrink-0 w-8 text-[#2a2a2a]">
                  {num}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-white text-lg leading-tight">
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
                    <span className="text-slate-600 text-xs font-mono flex-shrink-0">
                      {edu.period}
                    </span>
                  </div>

                  {/* School + location */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      {edu.school}
                    </span>
                    {edu.location && (
                      <>
                        <span className="text-slate-700 text-xs">·</span>
                        <span className="text-slate-600 text-xs">{edu.location}</span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
