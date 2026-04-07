// RestaurantSettingsPage.tsx
"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";
import IdentityTab from "./components/IdentityTab";
import DesignTab from "./components/DesignTab";
import BusinessTab from "@/app/(dashboard)/dashboard/settings/components/BusinessTab";
import { useEffect } from "react";

export default function RestaurantSettingsPage() {
  const { activeTab, setActiveTab, saveAll, isLoading, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // État de chargement initial (Plus pro qu'un texte simple)
  if (isLoading && !activeTab) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Chargement de votre restaurant...</p>
      </div>
    );
  }
  
  const tabs = [
    { id: 'identity', label: 'Mon Restaurant', icon: '🏪' },
    { id: 'design', label: 'Design & Couleurs', icon: '🎨' },
    { id: 'business', label: 'Infos Business', icon: '💼' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50">
      {/* Header avec Navigation Tabs */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Configuration</h1>
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold uppercase tracking-widest">En ligne</span>
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

      {/* Contenu Dynamique */}
      <main className="max-w-4xl mx-auto w-full p-4 mt-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 transition-all">
          {activeTab === 'identity' && <IdentityTab />}
          {activeTab === 'design' && <DesignTab />}
          {activeTab === 'business' && <BusinessTab />}
        </div>
      </main>

      {/* Footer Fixe de Sauvegarde */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 z-30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center px-4">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                Modifications en attente de sauvegarde
             </p>
          </div>
          
          <button
            onClick={saveAll}
            disabled={isLoading}
            className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black disabled:bg-gray-300 transition-all active:scale-95 shadow-xl shadow-black/20"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 Enregistrement...
              </span>
            ) : "PUBLIER LES MODIFICATIONS"}
          </button>
        </div>
      </footer>
    </div>
  );
}