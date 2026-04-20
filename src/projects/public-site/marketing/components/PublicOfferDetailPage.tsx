"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, MonitorSmartphone, Sparkles, Zap } from "lucide-react";

import { PublicBranding, BrandingSiteOffer } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { PublicHomeContact } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeContact";
import { PublicHomeHeader } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeHeader";
import { getLocalizedText, getPublicHomeCollections, getPublicHomeText } from "@/src/projects/public-site/marketing/components/public-home/public-home.utils";

function getOfferNarrative(locale: "fr" | "ar", code: string) {
  const narratives = {
    fr: {
      launch: {
        audience: "Pour les commerces qui veulent une presence digitale rapide et rentable.",
        tv: "2 TV connectees incluses pour presenter menus, promotions et messages de marque.",
        resources: "Consommation de base faible, parfaite pour demarrer sans gaspillage.",
      },
      starter: {
        audience: "Pour les commerces qui veulent une presence digitale rapide et rentable.",
        tv: "2 TV connectees incluses pour presenter menus, promotions et messages de marque.",
        resources: "Consommation de base faible, parfaite pour demarrer sans gaspillage.",
      },
      growth: {
        audience: "Pour les clients qui ont deja plus de trafic et veulent vendre plus sur place.",
        tv: "5 TV connectees, plus de playlists, plus de medias et plus de flexibilite commerciale.",
        resources: "Le budget suit une charge media et un usage plus eleves, avec plus de valeur produite.",
      },
      "pro-growth": {
        audience: "Pour les clients qui ont deja plus de trafic et veulent vendre plus sur place.",
        tv: "5 TV connectees, plus de playlists, plus de medias et plus de flexibilite commerciale.",
        resources: "Le budget suit une charge media et un usage plus eleves, avec plus de valeur produite.",
      },
      scale: {
        audience: "Pour les structures qui utilisent plus d'ecrans, plus de campagnes et plus de suivi.",
        tv: "Capacite multi-ecrans, diffusion plus large et operations plus riches.",
        resources: "La tarification suit la consommation reelle: ecrans, medias, support, automation et tracking.",
      },
      "enterprise-plus": {
        audience: "Pour les structures qui utilisent plus d'ecrans, plus de campagnes et plus de suivi.",
        tv: "Capacite multi-ecrans, diffusion plus large et operations plus riches.",
        resources: "La tarification suit la consommation reelle: ecrans, medias, support, automation et tracking.",
      },
      default: {
        audience: "Une offre pensee pour faire grandir la presence commerciale du client.",
        tv: "TV connectees, contenu dynamique et QR accessibles rapidement.",
        resources: "Le niveau de prix reste aligne sur les ressources reellement consommees.",
      },
    },
    ar: {
      launch: {
        audience: "للتجار الذين يريدون حضورا رقميا سريعا ومربحا.",
        tv: "شاشتان متصلتان لعرض القوائم والعروض والهوية التجارية.",
        resources: "استهلاك منخفض في البداية لتشغيل نظيف بدون هدر.",
      },
      starter: {
        audience: "للتجار الذين يريدون حضورا رقميا سريعا ومربحا.",
        tv: "شاشتان متصلتان لعرض القوائم والعروض والهوية التجارية.",
        resources: "استهلاك منخفض في البداية لتشغيل نظيف بدون هدر.",
      },
      growth: {
        audience: "للعملاء الذين لديهم حركة اكبر ويريدون البيع اكثر داخل المحل.",
        tv: "5 شاشات متصلة مع قوائم اغنى ووسائط اكثر ومرونة تجارية اكبر.",
        resources: "الميزانية تتبع حمولة اعلى وقيمة تشغيلية اكبر.",
      },
      "pro-growth": {
        audience: "للعملاء الذين لديهم حركة اكبر ويريدون البيع اكثر داخل المحل.",
        tv: "5 شاشات متصلة مع قوائم اغنى ووسائط اكثر ومرونة تجارية اكبر.",
        resources: "الميزانية تتبع حمولة اعلى وقيمة تشغيلية اكبر.",
      },
      scale: {
        audience: "للبنيات التي تستعمل شاشات اكثر وحملات اكثر وتتبعا اعمق.",
        tv: "سعة متعددة الشاشات وبث اوسع وعمليات اغنى.",
        resources: "السعر يتبع الاستهلاك الحقيقي للشاشات والوسائط والدعم والاتمتة والتتبع.",
      },
      "enterprise-plus": {
        audience: "للبنيات التي تستعمل شاشات اكثر وحملات اكثر وتتبعا اعمق.",
        tv: "سعة متعددة الشاشات وبث اوسع وعمليات اغنى.",
        resources: "السعر يتبع الاستهلاك الحقيقي للشاشات والوسائط والدعم والاتمتة والتتبع.",
      },
      default: {
        audience: "عرض مصمم لتطوير الحضور التجاري للعميل.",
        tv: "شاشات متصلة ومحتوى ديناميكي و QR قابل للتشغيل بسرعة.",
        resources: "مستوى السعر يبقى مرتبطا بالموارد المستهلكة فعليا.",
      },
    },
  } as const;

  return narratives[locale][code as keyof typeof narratives[typeof locale]] || narratives[locale].default;
}

