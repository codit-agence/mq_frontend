"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Blocks, ChartColumnIncreasing, CircleCheckBig, Tv2, Workflow } from "lucide-react";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { PublicHomeAccess } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeAccess";
import { PublicHomeContact } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeContact";
import { PublicHomeHeader } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeHeader";
import { PublicHomeProductSuite } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeProductSuite";
import { PublicHomeServices } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeServices";
import { getPublicHomeCollections, getPublicHomeText } from "@/src/projects/public-site/marketing/components/public-home/public-home.utils";

export function PublicSolutionsPage({ branding }: { branding: PublicBranding }) {
  const { locale, setLocale, isRtl } = useAppLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const { services, navigation } = getPublicHomeCollections({
    services: branding.site_services,
    navigation: branding.site_navigation,
  });
  const text = getPublicHomeText(locale);

  const pageText = locale === "ar"
    ? {
        badge: "صفحة الحلول",
        title: "كل الحلول التجارية والرقمية داخل منصة واحدة",
        body: "نعرض هنا الخدمات والحلول التي تشكل قيمة المنصة: TV Connect، نظام الولاء، QR مجاني، Tracking، موقع تجاري وصفحات تسويق، وعروض تساعد على تحويل الزائر الى عميل.",
        cards: [
          { title: "واجهة بيع", body: "صفحات عامة لعرض العرض والخدمات والحزم." },
          { title: "تشغيل داخل المحل", body: "شاشات وقوائم وتشغيل مرن حسب قدرات الجهاز." },
          { title: "متابعة واداء", body: "قياس الاستهلاك ومتابعة الحمل حسب كل عميل." },
        ],
        pillarsBadge: "محاور المنصة",
        pillarsTitle: "من الاكتساب الى التشغيل ثم التتبع",
        pillars: [
          {
            title: "اكتساب العميل",
            body: "موقع عام وصفحات عروض وصفحات حلول وهيكلة SEO لجلب الطلبات بشكل اوضح.",
          },
          {
            title: "تشغيل المحتوى",
            body: "قوائم وشاشات ووسائط وحملات قابلة للتكيف مع قدرات كل جهاز.",
          },
          {
            title: "قيادة القرار",
            body: "متابعة الحمل والاستهلاك والنتيجة التجارية حتى تطور الباقة بشكل منطقي.",
          },
        ],
        flowBadge: "مسار العميل",
        flowTitle: "كيف تشتغل المنصة عمليا",
        flowSteps: [
          "العميل يكتشف الخدمة من الصفحة العامة",
          "يختار العرض او يطلب توجيها تجاريا",
          "ينطلق عبر onboarding ثم يدخل الى dashboard",
          "يدير TV والمحتوى والعروض والتتبع من نفس البيئة",
        ],
      }
    : {
        badge: "Page Solutions",
        title: "Toutes les briques commerciales et digitales dans une seule plateforme",
        body: "Cette page expose les solutions qui composent la valeur du produit: TV Connect, fidelite, QR gratuit, tracking, site web commercial et pages marketing pour transformer un visiteur en client actif.",
        cards: [
          { title: "Vente & marketing", body: "Pages publiques pour presenter offres, services et packs." },
          { title: "Execution terrain", body: "Ecrans, playlists et diffusion adaptee aux capacites du device." },
          { title: "Suivi & performance", body: "Mesure de la consommation et suivi de charge par client." },
        ],
        pillarsBadge: "Piliers produit",
        pillarsTitle: "De l'acquisition a l'execution puis au pilotage",
        pillars: [
          {
            title: "Acquisition client",
            body: "Site public, pages d'offres, pages solutions et SEO local pour capter la demande plus proprement.",
          },
          {
            title: "Execution contenu",
            body: "Menus, ecrans, medias et campagnes diffuses selon la qualite du device et le niveau du pack.",
          },
          {
            title: "Pilotage commercial",
            body: "Suivi de charge, de consommation et d'usage pour faire monter l'offre au bon moment.",
          },
        ],
        flowBadge: "Parcours client",
        flowTitle: "Comment la plateforme s'utilise concretement",
        flowSteps: [
          "Le prospect decouvre la solution via le site public",
          "Il choisit une offre ou demande un cadrage commercial",
          "Il passe par onboarding puis entre dans son dashboard",
          "Il pilote TV, contenu, promotions et suivi depuis le meme environnement",
        ],
      };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f5f8ff_0%,#fffdf7_36%,#ffffff_100%)] text-slate-950">
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
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm">{pageText.badge}</p>
            <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{pageText.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{pageText.body}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {pageText.cards.map((card, index) => (
                <article key={card.title} className="rounded-[1.7rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">{index === 1 ? <Tv2 size={18} /> : <Blocks size={18} />}</span>
                  <h2 className="mt-4 text-lg font-black text-slate-950">{card.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.35)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Vision produit</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Une suite qui suit le client du premier clic jusqu'au dashboard</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">Le prospect decouvre l'offre sur le site public, choisit un pack, passe par onboarding, puis entre dans le dashboard pour piloter contenu, TV, promotions, tracking et performance.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/offres" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                Voir les offres
                <ArrowRight size={16} />
              </Link>
              <Link href="/account/onboarding" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50">
                {text.chooseOffer}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicHomeServices branding={branding} locale={locale} services={services} title={text.servicesTitle} />

      <section className="border-y border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#edf5ff_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm">{pageText.pillarsBadge}</p>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{pageText.pillarsTitle}</h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {pageText.pillars.map((pillar, index) => (
              <article key={pillar.title} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
                <span className="inline-flex rounded-2xl bg-slate-950 p-3 text-white">
                  {index === 0 ? <Blocks size={18} /> : index === 1 ? <Workflow size={18} /> : <ChartColumnIncreasing size={18} />}
                </span>
                <h3 className="mt-4 text-xl font-black text-slate-950">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicHomeProductSuite locale={locale} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_30px_90px_-55px_rgba(15,23,42,0.75)]">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">{pageText.flowBadge}</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight">{pageText.flowTitle}</h2>
            <div className="mt-6 space-y-3">
              {pageText.flowSteps.map((step, index) => (
                <div key={step} className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100">
                  <span className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2D4F9E]">Impact</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">Une lecture claire pour vendre, diffuser et suivre</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <span className="inline-flex rounded-2xl bg-white p-3 text-[#2D4F9E] shadow-sm"><CircleCheckBig size={18} /></span>
                <h3 className="mt-4 text-lg font-black text-slate-950">Site public plus credible</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Le visiteur comprend plus vite l'offre, la logique tarifaire et le chemin vers le dashboard.</p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <span className="inline-flex rounded-2xl bg-white p-3 text-[#77BB65] shadow-sm"><Tv2 size={18} /></span>
                <h3 className="mt-4 text-lg font-black text-slate-950">Operation terrain plus nette</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Les TV, playlists et medias s'alignent sur la qualite du parc et les besoins du client.</p>
              </article>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/offres" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800">
                Voir les offres
                <ArrowRight size={16} />
              </Link>
              <Link href="/account/onboarding" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-50">
                {text.chooseOffer}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicHomeAccess locale={locale} />

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