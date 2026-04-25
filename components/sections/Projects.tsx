"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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
          alt={idx === 0 ? `${title} — aperçu de l'interface` : `${title} — capture d'écran ${idx + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0 w-full h-full object-contain"
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

// ─── Spotlight + 3D Tilt card ─────────────────────────────────────────────────

function TiltCard({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const spotX   = useMotionValue(50);
  const spotY   = useMotionValue(50);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 });

  // Computed outside JSX — hook rule compliant
  const spotBg = useTransform(
    [spotX, spotY] as const,
    ([x, y]: number[]) =>
      `radial-gradient(400px circle at ${x}% ${y}%, rgba(var(--accent-rgb), 0.08), transparent 60%)`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top)  / rect.height - 0.5);
    spotX.set(((e.clientX - rect.left) / rect.width)  * 100);
    spotY.set(((e.clientY - rect.top)  / rect.height) * 100);
  }, [mouseX, mouseY, spotX, spotY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{ background: spotBg }}
      />
      {children}
    </motion.div>
  );
}

// ─── Projet en horizontal ─────────────────────────────────────────────────────

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const imageLeft = index % 2 === 0;

  const imageBlock = (
    <TiltCard
      className="relative w-full lg:w-[440px] xl:w-[480px] lg:flex-shrink-0 rounded-2xl overflow-hidden spotlight-card"
      style={{
        minHeight: 240,
        height: 280,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      } as React.CSSProperties}
    >
      <ImageCarousel images={project.images} title={project.title} />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex gap-1.5 z-20 pointer-events-none">
        {project.featured && (
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-amber-400 rounded-full px-2.5 py-0.5"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(251,191,36,0.25)" }}>
            <FiStar size={8} /> Featured
          </span>
        )}
        {project.video && (
          <span className="flex items-center gap-1 text-[0.6rem] font-medium text-blue-400 rounded-full px-2.5 py-0.5"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(96,165,250,0.25)" }}>
            <FiPlay size={8} /> Vidéo
          </span>
        )}
      </div>
    </TiltCard>
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
          <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
            {project.description}
          </p>
        )}

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.map((t) => {
            const Icon = getTechIcon(t);
            return (
              <motion.span
                key={t}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5"
                style={{
                  color:   "var(--text-primary)",
                  background: "rgba(255,255,255,0.04)",
                  border:  "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {Icon && <Icon size={11} style={{ color: "var(--accent)" }} />}
                {t}
              </motion.span>
            );
          })}
        </div>
      </div>

      {/* Liens */}
      <div className="flex items-center gap-3">
        {project.github && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("github_click")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-4 py-2.5"
            style={{
              color:   "var(--text-primary)",
              background: "rgba(255,255,255,0.04)",
              border:  "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            <FiGithub size={14} /> Code source
          </motion.a>
        )}
        {project.live && (
          <motion.a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 text-sm font-bold rounded-xl px-4 py-2.5 text-white accent-glow"
            style={{ backgroundColor: "var(--accent)" }}
          >
            <FiExternalLink size={14} /> Voir en live
          </motion.a>
        )}
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
          <h2 className="font-display font-bold text-xs tracking-[0.3em] uppercase" style={{ color: "var(--text-primary)" }}>
            Projets
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono-jb text-[0.65rem]" style={{ color: "var(--text-secondary)" }}>
            {sorted.length} projets
          </span>
          <span className="font-mono-jb text-[0.7rem]" style={{ color: "var(--accent)" }}>04</span>
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
