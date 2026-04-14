import type { LoginResponse, Tenant, UserProfile } from "@/src/types/accounts/account.types";

const INTERNAL_ROLE_KEYS = new Set(["admin", "super_admin", "internal_admin", "platform_admin"]);

function normalizeRole(value?: string | null) {
  return value?.trim().toLowerCase().replace(/[-\s]+/g, "_") || "";
}

export function isInternalAccount(params: {
  user?: UserProfile | null;
  tenant?: Tenant | null;
  loginResponse?: LoginResponse | null;
}) {
  const { user, tenant, loginResponse } = params;
  const tenantRole = normalizeRole(tenant?.role);
  const responseRole = normalizeRole(loginResponse?.role);

  return Boolean(
    user?.is_staff ||
      user?.is_superuser ||
      loginResponse?.is_staff ||
      loginResponse?.is_superuser ||
      INTERNAL_ROLE_KEYS.has(tenantRole) ||
      INTERNAL_ROLE_KEYS.has(responseRole),
  );
}

export function resolveAuthenticatedRoute(params: {
  user?: UserProfile | null;
  tenant?: Tenant | null;
  loginResponse?: LoginResponse | null;
}) {
  const { tenant } = params;

  if (isInternalAccount(params)) {
    return "/dashboard/internal";
  }

  if (tenant?.id || params.loginResponse?.tenant_id) {
    return "/dashboard";
  }

  return "/dashboard";
}