import { create } from "zustand";
import { catalogService } from "../catalog.services";
import { Product, Category, ProductPayload, CategoryPayload, ProductUpdate } from "@/src/types/catalogs/catalog_types";

interface CatalogState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;

  fetchCatalog: () => Promise<void>;
  createProduct: (p: ProductPayload, img?: File) => Promise<Product>;
  updateProduct: (id: string, p: ProductUpdate, img?: File) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  createCategory: (c: CategoryPayload, img?: File) => Promise<void>;
  updateCategory: (id: string, c: CategoryPayload, img?: File) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  resetCatalog: () => void;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  fetchCatalog: async () => {
    set({ loading: true, error: null });
    try {
      const [products, categories] = await Promise.all([
        catalogService.getProducts(),
        catalogService.getCategories(),
      ]);
      set({ products, categories });
    } catch (err) {
      set({ error: "Erreur de synchronisation du catalogue" });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (p, img) => {
    set({ loading: true });
    try {
      const product = await catalogService.createProduct(p, img);
      set((state) => ({ products: [product, ...state.products] }));
      return product;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, p, img) => {
    set({ loading: true });
    try {
      const updated = await catalogService.updateProduct(id, p, img);
      set((state) => ({
        products: state.products.map((prod) => prod.id === id ? updated : prod)
      }));
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await catalogService.deleteProduct(id);
      set((state) => ({ 
        products: state.products.filter((p) => p.id !== id) 
      }));
    } catch (err) {
      throw new Error("Échec de la suppression");
    }
  },

  createCategory: async (c, img) => {
    const category = await catalogService.createCategory(c, img);
    set((state) => ({ categories: [...state.categories, category] }));
  },

  updateCategory: async (id, c, img) => {
    const updated = await catalogService.updateCategory(id, c, img);
    set((state) => ({
      categories: state.categories.map((cat) => cat.id === id ? updated : cat)
    }));
  },

  deleteCategory: async (id) => {
    await catalogService.deleteCategory(id);
    set((state) => ({ 
      categories: state.categories.filter((c) => c.id !== id) 
    }));
  },

resetCatalog: () => set({ 
  products: [], 
  categories: [], 
  loading: false, 
  error: null 
}),
}));