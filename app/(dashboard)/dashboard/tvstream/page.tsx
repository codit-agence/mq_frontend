"use client";
import { Tv, Plus, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import PairingScreenCard from "./components/PairingScreenCard";
import { AddScreenForm } from "./components/AddScreenForm";
import { PairingModal } from "./components/PairingModal";
import { useTVStream } from "@/src/projects/client-dashboard/tvstream/hooks/useTVStream";
export default function TVStreamPage() {
  const {
    screens, loading, isAdding, setIsAdding,
    step, setStep, screenName, setScreenName,
    validationCode, setValidationCode, isSubmitting,
    setCurrentScreenId, handleCreateScreen, handleVerifySecurity
  } = useTVStream();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header simple */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black italic flex items-center gap-3">
            <Tv className="text-blue-500" size={40} /> TV<span className="text-blue-500">STREAM</span>
          </h1>
          <button onClick={() => setIsAdding(!isAdding)} className="bg-blue-600 px-8 py-4 rounded-2xl font-black">
            {isAdding ? "Fermer" : "NOUVEL ÉCRAN"}
          </button>
        </div>

        {/* Formulaire d'ajout */}
        <AnimatePresence>
          {isAdding && (
            <AddScreenForm 
              screenName={screenName} 
              setScreenName={setScreenName} 
              onSubmit={handleCreateScreen} 
              isSubmitting={isSubmitting} 
            />
          )}
        </AnimatePresence>

        {/* Grille d'écrans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Loader2 className="animate-spin mx-auto text-blue-500" size={48} />
          ) : (
            screens.map((s) => (
              <PairingScreenCard key={s.id} screen={s} onStartPairing={(id) => { setCurrentScreenId(id); setStep(3); }} />
            ))
          )}
        </div>
      </div>

      {/* Modal de sécurité */}
      <AnimatePresence>
        {step === 3 && (
          <PairingModal 
            code={validationCode} 
            setCode={setValidationCode} 
            onConfirm={handleVerifySecurity} 
            onCancel={() => setStep(1)} 
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}