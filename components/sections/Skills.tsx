"use client";

import { motion } from "framer-motion";
import { getIconByKey } from "@/lib/iconMap";
import { useSkills } from "@/hooks/useFirestore";

// Couleur accent par catégorie (cycled)
const CAT_ACCENTS = [
  { dot: "#10b981", glow: "rgba(16,185,129,0.12)" },
  { dot: "#818cf8", glow: "rgba(129,140,248,0.12)" },
  { dot: "#38bdf8", glow: "rgba(56,189,248,0.12)" },
  { dot: "#fb923c", glow: "rgba(251,146,60,0.12)"  },
];

export default function Skills() {
  const { data: skillCategories } = useSkills();
  const sorted = [...skillCategories].sort((a, b) => a.order - b.order);
  const total  = sorted.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6">
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
            Stack Technique
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.65rem]" style={{ color: "var(--text-secondary)" }}>
            {total} technos
          </span>
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>02</span>
        </motion.div>

        {/* ── Bento cards par catégorie ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((cat, ci) => {
            const accent = CAT_ACCENTS[ci % CAT_ACCENTS.length];

            return (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: ci * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-2xl overflow-hidden p-5 sm:p-6"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                }}
                whileHover={{
                  borderColor: `${accent.dot}30`,
                  boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 0 1px ${accent.dot}18`,
                }}
              >
                {/* Blob décoratif en arrière-plan */}
                <div
                  className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />

                {/* En-tête catégorie */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-1.5 h-5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: accent.dot }}
                  />
                  <span
                    className="text-[0.62rem] uppercase tracking-[0.3em] font-bold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {cat.category}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
                  <span
                    className="text-[0.62rem] font-mono font-bold tabular-nums rounded-full px-2 py-0.5"
                    style={{
                      color: accent.dot,
                      backgroundColor: `${accent.glow}`,
                      border: `1px solid ${accent.dot}25`,
                    }}
                  >
                    {cat.items.length}
                  </span>
                </div>

                {/* Grille de skill tiles */}
                <motion.div
                  className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.04, delayChildren: ci * 0.06 } },
                  }}
                >
                  {cat.items.map((skill) => {
                    const Icon = getIconByKey(skill.icon);
                    return (
                      <motion.div
                        key={skill.name}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8, y: 10 },
                          show: {
                            opacity: 1, scale: 1, y: 0,
                            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          },
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.94 }}
                        className="group/skill flex flex-col items-center gap-2 rounded-xl py-3 px-2 cursor-default relative overflow-hidden"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          transition: "border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = `${accent.dot}35`;
                          e.currentTarget.style.background = `${accent.glow}`;
                          e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.2)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        {/* Icône */}
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          {Icon ? (
                            <Icon
                              size={22}
                              className="transition-all duration-200"
                              style={{ color: "var(--text-secondary)" }}
                            />
                          ) : skill.imageUrl ? (
                            <img
                              src={skill.imageUrl}
                              alt={skill.name}
                              className="w-6 h-6 object-contain opacity-55 group-hover/skill:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-bold text-white"
                              style={{ backgroundColor: `${accent.dot}30`, border: `1px solid ${accent.dot}40` }}
                            >
                              {skill.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Nom */}
                        <span
                          className="text-[0.65rem] font-medium text-center leading-tight transition-colors duration-200 w-full truncate px-1"
                          style={{ color: "var(--text-secondary)" }}
                          title={skill.name}
                        >
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bande défilante de toutes les technos ────────────────────────── */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 marquee-wrapper py-3"
            style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="marquee-track-left">
              {[...sorted.flatMap(c => c.items), ...sorted.flatMap(c => c.items)].map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-4 text-[0.7rem] font-mono whitespace-nowrap select-none"
                  style={{ color: "var(--text-secondary)", opacity: 0.5 }}
                >
                  <span style={{ color: "var(--accent)", opacity: 0.6 }}>✦</span>
                  {skill.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-16 sm:mt-20" />
    </section>
  );
}
