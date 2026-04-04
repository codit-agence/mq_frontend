import axios from "axios";
import { ApiError } from "@/src/types/api/api";

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError<ApiError>(err)) {
    return err.response?.data?.message || "Erreur serveur";
  }
  return "Une erreur est survenue";
};