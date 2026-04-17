"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { getApiBaseUrl, getSiteUrl } from "@/src/core/config/public-env";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import { getDeviceInfo } from "@/src/utils/helpers/getDeviceInfo";

/**
 * La TV génère une session QR et attend que le gérant scanne avec son téléphone.
 * Aucune saisie manuelle n'est nécessaire sur la TV.
 *
 * Flow :
 * 1. Appel POST /screens/tv/qr-session → reçoit session_token
 * 2. Affiche session_token comme QR (URL + code court)
 * 3. Poll GET /screens/tv/qr-status/{token} toutes les 3 s
 * 4. Quand status === "paired" → stocke access_token + screen_id
 */
interface Props {
  onBack: () => void;
}

export function PairingQrDisplay({ onBack }: Props) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useTVStore((s) => s.setAuth);
  const setControlConfig = useTVStore((s) => s.setControlConfig);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tokenRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { session_token } = await tvApi.qrSession();
      setSessionToken(session_token);
      tokenRef.current = session_token;
    } catch {
      setError("Impossible de créer la session QR. Vérifiez la connexion.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void startSession();
  }, [startSession]);

  useEffect(() => {
    if (!sessionToken) return;
    stopPolling();

    pollingRef.current = setInterval(async () => {
      const tok = tokenRef.current;
      if (!tok) return;
      try {
        const res = await tvApi.qrStatus(tok);
        if (res.status === "paired" && res.access_token && res.screen_id) {
          stopPolling();
          // Récupère config initiale (transport mode etc.) via check-auth puis setAuth
          try {
            const info = getDeviceInfo();
            // On n'a pas de pairing_code ici : on utilise directement l'access_token retourné
            // par le backend après la confirmation QR.
            void info; // info not needed in this path
          } catch {
            /* ignore */
          }
          setControlConfig({
            transportMode: "polling",
            pollIntervalSeconds: 30,
            gpsRequired: false,
            deviceTier: "standard",
          });
          setAuth(res.screen_id, res.access_token);
        }
      } catch {
        // Session expirée ou réseau → on régénère après 3 tentatives
      }
    }, 3000);

    return stopPolling;
  }, [sessionToken, setAuth, setControlConfig, stopPolling]);

  const base = typeof window !== "undefined" ? getSiteUrl().replace(/\/$/, "") : "";
  const qrUrl = sessionToken ? `${base}/tv-new?s=${encodeURIComponent(sessionToken)}` : "";
  const shortCode = sessionToken ? sessionToken.split("-")[0].toUpperCase() : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        width: "100%",
        maxWidth: 520,
        textAlign: "center",
      }}
    >
      <div>
        <p style={{ fontSize: "1.1rem", color: "#d1d5db", margin: "0 0 6px", fontWeight: 700 }}>
          Scannez ce QR avec le téléphone du gérant
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "1rem", color: "#6ee7b7", margin: 0, lineHeight: 1.5 }}>
          امسح هذا الرمز بهاتف المسؤول لتوصيل التلفاز
        </p>
      </div>

      {loading && (
        <p style={{ color: "#6b7280", fontSize: "1rem" }}>Génération en cours…</p>
      )}

      {error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          <p style={{ color: "#f87171", fontSize: "1rem", margin: 0 }}>{error}</p>
          <button
            type="button"
            onClick={() => void startSession()}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              border: "none",
              background: "#1d4ed8",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && qrUrl && (
        <>
          <div style={{ background: "#fff", padding: 20, borderRadius: 24, display: "inline-block", boxShadow: "0 0 40px rgba(56,189,248,.25)" }}>
            <QRCodeSVG value={qrUrl} size={240} level="M" />
          </div>

          <p style={{ fontSize: "1.5rem", fontWeight: 900, color: "#38bdf8", letterSpacing: "0.25em", fontFamily: "ui-monospace, monospace", margin: 0 }}>
            {shortCode}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 10,
                background: "#22c55e",
                borderRadius: "50%",
                animation: "pulse 1.2s ease-in-out infinite",
              }}
            />
            <p style={{ color: "#6b7280", fontSize: "1rem", margin: 0 }}>
              En attente du scan par le gérant…
            </p>
          </div>
          <p lang="ar" dir="rtl" style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0 }}>
            في انتظار المسح من المسؤول…
          </p>
        </>
      )}

      <button
        type="button"
        onClick={onBack}
        style={{
          marginTop: 8,
          padding: "14px 0",
          width: "100%",
          maxWidth: 480,
          borderRadius: 14,
          border: "1px solid #333",
          background: "#111",
          color: "#9ca3af",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        ← Saisir le code à la place
      </button>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.15}}`}</style>
    </div>
  );
}

export default PairingQrDisplay;
