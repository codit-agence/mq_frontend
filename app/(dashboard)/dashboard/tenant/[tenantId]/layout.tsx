"use client";

import React from "react";

import { useParams } from "next/navigation";
import { ChevronLeft, MapPin, Utensils, Globe, ShieldCheck, Building2 } from "lucide-react";
import Link from "next/link";
import { useCurrentTenant } from "@/src/features/account/useCurrentTenant";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
const { tenantId, tenant } = useCurrentTenant(); // Propre et rapide !  const params = useParams();

  return (
    <div className="space-y-8">
      {/* HEADER ÉTABLISSEMENT AGRANDI */}
      <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Décoration en arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8">
          
          {/* LOGO / AVATAR DE L'ENTREPRISE */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 bg-white border-4 border-slate-50 rounded-[35px] flex items-center justify-center overflow-hidden shadow-2xl shadow-indigo-100 transition-transform group-hover:scale-105 duration-500">
              {tenant?.logo ? (
                <img 
                  src={tenant.logo} 
                  alt={tenant.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                /* Fallback : Initiale si pas de logo */
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white">
                  <span className="text-4xl font-black">{tenant?.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            
            {/* Badge de certification (Badge flottant sur le logo) */}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white shadow-lg">
              <ShieldCheck size={16} />
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                <ChevronLeft size={20} className="text-slate-600" />
              </Link>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                {tenant?.name || "Chargement..."}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <InfoTag icon={<MapPin size={14} />} label={tenant?.city || "Ville non définie"} />
              <InfoTag icon={<Utensils size={14} />} label={tenant?.type || "Restauration"} />
              <InfoTag icon={<Globe size={14} />} label="Menu Digital Actif" color="text-emerald-600 bg-emerald-50 border-emerald-100" />
              
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800">
                 ID: {tenant?.id?.slice(0, 8)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE DE CONTENU VARIABLE (Page Manager) */}
      <div className="px-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Composant utilitaire pour les badges d'information
 */
const InfoTag = ({ icon, label, color = "text-slate-500 bg-slate-50 border-slate-100" }: any) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border ${color}`}>
    <span className="opacity-70">{icon}</span>
    {label}
  </div>
);