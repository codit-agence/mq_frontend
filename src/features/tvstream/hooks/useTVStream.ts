// features/tvstream/hooks/useTVStream.ts
import { useState, useEffect, useCallback } from "react";
import { tvStreamService } from "../services/tvstream.service";
import { Screen } from "@/src/types/tvstream/tvstream";

export function useTVStream() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [step, setStep] = useState(1);
  const [currentScreenId, setCurrentScreenId] = useState<string | null>(null);
  const [screenName, setScreenName] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchScreens = useCallback(async () => {
    try {
      const data = await tvStreamService.fetchScreens();
      setScreens(data);
    } catch (err) {
      console.error("Erreur listing:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScreens();
    const interval = setInterval(fetchScreens, 10000);
    return () => clearInterval(interval);
  }, [fetchScreens]);

  const resetForm = () => {
    setStep(1);
    setScreenName("");
    setValidationCode("");
    setCurrentScreenId(null);
    setIsAdding(false);
  };

  const handleCreateScreen = async () => {
    if (!screenName) return;
    setIsSubmitting(true);
    try {
      await tvStreamService.createScreen({ name: screenName });
      resetForm();
      fetchScreens();
    } catch (err) {
      alert("Erreur lors de la création de l'écran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySecurity = async () => {
    if (!currentScreenId) return;
    setIsSubmitting(true);
    try {
      await tvStreamService.verifySecurityCode(currentScreenId, validationCode);
      resetForm();
      fetchScreens();
    } catch (err) {
      alert("Code de sécurité incorrect ou TV non prête.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    screens, loading, isAdding, setIsAdding,
    step, setStep, screenName, setScreenName,
    validationCode, setValidationCode, isSubmitting,
    currentScreenId, setCurrentScreenId,
    handleCreateScreen, handleVerifySecurity
  };
}