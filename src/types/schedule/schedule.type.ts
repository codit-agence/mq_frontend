export type ScheduleBehavior = 'EXCLUSIVE' | 'ADDITIVE';

export interface CreateScheduleInput {
  label: string;
  category_ids: string[];
  behavior: ScheduleBehavior;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  template_name: string;
  slot_duration: number;
  priority: number;
  audio_track_id?: string | null;
  promotion_id?: string | null;
}

export interface Schedule extends CreateScheduleInput {
  id: string;
  category_name?: string;
}

export interface TenantInfo {
  name: string;
  logo: string;
  phone?: string;          // Optionnel pour le header
  wifi_name?: string;      // Pour la sidebar
  wifi_password?: string;  // Pour la sidebar
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
  category_name?: string; // Optionnel si on veut l'afficher par produit
}

export interface Manifest {
  label: string;
  category_name: string;
  template_name: string;
  slot_duration: number;
  audio_url?: string | null;
  audio_playlist?: string[] | null;
  products: Product[];
  tenant: TenantInfo;      // Obligatoire dans la réponse API finale
  server_time: string;
}

export interface TemplateProps {
  manifest: Manifest;
  currentProduct: Product;
  tenant?: TenantInfo;      // On le passe en obligatoire ici car le Player s'assure qu'il existe
}

export interface Category {
  id: string;
  name: string;
}

export interface AudioTrack {
  id: string;
  title: string;
}

export interface Promotion {
  id: string;
  name: string;
}
