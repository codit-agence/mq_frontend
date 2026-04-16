"use client";

import Link from "next/link";
import {
  Tv,
  UtensilsCrossed,
  Megaphone,
  Monitor,
  Settings,
  ArrowRight,
  Sparkles,
  Music2,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { useTenantShellTheme } from "@/src/projects/client-dashboard/tenant/shell/useTenantShellTheme";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

type TenantServiceCard = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  locked?: boolean;
};

export default function TenantManagerPage() {
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);
  const { theme } = useTenantShellTheme();
  const isDark = theme === "dark";

  const primaryColor = formData?.display?.primary_color || "#2563eb";

  if (!tenant) return <ManagerSkeleton isDark={isDark} />;

  const text =
    locale === "ar"
      ? {
          console: "لوحة المستأجر",
          modules: "الوحدات",
          mode: "الوضع",
          live: "مباشر",
          open: "فتح",
          settings: "الاعدادات",
          settingsDesc: "الهوية والعرض والضبط.",
          configure: "تهيئة",
          menuDigital: "القائمة",
          menuDigitalDesc: "كتالوج، اسعار، QR.",
          tvStream: "التلفاز",
          tvStreamDesc: "شاشات، ربط، اوامر.",
          audioPlaylist: "الصوت",
          audioPlaylistDesc: "Playlist وجدولة.",
          displayManager: "العرض",
          displayManagerDesc: "قوالب ومحتوى الشاشة.",
          statistics: "الإحصائيات",
          statisticsDesc: "أداء الشاشات.",
          campaigns: "الحملات",
          campaignsDesc: "قيد التحضير.",
        }
      : {
          console: "Console tenant",
          modules: "Modules",
          mode: "Mode",
          live: "Live",
          open: "Ouvrir",
          settings: "Configuration",
          settingsDesc: "Identite, couleurs, reglages.",
          configure: "Parametrer",
          menuDigital: "Menu",
          menuDigitalDesc: "Catalogue, prix, QR.",
          tvStream: "TV",
          tvStreamDesc: "Ecrans, pairing, live.",
          audioPlaylist: "Audio",
          audioPlaylistDesc: "Playlist et planification.",
          displayManager: "Ecran",
          displayManagerDesc: "Templates et diffusion.",
          statistics: "Stats",
          statisticsDesc: "Performance ecrans.",
          campaigns: "Campagnes",
          campaignsDesc: "Bientot disponible.",
        };

  const services: TenantServiceCard[] = [
    {
      title: text.menuDigital,
      desc: text.menuDigitalDesc,
      icon: <UtensilsCrossed size={20} />,
      href: `/dashboard/tenant/${tenant.id}/menu`,
      badge: "Core",
    },
    {
      title: text.tvStream,
      desc: text.tvStreamDesc,
      icon: <Tv size={20} />,
      href: `/dashboard/tenant/${tenant.id}/tvstream`,
      badge: "Live",
    },
    {
      title: text.audioPlaylist,
      desc: text.audioPlaylistDesc,
      icon: <Music2 size={20} />,
      href: `/dashboard/tenant/${tenant.id}/playlist`,
    },
    {
      title: text.displayManager,
      desc: text.displayManagerDesc,
      icon: <Monitor size={20} />,
      href: `/dashboard/tenant/${tenant.id}/display`,
    },
    {
      title: text.statistics,
      desc: text.statisticsDesc,
      icon: <BarChart3 size={20} />,
      href: `/dashboard/tenant/${tenant.id}/statistics`,
    },
    {
      title: text.campaigns,
      desc: text.campaignsDesc,
      icon: <Megaphone size={20} />,
      href: "#",
      locked: true,
    },
  ];

  const surface = isDark ? "border-slate-700/80 bg-slate-800/50" : "border-slate-200 bg-white";
  const muted = isDark ? "text-slate-400" : "text-slate-600";
  const heading = isDark ? "text-slate-50" : "text-slate-900";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="dashboard-shell space-y-4 p-3 sm:p-4 sm:space-y-5">
      <section className={`rounded-2xl border p-4 sm:p-5 ${surface}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <span
              className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
              style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
            >
              <Sparkles size={12} /> {text.console}
            </span>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight truncate ${heading}`}>{tenant.name}</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full sm:w-44 shrink-0">
            <MiniStat label={text.modules} value="6" isDark={isDark} primaryColor={primaryColor} />
            <MiniStat label={text.mode} value={text.live} strong primaryColor={primaryColor} isDark={isDark} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            className={`group rounded-2xl border p-3.5 sm:p-4 transition-transform active:scale-[0.99] ${surface} ${
              service.locked ? "opacity-55 pointer-events-none" : "hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${primaryColor}14`, color: primaryColor }}
              >
                {service.icon}
              </div>
              {service.badge ? (
                <span className="rounded-full text-[9px] font-black uppercase tracking-wide px-2 py-0.5 text-white" style={{ backgroundColor: primaryColor }}>
                  {service.badge}
                </span>
              ) : null}
            </div>
            <h2 className={`mt-3 text-sm sm:text-base font-black tracking-tight line-clamp-2 ${heading}`}>{service.title}</h2>
            <p className={`mt-1 text-[11px] sm:text-xs leading-snug line-clamp-2 ${muted}`}>{service.desc}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide" style={{ color: primaryColor }}>
              {text.open}
              <ArrowRight size={12} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}

        <Link
          href={`/dashboard/tenant/${tenant.id}/settings`}
          className="group rounded-2xl border p-3.5 sm:p-4 text-white col-span-2 lg:col-span-1 transition-transform active:scale-[0.99] hover:opacity-95"
          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3">
            <Settings size={20} />
          </div>
          <h2 className="text-sm sm:text-base font-black tracking-tight">{text.settings}</h2>
          <p className="mt-1 text-[11px] sm:text-xs text-white/85 line-clamp-2">{text.settingsDesc}</p>
          <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white/95">
            {text.configure}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </div>
        </Link>
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  strong,
  primaryColor,
  isDark,
}: {
  label: string;
  value: string;
  strong?: boolean;
  primaryColor: string;
  isDark: boolean;
}) {
  if (strong) {
    return (
      <div className="rounded-xl p-3 border text-white" style={{ backgroundColor: primaryColor, borderColor: primaryColor }}>
        <p className="text-[9px] font-black uppercase tracking-widest text-white/80">{label}</p>
        <p className="mt-0.5 text-base font-black">{value}</p>
      </div>
    );
  }
  return (
    <div
      className={`rounded-xl p-3 border ${isDark ? "bg-slate-900/60 border-slate-700 text-slate-100" : "bg-slate-50 border-slate-200 text-slate-900"}`}
      style={!isDark ? { borderColor: `${primaryColor}33` } : undefined}
    >
      <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
      <p className="mt-0.5 text-base font-black">{value}</p>
    </div>
  );
}

function ManagerSkeleton({ isDark }: { isDark: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={`h-36 rounded-2xl border ${isDark ? "border-slate-700 bg-slate-800" : "border-slate-100 bg-white"}`} />
      ))}
    </div>
  );
}
