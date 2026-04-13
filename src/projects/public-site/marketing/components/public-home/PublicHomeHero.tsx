import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleDot, PlayCircle, Sparkles } from "lucide-react";

import { PublicBranding, BrandingSiteHeroSlide, BrandingSiteHighlight, BrandingSiteOffer } from "@/src/projects/shared/branding/branding.types";
import { getLocalizedText, PublicHomeLocale } from "./public-home.utils";

interface PublicHomeHeroProps {
  branding: PublicBranding;
  locale: PublicHomeLocale;
  activeHero?: BrandingSiteHeroSlide;
  activeSlide: number;
  slides: BrandingSiteHeroSlide[];
  highlights: BrandingSiteHighlight[];
  offers: BrandingSiteOffer[];
  chooseOfferLabel: string;
  discoverOffersLabel: string;
  onSelectSlide: (index: number) => void;
}

export function PublicHomeHero({
  branding,
  locale,
  activeHero,
  activeSlide,
  slides,
  highlights,
  offers,
  chooseOfferLabel,
  discoverOffersLabel,
  onSelectSlide,
}: PublicHomeHeroProps) {
  const logoBlue = "#2D4F9E";
  const logoGreen = "#77BB65";

  return (
    <section className="relative border-b border-slate-200/80">
      <div className="absolute inset-0 -z-10" style={{ background: `radial-gradient(circle at top left, rgba(45,79,158,0.18), transparent 34%), radial-gradient(circle at 88% 18%, rgba(119,187,101,0.22), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.7), rgba(244,248,255,0.95))` }} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-16 xl:gap-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-slate-600 shadow-sm ring-1 ring-slate-200">
            <Sparkles size={14} />
            {branding.home_badge || branding.tagline || branding.app_name}
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-slate-950 sm:text-6xl lg:text-7xl">
            {activeHero ? getLocalizedText(locale, activeHero.title) : branding.seo_meta_title || branding.app_name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            {activeHero ? getLocalizedText(locale, activeHero.description) : branding.seo_meta_description || branding.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"><CircleDot size={14} style={{ color: logoGreen }} /> 2 TV inclus pour demarrer</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"><CircleDot size={14} style={{ color: logoBlue }} /> QR gratuit et promos locales</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"><CircleDot size={14} style={{ color: logoGreen }} /> Login pour entrer dans /dashboard</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={`/account/onboarding${offers[0]?.code ? `?offer=${offers[0].code}` : ""}`} className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white shadow-[0_20px_50px_-24px_rgba(45,79,158,0.7)] transition hover:opacity-95" style={{ background: `linear-gradient(135deg, ${logoBlue}, ${logoGreen})` }}>
              {activeHero?.cta_label ? getLocalizedText(locale, activeHero.cta_label) : chooseOfferLabel}
              <ArrowRight size={16} />
            </Link>
            <Link href="/account/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-black text-slate-900 transition hover:border-slate-400">
              <PlayCircle size={16} />
              Entrer dans l'app
            </Link>
            <Link href="/offres" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 text-sm font-black text-slate-900 transition hover:border-slate-400">
              {discoverOffersLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={`${item.value}-${item.label.fr}`} className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-sm">
                <p className="text-2xl font-black tracking-tight" style={{ color: item.value.includes("TV") ? logoBlue : logoGreen }}>{item.value}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{getLocalizedText(locale, item.label)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.45)]">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-50">
              <Image key={activeHero?.code || "fallback"} src={activeHero?.image_url || "/mq/jus2.jfif"} alt={branding.app_name} width={1400} height={960} className="h-[300px] w-full scale-[1.02] object-cover transition duration-700 sm:h-[420px]" priority />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-5 text-white">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">{branding.app_name}</p>
                <p className="mt-2 max-w-lg text-sm leading-7 text-white/90">{activeHero ? getLocalizedText(locale, activeHero.description) : branding.tagline}</p>
              </div>
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-800 shadow-sm">
                Slide {activeSlide + 1} / {Math.max(slides.length, 1)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pack base</p>
                <p className="mt-2 text-sm font-black" style={{ color: logoBlue }}>2 TV connectees</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Pack grand</p>
                <p className="mt-2 text-sm font-black" style={{ color: logoGreen }}>5 TV connectees</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Mode tarif</p>
                <p className="mt-2 text-sm font-black text-slate-950">Plus consomme, plus paie</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {slides.map((slide, index) => (
                <button key={slide.code} type="button" onClick={() => onSelectSlide(index)} className={`h-2.5 flex-1 rounded-full transition ${index === activeSlide ? "shadow-sm" : "bg-slate-200"}`} style={index === activeSlide ? { background: `linear-gradient(90deg, ${logoBlue}, ${logoGreen})` } : undefined} aria-label={slide.code} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}