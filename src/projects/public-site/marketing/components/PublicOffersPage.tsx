"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleGauge, Headset, Layers3, MonitorSmartphone } from "lucide-react";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { PublicHomeContact } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeContact";
import { PublicHomeHeader } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeHeader";
import { PublicHomeOffers } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeOffers";
import { PublicHomePricingLogic } from "@/src/projects/public-site/marketing/components/public-home/PublicHomePricingLogic";
import { getPublicHomeCollections, getPublicHomeText } from "@/src/projects/public-site/marketing/components/public-home/public-home.utils";

function getOfferProfile(locale: "fr" | "ar", code: string) {
  const profiles = locale === "ar"
    ? {
        starter: {
          screens: "2 شاشة",
          media: "قوائم وصور وعروض خفيفة",
          support: "تشغيل قياسي",
          target: "بداية سريعة لمحل او مطعم",
          billing: "سعر ثابت بسيط",
        },
        launch: {
          screens: "2 شاشة",
          media: "قوائم وصور وعروض خفيفة",
          support: "تشغيل قياسي",
          target: "بداية سريعة لمحل او مطعم",
          billing: "سعر ثابت بسيط",
        },
        growth: {
          screens: "5 شاشات",
          media: "وسائط اغنى وقوائم اكثر",
          support: "متابعة مع tracking",
          target: "متجر يريد بيع اكثر",
          billing: "سعر اعلى حسب الحمل",
        },
        "pro-growth": {
          screens: "5 شاشات",
          media: "وسائط اغنى وقوائم اكثر",
          support: "متابعة مع tracking",
          target: "متجر يريد بيع اكثر",
          billing: "سعر اعلى حسب الحمل",
        },
        scale: {
          screens: "10+ شاشات",
          media: "حملات ووسائط متعددة المواقع",
          support: "مرافقة اولوية وحوكمة اوسع",
          target: "حسابات كبيرة او متعددة الفروع",
          billing: "حسب الاستهلاك الحقيقي",
        },
        "enterprise-plus": {
          screens: "10+ شاشات",
          media: "حملات ووسائط متعددة المواقع",
          support: "مرافقة اولوية وحوكمة اوسع",
          target: "حسابات كبيرة او متعددة الفروع",
          billing: "حسب الاستهلاك الحقيقي",
        },
      }
    : {
        starter: {
          screens: "2 TV",
          media: "Menus, photos et promotions legeres",
          support: "Mise en route standard",
          target: "Lancement rapide pour commerce ou restaurant",
          billing: "Forfait fixe simple",
        },
        launch: {
          screens: "2 TV",
          media: "Menus, photos et promotions legeres",
          support: "Mise en route standard",
          target: "Lancement rapide pour commerce ou restaurant",
          billing: "Forfait fixe simple",
        },
        growth: {
          screens: "5 TV",
          media: "Plus de playlists et plus de medias",
          support: "Suivi avec tracking",
          target: "Commerce qui veut vendre plus sur place",
          billing: "Tarif plus haut selon la charge",
        },
        "pro-growth": {
          screens: "5 TV",
          media: "Plus de playlists et plus de medias",
          support: "Suivi avec tracking",
          target: "Commerce qui veut vendre plus sur place",
          billing: "Tarif plus haut selon la charge",
        },
        scale: {
          screens: "10+ TV",
          media: "Campagnes et medias multi-sites",
          support: "Accompagnement prioritaire",
          target: "Grand compte ou reseau multi-sites",
          billing: "Adapte a la consommation reelle",
        },
        "enterprise-plus": {
          screens: "10+ TV",
          media: "Campagnes et medias multi-sites",
          support: "Accompagnement prioritaire",
          target: "Grand compte ou reseau multi-sites",
          billing: "Adapte a la consommation reelle",
        },
      };

  return profiles[code as keyof typeof profiles] || (locale === "ar"
    ? {
        screens: "حسب الحاجة",
        media: "يتكيف مع حجم الوسائط",
        support: "حسب المستوى المطلوب",
        target: "عميل يحتاج عرضا مرنا",
        billing: "حسب الاستهلاك",
      }
    : {
        screens: "Selon besoin",
        media: "S'adapte au volume media",
        support: "Selon le niveau voulu",
        target: "Client qui veut une offre flexible",
        billing: "Selon consommation",
      });
}

