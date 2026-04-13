"use client";

import { useEffect, useMemo, useState } from "react";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

const LOCALE_STORAGE_KEY = "qalyas-app-locale";

export function useAppLocale(branding: PublicBranding) {
  const defaultLocale = useMemo(() => {
    const candidate = branding.default_language === "ar" ? "ar" : "fr";
    return candidate;
  }, [branding.default_language]);

  const [locale, setLocale] = useState<"fr" | "ar">(defaultLocale);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(LOCALE_STORAGE_KEY) : null;
    if (stored === "fr" || stored === "ar") {
      setLocale(stored);
      return;
    }
    setLocale(defaultLocale);
  }, [defaultLocale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  return {
    locale,
    setLocale,
    isRtl: locale === "ar",
  };
}
