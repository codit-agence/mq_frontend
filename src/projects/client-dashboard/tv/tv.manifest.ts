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
  const categoryName =
    categories.find((cat) => cat.id === firstCategoryId)?.name || "Menu";

  return {
    label: "Catalog Preview",
    category_name: categoryName,
    template_name: "tvplayer",
    slot_duration: 10,
    audio_url: null,
    products: activeProducts.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.short_description || p.description || "",
      price: p.price,
      image: p.image || "",
    })),
    tenant: {
      name: "Mon Etablissement",
      logo: null,
      show_prices: true,
      primary_color: "#22c55e",
      secondary_color: "#0f172a",
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
