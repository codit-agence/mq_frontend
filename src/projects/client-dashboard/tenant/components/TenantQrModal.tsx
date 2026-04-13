"use client";

import { QrCode, X, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function TenantQrModal({
  open,
  onClose,
  qrUrl,
}: {
  open: boolean;
  onClose: () => void;
  qrUrl: string | null;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/45" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
              <QrCode size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">QR tenant</h2>
              <p className="text-sm text-slate-500">Scannez pour ouvrir le lien client.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex items-center justify-center">
          {qrUrl ? (
            <QRCodeSVG value={qrUrl} size={220} bgColor="#ffffff" fgColor="#0f172a" includeMargin />
          ) : (
            <p className="text-sm text-slate-500">QR indisponible pour ce tenant.</p>
          )}
        </div>

        {qrUrl && (
          <a
            href={qrUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 hover:bg-slate-100"
          >
            <span className="truncate">{qrUrl}</span>
            <ExternalLink size={16} className="shrink-0" />
          </a>
        )}
      </div>
    </div>
  );
}