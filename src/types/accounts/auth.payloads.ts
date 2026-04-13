/**
 * Payload pour le endpoint /register
 * Doit correspondre à RegisterIn dans Django
 */
export interface RegisterIn {
  // Authentification
  email: string;
  password: string;

  // Profil (Identity)
  first_name: string;
  last_name: string;
  phone?: string | null;

  // Business (Tenant)
  tenant_name: string;
  business_type: "restaurant" | "cafe" | "snack" | "agency" | "other"; 
  city: string;
  address?: string | null;
  country?: string | null;
  selected_pack?: string | null;
  qarat_code?: string | null;
  lead_source_detail?: string | null;
  accepted_terms: boolean;
  terms_version: string;
  terms_locale: "fr" | "ar";
}

/**
 * Payload pour le endpoint /login
 * Doit correspondre à LoginIn dans Django
 */
export interface LoginIn {
  email: string;
  password: string;
} 

/**
 * Payload pour le rafraîchissement de token
 */
export interface RefreshIn {
  refresh: string;
}