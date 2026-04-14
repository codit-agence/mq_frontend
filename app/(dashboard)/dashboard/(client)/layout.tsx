"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard, LifeBuoy, LogOut, Menu, Settings } from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { DashboardMessaging } from "@/src/projects/client-dashboard/messaging/components/DashboardMessaging";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { BrandingFooter } from "@/src/projects/shared/branding/components/BrandingFooter";
import { LocaleToggle } from "@/src/projects/shared/branding/components/LocaleToggle";

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuthStore();
  const { branding } = useBranding();
  const { locale, setLocale, isRtl } = useAppLocale(branding);
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const text = locale === "ar"
    ? {
        stats: "الرئيسية",
        config: "الاعدادات",
        help: "الدعم",
        alerts: "الاشعارات",
      }
    : {
        stats: "Stats",
        config: "Config",
        help: "Aide",
        alerts: "Alertes",
      };

  const navLinks = [
    { href: "/dashboard", icon: <LayoutDashboard size={16} />, label: text.stats, active: pathname === "/dashboard" },
    { href: "/dashboard/settings", icon: <Settings size={16} />, label: text.config, active: pathname === "/dashboard/settings" },
    { href: "/dashboard/support", icon: <LifeBuoy size={16} />, label: text.help, active: pathname === "/dashboard/support" },
    { href: "/dashboard/notifications", icon: <Bell size={16} />, label: text.alerts, active: pathname.includes("/notifications") },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen flex flex-col dashboard-shell">
      <header className="bg-white/90 border-b border-slate-100 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700"
              aria-label="Ouvrir la navigation"
            >
              <Menu size={18} />
            </button>

            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-all overflow-hidden" style={{ backgroundColor: branding.primary_color }}>
                {branding.logo ? <img src={branding.logo} alt={branding.app_name} className="w-full h-full object-cover" /> : branding.app_name.charAt(0)}
              </div>
              <span className="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-tight">{branding.app_name}</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:block">
              <LocaleToggle locale={locale} onChange={setLocale} />
            </div>
            <DashboardMessaging />
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase">{user?.first_name}</span>
            </div>
            <button onClick={logout} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-slate-100 px-4 py-3 bg-white">
            <nav className="grid grid-cols-2 gap-2">
              {navLinks.map((item) => (
                <NavLink key={item.href} {...item} onClick={() => setMobileNavOpen(false)} />
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {children}
      </main>

      <div className="app-footer-surface mt-auto">
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

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, icon, label, active, onClick }: NavLinkProps) => (
  <Link onClick={onClick} href={href} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all ${active ? "text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`} style={active ? { backgroundColor: "var(--brand-primary)", boxShadow: "0 10px 25px -18px var(--brand-primary)" } : undefined}>
    {icon} {label}
  </Link>
);