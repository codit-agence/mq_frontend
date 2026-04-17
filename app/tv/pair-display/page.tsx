"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { getSiteUrl } from "@/src/core/config/public-env";

/**
 * Page à ouvrir **sur la TV** (plein écran) : grand code + QR pour que le **téléphone** du gérant scanne
 * (la TV n’a souvent pas de caméra). Le QR ouvre le tableau de bord TV Stream avec le même code en query.
 */
export default function TvPairDisplayPage() {
  const [code, setCode] = useState("");
  const [tenant, setTenant] = useState("");
  const [qrSize, setQrSize] = useState(260);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setCode((p.get("code") || "").replace(/\D/g, "").slice(0, 6));
    setTenant((p.get("tenant") || "").trim());
  }, []);

  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    setQrSize(Math.min(280, Math.max(200, w - 80)));
  }, []);

  const base = useMemo(() => getSiteUrl().replace(/\/$/, ""), []);

  const dashboardUrl = useMemo(() => {
    if (!/^\d{6}$/.test(code)) return "";
    if (tenant) return `${base}/dashboard/tenant/${encodeURIComponent(tenant)}/tvstream?pair=${code}`;
    return `${base}/tv?pair=${code}`;
  }, [base, code, tenant]);

  const ok = /^\d{6}$/.test(code);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e2e8f0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 28,
        textAlign: "center",
      }}
    >
      {!ok ? (
        <>
          <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>Paramètre manquant</p>
          <p style={{ color: "#94a3b8", maxWidth: 420, lineHeight: 1.5 }}>
            Ouvrez cette page depuis le bouton « Afficher sur la TV » du tableau de bord (code à 6 chiffres requis).
          </p>
          <p lang="ar" dir="rtl" style={{ color: "#64748b", maxWidth: 420 }}>
            افتح هذه الصفحة من لوحة التحكم عبر « عرض على التلفاز » (رمز من 6 أرقام).
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "1rem", color: "#94a3b8", margin: 0, fontWeight: 600 }}>
            Scannez avec le téléphone du gérant (appareil photo)
          </p>
          <p lang="ar" dir="rtl" style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
            امسح بهاتف المسؤول (الكاميرا)
          </p>

          <p
            style={{
              fontSize: "clamp(3rem, 14vw, 5.5rem)",
              fontWeight: 900,
              letterSpacing: "0.35em",
              margin: 0,
              color: "#38bdf8",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {code}
          </p>

          <div style={{ background: "#fff", padding: 16, borderRadius: 20, display: "inline-block" }}>
            <QRCodeSVG value={dashboardUrl} size={qrSize} level="M" />
          </div>

          <p style={{ fontSize: "0.75rem", color: "#475569", maxWidth: 360, wordBreak: "break-all", margin: 0 }}>
            {dashboardUrl}
          </p>
        </>
      )}
    </div>
  );
}
