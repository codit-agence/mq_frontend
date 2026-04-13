import { cmsEditorLabels } from "./admin-settings.constants";
import { CmsEditorKey } from "./admin-settings.types";

export function serializeCmsValue(value: unknown) {
  if (!Array.isArray(value)) {
    return "[]";
  }
  return JSON.stringify(value, null, 2);
}

export function parseCmsEditorValue(key: CmsEditorKey, rawValue: string): { ok: true; value: unknown[] } | { ok: false; error: string } {
  try {
    const parsed = JSON.parse(rawValue || "[]");
    if (!Array.isArray(parsed)) {
      return { ok: false, error: `${cmsEditorLabels[key]} doit etre un tableau JSON.` };
    }
    return { ok: true, value: parsed };
  } catch {
    return { ok: false, error: `JSON invalide pour ${cmsEditorLabels[key]}.` };
  }
}