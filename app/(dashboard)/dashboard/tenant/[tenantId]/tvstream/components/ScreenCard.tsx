import React from 'react';
import { Tv, Settings, Trash2, RotateCcw, RefreshCw, AlertTriangle } from "lucide-react";
import { Screen } from '@/src/types/tvstream/tvstream';

interface Props {
  screen: Screen;
  onStartPairing?: (id: string) => void;
  onDelete?: (id: string) => void;
  onResetMovedAlert?: (id: string) => void;
  onForceRefresh?: (id: string) => void;
  busy?: boolean;
}

const ScreenCard: React.FC<Props> = ({
  screen,
  onStartPairing,
  onDelete,
  onResetMovedAlert,
  onForceRefresh,
  busy,
}) => {
  const isOnline = screen.is_online;
  const lastPingLabel = screen.last_ping ? new Date(screen.last_ping).toLocaleString() : "Aucun ping";
  const uptime = screen.total_uptime_hours || 0;

  return (
    <div className={`bg-slate-900/40 border-2 ${screen.is_active ? 'border-slate-800' : 'border-blue-500/30'} p-5 rounded-[2rem] transition-all hover:border-blue-500/50`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
          <Tv size={32} />
        </div>
        <div className={`${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} px-3 py-1 rounded-full`}>
          <span className="text-[10px] font-black uppercase">{screen.is_active ? 'Actif' : 'En attente'}</span>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg sm:text-xl font-black text-slate-200 mb-2">{screen.name}</h3>
        <p className="text-slate-400 text-sm">ID: {screen.id.slice(0, 8)}...</p>
        <p className={`text-xs font-bold mt-2 ${isOnline ? "text-emerald-400" : "text-rose-400"}`}>
          {isOnline ? "En ligne" : "Hors ligne"}
        </p>
        <p className="text-xs text-slate-400">Dernier ping: {lastPingLabel}</p>
        <p className="text-xs text-slate-400">Uptime: {uptime.toFixed(2)} h</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-200">
            {screen.resolved_transport || "polling"}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-200">
            {screen.device_tier || "standard"}
          </span>
          <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${screen.last_gps_status === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>
            GPS {screen.last_gps_status || "unknown"}
          </span>
        </div>
        {screen.moved_alert && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-300">
            <AlertTriangle size={12} /> Déplacement détecté
          </div>
        )}
      </div>

      {/* Zone d'appairage si pas encore connecté */}
      {screen.pairing_code && !screen.is_online && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 text-center">
          <p className="text-xs text-blue-400 font-semibold mb-2">Code d'appairage</p>
          <p className="text-2xl font-mono font-bold tracking-widest text-blue-300">{screen.pairing_code}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {!screen.is_online && onStartPairing && (
          <button
            onClick={() => onStartPairing(screen.id)}
            className="col-span-2 sm:col-span-1 sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-black text-sm transition-all"
          >
            Apparier
          </button>
        )}
        {screen.moved_alert && onResetMovedAlert && (
          <button
            onClick={() => onResetMovedAlert(screen.id)}
            disabled={busy}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-3 py-3 rounded-2xl transition-all disabled:opacity-50"
            title="Réinitialiser l'alerte déplacement"
          >
            <RotateCcw size={18} />
          </button>
        )}
        {onForceRefresh && (
          <button
            onClick={() => onForceRefresh(screen.id)}
            disabled={busy}
            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 px-3 py-3 rounded-2xl transition-all disabled:opacity-50"
            title="Forcer le refresh"
          >
            <RefreshCw size={18} />
          </button>
        )}
        <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-2xl transition-all">
          <Settings size={20} />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(screen.id)}
            className="p-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-2xl transition-all"
            title="Supprimer l'écran"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreenCard;
