"use client";

import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";

export default function InternalAdminHubPage() {
  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <section className="dashboard-surface p-6 sm:p-8 md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
            <Settings size={14} /> Internal Space
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Espace interne separe.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Cette page reste volontairement legere. La configuration application, le branding, les couleurs, les logos et les tests restent dans la page dediee.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/internal/settings"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:bg-indigo-600"
            >
              Ouvrir la config application
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}