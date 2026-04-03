"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiCode, FiHelpCircle } from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import {
  subscribeSkills, addSkillCategory, updateSkillCategory, deleteSkillCategory,
  type SkillCategory,
} from "@/lib/firestore";
import { getIconByKey, getTechIcon } from "@/lib/iconMap";

const COLORS = ["emerald", "blue", "violet", "amber", "rose", "cyan"];

const EMPTY: Omit<SkillCategory, "id"> = {
  category: "", color: "emerald", order: 0, items: [],
};

export default function AdminSkills() {
  const [cats, setCats] = useState<SkillCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SkillCategory | null>(null);
  const [form, setForm] = useState<Omit<SkillCategory, "id">>(EMPTY);
  const [skillInput, setSkillInput] = useState({ name: "", icon: "", imageUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => subscribeSkills(setCats), []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, order: cats.length });
    setSkillInput({ name: "", icon: "", imageUrl: "" });
    setModalOpen(true);
  };

  const openEdit = (c: SkillCategory) => {
    setEditing(c);
    setForm({ category: c.category, color: c.color, order: c.order, items: c.items });
    setSkillInput({ name: "", icon: "", imageUrl: "" });
    setModalOpen(true);
  };

  const addSkill = () => {
    if (skillInput.name) {
      setForm((f) => ({
        ...f,
        items: [...f.items, {
          name: skillInput.name,
          icon: skillInput.icon,
          ...(skillInput.imageUrl ? { imageUrl: skillInput.imageUrl } : {}),
        }],
      }));
      setSkillInput({ name: "", icon: "", imageUrl: "" });
    }
  };

  const removeSkill = (i: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }));

  const handleSave = async () => {
    if (!form.category) return;
    setSaving(true);
    try {
      if (editing?.id) await updateSkillCategory(editing.id, form);
      else await addSkillCategory(form);
      setModalOpen(false);
    } finally { setSaving(false); }
  };

  const colorBadge: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Compétences</h1>
          <p className="text-slate-400 text-sm">{cats.length} catégorie{cats.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
          <FiPlus size={15} /> Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[...cats].sort((a, b) => a.order - b.order).map((cat, i) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs font-semibold uppercase tracking-widest border rounded-full px-3 py-1 ${colorBadge[cat.color] ?? colorBadge.emerald}`}>
                {cat.category}
              </span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all"><FiEdit2 size={13} /></button>
                <button onClick={() => deleteSkillCategory(cat.id!)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((skill) => {
                const Icon = getIconByKey(skill.icon) ?? getTechIcon(skill.name);
                return (
                  <span key={skill.name} className="flex items-center gap-1 text-xs text-slate-300 bg-[#1a1a1a] border border-[#252525] rounded-md px-2 py-1">
                    {Icon ? (
                      <Icon size={11} className="text-slate-500" />
                    ) : skill.imageUrl ? (
                      <img src={skill.imageUrl} alt={skill.name} className="w-[11px] h-[11px] object-contain opacity-60" />
                    ) : null}
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}
        title={editing ? "Modifier la catégorie" : "Nouvelle catégorie"} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Nom *</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Frontend"
                className="w-full bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Couleur</label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                    className={`w-7 h-7 rounded-lg border-2 transition-all ${colorBadge[c]?.split(" ")[0]} ${form.color === c ? "border-white scale-110" : "border-transparent"}`} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Compétences</label>

            {/* Input row */}
            <div className="flex gap-2 mb-3">
              <input value={skillInput.name} onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="React"
                className="flex-1 bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />

              {/* Icon key input + live preview */}
              <div className="relative flex items-center">
                <input value={skillInput.icon} onChange={(e) => setSkillInput({ ...skillInput, icon: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="SiReact"
                  className="w-36 bg-[#161616] border border-[#252525] focus:border-emerald-500/50 text-white placeholder-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" />
                <span className="absolute left-2.5 flex items-center pointer-events-none">
                  {(() => {
                    const Icon = skillInput.icon ? getIconByKey(skillInput.icon) ?? getTechIcon(skillInput.name) : getTechIcon(skillInput.name);
                    return Icon
                      ? <Icon size={15} className="text-emerald-400" />
                      : <FiHelpCircle size={14} className="text-slate-600" />;
                  })()}
                </span>
              </div>

              <button type="button" onClick={addSkill}
                className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 rounded-xl text-sm hover:bg-emerald-500/20 transition-colors">+</button>
            </div>

            {/* Image URL fallback — shown only when no Si icon found */}
            {skillInput.name && !getIconByKey(skillInput.icon) && !getTechIcon(skillInput.name) && (
              <div className="flex items-center gap-2 mb-2">
                <input value={skillInput.imageUrl}
                  onChange={(e) => setSkillInput({ ...skillInput, imageUrl: e.target.value })}
                  placeholder="URL du logo (PNG/SVG) — ex: https://…/logo.svg"
                  className="flex-1 bg-[#161616] border border-amber-500/30 focus:border-amber-500/60 text-white placeholder-slate-600 rounded-xl px-4 py-2 text-xs outline-none" />
                {skillInput.imageUrl && (
                  <img src={skillInput.imageUrl} alt="" className="w-6 h-6 object-contain rounded" />
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-600 mb-2.5">
              Icône : utilisez un nom <span className="text-slate-500">Si*</span> de{" "}
              <a href="https://react-icons.github.io/react-icons/icons/si/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 underline">react-icons/si</a>.
              Laissez vide pour auto-détection par nom.
            </p>

            {/* Skills list */}
            <div className="flex flex-wrap gap-1.5">
              {form.items.map((skill, i) => {
                const Icon = getIconByKey(skill.icon) ?? getTechIcon(skill.name);
                return (
                  <span key={i} className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#1a1a1a] border border-[#252525] rounded-lg px-2.5 py-1.5">
                    {Icon ? (
                      <Icon size={12} className="text-slate-400" />
                    ) : skill.imageUrl ? (
                      <img src={skill.imageUrl} alt={skill.name} className="w-3 h-3 object-contain opacity-70" />
                    ) : null}
                    {skill.name}
                    <button onClick={() => removeSkill(i)} className="text-slate-500 hover:text-red-400 ml-0.5">✕</button>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl">Annuler</button>
            <button onClick={handleSave} disabled={!form.category || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl">
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
