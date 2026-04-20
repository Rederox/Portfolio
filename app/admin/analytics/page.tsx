"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
} from "recharts";
import {
  FiEye, FiDownload, FiClock, FiRefreshCw,
  FiSmartphone, FiMonitor, FiTablet,
  FiGlobe, FiArrowUpRight, FiActivity,
} from "react-icons/fi";
import { getSummary, getVisits, type AnalyticsSummary, type VisitRecord } from "@/lib/analytics";

const WorldMapHeatmap = dynamic(
  () => import("@/components/admin/WorldMapHeatmap"),
  { ssr: false, loading: () => <div className="w-full aspect-[2/1] bg-[#141414] rounded-lg animate-pulse" /> }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(s: number) {
  if (!s) return "—";
  if (s < 60)   return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

function timeAgo(d: Date) {
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "À l'instant";
  if (mins < 60)  return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7)   return `${days}j`;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function flagEmoji(code: string) {
  if (!code || code === "XX") return "🌐";
  return code.toUpperCase().replace(/./g, (c) =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}

function fmtDay(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short",
  });
}

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

function buildCountries(visits: VisitRecord[]) {
  const map = new Map<string, { country: string; code: string; count: number }>();
  for (const v of visits) {
    const k = v.countryCode;
    if (map.has(k)) map.get(k)!.count++;
    else map.set(k, { country: v.country, code: v.countryCode, count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 6);
}

function buildDevices(visits: VisitRecord[]) {
  const c = { desktop: 0, mobile: 0, tablet: 0 };
  for (const v of visits) c[v.device] = (c[v.device] ?? 0) + 1;
  const total = visits.length || 1;
  return [
    { label: "Desktop",  icon: FiMonitor,    count: c.desktop, pct: Math.round((c.desktop / total) * 100) },
    { label: "Mobile",   icon: FiSmartphone, count: c.mobile,  pct: Math.round((c.mobile  / total) * 100) },
    { label: "Tablette", icon: FiTablet,     count: c.tablet,  pct: Math.round((c.tablet  / total) * 100) },
  ];
}

function buildReferrers(visits: VisitRecord[]) {
  const map = new Map<string, number>();
  for (const v of visits) map.set(v.referrer, (map.get(v.referrer) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ref, count]) => ({ ref, count }));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#161616] border border-[#252525] rounded-lg px-3 py-2 text-xs shadow-2xl">
      <p className="text-slate-500 mb-0.5">{label}</p>
      <p className="text-white font-bold font-mono">{payload[0].value}</p>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, sub, accent = false, delay = 0,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; accent?: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-4 flex items-center gap-4"
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={
          accent
            ? { backgroundColor: "rgba(var(--accent-rgb),0.1)", border: "1px solid rgba(var(--accent-rgb),0.18)" }
            : { backgroundColor: "#161616", border: "1px solid #222" }
        }
      >
        <Icon size={15} style={accent ? { color: "var(--accent)" } : { color: "#444" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-slate-600 text-[0.62rem] font-medium uppercase tracking-wider mb-0.5">{label}</p>
        <p
          className="font-mono font-bold text-xl leading-none"
          style={accent ? { color: "var(--accent)" } : { color: "#e2e8f0" }}
        >
          {value}
        </p>
        {sub && <p className="text-slate-700 text-[0.58rem] mt-0.5 truncate">{sub}</p>}
      </div>
    </motion.div>
  );
}

function SectionCard({
  children, delay = 0, className = "",
}: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-[#0f0f0f] border border-[#1c1c1c] rounded-2xl overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-[#171717]">
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        {sub && <p className="text-slate-600 text-[0.65rem] mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
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

  const periodVisits = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - period);
    return visits.filter((v) => v.timestamp >= cutoff);
  }, [visits, period]);

  const dailyData    = useMemo(() => buildDailyData(periodVisits, period), [periodVisits, period]);
  const countries    = useMemo(() => buildCountries(periodVisits), [periodVisits]);
  const devices      = useMemo(() => buildDevices(periodVisits), [periodVisits]);
  const referrers    = useMemo(() => buildReferrers(periodVisits), [periodVisits]);
  const recentVisits = useMemo(() => visits.slice(0, 20), [visits]);

  const maxCountry  = countries[0]?.count || 1;
  const maxReferrer = referrers[0]?.count || 1;

  const eventData = summary ? [
    { label: "CV",       value: summary.totalCVDownloads },
    { label: "Contact",  value: summary.totalContactClicks },
    { label: "Email",    value: summary.totalEmailClicks },
    { label: "GitHub",   value: summary.totalGithubClicks },
    { label: "LinkedIn", value: summary.totalLinkedinClicks },
    { label: "Projets",  value: summary.totalProjectClicks },
  ] : [];

  const mapData = Object.fromEntries(countries.map(({ code, count }) => [code, count]));

  const avgDuration = summary?.totalVisits
    ? Math.round((summary.totalTimeSeconds ?? 0) / summary.totalVisits)
    : 0;

  return (
    <div className="space-y-4 pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Analytics</h1>
          <p className="text-slate-600 text-xs mt-0.5">Statistiques en temps réel</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0f0f0f] border border-[#1c1c1c] rounded-lg p-0.5 gap-0.5">
            {([7, 30, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => setPeriod(d)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  period === d
                    ? "bg-[#1e1e1e] text-white"
                    : "text-slate-600 hover:text-slate-400"
                }`}
              >
                {d}j
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white bg-[#0f0f0f] border border-[#1c1c1c] hover:border-[#2a2a2a] rounded-lg px-3 py-2 transition-all disabled:opacity-40 cursor-pointer"
          >
            <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Rafraîchir</span>
          </button>
        </div>
      </div>

      {loading && !summary ? (
        /* ── Skeleton ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-4 h-[72px] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── KPI row ─────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              icon={FiEye}
              label="Visites totales"
              value={(summary?.totalVisits ?? 0).toLocaleString("fr-FR")}
              sub={`${periodVisits.length} ces ${period} derniers jours`}
              accent
              delay={0}
            />
            <StatCard
              icon={FiClock}
              label="Durée moyenne"
              value={formatDuration(avgDuration)}
              sub={`${formatDuration(summary?.totalTimeSeconds ?? 0)} cumulées`}
              delay={0.04}
            />
            <StatCard
              icon={FiDownload}
              label="CV téléchargés"
              value={summary?.totalCVDownloads ?? 0}
              sub={
                summary?.totalVisits
                  ? `${Math.round(((summary.totalCVDownloads ?? 0) / summary.totalVisits) * 100)}% des visiteurs`
                  : undefined
              }
              delay={0.08}
            />
            <StatCard
              icon={FiGlobe}
              label="Pays uniques"
              value={countries.length}
              sub={countries[0] ? `Top · ${countries[0].country}` : undefined}
              delay={0.12}
            />
          </div>

          {/* ── Traffic chart ──────────────────────────────────────────────── */}
          <SectionCard delay={0.16}>
            <CardHeader
              title="Trafic"
              sub={`Visites jour par jour · ${period}j`}
              right={
                <div className="text-right">
                  <p className="text-white font-bold font-mono text-base leading-none">{periodVisits.length}</p>
                  <p className="text-slate-600 text-[0.6rem] mt-0.5">visites</p>
                </div>
              }
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={dailyData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181818" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 9, fill: "#374151" }}
                    axisLine={false}
                    tickLine={false}
                    interval={period === 7 ? 0 : period === 30 ? 4 : 9}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 9, fill: "#374151" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#222", strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="var(--accent)"
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, fill: "var(--accent)", stroke: "#0f0f0f", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* ── Geo + Devices/Referrers row ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Géographie — mini map + country list */}
            <SectionCard delay={0.2} className="flex flex-col">
              <CardHeader
                title="Géographie"
                sub={`${countries.length} pays · ${period}j`}
                right={
                  <span
                    className="text-[0.6rem] font-mono px-2 py-0.5 rounded-md border"
                    style={{
                      color: "var(--accent)",
                      borderColor: "rgba(var(--accent-rgb),0.2)",
                      backgroundColor: "rgba(var(--accent-rgb),0.06)",
                    }}
                  >
                    {periodVisits.length} vis.
                  </span>
                }
              />
              {/* Map — compact fixed height */}
              <div className="px-3 pt-3 pb-1">
                {countries.length > 0 ? (
                  <WorldMapHeatmap data={mapData} />
                ) : (
                  <div className="w-full h-full bg-[#141414] rounded-lg flex items-center justify-center">
                    <p className="text-slate-700 text-xs">Aucune donnée géo</p>
                  </div>
                )}
              </div>
              {/* Country list */}
              <div className="px-5 pb-5 pt-2 space-y-2.5 flex-1">
                {countries.length === 0 ? (
                  <p className="text-slate-700 text-xs py-4 text-center">Aucune visite géolocalisée</p>
                ) : (
                  countries.map(({ country, code, count }, i) => (
                    <div key={code} className="flex items-center gap-2.5">
                      <span className="text-base leading-none w-5 flex-shrink-0">{flagEmoji(code)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-slate-300 text-xs truncate">{country}</p>
                          <p className="text-slate-400 text-xs font-mono ml-2">{count}</p>
                        </div>
                        <div className="h-[3px] bg-[#191919] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((count / maxCountry) * 100)}%` }}
                            transition={{ duration: 0.6, delay: 0.2 + i * 0.06, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: "var(--accent)", opacity: 0.65 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            {/* Appareils + Sources empilés */}
            <div className="flex flex-col gap-4">

              {/* Devices */}
              <SectionCard delay={0.24}>
                <CardHeader title="Appareils" sub={`${period} derniers jours`} />
                <div className="px-5 py-4 space-y-3.5">
                  {devices.map(({ label, icon: Icon, count, pct }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#161616] border border-[#212121] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={12} className="text-slate-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-slate-400 text-xs">{label}</p>
                          <p className="text-slate-300 text-xs font-mono">{count}</p>
                        </div>
                        <div className="h-[3px] bg-[#191919] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: "var(--accent)", opacity: 0.7 }}
                          />
                        </div>
                      </div>
                      <span className="text-slate-600 text-[0.62rem] font-mono w-8 text-right">{pct}%</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Sources */}
              <SectionCard delay={0.28}>
                <CardHeader
                  title="Sources"
                  sub="Référents de trafic"
                  right={<FiArrowUpRight size={13} className="text-slate-700" />}
                />
                <div className="px-5 py-4">
                  {referrers.length === 0 ? (
                    <p className="text-slate-700 text-xs py-3 text-center">Aucun référent</p>
                  ) : (
                    <div className="space-y-2.5">
                      {referrers.map(({ ref, count }) => (
                        <div key={ref} className="flex items-center gap-3">
                          <p className="text-slate-400 text-xs truncate flex-1">{ref}</p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div
                              className="h-[3px] rounded-full"
                              style={{
                                width: `${Math.round((count / maxReferrer) * 48)}px`,
                                backgroundColor: "var(--accent)",
                                opacity: 0.5,
                              }}
                            />
                            <span className="text-slate-500 text-xs font-mono w-5 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>

          {/* ── Interactions bar chart ──────────────────────────────────────── */}
          <SectionCard delay={0.32}>
            <CardHeader
              title="Interactions"
              sub="Clics par type (total)"
              right={<FiActivity size={13} className="text-slate-700" />}
            />
            <div className="px-5 pb-5 pt-3">
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={eventData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#181818" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: "#374151" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-[#161616] border border-[#252525] rounded-lg px-3 py-2 text-xs shadow-2xl">
                          <p className="text-slate-500 mb-0.5">{label}</p>
                          <p className="text-white font-bold font-mono">{payload[0].value}</p>
                        </div>
                      ) : null
                    }
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                  />
                  <Bar dataKey="value" radius={[3, 3, 0, 0]} fill="var(--accent)" opacity={0.75} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          {/* ── Visites récentes ────────────────────────────────────────────── */}
          <SectionCard delay={0.36}>
            <CardHeader
              title="Visites récentes"
              right={<span className="text-slate-600 text-xs font-mono">{recentVisits.length}</span>}
            />

            {recentVisits.length === 0 ? (
              <div className="py-14 text-center">
                <p className="text-slate-700 text-sm">Aucune visite enregistrée.</p>
                <p className="text-slate-800 text-xs mt-1">Les visites s'enregistrent depuis le portfolio.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#171717]">
                      {["Heure", "Pays", "Ville", "Appareil", "OS", "Source"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-2.5 text-left text-[0.6rem] text-slate-700 font-semibold uppercase tracking-widest whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.map((v, i) => (
                      <tr
                        key={v.id ?? i}
                        className="border-b border-[#111] hover:bg-[#131313] transition-colors"
                      >
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap font-mono">{timeAgo(v.timestamp)}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="flex items-center gap-1.5">
                            <span className="text-sm leading-none">{flagEmoji(v.countryCode)}</span>
                            <span className="text-slate-400">{v.country}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{v.city}</td>
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap capitalize">{v.device}</td>
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{v.os}</td>
                        <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap max-w-[140px] truncate">{v.referrer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <p className="text-slate-800 text-[0.6rem]">
            Données stockées dans Firestore · collection <code className="text-slate-700">visits</code>
          </p>
        </>
      )}
    </div>
  );
}
