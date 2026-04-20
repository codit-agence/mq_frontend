"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tv, Loader2, Signal, AlertTriangle, Clock3, ScanLine } from "lucide-react";
import { toast } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { TvPairingQrScanner } from "@/app/tv/componenents/TvPairingQrScanner";
import { useTVStream } from "../hooks/useTVStream";
import { AddScreenForm } from "../components/AddScreenForm";
import { PairingModal } from "../components/PairingModal";
import ScreenCard from "../components/ScreenCard";
import { tvStreamService } from "../services/tvstream.service";

/** Extrait le session_token depuis le QR de la TV en mode « Afficher QR ». */
function extractTvSessionToken(raw: string): string | null {
  const t = raw.trim();
  // Format URL : {origin}/tv-new?s={token}
  try {
    const u = new URL(t);
    const s = u.searchParams.get("s");
    if (s && s.length > 8) return s;
  } catch {
    /* not a URL */
  }
  // Format brut UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t)) return t;
  return null;
}

export interface TvStreamPageViewProps {
  /** Si défini (route tenant), stats complètes + actions admin sur les cartes. */
  tenantId?: string | null;
}

function TvStreamPageViewInner({ tenantId }: TvStreamPageViewProps) {
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();
  const scoped = tenantId ?? undefined;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const pairHandledRef = useRef<string | null>(null);

  const {
    screens,
    loading,
    isAdding,
    setIsAdding,
    summary,
    step,
    setStep,
    screenName,
    setScreenName,
    validationCode,
    setValidationCode,
    isSubmitting,
    actionLoadingByScreen,
    setCurrentScreenId,
    handleCreateScreen,
    handleVerifySecurity,
    handleDeleteScreen,
    handleResetMovedAlert,
    handleForceRefresh,
  } = useTVStream(scoped);

  const [tvQrScanOpen, setTvQrScanOpen] = useState(false);
  const [tvQrPairing, setTvQrPairing] = useState(false);

  const text = useMemo(
    () =>
      locale === "ar"
        ? {
            close: "إغلاق",
            newScreen: "شاشة جديدة",
            online: "متصل",
            totalScreens: "إجمالي الشاشات",
            moved: "تنبيه التحرك",
            uptime: "مدة التشغيل 7 أيام",
            empty: "لا توجد شاشة مسجلة لهذا المستأجر.",
            pairUnknown: "لم يُعثر على شاشة لهذا الرمز.",
            scanNewTv: "مسح تلفاز جديد",
            scanNewTitle: "امسح الـ QR المعروض على التلفاز",
            scanNewHint: "على التلفاز : انتقل إلى « عرض QR » ثم وجّه كاميرا هذا الهاتف نحو الشاشة.",
            scanNewBack: "إغلاق",
            scanNewCameraErr: "تعذر تشغيل الكاميرا",
            scanNewOk: "تم ربط التلفاز الجديد!",
            scanNewErr: "رمز QR غير صالح أو جلسة منتهية.",
          }
        : {
            close: "Fermer",
            newScreen: "Nouvel ecran",
            online: "En ligne",
            totalScreens: "Total ecrans",
            moved: "Alerte deplacement",
            uptime: "Uptime 7j (h)",
            empty: scoped
              ? "Aucun ecran enregistre pour ce tenant."
              : "Aucun ecran enregistre. Selectionnez un etablissement ou creez un ecran.",
            pairUnknown: "Aucun ecran ne correspond a ce code.",
            scanNewTv: "Scanner nouveau TV",
            scanNewTitle: "Visez le QR affiche sur la TV",
            scanNewHint: "Sur la TV : basculez sur « Afficher QR » puis pointez la camera de ce telephone vers l'ecran.",
            scanNewBack: "Fermer",
            scanNewCameraErr: "Camera indisponible",
            scanNewOk: "Nouveau TV associe avec succes !",
            scanNewErr: "QR non reconnu ou session expiree.",
          },
    [locale, scoped],
  );

  const showAdminActions = Boolean(scoped);

  const handleTvQrScanned = useCallback(
    async (raw: string) => {
      setTvQrScanOpen(false);
      const sessionToken = extractTvSessionToken(raw);
      if (!sessionToken) {
        toast.error(text.scanNewErr);
        return;
      }
      setTvQrPairing(true);
      try {
        await tvStreamService.pairTvQr(sessionToken, "TV", scoped);
        toast.success(text.scanNewOk);
      } catch {
        toast.error(text.scanNewErr);
      } finally {
        setTvQrPairing(false);
      }
    },
    [scoped, text.scanNewErr, text.scanNewOk],
  );

  useEffect(() => {
    if (loading) return;
    const raw = searchParams.get("pair");
    const code = (raw ?? "").replace(/\D/g, "").slice(0, 6);
    if (!/^\d{6}$/.test(code)) return;
    if (pairHandledRef.current === code) return;

    if (screens.length === 0) {
      pairHandledRef.current = code;
      router.replace(pathname, { scroll: false });
      return;
    }

    pairHandledRef.current = code;
    const match = screens.find((s) => s.pairing_code === code);
    if (match) {
      requestAnimationFrame(() => {
        document.getElementById(`tv-screen-${match.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } else {
      toast.error(text.pairUnknown);
    }

    router.replace(pathname, { scroll: false });
  }, [loading, pathname, router, screens, searchParams, text.pairUnknown]);

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic flex items-center gap-3">
            <Tv className="text-blue-500" size={34} /> TV<span className="text-blue-500">STREAM</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Scanner QR d'un nouveau TV (mode « Afficher QR » sur la TV) */}
            <button
              onClick={() => setTvQrScanOpen(true)}
              disabled={tvQrPairing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-2xl font-black text-sm disabled:opacity-50"
            >
              <ScanLine size={18} /> {text.scanNewTv}
            </button>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="w-full sm:w-auto bg-blue-600 px-6 py-3 rounded-2xl font-black text-sm"
            >
              {isAdding ? text.close : text.newScreen}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={<Signal size={16} />} label={text.online} value={summary?.online_screens ?? 0} />
          <StatCard icon={<Tv size={16} />} label={text.totalScreens} value={summary?.total_screens ?? screens.length} />
          <StatCard icon={<AlertTriangle size={16} />} label={text.moved} value={summary?.moved_alert_count ?? 0} />
          <StatCard
            icon={<Clock3 size={16} />}
            label={text.uptime}
            value={Math.round(((summary?.last_7_days.total_uptime_seconds ?? 0) / 3600) * 10) / 10}
          />
        </div>

        <AnimatePresence>
          {isAdding && (
            <AddScreenForm
              screenName={screenName}
              setScreenName={setScreenName}
              onSubmit={handleCreateScreen}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
          ) : (
            screens.map((s) => (
              <ScreenCard
                key={s.id}
                id={`tv-screen-${s.id}`}
                tenantId={tenantId}
                screen={s}
                onStartPairing={(id: string) => {
                  setCurrentScreenId(id);
                  setStep(3);
                }}
                onDelete={showAdminActions ? handleDeleteScreen : undefined}
                onResetMovedAlert={showAdminActions ? handleResetMovedAlert : undefined}
                onForceRefresh={showAdminActions ? handleForceRefresh : undefined}
                busy={!!actionLoadingByScreen[s.id]}
              />
            ))
          )}
        </div>

        {!loading && screens.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">{text.empty}</div>
        )}
      </div>

      <AnimatePresence>
        {step === 3 && (
          <PairingModal
            code={validationCode}
            setCode={setValidationCode}
            onConfirm={handleVerifySecurity}
            onCancel={() => setStep(1)}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      {/* Modal scanner pour apparier un nouveau TV (QR session) */}
      {tvQrScanOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0f172a] p-4 shadow-xl">
            <TvPairingQrScanner
              active={tvQrScanOpen}
              onDecoded={(raw) => void handleTvQrScanned(raw)}
              onBack={() => setTvQrScanOpen(false)}
              labels={{
                title: text.scanNewTitle,
                hint: text.scanNewHint,
                back: text.scanNewBack,
                cameraError: text.scanNewCameraErr,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function TvStreamPageView({ tenantId }: TvStreamPageViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      }
    >
      <TvStreamPageViewInner tenantId={tenantId} />
    </Suspense>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}
