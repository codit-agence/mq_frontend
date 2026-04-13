"use client";
import { useEffect } from "react";
import { Trash2, Layers, Music, AlertCircle } from "lucide-react";
import { useSchedulerStore } from "@/src/projects/client-dashboard/scheduler/store/schedule.store";

export default function ScheduleList() {
  const { schedules, fetchSchedules, deleteSchedule, isLoading } = useSchedulerStore();

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  if (isLoading) {
    return (
      <div className="p-20 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
        <div className="font-black text-slate-300 uppercase tracking-widest text-xs">
          Synchronisation avec le serveur...
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-in fade-in duration-500">
      {schedules && schedules.length > 0 ? (
        schedules.map((item) => (
          <div
            key={item.id}
            className="group bg-white border border-slate-100 p-6 rounded-[30px] flex items-center justify-between hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="bg-slate-900 text-white p-4 rounded-2xl text-center min-w-[90px] shadow-lg shadow-slate-200">
                <div className="text-[13px] font-black tracking-tighter">
                  {item.start_time?.slice(0, 5) || "00:00"}
                </div>
                <div className="w-full h-[1px] bg-indigo-500/30 my-1" />
                <div className="text-[10px] font-bold opacity-40">
                  {item.end_time?.slice(0, 5) || "00:00"}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight group-hover:text-indigo-600 transition-colors">
                  {item.label}
                </h4>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg">
                    <Layers size={12} className="text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase">
                      {(item.category_ids?.length || 0)} catégories
                    </span>
                  </div>

                  {item.audio_track_id && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-lg">
                      <Music size={12} className="text-indigo-500" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase">
                        Audio actif
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if(confirm("Supprimer cette programmation ?")) {
                  deleteSchedule(item.id);
                }
              }}
              className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
              title="Supprimer"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        ))
      ) : (
        <div className="p-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
          <AlertCircle className="mx-auto text-slate-200 mb-4" size={48} strokeWidth={1} />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
            Aucune programmation active
          </p>
          <p className="text-slate-300 text-xs mt-1">
            Le flux par défaut sera diffusé 24h/24.
          </p>
        </div>
      )}
    </div>
  );
}
