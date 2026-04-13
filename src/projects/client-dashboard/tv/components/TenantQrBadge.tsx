"use client";

import { QRCodeSVG } from "qrcode.react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { resolveTenantQrUrl } from "@/src/projects/client-dashboard/tenant/tenant-qr";

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

  return (
    <div className="mt-2 rounded-lg bg-white p-2 flex items-center justify-center">
      <QRCodeSVG value={qrUrl} size={72} bgColor="#ffffff" fgColor="#0f172a" includeMargin={false} />
    </div>
  );
}