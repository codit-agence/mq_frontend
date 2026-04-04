"use client";
import { Cloud, Clock, Volume2, Monitor } from "lucide-react";

export default function DisplaySettings() {
  return (
    <div className="max-w-3xl space-y-10 animate-in fade-in duration-500">
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Widgets Superposés</h3>
        
        <div className="grid gap-4">
          {[
            { id: 'weather', name: 'Météo Locale', icon: Cloud, desc: 'Affiche la température en haut à droite' },
            { id: 'clock', name: 'Horloge Digitale', icon: Clock, desc: 'Heure au format 24h synchronisée' },
            { id: 'audio', name: 'Musique d\'ambiance', icon: Volume2, desc: 'Active le flux audio programmé' },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-transparent hover:border-slate-200 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-[11px] uppercase">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-indigo-600 rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-indigo-200">
        <div className="flex items-center gap-6">
          <Monitor size={32} strokeWidth={2.5} />
          <div>
            <p className="text-[10px] font-black uppercase opacity-60">ID Unique du Display</p>
            <p className="text-xl font-black tracking-tighter">SCREEN-77-DXB</p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase hover:scale-105 transition-transform">
          Copier le lien TV
        </button>
      </div>
    </div>
  );
}