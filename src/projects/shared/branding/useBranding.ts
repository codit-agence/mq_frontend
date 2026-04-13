"use client";

import { useEffect, useState } from "react";

import { brandingService } from "@/src/projects/shared/branding/branding.service";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

export function useBranding() {
  const [branding, setBranding] = useState<PublicBranding>(brandingService.getDefaultBranding());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return { branding, loading };
}
