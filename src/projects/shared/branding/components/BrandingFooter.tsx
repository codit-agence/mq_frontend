"use client";

import Link from "next/link";

import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

export function BrandingFooter({
  branding,
  locale,
  compact = false,
}: {
  branding: PublicBranding;
  locale: "fr" | "ar";
  compact?: boolean;
}) {
  const text = locale === "ar"
    ? {
        rights: "جميع الحقوق محفوظة",
        terms: "شروط الاستخدام",
        support: "الدعم",
        offers: "العروض",
        solutions: "الحلول",
        login: "الدخول",
        sales: "الاتصال التجاري",
      }
    : {
        rights: "Tous droits reserves",
        terms: "Conditions d'utilisation",
        support: "Support",
        offers: "Offres",
        solutions: "Solutions",
        login: "Connexion",
        sales: "Contact commercial",
      };

  return (
    <footer className={`${compact ? "pt-4" : "pt-6"}`}>
      <div className={`rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(135deg,rgba(45,79,158,0.06),rgba(119,187,101,0.09))] ${compact ? "p-4" : "p-5 sm:p-6"}`}>
       
        <div className={`flex ${compact ? "flex-col gap-4" : "flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"}`}>
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2D4F9E]">{branding.app_name}</p>
            <p className="max-w-xl text-sm font-semibold text-slate-700">{branding.tagline || branding.app_name}</p>
            <p className="text-xs text-slate-500">
              {text.rights} {new Date().getFullYear()}.
              {branding.tagline ? ` ${branding.tagline}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-600">
            {/* <Link href="/offres" className="rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-900">
              {text.offers}
            </Link>
            <Link href="/solutions" className="rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-900">
              {text.solutions}
            </Link>
            <Link href="/account/login" className="rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-900">
              {text.login}
            </Link>
            <Link href="/account/terms" className="rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:text-slate-900">
              {text.terms}
            </Link> */}
          </div>
        </div>

        <div className={`mt-5 flex ${compact ? "flex-col gap-2" : "flex-col gap-3 border-t border-slate-200/80 pt-5 md:flex-row md:items-center md:justify-between"}`}>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            {branding.support_email ? <span>{text.support}: {branding.support_email}</span> : null}
            {branding.support_phone ? <span>{text.sales}: {branding.support_phone}</span> : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <Link href="/account/login" className="hover:text-slate-900 transition">
              Dashboard
            </Link>
            <Link href="/account/terms" className="hover:text-slate-900 transition">
              {text.terms}
            </Link>
            <Link href="/offres" className="hover:text-slate-900 transition">
              {text.offers}
            </Link>
            <Link href="/solutions" className="hover:text-slate-900 transition">
              {text.solutions}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
