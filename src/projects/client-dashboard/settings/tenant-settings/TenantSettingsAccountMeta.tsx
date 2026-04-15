"use client";

import { Building2, Fingerprint, Link2, Shield } from "lucide-react";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import type { TenantSettingsText } from "@/src/projects/client-dashboard/settings/tenant-settings/tenant-settings.constants";

const STATUS_FR: Record<string, string> = {
  pending: "En attente",
  active: "Actif",
  suspended: "Suspendu",
  trial: "Essai",
};

const STATUS_AR: Record<string, string> = {
  pending: "قيد المراجعة",
  active: "نشط",
  suspended: "موقوف",
  trial: "تجريبي",
};

export function TenantSettingsAccountMeta({
  text,
  locale,
}: {
  text: TenantSettingsText;
  locale: string;
}) {
  const formData = useSettingsStore((s) => s.formData);
  const isAr = locale === "ar";
  const statusMap = isAr ? STATUS_AR : STATUS_FR;
  const status = formData.status ? statusMap[formData.status] || formData.status : "—";

  return (
    <section className="mb-8 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/80 to-slate-100/60 p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-wrap items-center gap-2 text-slate-800">
        <Fingerprint className="text-indigo-600 shrink-0" size={20} />
        <h2 className="text-sm font-black tracking-tight uppercase text-slate-500">{text.accountReadOnlyTitle}</h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Building2 size={14} className="text-slate-500" />
            {text.labelTenantId}
          </div>
          <p className="mt-1 font-mono text-xs font-bold text-slate-800 break-all">{formData.id || "—"}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Link2 size={14} className="text-slate-500" />
            {text.labelSlug}
          </div>
          <p className="mt-1 text-sm font-black text-slate-900">@{formData.slug || "—"}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
            <Shield size={14} className="text-slate-500" />
            {text.labelStatus}
          </div>
          <p className="mt-1 text-sm font-black text-slate-900">{status}</p>
        </div>
      </div>
    </section>
  );
}
