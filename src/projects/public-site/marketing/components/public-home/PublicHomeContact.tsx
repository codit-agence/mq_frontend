import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";

import { PublicBranding, BrandingSiteNavigationItem } from "@/src/projects/shared/branding/branding.types";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { getLocalizedText, PublicHomeLocale } from "./public-home.utils";

interface PublicHomeContactProps {
  branding: PublicBranding;
  locale: PublicHomeLocale;
  navigation: BrandingSiteNavigationItem[];
  contactTitle: string;
  contactBody: string;
  chooseOfferLabel: string;
  callUsLabel: string;
  productsTitle: string;
  products: string[];
  loginLabel: string;
}

export function PublicHomeContact({
  branding,
  locale,
  navigation,
  contactTitle,
  contactBody,
  chooseOfferLabel,
  callUsLabel,
  productsTitle,
  products,
  loginLabel,
}: PublicHomeContactProps) {
  const salesText = locale === "ar"
    ? {
        channels: "قنوات التواصل التجاري",
        proposalTitle: "احصل على عرض مناسب لنشاطك",
        proposalBody: "نساعدك على اختيار الباقة حسب عدد الشاشات وحجم الوسائط وطريقة العمل داخل المحل أو عبر عدة فروع.",
        quote: "اطلب عرض سعر",
        writeUs: "راسلنا",
        reply: "رد تجاري سريع",
        replyBody: "مراجعة أولية للاحتياج ثم توجيهك نحو Starter أو Growth أو Scale.",
        navigationTitle: "روابط سريعة",
        commercialTitle: "قرار اسرع",
        commercialBody: "ابدأ ببساطة ثم ارفع المستوى مع الاستهلاك الحقيقي للشاشات والوسائط والدعم.",
      }
    : {
        channels: "Canaux commerciaux",
        proposalTitle: "Recevoir une offre adaptee a votre activite",
        proposalBody: "Nous vous orientons selon le nombre d'ecrans, le volume media et le niveau d'accompagnement souhaite pour votre point de vente ou votre reseau.",
        quote: "Demander un devis",
        writeUs: "Nous ecrire",
        reply: "Reponse commerciale rapide",
        replyBody: "Qualification du besoin puis orientation vers Starter, Growth ou Scale selon la charge reelle attendue.",
        navigationTitle: "Acces rapides",
        commercialTitle: "Decision plus rapide",
        commercialBody: "Commencez simple puis augmentez selon les TV actives, les medias diffuses et le support souhaite.",
      };

  return (
    <>
      <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(135deg,#0f172a_0%,#2D4F9E_56%,#77BB65_130%)] p-7 text-white shadow-[0_30px_90px_-55px_rgba(45,79,158,0.85)]">
            <h2 className="text-3xl font-black tracking-tight">{contactTitle}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-100/85">{contactBody}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/65">{salesText.reply}</p>
                <p className="mt-2 text-sm leading-7 text-white/85">{salesText.replyBody}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 px-4 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/65">{salesText.proposalTitle}</p>
                <p className="mt-2 text-sm leading-7 text-white/85">{salesText.proposalBody}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/account/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                {chooseOfferLabel}
                <ArrowRight size={16} />
              </Link>
              <Link href="/offres" className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                {salesText.quote}
              </Link>
              <Link href="/account/login" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                {loginLabel}
              </Link>
              {branding.support_phone ? (
                <a href={`tel:${branding.support_phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                  <Phone size={16} />
                  {callUsLabel}
                </a>
              ) : null}
            </div>
          </div>

          <div id="partners" className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-400">{branding.home_blog_label || branding.app_name}</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{branding.tagline || branding.app_name}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{branding.seo_meta_description || branding.tagline}</p>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2D4F9E]">{salesText.channels}</p>
              <div className="mt-4 grid gap-3">
                {branding.support_phone ? (
                  <a href={`tel:${branding.support_phone}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-900 transition hover:border-slate-300">
                    <span className="inline-flex rounded-2xl bg-[#eef4ff] p-2 text-[#2D4F9E]"><Phone size={16} /></span>
                    {branding.support_phone}
                  </a>
                ) : null}
                {branding.support_email ? (
                  <a href={`mailto:${branding.support_email}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-900 transition hover:border-slate-300">
                    <span className="inline-flex rounded-2xl bg-[#eff8ea] p-2 text-[#77BB65]"><Mail size={16} /></span>
                    {branding.support_email}
                  </a>
                ) : null}
                {!branding.support_phone && !branding.support_email ? (
                  <Link href="/account/onboarding" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-bold text-slate-900 transition hover:border-slate-300">
                    <span className="inline-flex rounded-2xl bg-[#eef4ff] p-2 text-[#2D4F9E]"><ArrowRight size={16} /></span>
                    {salesText.writeUs}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {navigation.map((item) => (
                <a key={item.key} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-black text-slate-900 transition hover:bg-slate-100">
                  {getLocalizedText(locale, item.label)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf5_100%)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.9fr_0.8fr] lg:px-10">
          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">{branding.app_name}</p>
            <h3 className="mt-3 text-2xl font-black text-slate-950">{productsTitle}</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {products.map((product) => (
                <div key={product} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {product}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">{salesText.navigationTitle}</p>
            <div className="mt-5 grid gap-3">
              {navigation.map((item) => (
                <a key={item.key} href={item.href} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                  {getLocalizedText(locale, item.label)}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/60">Commercial</p>
            <h3 className="mt-3 text-2xl font-black">{salesText.commercialTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{salesText.commercialBody}</p>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/account/onboarding" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-slate-100">
                {chooseOfferLabel}
                <ArrowRight size={16} />
              </Link>
              {branding.support_email ? (
                <a href={`mailto:${branding.support_email}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                  <Mail size={16} />
                  {salesText.writeUs}
                </a>
              ) : null}
              <Link href="/account/login" className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-4 text-sm font-black text-white transition hover:bg-white/10">
                {loginLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="app-footer-surface mt-auto border-t border-slate-200 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-10">
          <BrandingFooter branding={branding} locale={locale} />
        </div>
      </div>
    </>
  );
}
