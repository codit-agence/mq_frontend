"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTVHeartbeat } from "@/src/projects/client-dashboard/tv/useTVHeartbeat";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import TemplateManager from "./componenents/TemplateManager";
import PairingScreen from "./componenents/PairingScreen";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTvSocket } from "@/src/projects/client-dashboard/socket-tv/useTvSocket";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import type { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";

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
    controlTransport,
    pollIntervalSeconds,
    logout,
  } = useTVStore();
  const [productIndex, setProductIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  // Commence muet pour satisfaire la politique autoplay des navigateurs,
  // puis se démute automatiquement après 2 s (TV = pas d'interaction humaine).
  const [isMuted, setIsMuted] = useState(true);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoUnmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadManifest = useCallback(async () => {
    if (!accessToken) return;
    setManifestError(null);
    try {
      const data = await tvApi.getManifest(accessToken);
      setManifest(data as TVManifest);
    } catch (error: unknown) {
      console.error("Manifest TV:", error);
      const ax = error as { response?: { status?: number; data?: unknown } };
      const st = ax.response?.status;
      // Token révoqué (reset-pairing ou suppression) → retour au PairingScreen
      if (st === 401 || st === 404) {
        logout();
        return;
      }
      const hint = st
        ? `Erreur API (${st}). Vérifiez NEXT_PUBLIC_API_URL et les logs serveur.`
        : "Réseau ou CORS : vérifiez NEXT_PUBLIC_API_URL (URL atteignable depuis la TV, ex. http://IP:8000/api).";
      setManifestError(`Impossible de charger le contenu. ${hint}`);
    }
  }, [accessToken, setManifest, logout]);

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
      void loadManifest();
    }
  });

  useEffect(() => {
    if (!accessToken) return;

    setManifest(null);
    setManifestError(null);
    void loadManifest();

    let interval: ReturnType<typeof setInterval> | null = null;
    if (controlTransport === "polling") {
      interval = setInterval(() => {
        void loadManifest();
      }, Math.max(pollIntervalSeconds, 10) * 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [accessToken, setManifest, controlTransport, pollIntervalSeconds, loadManifest]);

  useEffect(() => {
    if (!manifest?.products?.length) return;
    const delay = (manifest.slot_duration || 10) * 1000;
    const interval = setInterval(() => {
      setProductIndex((prev) => (prev + 1) % manifest.products.length);
    }, delay);
    return () => clearInterval(interval);
  }, [manifest?.products?.length, manifest?.slot_duration]);

  // ─── Audio engine ────────────────────────────────────────────────────────
  // Règle : UN SEUL élément <audio> toujours monté, src/loop/muted pilotés
  // exclusivement via le ref DOM (contourne les bugs React muted/src prop).

  const [audioIndex, setAudioIndex] = useState(0);
  const [playCount, setPlayCount] = useState(0);

  const playlistTracks = manifest?.audio_playlist?.tracks ?? [];
  const hasPlaylist = playlistTracks.length > 0;
  const playlistMode = manifest?.audio_playlist?.mode ?? "repeat";
  const repeatCount = manifest?.audio_playlist?.repeat_count ?? 1;

  const currentTrack = hasPlaylist
    ? playlistTracks[audioIndex % playlistTracks.length]
    : null;
  const currentAudioUrl = currentTrack?.url ?? manifest?.audio_url ?? null;

  // Reset index quand le manifest change de source
  useEffect(() => {
    setAudioIndex(0);
    setPlayCount(0);
  }, [manifest?.audio_playlist, manifest?.audio_url]);

  // Synchronise src + loop + joue — se déclenche quand la piste active change
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!currentAudioUrl) {
      el.pause();
      el.removeAttribute("src");
      if (autoUnmuteTimerRef.current) clearTimeout(autoUnmuteTimerRef.current);
      return;
    }
    const newSrc = getImageUrl(currentAudioUrl);
    el.loop = !hasPlaylist;
    el.muted = isMuted; // commence muet pour autoplay
    if (el.src !== newSrc) {
      el.src = newSrc;
      el.load();
    }
    el.play().catch(() => {/* autoplay policy — ignoré */});

    // Auto-démutage après 2 s : l'audio joue déjà (muet), on lève juste muted
    if (autoUnmuteTimerRef.current) clearTimeout(autoUnmuteTimerRef.current);
    autoUnmuteTimerRef.current = setTimeout(() => {
      setIsMuted(false);
    }, 2000);

    return () => {
      if (autoUnmuteTimerRef.current) clearTimeout(autoUnmuteTimerRef.current);
    };
  // playCount déclenche aussi l'effet pour rejouer la même piste en mode repeat
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioUrl, playCount]);

  // Synchronise uniquement muted (sans toucher à src ni recharger)
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = isMuted;
    if (!isMuted && el.src) {
      el.play().catch(() => {/* autoplay policy */});
    }
  }, [isMuted]);

  const handleAudioEnded = () => {
    if (!hasPlaylist) return;
    if (playlistMode === "repeat") {
      const next = playCount + 1;
      if (next < repeatCount) {
        setPlayCount(next);          // rejouer même piste
      } else {
        setPlayCount(0);
        setAudioIndex((p) => (p + 1) % playlistTracks.length);
      }
    } else {
      // shuffle : piste suivante
      setAudioIndex((p) => (p + 1) % playlistTracks.length);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

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

  if (!accessToken) {
    return <PairingScreen />;
  }

  if (showWelcome) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black">Bienvenue</h1>
        <p className="text-slate-400 text-lg mt-3">Connexion réussie. Chargement du contenu…</p>
      </div>
    );
  }

  const hasProducts = Boolean(manifest?.products?.length);

  if (manifestError) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-slate-200 font-bold text-lg max-w-lg">{manifestError}</p>
        <button
          type="button"
          onClick={() => void loadManifest()}
          className="px-8 py-4 rounded-2xl bg-yellow-500 text-slate-900 font-black text-lg hover:bg-yellow-400"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!manifest) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-300 font-bold">Chargement du contenu…</p>
        <p className="text-slate-500 text-sm">Pas d’écran d’initialisation bloquant — si cela dure, vérifiez l’API /manifest.</p>
      </div>
    );
  }

  if (!hasProducts) {
    return (
      <div className="h-screen w-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-slate-200 font-bold text-xl">Aucun produit à afficher pour l’instant</p>
        <p className="text-slate-500 max-w-md">
          Créez un planning actif ou des produits disponibles dans le catalogue. Le flux se mettra à jour automatiquement.
        </p>
        <button
          type="button"
          onClick={() => void loadManifest()}
          className="px-8 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700"
        >
          Actualiser
        </button>
      </div>
    );
  }

  return (
    <div className="tv-container relative" onClick={() => setIsMuted(false)}>
      {/* Élément audio unique, toujours monté — src/muted/loop gérés via ref */}
      <audio ref={audioRef} muted preload="auto" onEnded={handleAudioEnded} />

      {/* Bouton démutage visible uniquement si source audio disponible */}
      {currentAudioUrl && isMuted && (
        <button
          type="button"
          className="absolute top-4 right-4 z-50 px-3 py-2 rounded-xl bg-black/60 text-white text-xs font-black flex items-center gap-2 hover:bg-black/80 transition"
          onClick={(e) => { e.stopPropagation(); setIsMuted(false); }}
        >
          🔇 Activer le son
        </button>
      )}
      {/* Badge créneau actif quand le son joue */}
      {currentAudioUrl && !isMuted && manifest?.audio_playlist && (
        <div className="absolute top-4 right-4 z-50 px-3 py-2 rounded-xl bg-black/50 text-white text-xs font-black pointer-events-none">
          🎵 {manifest.audio_playlist.category} · {manifest.audio_playlist.slot_label}
        </div>
      )}

      <TemplateManager type={manifest.template_name || template} manifest={manifest} productIndex={productIndex} />
    </div>
  );
};

export default TVApp;
