import { Activity, Cpu, Gauge, MonitorSmartphone, Wallet } from "lucide-react";

import { PublicHomeLocale } from "./public-home.utils";

const content = {
  fr: {
    badge: "Logique packs",
    title: "Une offre claire au depart, puis un tarif qui suit la consommation reelle",
    body: "Chaque pack donne une base solide pour demarrer vite. Ensuite, la tarification suit les ressources consommees: plus d'ecrans, plus de playlists, plus de diffusion et plus de services actifs, donc plus de valeur et un abonnement plus haut.",
    starter: "Pack lancement: 2 TV connectees, QR gratuit, site web commercial, promotions de base.",
    growth: "Pack croissance: 5 TV connectees, playlists plus riches, campagnes avancees, suivi commercial renforce.",
    enterprise: "Pack grand compte: architecture multi-ecrans, pilotage plus large, reporting, tracking, accompagnement prioritaire.",
    note: "Le principe est simple: si le client consomme plus de bande passante, plus d'ecrans, plus de medias et plus d'automatisation, il passe sur une offre adaptee.",
    metrics: [
      { label: "Base de depart", value: "2 TV" },
      { label: "Pack premium", value: "5 TV" },
      { label: "QR & promo", value: "Inclus" },
      { label: "Facturation", value: "Usage + valeur" },
    ],
    cards: [
      { title: "Ecrans connectes", body: "Le nombre de TV actives reste le premier levier de prix.", icon: "monitor" },
      { title: "Charge media", body: "Plus de slides, videos et playlists demandent plus de ressources.", icon: "activity" },
      { title: "Performance", body: "Tracking, analytics, SEO et operations commerciales augmentent la valeur du service.", icon: "gauge" },
      { title: "Accompagnement", body: "Le support et le pilotage augmentent avec le niveau de l'offre.", icon: "wallet" },
    ],
  },
  ar: {
    badge: "منطق العروض",
    title: "عرض واضح في البداية ثم تسعير يتبع الاستهلاك الحقيقي",
    body: "كل عرض يمنح قاعدة قوية للانطلاق بسرعة. بعد ذلك يتبع السعر الموارد المستعملة فعليا: عدد الشاشات، عدد القوائم، كثافة البث والخدمات المفعلة، وبالتالي يرتفع الاشتراك مع القيمة المستهلكة.",
    starter: "عرض البداية: شاشتان متصلتان، QR مجاني، موقع تجاري، وعروض ترويجية اساسية.",
    growth: "عرض النمو: خمس شاشات متصلة، قوائم اغنى، حملات متقدمة، ومتابعة تجارية اقوى.",
    enterprise: "عرض المؤسسات: بنية متعددة الشاشات، قيادة اوسع، تقارير، تتبع، ومرافقة ذات اولوية.",
    note: "الفكرة بسيطة: كلما زاد استهلاك الشاشات والوسائط والاتمتة، ينتقل العميل الى عرض مناسب.",
    metrics: [
      { label: "بداية الخدمة", value: "2 TV" },
      { label: "العرض الكبير", value: "5 TV" },
      { label: "QR والعروض", value: "مضمن" },
      { label: "الفوترة", value: "استهلاك + قيمة" },
    ],
    cards: [
      { title: "الشاشات المتصلة", body: "عدد الشاشات الفعلية هو اول محرك للتسعير.", icon: "monitor" },
      { title: "حمولة الوسائط", body: "كلما زادت الصور والفيديوهات والقوائم زاد استهلاك الموارد.", icon: "activity" },
      { title: "الاداء", body: "التتبع والتحليلات و SEO والعمليات التجارية تضيف قيمة اكبر.", icon: "gauge" },
      { title: "المرافقة", body: "الدعم والتسيير يرتفعان مع مستوى العرض.", icon: "wallet" },
    ],
  },
} as const;

function getIcon(icon: string) {
  switch (icon) {
    case "monitor":
      return <MonitorSmartphone size={18} />;
    case "activity":
      return <Activity size={18} />;
    case "gauge":
      return <Gauge size={18} />;
    case "wallet":
      return <Wallet size={18} />;
    default:
      return <Cpu size={18} />;
  }
}

export function PublicHomePricingLogic({ locale }: { locale: PublicHomeLocale }) {
  const text = content[locale];

  return (
    <section id="pricing-logic" className="border-y border-slate-200 bg-[linear-gradient(180deg,#fffdf7_0%,#f8fbf5_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-7 shadow-[0_30px_80px_-50px_rgba(16,185,129,0.35)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">{text.badge}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{text.title}</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600 sm:text-base">{text.body}</p>

            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-700">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">{text.starter}</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">{text.growth}</div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">{text.enterprise}</div>
            </div>

            <p className="mt-6 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold leading-7 text-white">{text.note}</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {text.metrics.map((metric) => (
                <article key={metric.label} className="rounded-[1.7rem] border border-slate-200 bg-white px-5 py-5 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{metric.value}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {text.cards.map((card) => (
                <article key={card.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">{getIcon(card.icon)}</span>
                  <h3 className="mt-4 text-lg font-black text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}