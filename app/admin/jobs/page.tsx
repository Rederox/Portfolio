"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiMapPin,
  FiLink, FiImage, FiNavigation, FiSearch, FiCheck, FiClipboard,
  FiDownload, FiFileText, FiMessageSquare, FiFile, FiCalendar,
  FiZap,
} from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import {
  subscribeJobTabs, addJobTab, updateJobTab, deleteJobTab,
  subscribeJobApplications, addJobApplication, updateJobApplication, deleteJobApplication,
  JOB_STATUSES,
  type JobBoardTab, type JobApplication, type JobStatus,
} from "@/lib/firestore";

// ─── Config ───────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN 

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapboxStaticUrl(lat: number, lng: number, w = 600, h = 220) {
  return `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-l+10b981(${lng},${lat})/${lng},${lat},13,0/${w}x${h}@2x?access_token=${MAPBOX_TOKEN}`;
}

function formatDate(ts: unknown): string {
  if (!ts) return "";
  let d: Date;
  if (ts && typeof ts === "object" && "seconds" in (ts as object)) {
    d = new Date((ts as { seconds: number }).seconds * 1000);
  } else {
    d = new Date(ts as string);
  }
  if (isNaN(d.getTime())) return "";
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return "Hier";
  if (diff < 7) return `Il y a ${diff}j`;
  if (diff < 30) return `Il y a ${Math.floor(diff / 7)} sem`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: diff > 365 ? "numeric" : undefined });
}

