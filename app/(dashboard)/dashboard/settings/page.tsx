"use client";

import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";
import IdentityTab from "./components/IdentityTab";
import DesignTab from "./components/DesignTab";
import BusinessTab from "@/app/(dashboard)/dashboard/settings/components/BusinessTab";

export default function RestaurantSettingsPage() {
  const { activeTab, setActiveTab, saveAll, isLoading } = useSettingsStore();

  const tabs = [
    { id: 'identity', label: 'Mon Restaurant', icon: '🏪' },
    { id: 'design', label: 'Design & Couleurs', icon: '🎨' },
    { id: 'business', label: 'Infos Business', icon: '💼' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-gray-50">
      {/* Header avec Navigation Tabs */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold mb-4">Configuration du Restaurant</h1>
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                  ? "bg-yellow-500 text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Contenu Dynamique */}
      <main className="max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {activeTab === 'identity' && <IdentityTab />}
          {activeTab === 'design' && <DesignTab />}
          {activeTab === 'business' && <BusinessTab />}
        </div>
      </main>

      {/* Footer Fixe de Sauvegarde */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-sm text-gray-500 hidden sm:block">
            Modifications non enregistrées
          </p>
          <button
            onClick={saveAll}
            disabled={isLoading}
            className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition-all"
          >
            {isLoading ? "Enregistrement..." : "Sauvegarder tout"}
          </button>
        </div>
      </footer>
    </div>
  );
}