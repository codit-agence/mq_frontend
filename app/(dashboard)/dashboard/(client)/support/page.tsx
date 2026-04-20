"use client";

import { useMemo } from "react";
import Link from "next/link";
import { LifeBuoy, MessageCircle, Bell, ArrowRight, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { ChatPanel } from "@/src/projects/client-dashboard/messaging/components/ChatPanel";
import { useDashboardChatSocket } from "@/src/projects/client-dashboard/messaging/ws/useDashboardChatSocket";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function SupportPage() {
  const params = useParams<{ tenantId?: string }>();
  const { tenant, user } = useAuthStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();

  const tenantId = useMemo(() => {
    const fromRoute = params?.tenantId;
    if (typeof fromRoute === "string" && fromRoute) return fromRoute;
    return tenant?.id ?? null;
  }, [params?.tenantId, tenant?.id]);

  const userLabel =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Moi";

  const { connected, send } = useDashboardChatSocket(tenantId, user?.id);

  const text = locale === "ar"
    ? {
        badge: "الدعم والمساندة",
        title: "مركز الدعم والتواصل",
        subtitle: "مساحة موحدة لرسائل الدعم والتنبيهات ومتابعة حالة الاتصال مع قناة المساعدة.",
        notifications: "الاشعارات",
        messages: "الرسائل",
        supportLive: "قناة الدعم",
        supportLiveSub: "الاتصال المباشر مع فريق المساندة من مكان واحد.",
        workspace: "المساحة الحالية",
        workspaceSub: tenant?.name || "بدون مساحة عميل",
        connection: "الحالة",
        connected: "متصل",
        disconnected: "غير متصل",
        expertHelp: "مساندة تشغيلية",
        expertHelpSub: "الرجوع السريع للمساعدة والتنبيهات وسجل الرسائل.",
      }
    : {
        badge: "Aide & Support",
        title: "Centre support & communication",
        subtitle: "Un espace unifie pour le chat support, les notifications et la visibilite sur la connexion temps reel.",
        notifications: "Notifications",
        messages: "Messages",
        supportLive: "Canal support",
        supportLiveSub: "Connexion directe avec l'assistance depuis un seul point d'entree.",
        workspace: "Espace courant",
        workspaceSub: tenant?.name || "Sans tenant actif",
        connection: "Etat",
        connected: "Connecte",
        disconnected: "Deconnecte",
        expertHelp: "Support operationnel",
        expertHelpSub: "Acces rapide a l'aide, aux alertes et au fil de discussion central.",
      };

  const messagesHref = tenantId
    ? `/dashboard/tenant/${tenantId}/messages`
    : "/dashboard/messages";

  const notificationsHref = tenantId
    ? `/dashboard/tenant/${tenantId}/notifications`
    : "/dashboard/notifications";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 md:space-y-8">
      <header className="dashboard-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-700">
              <LifeBuoy size={13} /> {text.badge}
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              {text.title}
            </h1>
            <p className="mt-2 text-sm dashboard-muted max-w-2xl">
              {text.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={notificationsHref}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-slate-700 hover:bg-slate-50"
            >
              <Bell size={14} /> {text.notifications}
            </Link>
            <Link
              href={messagesHref}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white hover:bg-indigo-600"
            >
              <MessageCircle size={14} /> {text.messages}
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <InfoCard icon={<Radio size={16} />} label={text.connection} value={connected ? text.connected : text.disconnected} description={text.supportLiveSub} tone={connected ? "emerald" : "amber"} />
        <InfoCard icon={<ShieldCheck size={16} />} label={text.workspace} value={text.workspaceSub} description={text.expertHelpSub} />
        <InfoCard icon={<Sparkles size={16} />} label={text.supportLive} value={userLabel} description={tenantId ? `${text.messages} • ${text.notifications}` : text.expertHelpSub} />
      </section>

      <ChatPanel
        tenantId={tenantId}
        tenantName={tenant?.name}
        userLabel={userLabel}
        messagesHref={messagesHref}
        fullPage
        wsConnected={connected}
        wsSend={send}
      />
    </div>
  );
}

function InfoCard({ icon, label, value, description, tone = "slate" }: { icon: React.ReactNode; label: string; value: string; description: string; tone?: "slate" | "emerald" | "amber" }) {
  const toneClass = tone === "emerald"
    ? "border-emerald-200 bg-emerald-50"
    : tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-white";

  return (
    <div className={`rounded-[1.6rem] border p-5 ${toneClass}`}>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-lg font-black text-slate-900 break-words">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
