import type { TenantSettingsData } from "@/src/types/settings/settings.type";

function coerceBool(value: unknown, fallback: boolean): boolean {
  if (value === true || value === false) return value;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return fallback;
}

/**
 * Aligne la réponse API `/tenants/setting/me` (champ `settings`) avec le shape attendu par le store (`business`).
 */
export function mapTenantSettingsResponse(raw: Record<string, unknown>): TenantSettingsData {
  const settings = raw.settings as Record<string, unknown> | undefined | null;
  const legacyBusiness = raw.business as Record<string, unknown> | undefined | null;
  const merged = { ...(legacyBusiness ?? {}), ...(settings ?? {}) };

  const display = (raw.display as TenantSettingsData["display"]) ?? {};

  const { settings: _s, business: _b, ...tenantRoot } = raw;

  const business: TenantSettingsData["business"] = {
    ...(merged as TenantSettingsData["business"]),
    id: (merged.id as string) ?? (settings?.id as string),
    logo: (merged.logo as string | File | null | undefined) ?? (raw.logo as string | null | undefined) ?? null,
    cover_image:
      (merged.cover_image as string | File | null | undefined) ??
      (settings?.cover_image as string | null | undefined) ??
      null,
    address: (merged.address as string | undefined) ?? (raw.address as string | undefined) ?? "",
    tel: (merged.tel as string | undefined) ?? "",
    opening_hours:
      (merged.opening_hours as Record<string, unknown> | null | undefined) ??
      (raw.opening_hours as Record<string, unknown> | null | undefined) ??
      null,
    show_prices: coerceBool(merged.show_prices, true),
    show_images: coerceBool(merged.show_images, true),
    social_links: (merged.social_links as Record<string, string>) ?? {},
  };

  return {
    ...(tenantRoot as unknown as TenantSettingsData),
    business,
    display,
  };
}
