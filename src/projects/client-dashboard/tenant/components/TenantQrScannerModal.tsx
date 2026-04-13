"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, ScanLine } from "lucide-react";

export function TenantQrScannerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrRef = useRef<any>(null);
  const [scanResult, setScanResult] = useState<string>("");
  const [scanError, setScanError] = useState<string>("");

  useEffect(() => {
    if (!open || !scannerRef.current) return;

    let mounted = true;

    const setup = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted || !scannerRef.current) return;

        const scanner = new Html5Qrcode("tenant-qr-scanner");
        html5QrRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText: string) => {
            setScanResult(decodedText);
            setScanError("");
          },
          () => undefined
        );
      } catch (error) {
        setScanError("Impossible d'ouvrir la camera ou de lancer le scan.");
      }
    };

    setup();

    return () => {
      mounted = false;
      const scanner = html5QrRef.current;
      if (scanner) {
        scanner.stop().catch(() => undefined).finally(() => {
          scanner.clear().catch(() => undefined);
          html5QrRef.current = null;
        });
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/45" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Camera size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Scanner QR client</h2>
              <p className="text-sm text-slate-500">Lecture camera uniquement pour l'instant.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="rounded-3xl bg-slate-950 p-3">
          <div id="tenant-qr-scanner" ref={scannerRef} className="min-h-[280px] rounded-2xl overflow-hidden bg-black" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex items-center gap-2 font-black text-slate-700 uppercase tracking-wider text-[11px] mb-2">
            <ScanLine size={14} /> Resultat
          </div>
          {scanResult ? <p className="break-all text-slate-800">{scanResult}</p> : <p className="text-slate-500">Aucun QR detecte.</p>}
          {scanError ? <p className="mt-2 text-rose-600">{scanError}</p> : null}
        </div>
      </div>
    </div>
  );
}