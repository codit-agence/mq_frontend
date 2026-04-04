"use client";
import { useState } from "react";
import { BellRing, LayoutGrid, Tv, Eye, CalendarClock } from "lucide-react";
// Components
import DisplayContent from "@/src/features/display/components/DisplayContent";
import DisplayLayout from "@/src/features/display/components/DisplayLayout";
import DisplaySettings from "@/src/features/display/components/DisplaySettings";
import ScheduleManager from "@/src/features/scheduler/components/ScheduleManager"; // On centralise ici

export default function DisplayPage() {
  // Ajout de 'schedule' dans les types
  const [activeTab, setActiveTab] = useState<'items' | 'layout' | 'settings' | 'schedule'>('items');

  return (
    <div className="max-w-[1400px] mx-auto py-10 px-6 space-y-10">
      
      {/* HEADER PRO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
            Display <span className="text-indigo-600 italic">Studio</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mt-3">
            Régie de diffusion intelligente & planification
          </p>
        </div>

        <button className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[20px] font-black text-xs hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all">
          <Eye size={18} /> APERÇU ÉCRAN LIVE
        </button>
      </div>

      {/* NAVIGATION TABS SELECTOR */}
      <div className="flex justify-start border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-10">
          {[
            { id: 'items', label: 'Catalogue TV', icon: Tv },
            { id: 'schedule', label: 'Programmation', icon: CalendarClock }, // LE COEUR DU PROJET
            { id: 'layout', label: 'Structure', icon: LayoutGrid },
            { id: 'settings', label: 'Réglages', icon: BellRing },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
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

      {/* CONTENU DYNAMIQUE */}
      <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm p-4 md:p-8 min-h-[600px]">
        {activeTab === 'items' && <DisplayContent />}
        {activeTab === 'schedule' && <ScheduleManager />}
        {activeTab === 'layout' && <DisplayLayout />}
        {activeTab === 'settings' && <DisplaySettings />}
      </div>
    </div>
  );
}