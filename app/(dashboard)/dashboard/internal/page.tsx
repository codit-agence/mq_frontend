"use client";

import Link from "next/link";
import { ArrowRight, Building2, CreditCard, ShieldCheck, Sparkles, Users } from "lucide-react";
import { adminConsoleSections, internalAdminsPreview } from "@/src/projects/admin-dashboard/internal/admin-console.data";

export default function InternalAdminHubPage() {
  return (
    <div className="space-y-6">
      <section className="dashboard-surface overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
              <Sparkles size={14} /> Admin Platform Hub
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Espace admin separe pour mieux gerer clients, droits et plateforme.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Cette zone est la couche interne. Elle est distincte de la home publique et du dashboard client pour garder une architecture claire et evolutive.
              Aujourd'hui on travaille surtout avec des admins, demain cet espace pourra aussi gerer des employes avec des droits limites.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[420px]">
            <HubStat icon={<Building2 size={16} />} label="Clients" value="Tenants" />
            <HubStat icon={<Users size={16} />} label="Acces" value="Roles" />
            <HubStat icon={<CreditCard size={16} />} label="Finance" value="Billing" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {adminConsoleSections.map((section) => (
          <Link key={section.href} href={section.href} className="dashboard-surface rounded-[1.7rem] p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="inline-flex rounded-2xl bg-[#eef6e4] p-3 text-[#5f7f41]">
              <section.icon size={18} />
            </div>
            <h2 className="mt-4 text-xl font-black text-slate-950">{section.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{section.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-900">
              Ouvrir
              <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="dashboard-surface p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Architecture cible</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Organisation conseillee pour ne pas perdre du temps plus tard</h2>
          <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Public</p>
              <p>Home SEO, offres, blog, contact, partenaires, conversion et inscription.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Client dashboard</p>
              <p>Usage quotidien du tenant: menu, ecrans, playlists, statistiques autorisees, settings metier.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-900">Admin platform</p>
              <p>Creation clients, utilisateurs internes, paiements, support, branding global et regles d'acces.</p>
            </div>
          </div>
        </article>

        <article className="dashboard-surface p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Admins actuels</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Admins qui peuvent ensuite creer d'autres users</h2>
          <div className="mt-5 space-y-3">
            {internalAdminsPreview.map((admin) => (
              <div key={admin.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-950">{admin.name}</h3>
                    <p className="mt-1 text-xs text-slate-500">{admin.role}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 border border-slate-200">{admin.focus}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function HubStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-[10px] font-black uppercase tracking-[0.18em]">{label}</span></div>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
    </div>
  );
}