import type { BusinessType, TenantSummary } from "@/src/types/common/entities";

export interface TenantDetails extends Omit<TenantSummary, "role" | "type"> {
  address: string;
  city: string;
  country: string;
  business_type: BusinessType;
  primary_color: string;
  logo: string | null;
  cover_image?: string | null;
  is_active: boolean;
  is_verified: boolean;
}

export type ITenant = TenantDetails;

// Payload pour la création (on exclut les champs gérés par le backend)
export type CreateTenantPayload = Omit<TenantDetails, "id" | "is_active" | "is_verified" | "logo" | "cover_image">;