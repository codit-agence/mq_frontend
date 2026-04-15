"use client";

import { useEffect, useMemo, useState } from "react";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

export const APP_LOCALE_STORAGE_KEY = "qalyas-app-locale";

export function readStoredAppLocale(): "fr" | "ar" {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);
  return stored === "ar" ? "ar" : "fr";
}

/** Met à jour <html lang dir> pour l’UI client (hors console internal). */
export function applyDocumentLocale(locale: "fr" | "ar") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("lang", locale === "ar" ? "ar" : "fr");
  html.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
}

export function useAppLocale(branding: PublicBranding) {
  const defaultLocale = useMemo(() => {
    const candidate = branding.default_language === "ar" ? "ar" : "fr";
    return candidate;
  }, [branding.default_language]);

  const [locale, setLocale] = useState<"fr" | "ar">(defaultLocale);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(APP_LOCALE_STORAGE_KEY) : null;
    if (stored === "fr" || stored === "ar") {
      setLocale(stored);
      return;
    }
    setLocale(defaultLocale);
  }, [defaultLocale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    }
  }, [locale]);

  useEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  return {
    locale,
    setLocale,
    isRtl: locale === "ar",
  };
}
