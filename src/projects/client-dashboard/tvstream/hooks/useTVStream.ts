import { useState, useEffect, useCallback, useRef } from "react";
import { tvStreamService } from "../services/tvstream.service";
import { Screen, TenantScreenSummary } from "@/src/types/tvstream/tvstream";

export function useTVStream(tenantId?: string | null) {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState(1);
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);
  const [screenName, setScreenName] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<TenantScreenSummary | null>(null);
  const [actionLoadingByScreen, setActionLoadingByScreen] = useState<Record<string, boolean>>({});

  const isFetchingRef = useRef(false);

  const fetchScreens = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const data = await tvStreamService.fetchScreens(tenantId || undefined);
      setScreens(data);
    } catch (err) {
      console.error("Erreur listing:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [tenantId]);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await tvStreamService.fetchTenantSummary(tenantId || undefined);
      setSummary(data);
    } catch (err) {
      console.error("Erreur summary:", err);
    }
  }, [tenantId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (interval) clearInterval(interval);
      const period = document.hidden ? 60000 : 30000;
      interval = setInterval(() => {
        void fetchScreens();
        void fetchSummary();
      }, period);
    };

    fetchScreens();
    fetchSummary();
    startPolling();

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (interval) clearInterval(interval);
        interval = null;
      } else {
        fetchScreens();
        fetchSummary();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [fetchScreens, fetchSummary]);

  const resetForm = () => {
    setStep(1);
    setScreenName("");
    setValidationCode("");
    setCurrentScreenId(null);
    setIsAdding(false);
  };

  const handleCreateScreen = async () => {
    if (!screenName.trim()) return;
    setIsSubmitting(true);
    try {
      await tvStreamService.createScreen({ name: screenName }, tenantId || undefined);
      resetForm();
      fetchScreens();
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      const detail = ax.response?.data?.detail || ax.response?.data?.message;
      const status = ax.response?.status;
      const hint = detail || (status ? `Erreur HTTP ${status}` : "Réseau ou serveur indisponible");
      alert(`Impossible de créer l'écran.\n${hint}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySecurity = async () => {
    if (!currentScreenId) return;
    setIsSubmitting(true);
    try {
      await tvStreamService.verifySecurityCode(currentScreenId, validationCode, tenantId || undefined);
      resetForm();
      fetchScreens();
    } catch (err) {
      alert("Code de sécurité incorrect ou TV non prête.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteScreen = async (screenId: string): Promise<boolean> => {
    const ok = window.confirm("Supprimer cet écran ? Cette action est définitive.");
    if (!ok) return false;
    try {
      await tvStreamService.deleteScreen(screenId, tenantId || undefined);
      await fetchScreens();
      return true;
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      const detail = ax.response?.data?.detail || ax.response?.data?.message;
      const status = ax.response?.status;
      const hint = detail || (status ? `Erreur HTTP ${status}` : "Réseau ou serveur indisponible");
      alert(`Impossible de supprimer cet écran.\n${hint}`);
      return false;
    }
  };

  const runScreenAction = async (screenId: string, action: () => Promise<unknown>, errorMessage: string) => {
    setActionLoadingByScreen((prev) => ({ ...prev, [screenId]: true }));
    try {
      await action();
      await Promise.all([fetchScreens(), fetchSummary()]);
    } catch (err) {
      alert(errorMessage);
    } finally {
      setActionLoadingByScreen((prev) => ({ ...prev, [screenId]: false }));
    }
  };

  const handleResetMovedAlert = async (screenId: string) => {
    await runScreenAction(
      screenId,
      () => tvStreamService.resetMovedAlert(screenId, tenantId || undefined),
      "Impossible de réinitialiser l'alerte de déplacement."
    );
  };

  const handleForceRefresh = async (screenId: string) => {
    await runScreenAction(
      screenId,
      () => tvStreamService.forceRefresh(screenId, tenantId || undefined),
      "Impossible d'envoyer le refresh à l'écran."
    );
  };

  const handleResetPairing = async (screenId: string): Promise<boolean> => {
    const ok = window.confirm(
      "Réinitialiser l'appairage de cet écran ?\nUn nouveau code 6 chiffres sera généré et la TV devra se reconnecter."
    );
    if (!ok) return false;
    try {
      await tvStreamService.resetPairing(screenId, tenantId || undefined);
      await fetchScreens();
      return true;
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { detail?: string; message?: string } } };
      const detail = ax.response?.data?.detail || ax.response?.data?.message;
      const status = ax.response?.status;
      const hint = detail || (status ? `Erreur HTTP ${status}` : "Réseau ou serveur indisponible");
      alert(`Impossible de réinitialiser l'appairage.\n${hint}`);
      return false;
    }
  };

  return {
    screens,
    loading,
    summary,
    fetchScreens,
    fetchSummary,
    isAdding,
    setIsAdding,
    step,
    setStep,
    screenName,
    setScreenName,
    validationCode,
    setValidationCode,
    isSubmitting,
    currentScreenId,
    setCurrentScreenId,
    actionLoadingByScreen,
    handleCreateScreen,
    handleVerifySecurity,
    handleDeleteScreen,
    handleResetMovedAlert,
    handleForceRefresh,
    handleResetPairing,
  };
}
