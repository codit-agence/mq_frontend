"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleDashed } from "lucide-react";
import { adminDomainCatalog } from "@/src/projects/admin-dashboard/domain-catalog";
import { internalCockpitModules, internalConsoleModules, internalModules } from "@/src/projects/admin-dashboard/internal/internal-modules";

export default function InternalAdminHubPage() {
  const liveDomains = adminDomainCatalog.filter((domain) => domain.status === "live");
  const partialDomains = adminDomainCatalog.filter((domain) => domain.status === "partial");
  const plannedDomains = adminDomainCatalog.filter((domain) => domain.status === "planned");

  const stats = [
    { label: "Espaces actifs", value: String(internalModules.length), hint: "Modules déjà branchés sur des API" },
    { label: "Cockpits métier", value: String(internalCockpitModules.length), hint: "Entrées de pilotage et synthèse" },
    { label: "Domaines live", value: String(liveDomains.length), hint: "Exploitation immédiate sans backend supplémentaire" },
    { label: "Domaines à cadrer", value: String(partialDomains.length + plannedDomains.length), hint: "À brancher plus tard sans faux écran" },
  ];

  const statusStyles = {
    live: "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
    partial: "border-amber-400/30 bg-amber-500/15 text-amber-100",
    planned: "border-slate-600 bg-slate-800 text-slate-200",
  } as const;

  const capabilityStyles = {
    ready: "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20",
    limited: "bg-amber-500/15 text-amber-100 border border-amber-300/20",
    missing: "bg-slate-800 text-slate-300 border border-slate-700",
  } as const;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.16),_transparent_30%),linear-gradient(145deg,_#020617,_#0f172a_60%,_#111827)] p-6 sm:p-8 md:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100">
              Console plateforme
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
              Admin central, propre, orienté opérations et calé sur les API déjà prêtes.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Cette entrée sert de tour de contrôle. On sépare ce qui est exploitable tout de suite depuis le backend actuel, de ce qui devra arriver plus tard: content avancé, produits globaux, paiements, photothèque mutualisée et marketing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">Config app</span>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">Gestion business</span>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">Regie TV</span>
              <span className="rounded-full border border-slate-700 bg-slate-950/70 px-4 py-2">Utilisateurs internes</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                <p className="mt-3 text-3xl font-black text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pilotage</p>
            <h2 className="mt-2 text-2xl font-black text-white">Cockpits métier</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {internalCockpitModules.map((module) => (
              <Link key={module.key} href={module.href} className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80">
                <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-200">
                  <module.icon size={18} />
                </div>
                <h2 className="mt-4 text-xl font-black text-white">{module.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">{module.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                    Ouvrir
                    <ArrowRight size={14} />
                  </span>
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                    cockpit
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Operations</p>
            <h2 className="mt-2 text-2xl font-black text-white">Consoles détaillées</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {internalConsoleModules.map((module) => (
              <Link key={module.key} href={module.href} className="rounded-[1.8rem] border border-slate-800 bg-slate-950/70 p-5 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/80">
                <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-200">
                  <module.icon size={18} />
                </div>
                <h2 className="mt-4 text-xl font-black text-white">{module.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">{module.description}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                    Ouvrir
                    <ArrowRight size={14} />
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-200">
                    console
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Architecture metier</p>
              <h2 className="mt-2 text-2xl font-black text-white">Ce qu’on peut lancer tout de suite vs ce qui attend encore le backend</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {adminDomainCatalog.map((domain) => (
              <div key={domain.key} className="rounded-[1.6rem] border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-900 p-3 text-slate-100">
                    <domain.icon size={18} />
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${statusStyles[domain.status]}`}>
                    {domain.status === "live" ? "Live" : domain.status === "partial" ? "Partiel" : "Planifie"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-white">{domain.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{domain.summary}</p>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">{domain.apiCoverage}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {domain.scope.map((item) => (
                    <span key={item} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
                {domain.href ? (
                  <Link href={domain.href} className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-100">
                    Ouvrir le domaine
                    <ArrowRight size={14} />
                  </Link>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Pas de route tant que l’API manque
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Lecture rapide</p>
            <h2 className="mt-2 text-2xl font-black text-white">Ce que couvre déjà le backend</h2>
            <div className="mt-5 space-y-3">
              {liveDomains.map((domain) => (
                <div key={domain.key} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-300" />
                    <p className="text-sm font-black text-white">{domain.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{domain.apiCoverage}</p>
                </div>
              ))}
              {partialDomains.map((domain) => (
                <div key={domain.key} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="flex items-center gap-3">
                    <CircleDashed size={16} className="text-amber-300" />
                    <p className="text-sm font-black text-white">{domain.title}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{domain.apiCoverage}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Backlog structure</p>
            <h2 className="mt-2 text-2xl font-black text-white">Domaines à brancher ensuite</h2>
            <div className="mt-5 space-y-3">
              {plannedDomains.map((domain) => (
                <div key={domain.key} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-sm font-black text-white">{domain.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{domain.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <div className="max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Matrice de disponibilite</p>
          <h2 className="mt-2 text-2xl font-black text-white">Décision produit basée sur les API, pas sur des suppositions</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Les domaines ci-dessous sont organisés pour faire avancer une vraie app pro. Les tags indiquent ce qui est déjà prêt, ce qui reste partiel et ce qui ne doit pas être maquetté comme "fonctionnel" tant que le backend ne l’expose pas.
          </p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {adminDomainCatalog.map((domain) => (
            <div key={domain.key} className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-5">
              <div className="flex items-center gap-3">
                <domain.icon size={18} className="text-slate-200" />
                <h3 className="text-lg font-black text-white">{domain.title}</h3>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {domain.capabilities.map((capability) => (
                  <span key={capability.key} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${capabilityStyles[capability.state]}`}>
                    {capability.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}