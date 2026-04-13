import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { PublicBranding, BrandingSiteOffer } from "@/src/projects/shared/branding/branding.types";
import { getLocalizedText, PublicHomeLocale } from "./public-home.utils";
import { getMarketingOffers } from "./offers.data";

export function PublicHomeOffers({
  branding,
  locale,
  offers,
  title,
  chooseOfferLabel,
}: {
  branding: PublicBranding;
  locale: PublicHomeLocale;
  offers: BrandingSiteOffer[];
  title: string;
  chooseOfferLabel: string;
}) {
  const fallbackOffers = offers.length ? offers : getMarketingOffers(branding);

  return (
    <section id="offers" className="border-y border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3d087]">{branding.app_name}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {fallbackOffers.map((offer, index) => {
            const highlighted = index === 1;
            return (
              <article key={offer.code} className={`rounded-[2rem] border p-6 ${highlighted ? "border-[#87bf5a] bg-white text-slate-950 shadow-[0_30px_70px_-40px_rgba(135,191,90,0.7)]" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs font-black uppercase tracking-[0.22em] ${highlighted ? "text-[#5f7f41]" : "text-slate-400"}`}>{offer.code}</p>
                    <h3 className="mt-3 text-2xl font-black">{getLocalizedText(locale, offer.name)}</h3>
                  </div>
                  {offer.promo_label ? <span className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${highlighted ? "bg-[#87bf5a] text-slate-950" : "bg-white/10 text-[#f3d087]"}`}>{getLocalizedText(locale, offer.promo_label)}</span> : null}
                </div>
                <p className={`mt-4 text-sm leading-7 ${highlighted ? "text-slate-600" : "text-slate-300"}`}>{getLocalizedText(locale, offer.tagline)}</p>
                <div className="mt-6 flex items-end gap-3">
                  <p className="text-3xl font-black tracking-tight">{getLocalizedText(locale, offer.price_label)}</p>
                  {offer.original_price_label ? <p className="text-sm text-slate-400 line-through">{getLocalizedText(locale, offer.original_price_label)}</p> : null}
                </div>
                {offer.promo_deadline_label ? <p className={`mt-2 text-xs font-black uppercase tracking-[0.18em] ${highlighted ? "text-rose-500" : "text-[#f3d087]"}`}>{getLocalizedText(locale, offer.promo_deadline_label)}</p> : null}
                <ul className="mt-6 space-y-3 text-sm">
                  {offer.features.map((feature, featureIndex) => (
                    <li key={`${offer.code}-${featureIndex}`} className="flex items-start gap-3">
                      <span className={`mt-0.5 inline-flex rounded-full p-1 ${highlighted ? "bg-[#eef6e4] text-[#5f7f41]" : "bg-white/10 text-[#f3d087]"}`}><Check size={14} /></span>
                      <span>{getLocalizedText(locale, feature)}</span>
                    </li>
                  ))}
                </ul>
                <p className={`mt-5 text-sm font-semibold ${highlighted ? "text-slate-600" : "text-slate-300"}`}>{getLocalizedText(locale, offer.highlight)}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href={`/offres/${offer.code}`} className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-4 text-sm font-black transition ${highlighted ? "border border-slate-300 bg-white text-slate-950 hover:bg-slate-50" : "border border-white/15 bg-transparent text-white hover:bg-white/10"}`}>
                    Voir detail
                  </Link>
                  <Link href={`/account/onboarding?offer=${offer.code}`} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-black transition ${highlighted ? "bg-slate-950 text-white hover:bg-slate-800" : "border border-white/15 bg-white/10 text-white hover:bg-white/15"}`}>
                    {chooseOfferLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}