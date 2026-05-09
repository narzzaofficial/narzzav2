"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Eye, Users, TrendingUp, Activity } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type AnalyticsData = {
  period: number;
  overview: { totalViews: number; uniqueSessions: number; todayViews: number };
  dailyViews: { date: string; views: number; sessions: number }[];
  topPages: { path: string; views: number }[];
  topContent: { slug: string; type: string; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
  contentTypeBreakdown: { type: string; count: number }[];
  referrerBreakdown: { referrer: string; count: number }[];
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const PERIODS = [
  { label: "7 Hari", value: 7 },
  { label: "30 Hari", value: 30 },
  { label: "90 Hari", value: 90 },
];

const DEVICE_COLORS: Record<string, string> = {
  mobile: "#8b5cf6",
  desktop: "#06b6d4",
  tablet: "#f59e0b",
};

const CONTENT_LABELS: Record<string, string> = {
  home: "Beranda",
  feed: "Artikel",
  law: "Hukum",
  category: "Kategori",
  laws_list: "Daftar Hukum",
  agree: "Agree",
  other: "Lainnya",
};

const CHART_COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#3b82f6", "#ec4899"];

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="glass-panel flex items-center gap-4">
      <div className={`shrink-0 rounded-xl p-3 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {typeof value === "number" ? value.toLocaleString("id-ID") : value}
        </p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h3>
      {children}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const dailyWithFormatted =
    data?.dailyViews.map((d) => ({
      ...d,
      label: d.date.slice(5), // MM-DD
    })) ?? [];

  const deviceData =
    data?.deviceBreakdown.map((d) => ({
      name: d.device.charAt(0).toUpperCase() + d.device.slice(1),
      value: d.count,
      color: DEVICE_COLORS[d.device] ?? "#94a3b8",
    })) ?? [];

  const contentTypeData =
    data?.contentTypeBreakdown.map((d) => ({
      name: CONTENT_LABELS[d.type] ?? d.type,
      views: d.count,
    })) ?? [];

  const topPagesData = data?.topPages.map((p) => ({
    path: p.path.length > 30 ? "..." + p.path.slice(-28) : p.path,
    fullPath: p.path,
    views: p.views,
  })) ?? [];

  const referrerData = data?.referrerBreakdown.map((r) => ({
    name: r.referrer.replace(/^www\./, ""),
    views: r.count,
  })) ?? [];

  return (
    <div className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Periode:</span>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDays(p.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                days === p.value
                  ? "bg-violet-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {p.label}
            </button>
          ))}
          {loading && (
            <span className="ml-2 text-xs text-slate-400">Memuat...</span>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Kunjungan"
            value={data?.overview.totalViews ?? 0}
            icon={Eye}
            color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          />
          <StatCard
            label="Pengunjung Unik"
            value={data?.overview.uniqueSessions ?? 0}
            icon={Users}
            color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
          />
          <StatCard
            label="Kunjungan Hari Ini"
            value={data?.overview.todayViews ?? 0}
            icon={TrendingUp}
            color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
        </div>

        {/* Daily views line chart */}
        <ChartCard title={`Kunjungan per Hari (${days} hari terakhir)`}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyWithFormatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                interval={days > 30 ? 6 : days > 14 ? 3 : 1}
              />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                formatter={(value, name) => [
                  Number(value).toLocaleString("id-ID"),
                  name === "views" ? "Kunjungan" : "Sesi Unik",
                ]}
              />
              <Legend
                formatter={(v) => (v === "views" ? "Kunjungan" : "Sesi Unik")}
                iconSize={10}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Row: Top pages + Device breakdown */}
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ChartCard title="Halaman Terpopuler">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={topPagesData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="path"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    formatter={(v) => [Number(v).toLocaleString("id-ID"), "Kunjungan"]}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullPath ?? ""}
                  />
                  <Bar dataKey="views" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="lg:col-span-2">
            <ChartCard title="Perangkat Pengunjung">
              {deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {deviceData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                      formatter={(v) => [Number(v).toLocaleString("id-ID"), "Kunjungan"]}
                    />
                    <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                  Belum ada data
                </div>
              )}
            </ChartCard>
          </div>
        </div>

        {/* Row: Content type + Traffic sources */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartCard title="Jenis Konten yang Dikunjungi">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={contentTypeData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                  formatter={(v) => [Number(v).toLocaleString("id-ID"), "Kunjungan"]}
                />
                <Bar dataKey="views" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {contentTypeData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Sumber Traffic">
            {referrerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={referrerData}
                  layout="vertical"
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                    formatter={(v) => [Number(v).toLocaleString("id-ID"), "Kunjungan"]}
                  />
                  <Bar dataKey="views" fill="#06b6d4" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                Belum ada referral traffic
              </div>
            )}
          </ChartCard>
        </div>

        {/* Top Content Table */}
        {data?.topContent && data.topContent.length > 0 && (
          <div className="glass-panel">
            <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Konten Terpopuler
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">#</th>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Slug</th>
                    <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Tipe</th>
                    <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Kunjungan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.topContent.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 pr-3 font-mono text-xs text-slate-400">{i + 1}</td>
                      <td className="py-2.5 font-mono text-xs text-slate-700 dark:text-slate-300">
                        {item.slug}
                      </td>
                      <td className="py-2.5">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.type === "feed"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        }`}>
                          {item.type === "feed" ? "Artikel" : "Hukum"}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-semibold text-slate-900 dark:text-white">
                        {item.views.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && data && data.overview.totalViews === 0 && (
          <div className="glass-panel flex flex-col items-center gap-2 py-16 text-center">
            <Activity className="h-10 w-10 text-slate-300" />
            <p className="font-medium text-slate-600 dark:text-slate-400">Belum ada data analytics</p>
            <p className="text-sm text-slate-400">
              Data akan muncul setelah ada pengunjung di halaman frontend.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
