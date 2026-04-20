import api from "@/src/core/api/axios";
import { 
  Product, ProductPayload, Category, CategoryPayload, 
  ProductUpdate
} from "@/src/types/catalogs/catalog_types";

// Helper privé pour transformer le payload en FormData propre
// Changement du type data en 'any' ou 'Partial<ProductPayload>' pour accepter les Updates
const prepareProductFormData = (data: any, imageFile?: File) => {
  const formData = new FormData();
  
  const payload = {
    ...data,
    price: data.price != null && data.price !== "" ? Number(data.price) : undefined,
    compare_at_price:
      data.compare_at_price != null && data.compare_at_price !== ""
        ? Number(data.compare_at_price)
        : null,
    is_available: data.is_available !== false,
    is_featured: !!data.is_featured,
    is_active: data.is_active !== false,
  };

  formData.append("data", JSON.stringify(payload));
  if (imageFile) formData.append("image", imageFile);
  
  return formData;
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Lecture fichier"));
    reader.readAsDataURL(file);
  });
}

export const catalogService = {
  // --- PRODUCTS ---
  
  getProducts: async (): Promise<Product[]> => {
    const res = await api.get("/catalogs/products");
    return res.data;
  },

  // NOUVEAU : Récupérer un produit spécifique pour l'édition
  getProductById: async (id: string): Promise<Product> => {
    const res = await api.get(`/catalogs/products/${id}`);
    return res.data;
  },

  createProduct: async (data: ProductPayload, imageFile?: File): Promise<Product> => {
    const formData = prepareProductFormData(data, imageFile);
    // Ne pas fixer Content-Type : le navigateur ajoute le boundary multipart requis.
    const res = await api.post("/catalogs/products", formData);
    return res.data;
  },

  updateProduct: async (id: string, data: ProductUpdate, imageFile?: File): Promise<Product> => {
    const formData = prepareProductFormData(data, imageFile);
    const res = await api.put(`/catalogs/products/${id}`, formData);
    return res.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/catalogs/products/${id}`);
  },

  // --- CATEGORIES ---

  getCategories: async (): Promise<Category[]> => {
    const res = await api.get("/catalogs/categories");
    return res.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const res = await api.get(`/catalogs/categories/${id}`);
    return res.data;
  },

  /**
   * Toujours JSON : l’image est envoyee en image_base64 (data URL), pas de multipart
   * (evite les 400 via proxy Next ou Content-Type).
   */
  createCategory: async (payload: CategoryPayload, imageFile?: File): Promise<Category> => {
    const body: CategoryPayload = { ...payload };
    if (imageFile) {
      body.image_base64 = await fileToDataUrl(imageFile);
    }
    const res = await api.post("/catalogs/categories", body);
    return res.data;
  },

  updateCategory: async (id: string, payload: CategoryPayload, imageFile?: File): Promise<Category> => {
    const body: CategoryPayload = { ...payload };
    if (imageFile) {
      body.image_base64 = await fileToDataUrl(imageFile);
    }
    const res = await api.put(`/catalogs/categories/${id}`, body);
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/catalogs/categories/${id}`);
  }
};