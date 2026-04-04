export type BusinessType = "restaurant" | "cafe" | "snack" | "agency" | "other";

export interface ITenant {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  business_type: BusinessType;
  primary_color: string;
  logo?: string | null;
  cover_image?: string | null;
  is_active: boolean;
  is_verified: boolean;
}

// Payload pour la création (on exclut les champs gérés par le backend)
export type CreateTenantPayload = Omit<ITenant, "id" | "is_active" | "is_verified" | "logo" | "cover_image">;