"use client";
import { useEffect } from "react";
import { Trash2, Layers, Music, AlertCircle, Radio, PowerOff } from "lucide-react";
import { useSchedulerStore } from "@/src/projects/client-dashboard/scheduler/store/schedule.store";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Vérifie si la plage est active EN CE MOMENT (heure + jour courant). */
function isLiveNow(schedule: {
  is_active: boolean;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
}): boolean {
  if (!schedule.is_active) return false;
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7; // 0=lundi…6=dimanche (ISO)
  if (!(schedule.days_of_week ?? []).includes(todayIndex)) return false;
  const pad = (t: string) => t.slice(0, 5);
  const nowStr = now.toTimeString().slice(0, 5);
  return nowStr >= pad(schedule.start_time ?? "") && nowStr <= pad(schedule.end_time ?? "");
}

export default function ScheduleList() {
  const { schedules, fetchSchedules, deleteSchedule, toggleSchedule, isLoading } =
    useSchedulerStore();

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4" />
        <div className="font-black text-slate-300 uppercase tracking-widest text-xs">
          Synchronisation avec le serveur...
        </div>
      </div>
    );
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
        <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Aucune programmation active
        </p>
        <p className="text-slate-300 text-xs mt-1">
          Le flux par défaut sera diffusé 24h/24.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-in fade-in duration-500">
      {schedules.map((item) => {
        const live = isLiveNow(item);
        return (
          <div
            key={item.id}
            className={`group border p-5 rounded-[28px] flex items-center justify-between transition-all duration-300 ${
              !item.is_active
                ? "bg-slate-50 border-slate-100 opacity-60"
                : live
                ? "bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-50"
                : "bg-white border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50"
            }`}
          >
            {/* Heure + infos */}
            <div className="flex items-center gap-5">
              <div
                className={`text-white p-3 rounded-2xl text-center min-w-[80px] shadow-md ${
                  live ? "bg-emerald-600" : item.is_active ? "bg-slate-900" : "bg-slate-400"
                }`}
              >
                <div className="text-[13px] font-black tracking-tighter">
                  {item.start_time?.slice(0, 5) ?? "00:00"}
                </div>
                <div className="w-full h-[1px] bg-white/20 my-1" />
                <div className="text-[10px] font-bold opacity-60">
                  {item.end_time?.slice(0, 5) ?? "00:00"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-black uppercase text-sm tracking-tight ${live ? "text-emerald-800" : "text-slate-900"}`}>
                    {item.label}
                  </h4>
                  {live && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wide">
                      <Radio size={9} /> Diffuse maintenant
                    </span>
                  )}
                  {!item.is_active && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-300 text-white text-[9px] font-black uppercase">
                      <PowerOff size={9} /> Désactivé
                    </span>
                  )}
                </div>

                {/* Jours */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {DAY_LABELS.map((d, i) => {
                    const todayIndex = (new Date().getDay() + 6) % 7;
                    const active = (item.days_of_week ?? []).includes(i);
                    const isToday = i === todayIndex;
                    return (
                      <span
                        key={d}
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                          active && isToday
                            ? "bg-emerald-500 text-white"
                            : active
                            ? "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-300"
                        }`}
                      >
                        {d}
                      </span>
                    );
                  })}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
                    <Layers size={11} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-500 uppercase">
                      {item.category_ids?.length ?? 0} catégories
                    </span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg">
                    <span className="text-[9px] font-black text-slate-500 uppercase">
                      {item.template_name ?? "standard"}
                    </span>
                  </div>
                  {item.audio_track_id && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 rounded-lg">
                      <Music size={11} className="text-indigo-500" />
                      <span className="text-[9px] font-black text-indigo-600 uppercase">Audio</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {/* Toggle actif/inactif */}
              <button
                type="button"
                onClick={() => toggleSchedule(item.id)}
                title={item.is_active ? "Désactiver" : "Activer"}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                  item.is_active ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    item.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>

              {/* Supprimer */}
              <button
                type="button"
                onClick={() => {
                  if (confirm("Supprimer cette programmation ?")) {
                    deleteSchedule(item.id);
                  }
                }}
                className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                title="Supprimer"
              >
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
