"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { getApiBaseUrl, getSiteUrl } from "@/src/core/config/public-env";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import type { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { getDeviceInfo } from "@/src/utils/helpers/getDeviceInfo";
import { PairingQrDisplay } from "./PairingQrDisplay";

function BrandingHeader({ branding }: { branding: PublicBranding | null }) {
  const site = getSiteUrl();
  const logoSrc = branding?.logo ? getImageUrl(branding.logo) : null;
  const name = branding?.app_name || "Menu digital";

  return (
    <div style={{ textAlign: "center" as const, maxWidth: 720, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logoSrc} alt="" style={{ height: 56, width: "auto", maxWidth: 220, objectFit: "contain" }} />
      ) : (
        <div style={{ height: 8 }} />
      )}
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{name}</h1>
        <p style={{ fontSize: "1.05rem", color: "#9ca3af", margin: 0, lineHeight: 1.5 }}>
          Connexion TV — scannez le QR ou saisissez le code à 6 chiffres du tableau de bord (même écran).
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "1.05rem", color: "#6ee7b7", margin: "10px 0 0", lineHeight: 1.6 }}>
          اتصال التلفزيون — امسح الرمز أو أدخل الرمز المكوّن من 6 أرقام من لوحة التحكم (نفس الشاشة).
        </p>
      </div>
      <a
        href={site}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: "0.85rem",
          color: "#38bdf8",
          textDecoration: "none",
          wordBreak: "break-all" as const,
        }}
      >
        {site.replace(/^https?:\/\//, "")}
      </a>
    </div>
  );
}

