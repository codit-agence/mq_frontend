"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { internalModules } from "@/src/projects/admin-dashboard/internal/internal-modules";

export default function InternalAdminHubPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="dashboard-surface p-6 sm:p-8 md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300">
            Espace interne
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Espace interne separe et autonome.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Chaque bloc d'administration doit vivre ici: application, tenants, users, ecrans, playlists et templates. Cette entree sert juste de portail central sobre et professionnel.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {internalModules.map((module) => (
          <Link key={module.key} href={module.href} className="rounded-[1.8rem] border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80">
            <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-200">
              <module.icon size={18} />
            </div>
            <h2 className="mt-4 text-xl font-black text-white">{module.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">{module.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
              Ouvrir
              <ArrowRight size={14} />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}