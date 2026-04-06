// src/hooks/useCurrentTenant.ts
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { useParams } from "next/navigation";


export const useCurrentTenant = () => {
  const params = useParams();
  const { tenant, user } = useAuthStore();

  // L'ID de l'URL est prioritaire pour les requêtes API
  const tenantId = params.id as string || tenant?.id;

  return {
    tenantId,    // Utilise ça pour router.push() ou tes API
    tenant,      // Utilise ça pour afficher le Nom/Logo
    user,
    isLoaded: !!tenantId
  };
};