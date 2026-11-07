"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getIconByKey } from "@/lib/iconMap";
import { useSkills } from "@/hooks/useFirestore";

export default function Skills() {
  const { data: skillCategories } = useSkills();
  const sorted = [...skillCategories].sort((a, b) => a.order - b.order);
  const total  = sorted.reduce((acc, c) => acc + c.items.length, 0);

  return (
    <section id="skills" className="pt-20 sm:pt-24 px-4 sm:px-6">
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
            Stack technique
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-xs" style={{ color: "var(--text-secondary)" }}>
            {total} technos
          </span>
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>04</span>
        </motion.div>

        {/* ── Une carte par catégorie ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(ci, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-5 sm:p-6"
              style={{
                background: "var(--tint-1)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              {/* En-tête catégorie */}
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <h3 className="text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {cat.category}
                </h3>
                <span className="text-xs font-mono-jb tabular-nums" style={{ color: "var(--text-secondary)" }}>
                  {cat.items.length}
                </span>
              </div>

              {/* Grille de compétences */}
              <ul className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                {cat.items.map((skill) => {
                  const Icon = getIconByKey(skill.icon);
                  return (
                    <li
                      key={skill.name}
                      className="group/skill flex flex-col items-center gap-2 rounded-xl py-3 px-2 transition-colors duration-150 hover:bg-[var(--tint-3)]"
                      style={{
                        background: "var(--tint-1)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {Icon ? (
                          <Icon
                            size={22}
                            className="transition-colors duration-150 group-hover/skill:text-[var(--text-primary)]"
                            style={{ color: "var(--text-secondary)" }}
                          />
                        ) : skill.imageUrl ? (
                          <Image
                            src={skill.imageUrl}
                            alt=""
                            width={24}
                            height={24}
                            unoptimized
                            className="w-6 h-6 object-contain opacity-60 group-hover/skill:opacity-100 transition-opacity duration-150"
                          />
                        ) : (
                          <span
                            className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-mono-jb"
                            style={{ color: "var(--text-secondary)", border: "1px solid var(--card-border)" }}
                          >
                            {skill.name.slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <span
                        className="text-xs text-center leading-tight w-full truncate px-1"
                        style={{ color: "var(--text-secondary)" }}
                        title={skill.name}
                      >
                        {skill.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
