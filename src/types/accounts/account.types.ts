import type { AuthUserProfile, TenantSummary } from "@/src/types/common/entities";

export type UserProfile = AuthUserProfile;

export type Tenant = TenantSummary;

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  tenant_id: string | null;
  tenant_name: string | null;
  tenant_city: string | null;
  tenant_type: string | null;
  tenant_logo_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  role?: string | null;
  tenant_slug?: string | null;
  tenant_status?: string | null;
  subscription_pack?: string | null;
  subscription_offer?: string | null;
  coupon_code?: string | null;
  registration_date?: string | null;
  primary_color?: string | null;
}

export interface MeResponse {
  user: UserProfile;
  current_tenant: Tenant | null;
}

export interface RegisterResponse {
  id: string;
  email: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
}