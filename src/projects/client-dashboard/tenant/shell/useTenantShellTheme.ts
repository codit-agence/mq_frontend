"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "qalyas-tenant-shell-theme";

export type TenantShellTheme = "light" | "dark";

export function useTenantShellTheme() {
  const [theme, setThemeState] = useState<TenantShellTheme>("light");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "dark" || raw === "light") {
        setThemeState(raw);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setTheme = useCallback((next: TenantShellTheme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { theme, setTheme };
}
