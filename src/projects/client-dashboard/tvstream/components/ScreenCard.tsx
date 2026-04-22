"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Tv, Settings, Trash2, RotateCcw, RefreshCw, AlertTriangle, ScanLine } from "lucide-react";
import { toast } from "react-hot-toast";
import { getSiteUrl } from "@/src/core/config/public-env";
import { Screen } from "@/src/types/tvstream/tvstream";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { TvPairingQrScanner } from "@/app/tv/componenents/TvPairingQrScanner";
import { tvStreamService } from "../services/tvstream.service";

/** QR que la TV peut ouvrir en saisissant le code (deep link). */
function tvDeepLinkUrl(pairingCode: string) {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}/tv?pair=${encodeURIComponent(pairingCode)}`;
}

/** Page plein écran TV : même code + QR dashboard (paramètre `pair`, comme partout ailleurs). */
function tvPairDisplayUrl(pairingCode: string, tenantId?: string | null) {
  const base = getSiteUrl().replace(/\/$/, "");
  const q = new URLSearchParams({ pair: pairingCode.replace(/\D/g, "").slice(0, 6) });
  if (tenantId) q.set("tenant", tenantId);
  return `${base}/tv/pair-display?${q.toString()}`;
}

/** Extrait le security code + screen_id depuis le QR affiché sur la TV (état attente sécurité). */
function parseSecurityQr(raw: string): { screenId: string; secCode: string } | null {
  const m = raw.trim().match(/^mq-sec:([^:]+):(\d{4})$/);
  if (!m) return null;
  return { screenId: m[1], secCode: m[2] };
}

interface Props {
  /** Ancre pour scroll depuis `?pair=` */
  id?: string;
  tenantId?: string | null;
  screen: Screen;
  onStartPairing?: (id: string) => void;
  onDelete?: (id: string) => void;
  onResetMovedAlert?: (id: string) => void;
  onForceRefresh?: (id: string) => void;
  busy?: boolean;
}

export function ScreenCard({
  id,
  tenantId,
  screen,
  onStartPairing,
  onDelete,
  onResetMovedAlert,
  onForceRefresh,
  busy,
}: Props) {
  const { branding } = useBranding();
  const { locale } = useAppLocale();
  const [scanOpen, setScanOpen] = useState(false);
  const [scanBusy, setScanBusy] = useState(false);

  const isOnline = screen.is_online;
  const pairingCode = screen.pairing_code ?? null;

  const text =
    locale === "ar"
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
          scanBtn: "مسح QR التلفاز",
          scanTitle: "وجّه كاميرا هذا الهاتف نحو التلفاز",
          scanHint: "امسح رمز الأمان (4 أرقام) الظاهر على شاشة التلفاز للتأكيد التلقائي.",
          scanBack: "إغلاق",
          scanCameraErr: "تعذر تشغيل الكاميرا",
          scanOk: "تم تأكيد الربط بنجاح!",
          scanBadFormat: "رمز غير صالح — تأكد من أنك تمسح رمز QR للأمان على شاشة التلفاز.",
          resetAlert: "إعادة ضبط تنبيه التحرك",
          forceRefresh: "فرض التحديث",
          delete: "حذف الشاشة",
          qrHint: "افتح هذا الرابط على متصفح التلفاز لإدخال الرمز تلقائيًا.",
          pairDisplay: "عرض للتلفاز (QR + الرمز)",
          pairDisplayHint: "نفس الرابط مع ?pair= في شاشة واحدة.",
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
          scanBtn: "Scanner QR TV",
          scanTitle: "Visez la TV avec la camera de ce telephone",
          scanHint: "Scannez le QR de securite (4 chiffres) affiche sur la TV pour confirmer automatiquement.",
          scanBack: "Fermer",
          scanCameraErr: "Camera indisponible",
          scanOk: "Appairage confirme !",
          scanBadFormat: "QR non reconnu — assurez-vous de scanner le QR securite affiche sur la TV.",
          resetAlert: "Reinitialiser l'alerte deplacement",
          forceRefresh: "Forcer le refresh",
          delete: "Supprimer l'ecran",
          qrHint: "Ouvrez ce lien sur le navigateur de la TV pour saisir le code automatiquement.",
          pairDisplay: "Affichage TV (QR + code)",
          pairDisplayHint: "Une seule page avec ?pair= — évite les problèmes de souris.",
        };

  const lastPingLabel = screen.last_ping
    ? new Date(screen.last_ping).toLocaleString(locale === "ar" ? "ar-MA" : "fr-FR")
    : text.noPing;
  const uptime = screen.total_uptime_hours || 0;

  const handleScanned = async (raw: string) => {
    setScanOpen(false);
    const parsed = parseSecurityQr(raw);
    if (!parsed) {
      toast.error(text.scanBadFormat);
      return;
    }
    setScanBusy(true);
    try {
      await tvStreamService.verifySecurityCode(parsed.screenId, parsed.secCode, tenantId ?? undefined);
      toast.success(text.scanOk);
    } catch {
      toast.error(text.scanBadFormat);
    } finally {
      setScanBusy(false);
    }
  };

  return (
    <div
      id={id}
      className={`bg-slate-900/40 border-2 ${screen.is_active ? "border-slate-800" : "border-blue-500/30"} p-5 rounded-[2rem] transition-all hover:border-blue-500/50`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-4 rounded-2xl ${screen.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"}`}
        >
          <Tv size={32} />
        </div>
        <div
          className={`${screen.is_active ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"} px-3 py-1 rounded-full`}
        >
          <span className="text-[10px] font-black uppercase">{screen.is_active ? text.active : text.waiting}</span>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg sm:text-xl font-black text-slate-200 mb-2">{screen.name}</h3>
        <p className="text-slate-400 text-sm">ID: {screen.id.slice(0, 8)}...</p>
        <p className={`text-xs font-bold mt-2 ${isOnline ? "text-emerald-400" : "text-rose-400"}`}>
          {isOnline ? text.online : text.offline}
        </p>
        <p className="text-xs text-slate-400">
          {text.lastPing}: {lastPingLabel}
        </p>
        <p className="text-xs text-slate-400">
          {text.uptime}: {uptime.toFixed(2)} h
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-200">
            {screen.resolved_transport || "polling"}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-200">
            {screen.device_tier || "standard"}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              screen.last_gps_status === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-200"
            }`}
          >
            GPS {screen.last_gps_status || "unknown"}
          </span>
        </div>
        {screen.moved_alert && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-300">
            <AlertTriangle size={12} /> {text.moved}
          </div>
        )}
      </div>

      {/* Zone appairage : code 6 chiffres + QR deep link + bouton scan */}
      {pairingCode && !screen.is_online && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-6 text-center space-y-3">
          <p className="text-xs text-blue-400 font-semibold">{text.pairingCode}</p>

          {/* Code 6 chiffres */}
          <p className="text-3xl font-mono font-bold tracking-[0.35em] text-blue-300">{pairingCode}</p>

          {/* QR deep link : ouvre /tv?pair=CODE sur la TV */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] text-slate-500 max-w-[240px] leading-snug">{text.qrHint}</p>
            <div className="rounded-xl bg-white p-2 inline-block">
              <QRCodeSVG value={tvDeepLinkUrl(pairingCode)} size={120} level="M" />
            </div>
            <a
              href={tvPairDisplayUrl(pairingCode, tenantId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-sky-400 hover:text-sky-300 underline underline-offset-2 max-w-[260px] text-center leading-snug"
            >
              {text.pairDisplay}
            </a>
            <p className="text-[9px] text-slate-600 max-w-[260px] leading-snug">{text.pairDisplayHint}</p>
          </div>

          {/* Bouton scan : scanne le QR de sécurité affiché sur la TV */}
          <button
            type="button"
            onClick={() => setScanOpen(true)}
            disabled={scanBusy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-black uppercase tracking-wide text-white disabled:opacity-50"
          >
            <ScanLine size={18} /> {text.scanBtn}
          </button>
        </div>
      )}

      {/* Modal scanner inline */}
      {scanOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] p-4 shadow-xl">
            <TvPairingQrScanner
              active={scanOpen}
              onDecoded={(raw) => void handleScanned(raw)}
              onBack={() => setScanOpen(false)}
              labels={{
                title: text.scanTitle,
                hint: text.scanHint,
                back: text.scanBack,
                cameraError: text.scanCameraErr,
              }}
            />
          </div>
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
}

export default ScreenCard;
