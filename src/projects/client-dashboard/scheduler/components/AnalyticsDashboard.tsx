"use client";
import { useEffect, useState, useCallback } from "react";
import { BarChart2, TrendingUp, Tag, Layers, Clock, Monitor } from "lucide-react";
import api from "@/src/core/api/axios";

interface CategoryStat {
  id: string;
  name: string;
  product_count: number;
  active_schedules: number;
}

interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface AnalyticsData {
  period_days: number;
  total_manifest_fetches: number;
  total_uptime_hours: number;
  total_heartbeats: number;
  screen_count: number;
  active_schedules: number;
  category_stats: CategoryStat[];
  featured_products: FeaturedProduct[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/manifest/analytics?days=${days}`);
      setData(res.data);
    } catch {
      // silently
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => { fetch(); }, [fetch]);

  const maxSchedules = Math.max(...(data?.category_stats.map((c) => c.active_schedules) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center">
            <BarChart2 size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Analytique diffusion</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Impressions & performances</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                days === d ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {d}j
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-600 mb-3" />
          <p className="text-slate-400 text-xs font-black uppercase">Chargement…</p>
        </div>
      ) : data ? (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: TrendingUp, label: "Affichages", value: data.total_manifest_fetches, color: "text-violet-600" },
              { icon: Clock, label: "Uptime total", value: `${data.total_uptime_hours}h`, color: "text-emerald-600" },
              { icon: Monitor, label: "Écrans actifs", value: data.screen_count, color: "text-blue-600" },
              { icon: BarChart2, label: "Heartbeats", value: data.total_heartbeats, color: "text-amber-600" },
              { icon: Tag, label: "Plages actives", value: data.active_schedules, color: "text-pink-600" },
              { icon: Layers, label: "Période", value: `${data.period_days}j`, color: "text-slate-600" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
                <kpi.icon size={18} className={`mx-auto mb-2 ${kpi.color}`} />
                <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
                <p className="text-[9px] font-black uppercase text-slate-400 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Barchart catégories */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Layers size={14} /> Catégories — plages actives & produits
            </h3>
            {data.category_stats.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-6">Aucune catégorie active</p>
            ) : (
              <div className="space-y-3">
                {data.category_stats
                  .sort((a, b) => b.active_schedules - a.active_schedules)
                  .map((cat) => {
                    const pct = Math.round((cat.active_schedules / maxSchedules) * 100);
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-slate-700">{cat.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {cat.product_count} produit(s)
                            </span>
                            <span className="text-xs font-black text-violet-600">
                              {cat.active_schedules} plage(s)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-500 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Produits vedette */}
          {data.featured_products.length > 0 && (
            <div className="bg-white rounded-[24px] border border-slate-200 p-5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                <Tag size={14} /> Produits mis en avant
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {data.featured_products.map((p) => (
                  <div key={p.id} className="bg-slate-50 rounded-2xl p-3">
                    <p className="text-xs font-black text-slate-700 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.category}</p>
                    <p className="text-sm font-black text-violet-600 mt-1">{p.price.toFixed(2)} Dhs</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-400 text-center py-12">Impossible de charger les analytics</p>
      )}
    </div>
  );
}
