"use client";

import { Globe2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { resolveTenantQrUrl } from "@/src/projects/client-dashboard/tenant/tenant-qr";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

function isLikelyHex(value: string | null | undefined): boolean {
  if (!value) return false;
  return /^#[0-9A-Fa-f]{3,8}$/.test(value.trim());
}

function hostnameFromUrl(url: string): string | null {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function TenantQrBadge({ manifest }: { manifest: TVManifest }) {
  const qrUrl = resolveTenantQrUrl({
    public_landing_url: manifest.tenant.public_landing_url,
    qr_redirect_url: manifest.tenant.qr_redirect_url,
    qr_slug: manifest.tenant.qr_slug,
  });

  if (!qrUrl || manifest.tenant.qr_is_active === false) {
    return (
      <div className="mt-2 h-20 rounded-lg bg-white/15 text-white text-[11px] font-bold flex items-center justify-center text-center px-2">
        QR indisponible
      </div>
    );
  }

  const primary = manifest.tenant.primary_color;
  const fg = primary && isLikelyHex(primary) ? primary.trim() : "#15803d";
  const logo = manifest.tenant.logo ? getImageUrl(manifest.tenant.logo) : null;
  const host = hostnameFromUrl(qrUrl);

  return (
    <div className="mt-2 rounded-lg bg-white p-2 space-y-1.5">
      {host ? (
        <div className="flex items-center justify-center gap-1 text-[10px] font-black text-emerald-800 truncate px-1">
          <Globe2 size={12} className="shrink-0" />
          <span className="truncate">{host}</span>
        </div>
      ) : null}
      <div className="flex items-center justify-center">
        <QRCodeSVG
          value={qrUrl}
          size={72}
          level="H"
          bgColor="#ffffff"
          fgColor={fg}
          includeMargin={false}
          imageSettings={
            logo
              ? {
                  src: logo,
                  height: 22,
                  width: 22,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
