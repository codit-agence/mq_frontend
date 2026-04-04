import React from 'react';
import { useForm } from 'react-hook-form';
import { Clock, Music, Package, Calendar } from 'lucide-react';
import { useAdminScheduleStore } from '@/src/features/scheduler/store/admin.store';
import { Category, AudioTrack, Promotion } from '@/src/types/schedule/schedule.type';

// 1. Définition des types pour les Props et le Formulaire
interface ScheduleFormProps {
  categories: Category[];
  audios: AudioTrack[];
  promos: Promotion[];
}

interface FormInputs {
  label: string;
  start_time: string;
  end_time: string;
  category_id: string;
  audio_track_id?: string;
  promotion_id?: string;
  days_of_week: number[];
  priority: number;
  slot_duration: number;
}

const DAYS = [
  { label: 'Lun', value: 0 }, { label: 'Mar', value: 1 }, 
  { label: 'Mer', value: 2 }, { label: 'Jeu', value: 3 },
  { label: 'Ven', value: 4 }, { label: 'Sam', value: 5 }, 
  { label: 'Dim', value: 6 }
];

export default function ScheduleForm({ categories, audios, promos }: ScheduleFormProps) {
  const { saveSchedule, isSaving } = useAdminScheduleStore();

  // 2. Initialisation du formulaire avec le type FormInputs
  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>({
    defaultValues: { 
      days_of_week: [0, 1, 2, 3, 4], 
      priority: 1, 
      slot_duration: 10,
      label: ''
    }
  });

  const selectedDays = watch('days_of_week') || [];

  const toggleDay = (dayValue: number) => {
    const newDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(d => d !== dayValue)
      : [...selectedDays, dayValue];
    
    // On utilise setValue de react-hook-form pour mettre à jour l'état du formulaire
    setValue('days_of_week', newDays);
  };

  return (
    <form onSubmit={handleSubmit(saveSchedule)} className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200">
      <div className="grid grid-cols-2 gap-6">
        
        {/* 1. INFOS DE BASE */}
        <div className="col-span-2">
          <label className="text-sm font-bold text-slate-700 mb-2 block">Nom de la règle</label>
          <input 
            {...register('label', { required: true })} 
            className="w-full p-3 bg-slate-50 border rounded-xl outline-indigo-500" 
            placeholder="ex: Menu Petit Déjeuner" 
          />
        </div>

        {/* 2. TIMING */}
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16}/> Début</label>
          <input type="time" {...register('start_time', { required: true })} className="w-full p-3 bg-slate-50 border rounded-xl" />
        </div>
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Clock size={16}/> Fin</label>
          <input type="time" {...register('end_time', { required: true })} className="w-full p-3 bg-slate-50 border rounded-xl" />
        </div>

        {/* 3. SÉLECTION DES JOURS */}
        <div className="col-span-2">
          <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Calendar size={16}/> Jours de diffusion</label>
          <div className="flex gap-2">
            {DAYS.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  selectedDays.includes(day.value) 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONTENU (LES RELATIONS) */}
        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Package size={16}/> Catégorie</label>
          <select {...register('category_id', { required: true })} className="w-full p-3 bg-slate-50 border rounded-xl">
            <option value="">Sélectionner une catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Music size={16}/> Musique d'ambiance</label>
          <select {...register('audio_track_id')} className="w-full p-3 bg-slate-50 border rounded-xl">
            <option value="">Aucune musique (Silence)</option>
            {audios.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
          </select>
        </div>

      </div>

      <button 
        type="submit"
        disabled={isSaving}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? "Enregistrement..." : "ACTIVER LA PLANIFICATION"}
      </button>
    </form>
  );
}