import axios from "axios";
import { ApiError } from "@/src/types/api/api";

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

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError<ApiError>(err)) {
    const data = err.response?.data;
    const messages = [
      ...collectMessages(data?.message),
      ...collectMessages(data?.detail),
      ...collectMessages(data?.error),
      ...collectMessages(data?.errors),
    ];

    if (messages.length > 0) {
      return [...new Set(messages)].join(" | ");
    }

    if (err.message) {
      return err.message;
    }

    return `Erreur serveur${err.response?.status ? ` (${err.response.status})` : ""}`;
  }
  return "Une erreur est survenue";
};