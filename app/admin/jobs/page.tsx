"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiExternalLink, FiMapPin,
  FiLink, FiImage, FiNavigation, FiSearch, FiCheck, FiClipboard,
  FiDownload, FiFileText, FiMessageSquare, FiFile, FiCalendar,
  FiZap, FiChevronLeft, FiChevronRight, FiBell, FiPhone,
  FiVideo, FiMonitor, FiCode, FiLoader, FiBarChart2,
  FiTrendingUp, FiPrinter, FiTarget, FiHelpCircle, FiFlag,
  FiArrowUp, FiMinus, FiArrowDown, FiSliders,
} from "react-icons/fi";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import {
  subscribeJobTabs, addJobTab, updateJobTab, deleteJobTab,
  subscribeJobApplications, addJobApplication, updateJobApplication, deleteJobApplication,
  subscribeInterviews, addInterview, updateInterview, deleteInterview,
  subscribeExperience, subscribeSkills,
  JOB_STATUSES,
  type JobBoardTab, type JobApplication, type JobStatus,
  type Interview, type InterviewType, type AIAnalysis,
  type Experience, type SkillCategory, type CompatibilityResult,
} from "@/lib/firestore";


// ─── Config ───────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const INTERVIEW_TYPES: { key: InterviewType; label: string; icon: React.ReactNode }[] = [
  { key: "phone",     label: "Téléphonique",   icon: <FiPhone size={12} /> },
  { key: "video",     label: "Visio",           icon: <FiVideo size={12} /> },
  { key: "onsite",    label: "Présentiel",      icon: <FiMonitor size={12} /> },
  { key: "technical", label: "Technique",       icon: <FiCode size={12} /> },
];

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

