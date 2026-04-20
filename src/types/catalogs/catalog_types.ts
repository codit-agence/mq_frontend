// CATEGORY
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  name_en?: string | null;
  name_ar?: string | null;
  name_es?: string | null;
  note?: string | null;
  note_en?: string | null;
  note_ar?: string | null;
  note_es?: string | null;
  order: number;
  is_active: boolean;
}

// VARIANT
export interface Variant {
  id?: string | number;
  label: string;
  price: number;
  is_default?: boolean;
}

// PRODUCT
export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;

  name_en?: string;
  name_ar?: string;
  name_es?: string;

  short_description?: string;
  short_description_en?: string;
  short_description_ar?: string;
  short_description_es?: string;

  description?: string;
  description_en?: string;
  description_ar?: string;
  description_es?: string;

  note?: string;
  note_en?: string;
  note_ar?: string;
  note_es?: string;

  price: number;
  compare_at_price?: number;

  image?: string;

  is_available: boolean;
  is_featured: boolean;
  is_active: boolean;

  variants: Variant[];
}

// PAYLOADS
export interface ProductPayload {
  category_id: string;
  name: string;

  short_description?: string;
  description?: string;
  note?: string;

  name_ar?: string;
  short_description_ar?: string;
  description_ar?: string;
  note_ar?: string;

  name_en?: string;
  short_description_en?: string;
  description_en?: string;
  note_en?: string;

  name_es?: string;
  short_description_es?: string;
  description_es?: string;
  note_es?: string;

  price: number;
  compare_at_price?: number;

  is_active: Boolean;
  is_featured: Boolean;
  is_available?: Boolean;

  variants?: Variant[];
}

export interface CategoryPayload {
  name: string;
  name_ar?: string;
  name_en?: string;
  name_es?: string;
  note?: string;
  note_ar?: string;
  note_en?: string;
  note_es?: string;
  order?: number;
  is_active?: boolean;
  /** data:image/...;base64,... — envoye en JSON pour eviter multipart */
  image_base64?: string;
}
export interface ProductUpdate{
  id?: string;
  category_id: string;
  slug?: string;

  price: number;
  compare_at_price?: number;
  image?: string;

  // Français (Base)
  name: string;
  short_description?: string;
  description?: string;
  note?: string;

  // Arabe
  name_ar?: string;
  short_description_ar?: string;
  description_ar?: string;
  note_ar?: string;

  // Anglais
  name_en?: string;
  short_description_en?: string;
  description_en?: string;
  note_en?: string;

  // Espagnol
  name_es?: string;
  short_description_es?: string;
  description_es?: string;
  note_es?: string;
  
  is_active: Boolean;
  is_featured: Boolean;
  is_available: Boolean;

  variants: Variant[];
}
export type ProductUpdatePayload = Omit<Product, "id" | "image">;