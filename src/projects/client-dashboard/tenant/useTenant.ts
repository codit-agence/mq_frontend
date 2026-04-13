import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { tenantService } from "./tenant.services";
import { CreateTenantPayload } from "./tenant.types";
import axios from "axios";

export const useTenant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createTenant = useCallback(async (data: CreateTenantPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await tenantService.create(data);
      // Une fois l'établissement créé, on va vers le dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      let msg = "Erreur lors de la création de l'établissement";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.response?.data?.detail || msg;
      }
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return { createTenant, isLoading, error };
};