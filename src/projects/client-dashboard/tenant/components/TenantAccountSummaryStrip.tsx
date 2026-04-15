"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, RefreshCw, Shield, UserCircle2, Wrench } from "lucide-react";
import { tenantAccountService, TenantAccountSummary } from "@/src/projects/client-dashboard/tenant/services/tenant-account.service";
import { getErrorMessage } from "@/src/utils/errors";

type Locale = "fr" | "ar";

const STATUS_LABEL: Record<string, Record<Locale, string>> = {
  pending: { fr: "En attente", ar: "قيد المراجعة" },
  active: { fr: "Actif", ar: "نشط" },
  suspended: { fr: "Suspendu", ar: "موقوف" },
  trial: { fr: "Essai", ar: "تجريبي" },
};

const PACK_LABEL: Record<string, Record<Locale, string>> = {
  starter: { fr: "Starter", ar: "ستارتر" },
  pro: { fr: "Pro", ar: "برو" },
  enterprise: { fr: "Enterprise", ar: "مؤسسات" },
};

const PAYMENT_LABEL: Record<string, Record<Locale, string>> = {
  monthly: { fr: "Mensuel", ar: "شهري" },
  yearly: { fr: "Annuel", ar: "سنوي" },
  custom: { fr: "Sur mesure", ar: "مخصص" },
};

function label(map: Record<string, Record<Locale, string>>, key: string, locale: Locale, fallback: string) {
  const row = map[key];
  if (!row) return fallback || key || "—";
  return row[locale] || row.fr || key;
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "active":
      return "border-emerald-200 bg-emerald-50 text-emerald-900";
    case "suspended":
      return "border-rose-200 bg-rose-50 text-rose-900";
    case "trial":
      return "border-sky-200 bg-sky-50 text-sky-900";
    case "pending":
    default:
      return "border-amber-200 bg-amber-50 text-amber-950";
  }
}

function subscriptionProfileSparse(data: TenantAccountSummary) {
  let missing = 0;
  if (!String(data.subscription_pack || "").trim()) missing += 1;
  if (!String(data.subscription_offer || "").trim()) missing += 1;
  if (!String(data.payment_type || "").trim()) missing += 1;
  if (!String(data.commercial_name || "").trim()) missing += 1;
  if (!String(data.technician_name || "").trim()) missing += 1;
  return missing >= 3;
}

function packAccentClass(pack: string) {
  switch (pack) {
    case "pro":
      return "border-l-4 border-l-indigo-500";
    case "enterprise":
      return "border-l-4 border-l-violet-600";
    case "starter":
      return "border-l-4 border-l-slate-400";
    default:
      return "border-l-4 border-l-slate-300";
  }
}

export interface TenantAccountSummaryStripProps {
  tenantId: string;
  locale: Locale;
}

