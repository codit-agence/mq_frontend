"use client";

import { ExternalLink, Globe2, QrCode, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { getSiteUrl } from "@/src/core/config/public-env";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

function hostnameFromUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

function isLikelyHexColor(value: string | undefined): boolean {
  if (!value) return false;
  return /^#[0-9A-Fa-f]{3,8}$/.test(value.trim());
}

export function TenantQrModal({
  open,
  onClose,
  qrUrl,
  tenantLabel,
}: {
  open: boolean;
  onClose: () => void;
  qrUrl: string | null;
  /** Nom affiche (etablissement) — utile quand l’URL QR est le fallback qalyas.com */
  tenantLabel?: string | null;
}) {
  const { branding } = useBranding();
  const siteOrigin = getSiteUrl().replace(/\/$/, "");

  const fgColor = isLikelyHexColor(branding.accent_color)
    ? branding.accent_color!.trim()
    : isLikelyHexColor(branding.primary_color)
      ? branding.primary_color!.trim()
      : "#16a34a";

  const markSrc =
    (branding.favicon && (getImageUrl(branding.favicon) || branding.favicon)) ||
    (branding.logo && (getImageUrl(branding.logo) || branding.logo)) ||
    `${siteOrigin}/icon`;

  const siteHost = hostnameFromUrl(qrUrl);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-slate-950/45" onClick={onClose} aria-label="Fermer" />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner overflow-hidden"
              style={{ backgroundColor: fgColor }}
            >
              <QrCode size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-slate-900 truncate">{branding.app_name} · QR</h2>
              {tenantLabel ? (
                <p className="text-xs font-bold text-slate-700 truncate mt-0.5">{tenantLabel}</p>
              ) : null}
              <p className="text-sm text-slate-500 mt-1">
                Code vers le site public (par defaut qalyas.com si aucune URL n&apos;est configuree pour cet etablissement).
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 shrink-0">
            <X size={18} />
          </button>
        </div>

        {siteHost ? (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-bold text-emerald-900">
            <Globe2 size={18} className="shrink-0 text-emerald-600" />
            <span className="truncate">{siteHost}</span>
          </div>
        ) : null}

        <div className="rounded-3xl bg-white border-2 p-5 flex items-center justify-center" style={{ borderColor: `${fgColor}44` }}>
          {qrUrl ? (
            <QRCodeSVG
              value={qrUrl}
              size={228}
              level="H"
              bgColor="#ffffff"
              fgColor={fgColor}
              includeMargin
              imageSettings={{
                src: markSrc,
                height: 52,
                width: 52,
                excavate: true,
              }}
            />
          ) : (
            <p className="text-sm text-slate-500 text-center px-2">QR indisponible.</p>
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
