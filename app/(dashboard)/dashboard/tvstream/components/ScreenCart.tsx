import { Tv, Settings, Trash2 } from "lucide-react";
import { Screen } from "@/src/types/tvstream/tvstream";

interface Props {
  screen: Screen;
  onStartPairing: (id: string) => void;
}

export const ScreenCard = ({ screen, onStartPairing }: Props) => {
  const isOnline = screen.is_online; // Optionnel : utilise ton champ is_online

  return (
    <div className={`bg-slate-900/40 border-2 ${screen.is_active ? 'border-slate-800' : 'border-blue-500/30'} p-6 rounded-[2.5rem] transition-all hover:border-blue-500/50`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
          <Tv size={32} />
        </div>
        <div className={`${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} px-3 py-1 rounded-full`}>
          <span className="text-[10px] font-black uppercase">{screen.is_active ? 'Actif' : 'En attente'}</span>
        </div>
      </div>

      <h3 className="text-2xl font-black mb-1 truncate">{screen.name}</h3>
      <p className="text-slate-500 text-xs font-bold uppercase mb-6">ID: {screen.id.slice(0,8)}</p>

      {!screen.is_active ? (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Code TV</p>
            <span className="text-4xl font-mono font-black text-blue-500 tracking-[0.5rem]">{screen.pairing_code}</span>
          </div>
          <button 
            onClick={() => onStartPairing(screen.id)}
            className="w-full bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl text-sm font-black transition-all border border-blue-500/20"
          >
            RELIER MAINTENANT
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Diffusion</p>
            <p className="text-white font-bold">{screen.current_template || "Standard"}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-800 hover:bg-blue-600 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
              <Settings size={14} /> CONFIGURER
            </button>
            <button className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500 rounded-xl transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};