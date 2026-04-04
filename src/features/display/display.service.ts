// src/features/display-manager/services/display.service.ts

import api from "@/src/core/api/axios";
// src/features/display-manager/services/display.service.ts

export const DisplayService = {
  // Met à jour uniquement les flags TV
 
  updateProductStatus: async (productId: string, fields: { is_active: boolean }) => {
    const res = await api.patch(`/catalogs/products/${productId}/display`, fields);
    return res.data;
  },

    updateCategoryStatus: async (categoryId: string, fields: { is_active?: boolean }) => {
    // URL : /api/products/123/display
    const res = await api.patch(`/catalogs/categories/${categoryId}/display`, fields);
    return res.data;
  },

  // Sauvegarde la configuration globale du Layout TV
  saveLayoutSettings: async (settings: any) => {
    const res = await api.post(`/catalogs/display/settings/`, settings); // Route à créer côté Django
    return res.data;
  },

  getLayoutSettings: async () => {
    const res = await api.get(`/catalogs/display/settings/`);
    return res.data;
  }
};