"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";
import IdentityTab from "./components/IdentityTab";
import DesignTab from "./components/DesignTab";
import BusinessTab from "@/app/(dashboard)/dashboard/settings/components/BusinessTab";
import { useEffect } from "react";

export default function RestaurantSettingsPage() {
  const { activeTab, setActiveTab, saveAll, isLoading, fetchSettings, formData } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ✅ FIX : On vérifie si formData.id existe pour savoir si on a vraiment des données
  const hasData = formData && formData.id;

if (isLoading && (!formData || Object.keys(formData).length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Initialisation...</p>
      </div>
    );
  }
  
  const tabs = [
    { id: 'identity', label: 'Mon Restaurant', icon: '🏪' },
    { id: 'design', label: 'Design & Couleurs', icon: '🎨' },
    { id: 'business', label: 'Infos Business', icon: '💼' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-32 bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Configuration</h1>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[9px] text-green-700 font-black uppercase tracking-widest">Connecté au Cloud</span>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id 
                  ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/30 scale-105" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 mt-4">
        {/* ✅ On ne rend les composants que si les données sont prêtes */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          {!hasData && !isLoading ? (
            <div className="text-center py-10 text-gray-400 font-bold">Aucune donnée trouvée.</div>
          ) : (
            <>
              {activeTab === 'identity' && <IdentityTab />}
              {activeTab === 'design' && <DesignTab />}
              {activeTab === 'business' && <BusinessTab />}
            </>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-4 z-30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center px-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {isLoading ? "Synchronisation..." : "Prêt à publier"}
          </p>
          
          <button
            onClick={saveAll}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black disabled:bg-gray-300 transition-all active:scale-95 shadow-xl shadow-black/20"
          >
            {isLoading ? "ENREGISTREMENT..." : "SAUVEGARDER TOUT"}
          </button>
        </div>
      </footer>
    </div>
  );
}