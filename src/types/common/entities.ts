export interface AuthUserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  is_active: boolean;
  is_verified: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
  role?: string | null;
}

export interface TenantSummary {
  id: string;
  name: string;
  role?: string | null;
  slug: string;
  city?: string | null;
  type?: string | null;
  logo: string | null;
  status?: string | null;
  subscription_pack?: string | null;
  subscription_offer?: string | null;
  coupon_code?: string | null;
  registration_date?: string | null;
  primary_color?: string | null;
}

export type BusinessType = "restaurant" | "cafe" | "snack" | "agency" | "other";