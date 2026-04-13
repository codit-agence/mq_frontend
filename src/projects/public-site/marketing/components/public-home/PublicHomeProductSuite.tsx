import { Gift, QrCode, RadioTower, ScanSearch, ShoppingBag, Tv2, Users } from "lucide-react";

import { PublicHomeLocale } from "./public-home.utils";

const content = {
  fr: {
    badge: "Nos produits",
    title: "Une suite complete pour attirer, convertir et fideliser vos clients",
    body: "La plateforme ne se limite pas a une page vitrine. Elle relie ecrans, QR, promotions, tracking, site web, et operations marketing dans un seul ecosysteme commercial.",
    items: [
      { title: "Systeme de fidelite", body: "Offres de retour, campagnes de retention et incentive client." },
      { title: "Systeme TV connecte", body: "Diffusion menus, promotions, playlists et affichage dynamique en point de vente." },
      { title: "Systeme Tracking", body: "Suivi d'usage, pilotage d'ecrans et indicateurs pour mieux vendre." },
      { title: "QR intelligent", body: "QR gratuit pour menu, promotion, campagne locale ou offre flash." },
      { title: "Site web commercial", body: "Landing SEO, pages offres, contenus de marque et contact commercial." },
      { title: "Promotions et campagnes", body: "Activation rapide d'offres, remises, packs et messages saisonniers." },
      { title: "Suivi equipe et client", body: "Outils pour le commercial, le technicien et l'admin global." },
    ],
  },
  ar: {
    badge: "منتجاتنا",
    title: "منظومة كاملة لجذب العملاء وتحويلهم والحفاظ عليهم",
    body: "المنصة ليست مجرد صفحة عرض. هي تربط الشاشات و QR والعروض والتتبع والموقع والعمليات التسويقية داخل نفس النظام التجاري.",
    items: [
      { title: "نظام الولاء", body: "عروض رجوع، حملات احتفاظ، وتحفيز دائم للزبون." },
      { title: "نظام TV متصل", body: "بث القوائم والعروض والبرمجة والعرض الديناميكي داخل نقطة البيع." },
      { title: "نظام التتبع", body: "متابعة الاستعمال وقيادة الشاشات ومؤشرات تساعد على البيع." },
      { title: "QR ذكي", body: "QR مجاني للقائمة او العرض او الحملة المحلية او العرض السريع." },
      { title: "موقع تجاري", body: "Landing SEO وصفحات عروض ومحتوى علامة تجارية واتصال تجاري." },
      { title: "العروض والحملات", body: "تفعيل سريع للتخفيضات والباقات والرسائل الموسمية." },
      { title: "متابعة الفريق والعميل", body: "ادوات للتجاري والتقني والادارة العامة." },
    ],
  },
} as const;

const icons = [Gift, Tv2, ScanSearch, QrCode, ShoppingBag, RadioTower, Users];

export function PublicHomeProductSuite({ locale }: { locale: PublicHomeLocale }) {
  const text = content[locale];

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-4 md:max-w-3xl">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">{text.badge}</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{text.title}</h2>
        <p className="text-sm leading-8 text-slate-600 sm:text-base">{text.body}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {text.items.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <article key={item.title} className="group rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
              <span className="inline-flex rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_100%)] p-3 text-white shadow-sm">
                <Icon size={18} />
              </span>
              <h3 className="mt-5 text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}