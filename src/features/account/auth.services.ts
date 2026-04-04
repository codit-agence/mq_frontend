import api from "@/src/core/api/axios";

import { LoginIn, RegisterIn } from "@/src/types/accounts/auth.payloads"; // À créer pour tes inputs
import { LoginResponse, RegisterResponse, MeResponse } from "@/src/types/accounts/account.types"; // À créer pour les réponses de l'API

export const authService = {
  async register(data: RegisterIn): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  async login(credentials: LoginIn): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  async getMe(): Promise<MeResponse> {
  // On utilise l'URL exacte que tu as testée manuellement
  // Si ton baseURL est déjà http://192.168.110.3:8000/api
  const response = await api.get<MeResponse>("/auth/me"); // <--- Pas de slash au début, pas de slash à la fin
  return response.data;
}
};