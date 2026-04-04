"use client";
import { useEffect, useState } from "react";
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { CheckCircle2, Save } from "lucide-react";
import { useSchedulerStore } from "../store/schedule.store";
import { CreateScheduleInput } from "@/src/types/schedule/schedule.type";
import { useAudioStore } from "../store/audio.store";

export default function ScheduleForm({ onSuccess }: { onSuccess: () => void }) {
  const { categories } = useCatalogStore(); 
  const { tracks, fetchTracks } = useAudioStore(); // Récupère les audios
  const { createSchedule } = useSchedulerStore();
  
  // FORM DATA COMPLET (Matching Django Schema)
 const [formData, setFormData] = useState<CreateScheduleInput>({
    label: "",
    category_ids: [],
    behavior: "EXCLUSIVE", // Maintenant TS sait que c'est le littéral "EXCLUSIVE"
    start_time: "08:00",
    end_time: "10:00",
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    template_name: "standard",
    slot_duration: 10,
    priority: 1,
    audio_track_id: null,
    promotion_id: null
  });
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  useEffect(() => {
    fetchTracks(); // Charge les musiques quand on ouvre le formulaire
  }, [fetchTracks]);

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(id)
        ? prev.category_ids.filter(item => item !== id)
        : [...prev.category_ids, id]
    }));
  };
  const toggleDay = (index: number) => {
  setFormData(prev => ({
    ...prev,
    days_of_week: prev.days_of_week.includes(index)
      ? prev.days_of_week.filter(d => d !== index)
      : [...prev.days_of_week, index]
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.category_ids.length === 0) {
      return alert("Sélectionnez au moins une catégorie");
    }

    try {
      await createSchedule(formData);
      onSuccess(); // Ferme le formulaire et recharge la liste
    } catch (error) {
      console.error("Erreur formulaire:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-8">
      
      {/* SECTION 1 : INFOS GÉNÉRALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nom de la séquence</label>
          <input 
            type="text" placeholder="Ex: Menu Petit Déjeuner" required
            value={formData.label}
            className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setFormData(prev => ({...prev, label: e.target.value}))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mode d'affichage</label>
          <select 
            value={formData.behavior}
            className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm"
           onChange={(e) => setFormData(prev => ({
                ...prev, 
                behavior: e.target.value as "EXCLUSIVE" | "ADDITIVE" 
                }))}
          >
            <option value="EXCLUSIVE">Remplacer le flux standard (Exclusif)</option>
            <option value="ADDITIVE">S'ajouter au flux standard (Additif)</option>
          </select>
        </div>
      </div>

      {/* SECTION 2 : TEMPS */}
      <div className="flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Plage Horaire</label>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm">
            <input type="time" value={formData.start_time} className="flex-1 border-none bg-transparent font-bold text-sm" 
                   onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))} />
            <span className="text-slate-300 font-black">→</span>
            <input type="time" value={formData.end_time} className="flex-1 border-none bg-transparent font-bold text-sm"
                   onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))} />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Vitesse (sec)</label>
          <input type="number" value={formData.slot_duration} className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm"
                 onChange={(e) => setFormData(prev => ({...prev, slot_duration: parseInt(e.target.value) || 10}))} />
        </div>
      </div>

      {/* SECTION 3 : CATÉGORIES */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Catégories à diffuser</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories?.map((cat) => (
            <button
              key={cat.id} type="button"
              onClick={() => toggleCategory(cat.id)}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                formData.category_ids.includes(cat.id) 
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                : 'border-white bg-white text-slate-400 opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-[11px] font-black uppercase tracking-tight">{cat.name}</span>
              {formData.category_ids.includes(cat.id) && <CheckCircle2 size={16} />}
            </button>
          ))}
        </div>
      </div>

        {/* SECTION 4 : JOURS DE DIFFUSION */}
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Jours d'activation</label>
            <div className="flex gap-2">
                {days.map((day, index) => (
                <button
                    key={day} type="button"
                    onClick={() => toggleDay(index)}
                    className={`flex-1 p-2 rounded-xl text-[10px] font-bold transition-all ${
                    formData.days_of_week.includes(index) 
                    ? 'bg-slate-900 text-white' : 'bg-white text-slate-400'
                    }`}
                >
                    {day}
                </button>
                ))}
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TEMPLATE */}
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Design (Template)</label>
            <select 
            value={formData.template_name}
            className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm"
            onChange={(e) => setFormData(prev => ({...prev, template_name: e.target.value}))}
            >
            <option value="standard">Grille Standard</option>
            <option value="elegant">Élégant (Focus Produit)</option>
            <option value="fast_food">Fast Food (Gros prix)</option>
            </select>
        </div>

        {/* AUDIO (Si tu as un store audio, sinon laisse en null pour l'instant) */}
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Ambiance Sonore</label>
           <select 
          className="w-full bg-white border-none rounded-2xl p-4 text-sm font-bold shadow-sm"
          value={formData.audio_track_id || ""}
          onChange={(e) => setFormData(prev => ({
            ...prev, 
            audio_track_id: e.target.value || null 
          }))}
        >
          <option value="">🔇 Pas de musique</option>
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              🎵 {track.title}
            </option>
          ))}
        </select>
        </div>
        </div>

      <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-[24px] font-black uppercase text-xs tracking-[3px] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-100">
        <Save size={18} /> Valider la Programmation
      </button>
    </form>
  );
}