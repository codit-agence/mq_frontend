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