"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, Plus, Building2, ChevronRight, 
  Wallet, ShieldCheck, Clock, AlertCircle, CheckCircle2 
} from "lucide-react";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { authService } from "@/src/features/account/auth.services";

export default function GlobalDashboard() {
  const { user, tenant, setContext, logout } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(true);
  const router = useRouter();

  // État de validation (Simulé pour le visuel)
  const isVerified = false; 
  const daysLeft = 7;

  useEffect(() => {
    const syncData = async () => {
      try {
        const data = await authService.getMe();
        setContext(data.user, data.current_tenant);
      } catch (err) {
        logout();
        router.push("/account/login");
      } finally {
        setIsSyncing(false);
      }
    };
    syncData();
  }, [setContext, logout, router]);

  if (isSyncing) return <div className="h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* BANNER DE RAPPEL (Discrète mais présente) */}
      {!isVerified && (
        <div className="bg-amber-500 text-white py-2.5 px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
            <Clock size={14} />
            <span>Période d'essai active : {daysLeft} jours restants pour valider votre dossier</span>
            <button className="ml-auto bg-white text-amber-600 px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors">
              Compléter
            </button>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className="bg-white border-b border-slate-200 h-20 flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">S</div>
            <span className="font-black text-slate-900 uppercase text-sm tracking-tighter">SmartDisplay</span>
          </div>
          <button onClick={() => logout()} className="text-slate-400 hover:text-rose-500 transition-colors"><LogOut size={22} /></button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {/* SECTION PROFIL & SOLDE */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-[32px] p-8 flex items-center gap-6 shadow-sm">
            {/* Avatar avec cadre dynamique */}
            <div className={`relative w-20 h-20 rounded-[24px] flex items-center justify-center text-2xl font-black shrink-0
              ${isVerified ? "bg-indigo-600 text-white ring-4 ring-indigo-50" : "bg-slate-100 text-slate-400 border-2 border-dashed border-amber-400"}`}>
              {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              <div className={`absolute -bottom-2 -right-2 p-1 rounded-full border-2 border-white ${isVerified ? "bg-indigo-500" : "bg-amber-500"} text-white`}>
                {isVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{user?.first_name} {user?.last_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Phase INIT</span>
                <span className="text-slate-400 text-xs font-medium">Membre depuis Mars 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-[32px] p-8 text-white flex flex-col justify-center shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-2 text-indigo-300 mb-2">
              <Wallet size={16} /> <span className="text-[10px] font-black uppercase tracking-widest">Solde Compte</span>
            </div>
            <p className="text-3xl font-black">110.00 <span className="text-sm font-bold opacity-60">DHS</span></p>
          </div>
        </section>

        {/* SECTION ÉTABLISSEMENTS */}
        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-indigo-600" /> Vos Établissements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tenant && (
            <button 
              onClick={() => router.push(`/dashboard/tenant/${tenant.id}`)}
              className="group bg-white border border-slate-200 p-6 rounded-[28px] hover:border-indigo-600 transition-all hover:shadow-2xl hover:shadow-indigo-500/5 text-left"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center transition-colors">
                  <Building2 size={24} />
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Essai Actif</span>
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-1">{tenant.name}</h4>
              <p className="text-slate-400 text-sm font-medium mb-6">Gérer le menu et les écrans TV</p>
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                Entrer dans l'espace <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          )}

          <button className="border-2 border-dashed border-slate-200 rounded-[28px] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all">
            <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center"><Plus size={20} /></div>
            <span className="font-bold text-xs uppercase tracking-widest">Ajouter un point de vente</span>
          </button>
        </div>
      </main>
    </div>
  );
}