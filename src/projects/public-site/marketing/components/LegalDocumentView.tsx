"use client";

import Link from "next/link";

import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import Image from "next/image";

export type LegalDocumentPayload = {
  slug: string;
  title_fr: string;
  title_ar: string;
  content_fr: string;
  content_ar: string;
  last_updated: string;
};

const BLUE = "#2D4F9E";
const GREEN = "#77BB65";
const GRAD = `linear-gradient(135deg, ${BLUE}, ${GREEN})`;

export function LegalDocumentView({
  branding,
  doc,
}: {
  branding: PublicBranding;
  doc: LegalDocumentPayload;
}) {
  const { locale, setLocale, isRtl } = useAppLocale();
  const title = locale === "ar" ? doc.title_ar : doc.title_fr;
  const body = locale === "ar" ? doc.content_ar : doc.content_fr;
  const isProbablyHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  const back = locale === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil";

  return (
    <div id="top" dir={isRtl ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-white text-slate-950 antialiased">
      <header className="border-b border-slate-100 bg-[linear-gradient(180deg,#f8faff_0%,#ffffff_100%)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            {branding.logo ? (
              <Image
                src={getImageUrl(branding.logo) || branding.logo}
                alt={branding.app_name}
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            ) : (
              <span className="text-xl font-black tracking-tight" style={{ color: BLUE }}>
                {branding.app_name}
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-full border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setLocale("fr")}
                className={`rounded-full px-2.5 py-1 text-xs font-black transition ${locale === "fr" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                className={`rounded-full px-2.5 py-1 text-xs font-black transition ${locale === "ar" ? "bg-slate-900 text-white" : "text-slate-600"}`}
              >
                عربي
              </button>
            </div>
            <Link
              href="/"
              className="hidden rounded-full px-4 py-2 text-sm font-black text-white shadow-sm sm:inline-flex"
              style={{ background: GRAD }}
            >
              {back}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link href="/" className="text-sm font-bold underline decoration-slate-300 sm:hidden" style={{ color: BLUE }}>
          {back}
        </Link>
        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-xs font-semibold text-slate-400">
          {locale === "ar" ? "آخر تحديث" : "Dernière mise à jour"} : {new Date(doc.last_updated).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}
        </p>
        {isProbablyHtml ? (
          <article
            className="legal-prose mt-10 space-y-4 text-sm leading-7 text-slate-700 [&_a]:font-bold [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_li]:ms-4 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <article className="mt-10 whitespace-pre-wrap text-sm leading-7 text-slate-700">{body}</article>
        )}
      </main>
    </div>
  );
}
