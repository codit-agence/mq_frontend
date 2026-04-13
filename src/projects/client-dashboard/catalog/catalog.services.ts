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
    // On s'assure que si le prix existe, c'est un nombre
    price: data.price ? Number(data.price) : undefined,
    compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : null,
  };

  formData.append("data", JSON.stringify(payload));
  if (imageFile) formData.append("image", imageFile);
  
  return formData;
};

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
    const res = await api.post("/catalogs/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateProduct: async (id: string, data: ProductUpdate, imageFile?: File): Promise<Product> => {
    const formData = prepareProductFormData(data, imageFile);
    const res = await api.put(`/catalogs/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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

  createCategory: async (payload: CategoryPayload): Promise<Category> => {
    const res = await api.post("/catalogs/categories", payload);
    return res.data;
  },

  updateCategory: async (id: string, payload: CategoryPayload): Promise<Category> => {
    const res = await api.put(`/catalogs/categories/${id}`, payload);
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/catalogs/categories/${id}`);
  }
};