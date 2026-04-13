"use client";
import { Layout, Maximize, Columns, Grid3X3 } from "lucide-react";
import { useState } from "react";

const LAYOUTS = [
  { id: 'standard', name: 'Focus Produit', desc: 'Un produit à la fois (Plein écran)', icon: Maximize },
  { id: 'split', name: 'Split Screen', desc: 'Produit à gauche, détails à droite', icon: Columns },
  { id: 'grid', name: 'Grille Menu', desc: 'Affiche 6 produits par page', icon: Grid3X3 },
];

export default function DisplayLayout() {
  const [selected, setSelected] = useState('standard');

  return (
    <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => setSelected(layout.id)}
            className={`p-8 rounded-[40px] border-2 text-left transition-all ${
              selected === layout.id ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50' : 'border-slate-100 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${selected === layout.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <layout.icon size={24} />
            </div>
            <h3 className="font-black text-slate-900 uppercase text-sm">{layout.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 mt-2 leading-relaxed">{layout.desc}</p>
          </button>
        ))}
      </div>

      {/* MINI PREVIEW VISUELLE */}
      <div className="bg-slate-900 rounded-[40px] p-10 relative overflow-hidden group">
        <div className="absolute top-6 left-6 flex gap-2">
           <div className="w-2 h-2 rounded-full bg-rose-500" />
           <div className="w-2 h-2 rounded-full bg-amber-500" />
           <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-slate-500 font-black text-[10px] uppercase tracking-[5px]">
           Aperçu Dynamique : {selected}
        </div>
      </div>
    </div>
  );
}