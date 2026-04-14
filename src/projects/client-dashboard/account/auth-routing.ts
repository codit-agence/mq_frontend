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

  const isStaff = user?.is_staff || loginResponse?.is_staff;
  const isSuperuser = user?.is_superuser || loginResponse?.is_superuser;
  const isRoleMatch = INTERNAL_ROLE_KEYS.has(tenantRole) || INTERNAL_ROLE_KEYS.has(responseRole);

  const result = Boolean(isStaff || isSuperuser || isRoleMatch);
  
  console.log("🔐 isInternalAccount DEBUG:", {
    isStaff,
    isSuperuser,
    isRoleMatch,
    tenantRole,
    responseRole,
    result,
  });

  return result;
}

export function resolveAuthenticatedRoute(params: {
  user?: UserProfile | null;
  tenant?: Tenant | null;
  loginResponse?: LoginResponse | null;
}) {
  const { tenant } = params;

  const isInternal = isInternalAccount(params);
  console.log("🔐 resolveAuthenticatedRoute DEBUG:", {
    isInternal,
    user: params.user?.is_staff,
    userSuperuser: params.user?.is_superuser,
    loginResponse: {
      is_staff: params.loginResponse?.is_staff,
      is_superuser: params.loginResponse?.is_superuser,
    },
    tenantRole: tenant?.role,
  });

  if (isInternal) {
    return "/dashboard/internal/settings";
  }

  if (tenant?.id || params.loginResponse?.tenant_id) {
    return "/dashboard";
  }

  return "/dashboard";
}