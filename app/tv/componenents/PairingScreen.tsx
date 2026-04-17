"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { getApiBaseUrl, getSiteUrl } from "@/src/core/config/public-env";
import { tvApi } from "@/src/projects/client-dashboard/tv/tv.api";
import { useTVStore } from "@/src/projects/client-dashboard/tv/tv.store";
import type { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { getDeviceInfo } from "@/src/utils/helpers/getDeviceInfo";

import { TvPairingQrScanner } from "./TvPairingQrScanner";

type PairingEntryMode = "type" | "scan";

const TV_PAIRING_SCAN_LABELS = {
  title: "Scannez le QR affiché dans le tableau de bord (TV Stream)",
  hint: "Le gérant connecté au tenant affiche le QR à côté du code à 6 chiffres. La TV lit le même code sans le saisir au clavier.",
  back: "← Saisir le code au clavier",
  cameraError: "Caméra indisponible sur cet appareil. Utilisez la saisie du code.",
} as const;

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
          Connexion TV — saisissez le code affiché dans votre tableau de bord.
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "1.05rem", color: "#6ee7b7", margin: "10px 0 0", lineHeight: 1.6 }}>
          اتصال التلفزيون — أدخل الرمز الظاهر في لوحة التحكم.
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
  const [entryMode, setEntryMode] = useState<PairingEntryMode>("type");
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

  const onScanDecoded = useCallback(
    (code: string) => {
      setEntryMode("type");
      setPairingCode(code);
      queueMicrotask(() => {
        void handleInitFromDigits(code);
      });
    },
    [handleInitFromDigits],
  );

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
    return (
      <div style={styles.page}>
        <BrandingHeader branding={branding} />
        <p style={{ fontSize: "1.25rem", color: "#d1d5db", margin: 0, textAlign: "center" }}>
          Code de sécurité — à confirmer sur le Dashboard
        </p>
        <p lang="ar" dir="rtl" style={{ fontSize: "1.1rem", color: "#86efac", margin: 0, textAlign: "center" }}>
          رمز الأمان — يُرجى تأكيده من لوحة التحكم
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

      <div
        style={{
          display: "flex",
          gap: 10,
          width: "100%",
          maxWidth: 480,
          marginBottom: 8,
        }}
      >
        <button
          type="button"
          onClick={() => setEntryMode("type")}
          style={{
            flex: 1,
            padding: "12px 8px",
            borderRadius: 12,
            border: entryMode === "type" ? "2px solid #2196f3" : "1px solid #333",
            background: entryMode === "type" ? "#0c2340" : "#111",
            color: entryMode === "type" ? "#fff" : "#888",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Code 6 chiffres
        </button>
        <button
          type="button"
          onClick={() => setEntryMode("scan")}
          style={{
            flex: 1,
            padding: "12px 8px",
            borderRadius: 12,
            border: entryMode === "scan" ? "2px solid #22c55e" : "1px solid #333",
            background: entryMode === "scan" ? "#0f2918" : "#111",
            color: entryMode === "scan" ? "#fff" : "#888",
            fontWeight: 800,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Scanner QR
        </button>
      </div>
      <p lang="ar" dir="rtl" style={{ fontSize: "0.8rem", color: "#525252", margin: "0 0 8px", textAlign: "center", maxWidth: 480 }}>
        خياران: إدخال الرمز أو مسح الرمز من لوحة التحكم (نفس رمز المستأجر).
      </p>

      {entryMode === "scan" ? (
        <TvPairingQrScanner
          active={entryMode === "scan"}
          onDecoded={onScanDecoded}
          onBack={() => setEntryMode("type")}
          labels={TV_PAIRING_SCAN_LABELS}
        />
      ) : (
        <div style={{ width: "100%", maxWidth: "480px" }}>
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
      )}

      <p style={{ fontSize: "0.9rem", color: "#444", marginTop: "-8px", textAlign: "center" }}>
        Le code à 6 chiffres vient du tableau de bord tenant (TV Stream) : même écran que le QR · Entrée ou « VALIDER »
        <span lang="ar" dir="rtl" style={{ display: "block", marginTop: 6 }}>
          الرمز من لوحة التحكم (نفس الشاشة التي تعرض QR للمستأجر)
        </span>
      </p>

      <p style={{ fontSize: "0.75rem", color: "#525252", textAlign: "center", maxWidth: 520, lineHeight: 1.5 }}>
        Sur téléphone : ouvrez cette page depuis le site ({getSiteUrl().replace(/^https?:\/\//, "")}) puis utilisez
        « Installer » lorsque le navigateur le propose (PWA).
        <span lang="ar" dir="rtl" style={{ display: "block", marginTop: 8, color: "#737373" }}>
          على الهاتف: افتح هذه الصفحة من الموقع ثم استخدم « تثبيت » عندما يعرضه المتصفح (تطبيق ويب تقدّمي).
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
    justifyContent: "center" as const,
    background: "#050505",
    color: "white",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    gap: "28px",
    padding: "24px",
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
