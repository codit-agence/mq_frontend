import axios from "axios";
import { ApiError } from "@/src/types/api/api";
import { getApiBaseUrl, resolveActiveApiBaseUrl } from "@/src/core/config/public-env";

function normalizePythonListString(value: string) {
  const trimmed = value.trim();

  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return trimmed;
  }

  try {
    const normalizedJson = trimmed.replace(/'/g, '"');
    const parsed = JSON.parse(normalizedJson);

    if (Array.isArray(parsed)) {
      return parsed
        .map((entry) => (typeof entry === "string" ? entry.trim() : String(entry)))
        .filter(Boolean)
        .join(" | ");
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

function collectMessages(value: unknown): string[] {
  if (typeof value === "string") {
    const normalized = normalizePythonListString(value);
    return normalized ? [normalized] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectMessages);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) => {
      const messages = collectMessages(entry);
      return messages.map((message) => `${key}: ${message}`);
    });
  }

  return [];
}

function collectDetailArray(detail: unknown): string[] {
  if (!Array.isArray(detail)) return [];
  const out: string[] = [];
  for (const item of detail) {
    if (typeof item === "string" && item.trim()) {
      out.push(item.trim());
      continue;
    }
    if (item && typeof item === "object" && "msg" in item) {
      const m = (item as { msg?: unknown }).msg;
      if (typeof m === "string" && m.trim()) out.push(m.trim());
    }
  }
  return out;
}

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError<ApiError>(err)) {
    const data = err.response?.data;
    const messages = [
      ...collectMessages(data?.message),
      ...collectDetailArray(data?.detail),
      ...collectMessages(
        Array.isArray(data?.detail) ? undefined : data?.detail,
      ),
      ...collectMessages(data?.error),
      ...collectMessages(data?.errors),
    ];

    if (messages.length > 0) {
      return [...new Set(messages)].join(" | ");
    }

    // Aucune réponse HTTP : backend arrêté, mauvaise URL, CORS, ou hôte Docker depuis le navigateur
    if (!err.response) {
      const code = err.code;
      const msg = (err.message || "").toLowerCase();
      const looksNetwork =
        code === "ERR_NETWORK" ||
        code === "ECONNREFUSED" ||
        msg.includes("network") ||
        msg.includes("failed to fetch");

      if (looksNetwork) {
        const configured =
          typeof window !== "undefined" ? getApiBaseUrl() : "(voir NEXT_PUBLIC_API_URL / proxy Next)";
        const effective =
          typeof window !== "undefined" ? resolveActiveApiBaseUrl() : configured;
        return [
          `Impossible de joindre l'API (configuree : ${configured}${effective !== configured ? ` ; tentative : ${effective}` : ""}).`,
          "Verifiez : backend Django demarre (souvent port 8000) ; dans .env.local : API_PROXY_TO_BACKEND=http://127.0.0.1:8000 avec NEXT_PUBLIC_API_URL=http://localhost:3000/api pour le proxy Next ; pas de nom de service Docker dans NEXT_PUBLIC_*.",
          "Si vous ouvrez le front via http://IP-locale:3000, ne laissez pas le navigateur appeler localhost pour l'API (origine differente) — le client reecrit desormais vers la meme origine que la page.",
        ].join(" ");
      }
    }

    if (err.message) {
      return err.message;
    }

    return `Erreur serveur${err.response?.status ? ` (${err.response.status})` : ""}`;
  }
  return "Une erreur est survenue";
};