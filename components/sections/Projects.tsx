"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiExternalLink, FiCode,
  FiChevronLeft, FiChevronRight, FiPlay, FiMaximize2, FiX,
} from "react-icons/fi";
import { useProjects } from "@/hooks/useFirestore";
import type { Project } from "@/lib/firestore";
import { getTechIcon } from "@/lib/iconMap";
import { trackEvent } from "@/lib/analytics";
import { personal } from "@/data/portfolio";

// ─── Lightbox plein écran (portal — échappe au transform 3D des cartes) ───────

function Lightbox({
  images, title, startIdx, onClose,
}: {
  images: string[];
  title: string;
  startIdx: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIdx);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
      style={{ background: "rgba(5,5,5,0.93)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — aperçu plein écran`}
    >
      {/* Fermer */}
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <FiX size={18} />
      </button>

      {/* Image */}
      <motion.img
        key={idx}
        src={images[idx]}
        alt={`${title} — capture ${idx + 1}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-full max-h-full object-contain rounded-xl select-none"
        style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {/* Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }}
            aria-label="Image précédente"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }}
            aria-label="Image suivante"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <FiChevronRight size={20} />
          </button>
        </>
      )}

      {/* Légende + compteur */}
      <div
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full px-4 py-2"
        style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs font-medium text-white/85">{title}</span>
        {images.length > 1 && (
          <>
            <span className="w-px h-3.5 bg-white/20" />
            <span className="text-[0.65rem] font-mono text-white/60 tabular-nums">
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
}

// ─── Mini carousel ────────────────────────────────────────────────────────────

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);

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
          alt={idx === 0 ? `${title} — aperçu de l'interface` : `${title} — capture d'écran ${idx + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          onClick={() => setZoom(idx)}
        />
      </AnimatePresence>

      {/* Hint agrandir */}
      <button
        onClick={() => setZoom(idx)}
        aria-label="Agrandir l'image"
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-150 z-10"
      >
        <FiMaximize2 size={12} />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            aria-label="Image précédente"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-150 z-10"
          >
            <FiChevronLeft size={13} />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            aria-label="Image suivante"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/65 hover:bg-black/90 flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity duration-150 z-10"
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

      <AnimatePresence>
        {zoom !== null && (
          <Lightbox images={images} title={title} startIdx={zoom} onClose={() => setZoom(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Projet en horizontal ─────────────────────────────────────────────────────

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageLeft = index % 2 === 0;

  const hasImages = project.images.length > 0;

  const imageBlock = hasImages && (
    <div
      className="relative w-full lg:w-[440px] xl:w-[480px] lg:flex-shrink-0 rounded-2xl overflow-hidden"
      style={{
        height: 280,
        background: "var(--tint-1)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <ImageCarousel images={project.images} title={project.title} />

      {project.video && (
        <span className="absolute top-3 left-3 z-20 pointer-events-none flex items-center gap-1 text-xs text-white/85 rounded-md px-2 py-0.5"
          style={{ background: "rgba(0,0,0,0.6)" }}>
          <FiPlay size={10} /> Vidéo
        </span>
      )}
    </div>
  );

  const infoBlock = (
    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
      {/* Header */}
      <div>
        {/* Numéro */}
        <span className="block font-mono-jb text-xs tabular-nums mb-3" style={{ color: "var(--text-secondary)" }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Titre */}
        <h3
          className="font-display font-medium text-2xl lg:text-3xl leading-tight mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {project.title}
        </h3>

        {/* Description courte */}
        {project.shortDesc && (
          <p className="text-[15px] mb-3" style={{ color: "var(--text-primary)" }}>
            {project.shortDesc}
          </p>
        )}

        {/* Description complète */}
        {project.description && (
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
            {project.description}
          </p>
        )}

        {/* Stack */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technologies.map((t) => {
            const Icon = getTechIcon(t);
            return (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs rounded-md px-2.5 py-1"
                style={{
                  color:   "var(--text-secondary)",
                  background: "var(--tint-2)",
                  border:  "1px solid var(--border-subtle)",
                }}
              >
                {Icon && <Icon size={12} />}
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
            className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-2.5 transition-colors duration-150 text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--tint-3)]"
          >
            <FiGithub size={14} /> Code source
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-2.5 transition-colors duration-150 text-[var(--text-primary)] border border-[var(--card-border)] hover:bg-[var(--tint-3)]"
          >
            <FiExternalLink size={14} /> Voir le site
          </a>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-6 sm:gap-8 lg:gap-12 items-start flex-col ${imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
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
    <section id="projects" className="pt-20 sm:pt-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <h2 className="font-display font-medium text-xl sm:text-2xl" style={{ color: "var(--text-primary)" }}>
            Projets
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-xs" style={{ color: "var(--text-secondary)" }}>
            {sorted.length} projets
          </span>
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>03</span>
        </motion.div>

        {/* Liste horizontale */}
        {sorted.length > 0 ? (
          <div className="space-y-14 sm:space-y-20">
            {sorted.map((p, i) => (
              <div key={p.id ?? p.title}>
                <ProjectRow project={p} index={i} />
                {i < sorted.length - 1 && (
                  <div className="mt-14 sm:mt-20 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <FiCode size={32} className="mx-auto mb-3" style={{ color: "var(--card-border)", opacity: 0.5 }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Aucun projet pour le moment</p>
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
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("github_click")}
            className="inline-flex items-center gap-2 text-sm rounded-xl px-5 py-2.5 transition-colors duration-150 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]"
          >
            <FiGithub size={14} />
            Voir tous mes projets sur GitHub
          </a>
        </motion.div>
      </div>

      <hr className="section-divider max-w-6xl mx-auto mt-20 sm:mt-24" />
    </section>
  );
}
