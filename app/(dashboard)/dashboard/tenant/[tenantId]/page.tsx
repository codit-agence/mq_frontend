"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Tv, UtensilsCrossed, Megaphone, 
  LayoutDashboard, Settings, ArrowRight 
} from "lucide-react";

import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { authService } from "@/src/features/account/auth.services";

export default function TenantManagerPage() {
  const { user, tenant, setContext } = useAuthStore();
  const [loading, setLoading] = useState(!tenant);
  const router = useRouter();

  useEffect(() => {
    if (!tenant) {
      authService.getMe()
        .then(data => setContext(data.user, data.current_tenant))
        .catch(() => router.push("/account/login"))
        .finally(() => setLoading(false));
    }
  }, [tenant, setContext, router]);

  if (loading) return <ManagerSkeleton />;

  const services = [
    {
      title: "Menu Digital",
      desc: "Cartes & Produits",
      icon: <UtensilsCrossed size={28} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: `/dashboard/tenant/${tenant?.id}/menu`,
      primary: true
    },
    {
      title: "TV Stream",
      desc: "Affichage en salle",
      icon: <Tv size={28} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: `/dashboard/tenant/${tenant?.id}/tvstream`
    },
    {
      title: "Manager Display",
      desc: "Flux & Écrans",
      icon: <LayoutDashboard size={28} />,
      color: "text-slate-600",
      bg: "bg-slate-100",
      href: `/dashboard/tenant/${tenant?.id}/display`
    },
    {
      title: "Campagnes",
      desc: "Pubs & Promos",
      icon: <Megaphone size={28} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "#"
    }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <Link href={service.href} key={index} className="group">
            <div className={`h-full p-8 rounded-[35px] border border-slate-100 bg-white transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-indigo-500/10 group-hover:-translate-y-1 ${service.primary ? 'ring-2 ring-indigo-600 ring-offset-4' : ''}`}>
              <div className={`w-16 h-16 ${service.bg} ${service.color} rounded-[22px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{service.title}</h3>
              <p className="text-slate-400 font-medium text-sm mb-8">{service.desc}</p>
              
              <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${service.color}`}>
                Configurer <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        {/* PARAMÈTRES RAPIDES */}
        <Link href="/dashboard/settings" className="lg:col-span-1">
          <div className="h-full p-8 rounded-[35px] bg-slate-900 text-white flex flex-col justify-between group cursor-pointer border border-slate-800">
            <div>
              <Settings className="text-slate-500 mb-6 group-hover:rotate-90 transition-transform duration-500" size={32} />
              <h3 className="text-xl font-black mb-2">Paramètres</h3>
              <p className="text-slate-500 text-sm font-medium italic">Config. établissement</p>
            </div>
            <div className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Modifier le profil
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

// SKELETON POUR LE CHARGEMENT (Évite les sauts visuels)
function ManagerSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-64 bg-slate-100 rounded-[35px]" />
      ))}
    </div>
  );
}