export function PublicOfferDetailPage({
  branding,
  offer,
  relatedOffers,
}: {
  branding: PublicBranding;
  offer: BrandingSiteOffer;
  relatedOffers: BrandingSiteOffer[];
}) {
  const { locale, setLocale, isRtl } = useAppLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const { navigation } = getPublicHomeCollections({ navigation: branding.site_navigation });
  const text = getPublicHomeText(locale);
  const narrative = getOfferNarrative(locale, offer.code);

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbf5_0%,#fff9f1_42%,#ffffff_100%)] text-slate-950">
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm">
              <Sparkles size={14} />
              {offer.code}
            </p>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{getLocalizedText(locale, offer.name)}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{getLocalizedText(locale, offer.tagline)}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={`/account/onboarding?offer=${offer.code}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                {text.chooseOffer}
                <ArrowRight size={16} />
              </Link>
              <Link href="/account/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50">
                {text.loginLabel}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white"><MonitorSmartphone size={18} /></span>
                <h2 className="mt-4 text-lg font-black text-slate-950">TV & diffusion</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{narrative.tv}</p>
              </article>
              <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white"><BarChart3 size={18} /></span>
                <h2 className="mt-4 text-lg font-black text-slate-950">Ressources</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{narrative.resources}</p>
              </article>
              <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white"><Zap size={18} /></span>
                <h2 className="mt-4 text-lg font-black text-slate-950">Client vise</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{narrative.audience}</p>
              </article>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_35px_80px_-45px_rgba(15,23,42,0.9)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-amber-300">Prix</p>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-4xl font-black tracking-tight">{getLocalizedText(locale, offer.price_label)}</p>
              {offer.original_price_label ? <p className="text-sm text-slate-400 line-through">{getLocalizedText(locale, offer.original_price_label)}</p> : null}
            </div>
            {offer.promo_label ? <p className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">{getLocalizedText(locale, offer.promo_label)}</p> : null}
            {offer.promo_deadline_label ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-rose-300">{getLocalizedText(locale, offer.promo_deadline_label)}</p> : null}

            <div className="mt-8 space-y-3">
              {offer.features.map((feature, index) => (
                <div key={`${offer.code}-${index}`} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100">
                  <CheckCircle2 size={18} className="mt-0.5 text-emerald-300" />
                  <span>{getLocalizedText(locale, feature)}</span>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm font-semibold leading-7 text-slate-300">{getLocalizedText(locale, offer.highlight)}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Autres packs</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Comparer avec les autres offres</h2>
          </div>
          <Link href="/offres" className="text-sm font-black text-slate-700 underline-offset-4 hover:underline">Retour a toutes les offres</Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {relatedOffers.map((relatedOffer) => (
            <article key={relatedOffer.code} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{relatedOffer.code}</p>
              <h3 className="mt-3 text-2xl font-black text-slate-950">{getLocalizedText(locale, relatedOffer.name)}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{getLocalizedText(locale, relatedOffer.tagline)}</p>
              <p className="mt-5 text-xl font-black text-slate-950">{getLocalizedText(locale, relatedOffer.price_label)}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={`/offres/${relatedOffer.code}`} className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-black text-slate-900 transition hover:bg-slate-50">
                  Voir detail
                </Link>
                <Link href={`/account/onboarding?offer=${relatedOffer.code}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                  {text.chooseOffer}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
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