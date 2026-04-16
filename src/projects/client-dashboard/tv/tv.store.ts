import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TVControlTransport, TVDeviceTier, TVManifest } from "./tv.types";

interface TVStoreState {
  accessToken: string | null;
  screenId: string | null;
  template: string;
  manifest: TVManifest | null;
  welcomeUntil: number | null;
  controlTransport: TVControlTransport;
  pollIntervalSeconds: number;
  gpsRequired: boolean;
  deviceTier: TVDeviceTier;
  setAuth: (id: string, token: string) => void;
  setTemplate: (template: string) => void;
  setManifest: (manifest: TVManifest | null) => void;
  setControlConfig: (config: {
    transportMode?: TVControlTransport;
    pollIntervalSeconds?: number;
    gpsRequired?: boolean;
    deviceTier?: TVDeviceTier;
  }) => void;
  clearWelcome: () => void;
  logout: () => void;
}

export const useTVStore = create<TVStoreState>()(
  persist(
    (set) => ({
      accessToken: null,
      screenId: null,
      template: "classic",
      manifest: null,
      welcomeUntil: null,
      controlTransport: "polling",
      pollIntervalSeconds: 30,
      gpsRequired: true,
      deviceTier: "standard",

      setAuth: (id, token) =>
        set({
          screenId: id,
          accessToken: token,
          // Quelques secondes pour lire l’écran d’accueil bilingue (logo, site, téléphone).
          welcomeUntil: Date.now() + 6500,
        }),
      setTemplate: (template) => set({ template }),
      setManifest: (manifest) => set({ manifest }),
      setControlConfig: ({ transportMode, pollIntervalSeconds, gpsRequired, deviceTier }) =>
        set((state) => ({
          controlTransport: transportMode || state.controlTransport,
          pollIntervalSeconds: Math.max(pollIntervalSeconds || state.pollIntervalSeconds || 30, 10),
          gpsRequired: gpsRequired ?? state.gpsRequired,
          deviceTier: deviceTier || state.deviceTier,
        })),
      clearWelcome: () => set({ welcomeUntil: null }),
      logout: () =>
        set({
          accessToken: null,
          screenId: null,
          manifest: null,
          welcomeUntil: null,
          controlTransport: "polling",
          pollIntervalSeconds: 30,
          gpsRequired: true,
          deviceTier: "standard",
        }),
    }),
    {
      name: "tv-storage",
      partialize: (s) => ({
        accessToken: s.accessToken,
        screenId: s.screenId,
        template: s.template,
        welcomeUntil: s.welcomeUntil,
        controlTransport: s.controlTransport,
        pollIntervalSeconds: s.pollIntervalSeconds,
        gpsRequired: s.gpsRequired,
        deviceTier: s.deviceTier,
      }),
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") {
          return current;
        }
        const p = persisted as Partial<TVStoreState>;
        return {
          ...current,
          accessToken: p.accessToken ?? current.accessToken,
          screenId: p.screenId ?? current.screenId,
          template: p.template ?? current.template,
          welcomeUntil: p.welcomeUntil ?? current.welcomeUntil,
          controlTransport: p.controlTransport ?? current.controlTransport,
          pollIntervalSeconds: p.pollIntervalSeconds ?? current.pollIntervalSeconds,
          gpsRequired: p.gpsRequired ?? current.gpsRequired,
          deviceTier: p.deviceTier ?? current.deviceTier,
        };
      },
    }
  )
);
