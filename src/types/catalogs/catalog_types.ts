// CATEGORY
export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;

  order: number;
  is_active: boolean;
}

// VARIANT
export interface Variant {
  id?: string;
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

  name_ar?: string;


  short_description?: string;
  description?: string;
  note?: string;

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

  variants?: Variant[];
}

export interface CategoryPayload {
  name: string;
  name_ar?: string;
  name_en?: string;
  name_es?: string;
  order?: number;
  image?: string; // Ajout de l'image en tant que champ optionnel
  is_active?: boolean;
}
export interface ProductUpdate{
  id: string;
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

  variants: Variant[];
}
export type ProductUpdatePayload = Omit<Product, "id" | "image">;