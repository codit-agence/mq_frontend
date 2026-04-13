"use client";
import { Tv, Plus, Loader2, Signal, AlertTriangle, Clock3 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import ScreenCard from "./components/ScreenCard";
import { AddScreenForm } from "./components/AddScreenForm";
import { PairingModal } from "./components/PairingModal";
import { useTVStream } from "@/src/projects/client-dashboard/tvstream/hooks/useTVStream";
export default function TVStreamPage() {
  const params = useParams<{ tenantId?: string }>();
  const {
    screens, loading, isAdding, setIsAdding,
    summary,
    step, setStep, screenName, setScreenName,
    validationCode, setValidationCode, isSubmitting,
    actionLoadingByScreen,
    setCurrentScreenId,
    handleCreateScreen,
    handleVerifySecurity,
    handleDeleteScreen,
    handleResetMovedAlert,
    handleForceRefresh,
  } = useTVStream(params?.tenantId);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black italic flex items-center gap-3">
            <Tv className="text-blue-500" size={34} /> TV<span className="text-blue-500">STREAM</span>
          </h1>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="w-full sm:w-auto bg-blue-600 px-6 py-3 rounded-2xl font-black text-sm"
          >
            {isAdding ? "Fermer" : "NOUVEL ÉCRAN"}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={<Signal size={16} />} label="En ligne" value={summary?.online_screens ?? 0} />
          <StatCard icon={<Tv size={16} />} label="Total écrans" value={summary?.total_screens ?? screens.length} />
          <StatCard icon={<AlertTriangle size={16} />} label="Alerte déplacement" value={summary?.moved_alert_count ?? 0} />
          <StatCard icon={<Clock3 size={16} />} label="Uptime 7j (h)" value={Math.round(((summary?.last_7_days.total_uptime_seconds ?? 0) / 3600) * 10) / 10} />
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-16">
              <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
          ) : (
            screens.map((s) => (
              <ScreenCard
                key={s.id}
                screen={s}
                onStartPairing={(id: string) => { setCurrentScreenId(id); setStep(3); }}
                onDelete={handleDeleteScreen}
                onResetMovedAlert={handleResetMovedAlert}
                onForceRefresh={handleForceRefresh}
                busy={!!actionLoadingByScreen[s.id]}
              />
            ))
          )}
        </div>

        {!loading && screens.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
            Aucun écran enregistré pour ce tenant.
          </div>
        )}
      </div>

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

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-wider font-bold">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-white">{value}</div>
    </div>
  );
}
