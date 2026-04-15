import type { Tenant } from "@/src/types/accounts/account.types";
import type { TenantSettingsData } from "@/src/types/settings/settings.type";

export function resolveTenantDisplayName(source: {
  name?: string | null;
  business?: {
    name_override?: string | null;
  } | null;
}) {
  const overrideName = source.business?.name_override?.trim();

  if (overrideName) {
    return overrideName;
  }

  return source.name?.trim() || "";
}

export function buildTenantSummaryFromSettings(
  settings: TenantSettingsData,
  currentTenant?: Tenant | null,
): Tenant | null {
  const tenantId = settings.id || currentTenant?.id;
  const tenantSlug = settings.slug || currentTenant?.slug;

  if (!tenantId || !tenantSlug) {
    return currentTenant || null;
  }

  return {
    id: tenantId,
    name: resolveTenantDisplayName(settings) || currentTenant?.name || "",
    slug: tenantSlug,
    role: currentTenant?.role || null,
    city: settings.city ?? currentTenant?.city ?? null,
    type: settings.business_type ?? currentTenant?.type ?? null,
    logo: typeof settings.business?.logo === "string" ? settings.business.logo : currentTenant?.logo ?? null,
    status: settings.status ?? currentTenant?.status ?? null,
    subscription_pack: currentTenant?.subscription_pack ?? null,
    subscription_offer: currentTenant?.subscription_offer ?? null,
    coupon_code: currentTenant?.coupon_code ?? null,
    registration_date: settings.registration_date ?? settings.created_at ?? currentTenant?.registration_date ?? null,
    primary_color: settings.display?.primary_color ?? currentTenant?.primary_color ?? null,
  };
}