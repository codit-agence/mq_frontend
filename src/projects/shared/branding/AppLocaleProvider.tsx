"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { PublicBranding } from "@/src/projects/shared/branding/branding.types";

export const APP_LOCALE_STORAGE_KEY = "qalyas-app-locale";
export const APP_LOCALE_COOKIE = "qalyas-locale";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function readStoredAppLocale(): "fr" | "ar" {
  if (typeof window === "undefined") return "fr";
  const cookie = readCookie(APP_LOCALE_COOKIE);
  if (cookie === "fr" || cookie === "ar") return cookie;
  const stored = window.localStorage.getItem(APP_LOCALE_STORAGE_KEY);
  return stored === "ar" ? "ar" : "fr";
}

export function applyDocumentLocale(locale: "fr" | "ar") {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("lang", locale);
  html.setAttribute("dir", locale === "ar" ? "rtl" : "ltr");
}

export type AppLocaleContextValue = {
  locale: "fr" | "ar";
  setLocale: (next: "fr" | "ar") => void;
  isRtl: boolean;
};

const AppLocaleContext = createContext<AppLocaleContextValue | null>(null);

/**
 * Un seul état langue pour toute l’app (évite BrandingRuntime vs pages désynchronisés).
 */
export function AppLocaleProvider({
  branding,
  children,
}: {
  branding: PublicBranding;
  children: ReactNode;
}) {
  const defaultLocale: "fr" | "ar" = branding.default_language === "ar" ? "ar" : "fr";
  const [locale, setLocaleState] = useState<"fr" | "ar">(defaultLocale);

  // useLayoutEffect: applique cookie / localStorage avant la peinture (évite flash FR puis AR).
  useLayoutEffect(() => {
    const cookie = readCookie(APP_LOCALE_COOKIE);
    if (cookie === "fr" || cookie === "ar") {
      setLocaleState(cookie);
      return;
    }
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(APP_LOCALE_STORAGE_KEY)
        : null;
    if (stored === "fr" || stored === "ar") {
      setLocaleState(stored);
      return;
    }
    setLocaleState(defaultLocale);
  }, [defaultLocale]);

  const setLocale = useCallback((next: "fr" | "ar") => {
    setLocaleState(next);
    writeCookie(APP_LOCALE_COOKIE, next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, next);
    }
  }, []);

  useLayoutEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  const value = useMemo<AppLocaleContextValue>(
    () => ({ locale, setLocale, isRtl: locale === "ar" }),
    [locale, setLocale],
  );

  return (
    <AppLocaleContext.Provider value={value}>{children}</AppLocaleContext.Provider>
  );
}

export function useAppLocale(): AppLocaleContextValue {
  const ctx = useContext(AppLocaleContext);
  if (!ctx) {
    throw new Error(
      "useAppLocale doit être utilisé dans <AppLocaleProvider> (voir app/layout.tsx).",
    );
  }
  return ctx;
}
