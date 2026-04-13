import Link from "next/link";
import { ArrowRight, Globe2, LockKeyhole, Menu, PanelsTopLeft, X } from "lucide-react";

import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { PublicBranding, BrandingSiteNavigationItem } from "@/src/projects/shared/branding/branding.types";
import { getLocalizedText, PublicHomeLocale } from "./public-home.utils";

interface PublicHomeHeaderProps {
  branding: PublicBranding;
  locale: PublicHomeLocale;
  navigation: BrandingSiteNavigationItem[];
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onLocaleChange: (locale: PublicHomeLocale) => void;
  chooseOfferLabel: string;
}

export function PublicHomeHeader({
  branding,
  locale,
  navigation,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onLocaleChange,
  chooseOfferLabel,
}: PublicHomeHeaderProps) {
  const topLinks = [
    { href: "/offres", label: locale === "ar" ? "العروض" : "Offres" },
    { href: "/solutions", label: locale === "ar" ? "الحلول" : "Solutions" },
    { href: "/offres/starter", label: locale === "ar" ? "باقة البداية" : "Pack Start" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/86 shadow-[0_8px_40px_-28px_rgba(45,79,158,0.45)] backdrop-blur-xl">
      <div className="border-b border-slate-200/70 bg-[linear-gradient(90deg,rgba(45,79,158,0.06),rgba(119,187,101,0.08))]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <PanelsTopLeft size={14} />
            <span>{branding.home_badge || branding.tagline}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Globe2 size={14} />
            <span>{locale === "ar" ? "الموقع تحت الاعداد  للبيع" : "Le site est en cours de préparation. Merci "}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-[1.35rem] text-white shadow-[0_18px_40px_-20px_rgba(45,79,158,0.8)] ring-1 ring-black/5" style={{ background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.secondary_color})` }}>
            {branding.logo ? <img src={branding.logo} alt={branding.app_name} className="h-full w-full object-cover" /> : branding.app_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-black uppercase tracking-[0.18em] text-slate-900">{branding.app_name}</p>
            <p className="truncate text-xs text-slate-500">{branding.home_badge || branding.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 xl:flex">
          {topLinks.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
              {item.label}
            </Link>
          ))}
          {navigation.map((item) => (
            <a key={item.key} href={item.href} className="rounded-full px-4 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              {getLocalizedText(locale, item.label)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <LocaleToggle locale={locale} onChange={onLocaleChange} />
          </div>
          <Link href="/account/login" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-900 transition hover:bg-slate-50">
            <LockKeyhole size={14} />
            Login
          </Link>
          <Link href="/account/onboarding" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_-20px_rgba(45,79,158,0.8)] transition hover:opacity-95" style={{ background: `linear-gradient(135deg, ${branding.primary_color}, ${branding.secondary_color})` }}>
            {chooseOfferLabel}
            <ArrowRight size={14} />
          </Link>
        </div>

        <button type="button" onClick={onToggleMenu} className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:hidden">
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-[0_24px_50px_-36px_rgba(15,23,42,0.45)] lg:hidden">
          <div className="mb-4 flex justify-end">
            <div className="rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <LocaleToggle locale={locale} onChange={onLocaleChange} />
            </div>
          </div>
          <nav className="grid gap-2">
            {topLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={onCloseMenu} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800">
                {item.label}
              </Link>
            ))}
            {navigation.map((item) => (
              <a key={item.key} href={item.href} onClick={onCloseMenu} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-800">
                {getLocalizedText(locale, item.label)}
              </a>
            ))}
            <Link href="/account/login" onClick={onCloseMenu} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-black text-slate-900">
              Login
            </Link>
            <Link href="/account/onboarding" onClick={onCloseMenu} className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white">
              {chooseOfferLabel}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}