export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface Tenant {
  id: string;
  name: string;
  role?: string | null;
  slug: string;
  city?: string | null;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  tenant_id: string | null;
  tenant_name: string | null;
  tenant_city: string | null;
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