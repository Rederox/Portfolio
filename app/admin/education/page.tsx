"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen, FiArrowUp, FiArrowDown } from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import {
  subscribeEducation, addEducation, updateEducation, deleteEducation,
  type Education,
} from "@/lib/firestore";

const EMPTY: Omit<Education, "id"> = {
  degree: "", school: "", location: "", period: "",
  description: "", current: false, order: 0,
};

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<Omit<Education, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => subscribeEducation(setItems), []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: items.length });
    setModalOpen(true);
  };

  const openEdit = (e: Education) => {
    setEditing(e);
    setForm({ degree: e.degree, school: e.school, location: e.location ?? "",
      period: e.period, description: e.description, current: e.current, order: e.order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.degree || !form.school) return;
    setSaving(true);
    try {
      if (editing?.id) await updateEducation(editing.id, form);
      else await addEducation(form);
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Formation</h1>
          <p className="text-slate-400 text-sm">{items.length} entrée{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--accent)" }}>
          <FiPlus size={15} /> Nouvelle formation
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiBookOpen size={36} className="mx-auto mb-3 opacity-30" />
          <p>Aucune formation. Commence par en ajouter une !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((edu, i) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)" }}>
                <FiBookOpen size={15} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold">{edu.degree}</p>
                  {edu.current && (
                    <span className="text-xs rounded-full px-2 py-0.5"
                      style={{ color: "var(--accent)", backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)" }}>
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{edu.school}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-500 text-xs">{edu.period}</span>
                  {edu.location && <><span className="text-slate-600">·</span><span className="text-slate-500 text-xs">{edu.location}</span></>}
                </div>
                <p className="text-slate-500 text-sm mt-1.5 line-clamp-2">{edu.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { const swap = sorted[i - 1]; if (swap?.id) { updateEducation(edu.id!, { order: edu.order - 1 }); updateEducation(swap.id, { order: swap.order + 1 }); } }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiArrowUp size={14} /></button>
                <button onClick={() => { const swap = sorted[i + 1]; if (swap?.id) { updateEducation(edu.id!, { order: edu.order + 1 }); updateEducation(swap.id, { order: swap.order - 1 }); } }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiArrowDown size={14} /></button>
                <button onClick={() => openEdit(edu)} className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(edu.id!)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Modifier la formation" : "Nouvelle formation"} size="lg">
        <div className="space-y-4">
          <Field label="Diplôme / Titre *" value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} placeholder="Master 1 — Développement Web" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="École / Établissement *" value={form.school} onChange={(v) => setForm({ ...form, school: v })} placeholder="Nom de l'établissement" />
            <Field label="Ville" value={form.location ?? ""} onChange={(v) => setForm({ ...form, location: v })} placeholder="Paris" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Période" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="2023 – 2024" />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, current: !form.current })}
                  className="relative w-10 h-5 rounded-full transition-colors"
                  style={{ backgroundColor: form.current ? "var(--accent)" : "#2a2a2a" }}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.current ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm text-slate-300">En cours</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Formation avancée en développement web full stack..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-colors" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl hover:border-[#333]">Annuler</button>
            <button onClick={handleSave} disabled={!form.degree || !form.school || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}>
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer ?" size="md">
        <p className="text-slate-400 text-sm mb-6">Cette formation sera supprimée définitivement.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl">Annuler</button>
          <button onClick={() => { deleteEducation(deleteConfirm!); setDeleteConfirm(null); }}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-400 rounded-xl">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 font-medium mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors" />
    </div>
  );
}
