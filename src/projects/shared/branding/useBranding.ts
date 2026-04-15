"use client";

import { useEffect, useState } from "react";

import { useBrandingContext } from "@/src/projects/shared/branding/components/BrandingProvider";
import { brandingService } from "@/src/projects/shared/branding/branding.service";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

export function useBranding() {
  const contextBranding = useBrandingContext();
  const [branding, setBranding] = useState<PublicBranding>(contextBranding || brandingService.getDefaultBranding());
  const [loading, setLoading] = useState(!contextBranding);

  useEffect(() => {
    if (contextBranding) {
      setBranding(contextBranding);
      setLoading(false);
      return;
    }

    let mounted = true;
    brandingService
      .getPublicBranding()
      .then((data) => {
        if (mounted) setBranding(data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [contextBranding]);

  return { branding, loading };
}
