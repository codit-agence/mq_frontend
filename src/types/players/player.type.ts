import { TenantInfo } from "../schedule/schedule.type";



export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
  category_name?: string; // Optionnel si on veut l'afficher par produit
}

export interface TVSession {
  id: string;
  name: string;
  pairing_code?: string;      // Code 4 chiffres
  validation_code?: string;   // Code 6 chiffres
  is_paired: boolean;
  access_token?: string;      // Clé secrète de session
  current_template: string;
}

export interface Manifest {
  label: string;
  category_name: string;
  products: Product[];
  tenant: TenantInfo;
  audio_url?: string | null;
  template_name: string;
  slot_duration: number;
  server_time: string;
}

export interface TemplateProps {
  manifest: Manifest;
  currentProduct: Product;
  tenant?: TenantInfo;
}