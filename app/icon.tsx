import { ImageResponse } from "next/og";

import { getBackendOrigin } from "@/src/core/config/public-env";
import { getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export const size = {
  width: 256,
  height: 256,
};

export const contentType = "image/png";

function toAbsoluteAssetUrl(path?: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendOrigin()}${cleanPath}`;
}

export default async function Icon() {
  const branding = await getPublicBrandingServer();
  const iconSrc = toAbsoluteAssetUrl(branding.favicon || branding.logo);
  const fallbackLetter = (branding.app_name || "Q").trim().charAt(0).toUpperCase() || "Q";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
          borderRadius: 56,
          border: "10px solid rgba(15,23,42,0.06)",
        }}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={branding.app_name}
            width={180}
            height={180}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              height: 180,
              width: 180,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 42,
              background: branding.primary_color,
              color: "#ffffff",
              fontSize: 112,
              fontWeight: 800,
            }}
          >
            {fallbackLetter}
          </div>
        )}
      </div>
    ),
    size,
  );
}