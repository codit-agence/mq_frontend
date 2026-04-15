import Link from "next/link";
import type { ReactNode } from "react";

export function PreviewModeBanner({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Preview interne</p>
      <p className="mt-2">{children}</p>
    </section>
  );
}

export function CockpitHero({
  badge,
  title,
  description,
  actions,
}: {
  badge: ReactNode;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="dashboard-surface p-6 sm:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
            {badge}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
        </div>

        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function CockpitStatCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: ReactNode }) {
  return (
    <div className="dashboard-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-black text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{hint}</p>
        </div>
        <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3 text-slate-100">{icon}</div>
      </div>
    </div>
  );
}

export function CockpitSectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function CockpitLinkTile({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="dashboard-surface block p-5 hover:border-slate-700">
      <p className="text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </Link>
  );
}