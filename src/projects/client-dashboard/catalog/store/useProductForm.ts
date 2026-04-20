import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCatalogStore } from "./catalog.store";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { ProductUpdate } from "@/src/types/catalogs/catalog_types";

type Lang = "fr" | "ar" | "en" | "es";

function normalizeProductForForm(data: Record<string, unknown>): ProductUpdate {
  const variantsRaw = data.variants;
  const variants = Array.isArray(variantsRaw)
    ? variantsRaw.map((v: Record<string, unknown>) => ({
        id: v.id as string | number | undefined,
        label: String(v.label ?? ""),
        price: Number(v.price ?? 0),
        is_default: Boolean(v.is_default ?? false),
      }))
    : [];

  return {
    id: data.id as string | undefined,
    category_id: String(data.category_id ?? ""),
    slug: (data.slug as string) || "",
    name: String(data.name ?? ""),
    name_ar: String(data.name_ar ?? ""),
    name_en: String(data.name_en ?? ""),
    name_es: String(data.name_es ?? ""),
    short_description: String(data.short_description ?? ""),
    short_description_ar: String(data.short_description_ar ?? ""),
    short_description_en: String(data.short_description_en ?? ""),
    short_description_es: String(data.short_description_es ?? ""),
    description: String(data.description ?? ""),
    description_ar: String(data.description_ar ?? ""),
    description_en: String(data.description_en ?? ""),
    description_es: String(data.description_es ?? ""),
    note: String(data.note ?? ""),
    note_ar: String(data.note_ar ?? ""),
    note_en: String(data.note_en ?? ""),
    note_es: String(data.note_es ?? ""),
    price: Number(data.price ?? 0),
    compare_at_price:
      data.compare_at_price != null && data.compare_at_price !== ""
        ? Number(data.compare_at_price)
        : 0,
    is_active: data.is_active !== false,
    is_featured: !!data.is_featured,
    is_available: data.is_available !== false,
    variants,
  };
}

export const useProductForm = (initialData?: Record<string, unknown> | null, onSuccess?: () => void) => {
  const { createProduct, updateProduct, categories, loading } = useCatalogStore();
  const { formData } = useSettingsStore();
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as Lang[];

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const defaultValues = useMemo<ProductUpdate>(
    () => ({
      name: "",
      name_ar: "",
      name_en: "",
      name_es: "",
      short_description: "",
      short_description_ar: "",
      short_description_en: "",
      short_description_es: "",
      description: "",
      description_ar: "",
      description_en: "",
      description_es: "",
      note: "",
      note_ar: "",
      note_en: "",
      note_es: "",
      category_id: "",
      price: 0,
      compare_at_price: 0,
      is_active: true,
      is_featured: false,
      is_available: true,
      variants: [],
    }),
    []
  );

  const { register, control, handleSubmit, reset, getValues, formState } = useForm<ProductUpdate>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (!initialData || typeof initialData !== "object") return;
    reset(normalizeProductForForm(initialData));
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image est trop lourde (max 2MB)");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ProductUpdate) => {
    const tid = toast.loading("Action en cours...");
    try {
      const d = data as unknown as Record<string, string | undefined>;
      const mapName = (lang: Lang) => (lang === "fr" ? (data.name || "") : (d[`name_${lang}`] || ""));
      const mapDescription = (lang: Lang) =>
        lang === "fr" ? (data.description || "") : (d[`description_${lang}`] || "");

      const missingLang = activeLanguages.find(
        (lang) => !String(mapName(lang)).trim() || !String(mapDescription(lang)).trim()
      );

      if (missingLang) {
        const labels: Record<Lang, string> = {
          fr: "Français",
          ar: "Arabe",
          en: "Anglais",
          es: "Espagnol",
        };
        toast.error(
          `Obligatoire: nom + description en ${labels[missingLang]}. Completez les champs ou modifiez Active languages dans Parametres > Design.`,
          { id: tid }
        );
        return;
      }

      const { id: _omitId, image: _omitImg, ...rest } = data as ProductUpdate & { image?: string };
      const payload = {
        ...rest,
        price: Number(data.price),
        compare_at_price: data.compare_at_price,
        is_available: data.is_available !== false,
        is_featured: !!data.is_featured,
        is_active: data.is_active !== false,
        variants: (data.variants || []).map((v) => ({
          label: v.label,
          price: Number(v.price),
          is_default: v.is_default ?? false,
        })),
      };

      if (initialData?.id) {
        await updateProduct(String(initialData.id), payload as ProductUpdate, imageFile || undefined);
        toast.success("Mis a jour.", { id: tid });
      } else {
        await createProduct(payload as ProductUpdate, imageFile || undefined);
        toast.success("Produit cree.", { id: tid });
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement", { id: tid });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    fields,
    append,
    remove,
    preview,
    handleImageChange,
    isSubmitting: loading,
    categories,
    formState,
    reset,
    getValues,
  };
};
