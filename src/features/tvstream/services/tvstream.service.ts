import api from '@/src/core/api/axios';
import { Screen, ScreenCreateInput, ScreenUpdateInput } from '@/src/types/tvstream/tvstream';


export const tvStreamService = {
  // Liste des écrans du Tenant
  fetchScreens: async (): Promise<Screen[]> => {
    const response = await api.get('/screens/dashboard/');
    return response.data;
  },

  // Création d'un nouvel emplacement (Génère le code 6 chiffres)
createScreen: async (data: ScreenCreateInput): Promise<Screen> => {
  const response = await api.post('/screens/dashboard/', data);
  // On s'assure que si le backend oublie le code, on renvoie une string vide et pas undefined
  return {
    ...response.data,
    pairing_code: response.data.pairing_code || "",
    id: response.data.id || ""
  };
},

  // Validation des 4 chiffres vus sur la TV
verifySecurityCode: async (screenId: string, code: string) => {
  // Vérifie bien que la clé correspond au schéma Python (ex: security_code)
  const response = await api.post(`/screens/dashboard/${screenId}/verify-security`, { 
    security_code: code 
  });
  return response.data;
},

  // Mise à jour de la config (Template, Nom)
  updateConfig: async (screenId: string, data: ScreenUpdateInput): Promise<Screen> => {
    const response = await api.patch(`/screens/dashboard/${screenId}/config`, data);
    return response.data;
  }
};