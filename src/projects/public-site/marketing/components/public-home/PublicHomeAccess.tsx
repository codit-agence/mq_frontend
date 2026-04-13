import Link from "next/link";
import { ArrowRight, LockKeyhole, LayoutDashboard } from "lucide-react";

import { PublicHomeLocale } from "./public-home.utils";

const content = {
  fr: {
    badge: "Acces application",
    title: "Le site public vend l'offre. Le login ouvre le pilotage du dashboard.",
    body: "La partie publique sert a convaincre et generer des leads. Une fois client, l'acces se fait par login pour entrer dans l'application et gerer le dashboard, les ecrans, le contenu, les promotions et les performances.",
    login: "Se connecter",
    onboarding: "Commencer maintenant",
    dashboard: "Dashboard client",
  },
  ar: {
    badge: "الدخول للتطبيق",
    title: "الموقع العمومي يبيع العرض ثم يفتح تسجيل الدخول للوصول الى لوحة التحكم.",
    body: "الجزء العمومي هدفه الاقناع وجلب العملاء. بعد الاشتراك، يتم الدخول عبر تسجيل الدخول للوصول الى التطبيق وادارة اللوحة والشاشات والمحتوى والعروض والاداء.",
    login: "تسجيل الدخول",
    onboarding: "ابدأ الان",
    dashboard: "لوحة العميل",
  },
} as const;

export function PublicHomeAccess({ locale }: { locale: PublicHomeLocale }) {
  const text = content[locale];

  return (
    <section id="access" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1e293b_100%)] p-8 text-white shadow-[0_35px_80px_-45px_rgba(15,23,42,0.9)]">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">{text.badge}</p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{text.title}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300 sm:text-base">{text.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/account/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100">
              <LockKeyhole size={16} />
              {text.login}
            </Link>
            <Link href="/account/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-black text-white transition hover:bg-white/10">
              {text.onboarding}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white"><LayoutDashboard size={18} /></span>
          <h3 className="mt-5 text-2xl font-black text-slate-950">{text.dashboard}</h3>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">TV connectees et playlists par tenant.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Gestion produits, categories, design, QR et promotions.</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">Mesure de la consommation et evolution naturelle vers un pack plus adapte.</div>
          </div>
        </div>
      </div>
    </section>
  );
}