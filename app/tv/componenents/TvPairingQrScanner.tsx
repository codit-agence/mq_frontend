"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/** ID du conteneur html5-qrcode (une seule instance à l’écran). */
export const TV_PAIRING_SCANNER_ELEMENT_ID = "tv-pairing-qr-scanner-root";

/**
 * Extrait un code d’appairage à 6 chiffres depuis le texte décodé (URL /tv?pair=… ou 6 chiffres seuls).
 */
export function extractPairingCodeFromScan(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  // URL absolue : lire `pair` / `code` en query (évite les chiffres du tenant dans le chemin).
  if (/^https?:\/\//i.test(t)) {
    try {
      const u = new URL(t);
      const p = u.searchParams.get("pair") ?? u.searchParams.get("code");
      if (p) {
        const d = p.replace(/\D/g, "").slice(0, 6);
        if (/^\d{6}$/.test(d)) return d;
      }
    } catch {
      /* ignore */
    }
  }
  const m = t.match(/(?:\?|&|#)(?:pair|code)=([^&\s#]+)/i);
  if (m) {
    const d = decodeURIComponent(m[1]).replace(/\D/g, "").slice(0, 6);
    if (/^\d{6}$/.test(d)) return d;
  }
  try {
    const u = new URL(t);
    const p = u.searchParams.get("pair") ?? u.searchParams.get("code");
    if (p) {
      const d = p.replace(/\D/g, "").slice(0, 6);
      if (/^\d{6}$/.test(d)) return d;
    }
  } catch {
    // pas une URL
  }
  const onlyDigits = t.replace(/\D/g, "");
  if (onlyDigits.length >= 6) {
    const six = onlyDigits.slice(0, 6);
    if (/^\d{6}$/.test(six)) return six;
  }
  return null;
}

type Props = {
  active: boolean;
  onDecoded: (code: string) => void;
  onBack: () => void;
  labels: { title: string; hint: string; back: string; cameraError: string };
};

export function TvPairingQrScanner({ active, onDecoded, onBack, labels }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- API html5-qrcode
  const instRef = useRef<any>(null);
  const [cameraError, setCameraError] = useState("");

  const stopScanner = useCallback(async () => {
    const s = instRef.current;
    instRef.current = null;
    if (!s) return;
    try {
      await s.stop();
    } catch {
      /* ignore */
    }
    try {
      await s.clear();
    } catch {
      /* ignore */
    }
  }, []);

  const handleDecoded = useCallback(
    (text: string) => {
      const raw = text.trim();
      if (!raw) return;
      void stopScanner().finally(() => {
        onDecoded(raw);
      });
    },
    [onDecoded, stopScanner],
  );

  useEffect(() => {
    if (!active) return;
    setCameraError("");
    let cancelled = false;

    const run = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const scanner = new Html5Qrcode(TV_PAIRING_SCANNER_ELEMENT_ID);
        instRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 260, height: 260 } },
          (decodedText: string) => {
            handleDecoded(decodedText);
          },
          () => undefined,
        );
      } catch {
        if (!cancelled) setCameraError(labels.cameraError);
      }
    };

    void run();

    return () => {
      cancelled = true;
      void stopScanner();
    };
  }, [active, handleDecoded, labels.cameraError, stopScanner]);

  if (!active) return null;

  return (
    <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <p style={{ fontSize: "1.05rem", color: "#d1d5db", margin: 0, textAlign: "center" }}>{labels.title}</p>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", margin: 0, textAlign: "center", lineHeight: 1.45 }}>{labels.hint}</p>
      <div
        id={TV_PAIRING_SCANNER_ELEMENT_ID}
        style={{
          width: "100%",
          minHeight: 280,
          borderRadius: 16,
          overflow: "hidden",
          background: "#0a0a0a",
          border: "1px solid #333",
        }}
      />
      {cameraError ? (
        <p style={{ color: "#f87171", fontSize: "0.95rem", textAlign: "center", margin: 0 }}>{cameraError}</p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          void stopScanner();
          onBack();
        }}
        style={{
          width: "100%",
          marginTop: 8,
          fontSize: "1.1rem",
          fontWeight: 700,
          padding: "14px",
          borderRadius: 12,
          border: "1px solid #444",
          background: "#1a1a1a",
          color: "#e5e5e5",
          cursor: "pointer",
        }}
      >
        {labels.back}
      </button>
    </div>
  );
}
