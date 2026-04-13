import { BadgeInfo } from "lucide-react";

interface PlaylistScheduleLike {
  id: string;
  label: string;
  start_time?: string;
  end_time?: string;
  template_name?: string;
  behavior?: string;
  audio_track_id?: string | null;
}

export function PlaylistSchedulesPanel({ daySchedules }: { daySchedules: PlaylistScheduleLike[] }) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Programmations du jour</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Plages reliées à la playlist</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
          <BadgeInfo size={14} />
          WebSocket promo plus tard
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3">
        {daySchedules.length > 0 ? (
          daySchedules.map((schedule) => (
            <div key={schedule.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">{schedule.label}</p>
                  <p className="text-xs text-slate-500">
                    {schedule.start_time?.slice(0, 5)} - {schedule.end_time?.slice(0, 5)} · Template {schedule.template_name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                    {schedule.behavior}
                  </span>
                  {schedule.audio_track_id && (
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                      Audio relié
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Aucune plage aujourd'hui</p>
            <p className="mt-2 text-xs text-slate-500">Le flux standard prendra le relais automatiquement.</p>
          </div>
        )}
      </div>
    </div>
  );
}