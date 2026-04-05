"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiArrowUp, FiArrowDown } from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import {
  subscribeExperience, addExperience, updateExperience, deleteExperience,
  type Experience,
} from "@/lib/firestore";

const EMPTY: Omit<Experience, "id"> = {
  company: "", role: "", type: "CDI", period: "",
  description: [], technologies: [], current: false, order: 0,
};

const JOB_TYPES = ["CDI", "CDD", "Stage", "Alternance", "Freelance", "Intérim"];

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => subscribeExperience(setItems), []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: items.length });
    setTechInput(""); setDescInput("");
    setModalOpen(true);
  };

  const openEdit = (e: Experience) => {
    setEditing(e);
    setForm({ company: e.company, role: e.role, type: e.type, period: e.period,
      description: e.description, technologies: e.technologies, current: e.current, order: e.order });
    setTechInput(""); setDescInput("");
    setModalOpen(true);
  };

  const addDesc = () => {
    const d = descInput.trim();
    if (d) setForm((f) => ({ ...f, description: [...f.description, d] }));
    setDescInput("");
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) setForm((f) => ({ ...f, technologies: [...f.technologies, t] }));
    setTechInput("");
  };

  const handleSave = async () => {
    if (!form.company || !form.role) return;
    setSaving(true);
    try {
      if (editing?.id) await updateExperience(editing.id, form);
      else await addExperience(form);
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Expérience</h1>
          <p className="text-slate-400 text-sm">{items.length} entrée{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--accent)" }}>
          <FiPlus size={15} /> Nouvelle expérience
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <FiBriefcase size={36} className="mx-auto mb-3 opacity-30" />
          <p>Aucune expérience. Commence par en ajouter une !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)" }}>
                <FiBriefcase size={15} style={{ color: "var(--accent)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold">{exp.role}</p>
                  {exp.current && (
                    <span className="text-xs rounded-full px-2 py-0.5"
                      style={{ color: "var(--accent)", backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)" }}>
                      En cours
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--accent)" }}>{exp.company}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-500 text-xs">{exp.period}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500 text-xs">{exp.type}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exp.technologies.map((t) => (
                    <span key={t} className="text-xs text-slate-400 bg-[#1a1a1a] border border-[#252525] rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { const swap = sorted[i - 1]; if (swap?.id) { updateExperience(exp.id!, { order: exp.order - 1 }); updateExperience(swap.id, { order: swap.order + 1 }); } }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiArrowUp size={14} /></button>
                <button onClick={() => { const swap = sorted[i + 1]; if (swap?.id) { updateExperience(exp.id!, { order: exp.order + 1 }); updateExperience(swap.id, { order: swap.order - 1 }); } }}
                  className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiArrowDown size={14} /></button>
                <button onClick={() => openEdit(exp)} className="p-2 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => setDeleteConfirm(exp.id!)} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><FiTrash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Modifier l'expérience" : "Nouvelle expérience"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Entreprise *" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Nom de l'entreprise" />
            <Field label="Poste *" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Développeur Full Stack" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Type de contrat</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="admin-select w-full bg-[#161616] border border-[#252525] text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-colors">
                {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <Field label="Période" value={form.period} onChange={(v) => setForm({ ...form, period: v })} placeholder="Jan 2023 – Présent" />
          </div>

          {/* Current */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div onClick={() => setForm({ ...form, current: !form.current })}
              className="relative w-10 h-5 rounded-full transition-colors"
              style={{ backgroundColor: form.current ? "var(--accent)" : "#2a2a2a" }}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.current ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-slate-300">Poste actuel</span>
          </label>

          {/* Description points */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Missions / réalisations</label>
            <div className="flex gap-2 mb-2">
              <input value={descInput} onChange={(e) => setDescInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDesc())}
                placeholder="Développement d'une API RESTful..."
                className="admin-input flex-1 bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button type="button" onClick={addDesc}
                className="rounded-xl px-4 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)", color: "var(--accent)" }}>
                +
              </button>
            </div>
            <ul className="space-y-1.5">
              {form.description.map((d, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#161616] border border-[#252525] rounded-lg px-3 py-2 text-sm text-slate-300">
                  <span className="text-xs mt-1 flex-shrink-0" style={{ color: "var(--accent)" }}>▸</span>
                  <span className="flex-1">{d}</span>
                  <button onClick={() => setForm((f) => ({ ...f, description: f.description.filter((_, j) => j !== i) }))}
                    className="text-slate-600 hover:text-red-400 flex-shrink-0 ml-1">✕</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input value={techInput} onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="React, Node.js..."
                className="admin-input flex-1 bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />
              <button type="button" onClick={addTech}
                className="rounded-xl px-4 text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)", color: "var(--accent)" }}>
                + Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.technologies.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2.5 py-1.5">
                  {t}
                  <button onClick={() => setForm((f) => ({ ...f, technologies: f.technologies.filter((x) => x !== t) }))} className="text-slate-500 hover:text-red-400 text-xs">✕</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl hover:border-[#333]">Annuler</button>
            <button onClick={handleSave} disabled={!form.company || !form.role || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}>
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer ?" size="md">
        <p className="text-slate-400 text-sm mb-6">Cette expérience sera supprimée définitivement.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl">Annuler</button>
          <button onClick={() => { deleteExperience(deleteConfirm!); setDeleteConfirm(null); }}
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
