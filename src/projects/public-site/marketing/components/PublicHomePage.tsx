"use client";

import { useEffect, useState } from "react";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { PublicHomeAccess } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeAccess";
import { PublicHomeContact } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeContact";
import { PublicHomeHeader } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeHeader";
import { PublicHomeHero } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeHero";
import { PublicHomeOffers } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeOffers";
import { PublicHomePricingLogic } from "@/src/projects/public-site/marketing/components/public-home/PublicHomePricingLogic";
import { PublicHomeProductSuite } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeProductSuite";
import { PublicHomeServices } from "@/src/projects/public-site/marketing/components/public-home/PublicHomeServices";
import { getPublicHomeCollections, getPublicHomeText } from "@/src/projects/public-site/marketing/components/public-home/public-home.utils";

export function PublicHomePage({ branding }: { branding: PublicBranding }) {
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const { slides, offers, services, highlights, navigation } = getPublicHomeCollections({
    slides: branding.site_hero_slides,
    offers: branding.site_offers,
    services: branding.site_services,
    highlights: branding.site_highlights,
    navigation: branding.site_navigation,
  });

  useEffect(() => {
    if (!slides.length) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const text = getPublicHomeText(locale);

  const activeHero = slides[activeSlide];
  const seoStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: branding.app_name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: branding.seo_meta_description || branding.tagline,
    offers: offers.map((offer) => ({
      "@type": "Offer",
      name: locale === "ar" ? offer.name.ar : offer.name.fr,
      description: locale === "ar" ? offer.tagline.ar : offer.tagline.fr,
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MAD",
        description: locale === "ar" ? offer.price_label.ar : offer.price_label.fr,
      },
    })),
    provider: {
      "@type": "Organization",
      name: branding.app_name,
      email: branding.support_email || undefined,
      telephone: branding.support_phone || undefined,
      url: typeof window === "undefined" ? undefined : window.location.origin,
    },
  };

  return (
    <main dir={isRtl ? "rtl" : "ltr"} className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f5f9f1_0%,#fffaf2_45%,#ffffff_100%)] text-slate-950">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(seoStructuredData) }} />

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

      <PublicHomeHero
        branding={branding}
        locale={locale}
        activeHero={activeHero}
        activeSlide={activeSlide}
        slides={slides}
        highlights={highlights}
        offers={offers}
        chooseOfferLabel={text.chooseOffer}
        discoverOffersLabel={text.discoverOffers}
        onSelectSlide={setActiveSlide}
      />

      <PublicHomeServices branding={branding} locale={locale} services={services} title={text.servicesTitle} />

      <PublicHomePricingLogic locale={locale} />

      <PublicHomeOffers branding={branding} locale={locale} offers={offers} title={text.offersTitle} chooseOfferLabel={text.chooseOffer} />

      <PublicHomeProductSuite locale={locale} />

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