import React from 'react';
import { useAdminScheduleStore } from '@/src/features/scheduler/store/admin.store';
import { Schedule } from '@/src/types/schedule/schedule.type';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function ScheduleTimeline() {
  const { schedules } = useAdminScheduleStore();

  /**
   * Calcule la position X en pourcentage sur la timeline
   */
  const timeToPercent = (timeStr: string): number => {
    if (!timeStr) return 0;
    // Gère les formats "HH:mm:ss" ou "HH:mm"
    const [h, m] = timeStr.split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
      <h2 className="text-lg font-bold mb-6">Planning de Diffusion (24h)</h2>
      
      <div className="relative h-32 bg-slate-50 rounded-lg border border-dashed border-slate-300 min-w-[800px]">
        
        {/* Grille des heures */}
        <div className="absolute inset-0 flex justify-between px-0">
          {HOURS.map(h => (
            <div key={h} className="flex flex-col items-center h-full flex-1 border-l border-slate-200 last:border-r">
              <span className="text-[10px] text-slate-400 mt-auto mb-1">{h}h</span>
            </div>
          ))}
        </div>

        {/* Blocs de diffusion */}
        {schedules.map((item: Schedule) => {
          const start = timeToPercent(item.start_time);
          const end = timeToPercent(item.end_time);
          
          // Calcul de la largeur
          // Si end < start (ex: 22h à 02h), on limite à la fin de journée ou on gère le débordement
          let width = end - start;
          if (width < 0) width = 100 - start; // Pour l'instant, on coupe à minuit

          return (
            <div
              key={item.id}
              className="absolute top-6 h-14 rounded-md border-l-4 shadow-sm flex flex-col justify-center px-3 cursor-pointer hover:brightness-95 transition-all group"
              style={{
                left: `${start}%`,
                width: `${width}%`,
                backgroundColor: '#EEF2FF', // Indigo 50
                borderColor: '#4F46E5',    // Indigo 600
                zIndex: 10 + (item.priority || 0)
              }}
              title={`${item.label}: ${item.start_time} - ${item.end_time}`}
            >
              <div className="truncate w-full">
                <p className="text-xs font-black text-indigo-900 truncate">
                  {item.label}
                </p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase truncate">
                  {item.category_name || 'Sans catégorie'}
                </p>
              </div>
              
              {/* Tooltip simple au survol */}
              <div className="hidden group-hover:block absolute -top-8 left-0 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                {item.start_time.substring(0,5)} - {item.end_time.substring(0,5)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}