"use client";

import { Bell, ShieldCheck, Sparkles } from "lucide-react";
import { NotificationsCenter } from "@/src/projects/client-dashboard/messaging/components/NotificationsCenter";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export interface NotificationsPageViewProps {
  tenantId?: string | null;
}

export function NotificationsPageView({ tenantId }: NotificationsPageViewProps) {
  const scoped = typeof tenantId === "string" && tenantId.length > 0 ? tenantId : null;
  const backHref = scoped ? `/dashboard/tenant/${scoped}` : "/dashboard";
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);

  const text =
    locale === "ar"
      ? {
          badge: "الاشعارات",
          title: "مركز التنبيهات العام",
          subtitle:
            "تابع التنبيهات التشغيلية والتنبيهات المهمة في عرض منظم وواضح.",
          live: "التدفق المباشر",
          liveSub: "التنبيهات الجديدة تظهر هنا فور توفرها.",
          security: "تنبيهات الحساب",
          securitySub: "مراجعة التنبيهات المهمة المتعلقة بالوصول والحالة.",
        }
      : {
          badge: "Notifications",
          title: "Centre global des alertes",
          subtitle:
            "Suivez les notifications critiques et operationnelles dans une presentation plus lisible.",
          live: "Flux live",
          liveSub: "Les nouvelles alertes remontent ici des qu'elles sont disponibles.",
          security: "Etat du compte",
          securitySub: "Relire rapidement les alertes importantes liees a l'acces et au statut.",
        };

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 md:space-y-8">
      {!scoped && (
        <header className="dashboard-surface p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-700">
                <Bell size={13} /> {text.badge}
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">{text.title}</h1>
              <p className="mt-2 text-sm dashboard-muted max-w-2xl">{text.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-[360px]">
              <StatusCard icon={<Sparkles size={16} />} label={text.live} description={text.liveSub} />
              <StatusCard icon={<ShieldCheck size={16} />} label={text.security} description={text.securitySub} />
            </div>
          </div>
        </header>
      )}

      <NotificationsCenter tenantId={scoped} backHref={backHref} />
    </div>
  );
}

function StatusCard({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
  return (
    <div className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
