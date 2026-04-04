import { useEffect, useRef } from 'react';
import { useTVStore } from '../store/tvapp.store';
import { tvService } from '../services/tvapp.service';

export const useTVHeartbeat = (intervalMs: number = 30000) => {
  const { accessToken, logout, setTemplate } = useTVStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const performHeartbeat = async () => {
    if (!accessToken) return;

    try {
      // On envoie le heartbeat (30s par défaut)
      const response = await tvService.sendHeartbeat(accessToken, intervalMs / 1000);

      // 1. Mise à jour du Template si le Dashboard a changé
      if (response.current_template) {
        setTemplate(response.current_template);
      }

      // 2. Si le serveur demande un Refresh forcé (F5)
      if (response.needs_refresh) {
        window.location.reload();
      }

      // 3. Si l'écran est mis en pause par le gérant
      if (response.status === 'paused') {
        console.log("L'écran est en mode veille/pause");
      }

    } catch (error: any) {
      console.error("Erreur Heartbeat:", error);
      
      // Si le Token est invalide (ex: écran supprimé du dashboard), on déconnecte
      if (error.response?.status === 401 || error.response?.status === 404) {
        logout();
      }
    }
  };

  useEffect(() => {
    // On lance le premier heartbeat immédiatement
    performHeartbeat();

    // Puis on définit l'intervalle
    timerRef.current = setInterval(performHeartbeat, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [accessToken]); // Se relance si le token change
};