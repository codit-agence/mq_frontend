// src/features/tenant/useTenantData.ts
import { useState, useEffect } from "react";
import { tenantService } from "./tenant.services";
import { ITenant } from "./tenant.types";

export const useTenantData = () => {
  const [tenant, setTenant] = useState<ITenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const data = await tenantService.getSettings();
        setTenant(data);
      } catch (err) {
        // Au lieu de crasher, on log l'erreur et on laisse tenant à null
        console.warn("Aucun tenant trouvé pour cet utilisateur");
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, []);

  return { tenant, loading };
};