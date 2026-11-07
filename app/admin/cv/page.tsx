"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiFileText, FiZap, FiExternalLink, FiRotateCcw, FiCheck } from "react-icons/fi";
import { uploadFile, deleteFile } from "@/lib/storage";
import {
  subscribeCvSettings, saveCvFile, resetCvFile,
  type CvKind, type CvSettings,
} from "@/lib/firestore";
import { personal } from "@/data/portfolio";

const KINDS: { key: CvKind; label: string; desc: string; fallback: string; icon: typeof FiFileText }[] = [
  { key: "classic", label: "CV Classique", desc: "Version design, envoyée directement aux recruteurs", fallback: personal.cv,    icon: FiFileText },
  { key: "ats",     label: "CV ATS",       desc: "Version optimisée pour les logiciels de tri (ATS)",  fallback: personal.cvAts, icon: FiZap },
];

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

function CvCard({ kind, settings }: { kind: (typeof KINDS)[number]; settings: CvSettings }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = settings[kind.key];
  const url = current?.url ?? kind.fallback;
  const Icon = kind.icon;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setDone(false);
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Fichier trop volumineux (10 Mo max).");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const newUrl = await uploadFile(file, `cv/${kind.key}`, setProgress);
      const previous = current?.url;
      await saveCvFile(kind.key, { url: newUrl, name: file.name, updatedAt: new Date().toISOString() });
      if (previous) await deleteFile(previous);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleReset = async () => {
    if (!current) return;
    if (!confirm(`Revenir au ${kind.label} par défaut du site ?`)) return;
    await resetCvFile(kind.key);
    await deleteFile(current.url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 flex flex-col gap-5"
    >
      <div className="flex items-start gap-3">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "rgba(var(--accent-rgb),0.12)", color: "var(--accent)" }}
        >
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="text-white font-semibold">{kind.label}</h2>
          <p className="text-slate-500 text-xs mt-0.5">{kind.desc}</p>
        </div>
      </div>

      {/* Fichier actuel */}
      <div className="bg-[#161616] border border-[#252525] rounded-xl px-4 py-3 flex items-center gap-3">
        <FiFileText size={16} className="text-red-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 truncate">{current?.name ?? kind.fallback.replace(/^\//, "")}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {current
              ? `Mis à jour le ${new Date(current.updatedAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}`
              : "Fichier par défaut (dossier public)"}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1f1f1f] transition-colors"
          title="Ouvrir"
        >
          <FiExternalLink size={14} />
        </a>
      </div>

      {/* Zone d'upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? "bg-white/[0.03]" : "border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#161616]"
        }`}
        style={dragOver ? { borderColor: "var(--accent)" } : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Upload… {progress}%</p>
          </div>
        ) : done ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <FiCheck size={16} />
            <p className="text-sm font-medium">CV mis à jour</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-400">
            <FiUpload size={18} />
            <p className="text-sm">Remplacer le PDF</p>
            <p className="text-xs text-slate-600">Glisse un fichier ou clique · PDF, 10 Mo max</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {current && (
        <button
          onClick={handleReset}
          className="self-start flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          <FiRotateCcw size={12} />
          Revenir au fichier par défaut
        </button>
      )}
    </motion.div>
  );
}

export default function AdminCv() {
  const [settings, setSettings] = useState<CvSettings>({});

  useEffect(() => subscribeCvSettings(setSettings), []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-1">CV</h1>
        <p className="text-slate-400 text-sm">
          Remplace les CV téléchargeables sur le portfolio. La mise à jour est immédiate pour tous les visiteurs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {KINDS.map((k) => (
          <CvCard key={k.key} kind={k} settings={settings} />
        ))}
      </div>
    </div>
  );
}
