export interface QmwebHeroSlide {
  id: string;
  title_fr: string;
  title_ar: string;
  description_fr: string;
  description_ar: string;
  cta_label_fr: string;
  cta_label_ar: string;
  cta_url: string;
  image_url: string | null;
  order: number;
}

export interface QmwebService {
  id: string;
  title_fr: string;
  title_ar: string;
  description_fr: string;
  description_ar: string;
  icon_name: string;
  image_demo_url: string | null;
  order: number;
  is_active: boolean;
}

export interface QmwebPlanFeature {
  fr: string;
  ar: string;
}

export interface QmwebPricingPlan {
  id: string;
  code: string;
  title_fr: string;
  title_ar: string;
  tagline_fr: string;
  tagline_ar: string;
  price_dh: number;
  original_price_dh: number | null;
  billing_cycle_fr: string;
  billing_cycle_ar: string;
  badge_fr: string;
  badge_ar: string;
  promo_label_fr: string;
  promo_label_ar: string;
  promo_deadline_fr: string;
  promo_deadline_ar: string;
  is_featured: boolean;
  features: QmwebPlanFeature[];
  highlight_fr: string;
  highlight_ar: string;
  order: number;
}

export interface QmwebSection {
  section_key: string;
  title_fr: string;
  title_ar: string;
  subtitle_fr: string;
  subtitle_ar: string;
  description_fr: string;
  description_ar: string;
  cta_label_fr: string;
  cta_label_ar: string;
  cta_url: string;
  background_image_url: string | null;
  is_active: boolean;
}

export interface QmwebPartner {
  id: string;
  name: string;
  logo_url: string | null;
  website: string;
  order: number;
}

export interface QmwebTestimonial {
  id: string;
  client_name: string;
  business_name: string;
  business_city: string;
  content_fr: string;
  content_ar: string;
  rating: number;
  avatar_url: string | null;
  order: number;
}

export interface QmwebFAQ {
  id: string;
  question_fr: string;
  question_ar: string;
  answer_fr: string;
  answer_ar: string;
  category: string;
  order: number;
}

export interface QmwebLegalDocumentIndex {
  slug: string;
  title_fr: string;
  title_ar: string;
}

export interface QmwebPageData {
  hero_slides: QmwebHeroSlide[];
  sections: QmwebSection[];
  services: QmwebService[];
  pricing_plans: QmwebPricingPlan[];
  partners: QmwebPartner[];
  testimonials: QmwebTestimonial[];
  faqs: QmwebFAQ[];
  legal_documents: QmwebLegalDocumentIndex[];
}
