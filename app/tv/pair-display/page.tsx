"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

import { getSiteUrl } from "@/src/core/config/public-env";

/**
 * Page plein écran pour la **TV** : QR + code 6 chiffres (même information).
 *
 * **Query (toutes optionnelles sauf un code valide)** :
 * - `pair` ou `code` : code d’appairage 6 chiffres (le dashboard et `/tv` utilisent `pair`).
 * - `tenant` : id tenant — si présent, le QR ouvre le TV Stream du tenant avec `?pair=`.
 *
 * Exemple : `/tv/pair-display?pair=123456&tenant=<uuid>`
 */
function parseSixDigitCode(searchParams: URLSearchParams): string {
  const raw =
    searchParams.get("pair") ??
    searchParams.get("code") ??
    searchParams.get("pairing") ??
    "";
  return raw.replace(/\D/g, "").slice(0, 6);
}

function TvPairDisplayContent() {
  const searchParams = useSearchParams();
  const code = useMemo(() => parseSixDigitCode(searchParams), [searchParams]);
  const tenant = useMemo(() => (searchParams.get("tenant") ?? "").trim(), [searchParams]);

  /** Même origine que la barre d’adresse : évite un QR vers localhost alors que la TV est en IP locale. */
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    setOrigin(typeof window !== "undefined" ? window.location.origin : "");
  }, []);

  const [qrSize, setQrSize] = useState(260);
  useEffect(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 400;
    setQrSize(Math.min(280, Math.max(200, w - 80)));
  }, []);

  const base = useMemo(() => {
    const o = origin.replace(/\/$/, "");
    return (o || getSiteUrl().replace(/\/$/, "")).replace(/\/$/, "");
  }, [origin]);

  const dashboardUrl = useMemo(() => {
    if (!/^\d{6}$/.test(code)) return "";
    const q = encodeURIComponent(code);
    if (tenant) {
      return `${base}/dashboard/tenant/${encodeURIComponent(tenant)}/tvstream?pair=${q}`;
    }
    return `${base}/tv?pair=${q}`;
  }, [base, code, tenant]);

  const ok = /^\d{6}$/.test(code);

  const examplePath = tenant
    ? `/tv/pair-display?pair=123456&tenant=${encodeURIComponent(tenant)}`
    : "/tv/pair-display?pair=123456";

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
          <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>Code manquant ou invalide</p>
          <p style={{ color: "#94a3b8", maxWidth: 480, lineHeight: 1.5 }}>
            Utilisez le paramètre <strong style={{ color: "#e2e8f0" }}>pair</strong> (recommandé, comme sur le
            tableau de bord) ou <strong style={{ color: "#e2e8f0" }}>code</strong> : 6 chiffres.
            {tenant ? " Le tenant est déjà dans l’URL." : " Optionnel : ajoutez &tenant=&lt;id&gt; pour ouvrir le TV Stream du tenant."}
          </p>
          <p style={{ fontSize: "0.85rem", color: "#64748b", fontFamily: "ui-monospace, monospace", wordBreak: "break-all" }}>
            Exemple : {examplePath}
          </p>
          <p lang="ar" dir="rtl" style={{ color: "#64748b", maxWidth: 420 }}>
            يجب أن يحتوي الرابط على pair= أو code= مع 6 أرقام.
          </p>
        </>
      ) : (
        <>
          <p style={{ fontSize: "1rem", color: "#94a3b8", margin: 0, fontWeight: 600 }}>
            En haut : QR (téléphone du gérant) — en bas : le même code à 6 chiffres
          </p>
          <p lang="ar" dir="rtl" style={{ fontSize: "0.95rem", color: "#64748b", margin: 0 }}>
            أعلى: رمز QR — أسفل: نفس الرمز المكوّن من 6 أرقام
          </p>

          {dashboardUrl ? (
            <div style={{ background: "#fff", padding: 16, borderRadius: 20, display: "inline-block" }}>
              <QRCodeSVG value={dashboardUrl} size={qrSize} level="M" />
            </div>
          ) : null}

          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, fontWeight: 600 }}>
            Code (saisie manuelle si besoin)
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

          <p style={{ fontSize: "0.75rem", color: "#475569", maxWidth: 420, wordBreak: "break-all", margin: 0 }}>
            {dashboardUrl}
          </p>
        </>
      )}
    </div>
  );
}

export default function TvPairDisplayPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#020617",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "sans-serif",
          }}
        >
          Chargement…
        </div>
      }
    >
      <TvPairDisplayContent />
    </Suspense>
  );
}