export function PublicOffersPage({ branding }: { branding: PublicBranding }) {
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const [menuOpen, setMenuOpen] = useState(false);
  const { offers, navigation } = getPublicHomeCollections({
    offers: branding.site_offers,
    navigation: branding.site_navigation,
  });
  const resolvedOffers = offers.length ? offers : branding.site_offers || [];
  const text = getPublicHomeText(locale);

  const pageText = locale === "ar"
    ? {
        badge: "صفحة العروض",
        title: "اختر العرض المناسب حسب عدد الشاشات والاستهلاك والخدمات المطلوبة",
        body: "هذه الصفحة تشرح منطق الباقات بشكل اوضح: تبدأ من عرض بسيط، ثم يرتفع السعر مع عدد الشاشات، كثافة البث، حجم الوسائط، وحاجة العميل الى تتبع او مرافقة اعمق.",
        bullets: [
          "عرض البداية مناسب للانطلاق السريع",
          "عرض النمو مناسب للمتاجر التي تريد بيع اكثر",
          "العروض الكبيرة مخصصة للحسابات التي تستهلك اكثر",
        ],
        comparatorBadge: "مقارنة سريعة",
        comparatorTitle: "قارن بين الباقات في 30 ثانية",
        comparatorBody: "كل سطر يوضح الفرق الحقيقي بين عرض البداية وعرض النمو والعروض الكبيرة.",
        decisionBadge: "قراءة سريعة",
        decisionTitle: "كيف تختار بدون تضييع الوقت",
        decisionCards: [
          {
            title: "نقطة بيع صغيرة",
            body: "اختر عرض البداية اذا كنت تحتاج فقط الى شاشتين و QR مجاني وتشغيل واضح بدون تعقيد.",
          },
          {
            title: "متجر في طور النمو",
            body: "انتقل الى Growth عندما تحتاج الى قوائم اكثر ووسائط اكثر ومتابعة تجارية اقوى.",
          },
          {
            title: "عدة فروع او حجم كبير",
            body: "عروض Scale تتبع الاستهلاك الحقيقي لاستيعاب شاشات اكثر وحملات اكثر ومستوى دعم اعلى.",
          },
        ],
      }
    : {
        badge: "Page Offres",
        title: "Choisir le bon pack selon les ecrans, la consommation et le niveau de service",
        body: "Cette page explique plus clairement la logique d'abonnement: on commence avec une base simple, puis le tarif monte avec le nombre de TV, l'intensite de diffusion, le volume media et le besoin de tracking ou d'accompagnement.",
        bullets: [
          "Le pack de lancement sert a demarrer vite",
          "Le pack croissance sert a vendre plus avec plus d'ecrans",
          "Les offres grand compte suivent la vraie consommation du client",
        ],
        comparatorBadge: "Comparateur rapide",
        comparatorTitle: "Comparer les packs en 30 secondes",
        comparatorBody: "Chaque ligne montre ce qui change vraiment entre une offre de depart, une offre croissance et une offre grand compte.",
        decisionBadge: "Lecture rapide",
        decisionTitle: "Comment choisir sans perdre de temps",
        decisionCards: [
          {
            title: "Petit point de vente",
            body: "Prenez le pack de lancement si vous voulez 2 TV, un QR gratuit et une mise en route propre sans complexite.",
          },
          {
            title: "Commerce en croissance",
            body: "Passez sur Growth quand vous avez besoin de plus de playlists, plus de medias et d'un meilleur suivi commercial.",
          },
          {
            title: "Multi-sites ou gros volume",
            body: "Les offres Scale suivent la consommation reelle pour absorber plus d'ecrans, plus de campagnes et plus de support.",
          },
        ],
      };

  const comparisonRows = [
    {
      key: "screens",
      label: locale === "ar" ? "عدد الشاشات" : "Nombre de TV",
      icon: MonitorSmartphone,
    },
    {
      key: "media",
      label: locale === "ar" ? "نوع الوسائط" : "Charge media",
      icon: Layers3,
    },
    {
      key: "support",
      label: locale === "ar" ? "المرافقة" : "Support",
      icon: Headset,
    },
    {
      key: "billing",
      label: locale === "ar" ? "منطق الفوترة" : "Logique tarifaire",
      icon: CircleGauge,
    },
  ] as const;

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbf5_0%,#fffaf2_42%,#ffffff_100%)] text-slate-950">
      <PublicHomeHeader
        branding={branding}
        locale={locale}
        navigation={navigation}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
        onLocaleChange={setLocale}
        chooseOfferLabel={text.chooseOffer}
      />

      <section className="border-b border-slate-200/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-10 lg:py-16">
          <div>
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm">{pageText.badge}</p>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{pageText.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{pageText.body}</p>
            <div className="mt-8 grid gap-3">
              {pageText.bullets.map((bullet) => (
                <div key={bullet} className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  {bullet}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_35px_80px_-45px_rgba(15,23,42,0.9)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Abonnement</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Plus il consomme, plus le pack monte</h2>
            <p className="mt-4 text-sm leading-8 text-slate-300">TV actives, playlists, volume des medias, tracking, campagnes et support. La logique commerciale reste simple: plus de charge utile, plus de valeur, donc plus de budget.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/account/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                {text.chooseOffer}
                <ArrowRight size={16} />
              </Link>
              <Link href="/account/login" className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                {text.loginLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicHomePricingLogic locale={locale} />
      <PublicHomeOffers branding={branding} locale={locale} offers={offers} title={text.offersTitle} chooseOfferLabel={text.chooseOffer} />

      <section className="border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm">{pageText.comparatorBadge}</p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{pageText.comparatorTitle}</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{pageText.comparatorBody}</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_80px_-50px_rgba(45,79,158,0.4)]">
            <div className="grid border-b border-slate-200 bg-slate-950 text-white md:grid-cols-[240px_repeat(3,minmax(0,1fr))]">
              <div className="px-5 py-5 text-[11px] font-black uppercase tracking-[0.22em] text-white/60">{pageText.decisionBadge}</div>
              {resolvedOffers.slice(0, 3).map((offer, index) => (
                <div
                  key={offer.code}
                  className={`px-5 py-5 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#f3d087]">{offer.code}</p>
                  <h3 className="mt-2 text-xl font-black">{locale === "ar" ? offer.name.ar : offer.name.fr}</h3>
                  <p className="mt-3 text-sm text-slate-300">{locale === "ar" ? offer.price_label.ar : offer.price_label.fr}</p>
                </div>
              ))}
            </div>

            {comparisonRows.map((row, rowIndex) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.key}
                  className={`grid md:grid-cols-[240px_repeat(3,minmax(0,1fr))] ${rowIndex > 0 ? "border-t border-slate-200" : ""}`}
                >
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-5 text-sm font-black text-slate-900">
                    <span className="inline-flex rounded-2xl bg-white p-2 text-[#2D4F9E] shadow-sm"><Icon size={16} /></span>
                    {row.label}
                  </div>
                  {resolvedOffers.slice(0, 3).map((offer, index) => {
                    const profile = getOfferProfile(locale, offer.code) as Record<string, string>;
                    return (
                      <div
                        key={`${offer.code}-${row.key}`}
                        className={`px-5 py-5 text-sm leading-7 text-slate-600 ${index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""}`}
                      >
                        {profile[row.key]}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {pageText.decisionCards.map((card) => (
              <article key={card.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2D4F9E]">{pageText.decisionBadge}</p>
                <h3 className="mt-3 text-xl font-black text-slate-950">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicHomeContact
        branding={branding}
        locale={locale}
        navigation={navigation}
        contactTitle={text.contactTitle}
        contactBody={text.contactBody}
        chooseOfferLabel={text.chooseOffer}
        callUsLabel={text.callUs}
        productsTitle={text.productsTitle}
        products={text.productsList}
        loginLabel={text.loginLabel}
      />
    </main>
  );
}