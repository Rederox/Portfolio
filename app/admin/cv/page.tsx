"use client";

import { useEffect, useRef, useState } from "react";
import { FiUpload, FiFileText, FiZap, FiExternalLink, FiRotateCcw, FiCheck } from "react-icons/fi";
import { uploadFile, deleteFile } from "@/lib/storage";
import {
  subscribeCvSettings, saveCvFile, resetCvFile,
  type CvKind, type CvSettings,
} from "@/lib/firestore";
import { formatCvDate } from "@/hooks/useFirestore";
import { personal } from "@/data/portfolio";

const KINDS: {
  key: CvKind;
  label: string;
  desc: string;
  fallback: string;
  filename: string;
  icon: typeof FiFileText;
}[] = [
  {
    key: "classic",
    label: "CV Classique",
    desc: "Version design, envoyée directement aux recruteurs",
    fallback: personal.cv,
    filename: `CV_${personal.firstName}_${personal.lastName}.pdf`,
    icon: FiFileText,
  },
  {
    key: "ats",
    label: "CV ATS",
    desc: "Version lisible par les logiciels de tri",
    fallback: personal.cvAts,
    filename: `CV_${personal.firstName}_${personal.lastName}_ATS.pdf`,
    icon: FiZap,
  },
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
  const updated = formatCvDate(current?.updatedAt);
  const Icon = kind.icon;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setDone(false);
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError("Seuls les fichiers PDF sont acceptés");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Fichier trop volumineux, 10 Mo maximum");
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      // « inline » : s'ouvre dans le lecteur PDF, et s'enregistre sous un nom propre
      const newUrl = await uploadFile(file, `cv/${kind.key}`, setProgress, {
        contentType: "application/pdf",
        contentDisposition: `inline; filename="${kind.filename}"`,
      });
      const previous = current?.url;
      await saveCvFile(kind.key, { url: newUrl, name: file.name, updatedAt: new Date().toISOString() });
      if (previous) await deleteFile(previous);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'upload");
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
    <section className="bg-[#171310] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5 min-w-0">
          <Icon size={16} className="mt-0.5 flex-shrink-0 text-[#8a847a]" />
          <div className="min-w-0">
            <h2 className="text-[15px] font-medium text-[#efe9de]">{kind.label}</h2>
            <p className="text-[13px] text-[#aaa398] mt-0.5">{kind.desc}</p>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[13px] text-[#aaa398] hover:text-[#efe9de] transition-colors duration-150 flex-shrink-0"
        >
          Ouvrir
          <FiExternalLink size={14} />
        </a>
      </div>

      {/* Aperçu : le CV comme une feuille posée */}
      <div className="rounded-xl bg-[#100D0A] border border-white/[0.06] p-4">
        <div className="mx-auto max-w-[360px] aspect-[1/1.414] rounded bg-white overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          <iframe
            key={url}
            src={`${url}#toolbar=0&navpanes=0&view=FitH`}
            title={`Aperçu ${kind.label}`}
            className="w-full h-full border-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Fichier actuel */}
      <div className="flex items-baseline justify-between gap-4 text-[13px]">
        <span className="text-[#efe9de] truncate">{current?.name ?? kind.fallback.replace(/^\//, "")}</span>
        <span className="font-mono text-xs tabular-nums text-[#8a847a] flex-shrink-0">
          {updated ? `Mis à jour en ${updated}` : "Fichier par défaut"}
        </span>
      </div>

      {/* Remplacement */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`flex items-center justify-center gap-2 h-12 rounded-xl border border-dashed text-[13px] cursor-pointer transition-colors duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--accent)] ${
          dragOver
            ? "border-[var(--accent)] bg-white/[0.03] text-[#efe9de]"
            : "border-white/[0.12] text-[#aaa398] hover:border-white/[0.2] hover:bg-white/[0.02] hover:text-[#efe9de]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {uploading ? (
          <span className="font-mono tabular-nums">Envoi… {progress} %</span>
        ) : done ? (
          <>
            <FiCheck size={16} className="text-[#4cc38a]" />
            <span className="text-[#efe9de]">CV remplacé</span>
          </>
        ) : (
          <>
            <FiUpload size={16} />
            <span>Remplacer le PDF</span>
            <span className="text-[#8a847a]">· glisser ou cliquer, 10 Mo max</span>
          </>
        )}
      </div>

      {error && <p className="text-[13px] text-[#e5484d] -mt-2">{error}</p>}

      {current && (
        <button
          onClick={handleReset}
          className="self-start flex items-center gap-1.5 text-xs text-[#8a847a] hover:text-[#efe9de] transition-colors duration-150"
        >
          <FiRotateCcw size={12} />
          Revenir au fichier par défaut
        </button>
      )}
    </section>
  );
}

export default function AdminCv() {
  const [settings, setSettings] = useState<CvSettings>({});

  useEffect(() => subscribeCvSettings(setSettings), []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-medium text-3xl text-[#efe9de] mb-1">CV</h1>
        <p className="text-[#aaa398] text-sm">
          Les PDF proposés au téléchargement sur le portfolio. Un remplacement est visible tout de suite
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
