"use client";

import React, { useEffect, useState } from "react";
import { Building2, Wallet, Plus, Star, ShoppingBag, PlayCircle, ShieldCheck, AlertCircle, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { authService } from "@/src/features/account/auth.services";

export default function GlobalDashboard() {
  const { user, tenant, setContext } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getMe().then(data => {
      setContext(data.user, data.current_tenant);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setContext]);

  if (loading) return <div className="p-10 animate-pulse bg-slate-100 rounded-[40px] h-[500px]" />;

  return (
    <div className="space-y-8">
      
      {/* 1. INFO PROFIL & STATUT BD */}
      <section className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className={`w-20 h-20 rounded-[25px] flex items-center justify-center font-black text-2xl ${user?.is_active ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"}`}>
          {user?.first_name?.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Espace de {user?.first_name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <StatusBadge condition={user?.is_verified} trueText="Compte Vérifié" falseText="Vérification requise" />
            <StatusBadge condition={user?.is_active} trueText="Service Actif" falseText="Service Suspendu" color="indigo" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. WIDGET WALLET & FIDÉLITÉ */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[35px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="text-indigo-400" size={24} />
                <span className="text-[10px] font-black bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Prepaid</span>
              </div>
              <p className="text-4xl font-black mb-6 italic">110.00 <span className="text-xs opacity-50 not-italic">DHS</span></p>
              
              {/* Future Fidelity System Placeholder */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em]">Fidelity Points</p>
                  <p className="font-bold flex items-center gap-1 text-sm"><Star size={12} className="fill-amber-400 text-amber-400" /> 1,250 pts</p>
                </div>
                <button className="text-[9px] font-black uppercase bg-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-500 transition-all">Details</button>
              </div>
            </div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all" />
          </div>

          {/* MarketPlace Button */}
          <button className="w-full bg-white border border-slate-100 p-6 rounded-[30px] flex items-center justify-between group hover:border-indigo-600 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all">
                <ShoppingBag size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">MarketPlace</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Acheter du matériel</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600" />
          </button>
        </div>

        {/* 3. TENANTS & GESTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2"><Building2 className="text-indigo-600"/> Établissements</h3>
            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Plus size={20}/></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tenant ? (
              <div className="bg-white border border-slate-100 p-8 rounded-[35px] hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="w-14 h-14 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                  <Building2 size={28} />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-2">{tenant.name}</h4>
                <p className="text-slate-400 text-sm font-medium mb-8">Gérez vos menus et diffusez sur vos écrans TV.</p>
                <button 
                   onClick={() => window.location.href = `/dashboard/tenant/${tenant.id}`}
                   className="w-full py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100"
                >
                  Entrer dans la Console
                </button>
              </div>
            ) : (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200 text-slate-400 font-bold italic text-sm">
                Aucun établissement trouvé. Commencez par en ajouter un.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. TUTORIAL VIDEO SECTION */}
      <section className="bg-white border border-slate-100 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
        <div className="flex-1 space-y-4">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Comment ça marche ?</h3>
          <p className="text-slate-500 font-medium leading-relaxed">Découvrez en 2 minutes comment configurer vos écrans SmartDisplay et booster vos ventes.</p>
          <button className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all">
            <PlayCircle size={20} /> Regarder le Tutoriel
          </button>
        </div>
        <div className="w-full md:w-80 h-48 bg-slate-200 rounded-[30px] relative flex items-center justify-center group cursor-pointer overflow-hidden shadow-inner">
           <img src="https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all" alt="Video Thumbnail" />
           <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl text-indigo-600 group-hover:scale-125 transition-all">
              <PlayCircle size={32} />
           </div>
        </div>
      </section>

    </div>
  );
}

// Composants utilitaires
const StatusBadge = ({ condition, trueText, falseText, color = "emerald" }: any) => (
  <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border ${condition ? `bg-${color}-50 text-${color}-600 border-${color}-100` : "bg-rose-50 text-rose-600 border-rose-100"}`}>
    {condition ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
    {condition ? trueText : falseText}
  </div>
);