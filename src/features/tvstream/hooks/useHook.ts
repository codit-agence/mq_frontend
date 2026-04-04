"use client";
import { useState, useEffect, useCallback } from "react";
import { Screen } from "@/src/types/tvstream/tvstream";
import { tvStreamService } from "../services/tvstream.service";

export function useScreens() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScreens = useCallback(async () => {
    try {
      const data = await tvStreamService.fetchScreens();
      setScreens(data);
    } catch (err) {
      console.error("Erreur listing:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScreens();
    const interval = setInterval(fetchScreens, 10000);
    return () => clearInterval(interval);
  }, [fetchScreens]);

  const createScreen = async (name: string) => {
    await tvStreamService.createScreen({ name });
    await fetchScreens();
  };

  const verifySecurity = async (id: string, code: string) => {
    await tvStreamService.verifySecurityCode(id, code);
    await fetchScreens();
  };

  return { screens, loading, createScreen, verifySecurity, refresh: fetchScreens };
}