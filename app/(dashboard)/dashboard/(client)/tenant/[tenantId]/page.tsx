"use client";

import Link from "next/link";
import {
  Tv,
  UtensilsCrossed,
  Megaphone,
  LayoutDashboard,
  Settings,
  ArrowRight,
  Sparkles,
  Music2,
  BarChart3,
  LifeBuoy,
} from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
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
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);

  if (!tenant) return <ManagerSkeleton />;

  const text = locale === "ar"
    ? {
        console: "لوحة المستأجر",
        intro: "مساحة موحدة لادارة الشاشات والقائمة والبث من الهاتف او الجهاز اللوحي او الحاسوب.",
        modules: "الوحدات",
        mode: "الوضع",
        live: "مباشر",
        open: "فتح",
        settings: "الاعدادات",
        settingsDesc: "ملف المؤسسة والهوية البصرية وضبط النظام.",
        configure: "تهيئة",
        menuDigital: "القائمة الرقمية",
        menuDigitalDesc: "الكتالوج والتصنيفات والاسعار وQR menu.",
        tvStream: "بث التلفاز",
        tvStreamDesc: "ادارة الشاشات والربط والاوامر المباشرة.",
        audioPlaylist: "قائمة الصوت",
        audioPlaylistDesc: "برمجة الصوت وفترة الافتتاح وفترة التشغيل.",
        displayManager: "ادارة العرض",
        displayManagerDesc: "التحكم في القوالب والظهور على الشاشة.",
        statistics: "الاحصائيات",
        statisticsDesc: "متابعة اداء الشاشات وظهور الكتالوج.",
        campaigns: "الحملات",
        campaignsDesc: "وحدة الاعلانات قيد التحضير.",
        support: "الدعم والمساعدة",
        supportDesc: "دعم المشغل والدردشة المركزية.",
      }
    : {
        console: "Console tenant",
        intro: "Un espace unifie pour piloter vos ecrans, votre menu et votre diffusion media depuis mobile, tablette ou desktop.",
        modules: "Modules",
        mode: "Mode",
        live: "Live",
        open: "Ouvrir",
        settings: "Configuration",
        settingsDesc: "Profil etablissement, branding et reglages systemes.",
        configure: "Parametrer",
        menuDigital: "Menu Digital",
        menuDigitalDesc: "Catalogue, categories, prix et QR menu.",
        tvStream: "TV Stream",
        tvStreamDesc: "Gestion des ecrans, pairing et commandes live.",
        audioPlaylist: "Playlist Audio",
        audioPlaylistDesc: "Programmation audio, ouverture et croisiere.",
        displayManager: "Display Manager",
        displayManagerDesc: "Pilotage display, templates et visibilite.",
        statistics: "Statistiques",
        statisticsDesc: "Suivi performance ecrans et parution catalogue.",
        campaigns: "Campagnes",
        campaignsDesc: "Module pub en preparation cote produit.",
        support: "Aide & Support",
        supportDesc: "Support operateur et chat d'assistance centralises.",
      };

  const services: TenantServiceCard[] = [
    {
      title: text.menuDigital,
      desc: text.menuDigitalDesc,
      icon: <UtensilsCrossed size={24} />,
      href: `/dashboard/tenant/${tenant.id}/menu`,
      badge: "Core",
    },
    {
      title: text.tvStream,
      desc: text.tvStreamDesc,
      icon: <Tv size={24} />,
      href: `/dashboard/tenant/${tenant.id}/tvstream`,
      badge: "Live",
    },
    {
      title: text.audioPlaylist,
      desc: text.audioPlaylistDesc,
      icon: <Music2 size={24} />,
      href: `/dashboard/tenant/${tenant.id}/playlist`,
    },
    {
      title: text.displayManager,
      desc: text.displayManagerDesc,
      icon: <LayoutDashboard size={24} />,
      href: `/dashboard/tenant/${tenant.id}/display`,
    },
    {
      title: text.statistics,
      desc: text.statisticsDesc,
      icon: <BarChart3 size={24} />,
      href: `/dashboard/tenant/${tenant.id}/statistics`,
    },
    {
      title: text.campaigns,
      desc: text.campaignsDesc,
      icon: <Megaphone size={24} />,
      href: "#",
      locked: true,
    },
    {
      title: text.support,
      desc: text.supportDesc,
      icon: <LifeBuoy size={24} />,
      href: "/dashboard/support",
      badge: "Help",
    },
  ];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 md:space-y-8 dashboard-shell p-2 sm:p-3 rounded-3xl">
      <section className="dashboard-surface p-5 sm:p-7">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-700">
              <Sparkles size={13} /> {text.console}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              {tenant.name}
            </h1>
            <p className="max-w-2xl text-sm leading-7 dashboard-muted">
              {text.intro}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <MiniStat label={text.modules} value="6" />
            <MiniStat label={text.mode} value={text.live} strong />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link
            key={service.title}
            href={service.href}
            className={`group dashboard-surface p-5 sm:p-6 transition-all hover:-translate-y-0.5 ${
              service.locked ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-700">
                {service.icon}
              </div>
              {service.badge && (
                <span className="rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1">
                  {service.badge}
                </span>
              )}
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900 tracking-tight">{service.title}</h2>
            <p className="mt-2 text-sm dashboard-muted min-h-[44px]">{service.desc}</p>

            <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-slate-700 group-hover:text-slate-900">
              {text.open}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}

        <Link href={`/dashboard/tenant/${tenant.id}/settings`} className="group dashboard-surface p-5 sm:p-6 bg-slate-900 border-slate-900 text-white hover:bg-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-5">
            <Settings size={24} />
          </div>
          <h2 className="text-xl font-black tracking-tight">{text.settings}</h2>
          <p className="mt-2 text-sm text-slate-300">{text.settingsDesc}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-white">
            {text.configure}
            <ArrowRight size={14} />
          </div>
        </Link>
      </section>
    </div>
  );
}

function MiniStat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${strong ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-200"}`}>
      <p className={`text-[10px] font-black uppercase tracking-widest ${strong ? "text-slate-300" : "text-slate-500"}`}>
        {label}
      </p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}

function ManagerSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-52 rounded-3xl bg-white border border-slate-100" />
      ))}
    </div>
  );
}