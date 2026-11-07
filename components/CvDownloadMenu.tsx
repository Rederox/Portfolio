"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFileText, FiZap } from "react-icons/fi";
import { useCv, formatCvDate } from "@/hooks/useFirestore";
import { trackEvent } from "@/lib/analytics";
import { useMode } from "@/lib/mode-context";

const CV_OPTIONS = [
  {
    key: "classic",
    label: "CV Classique",
    desc: "Version design, à envoyer directement",
    icon: FiFileText,
  },
  {
    key: "ats",
    label: "CV ATS",
    desc: "Optimisé pour les logiciels de tri (ATS)",
    icon: FiZap,
  },
] as const;

export default function CvDownloadMenu({
  trigger,
  align = "right",
}: {
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const { mode } = useMode();
  const rootRef = useRef<HTMLDivElement>(null);
  const cv = useCv();

  useEffect(() => {
    if (!open) return;
    const closeIfOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeIfOutside);
    return () => document.removeEventListener("mousedown", closeIfOutside);
  }, [open]);

  const isLight = mode === "light";

  return (
    <div ref={rootRef} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-50 top-full mt-2 w-64 rounded-2xl p-1.5 shadow-2xl border ${
              align === "right" ? "right-0" : "left-0"
            } ${
              isLight
                ? "bg-white/98 backdrop-blur-2xl border-black/8"
                : "bg-[#0d0d0d]/98 backdrop-blur-2xl border-[#1e1e1e]"
            }`}
          >
            {CV_OPTIONS.map(({ key, label, desc, icon: Icon }) => {
              const updated = formatCvDate(cv.settings[key]?.updatedAt);
              return (
                <a
                  key={key}
                  href={cv[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackEvent("cv_download");
                    setOpen(false);
                  }}
                  className={`flex items-start gap-3 px-3 py-3 rounded-xl transition-colors duration-150 ${
                    isLight ? "hover:bg-black/5" : "hover:bg-white/5"
                  }`}
                >
                  <Icon
                    size={16}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: isLight ? "#7a7570" : "#8a847a" }}
                  />
                  <span className="min-w-0">
                    <span
                      className="block text-sm font-medium"
                      style={{ color: isLight ? "#171310" : "#F2EDE4" }}
                    >
                      {label}
                    </span>
                    <span
                      className="block text-xs mt-0.5 leading-snug"
                      style={{ color: isLight ? "#7a7570" : "#8a847a" }}
                    >
                      {desc}
                    </span>
                    {updated && (
                      <span
                        className="block text-xs mt-1 font-mono tabular-nums"
                        style={{ color: isLight ? "#7a7570" : "#8a847a" }}
                      >
                        Mis à jour en {updated}
                      </span>
                    )}
                  </span>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
