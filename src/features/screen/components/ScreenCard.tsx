import { Monitor, CheckCircle2, Clock } from "lucide-react";
import { TVScreen } from "@/src/types/screens/screen.types";

export function ScreenCard({ screen }: { screen: TVScreen }) {
  return (
    <div className="group bg-slate-900/40 p-5 rounded-3xl border border-slate-800 hover:border-blue-500/50 transition-all">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${screen.is_active ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
            <Monitor size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{screen.name}</h3>
            <p className="text-[10px] font-mono text-slate-500 uppercase">ID: {screen.token.slice(0, 8)}...</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
        }`}>
          {screen.is_active ? <CheckCircle2 size={12} /> : <Clock size={12} />}
          {screen.is_active ? "En Ligne" : "Hors Ligne"}
        </div>
      </div>
    </div>
  );
}