"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useExperience } from "@/hooks/useFirestore";
import { getTechIcon } from "@/lib/iconMap";

const typeBadgeColor: Record<string, string> = {
  CDI:        "text-emerald-400 bg-emerald-400/8 border-emerald-400/20",
  CDD:        "text-blue-400 bg-blue-400/8 border-blue-400/20",
  Stage:      "text-violet-400 bg-violet-400/8 border-violet-400/20",
  Alternance: "text-amber-400 bg-amber-400/8 border-amber-400/20",
  Freelance:  "text-cyan-400 bg-cyan-400/8 border-cyan-400/20",
  Intérim:    "text-rose-400 bg-rose-400/8 border-rose-400/20",
};

export default function Experience() {
  const { data: experiences } = useExperience();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = [...experiences].sort((a, b) => a.order - b.order);

  return (
    <section id="experience" className="py-28 px-6">
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
            Expérience
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>03</span>
        </motion.div>

        {/* ── Numbered list ─────────────────────────────────────────────────── */}
        <div className="divide-y divide-[#141414]">
          {sorted.map((exp, i) => {
            const id      = exp.id ?? String(i);
            const isOpen  = expanded === id;
            const num     = String(i + 1).padStart(2, "0");
            const badge   = typeBadgeColor[exp.type] ?? "text-slate-400 bg-[#1a1a1a] border-[#252525]";

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : id)}
                  className="w-full text-left py-7 flex items-start gap-6 group"
                >
                  {/* Number */}
                  <span
                    className="font-mono text-xs pt-1 flex-shrink-0 w-8 transition-colors"
                    style={{ color: isOpen ? "var(--accent)" : "#333" }}
                  >
                    {num}
                  </span>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="font-display font-bold text-white text-xl leading-tight group-hover:opacity-90 transition-opacity">
                          {exp.role}
                        </h3>
                        {exp.current && (
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
                        {exp.period}
                      </span>
                    </div>

                    {/* Company + type */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "var(--accent)" }}
                      >
                        {exp.company}
                      </span>
                      <span className={`text-[0.68rem] font-medium border rounded-full px-2 py-0.5 ${badge}`}>
                        {exp.type}
                      </span>
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => {
                        const Icon = getTechIcon(t);
                        return (
                          <span key={t} className="flex items-center gap-1 text-[0.7rem] text-slate-500 bg-[#111] border border-[#1e1e1e] rounded px-2 py-0.5">
                            {Icon && <Icon size={10} className="text-slate-700" />}
                            {t}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expand icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-700 mt-1 flex-shrink-0"
                  >
                    <FiChevronDown size={16} />
                  </motion.div>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && exp.description.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-14 pb-7">
                        <ul className="space-y-3">
                          {exp.description.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                              <span
                                className="text-[0.6rem] mt-2 flex-shrink-0"
                                style={{ color: "var(--accent)" }}
                              >
                                ▸
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
