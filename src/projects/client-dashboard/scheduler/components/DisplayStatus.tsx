"use client";
import { useEffect, useState, useCallback } from "react";
import { Activity, Clock, Radio, SkipForward, BarChart2, Layers, RefreshCw } from "lucide-react";
import api from "@/src/core/api/axios";

interface SlotInfo {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  template_name: string;
  behavior: string;
  is_active: boolean;
  is_active_now: boolean;
  categories: { id: string; name: string }[];
}

interface CategoryStat {
  name: string;
  schedule_count: number;
}

interface DisplayStatusData {
  current_time: string;
  current_slot: SlotInfo | null;
  next_slot: SlotInfo | null;
  today_timeline: SlotInfo[];
  category_stats: CategoryStat[];
  total_today_slots: number;
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function DisplayStatus() {
  const [data, setData] = useState<DisplayStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetch = useCallback(async () => {
    try {
      const res = await api.get("/manifest/display-status");
      setData(res.data);
      setLastRefresh(new Date());
    } catch {
      // silently fail on refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetch]);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4" />
        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Chargement état d'affichage…</p>
      </div>
    );
  }

  if (!data) return null;

  const nowMinutes = timeToMinutes(data.current_time);
  const DAY_MINUTES = 24 * 60;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">État d'affichage</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Actualisé à {lastRefresh.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          </div>
        </div>
        <button
          onClick={fetch}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-black text-xs hover:bg-slate-200 transition-all"
        >
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* Current + Next */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diffuse maintenant */}
        <div className={`rounded-[24px] p-5 border-2 ${data.current_slot ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200"}`}>
          <div className="flex items-center gap-2 mb-3">
            <Radio size={16} className={data.current_slot ? "text-emerald-600" : "text-slate-400"} />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Diffuse maintenant</p>
            <span className="text-xs font-black text-slate-500 ml-auto">{data.current_time}</span>
          </div>
          {data.current_slot ? (
            <>
              <p className="text-lg font-black text-emerald-800">{data.current_slot.label}</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">
                {data.current_slot.start_time} → {data.current_slot.end_time}
                {" · "}{data.current_slot.template_name}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {data.current_slot.categories.map((c) => (
                  <span key={c.id} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">
                    {c.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-slate-400">Aucune plage active — flux par défaut</p>
          )}
        </div>

        {/* Prochaine plage */}
        <div className="rounded-[24px] p-5 border-2 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <SkipForward size={16} className="text-blue-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Prochaine plage</p>
          </div>
          {data.next_slot ? (
            <>
              <p className="text-lg font-black text-blue-800">{data.next_slot.label}</p>
              <p className="text-xs text-blue-600 font-bold mt-1">
                Dans{" "}
                {Math.max(0, timeToMinutes(data.next_slot.start_time) - nowMinutes)} min
                {" · "}{data.next_slot.start_time} → {data.next_slot.end_time}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {data.next_slot.categories.map((c) => (
                  <span key={c.id} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase">
                    {c.name}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-slate-400">Aucune plage prévue après</p>
          )}
        </div>
      </div>

      {/* Timeline du jour */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-slate-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Timeline du jour — {data.total_today_slots} plage(s) active(s)
          </h3>
        </div>

        {/* Barre timeline visuelle */}
        <div className="relative h-8 bg-slate-100 rounded-full overflow-hidden mb-4">
          {/* Curseur temps actuel */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
            style={{ left: `${(nowMinutes / DAY_MINUTES) * 100}%` }}
          />
          {data.today_timeline.map((slot) => {
            const left = (timeToMinutes(slot.start_time) / DAY_MINUTES) * 100;
            const width = ((timeToMinutes(slot.end_time) - timeToMinutes(slot.start_time)) / DAY_MINUTES) * 100;
            return (
              <div
                key={slot.id}
                title={`${slot.label} (${slot.start_time}-${slot.end_time})`}
                className={`absolute top-1 bottom-1 rounded-full ${
                  slot.is_active_now
                    ? "bg-emerald-500"
                    : slot.is_active
                    ? "bg-indigo-400"
                    : "bg-slate-300"
                }`}
                style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
              />
            );
          })}
        </div>

        {/* Labels des heures */}
        <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-4">
          {["00", "03", "06", "09", "12", "15", "18", "21", "24"].map((h) => (
            <span key={h}>{h}h</span>
          ))}
        </div>

        {/* Liste des plages */}
        <div className="space-y-2">
          {data.today_timeline.length === 0 && (
            <p className="text-slate-400 text-xs text-center py-4">Aucune plage programmée aujourd'hui</p>
          )}
          {data.today_timeline.map((slot) => (
            <div
              key={slot.id}
              className={`flex items-center gap-3 p-3 rounded-2xl ${
                slot.is_active_now
                  ? "bg-emerald-50 border border-emerald-200"
                  : slot.is_active
                  ? "bg-white border border-slate-100"
                  : "bg-slate-50 border border-slate-100 opacity-50"
              }`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${slot.is_active_now ? "bg-emerald-500" : slot.is_active ? "bg-indigo-400" : "bg-slate-300"}`} />
              <span className="text-xs font-black text-slate-700 w-28 shrink-0">
                {slot.start_time} → {slot.end_time}
              </span>
              <span className="text-xs font-bold text-slate-600 flex-1 truncate">{slot.label}</span>
              <span className="text-[9px] font-black text-slate-400 uppercase">{slot.template_name}</span>
              {slot.is_active_now && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase">En cours</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Analytics catégories */}
      {data.category_stats.length > 0 && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-slate-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Catégories actives aujourd'hui
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.category_stats
              .sort((a, b) => b.schedule_count - a.schedule_count)
              .map((cat) => (
                <div key={cat.name} className="bg-slate-50 rounded-2xl p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Layers size={20} className="text-indigo-400" />
                  </div>
                  <p className="text-xs font-black text-slate-700 truncate">{cat.name}</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">{cat.schedule_count}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">plage(s)</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
