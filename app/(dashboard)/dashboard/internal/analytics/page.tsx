"use client";

import { useEffect, useState, useCallback } from "react";
import { BarChart2, TrendingUp, Monitor, Radio, Clock, Users, Tag, Layers, RefreshCw } from "lucide-react";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { CockpitHero, PreviewModeBanner } from "@/src/projects/admin-dashboard/shared/cockpit-ui";
import api from "@/src/core/api/axios";

interface DailyPoint { date: string; impressions?: number; count?: number; }
interface NameCount  { name: string; impressions: number; }
interface TemplateCount { template: string; count: number; }

interface PlatformAnalytics {
  period_days: number;
  since: string;
  total_impressions: number;
  total_uptime_hours: number;
  total_heartbeats: number;
  total_screens: number;
  active_screens: number;
  total_tenants: number;
  total_active_schedules: number;
  daily_impressions: DailyPoint[];
  top_categories: NameCount[];
  top_tenants: NameCount[];
  schedules_created_curve: DailyPoint[];
  schedules_by_template: TemplateCount[];
}

// Mock data utilisé en mode preview
const PREVIEW: PlatformAnalytics = {
  period_days: 30,
  since: "2026-03-16",
  total_impressions: 14820,
  total_uptime_hours: 3640,
  total_heartbeats: 98200,
  total_screens: 42,
  active_screens: 37,
  total_tenants: 18,
  total_active_schedules: 54,
  daily_impressions: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-04-${String(i + 1).padStart(2, "0")}`,
    impressions: Math.floor(400 + Math.random() * 600),
  })),
  top_categories: [
    { name: "Burgers", impressions: 3200 },
    { name: "Boissons", impressions: 2800 },
    { name: "Desserts", impressions: 1900 },
    { name: "Salades", impressions: 1400 },
    { name: "Pizzas", impressions: 900 },
  ],
  top_tenants: [
    { name: "FastFood Marrakech", impressions: 4200 },
    { name: "Cafe Central", impressions: 3100 },
    { name: "Snack Rabat", impressions: 2700 },
  ],
  schedules_created_curve: Array.from({ length: 14 }, (_, i) => ({
    date: `2026-04-${String(i + 1).padStart(2, "0")}`,
    count: Math.floor(1 + Math.random() * 5),
  })),
  schedules_by_template: [
    { template: "standard", count: 24 },
    { template: "display", count: 18 },
    { template: "tvplayer", count: 8 },
    { template: "full_promo", count: 4 },
  ],
};

function MiniBar({ value, max, color = "bg-cyan-500" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
      <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SparkLine({ points, valueKey }: { points: DailyPoint[]; valueKey: "impressions" | "count" }) {
  if (points.length < 2) return null;
  const vals = points.map((p) => (p[valueKey] ?? 0) as number);
  const maxV = Math.max(...vals, 1);
  const W = 300;
  const H = 60;
  const coords = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * W;
    const y = H - (v / maxV) * (H - 4);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-14">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={coords.join(" ")}
        className="text-cyan-400"
      />
    </svg>
  );
}

export default function InternalAnalyticsPage() {
  const { previewMode } = useInternalPreviewMode();
  const [data, setData] = useState<PlatformAnalytics | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (previewMode) {
        setData(PREVIEW);
        return;
      }
      const res = await api.get(`/internal/admin/platform-analytics?days=${days}`);
      setData(res.data);
    } catch {
      if (previewMode) setData(PREVIEW);
    } finally {
      setLoading(false);
    }
  }, [days, previewMode]);

  useEffect(() => { load(); }, [load]);

  const maxCatImp = Math.max(...(data?.top_categories.map((c) => c.impressions) || [1]), 1);
  const maxTenantImp = Math.max(...(data?.top_tenants.map((t) => t.impressions) || [1]), 1);

  const kpis = data
    ? [
        { icon: TrendingUp,  label: "Affichages TV",       value: data.total_impressions.toLocaleString("fr-FR"), hint: `${data.period_days}j`, color: "text-cyan-300" },
        { icon: Clock,       label: "Uptime cumulé",        value: `${data.total_uptime_hours}h`,                 hint: "Tous écrans",         color: "text-emerald-300" },
        { icon: Monitor,     label: "Écrans actifs",         value: `${data.active_screens}/${data.total_screens}`, hint: "En ligne maintenant", color: "text-blue-300" },
        { icon: Users,       label: "Tenants",               value: String(data.total_tenants),                    hint: "Clients SaaS",        color: "text-violet-300" },
        { icon: Radio,       label: "Plages actives",        value: String(data.total_active_schedules),           hint: "Toute la plateforme", color: "text-amber-300" },
        { icon: BarChart2,   label: "Heartbeats",            value: data.total_heartbeats.toLocaleString("fr-FR"), hint: `${data.period_days}j`, color: "text-rose-300" },
      ]
    : [];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {previewMode && (
        <PreviewModeBanner>Données simulées — connectez le backend pour les vraies métriques.</PreviewModeBanner>
      )}

      <CockpitHero
        badge={<><BarChart2 size={14} /> Analytique plateforme</>}
        title="Vue globale des impressions, de l'uptime et de la croissance."
        description="Chaque manifest TV récupéré est tracé en base (ContentImpression). Cette page agrège ces données sur la période choisie pour piloter la plateforme."
        actions={
          <div className="flex items-center gap-2">
            {[7, 14, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-all ${
                  days === d
                    ? "bg-white text-slate-950"
                    : "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
                }`}
              >
                {d}j
              </button>
            ))}
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-300 hover:text-white"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualiser
            </button>
          </div>
        }
      />

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-4 text-center">
            <k.icon size={18} className={`mx-auto mb-2 ${k.color}`} />
            <p className={`text-2xl font-black ${k.color}`}>{loading ? "…" : k.value}</p>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400 mt-0.5">{k.label}</p>
            <p className="text-[8px] text-slate-600 mt-0.5">{k.hint}</p>
          </div>
        ))}
      </section>

      {/* Sparklines */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">
            Impressions / jour
          </p>
          {data && <SparkLine points={data.daily_impressions} valueKey="impressions" />}
          <div className="flex justify-between mt-2 text-[9px] text-slate-500">
            <span>{data?.since}</span>
            <span>Aujourd'hui</span>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-3">
            Plages créées / jour
          </p>
          {data && <SparkLine points={data.schedules_created_curve} valueKey="count" />}
          <div className="flex justify-between mt-2 text-[9px] text-slate-500">
            <span>{data?.since}</span>
            <span>Aujourd'hui</span>
          </div>
        </div>
      </section>

      {/* Top catégories + Top tenants */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={14} className="text-cyan-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Top catégories ({data?.period_days}j)
            </p>
          </div>
          {loading ? (
            <p className="text-slate-500 text-xs">Chargement…</p>
          ) : data?.top_categories.length === 0 ? (
            <p className="text-slate-500 text-xs">Aucune donnée (les TVs doivent récupérer le manifest)</p>
          ) : (
            <div className="space-y-3">
              {data?.top_categories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs">
                    <span className="font-black text-white">{cat.name}</span>
                    <span className="text-cyan-300 font-black">{cat.impressions.toLocaleString("fr-FR")}</span>
                  </div>
                  <MiniBar value={cat.impressions} max={maxCatImp} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={14} className="text-violet-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Top tenants ({data?.period_days}j)
            </p>
          </div>
          {loading ? (
            <p className="text-slate-500 text-xs">Chargement…</p>
          ) : data?.top_tenants.length === 0 ? (
            <p className="text-slate-500 text-xs">Aucune donnée</p>
          ) : (
            <div className="space-y-3">
              {data?.top_tenants.map((t) => (
                <div key={t.name}>
                  <div className="flex justify-between text-xs">
                    <span className="font-black text-white truncate max-w-[70%]">{t.name}</span>
                    <span className="text-violet-300 font-black">{t.impressions.toLocaleString("fr-FR")}</span>
                  </div>
                  <MiniBar value={t.impressions} max={maxTenantImp} color="bg-violet-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Templates utilisés */}
      {data && data.schedules_by_template.length > 0 && (
        <section className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} className="text-amber-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Répartition des templates actifs
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {data.schedules_by_template.map((t) => (
              <div key={t.template} className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-center min-w-[100px]">
                <p className="text-xs font-black text-white">{t.template}</p>
                <p className="text-2xl font-black text-amber-300 mt-1">{t.count}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">plage(s)</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
