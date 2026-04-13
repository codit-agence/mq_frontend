import { create } from 'zustand';
import { tvVisibilityService } from '../services/tv-visibility.service';
import { useCatalogStore } from '@/src/projects/client-dashboard/catalog/store/catalog.store';
import { toast } from 'react-hot-toast';

interface TvVisibilityState {
  loadingId: string | null;
  toggleTvVisibility: (productId: string, currentStatus: boolean) => Promise<void>;
  toggleCategoryVisibility: (categoryId: string, currentStatus: boolean) => Promise<void>;
}

export const useTvVisibilityStore = create<TvVisibilityState>((set) => ({
  loadingId: null,

  // GESTION PRODUIT
toggleTvVisibility: async (productId, currentStatus) => {
    // On s'assure que nextStatus est le strict opposé
    const nextStatus = currentStatus === true ? false : true; 
    
    set({ loadingId: productId });
    try {
        // Envoi au serveur
        await tvVisibilityService.updateProductStatus(productId, { is_active: nextStatus });
        
        // Mise à jour du CatalogStore
        const { products } = useCatalogStore.getState();
        const updated = products.map(p => 
            p.id === productId ? { ...p, is_active: nextStatus } : p
        );
        
        useCatalogStore.setState({ products: updated });
        toast.success(nextStatus ? "Activé sur TV" : "Masqué sur TV");
    } catch (error) {
        toast.error("Erreur lors de la mise à jour");
    } finally {
        set({ loadingId: null });
    }
},

// GESTION CATÉGORIE
toggleCategoryVisibility: async (categoryId, currentStatus) => {
    const nextStatus = currentStatus === true ? false : true;

    set({ loadingId: categoryId });
    try {
        await tvVisibilityService.updateCategoryStatus(categoryId, { is_active: nextStatus });

        const { categories } = useCatalogStore.getState();
        const updated = categories.map(c => 
            c.id === categoryId ? { ...c, is_active: nextStatus } : c
        );
        
        useCatalogStore.setState({ categories: updated });
        toast.success(nextStatus ? "Catégorie active" : "Catégorie désactivée");
    } catch (error) {
        toast.error("Erreur lors de la mise à jour");
    } finally {
        set({ loadingId: null });
    }
},
}));