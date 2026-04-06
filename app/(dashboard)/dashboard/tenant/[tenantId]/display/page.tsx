"use client";
import { useState, useTransition } from "react"; // Ajout de useTransition
import { BellRing, LayoutGrid, Tv, Eye, CalendarClock } from "lucide-react";
import dynamic from 'next/dynamic'; // Pour le chargement paresseux

// Chargement dynamique des composants lourds pour ne pas ralentir le chargement initial
const DisplayContent = dynamic(() => import("@/src/features/display/components/DisplayContent"), { ssr: false });
const DisplayLayout = dynamic(() => import("@/src/features/display/components/DisplayLayout"), { ssr: false });
const DisplaySettings = dynamic(() => import("@/src/features/display/components/DisplaySettings"), { ssr: false });
const ScheduleManager = dynamic(() => import("@/src/features/scheduler/components/ScheduleManager"), { ssr: false });

type TabId = 'items' | 'layout' | 'settings' | 'schedule';

export default function DisplayPage() {
  const [activeTab, setActiveTab] = useState<TabId>('items');
  const [isPending, startTransition] = useTransition(); // Permet de garder l'UI fluide pendant le changement

  const handleTabChange = (id: TabId) => {
    startTransition(() => {
      setActiveTab(id);
    });
  };

  const tabs = [
    { id: 'items', label: 'Catalogue TV', icon: Tv },
    { id: 'schedule', label: 'Programmation', icon: CalendarClock },
    { id: 'layout', label: 'Structure', icon: LayoutGrid },
    { id: 'settings', label: 'Réglages', icon: BellRing },
  ];

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      
      {/* HEADER PRO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic">
            Display <span className="text-indigo-600">Studio</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mt-4">
            Régie de diffusion intelligente & planification
          </p>
        </div>

        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[22px] font-black text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
          <Eye size={18} /> APERÇU LIVE
        </button>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex justify-start border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-10 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabId)}
              className={`pb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <tab.icon size={16} strokeWidth={2.5} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENU DYNAMIQUE AVEC TRANSITION */}
      <div className={`min-h-[600px] transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-6 md:p-10">
          {activeTab === 'items' && <DisplayContent />}
          {activeTab === 'schedule' && <ScheduleManager />}
          {activeTab === 'layout' && <DisplayLayout />}
          {activeTab === 'settings' && <DisplaySettings />}
        </div>
      </div>
    </div>
  );
}