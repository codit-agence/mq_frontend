// src/features/profile/profile.services.ts
import  api from "@/src/core/api/axios";
import { ProfileDetails, ProfileUpdatePayload } from "./profile.types";

export const profileService = {
  updateMe: async (data: ProfileUpdatePayload): Promise<ProfileDetails> => {
    // Ordre : BASE_URL + /profile + /me + /
    // Vérifie bien que "profile" est au singulier comme dans ton api.add_router
    const res = await api.put("profile/me", data); 
    return res.data;
  },
  
  getMe: async (): Promise<ProfileDetails> => {
    const res = await api.get("profile/me");
    return res.data;
  }
};