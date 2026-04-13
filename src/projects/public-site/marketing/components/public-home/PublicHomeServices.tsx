import { PublicBranding, BrandingSiteService } from "@/src/projects/shared/branding/branding.types";
import { getLocalizedText, PublicHomeLocale } from "./public-home.utils";

export function PublicHomeServices({
  branding,
  locale,
  services,
  title,
}: {
  branding: PublicBranding;
  locale: PublicHomeLocale;
  services: BrandingSiteService[];
  title: string;
}) {
  const fallbackServices = services.length
    ? services
    : [
        {
          code: "tv-connect",
          title: { fr: "TV Connectee", ar: "TV متصلة" },
          description: { fr: "Affichez menus, promos et campagnes sur ecrans relies a votre dashboard.", ar: "اعرض القوائم والعروض والحملات على شاشات مربوطة بلوحة التحكم." },
        },
        {
          code: "website-seo",
          title: { fr: "Site web & SEO", ar: "موقع و SEO" },
          description: { fr: "Une presence web commerciale qui aide le client a vous trouver et a vous contacter.", ar: "حضور ويب تجاري يساعد العميل على العثور عليك والتواصل معك." },
        },
        {
          code: "qr-promo",
          title: { fr: "QR & promotions", ar: "QR والعروض" },
          description: { fr: "QR gratuit, promotions rapides et campagnes localisees pour vendre plus.", ar: "QR مجاني وعروض سريعة وحملات محلية لبيع اكثر." },
        },
      ];

  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
      <p className="text-xs font-black uppercase tracking-[0.24em] text-[#5f7f41]">{branding.app_name}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <div className="mt-4 max-w-3xl text-sm leading-8 text-slate-600 sm:text-base">
        Une plateforme qui combine marketing public, dashboard client et pilotage commercial autour d'une offre claire.
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {fallbackServices.map((service) => (
          <article key={service.code} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
            <h3 className="text-xl font-black text-slate-950">{getLocalizedText(locale, service.title)}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{getLocalizedText(locale, service.description)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}