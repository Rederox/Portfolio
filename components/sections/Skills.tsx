"use client";

import { motion } from "framer-motion";
import { getIconByKey } from "@/lib/iconMap";
import { useSkills } from "@/hooks/useFirestore";

export default function Skills() {
  const { data: skillCategories } = useSkills();
  const sorted = [...skillCategories].sort((a, b) => a.order - b.order);
  const total = sorted.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <section id="skills" className="py-28 px-6">
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
            Stack Technique
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="font-mono text-[0.65rem] text-slate-700">{total} technos</span>
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>02</span>
        </motion.div>

        {/* ── Catégories — tout visible d'un coup ───────────────────────────── */}
        <div className="space-y-10">
          {sorted.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: ci * 0.06 }}
            >
              {/* En-tête catégorie */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="font-mono text-[0.6rem] font-bold tabular-nums"
                  style={{ color: "var(--accent)" }}
                >
                  {String(ci + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] font-semibold text-slate-500">
                  {cat.category}
                </span>
                <div className="flex-1 h-px bg-[#181818]" />
                <span className="text-[0.6rem] font-mono text-slate-700">{cat.items.length}</span>
              </div>

              {/* Grille de chips compacte */}
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill, i) => {
                  const Icon = getIconByKey(skill.icon);
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.88 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: ci * 0.04 + i * 0.02 }}
                      className="group flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-150 cursor-default"
                      style={{ backgroundColor: "var(--surface)", border: "1px solid var(--card-border)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 0 0 1px rgba(var(--accent-rgb),0.2)";
                        e.currentTarget.style.borderColor = "rgba(var(--accent-rgb),0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "";
                        e.currentTarget.style.borderColor = "var(--card-border)";
                      }}
                    >
                      {/* Icône */}
                      <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                        {Icon ? (
                          <Icon
                            size={14}
                            className="text-slate-600 group-hover:text-slate-300 transition-colors"
                          />
                        ) : skill.imageUrl ? (
                          <img
                            src={skill.imageUrl}
                            alt={skill.name}
                            className="w-3.5 h-3.5 object-contain opacity-50 group-hover:opacity-90 transition-opacity"
                          />
                        ) : (
                          <div
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[0.4rem] font-bold text-white"
                            style={{ backgroundColor: "rgba(var(--accent-rgb), 0.25)" }}
                          >
                            {skill.name.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Nom */}
                      <span className="text-slate-400 group-hover:text-slate-200 text-xs font-medium whitespace-nowrap transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
