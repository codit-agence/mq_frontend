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
  LayoutList,
  Activity,
  PieChart,
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
  const { locale, isRtl } = useAppLocale();
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
          displayHub: "التلفاز والعرض",
          displayHubSub: "افتح القسم المطلوب مباشرة.",
          hubScreens: "الشاشات",
          hubContent: "محتوى التلفاز",
          hubSchedule: "البرمجة",
          hubStatus: "الحالة",
          hubAnalytics: "التحليلات",
          hubAll: "كل أقسام العرض",
          dashSubscription: "الاشتراك والفوترة — لوحة التحكم العامة",
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
          displayHub: "TV & affichage",
          displayHubSub: "Acces direct aux ongles (ecrans, contenu, planif…).",
          hubScreens: "Ecrans",
          hubContent: "Contenu",
          hubSchedule: "Programmation",
          hubStatus: "Etat d'affichage",
          hubAnalytics: "Analytiques",
          hubAll: "Vue complete ecran",
          dashSubscription: "Abonnement & facturation — tableau de bord general",
        };

  const displayBase = `/dashboard/tenant/${tenant.id}/display`;
  const displayShortcuts = [
    { href: `${displayBase}?tab=screens`, label: text.hubScreens, icon: <Monitor size={18} /> },
    { href: `${displayBase}?tab=content`, label: text.hubContent, icon: <Tv size={18} /> },
    { href: `${displayBase}?tab=schedule`, label: text.hubSchedule, icon: <LayoutList size={18} /> },
    { href: `${displayBase}?tab=status`, label: text.hubStatus, icon: <Activity size={18} /> },
    { href: `${displayBase}?tab=analytics`, label: text.hubAnalytics, icon: <PieChart size={18} /> },
  ];

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

      <section className="grid grid-cols-3 gap-1.5 max-sm:grid-cols-3 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 lg:gap-3">
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            className={`group rounded-xl border p-2.5 transition-transform active:scale-[0.99] sm:rounded-2xl sm:p-3.5 md:p-4 ${surface} ${
              service.locked ? "opacity-55 pointer-events-none" : "hover:-translate-y-0.5"
            }`}
          >
            <div className="flex items-start justify-between gap-1 sm:gap-2">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl [&_svg]:size-[18px] sm:[&_svg]:size-5"
                style={{ backgroundColor: `${primaryColor}14`, color: primaryColor }}
              >
                {service.icon}
              </div>
              {service.badge ? (
                <span className="rounded-full px-1 py-0.5 text-[7px] font-black uppercase tracking-wide text-white sm:px-2 sm:text-[9px]" style={{ backgroundColor: primaryColor }}>
                  {service.badge}
                </span>
              ) : null}
            </div>
            <h2 className={`mt-2 line-clamp-2 text-[11px] font-black leading-tight tracking-tight sm:mt-3 sm:text-sm md:text-base ${heading}`}>{service.title}</h2>
            <p className={`mt-0.5 line-clamp-2 text-[9px] leading-snug sm:mt-1 sm:text-[11px] md:text-xs ${muted}`}>{service.desc}</p>
            <div className="mt-2 inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wide sm:mt-3 sm:gap-1 sm:text-[10px]" style={{ color: primaryColor }}>
              {text.open}
              <ArrowRight size={12} className="rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}

        <Link
          href={`/dashboard/tenant/${tenant.id}/settings`}
          className="group col-span-3 rounded-xl border p-3 text-white transition-transform active:scale-[0.99] hover:opacity-95 sm:col-span-2 sm:rounded-2xl sm:p-3.5 md:p-4 lg:col-span-1"
          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
        >
          <div className="mb-2 flex items-center gap-3 sm:mb-3 sm:block">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 sm:h-10 sm:w-10 sm:rounded-xl">
              <Settings size={18} className="sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xs font-black tracking-tight sm:text-sm md:text-base">{text.settings}</h2>
              <p className="mt-0.5 line-clamp-2 text-[9px] text-white/85 sm:mt-1 sm:text-[11px] md:text-xs">{text.settingsDesc}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wide text-white/95 sm:text-[10px]">
            {text.configure}
            <ArrowRight size={12} className="rtl:rotate-180" />
          </div>
        </Link>
      </section>

      <section className={`rounded-2xl border p-4 sm:p-5 ${surface}`}>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${muted}`}>{text.displayHub}</p>
            <p className={`mt-1 text-sm ${muted}`}>{text.displayHubSub}</p>
          </div>
          <Link
            href={displayBase}
            className="text-[10px] font-black uppercase tracking-wider shrink-0"
            style={{ color: primaryColor }}
          >
            {text.hubAll} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {displayShortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-xl border px-3 py-3 transition active:scale-[0.99] hover:-translate-y-0.5 ${surface}`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${primaryColor}14`, color: primaryColor }}>
                {item.icon}
              </span>
              <span className={`text-[11px] font-black leading-tight ${heading}`}>{item.label}</span>
            </Link>
          ))}
        </div>
        <p className={`mt-4 text-center text-[10px] font-semibold ${muted}`}>
          <Link href="/dashboard" className="underline-offset-2 hover:underline" style={{ color: primaryColor }}>
            {text.dashSubscription}
          </Link>
        </p>
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
