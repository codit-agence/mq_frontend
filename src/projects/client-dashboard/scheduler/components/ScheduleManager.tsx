"use client";
import { useState } from "react";
import { Plus, X, CalendarDays } from "lucide-react";
import ScheduleForm from "./ScheduleForm";
import ScheduleList from "./ScheduleList";

export default function ScheduleManager() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BANNER D'ACTION */}
      <div className="flex items-center justify-between bg-slate-50 p-8 rounded-[35px] border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <CalendarDays size={24} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Planning de Diffusion</h2>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">Gérez vos tranches horaires et vos menus automatiques</p>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-lg ${
            isAdding 
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 shadow-rose-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {isAdding ? <X size={16} /> : <Plus size={16} />}
          {isAdding ? "Annuler" : "Nouvelle Plage"}
        </button>
      </div>

      {/* ZONE DYNAMIQUE : FORMULAIRE OU LISTE */}
      <div className="space-y-6">
        {isAdding ? (
          <div className="animate-in zoom-in-95 duration-300">
            <ScheduleForm onSuccess={() => setIsAdding(false)} />
          </div>
        ) : (
          <ScheduleList />
        )}
      </div>

      {/* PETIT RAPPEL UX SI LA LISTE EST VIDE */}
      {!isAdding && (
        <div className="p-6 bg-amber-50 rounded-[25px] border border-amber-100 flex items-start gap-4">
          <div className="text-amber-600 mt-1">⚠️</div>
          <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-tight">
            Note : Si aucune plage horaire n'est active pour l'heure actuelle, le système diffusera automatiquement votre "Flux Standard" (toutes les catégories actives).
          </p>
        </div>
      )}
    </div>
  );
}