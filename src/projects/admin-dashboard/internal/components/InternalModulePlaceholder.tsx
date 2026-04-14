import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";

interface InternalModulePlaceholderProps {
  title: string;
  eyebrow: string;
  description: string;
  bullets: string[];
  icon: LucideIcon;
  backHref?: string;
  backLabel?: string;
}

export function InternalModulePlaceholder({
  title,
  eyebrow,
  description,
  bullets,
  icon: Icon,
  backHref = "/dashboard/internal",
  backLabel = "Retour a l'espace interne",
}: InternalModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.95)] sm:p-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300">
            <Icon size={14} /> {eyebrow}
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">{description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={backHref} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100 hover:border-slate-500 hover:bg-slate-800">
              {backLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {bullets.map((bullet) => (
          <article key={bullet} className="rounded-[1.6rem] border border-slate-800 bg-slate-900/80 p-5">
            <p className="text-sm font-semibold leading-7 text-slate-300">{bullet}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.8rem] border border-dashed border-slate-700 bg-slate-950/70 p-6 text-sm leading-7 text-slate-400">
        Ce module est maintenant reserve a l'espace interne et pret pour etre branche au backend ou migre vers un autre serveur plus tard sans dependre du dashboard client.
        <span className="mt-4 inline-flex items-center gap-2 font-black uppercase tracking-[0.18em] text-slate-200">
          Structure modulaire prete
          <ArrowRight size={14} />
        </span>
      </section>
    </div>
  );
}
