"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  PlayCircle,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tv,
  Wallet,
} from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function GlobalDashboard() {
  const { user, tenant } = useAuthStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale(branding);
  const primaryColor = tenant?.primary_color || branding.primary_color || "#0f172a";

  const text = locale === "ar"
    ? {
        heading: `قيادة ${user?.first_name || "المستخدم"}`,
        intro: "واجهة تنفيذية موحدة للحساب والاشتراك والدخول السريع الى بيئة العميل بشكل مهني وواضح.",
        commandDeck: "لوحة القيادة",
        commandDeckSub: "نظرة سريعة على الجاهزية والحالة التجارية وخطوات التشغيل القادمة.",
        verified: "الحساب موثق",
        verifyNeeded: "التوثيق مطلوب",
        active: "الخدمة مفعلة",
        suspended: "الخدمة موقوفة",
        liveNow: "قيد التشغيل",
        noTenant: "لا توجد مساحة عميل مرتبطة بهذا الحساب حاليا.",
        wallet: "الرصيد",
        fidelity: "الولاء",
        accountScore: "مستوى الجاهزية",
        readiness: "جاهزية الحساب",
        readinessSub: "مستوى اكتمال البيانات للوصول الى تشغيل مستقر واحترافي.",
        clientSpace: "مساحة العميل",
        clientSpaceSub: "الوصول الى التشغيل اليومي للشاشات والقوائم والاحصائيات.",
        professionalSpace: "مساحة تشغيل احترافية",
        professionalSpaceSub: "كل ما يحتاجه العميل لادارة المحتوى والتشغيل اليومي من نقطة واحدة.",
        openConsole: "فتح المساحة",
        openMenu: "ادارة القائمة",
        openStats: "قراءة الاحصائيات",
        subscription: "الاشتراك",
        pack: "الباقة",
        offer: "العرض",
        status: "الحالة",
        coupon: "Qarat Code",
        since: "تاريخ التسجيل",
        billing: "الفوترة",
        billingSub: "التتبع المالي وحالة الدفع والتجديد القادم.",
        marketplace: "المتجر",
        marketplaceSub: "شراء التجهيزات والخدمات الجاهزة للتشغيل.",
        tutorial: "انطلاق سريع",
        tutorialSub: "دليل منظم لتجهيز الحساب والشاشات خلال دقائق.",
        watch: "بدء الدليل",
        nextActions: "الخطوات التالية",
        nextActionsSub: "اقتراحات عملية لتحسين الجاهزية والتشغيل.",
        actionVerify: "تفعيل التحقق من الحساب لتفادي توقف الوصول.",
        actionTenant: "ربط او تهيئة مساحة عميل لتشغيل الخدمات.",
        actionMenu: "مراجعة الكتالوج والقائمة قبل بدء البث.",
        businessPulse: "نبض النشاط",
        businessPulseSub: "مؤشرات تنفيذية سريعة لمساحة العميل الحالية.",
        screens: "الشاشات",
        schedule: "البرمجة",
        catalog: "الكتالوج",
        response: "الاستجابة",
        connected: "متصل",
        ready: "جاهز",
        synced: "متزامن",
        fast: "سريع",
        pending: "قيد الانتظار",
      }
    : {
        heading: `Cockpit de ${user?.first_name || "Utilisateur"}`,
        intro: "Une interface executive pour piloter le compte, l'abonnement et l'entree vers l'espace client de facon plus propre et plus pro.",
        commandDeck: "Command Deck",
        commandDeckSub: "Vue d'ensemble immediate sur la readiness, le commercial et les priorites d'exploitation.",
        verified: "Compte Verifie",
        verifyNeeded: "Verification requise",
        active: "Service Actif",
        suspended: "Service Suspendu",
        liveNow: "Live maintenant",
        noTenant: "Aucun espace client rattache a ce compte pour l'instant.",
        wallet: "Wallet",
        fidelity: "Fidelite",
        accountScore: "Score readiness",
        readiness: "Readiness compte",
        readinessSub: "Niveau de preparation pour un usage stable, propre et professionnel.",
        clientSpace: "Espace Client",
        clientSpaceSub: "Acces a l'exploitation quotidienne des ecrans, menus et statistiques.",
        professionalSpace: "Espace d'exploitation pro",
        professionalSpaceSub: "Tout le necessaire pour gerer contenu, diffusion et operations depuis un seul hub.",
        openConsole: "Ouvrir la console",
        openMenu: "Gerer le menu",
        openStats: "Lire les statistiques",
        subscription: "Abonnement",
        pack: "Pack",
        offer: "Offre",
        status: "Statut",
        coupon: "Qarat Code",
        since: "Inscription",
        billing: "Facturation",
        billingSub: "Suivi financier, statut de paiement et prochaine reconduction.",
        marketplace: "MarketPlace",
        marketplaceSub: "Acheter le materiel et les services prets a deployer.",
        tutorial: "Demarrage rapide",
        tutorialSub: "Un parcours guide pour rendre l'espace client operationnel en quelques minutes.",
        watch: "Lancer le guide",
        nextActions: "Actions recommandees",
        nextActionsSub: "Les prochaines etapes pour fiabiliser le compte et accelerer le lancement.",
        actionVerify: "Finaliser la verification du compte pour eviter les blocages futurs.",
        actionTenant: "Associer ou configurer un tenant pour activer le parcours client.",
        actionMenu: "Valider le catalogue et le menu avant mise en diffusion.",
        businessPulse: "Pulse business",
        businessPulseSub: "Indicateurs rapides pour la situation du tenant actuel.",
        screens: "Ecrans",
        schedule: "Programmation",
        catalog: "Catalogue",
        response: "Reponse",
        connected: "Connecte",
        ready: "Pret",
        synced: "Synchronise",
        fast: "Rapide",
        pending: "Pending",
      };

  const registrationDate = tenant?.registration_date
    ? new Date(tenant.registration_date).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")
    : "-";

  const readinessScore = [
    user?.is_active,
    user?.is_verified,
    Boolean(tenant?.id),
    Boolean(tenant?.subscription_pack),
  ].filter(Boolean).length * 25;

  const actionItems = [
    !user?.is_verified ? text.actionVerify : null,
    !tenant?.id ? text.actionTenant : null,
    tenant?.id ? text.actionMenu : null,
  ].filter(Boolean) as string[];

  const pulseCards = [
    { label: text.screens, value: tenant?.id ? "00" : "00", detail: text.connected, icon: <Tv size={18} /> },
    { label: text.schedule, value: tenant?.id ? "00" : "00", detail: text.ready, icon: <Clock3 size={18} /> },
    { label: text.catalog, value: tenant?.id ? "00" : "00", detail: text.synced, icon: <ShoppingBag size={18} /> },
    { label: text.response, value: tenant?.id ? "--" : "--", detail: text.fast, icon: <BarChart3 size={18} /> },
  ];

  const quickLinks = tenant
    ? [
        { href: `/dashboard/tenant/${tenant.id}`, label: text.openConsole, icon: <ArrowUpRight size={16} /> },
        { href: `/dashboard/tenant/${tenant.id}/menu`, label: text.openMenu, icon: <ShoppingBag size={16} /> },
        { href: `/dashboard/tenant/${tenant.id}/statistics`, label: text.openStats, icon: <BarChart3 size={16} /> },
      ]
    : [];

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 opacity-[0.10]" style={{ background: `radial-gradient(circle at top ${isRtl ? "right" : "left"}, ${primaryColor}, transparent 42%), linear-gradient(135deg, ${primaryColor}20, transparent 60%)` }} />
        <div className="relative p-5 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white">
                <Sparkles size={14} /> {text.commandDeck}
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-slate-950">{text.heading}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{text.intro}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{text.commandDeckSub}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge condition={user?.is_verified} trueText={text.verified} falseText={text.verifyNeeded} />
                <StatusBadge condition={user?.is_active} trueText={text.active} falseText={text.suspended} color="indigo" />
                <StatusBadge condition={Boolean(tenant?.id)} trueText={text.liveNow} falseText={text.noTenant} compact />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[420px]">
              <HeroMetric title={text.wallet} value="137.00 QRT" subtitle="Prepaid" tone="dark" />
              <HeroMetric title={text.fidelity} value="13 250 pts" subtitle="Rewards" tone="light" />
              <HeroMetric title={text.accountScore} value={`${readinessScore}%`} subtitle={text.readiness} tone="accent" color={primaryColor} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_0.95fr] gap-6">
        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.clientSpace}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{text.professionalSpace}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text.professionalSpaceSub}</p>
                </div>
                <div className="rounded-2xl p-3 text-white" style={{ backgroundColor: primaryColor }}>
                  <Building2 size={22} />
                </div>
              </div>

              {tenant ? (
                <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-black text-slate-950">{tenant.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">{text.clientSpaceSub}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                      <span className="font-semibold text-slate-500">{text.status}: </span>
                      <span className="font-black text-slate-950">{tenant.status || "---"}</span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {quickLinks.map((item) => (
                      <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <span>{item.label}</span>
                          {item.icon}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.6rem] border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
                  <p className="text-sm font-bold">{text.noTenant}</p>
                </div>
              )}
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.readiness}</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{readinessScore}%</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text.readinessSub}</p>

              <div className="mt-5 h-3 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${readinessScore}%`, backgroundColor: primaryColor }} />
              </div>

              <div className="mt-5 space-y-3">
                <ReadinessRow label={text.verified} ok={Boolean(user?.is_verified)} pendingLabel={text.pending} />
                <ReadinessRow label={text.active} ok={Boolean(user?.is_active)} pendingLabel={text.pending} />
                <ReadinessRow label={text.clientSpace} ok={Boolean(tenant?.id)} pendingLabel={text.pending} />
                <ReadinessRow label={text.subscription} ok={Boolean(tenant?.subscription_pack)} pendingLabel={text.pending} />
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.businessPulse}</p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{text.businessPulseSub}</h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                <CheckCircle2 size={14} /> {text.liveNow}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {pulseCards.map((card) => (
                <div key={card.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em]">{card.label}</span>
                    {card.icon}
                  </div>
                  <p className="mt-4 text-3xl font-black tracking-tight text-slate-950">{card.value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{card.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.subscription}</p>
                <h3 className="mt-2 text-2xl font-black text-slate-950">{tenant?.subscription_pack || "-"}</h3>
              </div>
              <div className="rounded-2xl bg-slate-950 p-3 text-white">
                <CreditCard size={18} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <MiniInfo label={text.pack} value={tenant?.subscription_pack || "-"} />
              <MiniInfo label={text.offer} value={tenant?.subscription_offer || "-"} />
              <MiniInfo label={text.status} value={tenant?.status || "-"} />
              <MiniInfo label={text.coupon} value={tenant?.coupon_code || "-"} />
            </div>

            <div className="mt-4 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{text.billing}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text.billingSub}</p>
                </div>
                <Wallet className="text-slate-500" size={18} />
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <p className="text-3xl font-black tracking-tight text-slate-950">00.00 <span className="text-xs text-slate-500">DHS</span></p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{text.since}: {registrationDate}</p>
              </div>
            </div>
          </div>
{/* 
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
               
                <ShoppingBag size={18} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950">{text.marketplace}</h3>
                <p className="mt-1 text-sm text-slate-600">{text.marketplaceSub}</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-4 text-sm font-black text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
              <div className="flex items-center justify-between gap-3">
                <span>{text.marketplace}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <PlayCircle className="text-indigo-300" size={18} />
              <h3 className="text-xl font-black">{text.tutorial}</h3>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{text.tutorialSub}</p>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-4 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-slate-100">
              <PlayCircle size={16} /> {text.watch}
            </button>
          </div> */}

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{text.nextActions}</p>
            <h3 className="mt-2 text-xl font-black text-slate-950">{text.nextActionsSub}</h3>
            <div className="mt-5 space-y-3">
              {actionItems.length ? actionItems.map((item) => (
                <ActionRow key={item} text={item} />
              )) : (
                <ActionRow text={text.professionalSpaceSub} done />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HeroMetric({ title, value, subtitle, tone, color }: { title: string; value: string; subtitle: string; tone: "dark" | "light" | "accent"; color?: string }) {
  const accentStyle = tone === "accent" ? { backgroundColor: `${color || "#0f172a"}12`, borderColor: `${color || "#0f172a"}2e`, color: color || "#0f172a" } : undefined;
  return (
    <div
      className={`rounded-2xl p-4 border ${
        tone === "dark"
          ? "bg-slate-900 text-white border-slate-900"
          : tone === "light"
            ? "bg-slate-50 text-slate-900 border-slate-200"
            : "border"
      }`}
      style={accentStyle}
    >
      <p className={`text-[10px] font-black uppercase tracking-widest ${tone === "dark" ? "text-slate-300" : tone === "light" ? "text-slate-500" : "opacity-70"}`}>{title}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
      <p className={`mt-1 text-xs font-semibold ${tone === "dark" ? "text-slate-300" : tone === "light" ? "text-slate-500" : "opacity-70"}`}>{subtitle}</p>
    </div>
  );
}

interface StatusBadgeProps {
  condition?: boolean;
  trueText: string;
  falseText: string;
  color?: "emerald" | "indigo" | "rose";
  compact?: boolean;
}

const STATUS_BADGE_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  rose: "bg-rose-50 text-rose-600 border-rose-100",
};

const StatusBadge = ({ condition, trueText, falseText, color = "emerald", compact = false }: StatusBadgeProps) => {
  const base = condition ? STATUS_BADGE_CLASSES[color] : STATUS_BADGE_CLASSES.rose;
  return (
    <div className={`rounded-xl flex items-center gap-2 font-black uppercase border ${compact ? "px-3 py-1.5 text-[8px] tracking-[0.12em]" : "px-3 py-1.5 text-[9px] tracking-widest"} ${base}`}>
      {condition ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
      {condition ? trueText : falseText}
    </div>
  );
};

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900 break-words">{value}</p>
    </div>
  );
}

function ReadinessRow({ label, ok, pendingLabel }: { label: string; ok: boolean; pendingLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
      <span className="font-semibold text-slate-600">{label}</span>
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
        {ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
        {ok ? "OK" : pendingLabel}
      </span>
    </div>
  );
}

function ActionRow({ text, done = false }: { text: string; done?: boolean }) {
  return (
    <div className={`rounded-2xl border px-4 py-4 text-sm ${done ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-700"}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 rounded-full p-1 ${done ? "bg-emerald-200 text-emerald-900" : "bg-white text-slate-500"}`}>
          {done ? <CheckCircle2 size={12} /> : <ChevronRight size={12} />}
        </div>
        <p className="leading-6 font-semibold">{text}</p>
      </div>
    </div>
  );
}
