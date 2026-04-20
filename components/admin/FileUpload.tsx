"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiFile, FiDownload, FiFileText } from "react-icons/fi";
import { uploadFile } from "@/lib/storage";

interface Doc {
  url: string;
  name: string;
}

interface FileUploadProps {
  docs: Doc[];
  onChange: (docs: Doc[]) => void;
  folder?: string;
}

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FiFileText size={14} className="text-red-400 flex-shrink-0" />;
  if (["doc", "docx"].includes(ext ?? "")) return <FiFileText size={14} className="text-blue-400 flex-shrink-0" />;
  return <FiFile size={14} className="text-slate-400 flex-shrink-0" />;
}

export default function FileUpload({ docs, onChange, folder = "uploads" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = Array.from(files).filter((f) =>
      ["application/pdf", "application/msword",
       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
       "text/plain"].includes(f.type) || f.name.match(/\.(pdf|doc|docx|txt)$/i)
    );
    if (allowed.length === 0) return;

    setUploading(true);
    setProgress(0);
    const uploaded: Doc[] = [];

    for (let i = 0; i < allowed.length; i++) {
      const url = await uploadFile(allowed[i], folder, (p) =>
        setProgress(Math.round(((i + p / 100) / allowed.length) * 100))
      );
      uploaded.push({ url, name: allowed[i].name });
    }

    onChange([...docs, ...uploaded]);
    setUploading(false);
  };

  const removeDoc = (idx: number) => onChange(docs.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
          dragOver ? "border-blue-500 bg-blue-500/5" : "border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#161616]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Upload... {progress}%</p>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <FiUpload size={14} />
            <p className="text-xs">Glisse ou clique · PDF, DOCX, TXT</p>
          </div>
        )}
      </div>

      {/* List */}
      <AnimatePresence>
        {docs.map((doc, idx) => (
          <motion.div
            key={doc.url}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2.5 bg-[#161616] border border-[#252525] rounded-xl px-3 py-2 group"
          >
            {fileIcon(doc.name)}
            <span className="flex-1 text-xs text-slate-300 truncate">{doc.name}</span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-slate-500 hover:text-blue-400 transition-colors rounded"
                title="Télécharger"
              >
                <FiDownload size={12} />
              </a>
              <button
                type="button"
                onClick={() => removeDoc(idx)}
                className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded"
                title="Supprimer"
              >
                <FiX size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
