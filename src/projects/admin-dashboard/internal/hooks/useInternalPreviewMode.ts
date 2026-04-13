"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function appendPreviewParam(href: string, previewMode: boolean) {
  if (!previewMode) return href;
  return href.includes("?") ? `${href}&preview=1` : `${href}?preview=1`;
}

export function useInternalPreviewMode() {
  const pathname = usePathname();
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInternalRoute = pathname.startsWith("/dashboard/internal");
    const nextPreviewMode = isInternalRoute && new URLSearchParams(window.location.search).get("preview") === "1";
    setPreviewMode(nextPreviewMode);
  }, [pathname]);

  return useMemo(() => {
    const isInternalRoute = pathname.startsWith("/dashboard/internal");

    return {
      isInternalRoute,
      previewMode,
      withPreview: (href: string) => appendPreviewParam(href, previewMode),
    };
  }, [pathname, previewMode]);
}