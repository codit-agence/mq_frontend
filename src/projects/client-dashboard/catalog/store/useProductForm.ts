import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCatalogStore } from "./catalog.store";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { ProductUpdate } from "@/src/types/catalogs/catalog_types";

type Lang = "fr" | "ar" | "en" | "es";

export const useProductForm = (initialData?: any | null, onSuccess?: () => void) => {
  const { createProduct, updateProduct, categories, loading } = useCatalogStore();
  const { formData } = useSettingsStore();
  const activeLanguages = ((formData?.display?.active_languages || ["fr"]) as Lang[]);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, control, handleSubmit, reset, formState } = useForm<ProductUpdate>({
    defaultValues: {
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
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      reset({
        ...initialData,
        variants: initialData.variants || [],
      });
    }
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
      const mapName = (lang: Lang) =>
        lang === "fr" ? (data.name || "") : ((data as any)[`name_${lang}`] || "");
      const mapDescription = (lang: Lang) =>
        lang === "fr" ? (data.description || "") : ((data as any)[`description_${lang}`] || "");

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

      const payload = {
        ...data,
        price: Number(data.price),
      };

      if (initialData?.id) {
        await updateProduct(initialData.id, payload, imageFile || undefined);
        toast.success("Mis a jour.", { id: tid });
      } else {
        await createProduct(payload, imageFile || undefined);
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
  };
};
