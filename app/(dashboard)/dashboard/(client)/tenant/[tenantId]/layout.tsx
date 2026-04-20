"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  Monitor,
  Moon,
  Music2,
  QrCode,
  ScanLine,
  Settings,
  Sparkles,
  Sun,
  Tv,
  UtensilsCrossed,
} from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { resolveTenantQrUrlWithFallback } from "@/src/projects/client-dashboard/tenant/tenant-qr";
import { TenantQrModal } from "@/src/projects/client-dashboard/tenant/components/TenantQrModal";
import { TenantQrScannerModal } from "@/src/projects/client-dashboard/tenant/components/TenantQrScannerModal";
import { resolveTenantDisplayName } from "@/src/projects/client-dashboard/tenant/tenant-display";
import { useTenantShellTheme } from "@/src/projects/client-dashboard/tenant/shell/useTenantShellTheme";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { tenant } = useAuthStore();
  const { formData, fetchSettings } = useSettingsStore();
  const params = useParams();
  const pathname = usePathname();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale();
  const { theme, setTheme } = useTenantShellTheme();
  const [qrOpen, setQrOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const tenantId = (params?.tenantId as string) || tenant?.id || "";
  const isDark = theme === "dark";

  useEffect(() => {
    if (tenantId) {
      fetchSettings(tenantId);
    }
  }, [tenantId, fetchSettings]);

  const text = useMemo(
    () =>
      locale === "ar"
        ? {
            tenantSpace: "مساحة الأعمال",
            themeActive: "الهوية مفعلة",
            showQr: "عرض QR",
            scan: "مسح",
            myBusiness: "مؤسستي",
            navHome: "الرئيسية",
            navMenu: "القائمة",
            navTv: "التلفاز",
            navDisplay: "العرض",
            navPlan: "الجدولة",
            navStats: "الإحصائيات",
            navSettings: "الإعدادات",
            themeLight: "فاتح",
            themeDark: "داكن",
          }
        : {
            tenantSpace: "Espace Business",
            themeActive: "Theme actif",
            showQr: "QR",
            scan: "Scan",
            myBusiness: "Mon etablissement",
            navHome: "Accueil",
            navMenu: "Menu",
            navTv: "TV",
            navDisplay: "Ecran",
            navPlan: "Planif",
            navStats: "Stats",
            navSettings: "Reglages",
            themeLight: "Clair",
            themeDark: "Sombre",
          },
    [locale],
  );

  const primaryColor = formData?.display?.primary_color || "#2563eb";
  const secondaryColor = formData?.display?.secondary_color || "#64748b";
  const tenantDisplayName = resolveTenantDisplayName(formData) || tenant?.name || text.myBusiness;
  const businessLogo = formData?.business?.logo;
  const tenantLogoSrc =
    typeof businessLogo === "string" && businessLogo.length > 0 ? getImageUrl(businessLogo) : null;
  const qrUrl = useMemo(
    () =>
      resolveTenantQrUrlWithFallback({
        public_landing_url: formData?.public_landing_url,
        qr_redirect_url: formData?.qr_redirect_url,
        qr_slug: formData?.qr_slug,
      }),
    [formData?.public_landing_url, formData?.qr_redirect_url, formData?.qr_slug],
  );

  const base = `/dashboard/tenant/${tenantId}`;

  const mobileNav = useMemo(
    () => [
      {
        href: base,
        label: text.navHome,
        icon: <Home size={18} />,
        active: pathname === base,
      },
      {
        href: `${base}/menu`,
        label: text.navMenu,
        icon: <UtensilsCrossed size={18} />,
        active: pathname.includes(`${base}/menu`),
      },
      {
        href: `${base}/tvstream`,
        label: text.navTv,
        icon: <Tv size={18} />,
        active: pathname.includes(`${base}/tvstream`),
      },
      {
        href: `${base}/display`,
        label: text.navDisplay,
        icon: <Monitor size={18} />,
        active: pathname.includes(`${base}/display`),
      },
      {
        href: `${base}/playlist`,
        label: text.navPlan,
        icon: <Music2 size={18} />,
        active: pathname.includes(`${base}/playlist`),
      },
      {
        href: `${base}/statistics`,
        label: text.navStats,
        icon: <BarChart3 size={18} />,
        active: pathname.includes(`${base}/statistics`),
      },
      {
        href: `${base}/settings`,
        label: text.navSettings,
        icon: <Settings size={18} />,
        active: pathname.includes(`${base}/settings`),
      },
    ],
    [base, pathname, text],
  );

  const shellStyle = useMemo(
    () =>
      ({
        "--tenant-primary": primaryColor,
        "--tenant-secondary": secondaryColor,
      }) as React.CSSProperties,
    [primaryColor, secondaryColor],
  );

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`min-h-screen dashboard-shell pb-[5.5rem] md:pb-8 ${isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"}`}
      style={shellStyle}
    >
      {/* Langue + thème : toujours en haut (mobile-first, lisible en plein soleil) */}
      <div
        className={`sticky top-0 z-50 border-b backdrop-blur-md ${isDark ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <LocaleToggle locale={locale} onChange={setLocale} />
          <div className="flex items-center gap-1.5 rounded-full border p-0.5" style={{ borderColor: `${primaryColor}40` }}>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${!isDark ? "text-white shadow-sm" : isDark ? "text-slate-400" : "text-slate-600"}`}
              style={!isDark ? { backgroundColor: primaryColor } : undefined}
              aria-pressed={!isDark}
            >
              <Sun size={14} /> {text.themeLight}
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide inline-flex items-center gap-1 ${isDark ? "text-white shadow-sm" : "text-slate-600"}`}
              style={isDark ? { backgroundColor: primaryColor } : undefined}
              aria-pressed={isDark}
            >
              <Moon size={14} /> {text.themeDark}
            </button>
          </div>
        </div>
      </div>

      <header className={`border-b ${isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white/80"}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2.5 sm:gap-3 rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isDark ? "border-slate-700 bg-slate-900 hover:border-slate-600" : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"}`}
            style={{ outlineColor: primaryColor }}
            title={locale === "ar" ? "العودة الى قائمة المؤسسات" : "Retour a la liste des etablissements"}
          >
            <div
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-inner overflow-hidden shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {tenantLogoSrc ? (
                <img src={tenantLogoSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                tenantDisplayName.charAt(0) || "T"
              )}
            </div>
            <div className="min-w-0">
              <p className={`text-[9px] sm:text-[10px] uppercase tracking-[0.22em] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                {text.tenantSpace}
              </p>
              <h1 className="text-lg sm:text-xl font-black tracking-tight truncate" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                {tenantDisplayName}
              </h1>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider"
              style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
            >
              <Sparkles size={12} /> {text.themeActive}
            </span>

            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] sm:text-xs font-bold transition ${isDark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}
            >
              <QrCode size={14} /> <span className="hidden sm:inline">{text.showQr}</span>
            </button>

            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] sm:text-xs font-bold transition ${isDark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-700"}`}
            >
              <ScanLine size={14} /> <span className="hidden sm:inline">{text.scan}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div
          className={`mt-3 overflow-hidden rounded-2xl sm:rounded-[2rem] border shadow-lg ${isDark ? "border-slate-800 bg-slate-900 shadow-black/40" : "border-slate-200/80 bg-white shadow-slate-200/50"}`}
        >
          {children}
        </div>
      </main>

      <nav
        className={`fixed bottom-0 inset-x-0 z-30 md:hidden border-t backdrop-blur-xl px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] ${isDark ? "border-slate-800 bg-slate-950/95" : "border-slate-200 bg-white/95"}`}
        aria-label="Navigation tenant"
      >
        <div className="flex overflow-x-auto gap-0.5 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`snap-start shrink-0 min-w-[3.35rem] max-w-[4.25rem] flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[9px] font-black uppercase tracking-[0.08em] leading-tight text-center ${item.active ? "text-white" : isDark ? "text-slate-400" : "text-slate-500"}`}
              style={item.active ? { backgroundColor: primaryColor } : undefined}
            >
              {item.icon}
              <span className="line-clamp-2 w-full">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <TenantQrModal open={qrOpen} onClose={() => setQrOpen(false)} qrUrl={qrUrl} tenantLabel={tenantDisplayName} />
      <TenantQrScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
