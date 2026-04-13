import api from "@/src/core/api/axios";

import { LoginIn, RegisterIn } from "@/src/types/accounts/auth.payloads"; // À créer pour tes inputs
import { LoginResponse, RegisterResponse, MeResponse } from "@/src/types/accounts/account.types"; // À créer pour les réponses de l'API

export const authService = {
  async register(data: RegisterIn): Promise<RegisterResponse> {
    console.log("API Call: POST /auth/register", data);
    try {
      const response = await api.post<RegisterResponse>("/auth/register", data);
      console.log("API Response: register success", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error: register failed", error);
      throw error;
    }
  },

  async onboarding(data: RegisterIn): Promise<RegisterResponse> {
    console.log("API Call: POST /auth/onboarding", data);
    try {
      const response = await api.post<RegisterResponse>("/auth/onboarding", data);
      console.log("API Response: onboarding success", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error: onboarding failed", error);
      throw error;
    }
  },

  async login(credentials: LoginIn): Promise<LoginResponse> {
    console.log("API Call: POST /auth/login", { email: credentials.email, password: "[HIDDEN]" });
    try {
      const response = await api.post<LoginResponse>("/auth/login", credentials);
      console.log("API Response: login success");
      return response.data;
    } catch (error) {
      console.error("API Error: login failed", error);
      throw error;
    }
  },
  async forgotPassword(email: string) {
    console.log("API Call: POST /auth/forgot-password", { email });
    try {
      const response = await api.post("/auth/forgot-password", { email });
      console.log("API Response: forgot-password success");
      return response.data;
    } catch (error) {
      console.error("API Error: forgot-password failed", error);
      throw error;
    }
  },
  
  async resetPasswordConfirm(data: any) {
    const response = await api.post("/auth/reset-password-confirm", data);
    return response.data;
  },

  async getMe(): Promise<MeResponse> {
  // On utilise l'URL exacte que tu as testée manuellement
  // Si ton baseURL est déjà http://192.168.110.3:8000/api
  const response = await api.get<MeResponse>("/auth/me"); // <--- Pas de slash au début, pas de slash à la fin
  return response.data;
}
};