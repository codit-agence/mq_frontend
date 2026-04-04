"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import router from "next/router";

import { LogOut, LayoutDashboard, Settings, Tv, UtensilsCrossed, Megaphone } from "lucide-react";

//components
import { StatusHeader } from "@/src/components/shared/StatusHeader";
import { MenuWidget } from "@/src/components/shared/MenuWidget";


import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { authService } from "@/src/features/account/auth.services";



export default function DashboardPage() {
  const { user, tenant, setContext, logout } = useAuthStore();
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    const syncData = async () => {
      try {
        const data = await authService.getMe();
        setContext(data.user, data.current_tenant);
        setIsSyncing(false);
      } catch (err) {
        console.error("Session expirée ou erreur sync", err);
        logout(); 
        router.push("/account/login");
      } finally {
        setIsSyncing(false);
      }
    };
    syncData();
  }, [setContext, logout]);

  if (isSyncing || !user || !tenant) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header avec bouton Logout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
        <StatusHeader 
          profileName={`${user.first_name} ${user.last_name}`} 
          tenantName={tenant.name} 
        />
        
        <button 
          onClick={() => logout()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all font-bold text-sm shadow-lg shadow-rose-500/5"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>

      {/* Grid des Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link href={`/dashboard/tenant/${tenant.id}/menu`}>
        
          <MenuWidget 
            title="Menu Digital" 
            icon={<UtensilsCrossed className="text-indigo-400" />} 
            desc={`Gérer la carte de ${tenant.name}`} 
            onClick={() => {}} 
          />
        </Link>

        <Link href={`/dashboard/tenant/${tenant.id}/tvstream`}>
          <MenuWidget 
            title="TV Stream" 
            icon={<Tv className="text-emerald-400" />} 
            desc="Affichage dynamique en salle" 
            onClick={() => {}} 
            isDark 
          />
        </Link>

        <MenuWidget 
          title="Campagnes" 
          icon={<Megaphone className="text-amber-400" />} 
          desc="Publicités & Promotions" 
          onClick={() => {}} 
        />

        <Link href="/dashboard/settings">
          <MenuWidget 
            title="Mon Compte" 
            icon={<Settings className="text-slate-400" />} 
            desc={user.email || "Paramètres du profil"} 
            onClick={() => {}} 
            isDark
          />
        </Link>

        <Link href={`/dashboard/tenant/${tenant.id}/display`}>
          <MenuWidget 
            title="Manager Display" 
            icon={<LayoutDashboard className="text-slate-400" />} 
            desc="Configurer les écrans et flux"
            onClick={() => {}} 

            
          />
        </Link>
      </div>
    </div>
  );
}