const PairingScreen: React.FC = () => {
  const [pairingCode, setPairingCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [displaySecurityCode, setDisplaySecurityCode] = useState("");
  const [screenId, setScreenId] = useState<string | null>(null);
  const [isWaitingForSecurity, setIsWaitingForSecurity] = useState(false);
  const [branding, setBranding] = useState<PublicBranding | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const appliedPairFromUrl = useRef(false);
  const initInFlightRef = useRef(false);

  const setAuth = useTVStore((s) => s.setAuth);
  const setControlConfig = useTVStore((s) => s.setControlConfig);

  useEffect(() => {
    let alive = true;
    void fetch(`${getApiBaseUrl()}/branding/public`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PublicBranding | null) => {
        if (alive && data) setBranding(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleInitFromDigits = useCallback(async (code: string) => {
    const clean = code.trim();
    if (clean.length !== 6) {
      setError("Entrez exactement 6 chiffres.");
      return;
    }
    if (initInFlightRef.current) return;
    initInFlightRef.current = true;
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
      initInFlightRef.current = false;
      setIsLoading(false);
    }
  }, [setControlConfig]);

  const readDigitsFromInput = (el: HTMLInputElement) => el.value.replace(/\D/g, "").slice(0, 6);

  const applyDigitsFromInput = (el: HTMLInputElement) => {
    const digits = readDigitsFromInput(el);
    setPairingCode(digits);
    setError(null);
    if (digits.length === 6) {
      void handleInitFromDigits(digits);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyDigitsFromInput(e.target);
  };

  /** Certaines télécommandes / claviers TV envoient surtout `input`, pas toujours `change`. */
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    applyDigitsFromInput(e.currentTarget);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const digits = readDigitsFromInput(e.currentTarget);
    setPairingCode(digits);
    void handleInitFromDigits(digits);
  };

  /** Deep link depuis le dashboard (QR) : /tv?pair=123456 ou ?code=123456 */
  useEffect(() => {
    if (appliedPairFromUrl.current || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("pair") ?? params.get("code");
    if (!raw) return;
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) return;
    appliedPairFromUrl.current = true;
    const url = new URL(window.location.href);
    url.searchParams.delete("pair");
    url.searchParams.delete("code");
    const qs = url.searchParams.toString();
    window.history.replaceState({}, "", `${url.pathname}${qs ? `?${qs}` : ""}`);
    setPairingCode(digits);
    queueMicrotask(() => {
      void handleInitFromDigits(digits);
    });
  }, [handleInitFromDigits]);

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

  if (isWaitingForSecurity) {
    const secQrValue =
      screenId && displaySecurityCode
        ? `mq-sec:${screenId}:${displaySecurityCode}`
        : "";

    return (
      <div style={styles.page}>
        <BrandingHeader branding={branding} />
        <p style={{ fontSize: "1.25rem", color: "#d1d5db", margin: 0, textAlign: "center" }}>
          Confirmez sur le Dashboard — QR en haut, code en bas (même écran)
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "1.1rem", color: "#86efac", margin: 0, textAlign: "center" }}>
          أكّد من لوحة التحكم — الرمز الشبكي أعلاه والرمز أدناه
        </p>

        {secQrValue && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", margin: 0 }}>
              Scannez ce QR depuis le tableau de bord (téléphone du gérant)
            </p>
            <p lang="ar" dir="rtl" style={{ fontSize: "0.8rem", color: "#4b5563", margin: 0 }}>
              امسح من لوحة التحكم
            </p>
            <div style={{ background: "#fff", padding: 14, borderRadius: 18, display: "inline-block" }}>
              <QRCodeSVG value={secQrValue} size={160} level="M" />
            </div>
          </div>
        )}

        <p style={{ fontSize: "0.9rem", color: "#9ca3af", margin: "8px 0 0", textAlign: "center" }}>
          Code de sécurité à saisir sur le Dashboard si besoin
        </p>
        <div style={{ display: "flex", gap: "20px", margin: "12px 0", flexWrap: "wrap", justifyContent: "center" }}>
          {(displaySecurityCode || "----").split("").map((ch, i) => (
            <div key={i} style={styles.secBox}>
              {ch}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={styles.dot} />
          <p style={{ fontSize: "1.1rem", color: "#6b7280", margin: 0 }}>
            En attente de confirmation par le gérant…
          </p>
        </div>
        <p lang="ar" dir="rtl" style={{ fontSize: "1rem", color: "#4b5563", margin: 0 }}>
          في انتظار التأكيد من المسؤول…
        </p>

        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.15}}`}</style>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <BrandingHeader branding={branding} />

      <PairingQrDisplay embedded />

      <div
        style={{
          width: "100%",
          maxWidth: 520,
          height: 1,
          background: "linear-gradient(90deg, transparent, #333, transparent)",
          margin: "8px 0 4px",
        }}
        aria-hidden
      />

      <div style={{ width: "100%", maxWidth: 480 }}>
        <p style={{ fontSize: "1rem", color: "#d1d5db", margin: "0 0 10px", fontWeight: 700, textAlign: "center" }}>
          Solution 2 — code à 6 chiffres (tableau de bord)
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "0.95rem", color: "#6ee7b7", margin: "0 0 14px", textAlign: "center" }}>
          الحل ٢ — أدخل الرمز المكوّن من 6 أرقام من لوحة التحكم
        </p>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={pairingCode}
          onChange={handleChange}
          onInput={handleInput}
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
          <p
            style={{
              color: "#f44336",
              fontSize: "1rem",
              textAlign: "center",
              marginTop: "12px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            const el = inputRef.current;
            const digits = el ? readDigitsFromInput(el) : pairingCode.replace(/\D/g, "").slice(0, 6);
            void handleInitFromDigits(digits);
          }}
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

      <p style={{ fontSize: "0.85rem", color: "#444", marginTop: "-4px", textAlign: "center", maxWidth: 480, lineHeight: 1.5 }}>
        Les deux méthodes sont visibles en même temps : pas besoin de souris pour changer d’écran.
        <span lang="ar" dir="rtl" style={{ display: "block", marginTop: 6, color: "#374151" }}>
          الطريقتان ظاهرتان معًا — دون الحاجة للفأرة للتبديل بين الشاشات.
        </span>
      </p>
    </div>
  );
};

const styles = {
  page: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "flex-start" as const,
    background: "#050505",
    color: "white",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    gap: "22px",
    padding: "24px 24px 40px",
    overflowY: "auto" as const,
    boxSizing: "border-box" as const,
  },
  secBox: {
    width: "72px",
    height: "92px",
    background: "#0d1f0d",
    border: "2px solid #00e676",
    borderRadius: "16px",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    fontSize: "3.2rem",
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
