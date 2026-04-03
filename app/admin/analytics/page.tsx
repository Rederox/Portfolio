"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiEye, FiDownload, FiMail, FiGithub, FiLinkedin,
  FiFolder, FiClock, FiRefreshCw, FiInfo,
} from "react-icons/fi";
import { getSummary, type AnalyticsSummary } from "@/lib/analytics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60)  return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function formatAvgDuration(totalSeconds: number, visits: number): string {
  if (!visits) return "—";
  return formatDuration(Math.round(totalSeconds / visits));
}

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={
          accent
            ? { backgroundColor: "rgba(var(--accent-rgb),0.12)", border: "1px solid rgba(var(--accent-rgb),0.22)" }
            : { backgroundColor: "#161616", border: "1px solid #222" }
        }
      >
        <Icon size={16} style={accent ? { color: "var(--accent)" } : { color: "#555" }} />
      </div>

      <div>
        <p className="text-slate-500 text-[0.7rem] font-medium mb-0.5">{label}</p>
        <p
          className="font-display font-extrabold text-3xl leading-none"
          style={accent ? { color: "var(--accent)" } : { color: "white" }}
        >
          {value}
        </p>
        {sub && <p className="text-slate-600 text-[0.65rem] mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Bar metric ───────────────────────────────────────────────────────────────

function BarMetric({
  label,
  value,
  max,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number;
  max: number;
  icon: React.ElementType;
  delay?: number;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-4"
    >
      <div className="w-8 h-8 bg-[#161616] border border-[#1e1e1e] rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-slate-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-slate-300 text-sm font-medium">{label}</p>
          <p className="text-white font-bold text-sm font-mono">{value}</p>
        </div>
        <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const load = async () => {
    setLoading(true);
    const summary = await getSummary();
    setData(summary);
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { load(); }, []);

  const clicks = data
    ? Math.max(
        data.totalCVDownloads,
        data.totalContactClicks,
        data.totalGithubClicks,
        data.totalLinkedinClicks,
        data.totalProjectClicks,
        data.totalEmailClicks,
        1,
      )
    : 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Analytics</h1>
          <p className="text-slate-400 text-sm">
            Statistiques en temps réel de ton portfolio.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl px-4 py-2 transition-all disabled:opacity-40"
        >
          <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Rafraîchir
        </button>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-600 text-sm flex items-center gap-2">
            <FiRefreshCw size={14} className="animate-spin" /> Chargement…
          </div>
        </div>
      ) : !data ? (
        <div className="text-center py-20">
          <p className="text-slate-600 text-sm">Aucune donnée disponible.</p>
          <p className="text-slate-700 text-xs mt-2">
            Les stats s'enregistrent automatiquement à chaque visite du portfolio.
          </p>
        </div>
      ) : (
        <>
          {/* ── KPI grid ───────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={FiEye}
              label="Visites totales"
              value={data.totalVisits.toLocaleString("fr-FR")}
              accent
              delay={0}
            />
            <StatCard
              icon={FiClock}
              label="Durée moy. de visite"
              value={formatAvgDuration(data.totalTimeSeconds, data.totalVisits)}
              sub={`${formatDuration(data.totalTimeSeconds)} cumulées`}
              delay={0.05}
            />
            <StatCard
              icon={FiDownload}
              label="CV téléchargés"
              value={data.totalCVDownloads}
              sub={data.totalVisits ? `${Math.round((data.totalCVDownloads / data.totalVisits) * 100)}% des visiteurs` : undefined}
              delay={0.1}
            />
            <StatCard
              icon={FiFolder}
              label="Projets consultés"
              value={data.totalProjectClicks}
              delay={0.15}
            />
          </div>

          {/* ── Interactions breakdown ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-6 mb-6"
          >
            <p className="text-white font-semibold mb-5 text-sm">Interactions</p>
            <div className="flex flex-col gap-5">
              <BarMetric icon={FiDownload}  label="CV téléchargés"       value={data.totalCVDownloads}    max={clicks} delay={0.25} />
              <BarMetric icon={FiMail}      label="Clics sur Contact"     value={data.totalContactClicks}  max={clicks} delay={0.3} />
              <BarMetric icon={FiMail}      label="Clics sur Email"       value={data.totalEmailClicks}    max={clicks} delay={0.35} />
              <BarMetric icon={FiGithub}    label="Clics GitHub"          value={data.totalGithubClicks}   max={clicks} delay={0.4} />
              <BarMetric icon={FiLinkedin}  label="Clics LinkedIn"        value={data.totalLinkedinClicks} max={clicks} delay={0.45} />
              <BarMetric icon={FiFolder}    label="Ouvertures de projets" value={data.totalProjectClicks}  max={clicks} delay={0.5} />
            </div>
          </motion.div>

          {/* ── Info banner ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-start gap-3 bg-[#111] border border-[#1e1e1e] rounded-xl p-4 text-xs text-slate-500"
          >
            <FiInfo size={14} className="flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                Dernière mise à jour : <span className="text-slate-400">{formatDate(data.lastUpdated)}</span>
              </p>
              <p>
                Dernière actualisation de l'affichage : <span className="text-slate-400">{formatDate(lastRefresh)}</span>
              </p>
              <p className="text-slate-700 mt-2">
                Les visites sont comptées une fois par session de navigation (rafraîchissement ignoré).
                La durée de visite est calculée jusqu'à fermeture ou changement d'onglet.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
