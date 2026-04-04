import { useState, useCallback } from "react"; // 1. Ajout de useCallback
import { useRouter } from "next/navigation";
import { profileService } from "./profile.services";
import { ProfileUpdatePayload } from "./profile.types";
import axios from "axios";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 2. Utilisation de useCallback pour stabiliser la fonction
  const setupProfile = useCallback(async (data: ProfileUpdatePayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await profileService.updateMe(data);
      
      // 3. On attend un tout petit peu ou on s'assure que la redirection 
      // est la priorité après le succès
      router.push("/account/tenant"); 
      
    } catch (err: unknown) {
      let errorMessage = "Une erreur inattendue est survenue";

      if (axios.isAxiosError(err)) {
        // Django Ninja renvoie souvent les erreurs dans err.response.data
        // Parfois c'est une string, parfois un objet {message: "..."} ou {detail: "..."}
        const data = err.response?.data;
        errorMessage = data?.message || data?.detail || "Erreur lors de la mise à jour";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Profile update failed:", err);
      // Optionnel: on peut re-throw l'erreur si on veut la gérer aussi dans le composant
      throw err; 
    } finally {
      setIsLoading(false);
    }
  }, [router]); // Dépendance à router

  return { setupProfile, isLoading, error };
};