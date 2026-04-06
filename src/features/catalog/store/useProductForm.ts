import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useCatalogStore } from "./catalog.store";
import { ProductPayload, ProductUpdate } from "@/src/types/catalogs/catalog_types";

export const useProductForm = (initialData?: any | null, onSuccess?: () => void) => {
  const { createProduct, updateProduct, categories, loading } = useCatalogStore();
  
  const [preview, setPreview] = useState<string | null>(initialData?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, control, handleSubmit, reset, formState } = useForm<ProductUpdate>({
    defaultValues: initialData || {
      name: "", name_ar: "", name_en: "",
      category_id: "",
      price: 0,
      is_active: true,
      variants: [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  // Cleanup memoire image
  useEffect(() => {
    return () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); };
  }, [preview]);

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setPreview(initialData.image || null);
    }
  }, [initialData, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductUpdate) => {
    const tid = toast.loading("Action en cours...");
    try {
      if (initialData?.id) {
        await updateProduct(initialData.id, data, imageFile || undefined);
        toast.success("Mis à jour !", { id: tid });
      } else {
        await createProduct(data, imageFile || undefined);
        toast.success("Créé !", { id: tid });
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error("Erreur technique", { id: tid });
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    fields,
    append,
    formState, // <--- AJOUTE CECI ICI
    remove,
    preview,
    handleImageChange,
    isSubmitting: loading,
    categories,
    resetForm: () => reset()
  };
};