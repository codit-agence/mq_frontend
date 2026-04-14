"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Eye, LayoutDashboard, LifeBuoy, Menu, Settings, ShieldCheck, Users } from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";

export default function InternalDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const { previewMode, withPreview } = useInternalPreviewMode();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const canAccessInternal = previewMode || Boolean(user?.is_staff || user?.is_superuser);

  useEffect(() => {
    if (!canAccessInternal) {
      router.replace("/dashboard");
    }
  }, [canAccessInternal, router]);

  const text = locale === "ar"
    ? {
        hub: "لوحة الادمن",
        clients: "العملاء",
        users: "المستخدمون",
        settings: "اعدادات الادمن",
        preview: "وضع المعاينة",
        previewHint: "عرض المحتوى بدون مصادقة حقيقية",
        restricted: "وصول غير مسموح",
        restrictedHint: "هذه المساحة مخصصة فقط لفريق الادمن الداخلي.",
      }
    : {
        hub: "Admin Hub",
        clients: "Clients",
        users: "Utilisateurs",
        settings: "Config Admin",
        preview: "Mode Preview",
        previewHint: "Revue du contenu sans authentification reelle",
        restricted: "Acces refuse",
        restrictedHint: "Cet espace est reserve a l'administration interne.",
      };

  const navLinks = [
    { href: withPreview("/dashboard/internal"), icon: <ShieldCheck size={16} />, label: text.hub, active: pathname === "/dashboard/internal" },
    { href: withPreview("/dashboard/internal/tenants"), icon: <LayoutDashboard size={16} />, label: text.clients, active: pathname.includes("/dashboard/internal/tenants") },
    { href: withPreview("/dashboard/internal/users"), icon: <Users size={16} />, label: text.users, active: pathname.includes("/dashboard/internal/users") },
    { href: withPreview("/dashboard/internal/settings"), icon: <Settings size={16} />, label: text.settings, active: pathname.includes("/dashboard/internal/settings") },
  ];

  if (!canAccessInternal) {
    return (
      <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">{text.restricted}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">{text.restrictedHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-sm">
        {previewMode ? (
          <div className="border-b border-amber-200/30 bg-amber-500/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 text-amber-200 text-xs font-bold">
              <Eye size={14} />
              <span>{text.preview}</span>
              <span className="text-amber-100/80">{text.previewHint}</span>
            </div>
          </div>
        ) : null}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-slate-700 text-slate-200"
              aria-label="Ouvrir la navigation"
            >
              <Menu size={18} />
            </button>

            <Link href={withPreview("/dashboard/internal")} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-all overflow-hidden" style={{ backgroundColor: branding.primary_color }}>
                {branding.logo ? <img src={branding.logo} alt={branding.app_name} className="w-full h-full object-cover" /> : branding.app_name.charAt(0)}
              </div>
              <div>
                <span className="block font-black text-white uppercase text-xs tracking-tight">{branding.app_name}</span>
                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{text.hub}</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <InternalNavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <LocaleToggle locale={locale} onChange={setLocale} />
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
              <span className="text-[10px] font-black uppercase text-slate-200">{user?.first_name}</span>
            </div>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-800 px-4 py-3 bg-slate-950">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <InternalNavLink key={item.href} {...item} onClick={() => setMobileNavOpen(false)} />
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>

      <div className="mt-auto border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="md:hidden mb-4 flex justify-end">
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>
          <BrandingFooter branding={branding} locale={locale} />
        </div>
      </div>
    </div>
  );
}

interface InternalNavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const InternalNavLink = ({ href, icon, label, active, onClick }: InternalNavLinkProps) => (
  <Link onClick={onClick} href={href} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${active ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"}`}>
    {icon} {label}
  </Link>
);