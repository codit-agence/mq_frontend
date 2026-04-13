import { CalendarDays, Music2, Shuffle } from "lucide-react";

interface PlaylistStudioHeaderProps {
  configName: string;
  selectedDay: number;
  days: string[];
  daySchedulesCount: number;
  openingCount: number;
  cruiseCount: number;
  onConfigNameChange: (value: string) => void;
  onSelectDay: (index: number) => void;
}

export function PlaylistStudioHeader({
  configName,
  selectedDay,
  days,
  daySchedulesCount,
  openingCount,
  cruiseCount,
  onConfigNameChange,
  onSelectDay,
}: PlaylistStudioHeaderProps) {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Configuration</p>
          <input
            value={configName}
            onChange={(e) => onConfigNameChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-slate-400"
            placeholder="Nom de la playlist"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {days.map((day, index) => {
            const active = selectedDay === index;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(index)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                  active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <CalendarDays size={14} />
            Plages du jour
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{daySchedulesCount}</p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Music2 size={14} />
            Phase A
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{openingCount}</p>
        </div>
        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Shuffle size={14} />
            Phase B
          </div>
          <p className="mt-2 text-3xl font-black text-slate-950">{cruiseCount}</p>
        </div>
      </div>
    </div>
  );
}