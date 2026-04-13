import type { Manifest, Product, TemplateProps, TenantInfo } from "../schedule/schedule.type";

export type { Product, Manifest, TemplateProps, TenantInfo };

export interface TVSession {
  id: string;
  name: string;
  pairing_code?: string;      // Code 4 chiffres
  validation_code?: string;   // Code 6 chiffres
  is_paired: boolean;
  access_token?: string;      // Clé secrète de session
  current_template: string;
}
