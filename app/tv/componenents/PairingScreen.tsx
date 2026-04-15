"use client";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import { getDeviceInfo } from "@/src/utils/helpers/getDeviceInfo";
import React, { useEffect, useRef, useState } from "react";

const PairingScreen: React.FC = () => {
  const [pairingCode, setPairingCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displaySecurityCode, setDisplaySecurityCode] = useState("");
  const [screenId, setScreenId] = useState<string | null>(null);
  const [isWaitingForSecurity, setIsWaitingForSecurity] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setAuth = useTVStore((s) => s.setAuth);
  const setControlConfig = useTVStore((s) => s.setControlConfig);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleInit = async (code: string) => {
    const clean = code.trim();
    if (clean.length !== 6) {
      setError("Entrez exactement 6 chiffres.");
      return;
    }
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const info = getDeviceInfo();
      const res = await tvApi.initialize(clean, info);
      setScreenId(res.screen_id);
      setDisplaySecurityCode(res.security_code);
      setControlConfig({
        transportMode: res.transport_mode,
        pollIntervalSeconds: res.poll_interval_seconds,
        gpsRequired: res.gps_required,
        deviceTier: res.device_tier,
      });
      setIsWaitingForSecurity(true);
    } catch {
      setError("Code invalide ou expiré. Vérifiez le code affiché dans le Dashboard.");
      setPairingCode("");
      setTimeout(() => inputRef.current?.focus(), 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setPairingCode(digits);
    setError(null);
    if (digits.length === 6) {
      void handleInit(digits);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleInit(pairingCode);
    }
  };

  // Poll check-auth after TV sends its code
  useEffect(() => {
    if (!isWaitingForSecurity || !screenId) return;
    const poll = setInterval(async () => {
      try {
        const authStatus = await tvApi.checkAuthStatus(screenId);
        if (authStatus.security_code && !displaySecurityCode) {
          setDisplaySecurityCode(authStatus.security_code);
        }
        if (authStatus.is_paired && authStatus.access_token) {
          setControlConfig({
            transportMode: authStatus.transport_mode,
            pollIntervalSeconds: authStatus.poll_interval_seconds,
            gpsRequired: authStatus.gps_required,
            deviceTier: authStatus.device_tier,
          });
          setAuth(screenId, authStatus.access_token);
          clearInterval(poll);
        }
      } catch {
        // silently wait
      }
    }, 3000);
    return () => clearInterval(poll);
  }, [isWaitingForSecurity, screenId, displaySecurityCode, setAuth, setControlConfig]);

  /* ── SECURITY CODE SCREEN ─────────────────────────────────────────── */
  if (isWaitingForSecurity) {
    return (
      <div style={styles.page}>
        <p style={{ fontSize: "1.4rem", color: "#aaa", margin: 0 }}>
          Code de sécurité — à confirmer sur le Dashboard
        </p>

        <div style={{ display: "flex", gap: "20px", margin: "12px 0" }}>
          {(displaySecurityCode || "----").split("").map((ch, i) => (
            <div key={i} style={styles.secBox}>
              {ch}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={styles.dot} />
          <p style={{ fontSize: "1.1rem", color: "#555", margin: 0 }}>
            En attente de confirmation par le gérant…
          </p>
        </div>

        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.15}}`}</style>
      </div>
    );
  }

  /* ── PAIRING CODE FORM ────────────────────────────────────────────── */
  return (
    <div style={styles.page}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 900, margin: "0 0 12px" }}>
          Connexion TV
        </h1>
        <p style={{ fontSize: "1.3rem", color: "#777", margin: 0 }}>
          Entrez le code à 6 chiffres affiché sur votre Dashboard
        </p>
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={pairingCode}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="______"
          maxLength={6}
          style={{
            width: "100%",
            fontSize: "4.5rem",
            fontWeight: 900,
            textAlign: "center",
            letterSpacing: "18px",
            padding: "20px 16px",
            background: "#111",
            border: `3px solid ${error ? "#f44336" : pairingCode.length === 6 ? "#2196f3" : "#333"}`,
            borderRadius: "18px",
            color: "#2196f3",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />

        {error && (
          <p style={{
            color: "#f44336",
            fontSize: "1rem",
            textAlign: "center",
            marginTop: "12px",
          }}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleInit(pairingCode)}
          disabled={isLoading}
          style={{
            width: "100%",
            marginTop: "24px",
            fontSize: "1.5rem",
            fontWeight: "bold",
            padding: "18px",
            borderRadius: "14px",
            border: "none",
            background: isLoading ? "#1a1a1a" : "#2196f3",
            color: isLoading ? "#444" : "white",
            cursor: isLoading ? "default" : "pointer",
            letterSpacing: "3px",
            transition: "background 0.2s",
          }}
        >
          {isLoading ? "Connexion…" : "VALIDER"}
        </button>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#444", marginTop: "-8px" }}>
        La validation se déclenche automatiquement au 6ᵉ chiffre
      </p>
    </div>
  );
};

const styles = {
  page: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    background: "#050505",
    color: "white",
    height: "100vh",
    fontFamily: "sans-serif",
    gap: "28px",
    padding: "24px",
  },
  secBox: {
    width: "90px",
    height: "110px",
    background: "#0d1f0d",
    border: "2px solid #00e676",
    borderRadius: "16px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    fontSize: "5rem",
    fontWeight: 900,
    color: "#00e676",
  },
  dot: {
    display: "inline-block" as const,
    width: "10px",
    height: "10px",
    background: "#00e676",
    borderRadius: "50%",
    animation: "pulse 1.2s ease-in-out infinite",
  },
};

export default PairingScreen;
