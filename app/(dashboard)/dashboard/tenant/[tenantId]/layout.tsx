"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { Bell, Home, LayoutDashboard, LifeBuoy, QrCode, ScanLine, Settings, Sparkles, Tv } from "lucide-react";
import { resolveTenantQrUrl } from "@/src/projects/client-dashboard/tenant/tenant-qr";
import { TenantQrModal } from "@/src/projects/client-dashboard/tenant/components/TenantQrModal";
import { TenantQrScannerModal } from "@/src/projects/client-dashboard/tenant/components/TenantQrScannerModal";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const { tenant } = useAuthStore();
  const { formData, fetchSettings } = useSettingsStore();
  const params = useParams();
  const pathname = usePathname();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);
  const [qrOpen, setQrOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const tenantId = (params?.tenantId as string) || tenant?.id || "";

  useEffect(() => {
    if (tenantId) {
      fetchSettings(tenantId);
    }
  }, [tenantId, fetchSettings]);

  const primaryColor = formData?.display?.primary_color || "#2563eb";
  const subtleBorder = "#e2e8f0";
  const qrUrl = useMemo(
    () =>
      resolveTenantQrUrl({
        public_landing_url: formData?.public_landing_url,
        qr_slug: formData?.qr_slug,
      }),
    [formData?.public_landing_url, formData?.qr_slug]
  );

  const mobileNav = [
    { href: `/dashboard/tenant/${tenantId}`, label: locale === "ar" ? "الرئيسية" : "Accueil", icon: <Home size={16} />, active: pathname === `/dashboard/tenant/${tenantId}` },
    { href: `/dashboard/tenant/${tenantId}/menu`, label: locale === "ar" ? "القائمة" : "Menu", icon: <LayoutDashboard size={16} />, active: pathname.includes(`/dashboard/tenant/${tenantId}/menu`) },
    { href: `/dashboard/tenant/${tenantId}/display`, label: locale === "ar" ? "العرض" : "Display", icon: <Tv size={16} />, active: pathname.includes(`/dashboard/tenant/${tenantId}/display`) },
    { href: `/dashboard/tenant/${tenantId}/settings`, label: locale === "ar" ? "الاعدادات" : "Settings", icon: <Settings size={16} />, active: pathname.includes(`/dashboard/tenant/${tenantId}/settings`) },
  ];

  const text = locale === "ar"
    ? {
        tenantSpace: "مساحة المستأجر",
        themeActive: "الهوية مفعلة",
        showQr: "عرض QR",
        scan: "مسح",
        notifications: "الاشعارات",
        support: "الدعم والمساعدة",
        myBusiness: "مؤسستي",
      }
    : {
        tenantSpace: "Espace tenant",
        themeActive: "Theme actif",
        showQr: "Afficher QR",
        scan: "Scanner",
        notifications: "Notifications",
        support: "Aide & Support",
        myBusiness: "Mon etablissement",
      };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen dashboard-shell text-slate-900">
      <header className="border-b bg-white/90 backdrop-blur-sm" style={{ borderColor: subtleBorder }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white shadow-sm border border-slate-200 px-4 py-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black shadow-inner"
              style={{ backgroundColor: primaryColor }}
            >
              {tenant?.name?.charAt(0) ?? "T"}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{text.tenantSpace}</p>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                {tenant?.name ?? text.myBusiness}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-black uppercase tracking-wider"
              style={{ backgroundColor: `${primaryColor}1A`, color: primaryColor }}
            >
              <Sparkles size={13} /> {text.themeActive}
            </span>

            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <QrCode size={14} /> {text.showQr}
            </button>

            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <ScanLine size={14} /> {text.scan}
            </button>

            <Link
              href="/dashboard/notifications"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <Bell size={14} /> {text.notifications}
            </Link>

            <Link
              href="/dashboard/support"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              <LifeBuoy size={14} /> {text.support}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-28 md:pb-8 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border bg-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.25)]" style={{ borderColor: subtleBorder }}>
          {children}
        </div>
      </main>

      <nav className="fixed bottom-4 left-4 right-4 z-40 md:hidden rounded-[1.75rem] border border-slate-200 bg-white/95 backdrop-blur-xl px-3 py-3 shadow-2xl">
        <div className="grid grid-cols-4 gap-2">
          {mobileNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[10px] font-black uppercase tracking-[0.14em] ${item.active ? "text-white" : "text-slate-500"}`}
              style={item.active ? { backgroundColor: primaryColor } : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <TenantQrModal open={qrOpen} onClose={() => setQrOpen(false)} qrUrl={qrUrl} />
      <TenantQrScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
    </div>
  );
}