function formatInterviewDate(date: string, time: string): string {
  if (!date) return "";
  const d = new Date(`${date}T${time || "00:00"}`);
  return d.toLocaleString("fr-FR", {
    weekday: "short", day: "numeric", month: "short",
    hour: time ? "2-digit" : undefined, minute: time ? "2-digit" : undefined,
  });
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

function exportJobToPDF(card: JobApplication, analysis: AIAnalysis | null) {
  const statusLabel = JOB_STATUSES.find((s) => s.key === card.status)?.label ?? card.status;
  const skillsHtml = analysis?.skills_required.map((s) => `<span class="chip">${s}</span>`).join("") ?? "";
  const niceSkillsHtml = analysis?.skills_nice.map((s) => `<span class="chip muted">${s}</span>`).join("") ?? "";
  const roadmapHtml = (analysis?.roadmap ?? []).map((r) =>
    `<div class="step"><div class="step-num">${r.step}</div><div><strong>${r.title}</strong><p>${r.description}</p></div></div>`
  ).join("");

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>${card.title} — ${card.company}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, Arial, sans-serif; color: #111; background: #fff; padding: 48px; max-width: 780px; margin: 0 auto; font-size: 13px; line-height: 1.6; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
  .meta { color: #666; font-size: 13px; margin-bottom: 6px; }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; background: #f0f0f0; color: #555; }
  .section { margin-top: 28px; }
  .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
  p { color: #333; margin-top: 6px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .chip { background: #e8f0fe; color: #1a56db; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; }
  .chip.muted { background: #f3f4f6; color: #555; }
  .step { display: flex; gap: 12px; margin-bottom: 12px; }
  .step-num { width: 24px; height: 24px; border-radius: 50%; background: #1a56db; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .cover-letter { white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; font-size: 13px; line-height: 1.8; margin-top: 8px; }
  .summary-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin-top: 8px; }
  @media print { body { padding: 24px; } }
</style></head><body>
  <h1>${card.title || card.company}</h1>
  <div class="meta">${card.company}${card.location ? ` · ${card.location}` : ""} · <span class="badge">${statusLabel}</span></div>
  ${card.link ? `<div class="meta"><a href="${card.link}" style="color:#1a56db">${card.link}</a></div>` : ""}

  ${card.description ? `<div class="section"><div class="section-title">Description du poste</div><p>${card.description.replace(/\n/g, "<br>")}</p></div>` : ""}
  ${card.notes ? `<div class="section"><div class="section-title">Mes notes</div><p>${card.notes.replace(/\n/g, "<br>")}</p></div>` : ""}

  ${analysis ? `
  <div class="section"><div class="section-title">Résumé IA</div>
    <div class="summary-box"><p>${analysis.summary}</p>${analysis.salary_estimate ? `<p style="margin-top:8px;color:#059669;font-weight:600">${analysis.salary_estimate}</p>` : ""}</div>
  </div>
  ${analysis.skills_required.length ? `<div class="section"><div class="section-title">Compétences requises</div><div class="chips">${skillsHtml}</div></div>` : ""}
  ${analysis.skills_nice.length ? `<div class="section"><div class="section-title">Compétences bonus</div><div class="chips">${niceSkillsHtml}</div></div>` : ""}
  ${analysis.roadmap.length ? `<div class="section"><div class="section-title">Roadmap</div>${roadmapHtml}</div>` : ""}
  ` : ""}

  ${card.coverLetter ? `<div class="section"><div class="section-title">Lettre de motivation</div><div class="cover-letter">${card.coverLetter}</div></div>` : ""}
</body></html>`;

  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 400);
}

const PRIORITY_CONFIG = {
  high:   { label: "Haute",   color: "#ef4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)" },
  medium: { label: "Moyenne", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" },
  low:    { label: "Basse",   color: "#64748b", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" },
} as const;

const SORT_OPTIONS = [
  { key: "default",    label: "Ordre manuel" },
  { key: "date_desc",  label: "Plus récent" },
  { key: "date_asc",   label: "Plus ancien" },
  { key: "az",         label: "A → Z" },
  { key: "priority",   label: "Priorité" },
] as const;
type SortKey = typeof SORT_OPTIONS[number]["key"];

const EMPTY_FORM: Omit<JobApplication, "id" | "createdAt"> = {
  tabId: "", title: "", company: "", location: "",
  lat: undefined, lng: undefined, description: "", status: "wishlist",
  notes: "", screenshots: [], documents: [], link: "", order: 0, priority: undefined,
};

const EMPTY_INTERVIEW: Omit<Interview, "id" | "createdAt"> = {
  jobId: "", title: "", company: "", date: "", time: "10:00", type: "phone", notes: "",
};

// ─── Relance helpers ───────────────────────────────────────────────────────────

function getRelanceStatus(card: JobApplication): { days: number; level: "warning" | "alert" | null } {
  if (card.status !== "applied" && card.status !== "interview") return { days: 0, level: null };
  const raw = card.lastContactAt ?? card.createdAt;
  const ts = !raw ? null
    : typeof raw === "object" && "seconds" in (raw as object)
    ? new Date((raw as unknown as { seconds: number }).seconds * 1000)
    : new Date(raw as unknown as string);
  if (!ts || isNaN(ts.getTime())) return { days: 0, level: null };
  const days = Math.floor((Date.now() - ts.getTime()) / 86400000);
  const warn = card.status === "applied" ? 7 : 10;
  const alert = warn * 2;
  if (days >= alert) return { days, level: "alert" };
  if (days >= warn) return { days, level: "warning" };
  return { days, level: null };
}

// ─── Push notification helpers ─────────────────────────────────────────────────

async function registerPush(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return null;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    await fetch("/api/jobs/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) });
    return sub;
  } catch { return null; }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminJobs() {
  const [tabs, setTabs] = useState<JobBoardTab[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<JobApplication | null>(null);
  const [view, setView] = useState<"kanban" | "calendar" | "dashboard">("kanban");

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

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; card: JobApplication } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<JobStatus | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  const [interviewModal, setInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [interviewForm, setInterviewForm] = useState<Omit<Interview, "id" | "createdAt">>(EMPTY_INTERVIEW);
  const [savingInterview, setSavingInterview] = useState(false);
  const [pushSub, setPushSub] = useState<PushSubscription | null>(null);
  const [sendingRemind, setSendingRemind] = useState<string | null>(null);

  useEffect(() => subscribeJobTabs((t) => {
    setTabs(t);
    setActiveTabId((prev) => {
      if (prev && t.find((x) => x.id === prev)) return prev;
      return t[0]?.id ?? null;
    });
  }), []);

  useEffect(() => subscribeJobApplications(setApplications), []);
  useEffect(() => subscribeInterviews(setInterviews), []);
  useEffect(() => subscribeExperience(setExperiences), []);
  useEffect(() => subscribeSkills(setSkills), []);

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
      link: card.link, order: card.order, priority: card.priority,
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

  // ─── Geocoding ─────────────────────────────────────────────────────────────

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

  // ─── Interview handlers ─────────────────────────────────────────────────────

  const openAddInterview = (card: JobApplication) => {
    setEditingInterview(null);
    setInterviewForm({
      ...EMPTY_INTERVIEW,
      jobId: card.id!,
      title: card.title,
      company: card.company,
      date: new Date().toISOString().split("T")[0],
    });
    setInterviewModal(true);
  };

  const openEditInterview = (iv: Interview) => {
    setEditingInterview(iv);
    setInterviewForm({
      jobId: iv.jobId, title: iv.title, company: iv.company,
      date: iv.date, time: iv.time, type: iv.type, notes: iv.notes,
    });
    setInterviewModal(true);
  };

  const handleSaveInterview = async () => {
    if (!interviewForm.date) return;
    setSavingInterview(true);
    try {
      if (editingInterview?.id) await updateInterview(editingInterview.id, interviewForm);
      else await addInterview(interviewForm);
      setInterviewModal(false);
    } finally { setSavingInterview(false); }
  };

  const handleDeleteInterview = async (id: string) => {
    await deleteInterview(id);
  };

  const handleSendReminder = async (iv: Interview) => {
    setSendingRemind(iv.id!);
    try {
      let sub = pushSub;
      if (!sub) { sub = await registerPush(); if (sub) setPushSub(sub); }
      await fetch("/api/jobs/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interview: iv, subscription: sub }),
      });
    } finally { setSendingRemind(null); }
  };

  // ─── Computed ──────────────────────────────────────────────────────────────

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const tabApps = applications.filter((a) => a.tabId === activeTabId);

  const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2, "": 3 };
  const filteredTabApps = searchQuery.trim()
    ? tabApps.filter((a) => {
        const q = searchQuery.toLowerCase();
        return a.title.toLowerCase().includes(q) || a.company.toLowerCase().includes(q) || (a.location ?? "").toLowerCase().includes(q);
      })
    : tabApps;

  const cardsByStatus = (status: JobStatus) => {
    const cards = filteredTabApps.filter((a) => a.status === status);
    switch (sortBy) {
      case "date_desc": return [...cards].sort((a, b) => {
        const ta = a.createdAt && typeof a.createdAt === "object" && "seconds" in a.createdAt ? (a.createdAt as unknown as {seconds:number}).seconds : 0;
        const tb = b.createdAt && typeof b.createdAt === "object" && "seconds" in b.createdAt ? (b.createdAt as unknown as {seconds:number}).seconds : 0;
        return tb - ta;
      });
      case "date_asc": return [...cards].sort((a, b) => {
        const ta = a.createdAt && typeof a.createdAt === "object" && "seconds" in a.createdAt ? (a.createdAt as unknown as {seconds:number}).seconds : 0;
        const tb = b.createdAt && typeof b.createdAt === "object" && "seconds" in b.createdAt ? (b.createdAt as unknown as {seconds:number}).seconds : 0;
        return ta - tb;
      });
      case "az": return [...cards].sort((a, b) => (a.company || a.title).localeCompare(b.company || b.title));
      case "priority": return [...cards].sort((a, b) => (PRIORITY_ORDER[a.priority ?? ""] ?? 3) - (PRIORITY_ORDER[b.priority ?? ""] ?? 3));
      default: return [...cards].sort((a, b) => a.order - b.order);
    }
  };

  const upcomingInterviews = interviews.filter((iv) => {
    const d = new Date(`${iv.date}T${iv.time}`);
    return d >= new Date();
  }).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-xl sm:text-2xl text-white">Candidatures</h1>
          <p className="text-slate-500 text-xs mt-0.5 truncate">
            {tabApps.length} offre{tabApps.length !== 1 ? "s" : ""}
            {activeTab ? ` · ${activeTab.name}` : ""}
            {upcomingInterviews.length > 0 && (
              <span className="ml-2 text-amber-400 hidden sm:inline">· {upcomingInterviews.length} entretien{upcomingInterviews.length > 1 ? "s" : ""} à venir</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-[#111] border border-[#1e1e1e] rounded-xl p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "kanban" ? "bg-[#1e1e1e] text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FiClipboard size={11} /><span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "calendar" ? "bg-[#1e1e1e] text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FiCalendar size={11} /><span className="hidden sm:inline">Calendrier</span>
            </button>
            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${view === "dashboard" ? "bg-[#1e1e1e] text-white" : "text-slate-500 hover:text-slate-300"}`}
            >
              <FiBarChart2 size={11} /><span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
          {tabApps.length > 0 && (
            <button
              onClick={() => exportToCSV(tabApps, activeTab?.name ?? "export")}
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-[#1e1e1e] hover:border-[#2a2a2a] hover:bg-[#111] transition-all"
            >
              <FiDownload size={12} /><span className="hidden sm:inline">Exporter</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-5 pb-3 overflow-x-auto no-scrollbar">
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

      {/* Search + sort toolbar */}
      {activeTabId && tabApps.length > 0 && view === "kanban" && (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 sm:px-5 pb-3">
          <div className="relative flex-1 max-w-xs">
            <FiSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-[#111] border border-[#1e1e1e] text-white placeholder-slate-600 rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none focus:border-[#333] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                <FiX size={11} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <FiSliders size={11} className="text-slate-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-[#111] border border-[#1e1e1e] text-slate-400 rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-[#333] cursor-pointer transition-colors appearance-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
          {searchQuery && (
            <span className="text-[10px] text-slate-600 flex-shrink-0">
              {filteredTabApps.length} résultat{filteredTabApps.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

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

      {/* ─── Calendar view ──────────────────────────────────────────────────────── */}
      {activeTabId && view === "calendar" && (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 sm:px-5 pb-4">
          <InterviewCalendar
            interviews={interviews}
            applications={applications}
            onAddInterview={(jobId) => {
              const card = applications.find((a) => a.id === jobId);
              if (card) openAddInterview(card);
            }}
            onEditInterview={openEditInterview}
            onDeleteInterview={handleDeleteInterview}
            onSendReminder={handleSendReminder}
            sendingRemind={sendingRemind}
          />
        </div>
      )}

      {/* ─── Dashboard view ─────────────────────────────────────────────────────── */}
      {view === "dashboard" && (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
          <DashboardView applications={applications} interviews={interviews} tabs={tabs} />
        </div>
      )}

      {/* ─── Kanban board ───────────────────────────────────────────────────────── */}
      {activeTabId && view === "kanban" && (
        <div className="flex-1 min-h-0 overflow-y-auto sm:overflow-y-hidden sm:overflow-x-auto no-scrollbar px-3 sm:px-5 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:h-full">
            {JOB_STATUSES.map((status) => {
              const cards = cardsByStatus(status.key);
              const isOver = dragOverStatus === status.key;
              return (
                <div key={status.key} className="flex flex-col sm:flex-1 sm:min-w-[220px] rounded-2xl border transition-colors duration-150"
                  style={{ backgroundColor: isOver ? status.bg : "#0d0d0d", borderColor: isOver ? status.border : "#181818" }}
                  onDragOver={(e) => { e.preventDefault(); setDragOverStatus(status.key); }}
                  onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStatus(null); }}
                  onDrop={(e) => { e.preventDefault(); handleDrop(status.key); setDragOverStatus(null); setDraggingId(null); }}
                >
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

                  <div className="sm:flex-1 sm:min-h-0 sm:overflow-y-auto no-scrollbar px-2 pb-2 space-y-1.5">
                    <AnimatePresence>
                      {cards.map((card) => {
                        const cardInterviews = interviews.filter((iv) => iv.jobId === card.id);
                        return (
                          <KanbanCard key={card.id} card={card} isDragging={draggingId === card.id}
                            interviewCount={cardInterviews.length}
                            onOpen={() => setSelectedCard(card)}
                            onEdit={() => openEditCard(card)}
                            onDelete={() => setDeleteConfirm(card.id!)}
                            onDragStart={() => setDraggingId(card.id!)}
                            onDragEnd={() => setDraggingId(null)}
                            onContextMenu={(e) => setContextMenu({ x: e.clientX, y: e.clientY, card })}
                          />
                        );
                      })}
                    </AnimatePresence>

                    {cards.length === 0 && !isOver && (
                      <button onClick={() => openAddCard(status.key)}
                        className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#1a1a1a] text-slate-700 hover:text-slate-500 hover:border-[#252525] transition-all text-xs">
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
              className="fixed right-0 top-0 h-full z-50 w-full sm:max-w-[500px] bg-[#0d0d0d] border-l border-[#1e1e1e] flex flex-col shadow-2xl overflow-hidden"
            >
              <DetailDrawer
                card={selectedCard}
                interviews={interviews.filter((iv) => iv.jobId === selectedCard.id)}
                experiences={experiences}
                skills={skills}
                onEdit={() => openEditCard(selectedCard)}
                onDelete={() => setDeleteConfirm(selectedCard.id!)}
                onClose={() => setSelectedCard(null)}
                onStatusChange={(status) => updateJobApplication(selectedCard.id!, { status })}
                onAddInterview={() => openAddInterview(selectedCard)}
                onEditInterview={openEditInterview}
                onDeleteInterview={handleDeleteInterview}
                onSendReminder={handleSendReminder}
                sendingRemind={sendingRemind}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── Context Menu ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="fixed z-[61] w-56 bg-[#131313] border border-[#222] rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] overflow-hidden"
              style={{ left: Math.min(contextMenu.x, window.innerWidth - 232), top: Math.min(contextMenu.y, window.innerHeight - 380) }}
            >
              {/* Header */}
              <div className="px-3.5 pt-3 pb-2.5 border-b border-[#1e1e1e]">
                {contextMenu.card.company && (
                  <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest truncate mb-0.5">{contextMenu.card.company}</p>
                )}
                <p className="text-[13px] text-white font-semibold leading-tight truncate">{contextMenu.card.title || contextMenu.card.company}</p>
                {contextMenu.card.priority && (() => {
                  const cfg = PRIORITY_CONFIG[contextMenu.card.priority];
                  return <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md" style={{ color: cfg.color, backgroundColor: cfg.bg }}><FiFlag size={8} />{cfg.label}</span>;
                })()}
              </div>

              {/* Primary actions */}
              <div className="p-1.5 border-b border-[#1e1e1e]">
                <CtxItem icon={<FiExternalLink size={13} />} label="Voir les détails" onClick={() => { setSelectedCard(contextMenu.card); setContextMenu(null); }} />
                <CtxItem icon={<FiEdit2 size={13} />} label="Modifier" onClick={() => { openEditCard(contextMenu.card); setContextMenu(null); }} />
                {contextMenu.card.link && (
                  <CtxItem icon={<FiLink size={13} />} label="Ouvrir l'offre" href={contextMenu.card.link} onClick={() => setContextMenu(null)} />
                )}
              </div>

              {/* Importance */}
              <div className="p-1.5 border-b border-[#1e1e1e]">
                <p className="px-2 pt-0.5 pb-1.5 text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Importance</p>
                {(["high", "medium", "low"] as const).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  const active = contextMenu.card.priority === p;
                  const Icon = p === "high" ? FiArrowUp : p === "medium" ? FiMinus : FiArrowDown;
                  return (
                    <CtxItem key={p}
                      icon={<Icon size={13} style={{ color: active ? cfg.color : undefined }} />}
                      label={cfg.label}
                      active={active}
                      activeColor={cfg.color}
                      activeBg={cfg.bg}
                      onClick={() => { updateJobApplication(contextMenu.card.id!, { priority: active ? undefined : p }); setContextMenu(null); }}
                    />
                  );
                })}
              </div>

              {/* Status */}
              <div className="p-1.5 border-b border-[#1e1e1e]">
                <p className="px-2 pt-0.5 pb-1.5 text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Statut</p>
                {JOB_STATUSES.map((s) => {
                  const active = contextMenu.card.status === s.key;
                  return (
                    <CtxItem key={s.key}
                      icon={<span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />}
                      label={s.label}
                      active={active}
                      activeColor={s.color}
                      activeBg={s.bg}
                      onClick={() => { updateJobApplication(contextMenu.card.id!, { status: s.key }); setContextMenu(null); }}
                    />
                  );
                })}
              </div>

              {/* Delete */}
              <div className="p-1.5">
                <CtxItem icon={<FiTrash2 size={13} />} label="Supprimer" danger onClick={() => { setDeleteConfirm(contextMenu.card.id!); setContextMenu(null); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Add / Edit Card Modal ─────────────────────────────────────────────── */}
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

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Importance</label>
            <div className="flex gap-1.5">
              {(["high", "medium", "low"] as const).map((p) => {
                const cfg = PRIORITY_CONFIG[p];
                const active = form.priority === p;
                return (
                  <button key={p} type="button" onClick={() => setForm({ ...form, priority: active ? undefined : p })}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all"
                    style={active
                      ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.border }
                      : { backgroundColor: "transparent", color: "#64748b", borderColor: "#252525" }}>
                    <FiFlag size={10} style={active ? { color: cfg.color } : {}} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

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
                <img src={mapboxStaticUrl(form.lat, form.lng, 800, 200)} alt="Carte" className="w-full h-[160px] object-cover" />
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

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Lien de l'offre</label>
            <div className="relative">
              <FiLink size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://..."
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl pl-8 pr-4 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Description du poste</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Missions, compétences requises, avantages..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Notes personnelles</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="Retours d'entretien, contacts, remarques..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">
              Captures <span className="text-slate-600">(offre, échanges, etc.)</span>
            </label>
            <ImageUpload images={form.screenshots} onChange={(urls) => setForm({ ...form, screenshots: urls })} folder="jobs" maxFiles={10} />
          </div>

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

      {/* ─── Interview Modal ───────────────────────────────────────────────────── */}
      <Modal open={interviewModal} onClose={() => setInterviewModal(false)}
        title={editingInterview ? "Modifier l'entretien" : "Programmer un entretien"} size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Date</label>
              <input type="date" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Heure</label>
              <input type="time" value={interviewForm.time} onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                className="admin-input w-full bg-[#161616] border border-[#252525] text-white rounded-xl px-3 py-2.5 text-sm outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Type d'entretien</label>
            <div className="grid grid-cols-2 gap-2">
              {INTERVIEW_TYPES.map((t) => (
                <button key={t.key} type="button" onClick={() => setInterviewForm({ ...interviewForm, type: t.key })}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border transition-all"
                  style={interviewForm.type === t.key
                    ? { backgroundColor: "rgba(var(--accent-rgb),0.1)", color: "var(--accent)", borderColor: "rgba(var(--accent-rgb),0.3)" }
                    : { backgroundColor: "transparent", color: "#64748b", borderColor: "#252525" }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 font-medium mb-1.5">Notes (lien visio, contact, etc.)</label>
            <textarea value={interviewForm.notes} onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              rows={3} placeholder="https://meet.google.com/... ou nom du recruteur..."
              className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm outline-none resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[#1e1e1e]">
            <button onClick={() => setInterviewModal(false)}
              className="px-4 py-2.5 text-sm text-slate-400 hover:text-white border border-[#252525] rounded-xl transition-colors">
              Annuler
            </button>
            <button onClick={handleSaveInterview} disabled={!interviewForm.date || savingInterview}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ backgroundColor: "var(--accent)" }}>
              {savingInterview && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {editingInterview ? "Enregistrer" : "Programmer"}
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

// ─── Context menu item ────────────────────────────────────────────────────────

interface CtxItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  href?: string;
  active?: boolean;
  activeColor?: string;
  activeBg?: string;
  danger?: boolean;
}

function CtxItem({ icon, label, onClick, href, active, activeColor, activeBg, danger }: CtxItemProps) {
  const base = "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors text-left select-none";
  const style = active
    ? { color: activeColor, backgroundColor: activeBg }
    : danger
    ? undefined
    : undefined;

  const content = (
    <>
      <span className="w-4 flex items-center justify-center flex-shrink-0">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {active && <FiCheck size={11} className="flex-shrink-0" style={{ color: activeColor }} />}
    </>
  );

  const cls = `${base} ${active ? "" : danger ? "text-red-400 hover:bg-red-400/10" : "text-slate-400 hover:bg-[#1e1e1e] hover:text-white"}`;

  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={cls} style={style}>{content}</a>;
  }
  return <button onClick={onClick} className={cls} style={style}>{content}</button>;
}

// ─── Kanban card ──────────────────────────────────────────────────────────────

interface KanbanCardProps {
  card: JobApplication;
  isDragging: boolean;
  interviewCount: number;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

function KanbanCard({ card, isDragging, interviewCount, onOpen, onEdit, onDelete, onDragStart, onDragEnd, onContextMenu }: KanbanCardProps) {
  const status = JOB_STATUSES.find((s) => s.key === card.status)!;
  const relance = getRelanceStatus(card);
  const relanceBorder = relance.level === "alert" ? "#ef4444" : relance.level === "warning" ? "#f59e0b" : null;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.12 }}
      draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onOpen}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e); }}
      className="group bg-[#131313] border border-[#1c1c1c] hover:border-[#262626] rounded-xl p-2.5 cursor-pointer active:cursor-grabbing transition-all select-none"
      style={{ borderLeft: `2px solid ${relanceBorder ?? status.color + "40"}` }}
    >
      <div className="mb-1.5">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          {card.company && (
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide truncate leading-none flex-1">{card.company}</p>
          )}
          {card.priority && (() => {
            const cfg = PRIORITY_CONFIG[card.priority];
            const Icon = card.priority === "high" ? FiArrowUp : card.priority === "medium" ? FiMinus : FiArrowDown;
            return (
              <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] font-bold px-1 py-0.5 rounded" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                <Icon size={8} />{cfg.label}
              </span>
            );
          })()}
        </div>
        <p className="text-sm text-white font-semibold leading-snug truncate">{card.title || card.company}</p>
      </div>

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
          {card.aiAnalysis && <FiZap size={8} className="text-amber-500" />}
          {interviewCount > 0 && (
            <span className="flex items-center gap-0.5 text-amber-400">
              <FiCalendar size={8} />{interviewCount}
            </span>
          )}
          {relance.level && (
            <span className="flex items-center gap-0.5 font-semibold"
              style={{ color: relanceBorder ?? undefined }}>
              {relance.days}j
            </span>
          )}
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
  interviews: Interview[];
  experiences: Experience[];
  skills: SkillCategory[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  onStatusChange: (status: JobStatus) => void;
  onAddInterview: () => void;
  onEditInterview: (iv: Interview) => void;
  onDeleteInterview: (id: string) => void;
  onSendReminder: (iv: Interview) => void;
  sendingRemind: string | null;
}

function DetailDrawer({
  card, interviews, experiences, skills, onEdit, onDelete, onClose, onStatusChange,
  onAddInterview, onEditInterview, onDeleteInterview, onSendReminder, sendingRemind,
}: DetailDrawerProps) {
  const status = JOB_STATUSES.find((s) => s.key === card.status)!;
  const [imgOpen, setImgOpen] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "ai" | "interviews" | "prep">("details");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(card.aiAnalysis ?? null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  useEffect(() => { setAnalysis(card.aiAnalysis ?? null); }, [card.aiAnalysis]);

  const handleAnalyze = useCallback(async () => {
    if (analyzing) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const res = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: card.title, company: card.company, description: card.description }),
      });
      if (!res.ok) {
        const err = await res.json();
        setAnalyzeError(err.error ?? "Erreur inconnue");
        return;
      }
      const data: AIAnalysis = await res.json();
      data.analyzedAt = new Date().toISOString();
      setAnalysis(data);
      await updateJobApplication(card.id!, { aiAnalysis: data });
    } catch {
      setAnalyzeError("Impossible de contacter l'API");
    } finally {
      setAnalyzing(false);
    }
  }, [card, analyzing]);

  const upcomingInterviews = interviews.filter((iv) => new Date(`${iv.date}T${iv.time}`) >= new Date());
  const pastInterviews = interviews.filter((iv) => new Date(`${iv.date}T${iv.time}`) < new Date());

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
            <button
              onClick={() => exportJobToPDF(card, analysis)}
              title="Exporter en PDF"
              className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all">
              <FiPrinter size={14} />
            </button>
            <button onClick={onDelete} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
              <FiTrash2 size={14} />
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-all ml-1">
              <FiX size={14} />
            </button>
          </div>
        </div>

        {/* Relance banner */}
        {(() => {
          const rel = getRelanceStatus(card);
          if (!rel.level) return null;
          const isAlert = rel.level === "alert";
          return (
            <div className={`flex items-center justify-between gap-2 mb-3 px-3 py-2 rounded-xl border text-xs ${
              isAlert
                ? "bg-red-500/8 border-red-500/20 text-red-400"
                : "bg-amber-500/8 border-amber-500/20 text-amber-400"
            }`}>
              <span>
                Pas de réponse depuis <strong>{rel.days} jours</strong>
                {rel.days >= 14 && " — relance urgente"}
              </span>
              <button
                onClick={() => updateJobApplication(card.id!, { lastContactAt: new Date().toISOString(), relanceCount: (card.relanceCount ?? 0) + 1 })}
                className="flex-shrink-0 px-2 py-0.5 rounded-lg border font-medium transition-all hover:opacity-80"
                style={{ borderColor: isAlert ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)" }}>
                Marquer relancé
              </button>
            </div>
          );
        })()}

        {/* Quick status change */}
        <div className="flex flex-wrap gap-1.5 mb-3">
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

        {/* Inner tabs */}
        <div className="flex gap-0.5 bg-[#111] rounded-xl p-0.5 border border-[#1a1a1a]">
          {[
            { key: "details", label: "Détails", icon: <FiFileText size={11} /> },
            { key: "ai", label: "Analyse IA", icon: <FiZap size={11} />, badge: analysis ? "✓" : undefined },
            { key: "interviews", label: "Entretiens", icon: <FiCalendar size={11} />, badge: interviews.length > 0 ? String(interviews.length) : undefined },
            { key: "prep", label: "Préparer", icon: <FiHelpCircle size={11} /> },
          ].map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-medium transition-all relative ${
                activeTab === t.key ? "bg-[#1e1e1e] text-white" : "text-slate-500 hover:text-slate-300"
              }`}>
              {t.icon} {t.label}
              {t.badge && (
                <span className="absolute -top-1 -right-1 text-[9px] font-bold px-1 rounded-full"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 py-4 space-y-5">

        {/* ── Détails tab ── */}
        {activeTab === "details" && (
          <>
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

            {card.description && (
              <section>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FiZap size={9} /> Description
                </p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{card.description}</p>
              </section>
            )}

            {card.notes && (
              <section>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <FiMessageSquare size={9} /> Notes
                </p>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#131313] border border-[#1a1a1a] rounded-xl px-3 py-2.5">{card.notes}</p>
              </section>
            )}

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

            {!card.location && !card.description && !card.notes && card.screenshots.length === 0 && (card.documents ?? []).length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-slate-600 text-xs mb-2">Aucun détail renseigné</p>
                <button onClick={onEdit} className="text-xs underline text-slate-500 hover:text-slate-300 transition-colors">Compléter l'offre</button>
              </div>
            )}
          </>
        )}

        {/* ── Préparation entretien tab ── */}
        {activeTab === "prep" && (
          <InterviewPrepPanel card={card} />
        )}

        {/* ── Analyse IA tab ── */}
        {activeTab === "ai" && (
          <AIAnalysisPanel
            card={card}
            analysis={analysis}
            analyzing={analyzing}
            error={analyzeError}
            onAnalyze={handleAnalyze}
            experiences={experiences}
            skills={skills}
          />
        )}

        {/* ── Entretiens tab ── */}
        {activeTab === "interviews" && (
          <div className="space-y-4">
            <button onClick={onAddInterview}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent)" }}>
              <FiPlus size={14} /> Programmer un entretien
            </button>

            {upcomingInterviews.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">À venir</p>
                <div className="space-y-2">
                  {upcomingInterviews.map((iv) => (
                    <InterviewCard key={iv.id} interview={iv}
                      onEdit={() => onEditInterview(iv)}
                      onDelete={() => onDeleteInterview(iv.id!)}
                      onRemind={() => onSendReminder(iv)}
                      sendingRemind={sendingRemind === iv.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastInterviews.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Passés</p>
                <div className="space-y-2 opacity-60">
                  {pastInterviews.map((iv) => (
                    <InterviewCard key={iv.id} interview={iv}
                      onEdit={() => onEditInterview(iv)}
                      onDelete={() => onDeleteInterview(iv.id!)}
                      onRemind={() => {}}
                      sendingRemind={false}
                      past
                    />
                  ))}
                </div>
              </div>
            )}

            {interviews.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <FiCalendar size={28} className="text-slate-700 mb-2" />
                <p className="text-slate-500 text-sm">Aucun entretien planifié</p>
                <p className="text-slate-600 text-xs mt-1">Clique sur "Programmer" pour ajouter un entretien</p>
              </div>
            )}
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

// ─── Interview Card ───────────────────────────────────────────────────────────

interface InterviewCardProps {
  interview: Interview;
  onEdit: () => void;
  onDelete: () => void;
  onRemind: () => void;
  sendingRemind: boolean;
  past?: boolean;
}

function InterviewCard({ interview, onEdit, onDelete, onRemind, sendingRemind, past }: InterviewCardProps) {
  const typeInfo = INTERVIEW_TYPES.find((t) => t.key === interview.type)!;
  return (
    <div className="bg-[#131313] border border-[#1e1e1e] rounded-xl px-3.5 py-3 group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            {typeInfo?.icon}
            <span>{typeInfo?.label}</span>
          </div>
          <p className="text-sm font-semibold text-white">{formatInterviewDate(interview.date, interview.time)}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!past && (
            <button onClick={onRemind} disabled={sendingRemind}
              className="p-1.5 text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all disabled:opacity-50"
              title="Envoyer un rappel (email + push)">
              {sendingRemind ? <FiLoader size={12} className="animate-spin" /> : <FiBell size={12} />}
            </button>
          )}
          <button onClick={onEdit} className="p-1.5 text-slate-500 hover:text-white hover:bg-[#1e1e1e] rounded-lg transition-all">
            <FiEdit2 size={12} />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>
      {interview.notes && (
        <p className="text-xs text-slate-500 truncate">{interview.notes}</p>
      )}
    </div>
  );
}

// ─── AI Analysis Panel ────────────────────────────────────────────────────────

interface AIAnalysisPanelProps {
  card: JobApplication;
  analysis: AIAnalysis | null;
  analyzing: boolean;
  error: string | null;
  onAnalyze: () => void;
  experiences: Experience[];
  skills: SkillCategory[];
}

function AIAnalysisPanel({ card, analysis, analyzing, error, onAnalyze, experiences, skills }: AIAnalysisPanelProps) {
  const [compat, setCompat] = useState<CompatibilityResult | null>(analysis?.compatibility ?? null);
  const [loadingCompat, setLoadingCompat] = useState(false);
  const [compatError, setCompatError] = useState<string | null>(null);

  const [coverLetter, setCoverLetter] = useState<string>(card.coverLetter ?? "");
  const [loadingLetter, setLoadingLetter] = useState(false);
  const [letterError, setLetterError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [relanceContent, setRelanceContent] = useState<string>("");
  const [loadingRelance, setLoadingRelance] = useState(false);
  const [relanceOpen, setRelanceOpen] = useState(false);

  useEffect(() => {
    setCompat(analysis?.compatibility ?? null);
    setCoverLetter(card.coverLetter ?? "");
  }, [card.id, analysis?.compatibility, card.coverLetter]);

  const profile = { experiences, skills };

  const handleCompat = async () => {
    setLoadingCompat(true);
    setCompatError(null);
    try {
      const res = await fetch("/api/jobs/compat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: { title: card.title, company: card.company, description: card.description }, profile }),
      });
      if (!res.ok) { setCompatError("Erreur API"); return; }
      const data: CompatibilityResult = await res.json();
      setCompat(data);
      const newAnalysis = { ...(analysis ?? {} as AIAnalysis), compatibility: data };
      await updateJobApplication(card.id!, { aiAnalysis: newAnalysis });
    } catch { setCompatError("Impossible de contacter l'API"); }
    finally { setLoadingCompat(false); }
  };

  const handleCoverLetter = async () => {
    setLoadingLetter(true);
    setLetterError(null);
    try {
      const res = await fetch("/api/jobs/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "letter",
          job: { title: card.title, company: card.company, description: card.description, location: card.location },
          profile,
        }),
      });
      if (!res.ok) { setLetterError("Erreur API"); return; }
      const { content } = await res.json();
      setCoverLetter(content);
      await updateJobApplication(card.id!, { coverLetter: content, coverLetterGeneratedAt: new Date().toISOString() });
    } catch { setLetterError("Impossible de contacter l'API"); }
    finally { setLoadingLetter(false); }
  };

  const handleRelanceEmail = async () => {
    setLoadingRelance(true);
    const { days } = getRelanceStatus(card);
    try {
      const res = await fetch("/api/jobs/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "relance",
          job: { title: card.title, company: card.company, description: card.description },
          relanceContext: { days: days || 7 },
        }),
      });
      if (!res.ok) return;
      const { content } = await res.json();
      setRelanceContent(content);
      setRelanceOpen(true);
    } catch { /* silent */ }
    finally { setLoadingRelance(false); }
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const scoreColor = (n: number) => n >= 70 ? "#10b981" : n >= 45 ? "#f59e0b" : "#ef4444";

  if (!card.description && !card.title) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FiZap size={28} className="text-slate-700 mb-3" />
        <p className="text-slate-500 text-sm font-medium">Description requise</p>
        <p className="text-slate-600 text-xs mt-1">Ajoute une description à l'offre pour l'analyser avec l'IA</p>
      </div>
    );
  }

  if (!analysis && !analyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          <FiZap size={24} className="text-amber-400" />
        </div>
        <p className="text-white font-semibold text-base mb-1">Analyse Mistral AI</p>
        <p className="text-slate-500 text-xs mb-6 max-w-[280px] leading-relaxed">
          Résumé, compétences, roadmap, compatibilité et lettre de motivation générés par l'IA.
        </p>
        {error && <p className="text-red-400 text-xs mb-4 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
        <button onClick={onAnalyze}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}>
          <FiZap size={14} /> Analyser avec l'IA
        </button>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-amber-400/20 border-t-amber-400 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Mistral analyse l'offre…</p>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-slate-600">
          {analysis.analyzedAt ? `Analysé le ${new Date(analysis.analyzedAt).toLocaleDateString("fr-FR")}` : ""}
        </p>
        <button onClick={onAnalyze} disabled={analyzing}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-amber-400 border border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-400/5 transition-all disabled:opacity-50">
          <FiZap size={9} /> Ré-analyser
        </button>
      </div>

      {/* Summary */}
      <section className="bg-[#131313] border border-[#1e1e1e] rounded-xl p-4">
        <p className="text-[10px] text-amber-400/70 font-semibold uppercase tracking-widest mb-2">Résumé</p>
        <p className="text-sm text-slate-300 leading-relaxed">{analysis.summary}</p>
        {analysis.salary_estimate && (
          <div className="mt-3 pt-3 border-t border-[#1e1e1e]">
            <span className="text-xs text-emerald-400 font-medium">{analysis.salary_estimate}</span>
          </div>
        )}
      </section>

      {/* Skills */}
      <section>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Compétences requises</p>
        <div className="flex flex-wrap gap-1.5">
          {analysis.skills_required.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">{s}</span>
          ))}
        </div>
      </section>

      {analysis.skills_nice.length > 0 && (
        <section>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Compétences bonus</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.skills_nice.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1a1a1a] text-slate-400 border border-[#252525]">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Roadmap */}
      {analysis.roadmap.length > 0 && (
        <section>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-3">Roadmap pour décrocher le poste</p>
          <div className="space-y-2">
            {analysis.roadmap.map((step) => (
              <div key={step.step} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-bold mt-0.5"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)", backgroundColor: "rgba(var(--accent-rgb),0.1)" }}>
                  {step.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-0.5">{step.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {analysis.tips.length > 0 && (
        <section>
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Conseils pour réussir</p>
          <ul className="space-y-1.5">
            {analysis.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Score de compatibilité ── */}
      <section className="border-t border-[#1e1e1e] pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Score de compatibilité</p>
          {compat && (
            <button onClick={handleCompat} disabled={loadingCompat}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-500 border border-[#252525] hover:border-[#333] hover:text-slate-300 transition-all disabled:opacity-40">
              {loadingCompat ? <FiLoader size={9} className="animate-spin" /> : <FiZap size={9} />} Recalculer
            </button>
          )}
        </div>

        {!compat && !loadingCompat && (
          <div className="bg-[#131313] border border-[#1e1e1e] rounded-xl p-4 text-center">
            <p className="text-slate-500 text-xs mb-3">Compare ton profil avec cette offre</p>
            {compatError && <p className="text-red-400 text-xs mb-3">{compatError}</p>}
            <button onClick={handleCompat}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent)" }}>
              <FiZap size={11} /> Calculer la compatibilité
            </button>
          </div>
        )}

        {loadingCompat && (
          <div className="flex items-center justify-center gap-2 py-6 text-slate-500 text-xs">
            <FiLoader size={12} className="animate-spin" /> Analyse en cours…
          </div>
        )}

        {compat && !loadingCompat && (
          <div className="space-y-3">
            {/* Score gauge */}
            <div className="bg-[#131313] border border-[#1e1e1e] rounded-xl p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e1e" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3"
                      strokeDasharray={`${compat.score} ${100 - compat.score}`}
                      strokeLinecap="round"
                      style={{ stroke: scoreColor(compat.score), transition: "stroke-dasharray 0.6s ease" }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                    style={{ color: scoreColor(compat.score) }}>
                    {compat.score}%
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {compat.score >= 70 ? "Excellent match" : compat.score >= 45 ? "Match partiel" : "Match faible"}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{compat.recommendation}</p>
                </div>
              </div>
            </div>

            {compat.strengths.length > 0 && (
              <div>
                <p className="text-[10px] text-emerald-400/70 font-semibold uppercase tracking-widest mb-1.5">Points forts</p>
                <ul className="space-y-1">
                  {compat.strengths.map((s, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400 flex-shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {compat.gaps.length > 0 && (
              <div>
                <p className="text-[10px] text-red-400/70 font-semibold uppercase tracking-widest mb-1.5">Lacunes</p>
                <ul className="space-y-1">
                  {compat.gaps.map((g, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-red-400 flex-shrink-0">✗</span>{g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── Lettre de motivation ── */}
      <section className="border-t border-[#1e1e1e] pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Lettre de motivation</p>
          {coverLetter && (
            <div className="flex gap-1">
              <button onClick={() => copyText(coverLetter)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-400 border border-[#252525] hover:border-[#333] hover:text-white transition-all">
                {copied ? <FiCheck size={9} className="text-emerald-400" /> : <FiClipboard size={9} />}
                {copied ? "Copié !" : "Copier"}
              </button>
              <button onClick={() => downloadTxt(coverLetter, `LDM-${card.company}-${card.title}.txt`)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-400 border border-[#252525] hover:border-[#333] hover:text-white transition-all">
                <FiDownload size={9} /> .txt
              </button>
            </div>
          )}
        </div>

        {!coverLetter && !loadingLetter && (
          <div className="bg-[#131313] border border-[#1e1e1e] rounded-xl p-4 text-center">
            <p className="text-slate-500 text-xs mb-3">Génère une lettre personnalisée avec ton profil</p>
            {letterError && <p className="text-red-400 text-xs mb-3">{letterError}</p>}
            <button onClick={handleCoverLetter}
              className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--accent)" }}>
              <FiFileText size={11} /> Générer la lettre
            </button>
          </div>
        )}

        {loadingLetter && (
          <div className="flex items-center justify-center gap-2 py-6 text-slate-500 text-xs">
            <FiLoader size={12} className="animate-spin" /> Rédaction en cours…
          </div>
        )}

        {coverLetter && !loadingLetter && (
          <div className="space-y-2">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={12}
              className="w-full bg-[#0d0d0d] border border-[#1e1e1e] text-slate-300 text-xs leading-relaxed rounded-xl px-3 py-3 outline-none resize-none focus:border-[#2a2a2a]"
            />
            <button onClick={handleCoverLetter} disabled={loadingLetter}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-slate-500 border border-[#252525] hover:border-[#333] hover:text-slate-300 transition-all disabled:opacity-40">
              <FiZap size={9} /> Régénérer
            </button>
          </div>
        )}
      </section>

      {/* ── Email de relance ── */}
      {(card.status === "applied" || card.status === "interview") && (
        <section className="border-t border-[#1e1e1e] pt-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest">Email de relance</p>
          </div>

          {!relanceOpen && (
            <button onClick={handleRelanceEmail} disabled={loadingRelance}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium border border-[#252525] text-slate-400 hover:text-white hover:border-[#333] transition-all disabled:opacity-40">
              {loadingRelance ? <FiLoader size={11} className="animate-spin" /> : <FiMessageSquare size={11} />}
              {loadingRelance ? "Génération…" : "Générer un email de relance"}
            </button>
          )}

          {relanceOpen && relanceContent && (
            <div className="space-y-2">
              <textarea
                value={relanceContent}
                onChange={(e) => setRelanceContent(e.target.value)}
                rows={6}
                className="w-full bg-[#0d0d0d] border border-[#1e1e1e] text-slate-300 text-xs leading-relaxed rounded-xl px-3 py-3 outline-none resize-none focus:border-[#2a2a2a]"
              />
              <div className="flex gap-2">
                <button onClick={() => copyText(relanceContent)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 border border-[#252525] hover:border-[#333] hover:text-white transition-all">
                  {copied ? <FiCheck size={9} className="text-emerald-400" /> : <FiClipboard size={9} />}
                  {copied ? "Copié !" : "Copier"}
                </button>
                <a href={`mailto:?subject=Relance%20-%20${encodeURIComponent(card.title)}%20@%20${encodeURIComponent(card.company)}&body=${encodeURIComponent(relanceContent)}`}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-400 border border-[#252525] hover:border-[#333] hover:text-white transition-all">
                  <FiExternalLink size={9} /> Ouvrir dans mail
                </a>
                <button onClick={handleRelanceEmail} disabled={loadingRelance}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-500 border border-[#252525] hover:border-[#333] hover:text-slate-300 transition-all ml-auto disabled:opacity-40">
                  <FiZap size={9} /> Régénérer
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ─── Interview Calendar ───────────────────────────────────────────────────────

interface InterviewCalendarProps {
  interviews: Interview[];
  applications: JobApplication[];
  onAddInterview: (jobId: string) => void;
  onEditInterview: (iv: Interview) => void;
  onDeleteInterview: (id: string) => void;
  onSendReminder: (iv: Interview) => void;
  sendingRemind: string | null;
}

function InterviewCalendar({
  interviews, applications, onAddInterview, onEditInterview, onDeleteInterview, onSendReminder, sendingRemind,
}: InterviewCalendarProps) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const monthInterviews = interviews.filter((iv) => {
    const d = new Date(iv.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const dayInterviewMap: Record<string, Interview[]> = {};
  for (const iv of monthInterviews) {
    const sorted = dayInterviewMap[iv.date] ?? [];
    sorted.push(iv);
    sorted.sort((a, b) => a.time.localeCompare(b.time));
    dayInterviewMap[iv.date] = sorted;
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const upcomingAll = interviews
    .filter((iv) => new Date(`${iv.date}T${iv.time}`) >= new Date())
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 4);

  const typeColors: Record<InterviewType, string> = {
    phone: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    video: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    onsite: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    technical: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:h-full min-h-0">

      {/* Left — calendar */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

      {/* Month nav */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button onClick={prevMonth} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
          <FiChevronLeft size={15} />
        </button>
        <h2 className="text-white font-semibold text-sm capitalize">{monthName}</h2>
        <button onClick={nextMonth} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a1a1a] transition-all">
          <FiChevronRight size={15} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[#1a1a1a] pb-2 flex-shrink-0">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-[9px] sm:text-[10px] font-semibold text-slate-600 uppercase">{d}</div>
        ))}
      </div>

      {/* Calendar grid — events inside cells */}
      <div className="sm:flex-1 grid grid-cols-7 grid-rows-6 gap-px bg-[#181818] rounded-2xl overflow-hidden border border-[#1a1a1a]" style={{ minHeight: "260px" }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-[#0d0d0d]" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayIvs = dayInterviewMap[dateStr] ?? [];
          const isToday = dateStr === todayStr;
          const isHovered = hoveredDay === dateStr;
          const isPast = dateStr < todayStr;
          const isWeekend = ((firstDayOfWeek + i) % 7) >= 5;

          return (
            <div
              key={day}
              className={`relative flex flex-col p-0.5 sm:p-1.5 transition-colors ${
                isPast ? "bg-[#0a0a0a]" : isWeekend ? "bg-[#0e0e0e]" : "bg-[#0d0d0d]"
              } ${isHovered ? "bg-[#141414]" : ""}`}
              onMouseEnter={() => setHoveredDay(dateStr)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span
                  className={`text-[9px] sm:text-[11px] font-semibold w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center rounded-full flex-shrink-0 ${
                    isToday ? "text-white" : isPast ? "text-slate-700" : "text-slate-400"
                  }`}
                  style={isToday ? { backgroundColor: "var(--accent)" } : {}}
                >
                  {day}
                </span>
                {isHovered && !isPast && (
                  <button
                    onClick={() => applications.length > 0 && onAddInterview(applications[0].id!)}
                    className="hidden sm:flex w-4 h-4 items-center justify-center rounded text-slate-600 hover:text-white hover:bg-[#252525] transition-all"
                  >
                    <FiPlus size={10} />
                  </button>
                )}
              </div>

              {/* Events — hide label text on mobile, show only colored dot */}
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayIvs.slice(0, 2).map((iv) => {
                  const app = applications.find((a) => a.id === iv.jobId);
                  const label = iv.company || app?.company || iv.title || app?.title || "Entretien";
                  return (
                    <button
                      key={iv.id}
                      onClick={(e) => { e.stopPropagation(); onEditInterview(iv); }}
                      className={`group/chip w-full flex items-center gap-1 px-0.5 sm:px-1.5 py-0.5 rounded text-[10px] font-medium border truncate text-left transition-opacity hover:opacity-80 ${typeColors[iv.type]}`}
                    >
                      <span className="hidden sm:inline flex-shrink-0 opacity-70">{iv.time}</span>
                      <span className="hidden sm:inline truncate">{label}</span>
                      {/* Mobile: just a colored dot */}
                      <span className="sm:hidden w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "currentColor" }} />
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteInterview(iv.id!); }}
                        className="hidden sm:block ml-auto flex-shrink-0 opacity-0 group-hover/chip:opacity-100 transition-opacity text-current hover:opacity-60"
                      >
                        <FiX size={8} />
                      </button>
                    </button>
                  );
                })}
                {dayIvs.length > 2 && (
                  <span className="hidden sm:block text-[9px] text-slate-600 pl-1">+{dayIvs.length - 2}</span>
                )}
                {dayIvs.length > 2 && (
                  <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-slate-600 self-start ml-0.5" />
                )}
              </div>
            </div>
          );
        })}

        {/* Fill remaining cells to complete the 6-row grid */}
        {Array.from({ length: 42 - firstDayOfWeek - daysInMonth }).map((_, i) => (
          <div key={`end-${i}`} className="bg-[#0a0a0a]" />
        ))}
      </div>

      </div> {/* end left column */}

      {/* Right — upcoming sidebar (scrollable on mobile as horizontal pills, vertical on desktop) */}
      <div className="sm:w-52 flex-shrink-0 flex sm:flex-col flex-row flex-wrap sm:flex-nowrap gap-2 sm:overflow-y-auto no-scrollbar overflow-x-auto pb-1 sm:pb-0">
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest flex-shrink-0 hidden sm:block">À venir</p>

        {upcomingAll.length === 0 && (
          <div className="hidden sm:flex flex-col items-center justify-center text-center py-8 flex-1">
            <FiCalendar size={22} className="text-slate-700 mb-2" />
            <p className="text-slate-600 text-xs">Aucun entretien à venir</p>
          </div>
        )}

        {upcomingAll.map((iv) => {
          const app = applications.find((a) => a.id === iv.jobId);
          const d = new Date(`${iv.date}T${iv.time}`);
          const diffDays = Math.ceil((d.getTime() - Date.now()) / 86400000);
          const typeInfo = INTERVIEW_TYPES.find((t) => t.key === iv.type);
          return (
            <div key={iv.id}
              className="bg-[#131313] border border-[#1e1e1e] hover:border-[#252525] rounded-xl group transition-colors flex-shrink-0
                         sm:w-auto sm:px-3 sm:py-2.5
                         px-2.5 py-2 min-w-[140px] max-w-[160px] sm:max-w-none">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">{typeInfo?.icon} <span className="hidden sm:inline">{typeInfo?.label}</span></span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  diffDays <= 1 ? "bg-red-500/15 text-red-400" :
                  diffDays <= 3 ? "bg-amber-500/15 text-amber-400" :
                  "bg-slate-700/20 text-slate-500"
                }`}>
                  {diffDays === 0 ? "Auj." : diffDays === 1 ? "Dem." : `J-${diffDays}`}
                </span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{iv.title || app?.title}</p>
              <p className="text-[10px] text-slate-500 truncate">{iv.company || app?.company}</p>
              <p className="text-[10px] text-slate-600 mt-1">
                {d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {iv.time}
              </p>
              <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onSendReminder(iv)} disabled={sendingRemind === iv.id}
                  className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] text-amber-400 border border-amber-400/20 hover:border-amber-400/40 transition-all disabled:opacity-50">
                  {sendingRemind === iv.id ? <FiLoader size={9} className="animate-spin" /> : <FiBell size={9} />} Rappel
                </button>
                <button onClick={() => onEditInterview(iv)}
                  className="p-1 text-slate-500 hover:text-white hover:bg-[#1e1e1e] rounded-lg transition-all">
                  <FiEdit2 size={10} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

interface DashboardViewProps {
  applications: JobApplication[];
  interviews: Interview[];
  tabs: JobBoardTab[];
}

function DashboardView({ applications, interviews, tabs }: DashboardViewProps) {
  const total = applications.length;
  const byStatus = JOB_STATUSES.map((s) => ({
    ...s,
    count: applications.filter((a) => a.status === s.key).length,
  }));

  const appliedCount = applications.filter((a) => ["applied", "interview", "offer"].includes(a.status)).length;
  const interviewCount = applications.filter((a) => ["interview", "offer"].includes(a.status)).length;
  const offerCount = applications.filter((a) => a.status === "offer").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  const relanceAlerts = applications.filter((a) => getRelanceStatus(a).level === "alert").length;
  const relanceWarnings = applications.filter((a) => getRelanceStatus(a).level === "warning").length;

  const upcomingCount = interviews.filter((iv) => new Date(`${iv.date}T${iv.time}`) >= new Date()).length;
  const responseRate = appliedCount > 0 ? Math.round((interviewCount / appliedCount) * 100) : 0;

  const tabStats = tabs.map((tab) => ({
    ...tab,
    count: applications.filter((a) => a.tabId === tab.id).length,
    interviews: interviews.filter((iv) =>
      applications.some((a) => a.tabId === tab.id && a.id === iv.jobId)
    ).length,
  }));

  const funnel = [
    { label: "Wishlist",   value: byStatus.find(s => s.key === "wishlist")?.count ?? 0,  color: "#8b5cf6" },
    { label: "Postulé",    value: appliedCount,   color: "#3b82f6" },
    { label: "Entretien",  value: interviewCount, color: "#f59e0b" },
    { label: "Offre",      value: offerCount,     color: "#10b981" },
  ];
  const funnelMax = Math.max(...funnel.map((f) => f.value), 1);

  return (
    <div className="px-3 sm:px-5 py-4 sm:py-5 space-y-4 sm:space-y-6">

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: "Candidatures", value: total, icon: <FiClipboard size={14} />, color: "var(--accent)" },
          { label: "Entretiens",   value: interviewCount, icon: <FiCalendar size={14} />, color: "#f59e0b" },
          { label: "Offres",       value: offerCount, icon: <FiTarget size={14} />, color: "#10b981" },
          { label: "Taux réponse", value: `${responseRate}%`, icon: <FiTrendingUp size={14} />, color: "#3b82f6" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="text-xs text-slate-500">{kpi.label}</span>
              <span style={{ color: kpi.color }}>{kpi.icon}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

        {/* Status breakdown */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-4">Répartition par statut</p>
          {total === 0 ? (
            <p className="text-slate-600 text-xs text-center py-4">Aucune candidature</p>
          ) : (
            <div className="space-y-3">
              {byStatus.map((s) => (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">{s.label}</span>
                  <div className="flex-1 bg-[#1a1a1a] rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="text-xs font-bold w-5 text-right" style={{ color: s.color }}>{s.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Funnel */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-4">Entonnoir de conversion</p>
          {total === 0 ? (
            <p className="text-slate-600 text-xs text-center py-4">Aucune candidature</p>
          ) : (
            <div className="space-y-2">
              {funnel.map((f, i) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-20 flex-shrink-0">{f.label}</span>
                  <div className="flex-1 bg-[#1a1a1a] rounded-sm h-5 overflow-hidden relative">
                    <div className="h-full rounded-sm transition-all duration-700 flex items-center"
                      style={{ width: `${(f.value / funnelMax) * 100}%`, backgroundColor: f.color + "30", borderLeft: `3px solid ${f.color}` }}>
                    </div>
                  </div>
                  <span className="text-xs font-bold w-5 text-right text-slate-300">{f.value}</span>
                  {i > 0 && funnel[i - 1].value > 0 && (
                    <span className="text-[10px] text-slate-600 w-9 text-right">
                      {Math.round((f.value / funnel[i - 1].value) * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

        {/* Relance alerts */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-3">Relances</p>
          {relanceAlerts === 0 && relanceWarnings === 0 ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
              <FiCheck size={13} /> Toutes les candidatures sont à jour
            </div>
          ) : (
            <div className="space-y-2">
              {relanceAlerts > 0 && (
                <div className="flex items-center justify-between bg-red-500/8 border border-red-500/20 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-red-400 font-medium">Relances urgentes</span>
                  <span className="text-sm font-bold text-red-400">{relanceAlerts}</span>
                </div>
              )}
              {relanceWarnings > 0 && (
                <div className="flex items-center justify-between bg-amber-500/8 border border-amber-500/20 rounded-xl px-3 py-2.5">
                  <span className="text-xs text-amber-400 font-medium">À relancer bientôt</span>
                  <span className="text-sm font-bold text-amber-400">{relanceWarnings}</span>
                </div>
              )}
              {rejectedCount > 0 && (
                <div className="flex items-center justify-between bg-[#131313] border border-[#1e1e1e] rounded-xl px-3 py-2.5">
                  <span className="text-xs text-slate-500">Refusées</span>
                  <span className="text-sm font-bold text-slate-500">{rejectedCount}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming interviews + per tab */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-3">Entretiens à venir · {upcomingCount}</p>
          {upcomingCount === 0 ? (
            <p className="text-slate-600 text-xs py-2">Aucun entretien planifié</p>
          ) : (
            <div className="space-y-1.5">
              {interviews
                .filter((iv) => new Date(`${iv.date}T${iv.time}`) >= new Date())
                .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
                .slice(0, 4)
                .map((iv) => {
                  const d = new Date(`${iv.date}T${iv.time}`);
                  return (
                    <div key={iv.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate">{iv.company} — {iv.title}</span>
                      <span className="text-slate-500 flex-shrink-0 ml-2">
                        {d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Per tab breakdown */}
      {tabStats.length > 1 && (
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-3">Par onglet</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tabStats.map((tab) => (
              <div key={tab.id} className="bg-[#131313] border border-[#1e1e1e] rounded-xl px-3 py-2.5">
                <p className="text-xs font-semibold text-white truncate mb-1">{tab.name}</p>
                <p className="text-[11px] text-slate-500">{tab.count} offre{tab.count !== 1 ? "s" : ""}
                  {tab.interviews > 0 && <span className="text-amber-400 ml-2">{tab.interviews} entretien{tab.interviews !== 1 ? "s" : ""}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Interview Prep Panel ─────────────────────────────────────────────────────

interface InterviewPrep {
  pitch: string;
  questions: string[];
  answers_tips: string[];
  questions_to_ask: string[];
  tips: string[];
}

function InterviewPrepPanel({ card }: { card: JobApplication }) {
  const [interviewType, setInterviewType] = useState<InterviewType>("phone");
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openQ, setOpenQ] = useState<number | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: { title: card.title, company: card.company, description: card.description },
          interviewType,
        }),
      });
      if (!res.ok) { setError("Erreur API"); return; }
      setPrep(await res.json());
    } catch { setError("Impossible de contacter l'API"); }
    finally { setLoading(false); }
  };

  const copyPitch = () => {
    if (!prep) return;
    navigator.clipboard.writeText(prep.pitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div>
        <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Type d&apos;entretien</p>
        <div className="flex flex-wrap gap-1.5">
          {INTERVIEW_TYPES.map((t) => (
            <button key={t.key} onClick={() => setInterviewType(t.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                interviewType === t.key
                  ? "text-white border-[rgba(var(--accent-rgb),0.4)]"
                  : "text-slate-500 border-[#1e1e1e] hover:text-slate-300 hover:border-[#2a2a2a]"
              }`}
              style={interviewType === t.key ? { backgroundColor: "rgba(var(--accent-rgb),0.12)", borderColor: "rgba(var(--accent-rgb),0.4)" } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      {!prep && !loading && (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <FiHelpCircle size={22} className="text-blue-400" />
          </div>
          <p className="text-white font-semibold text-sm mb-1">Prépare ton entretien</p>
          <p className="text-slate-500 text-xs mb-5 max-w-[260px] leading-relaxed">
            Questions fréquentes, pitch, conseils personnalisés et questions à poser.
          </p>
          {error && <p className="text-red-400 text-xs mb-3 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
          <button onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
            <FiHelpCircle size={14} /> Générer la préparation
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin mb-4" />
          <p className="text-slate-400 text-sm">Préparation en cours…</p>
        </div>
      )}

      {prep && !loading && (
        <>
          {/* Regen + type reminder */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 capitalize">
              {INTERVIEW_TYPES.find((t) => t.key === interviewType)?.label}
            </span>
            <button onClick={handleGenerate} disabled={loading}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] text-blue-400 border border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/5 transition-all disabled:opacity-50">
              <FiZap size={9} /> Régénérer
            </button>
          </div>

          {/* Pitch */}
          <section className="bg-[#131313] border border-[#1e1e1e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-blue-400/70 font-semibold uppercase tracking-widest">Pitch 30 secondes</p>
              <button onClick={copyPitch}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-slate-400 border border-[#252525] hover:border-[#333] hover:text-white transition-all">
                {copiedPitch ? <FiCheck size={9} className="text-emerald-400" /> : <FiClipboard size={9} />}
                {copiedPitch ? "Copié !" : "Copier"}
              </button>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{prep.pitch}&rdquo;</p>
          </section>

          {/* Questions accordion */}
          <section>
            <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Questions fréquentes</p>
            <div className="space-y-1.5">
              {prep.questions.map((q, i) => (
                <div key={i} className="border border-[#1e1e1e] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenQ(openQ === i ? null : i)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left bg-[#131313] hover:bg-[#161616] transition-colors">
                    <span className="text-xs text-slate-300 leading-snug">{q}</span>
                    <FiChevronRight size={11} className={`flex-shrink-0 text-slate-600 transition-transform ${openQ === i ? "rotate-90" : ""}`} />
                  </button>
                  {openQ === i && prep.answers_tips[i] && (
                    <div className="px-3 pb-3 pt-1 bg-[#0f0f0f] border-t border-[#1e1e1e]">
                      <p className="text-[11px] text-amber-400/80 font-semibold uppercase tracking-widest mb-1">Conseil</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{prep.answers_tips[i]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          {prep.tips.length > 0 && (
            <section>
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Conseils pratiques</p>
              <ul className="space-y-1.5">
                {prep.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                    <span className="text-blue-400 flex-shrink-0 mt-0.5">→</span>{tip}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Questions to ask */}
          {prep.questions_to_ask.length > 0 && (
            <section>
              <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-widest mb-2">Questions à poser</p>
              <ul className="space-y-1.5">
                {prep.questions_to_ask.map((q, i) => (
                  <li key={i} className="flex gap-2 text-xs text-slate-400 leading-relaxed">
                    <span className="text-emerald-400 flex-shrink-0 mt-0.5">?</span>{q}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
