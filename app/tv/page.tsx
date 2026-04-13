"use client";

import React, { useEffect, useState } from "react";
import { useTVHeartbeat } from "@/src/projects/client-dashboard/tv/useTVHeartbeat";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import TemplateManager from "./componenents/TemplateManager";
import PairingScreen from "./componenents/PairingScreen";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTvSocket } from "@/src/projects/client-dashboard/socket-tv/useTvSocket";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

async function loadTvManifest(accessToken: string, setManifest: (manifest: any) => void) {
  try {
    const data = await tvApi.getManifest(accessToken);
    setManifest(data);
  } catch (error) {
    console.error("Manifest TV introuvable:", error);
  }
}

const TVApp: React.FC = () => {
  const {
    accessToken,
    template,
    manifest,
    setManifest,
    setTemplate,
    setControlConfig,
    welcomeUntil,
    clearWelcome,
    hasHydrated,
    controlTransport,
    pollIntervalSeconds,
  } = useTVStore();
  const [productIndex, setProductIndex] = useState(0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Heartbeat only when TV has a valid screen token.
  useTVHeartbeat(30000);

  useTvSocket(controlTransport === "websocket" ? accessToken : null, (envelope) => {
    if (envelope.system !== "tv" || !accessToken) return;

    const payload = (envelope.payload || {}) as {
      action?: string;
      payload?: {
        current_template?: string;
        needs_refresh?: boolean;
        transport_mode?: "polling" | "websocket";
        device_tier?: "standard" | "light";
        poll_interval_seconds?: number;
        gps_required?: boolean;
      };
    };
    const action = payload.action;
    const actionPayload = payload.payload || {};

    if (action === "FORCE_REFRESH") {
      window.location.reload();
      return;
    }

    if (action === "CONFIG_SYNC") {
      if (actionPayload.current_template) {
        setTemplate(actionPayload.current_template);
      }
      setControlConfig({
        transportMode: actionPayload.transport_mode,
        pollIntervalSeconds: actionPayload.poll_interval_seconds,
        gpsRequired: actionPayload.gps_required,
        deviceTier: actionPayload.device_tier,
      });
      if (actionPayload.needs_refresh) {
        window.location.reload();
        return;
      }
    }

    if (action === "CONFIG_SYNC" || action === "MANIFEST_REFRESH") {
      void loadTvManifest(accessToken, setManifest);
    }
  });

  useEffect(() => {
    if (!accessToken) return;

    let interval: NodeJS.Timeout | null = null;

    void loadTvManifest(accessToken, setManifest);
    if (controlTransport === "polling") {
      interval = setInterval(() => {
        void loadTvManifest(accessToken, setManifest);
      }, Math.max(pollIntervalSeconds, 10) * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [accessToken, setManifest, controlTransport, pollIntervalSeconds]);

  useEffect(() => {
    if (!manifest?.products?.length) return;
    const delay = (manifest.slot_duration || 10) * 1000;
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % manifest.products.length);
    }, delay);
    return () => clearInterval(interval);
  }, [manifest?.products?.length, manifest?.slot_duration]);

  const playlist = (manifest?.audio_playlist || []).filter(Boolean);
  const hasPlaylist = playlist.length > 0;
  const currentAudio = hasPlaylist ? playlist[audioIndex % playlist.length] : manifest?.audio_url || null;

  useEffect(() => {
    setAudioIndex(0);
  }, [manifest?.audio_playlist, manifest?.audio_url]);

  useEffect(() => {
    if (!welcomeUntil) {
      setShowWelcome(false);
      return;
    }
    setShowWelcome(true);
    const remaining = Math.max(0, welcomeUntil - Date.now());
    const timer = setTimeout(() => {
      setShowWelcome(false);
      clearWelcome();
    }, remaining);
    return () => clearTimeout(timer);
  }, [welcomeUntil, clearWelcome]);

  if (!hasHydrated) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300 font-bold">Initialisation TV...</p>
      </div>
    );
  }

  if (!accessToken) {
    return <PairingScreen />;
  }

  if (showWelcome) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black">Bienvenue</h1>
        <p className="text-slate-400 text-lg mt-3">Connexion réussie. Préparation du menu TV...</p>
      </div>
    );
  }

  if (!manifest || !manifest.products?.length) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300 font-bold">Chargement du template...</p>
      </div>
    );
  }

  return (
    <div
      className="tv-container relative"
      onClick={() => setIsMuted(false)}
    >
      {currentAudio && (
        <audio
          key={`${currentAudio}-${audioIndex}`}
          src={getImageUrl(currentAudio)}
          autoPlay
          loop={!hasPlaylist}
          muted={isMuted}
          preload="auto"
          onEnded={() => {
            if (hasPlaylist) {
              setAudioIndex((prev) => (prev + 1) % playlist.length);
            }
          }}
        />
      )}
      {currentAudio && isMuted && (
        <div className="absolute top-4 right-4 z-50 px-3 py-2 rounded-xl bg-black/60 text-white text-xs font-black">
          Cliquer pour activer le son
        </div>
      )}
      <TemplateManager type={manifest.template_name || template} manifest={manifest} productIndex={productIndex} />
    </div>
  );
};

export default TVApp;
