"use client";

import { useEffect, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Props = {
  children: React.ReactNode;
  /** Affiche une barre d’installation (mobile / Chrome) */
  showInstallBar?: boolean;
};

/**
 * Enregistre le SW sous /tv/sw.js et capte beforeinstallprompt.
 * L’installation « automatique » n’existe pas sur le web : on propose un bouton dès que le navigateur l’autorise.
 */
export default function TvPwaShell({ children, showInstallBar = true }: Props) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const swRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    let cancelled = false;
    void navigator.serviceWorker
      .register("/tv/sw.js", { scope: "/tv/" })
      .then((reg) => {
        if (!cancelled) swRef.current = reg;
      })
      .catch(() => {
        /* HTTP local sans HTTPS : ignoré */
      });

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const runInstall = async () => {
    if (!deferred || busy) return;
    setBusy(true);
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setBusy(false);
      setDeferred(null);
    }
  };

  return (
    <>
      {children}
      {showInstallBar && !installed && !dismissed && deferred && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[100] flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-md"
          dir="ltr"
        >
          <div className="min-w-0 flex-1">
            <p className="font-black text-white">Installer l’app TV</p>
            <p className="text-xs text-slate-400 mt-0.5">
              FR : Ajoutez à l’écran d’accueil pour un plein écran plus stable. · AR : أضف التطبيق إلى الشاشة الرئيسية
              pour عرض أوضح.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800"
            >
              Plus tard
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void runInstall()}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              {busy ? "…" : "Installer"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
