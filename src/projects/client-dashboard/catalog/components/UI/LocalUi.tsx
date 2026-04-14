"use client";

import React from "react";
import { Loader2, X, Package } from "lucide-react";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

// --- 1. DRAWER (Panneau latéral coulissant) ---
interface DrawerProps {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  // ✅ Supprimé : isOpen n'est plus requis ici car on gère l'affichage dans le parent
}

export const Drawer = ({ children, onClose, title }: DrawerProps) => (
  <div className="fixed inset-0 z-[200] flex justify-end">
    {/* Overlay avec flou */}
    <div 
      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={onClose} 
    />
    
    {/* Contenu du Drawer */}
    <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-500 flex flex-col">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-black italic">
          {title}<span className="text-indigo-600">.</span>
        </h2>
        <button 
          onClick={onClose} 
          className="p-3 bg-slate-50 rounded-2xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <X size={20}/>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

// --- 2. STAT MINI CARD ---
interface StatMiniCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}

export const StatMiniCard = ({ icon: Icon, label, value, color }: StatMiniCardProps) => (
  <div className="bg-white border border-slate-100 p-4 rounded-[20px] flex items-center gap-3 shadow-sm flex-1 min-w-[140px] hover:shadow-md transition-shadow">
    <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
        {label}
      </p>
      <p className="text-lg font-black text-slate-900 leading-none">
        {value}
      </p>
    </div>
  </div>
);

// --- 3. LOADING STATE ---
export const LoadingState = () => (
  <LocalizedLoadingState />
);

export const EmptyState = () => (
  <LocalizedEmptyState />
);

function LocalizedLoadingState() {
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);

  return (
    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-100 gap-4">
      <div className="relative">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <div className="absolute inset-0 blur-lg bg-indigo-400/20 animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {locale === "ar" ? "جار المزامنة..." : "Synchronisation..."}
      </p>
    </div>
  );
}

function LocalizedEmptyState() {
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const text = locale === "ar"
    ? {
        title: "لا توجد نتائج",
        hint: "عدّل الفلاتر أو البحث",
      }
    : {
        title: "Aucun resultat trouve",
        hint: "Ajustez vos filtres ou votre recherche",
      };

  return (
    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200">
      <div className="p-4 bg-slate-50 rounded-full mb-3">
        <Package className="text-slate-200" size={40} />
      </div>
      <p className="text-slate-400 font-bold text-sm text-center">
        {text.title}<br/>
        <span className="text-[9px] uppercase font-black opacity-60 tracking-widest">
          {text.hint}
        </span>
      </p>
    </div>
  );
}