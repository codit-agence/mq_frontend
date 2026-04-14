import React from 'react';
import { Tv, Settings, Trash2, RotateCcw, RefreshCw, AlertTriangle } from "lucide-react";
import { Screen } from '@/src/types/tvstream/tvstream';
import { useBranding } from '@/src/projects/shared/branding/useBranding';
import { useAppLocale } from '@/src/projects/shared/branding/useAppLocale';

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
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const isOnline = screen.is_online;
  const text = locale === "ar"
    ? {
        noPing: "لا يوجد ping",
        active: "نشط",
        waiting: "قيد الانتظار",
        online: "متصل",
        offline: "غير متصل",
        lastPing: "آخر ping",
        uptime: "مدة التشغيل",
        moved: "تم رصد تحرك الجهاز",
        pairing: "ربط",
        pairingCode: "رمز الربط",
        resetAlert: "إعادة ضبط تنبيه التحرك",
        forceRefresh: "فرض التحديث",
        delete: "حذف الشاشة",
      }
    : {
        noPing: "Aucun ping",
        active: "Actif",
        waiting: "En attente",
        online: "En ligne",
        offline: "Hors ligne",
        lastPing: "Dernier ping",
        uptime: "Uptime",
        moved: "Deplacement detecte",
        pairing: "Apparier",
        pairingCode: "Code d'appairage",
        resetAlert: "Reinitialiser l'alerte deplacement",
        forceRefresh: "Forcer le refresh",
        delete: "Supprimer l'ecran",
      };
  const lastPingLabel = screen.last_ping ? new Date(screen.last_ping).toLocaleString(locale === "ar" ? "ar-MA" : "fr-FR") : text.noPing;
  const uptime = screen.total_uptime_hours || 0;

  return (
    <div className={`bg-slate-900/40 border-2 ${screen.is_active ? 'border-slate-800' : 'border-blue-500/30'} p-5 rounded-[2rem] transition-all hover:border-blue-500/50`}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
          <Tv size={32} />
        </div>
        <div className={`${screen.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'} px-3 py-1 rounded-full`}>
          <span className="text-[10px] font-black uppercase">{screen.is_active ? text.active : text.waiting}</span>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg sm:text-xl font-black text-slate-200 mb-2">{screen.name}</h3>
        <p className="text-slate-400 text-sm">ID: {screen.id.slice(0, 8)}...</p>
        <p className={`text-xs font-bold mt-2 ${isOnline ? "text-emerald-400" : "text-rose-400"}`}>
          {isOnline ? text.online : text.offline}
        </p>
        <p className="text-xs text-slate-400">{text.lastPing}: {lastPingLabel}</p>
        <p className="text-xs text-slate-400">{text.uptime}: {uptime.toFixed(2)} h</p>
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
            <AlertTriangle size={12} /> {text.moved}
          </div>
        )}
      </div>

      {screen.pairing_code && !screen.is_online && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 text-center">
          <p className="text-xs text-blue-400 font-semibold mb-2">{text.pairingCode}</p>
          <p className="text-2xl font-mono font-bold tracking-widest text-blue-300">{screen.pairing_code}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {!screen.is_online && onStartPairing && (
          <button
            onClick={() => onStartPairing(screen.id)}
            className="col-span-2 sm:col-span-1 sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-2xl font-black text-sm transition-all"
          >
            {text.pairing}
          </button>
        )}
        {screen.moved_alert && onResetMovedAlert && (
          <button
            onClick={() => onResetMovedAlert(screen.id)}
            disabled={busy}
            className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 px-3 py-3 rounded-2xl transition-all disabled:opacity-50"
            title={text.resetAlert}
          >
            <RotateCcw size={18} />
          </button>
        )}
        {onForceRefresh && (
          <button
            onClick={() => onForceRefresh(screen.id)}
            disabled={busy}
            className="bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 px-3 py-3 rounded-2xl transition-all disabled:opacity-50"
            title={text.forceRefresh}
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
            title={text.delete}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreenCard;
