"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiExternalLink, FiCode,
  FiChevronLeft, FiChevronRight, FiStar, FiPlay,
} from "react-icons/fi";
import { useProjects } from "@/hooks/useFirestore";
import type { Project } from "@/lib/firestore";
import { getTechIcon } from "@/lib/iconMap";
import { trackEvent } from "@/lib/analytics";

// ─── Mini carousel ────────────────────────────────────────────────────────────

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "var(--card)" }}>
        <FiCode size={28} style={{ color: "var(--card-border)" }} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/img overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          src={images[idx]}
          alt={`${title} ${idx + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all"
          >
            <FiChevronLeft size={13} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all"
          >
            <FiChevronRight size={13} />
          </button>

          {/* Compteur */}
          <div
            className="absolute bottom-2 right-2 text-[0.58rem] font-mono text-white/70 rounded-full px-2 py-0.5"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {idx + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Projet en horizontal ─────────────────────────────────────────────────────

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageLeft = index % 2 === 0;

  const imageBlock = (
    <div
      className="relative w-full lg:w-[380px] lg:flex-shrink-0 rounded-xl overflow-hidden"
      style={{
        minHeight: "220px",
        height: "260px",
        border: "1px solid var(--card-border)",
      }}
    >
      <ImageCarousel images={project.images} title={project.title} />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-10 pointer-events-none">
        {project.featured && (
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-amber-400 bg-black/80 border border-amber-400/25 rounded-full px-2 py-0.5 backdrop-blur-sm">
            <FiStar size={8} /> Featured
          </span>
        )}
        {project.video && (
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-blue-400 bg-black/80 border border-blue-400/25 rounded-full px-2 py-0.5 backdrop-blur-sm">
            <FiPlay size={8} /> Vidéo
          </span>
        )}
      </div>
    </div>
  );

  const infoBlock = (
    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
      {/* Header */}
      <div>
        {/* Numéro + Featured */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[0.6rem] font-bold" style={{ color: "var(--accent)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.featured && (
            <span
              className="text-[0.58rem] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ color: "var(--accent)", backgroundColor: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.2)" }}
            >
              Featured
            </span>
          )}
        </div>

        {/* Titre */}
        <h3
          className="font-display font-extrabold text-2xl lg:text-3xl leading-tight mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        {/* Description courte */}
        {project.shortDesc && (
          <p className="text-sm font-medium mb-3" style={{ color: "var(--accent)" }}>
            {project.shortDesc}
          </p>
        )}

        {/* Description complète */}
        {project.description && (
          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "var(--text-secondary)" }}
          >
            {project.description}
          </p>
        )}

        {/* Stack complète */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((t) => {
            const Icon = getTechIcon(t);
            return (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5"
                style={{
                  color:           "var(--text-primary)",
                  backgroundColor: "var(--card)",
                  border:          "1px solid var(--card-border)",
                }}
              >
                {Icon && <Icon size={11} style={{ color: "var(--accent)" }} />}
                {t}
              </span>
            );
          })}
        </div>
      </div>

      {/* Liens */}
      <div className="flex items-center gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("github_click")}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5 transition-all"
            style={{
              color:           "var(--text-primary)",
              border:          "1px solid var(--card-border)",
              backgroundColor: "var(--card)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            <FiGithub size={14} /> Code source
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold rounded-xl px-4 py-2.5 transition-all text-white accent-glow"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <FiExternalLink size={14} /> Voir en live
          </a>
        )}
        {!project.github && !project.live && (
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Aucun lien disponible
          </span>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className={`flex gap-8 lg:gap-12 items-start flex-col ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
    >
      {imageBlock}
      {infoBlock}
    </motion.article>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────

export default function Projects() {
  const { data: projects } = useProjects();
  const sorted = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.order - b.order;
  });

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10 sm:mb-16"
        >
          <span className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase" style={{ color: "var(--text-primary)" }}>
            Projets
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.65rem]" style={{ color: "var(--text-secondary)" }}>
            {sorted.length} projets
          </span>
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>04</span>
        </motion.div>

        {/* Liste horizontale */}
        {sorted.length > 0 ? (
          <div className="space-y-14 sm:space-y-20">
            {sorted.map((p, i) => (
              <div key={p.id ?? p.title}>
                <ProjectRow project={p} index={i} />
                {i < sorted.length - 1 && (
                  <div className="mt-14 sm:mt-20 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--card-border), transparent)" }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiCode size={32} className="mx-auto mb-3" style={{ color: "var(--card-border)", opacity: 0.5 }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Aucun projet pour le moment.</p>
          </div>
        )}

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <a
            href="https://github.com/Rederox"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("github_click")}
            className="inline-flex items-center gap-2 text-sm rounded-full px-6 py-3 transition-all"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--card-border)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
          >
            <FiGithub size={14} />
            Voir tous mes projets sur GitHub
          </a>
        </motion.div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-24" />
    </section>
  );
}
