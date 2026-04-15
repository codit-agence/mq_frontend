import type { CSSProperties } from "react";

import type { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

export function getAuthPageBackgroundStyle(branding: PublicBranding): CSSProperties {
  if (branding.login_background) {
    return {
      backgroundColor: "#ffffff",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.78), rgba(255,255,255,0.88)), url(${getImageUrl(branding.login_background)})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    };
  }

  return {
    background: `linear-gradient(145deg, ${branding.app_background_color}, #ffffff 48%, ${branding.primary_color}12)`,
  };
}