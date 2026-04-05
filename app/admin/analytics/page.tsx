"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import {
  FiEye, FiDownload, FiMail, FiGithub, FiLinkedin,
  FiFolder, FiClock, FiRefreshCw, FiSmartphone, FiMonitor, FiTablet,
  FiGlobe, FiArrowUpRight,
} from "react-icons/fi";
import { getSummary, getVisits, type AnalyticsSummary, type VisitRecord } from "@/lib/analytics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(s: number) {
  if (!s) return "—";
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)    return "À l'instant";
  if (mins < 60)   return `il y a ${mins}m`;
  if (hours < 24)  return `il y a ${hours}h`;
  if (days < 7)    return `il y a ${days}j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function flagEmoji(code: string) {
  if (!code || code === "XX") return "🌐";
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function fmtDay(iso: string) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

/** Regroupe les visites par jour sur les N derniers jours. */
function buildDailyData(visits: VisitRecord[], days = 30) {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      date:   key,
      label:  fmtDay(key),
      visits: visits.filter((v) => v.timestamp.toISOString().slice(0, 10) === key).length,
    };
  });
}

/** Top pays triés par nombre de visites. */
function buildCountries(visits: VisitRecord[]) {
  const map = new Map<string, { country: string; code: string; count: number }>();
  for (const v of visits) {
    const key = v.countryCode;
    if (map.has(key)) map.get(key)!.count++;
    else map.set(key, { country: v.country, code: v.countryCode, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
}

/** Répartition des devices. */
function buildDevices(visits: VisitRecord[]) {
  const counts = { desktop: 0, mobile: 0, tablet: 0 };
  for (const v of visits) counts[v.device] = (counts[v.device] ?? 0) + 1;
  const total = visits.length || 1;
  return [
    { label: "Desktop",  key: "desktop", icon: FiMonitor,   count: counts.desktop, pct: Math.round((counts.desktop / total) * 100) },
    { label: "Mobile",   key: "mobile",  icon: FiSmartphone, count: counts.mobile,  pct: Math.round((counts.mobile  / total) * 100) },
    { label: "Tablette", key: "tablet",  icon: FiTablet,     count: counts.tablet,  pct: Math.round((counts.tablet  / total) * 100) },
  ];
}

/** Top référents. */
function buildReferrers(visits: VisitRecord[]) {
  const map = new Map<string, number>();
  for (const v of visits) map.set(v.referrer, (map.get(v.referrer) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([ref, count]) => ({ ref, count }));
}

// ─── Tooltip recharts ─────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="text-white font-bold">{payload[0].value} visite{payload[0].value !== 1 ? "s" : ""}</p>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, sub, accent = false, delay = 0 }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; accent?: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
        style={accent
          ? { backgroundColor: "rgba(var(--accent-rgb),0.12)", border: "1px solid rgba(var(--accent-rgb),0.22)" }
          : { backgroundColor: "#161616", border: "1px solid #222" }}
      >
        <Icon size={16} style={accent ? { color: "var(--accent)" } : { color: "#555" }} />
      </div>
      <p className="text-slate-500 text-[0.7rem] font-medium mb-0.5">{label}</p>
      <p
        className="font-display font-extrabold text-3xl leading-none mb-1"
        style={accent ? { color: "var(--accent)" } : { color: "white" }}
      >
        {value}
      </p>
      {sub && <p className="text-slate-600 text-[0.62rem]">{sub}</p>}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [visits,  setVisits]  = useState<VisitRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState<7 | 30 | 90>(30);

  const load = async () => {
    setLoading(true);
    const [s, v] = await Promise.all([getSummary(), getVisits(90)]);
    setSummary(s);
    setVisits(v);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Derived data
  const periodVisits = useMemo(
    () => visits.filter((v) => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - period);
      return v.timestamp >= cutoff;
    }),
    [visits, period],
  );

  const dailyData  = useMemo(() => buildDailyData(periodVisits, period), [periodVisits, period]);
  const countries  = useMemo(() => buildCountries(periodVisits), [periodVisits]);
  const devices    = useMemo(() => buildDevices(periodVisits), [periodVisits]);
  const referrers  = useMemo(() => buildReferrers(periodVisits), [periodVisits]);
  const recentVisits = useMemo(() => visits.slice(0, 20), [visits]);

  const maxCountry = countries[0]?.count || 1;

  // Click events data for bar chart
  const eventData = summary ? [
    { label: "CV",       value: summary.totalCVDownloads },
    { label: "Contact",  value: summary.totalContactClicks },
    { label: "Email",    value: summary.totalEmailClicks },
    { label: "GitHub",   value: summary.totalGithubClicks },
    { label: "LinkedIn", value: summary.totalLinkedinClicks },
    { label: "Projets",  value: summary.totalProjectClicks },
  ] : [];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white mb-1">Analytics</h1>
          <p className="text-slate-400 text-sm">Statistiques en temps réel de ton portfolio.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#111] border border-[#1e1e1e] rounded-xl p-1">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === d ? "bg-[#1e1e1e] text-white" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {d}j
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl px-4 py-2 transition-all disabled:opacity-40"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>
      </div>

      {loading && !summary ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-slate-600 text-sm flex items-center gap-2">
            <FiRefreshCw size={14} className="animate-spin" /> Chargement…
          </div>
        </div>
      ) : (
        <>
          {/* ── KPIs ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiCard
              icon={FiEye}
              label="Visites totales"
              value={(summary?.totalVisits ?? 0).toLocaleString("fr-FR")}
              sub={`${periodVisits.length} sur ${period} jours`}
              accent
              delay={0}
            />
            <KpiCard
              icon={FiClock}
              label="Durée moy."
              value={formatDuration(
                summary?.totalVisits
                  ? Math.round((summary.totalTimeSeconds ?? 0) / summary.totalVisits)
                  : 0,
              )}
              sub={`${formatDuration(summary?.totalTimeSeconds ?? 0)} cumulées`}
              delay={0.05}
            />
            <KpiCard
              icon={FiDownload}
              label="CV téléchargés"
              value={summary?.totalCVDownloads ?? 0}
              sub={
                summary?.totalVisits
                  ? `${Math.round(((summary.totalCVDownloads ?? 0) / summary.totalVisits) * 100)}% des visiteurs`
                  : undefined
              }
              delay={0.1}
            />
            <KpiCard
              icon={FiGlobe}
              label="Pays uniques"
              value={countries.length}
              sub={countries[0] ? `Top : ${countries[0].country}` : undefined}
              delay={0.15}
            />
          </div>

          {/* ── Traffic chart ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white font-semibold text-sm">Trafic</p>
                <p className="text-slate-500 text-xs mt-0.5">Visites par jour sur {period} jours</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold text-lg">{periodVisits.length}</p>
                <p className="text-slate-500 text-xs">visites</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={dailyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"   stopColor="var(--accent)" stopOpacity={0.15} />
                    <stop offset="95%"  stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e1e1e"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  interval={period === 7 ? 0 : period === 30 ? 4 : 9}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#2a2a2a", strokeWidth: 1 }} />
                <Line
                  type="monotone"
                  dataKey="visits"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--accent)", stroke: "#111", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* ── Events + Devices ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Événements (bar chart) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6"
            >
              <p className="text-white font-semibold text-sm mb-1">Interactions</p>
              <p className="text-slate-500 text-xs mb-5">Clics par type (total)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={eventData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#475569" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs shadow-xl">
                          <p className="text-slate-400 mb-1">{label}</p>
                          <p className="text-white font-bold">{payload[0].value} clic{(payload[0].value as number) !== 1 ? "s" : ""}</p>
                        </div>
                      ) : null
                    }
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="var(--accent)" opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Devices */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6"
            >
              <p className="text-white font-semibold text-sm mb-1">Appareils</p>
              <p className="text-slate-500 text-xs mb-5">Répartition sur {period} jours</p>
              <div className="space-y-4">
                {devices.map(({ label, icon: Icon, count, pct }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#161616] border border-[#222] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-slate-300 text-sm">{label}</p>
                        <p className="text-white font-bold text-sm font-mono">{count}</p>
                      </div>
                      <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs w-10 text-right font-mono">{pct}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Countries + Referrers ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Pays */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <FiGlobe size={14} className="text-slate-500" />
                <p className="text-white font-semibold text-sm">Pays</p>
              </div>
              {countries.length === 0 ? (
                <p className="text-slate-600 text-sm py-8 text-center">Aucune donnée geo</p>
              ) : (
                <div className="space-y-3">
                  {countries.map(({ country, code, count }) => (
                    <div key={code} className="flex items-center gap-3">
                      <span className="text-lg leading-none flex-shrink-0">{flagEmoji(code)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-slate-300 text-sm truncate">{country}</p>
                          <p className="text-white font-bold text-sm font-mono ml-2">{count}</p>
                        </div>
                        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.round((count / maxCountry) * 100)}%`, backgroundColor: "var(--accent)", opacity: 0.7 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Référents */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111] border border-[#1e1e1e] rounded-2xl p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <FiArrowUpRight size={14} className="text-slate-500" />
                <p className="text-white font-semibold text-sm">Sources de trafic</p>
              </div>
              {referrers.length === 0 ? (
                <p className="text-slate-600 text-sm py-8 text-center">Aucun référent</p>
              ) : (
                <div className="space-y-2">
                  {referrers.map(({ ref, count }) => (
                    <div
                      key={ref}
                      className="flex items-center justify-between py-2 border-b border-[#1a1a1a] last:border-0"
                    >
                      <p className="text-slate-300 text-sm truncate mr-3">{ref}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${Math.round((count / (referrers[0]?.count || 1)) * 60)}px`,
                            backgroundColor: "var(--accent)",
                            opacity: 0.6,
                          }}
                        />
                        <span className="text-white font-bold text-sm font-mono w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Visites récentes ────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-[#111] border border-[#1e1e1e] rounded-2xl overflow-hidden"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
              <p className="text-white font-semibold text-sm">Visites récentes</p>
              <p className="text-slate-500 text-xs">{recentVisits.length} dernières</p>
            </div>

            {recentVisits.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-600 text-sm">Aucune visite enregistrée.</p>
                <p className="text-slate-700 text-xs mt-1">
                  Les visites s'enregistrent automatiquement depuis le portfolio.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      {["Heure", "Pays", "Ville", "Appareil", "OS", "Source"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-[0.65rem] text-slate-600 font-semibold uppercase tracking-widest whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.map((v, i) => (
                      <tr
                        key={v.id ?? i}
                        className="border-b border-[#0f0f0f] hover:bg-[#141414] transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-xs font-mono">
                          {timeAgo(v.timestamp)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <span>{flagEmoji(v.countryCode)}</span>
                            <span className="text-slate-300 text-xs">{v.country}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{v.city}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap capitalize">{v.device}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{v.os}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap max-w-[140px] truncate">{v.referrer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* ── Note Firestore ──────────────────────────────────────────────── */}
          <p className="text-slate-700 text-xs">
            Les nouvelles visites sont enregistrées dans la collection <code className="text-slate-600">visits</code>.
            Ajoute la règle Firestore : <code className="text-slate-600">match /visits/&#123;docId&#125; &#123; allow read: if request.auth != null; allow write: if true; &#125;</code>
          </p>
        </>
      )}
    </div>
  );
}
