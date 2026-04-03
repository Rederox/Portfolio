"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiStar, FiCode, FiImage, FiVideo,
  FiGithub, FiExternalLink, FiArrowUp, FiArrowDown,
} from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  subscribeProjects, addProject, updateProject, deleteProject,
  type Project,
} from "@/lib/firestore";

const EMPTY: Omit<Project, "id"> = {
  title: "", shortDesc: "", description: "", images: [], video: "",
  technologies: [], github: "", live: "", featured: false, order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => subscribeProjects(setProjects), []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: projects.length });
    setTechInput("");
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, shortDesc: p.shortDesc, description: p.description,
      images: p.images, video: p.video ?? "", technologies: p.technologies,
      github: p.github ?? "", live: p.live ?? "", featured: p.featured, order: p.order });
    setTechInput("");
    setModalOpen(true);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm((f) => ({ ...f, technologies: [...f.technologies, t] }));
    }
    setTechInput("");
  };

  const removeTech = (t: string) =>
    setForm((f) => ({ ...f, technologies: f.technologies.filter((x) => x !== t) }));

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      if (editing?.id) await updateProject(editing.id, form);
      else await addProject(form);
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setDeleteConfirm(null);
  };

  const moveOrder = async (p: Project, dir: 1 | -1) => {
    const newOrder = p.order + dir;
    if (newOrder < 0) return;
    await updateProject(p.id!, { order: newOrder });
    const swap = projects.find((x) => x.id !== p.id && x.order === newOrder);
    if (swap?.id) await updateProject(swap.id, { order: p.order });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Projets</h1>
          <p className="text-slate-400 text-sm">{projects.length} projet{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <FiPlus size={15} /> Nouveau projet
        </button>
      </div>

      {/* List */}
      {projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiImage size={36} className="mx-auto mb-3 opacity-30" />
          <p>Aucun projet. Commence par en créer un !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...projects].sort((a, b) => a.order - b.order).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#1a1a1a] flex-shrink-0 border border-[#252525]">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiCode size={20} className="text-[#333]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold truncate">{p.title}</p>
                  {p.featured && (
                    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
                      <FiStar size={10} /> Featured
                    </span>
                  )}
                  {p.video && (
                    <span className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 border border-blue-400/20 rounded-full px-2 py-0.5 flex-shrink-0">
                      <FiVideo size={10} /> Vidéo
                    </span>
                  )}
                  {p.images.length > 0 && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                      <FiImage size={10} /> {p.images.length}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm truncate">{p.shortDesc}</p>
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs text-slate-400 bg-[#1a1a1a] border border-[#252525] rounded px-1.5 py-0.5">{t}</span>
                  ))}
                  {p.technologies.length > 4 && (
                    <span className="text-xs text-slate-600">+{p.technologies.length - 4}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => moveOrder(p, -1)} className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all" title="Monter"><FiArrowUp size={14} /></button>
                <button onClick={() => moveOrder(p, 1)} className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all" title="Descendre"><FiArrowDown size={14} /></button>
                <button onClick={() => updateProject(p.id!, { featured: !p.featured })}
                  className={`p-2 rounded-lg transition-all ${p.featured ? "text-amber-400 hover:bg-amber-400/10" : "text-slate-500 hover:text-amber-400 hover:bg-[#1a1a1a]"}`}
                  title="Toggle featured">
                  <FiStar size={14} />
                </button>
                <button onClick={() => openEdit(p)} className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(p.id!)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Modifier le projet" : "Nouveau projet"}
        size="xl"
      >
        <div className="space-y-5">
          {/* Title + Short desc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Titre *</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Mon super projet"
                className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Ordre</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })}
                className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Description courte (carte)</label>
            <input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
              placeholder="1-2 phrases résumant le projet..."
              className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Description complète (modal)</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} placeholder="Description détaillée, défis techniques, résultats..."
              className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none" />
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">
              Images <span className="text-slate-600">(la 1ère = cover)</span>
            </label>
            <ImageUpload
              images={form.images}
              onChange={(urls) => setForm({ ...form, images: urls })}
              folder="projects"
            />
          </div>

          {/* Video */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">
              Vidéo <span className="text-slate-600">(URL YouTube, Vimeo ou .mp4)</span>
            </label>
            <div className="relative">
              <FiVideo size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.video} onChange={(e) => setForm({ ...form, video: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-colors" />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="React, Node.js..."
                className="flex-1 bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
              <button type="button" onClick={addTech}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 rounded-xl text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                + Ajouter
              </button>
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.technologies.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2.5 py-1.5">
                    {t}
                    <button onClick={() => removeTech(t)} className="text-slate-500 hover:text-red-400">
                      <FiX size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">GitHub URL</label>
              <div className="relative">
                <FiGithub size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">URL Live</label>
              <div className="relative">
                <FiExternalLink size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.live} onChange={(e) => setForm({ ...form, live: e.target.value })}
                  placeholder="https://monprojet.fr"
                  className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-emerald-500" : "bg-[#2a2a2a]"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-slate-300 font-medium">Projet mis en avant</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-[#252525] hover:border-[#333] rounded-xl transition-colors">
              Annuler
            </button>
            <button onClick={handleSave} disabled={!form.title || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl transition-colors">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editing ? "Enregistrer" : "Créer le projet"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer le projet ?" size="md">
        <p className="text-slate-400 text-sm mb-6">Cette action est irréversible. Les images ne seront pas supprimées du stockage.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl hover:border-[#333] transition-colors">Annuler</button>
          <button onClick={() => handleDelete(deleteConfirm!)} className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-400 rounded-xl transition-colors">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}

function FiX({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