export function TenantAccountSummaryStrip({ tenantId, locale }: TenantAccountSummaryStripProps) {
  const [data, setData] = useState<TenantAccountSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!tenantId) return;
    setError(null);
    setLoading(true);
    try {
      const summary = await tenantAccountService.getSummary(tenantId);
      setData(summary);
    } catch (err) {
      setData(null);
      const apiMsg = getErrorMessage(err);
      setError(
        apiMsg ||
          (locale === "ar"
            ? "تعذر تحميل ملخص الحساب. تحقق من NEXT_PUBLIC_API_URL والخادم."
            : "Impossible de charger le resume compte. Verifiez NEXT_PUBLIC_API_URL, le backend, et X-Tenant-ID."),
      );
    } finally {
      setLoading(false);
    }
  }, [tenantId, locale]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = window.setInterval(() => void load(), 45000);
    return () => window.clearInterval(t);
  }, [load]);

  useEffect(() => {
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const t =
    locale === "ar"
      ? {
          title: "اشتراكك وفريقك",
          pack: "الباقة",
          status: "الحالة",
          level: "المستوى",
          billing: "الدفع",
          category: "الفئة",
          commercial: "التجاري",
          tech: "الفني",
          refresh: "تحديث",
        }
      : {
          title: "Abonnement & suivi",
          pack: "Pack",
          status: "Statut",
          level: "Niveau",
          billing: "Facturation",
          category: "Categorie",
          commercial: "Commercial",
          tech: "Technicien",
          refresh: "Actualiser",
        };

  if (!tenantId) return null;

  return (
    <section className="mb-6 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white px-4 py-4 sm:px-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2 text-slate-800">
          <Shield className="text-indigo-600 shrink-0" size={18} />
          <h2 className="text-sm font-black tracking-tight">{t.title}</h2>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {t.refresh}
        </button>
      </div>

      {error ? <p className="text-xs font-semibold text-rose-600">{error}</p> : null}

      {loading && !data ? (
        <p className="text-xs text-slate-500">{locale === "ar" ? "جاري التحميل..." : "Chargement..."}</p>
      ) : data ? (
        <div className="flex flex-wrap gap-3 text-xs">
          <SummaryPill
            icon={<CreditCard size={14} />}
            label={t.pack}
            value={PACK_LABEL[data.subscription_pack] ? label(PACK_LABEL, data.subscription_pack, locale, data.subscription_pack) : data.subscription_pack || "—"}
            sub={data.subscription_offer || undefined}
            className={`min-w-[148px] flex-1 ${packAccentClass(data.subscription_pack)}`}
          />
          <StatusPill
            icon={<Shield size={14} />}
            label={t.status}
            value={label(STATUS_LABEL, data.status, locale, data.status)}
            status={data.status}
            className="min-w-[120px] flex-1"
          />
          <SummaryPill label={t.level} value={String(data.tenant_level)} className="min-w-[88px] flex-1" />
          <SummaryPill label={t.billing} value={PAYMENT_LABEL[data.payment_type] ? label(PAYMENT_LABEL, data.payment_type, locale, data.payment_type) : data.payment_type || "—"} className="min-w-[120px] flex-1" />
          <SummaryPill label={t.category} value={data.client_category || "—"} className="min-w-[88px] flex-1" />
          <SummaryPill icon={<UserCircle2 size={14} />} label={t.commercial} value={data.commercial_name || "—"} className="min-w-[140px] flex-1" />
          <SummaryPill icon={<Wrench size={14} />} label={t.tech} value={data.technician_name || "—"} className="min-w-[140px] flex-1" />
        </div>
      ) : null}
      {data && subscriptionProfileSparse(data) ? (
        <p className="mt-3 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
          {locale === "ar"
            ? "تبدو بعض بيانات الاشتراك أو المتابعة غير مكتملة. يمكن لفريق MQ إكمالها من لوحة الإدارة الداخلية ليصبح الملخص أوضح لك."
            : "Certaines informations d'abonnement ou de suivi semblent incompletes. Votre equipe MQ peut les completer depuis la console interne afin d'afficher un resume plus precis ici."}
        </p>
      ) : null}
      {data ? null : !error ? (
        <p className="text-xs text-slate-500">{locale === "ar" ? "لا توجد بيانات." : "Aucune donnee."}</p>
      ) : null}
    </section>
  );
}

function StatusPill({
  icon,
  label,
  value,
  status,
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  status: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-white/90 px-3 py-2.5 shadow-sm ${statusBadgeClass(status)} ${className}`}>
      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <p className="mt-1 font-black truncate" title={value}>
        {value}
      </p>
    </div>
  );
}

function SummaryPill({
  icon,
  label,
  value,
  sub,
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white/90 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ${className}`}>
      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
        {icon}
        {label}
      </div>
      <p className="mt-1 font-black text-slate-900 truncate" title={value}>
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[10px] text-slate-500 truncate" title={sub}>{sub}</p> : null}
    </div>
  );
}
