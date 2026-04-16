import { Category, Product } from "@/src/types/catalogs/catalog_types";
import { TVManifest } from "./tv.types";

export const buildManifestFromCatalog = (
  products: Product[],
  categories: Category[]
): TVManifest | null => {
  const activeProducts = products.filter((p) => p.is_active);
  if (!activeProducts.length) {
    return null;
  }

  const firstCategoryId = activeProducts[0]?.category_id;
  const firstCat = categories.find((cat) => cat.id === firstCategoryId);
  const categoryName = firstCat?.name || "Menu";
  const catAr = firstCat ? (firstCat as { name_ar?: string | null }).name_ar : undefined;
  const anyAr = activeProducts.some((p) => (p.name_ar || "").trim().length > 0);
  const bilingual = anyAr;
  const tvLanguages = bilingual
    ? { mode: "bilingual" as const, primary: "ar", secondary: "fr", all: ["ar", "fr"] }
    : { mode: "single" as const, primary: "fr", secondary: null as string | null, all: ["fr"] };

  return {
    label: "Catalog Preview",
    category_name: bilingual && catAr?.trim() ? catAr.trim() : categoryName,
    category_name_secondary: bilingual ? categoryName : undefined,
    template_name: "tvplayer",
    slot_duration: 10,
    audio_url: null,
    products: activeProducts.map((p) => {
      const arName = (p.name_ar || "").trim();
      const base: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
        name_secondary?: string;
        description_secondary?: string;
      } = {
        id: p.id,
        name: bilingual && arName ? arName : p.name,
        description:
          bilingual && (p as { description_ar?: string }).description_ar
            ? String((p as { description_ar?: string }).description_ar)
            : p.short_description || p.description || "",
        price: p.price,
        image: p.image || "",
      };
      if (bilingual && arName) {
        base.name_secondary = p.name;
        const dAr = (p as { description_ar?: string }).description_ar;
        const sAr = (p as { short_description_ar?: string }).short_description_ar;
        const secDesc = (dAr || sAr || "").trim();
        if (secDesc) base.description_secondary = secDesc;
        else if (p.short_description || p.description) {
          base.description_secondary = (p.short_description || p.description || "").trim();
        }
      }
      return base;
    }),
    tenant: {
      name: "Mon Etablissement",
      logo: null,
      show_prices: true,
      primary_color: "#22c55e",
      secondary_color: "#0f172a",
      tv_languages: tvLanguages,
      active_languages: [...tvLanguages.all],
      default_language: bilingual ? "ar" : "fr",
      is_rtl: bilingual,
    },
    server_time: new Date().toISOString(),
  };
};

export const applyManifestPersonalization = (
  manifest: TVManifest,
  options: {
    templateName: string;
    displayName: string;
    primaryColor: string;
    secondaryColor: string;
  }
): TVManifest => {
  return {
    ...manifest,
    template_name: options.templateName,
    tenant: {
      ...manifest.tenant,
      name: options.displayName.trim() || manifest.tenant.name,
      name_override: options.displayName.trim() || manifest.tenant.name,
      primary_color: options.primaryColor,
      secondary_color: options.secondaryColor,
    },
  };
};
