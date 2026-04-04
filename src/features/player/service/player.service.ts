// src/features/scheduler/services/display.service.ts
import api from "@/src/core/api/axios";

export const DisplayService = {
  // Récupère ce qui doit être affiché MAINTENANT
  getActiveManifest: async () => {
    const res = await api.get('/manifest/active-manifest');
    return res.data;
  }
};