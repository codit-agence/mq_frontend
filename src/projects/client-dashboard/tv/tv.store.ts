import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TVControlTransport, TVDeviceTier, TVManifest } from "./tv.types";

interface TVStoreState {
  accessToken: string | null;
  screenId: string | null;
  template: string;
  manifest: TVManifest | null;
  welcomeUntil: number | null;
  hasHydrated: boolean;
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
  setHydrated: (value: boolean) => void;
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
      hasHydrated: false,
      controlTransport: "polling",
      pollIntervalSeconds: 30,
      gpsRequired: true,
      deviceTier: "standard",

      setAuth: (id, token) =>
        set({
          screenId: id,
          accessToken: token,
          welcomeUntil: Date.now() + 2500,
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
      setHydrated: (value) => set({ hasHydrated: value }),
      logout: () => set({
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
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
