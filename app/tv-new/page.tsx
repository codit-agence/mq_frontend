"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { tvStreamService } from "@/src/projects/client-dashboard/tvstream/services/tvstream.service";

/**
 * Page appelée quand le gérant scanne le QR de la TV (mode « Afficher QR »)
 * avec son appareil photo (en dehors du dashboard).
 *
 * URL : /tv-new?s={sessionToken}
 *
 * - Si le gérant est authentifié → appaire et redirige vers le tableau de bord TV
 * - Sinon → redirige vers la connexion avec retour sur cette URL
 */
export default function TvNewPage() {
  const [status, setStatus] = useState<"loading" | "pairing" | "done" | "error" | "notoken">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = (p.get("s") ?? "").trim();
    if (!s) {
      setStatus("notoken");
      return;
    }

    setStatus("pairing");
    tvStreamService
      .pairTvQr(s, "TV")
      .then((res) => {
        setStatus("done");
        setMessage(res.screen_name || "TV");
        setTimeout(() => {
          // Redirige vers le tableau de bord TV Stream (sans tenant, page générique)
          window.location.href = "/dashboard/tvstream";
        }, 2000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

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
        gap: 24,
        padding: 24,
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {status === "loading" && <Loader2 className="animate-spin text-blue-500" size={40} />}

      {status === "pairing" && (
        <>
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Association de la TV en cours…</p>
          <p lang="ar" dir="rtl" style={{ color: "#64748b" }}>
            جارٍ ربط التلفاز…
          </p>
        </>
      )}

      {status === "done" && (
        <>
          <p style={{ fontSize: "2rem" }}>✅</p>
          <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "1.2rem" }}>
            TV « {message} » associée avec succès !
          </p>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Redirection vers le tableau de bord…</p>
        </>
      )}

      {status === "error" && (
        <>
          <p style={{ fontSize: "2rem" }}>❌</p>
          <p style={{ color: "#f87171", fontWeight: 700 }}>Échec de l'association.</p>
          <p style={{ color: "#94a3b8", maxWidth: 400, lineHeight: 1.5 }}>
            La session QR a peut-être expiré (10 min) ou vous n'êtes pas connecté.
            Reconnectez-vous depuis le tableau de bord et réessayez.
          </p>
          <p lang="ar" dir="rtl" style={{ color: "#64748b", maxWidth: 400 }}>
            انتهت صلاحية رمز QR أو أنت غير مسجّل الدخول. سجّل الدخول من لوحة التحكم وأعد المحاولة.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            style={{
              marginTop: 8,
              padding: "12px 28px",
              borderRadius: 14,
              border: "none",
              background: "#1d4ed8",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Aller au tableau de bord
          </button>
        </>
      )}

      {status === "notoken" && (
        <p style={{ color: "#94a3b8" }}>
          Paramètre manquant. Scannez le QR affiché sur la TV depuis le tableau de bord.
        </p>
      )}
    </div>
  );
}
