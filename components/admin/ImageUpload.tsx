"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiX, FiImage, FiLoader } from "react-icons/fi";
import { uploadFile } from "@/lib/storage";

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxFiles?: number;
}

export default function ImageUpload({
  images,
  onChange,
  folder = "uploads",
  maxFiles = 8,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const allowed = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (allowed.length === 0) return;

    setUploading(true);
    setProgress(0);

    const urls: string[] = [];
    for (let i = 0; i < allowed.length; i++) {
      const url = await uploadFile(allowed[i], folder, (p) =>
        setProgress(Math.round(((i + p / 100) / allowed.length) * 100))
      );
      urls.push(url);
    }

    onChange([...images, ...urls]);
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {images.length < maxFiles && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/5"
              : "border-[#2a2a2a] hover:border-[#3a3a3a] hover:bg-[#161616]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <FiLoader size={22} className="text-emerald-400 animate-spin" />
              <p className="text-sm text-slate-400">Upload en cours... {progress}%</p>
              <div className="w-full bg-[#222] rounded-full h-1.5 mt-1">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center">
                <FiUpload size={18} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-400">
                Glisse tes images ici ou <span className="text-emerald-400">clique pour choisir</span>
              </p>
              <p className="text-xs text-slate-600">
                PNG, JPG, WebP — max {maxFiles} images
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <AnimatePresence>
            {images.map((url, idx) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square rounded-lg overflow-hidden border border-[#2a2a2a]"
              >
                <img
                  src={url}
                  alt={`image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <span className="absolute top-1 left-1 bg-emerald-500/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <FiX size={11} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