function exportToCSV(apps: JobApplication[], tabName: string) {
  const headers = ["Entreprise", "Poste", "Statut", "Localisation", "Lien", "Notes", "Créé le"];
  const rows = apps.map((a) => [
    a.company, a.title,
    JOB_STATUSES.find((s) => s.key === a.status)?.label ?? a.status,
    a.location, a.link, a.notes,
    formatDate(a.createdAt),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `candidatures-${tabName.replace(/\s+/g, "-").toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const EMPTY_FORM: Omit<JobApplication, "id" | "createdAt"> = {
  tabId: "", title: "", company: "", location: "",
  lat: undefined, lng: undefined, description: "", status: "wishlist",
  notes: "", screenshots: [], documents: [], link: "", order: 0,
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminJobs() {
  const [tabs, setTabs] = useState<JobBoardTab[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<JobApplication | null>(null);

  const [cardModal, setCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<JobApplication | null>(null);
  const [form, setForm] = useState<Omit<JobApplication, "id" | "createdAt">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [addingTab, setAddingTab] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const [deleteTabConfirm, setDeleteTabConfirm] = useState<string | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<JobStatus | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => subscribeJobTabs((t) => {
    setTabs(t);
    setActiveTabId((prev) => {
      if (prev && t.find((x) => x.id === prev)) return prev;
      return t[0]?.id ?? null;
    });
  }), []);

  useEffect(() => subscribeJobApplications(setApplications), []);

  useEffect(() => {
    if (selectedCard?.id) {
      const updated = applications.find((a) => a.id === selectedCard.id);
      if (updated) setSelectedCard(updated);
    }
  }, [applications, selectedCard?.id]);

  // ─── Tab handlers ──────────────────────────────────────────────────────────

  const handleAddTab = async () => {
    const name = newTabName.trim();
    if (!name) return;
    const ref = await addJobTab({ name, order: tabs.length });
    setNewTabName(""); setAddingTab(false);
    setActiveTabId((ref as { id: string }).id);
  };

  const handleRenameTab = async (id: string) => {
    const name = editingTabName.trim();
    if (name) await updateJobTab(id, { name });
    setEditingTabId(null);
  };

  const handleDeleteTab = async (id: string) => {
    await deleteJobTab(id);
    await Promise.all(applications.filter((a) => a.tabId === id).map((a) => deleteJobApplication(a.id!)));
    setDeleteTabConfirm(null);
    setActiveTabId(tabs.find((t) => t.id !== id)?.id ?? null);
  };

  // ─── Card handlers ─────────────────────────────────────────────────────────

  const openAddCard = (status: JobStatus) => {
    if (!activeTabId) return;
    const colCards = applications.filter((a) => a.tabId === activeTabId && a.status === status);
    setEditingCard(null);
    setForm({ ...EMPTY_FORM, tabId: activeTabId, status, order: colCards.length });
    setCardModal(true);
  };

  const openEditCard = (card: JobApplication) => {
    setEditingCard(card);
    setForm({
      tabId: card.tabId, title: card.title, company: card.company,
      location: card.location, lat: card.lat, lng: card.lng,
      description: card.description, status: card.status, notes: card.notes,
      screenshots: card.screenshots, documents: card.documents ?? [],
      link: card.link, order: card.order,
    });
    setCardModal(true);
  };

  const handleSaveCard = async () => {
    if (!form.title && !form.company) return;
    setSaving(true);
    try {
      if (editingCard?.id) await updateJobApplication(editingCard.id, form);
      else await addJobApplication(form);
      setCardModal(false);
    } finally { setSaving(false); }
  };

  const handleDeleteCard = async (id: string) => {
    await deleteJobApplication(id);
    setDeleteConfirm(null);
    if (selectedCard?.id === id) setSelectedCard(null);
  };

  // ─── Drag & drop ───────────────────────────────────────────────────────────

  const handleDrop = async (newStatus: JobStatus) => {
    if (!draggingId) return;
    const card = applications.find((a) => a.id === draggingId);
    if (!card || card.status === newStatus) return;
    const colCards = applications.filter((a) => a.tabId === activeTabId && a.status === newStatus);
    const newOrder = colCards.length > 0 ? Math.max(...colCards.map((c) => c.order)) + 1 : 0;
    await updateJobApplication(draggingId, { status: newStatus, order: newOrder });
  };

  // ─── Geocoding (Mapbox) ────────────────────────────────────────────────────

  const geocode = async () => {
    if (!form.location.trim()) return;
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(form.location)}.json?language=fr&limit=1&access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      if (data.features?.[0]) {
        const [lng, lat] = data.features[0].center;
        setForm((f) => ({ ...f, lat, lng }));
      }
    } finally { setGeocoding(false); }
  };

  // ─── Computed ──────────────────────────────────────────────────────────────

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const tabApps = applications.filter((a) => a.tabId === activeTabId);
  const cardsByStatus = (status: JobStatus) =>
    tabApps.filter((a) => a.status === status).sort((a, b) => a.order - b.order);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 px-5 pt-5 pb-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Candidatures</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            {tabApps.length} offre{tabApps.length !== 1 ? "s" : ""}
            {activeTab ? ` · ${activeTab.name}` : ""}
          </p>
        </div>
        {tabApps.length > 0 && (
          <button
            onClick={() => exportToCSV(tabApps, activeTab?.name ?? "export")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#111] transition-all"
          >
            <FiDownload size={12} /> Exporter
          </button>
        )}
      </div>

      {/* Tabs bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-5 pb-3 flex-wrap">
        {tabs.map((tab) => (
          <div key={tab.id} className="relative group">
            {editingTabId === tab.id ? (
              <div className="flex items-center gap-1">
                <input autoFocus value={editingTabName} onChange={(e) => setEditingTabName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRenameTab(tab.id!); if (e.key === "Escape") setEditingTabId(null); }}
                  className="bg-[#1a1a1a] border border-[#333] text-white text-xs rounded-lg px-2.5 py-1 outline-none w-32" />
                <button onClick={() => handleRenameTab(tab.id!)} className="text-emerald-400"><FiCheck size={13} /></button>
                <button onClick={() => setEditingTabId(null)} className="text-slate-500"><FiX size={13} /></button>
              </div>
            ) : (
              <button onClick={() => setActiveTabId(tab.id!)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeTabId === tab.id ? "border-[rgba(var(--accent-rgb),0.3)]" : "border-[#1e1e1e] text-slate-400 hover:text-white hover:bg-[#111]"
                }`}
                style={activeTabId === tab.id ? { backgroundColor: "rgba(var(--accent-rgb),0.08)", color: "var(--accent)" } : {}}>
                <FiClipboard size={11} />
                {tab.name}
                <span className="opacity-50">{applications.filter((a) => a.tabId === tab.id).length}</span>
              </button>
            )}
            {editingTabId !== tab.id && (
              <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-0.5 z-10">
                <button onClick={() => { setEditingTabId(tab.id!); setEditingTabName(tab.name); }}
                  className="w-3.5 h-3.5 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-slate-400 hover:text-white">
                  <FiEdit2 size={7} />
                </button>
                <button onClick={() => setDeleteTabConfirm(tab.id!)}
                  className="w-3.5 h-3.5 bg-[#1a1a1a] border border-[#333] rounded-full flex items-center justify-center text-slate-400 hover:text-red-400">
                  <FiX size={7} />
                </button>
              </div>
            )}
          </div>
        ))}

        {addingTab ? (
          <div className="flex items-center gap-1">
            <input autoFocus value={newTabName} onChange={(e) => setNewTabName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddTab(); if (e.key === "Escape") { setAddingTab(false); setNewTabName(""); } }}
              placeholder="Nom..." className="bg-[#1a1a1a] border border-[#333] text-white text-xs rounded-lg px-2.5 py-1 outline-none w-32 placeholder-slate-600" />
            <button onClick={handleAddTab} className="text-emerald-400"><FiCheck size={13} /></button>
            <button onClick={() => { setAddingTab(false); setNewTabName(""); }} className="text-slate-500"><FiX size={13} /></button>
          </div>
        ) : (
          <button onClick={() => setAddingTab(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-400 border border-dashed border-[#1e1e1e] hover:border-[#333] transition-all">
            <FiPlus size={11} /> Nouvel onglet
          </button>
        )}
      </div>

      {/* Empty state */}
      {tabs.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <FiClipboard size={36} className="text-slate-700 mb-3" />
          <p className="text-slate-400 font-medium text-sm mb-1">Aucun onglet</p>
          <p className="text-slate-600 text-xs">Crée un onglet pour commencer à suivre tes candidatures</p>
          <button onClick={() => setAddingTab(true)}
            className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent)" }}>
            <FiPlus size={13} /> Créer un onglet
          </button>
        </div>
      )}

      {/* Kanban board — fills remaining height, NO scrollbar visible */}
      {activeTabId && (
        <div className="flex-1 min-h-0 overflow-x-auto no-scrollbar px-5 pb-4">
          <div className="flex gap-3 h-full" style={{ minWidth: `${JOB_STATUSES.length * 232}px` }}>
            {JOB_STATUSES.map((status) => {
              const cards = cardsByStatus(status.key);
              const isOver = dragOverStatus === status.key;
              return (
                <div key={status.key} className="flex flex-col flex-1 min-w-[220px] rounded-2xl border transition-colors duration-150"
                  style={{ backgroundColor: isOver ? status.bg : "#0d0d0d", borderColor: isOver ? status.border : "#181818" }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverStatus(status.key); }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStatus(null); }}
                  onDrop={(e) => { e.preventDefault(); handleDrop(status.key); setDragOverStatus(null); setDraggingId(null); }}
                >
                  {/* Column header */}
                  <div className="flex-shrink-0 flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{status.label}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
                        {cards.length}
                      </span>
                    </div>
                    <button onClick={() => openAddCard(status.key)}
                      className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-white hover:bg-[#1e1e1e] transition-all">
                      <FiPlus size={13} />
                    </button>
                  </div>

                  {/* Scrollable cards area */}
                  <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-2 pb-2 space-y-1.5">
                    <AnimatePresence>
                      {cards.map((card) => (
                        <KanbanCard key={card.id} card={card} isDragging={draggingId === card.id}
                          onOpen={() => setSelectedCard(card)}
                          onEdit={() => openEditCard(card)}
                          onDelete={() => setDeleteConfirm(card.id!)}
                          onDragStart={() => setDraggingId(card.id!)}
                          onDragEnd={() => setDraggingId(null)}
                        />
                      ))}
                    </AnimatePresence>

                    {cards.length === 0 && !isOver && (
                      <button onClick={() => openAddCard(status.key)}
                        className="w-full h-12 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#1a1a1a] text-slate-700 hover:text-slate-500 hover:border-[#252525] transition-all text-xs">
                        <FiPlus size={11} /> Ajouter
                      </button>
                    )}

                    {isOver && draggingId && (
                      <div className="h-0.5 rounded-full" style={{ backgroundColor: status.color }} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Detail Drawer ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCard && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCard(null)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed right-0 top-0 h-full z-50 w-full max-w-[460px] bg-[#0d0d0d] border-l border-[#1e1e1e] flex flex-col shadow-2xl overflow-hidden"
            >
              <DetailDrawer
                card={selectedCard}
                onEdit={() => openEditCard(selectedCard)}
                onDelete={() => setDeleteConfirm(selectedCard.id!)}
                onClose={() => setSelectedCard(null)}
                onStatusChange={(status) => updateJobApplication(selectedCard.id!, { status })}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────────── */}
      <Modal open={cardModal} onClose={() => setCardModal(false)}
        title={editingCard ? "Modifier l'offre" : "Nouvelle offre"} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Intitulé du poste</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Lead Developer, Full Stack..."
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Entreprise</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Nom de l'entreprise"
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Statut</label>
            <div className="flex flex-wrap gap-1.5">
              {JOB_STATUSES.map((s) => (
                <button key={s.key} type="button" onClick={() => setForm({ ...form, status: s.key })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={form.status === s.key
                    ? { backgroundColor: s.bg, color: s.color, borderColor: s.border }
                    : { backgroundColor: "transparent", color: "#64748b", borderColor: "#252525" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Localisation</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <FiMapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value, lat: undefined, lng: undefined })}
                  onKeyDown={(e) => e.key === "Enter" && geocode()}
                  placeholder="Paris, France"
                  className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl pl-8 pr-3 py-2.5 text-sm outline-none" />
              </div>
              <button type="button" onClick={geocode} disabled={geocoding || !form.location.trim()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border border-[#252525] text-slate-400 hover:text-white hover:border-[#444] transition-all disabled:opacity-40">
                {geocoding ? <span className="w-3 h-3 border border-slate-400/30 border-t-slate-400 rounded-full animate-spin" /> : <FiSearch size={12} />}
                Localiser
              </button>
              {form.lat && form.lng && (
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${form.lat},${form.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs border border-[#252525] text-emerald-400 hover:border-emerald-500/30 transition-all">
                  <FiNavigation size={12} />
                </a>
              )}
            </div>
            {form.lat && form.lng && (
              <div className="mt-2 rounded-xl overflow-hidden border border-[#252525] relative group">
                <img
                  src={mapboxStaticUrl(form.lat, form.lng, 800, 200)}
                  alt="Carte"
                  className="w-full h-[160px] object-cover"
                />
                <button type="button" onClick={() => setForm((f) => ({ ...f, lat: undefined, lng: undefined }))}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiX size={12} />
                </button>
                <p className="absolute bottom-2 left-2 text-[10px] text-white/70 bg-black/50 px-2 py-0.5 rounded-full">
                  {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Lien de l'offre</label>
            <div className="relative">
              <FiLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Description du poste</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Missions, compétences requises, avantages..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Notes personnelles</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="Retours d'entretien, contacts, remarques..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>

          {/* Screenshots */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">
              Captures <span className="text-slate-600">(offre, échanges, etc.)</span>
            </label>
            <ImageUpload images={form.screenshots} onChange={(urls) => setForm({ ...form, screenshots: urls })} folder="jobs" maxFiles={10} />
          </div>

          {/* Documents */}
          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">
              Documents <span className="text-slate-600">(CV, lettre de motivation, etc.)</span>
            </label>
            <FileUpload docs={form.documents} onChange={(docs) => setForm({ ...form, documents: docs })} folder="jobs/docs" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setCardModal(false)}
              className="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-[#252525] hover:border-[#333] rounded-xl transition-colors">
              Annuler
            </button>
            <button onClick={handleSaveCard} disabled={(!form.title && !form.company) || saving}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}>
              {saving && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingCard ? "Enregistrer" : "Ajouter"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Supprimer cette offre ?" size="md">
        <p className="text-slate-400 text-sm mb-6">Cette action est irréversible.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl">Annuler</button>
          <button onClick={() => handleDeleteCard(deleteConfirm!)} className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-400 rounded-xl">Supprimer</button>
        </div>
      </Modal>

      <Modal open={!!deleteTabConfirm} onClose={() => setDeleteTabConfirm(null)} title="Supprimer cet onglet ?" size="md">
        <p className="text-slate-400 text-sm mb-6">Toutes les offres dans cet onglet seront supprimées.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteTabConfirm(null)} className="px-4 py-2.5 text-sm text-slate-400 border border-[#252525] rounded-xl">Annuler</button>
          <button onClick={() => handleDeleteTab(deleteTabConfirm!)} className="px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-400 rounded-xl">Supprimer</button>
        </div>
      </Modal>
    </div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────

interface KanbanCardProps {
  card: JobApplication;
  isDragging: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

function KanbanCard({ card, isDragging, onOpen, onEdit, onDelete, onDragStart, onDragEnd }: KanbanCardProps) {
  const status = JOB_STATUSES.find((s) => s.key === card.status)!;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.12 }}
      draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onOpen}
      className="group bg-[#131313] border border-[#1c1c1c] hover:border-[#262626] rounded-xl p-2.5 cursor-pointer active:cursor-grabbing transition-all select-none"
      style={{ borderLeft: `2px solid ${status.color}40` }}
    >
      {/* Company + Title */}
      <div className="mb-1.5">
        {card.company && (
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide truncate leading-none mb-0.5">{card.company}</p>
        )}
        <p className="text-sm text-white font-semibold leading-snug truncate">{card.title || card.company}</p>
      </div>

      {/* Location / link */}
      {(card.location || card.link) && (
        <div className="space-y-0.5 mb-2">
          {card.location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <FiMapPin size={9} className="flex-shrink-0" />
              <span className="truncate">{card.location}</span>
            </div>
          )}
          {card.link && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <FiLink size={9} className="flex-shrink-0" />
              <span className="truncate">{card.link.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: date + meta + actions */}
      <div className="flex items-center justify-between pt-1.5 border-t border-[#1c1c1c]">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          {card.createdAt && (
            <span className="flex items-center gap-0.5">
              <FiCalendar size={8} />
              {formatDate(card.createdAt)}
            </span>
          )}
          {card.screenshots.length > 0 && <span className="flex items-center gap-0.5"><FiImage size={8} />{card.screenshots.length}</span>}
          {(card.documents ?? []).length > 0 && <span className="flex items-center gap-0.5"><FiFile size={8} />{card.documents.length}</span>}
          {card.notes && <FiMessageSquare size={8} />}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {card.link && (
            <a href={card.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-white hover:bg-[#1e1e1e] transition-all">
              <FiExternalLink size={9} />
            </a>
          )}
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-white hover:bg-[#1e1e1e] transition-all">
            <FiEdit2 size={9} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <FiTrash2 size={9} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

interface DetailDrawerProps {
  card: JobApplication;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onStatusChange: (status: JobStatus) => void;
}

function DetailDrawer({ card, onEdit, onDelete, onClose, onStatusChange }: DetailDrawerProps) {
  const status = JOB_STATUSES.find((s) => s.key === card.status)!;
  const [imgOpen, setImgOpen] = useState<string | null>(null);

  return (
    <>
      {/* Sticky header */}
      <div className="flex-shrink-0 px-5 py-4 border-b border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            {card.company && (
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5 truncate">{card.company}</p>
            )}
            <h2 className="text-white font-bold text-lg leading-tight truncate">{card.title || card.company}</h2>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {card.link && (
              <a href={card.link} target="_blank" rel="noopener noreferrer"
                className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
                <FiExternalLink size={14} />
              </a>
            )}
            <button onClick={onEdit} className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
              <FiEdit2 size={14} />
            </button>
            <button onClick={onDelete} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
              <FiTrash2 size={14} />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all ml-1">
              <FiX size={14} />
            </button>
          </div>
        </div>

        {/* Quick status change */}
        <div className="flex flex-wrap gap-1.5">
          {JOB_STATUSES.map((s) => (
            <button key={s.key} onClick={() => onStatusChange(s.key)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all"
              style={s.key === card.status
                ? { backgroundColor: s.bg, color: s.color, borderColor: s.border }
                : { backgroundColor: "transparent", color: "#475569", borderColor: "#1e1e1e" }}>
              {s.key === card.status && <FiCheck size={9} />}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body — hidden scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 py-4 space-y-5">

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {card.createdAt && (
            <span className="flex items-center gap-1.5">
              <FiCalendar size={11} />
              Ajouté {formatDate(card.createdAt)}
            </span>
          )}
          {card.location && (
            <span className="flex items-center gap-1.5">
              <FiMapPin size={11} />
              {card.location}
            </span>
          )}
        </div>

        {/* Map */}
        {card.lat && card.lng && (
          <section>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${card.lat},${card.lng}`}
              target="_blank" rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-[#1e1e1e] relative group">
              <img src={mapboxStaticUrl(card.lat, card.lng)} alt="Carte" className="w-full h-[180px] object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-white text-xs bg-black/60 px-3 py-1.5 rounded-full transition-opacity">
                  <FiNavigation size={11} /> Ouvrir l'itinéraire
                </span>
              </div>
            </a>
          </section>
        )}

        {/* Link */}
        {card.link && (
          <section>
            <a href={card.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 bg-blue-400/5 border border-blue-400/10 hover:border-blue-400/20 rounded-xl px-3 py-2.5 transition-all">
              <FiLink size={11} className="flex-shrink-0" />
              <span className="truncate flex-1">{card.link}</span>
              <FiExternalLink size={10} className="flex-shrink-0" />
            </a>
          </section>
        )}

        {/* Description */}
        {card.description && (
          <section>
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FiZap size={9} /> Description
            </p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{card.description}</p>
          </section>
        )}

        {/* Notes */}
        {card.notes && (
          <section>
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FiMessageSquare size={9} /> Notes
            </p>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#131313] border border-[#1a1a1a] rounded-xl px-3 py-2.5">{card.notes}</p>
          </section>
        )}

        {/* Screenshots */}
        {card.screenshots.length > 0 && (
          <section>
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FiImage size={9} /> Captures ({card.screenshots.length})
            </p>
            <div className="grid grid-cols-3 gap-2">
              {card.screenshots.map((url, i) => (
                <button key={url} onClick={() => setImgOpen(url)}
                  className="aspect-square rounded-lg overflow-hidden border border-[#1a1a1a] hover:border-[#2a2a2a] transition-all group">
                  <img src={url} alt={`${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Documents */}
        {(card.documents ?? []).length > 0 && (
          <section>
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <FiFileText size={9} /> Documents ({card.documents.length})
            </p>
            <div className="space-y-1.5">
              {card.documents.map((doc) => (
                <a key={doc.url} href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-[#131313] border border-[#1a1a1a] hover:border-[#252525] rounded-xl px-3 py-2.5 transition-all group">
                  <FiFile size={12} className="text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-slate-300 truncate flex-1">{doc.name}</span>
                  <FiDownload size={11} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!card.location && !card.description && !card.notes && card.screenshots.length === 0 && (card.documents ?? []).length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-slate-600 text-xs mb-2">Aucun détail renseigné</p>
            <button onClick={onEdit} className="text-xs underline text-slate-500 hover:text-slate-300 transition-colors">Compléter l'offre</button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {imgOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setImgOpen(null)}
            className="fixed inset-0 z-[60] bg-black/92 flex items-center justify-center p-4">
            <button onClick={() => setImgOpen(null)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full transition-colors">
              <FiX size={18} />
            </button>
            <img src={imgOpen} alt="" className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
