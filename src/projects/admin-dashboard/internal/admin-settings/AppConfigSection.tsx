import { ServerCrash } from "lucide-react";

import { BrandingAdminOptions } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";
import { inputClassName } from "./admin-settings.constants";
import { Field } from "./admin-settings.ui";
import { AdminBrandingState } from "./admin-settings.types";

export function AppConfigSection({
  branding,
  options,
  onFieldChange,
}: {
  branding: AdminBrandingState;
  options: BrandingAdminOptions;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="dashboard-surface p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
        <ServerCrash size={18} /> Config generale app
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Langue par defaut">
          <select value={branding.default_language || "fr"} onChange={(e) => onFieldChange("default_language", e.target.value)} className={inputClassName}>
            {options.languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Layout login">
          <select value={branding.login_layout || "split"} onChange={(e) => onFieldChange("login_layout", e.target.value)} className={inputClassName}>
            {options.login_layouts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
        <Field label="Support email">
          <input value={branding.support_email || ""} onChange={(e) => onFieldChange("support_email", e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Support telephone">
          <input value={branding.support_phone || ""} onChange={(e) => onFieldChange("support_phone", e.target.value)} className={inputClassName} />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={Boolean(branding.maintenance_mode)} onChange={(e) => onFieldChange("maintenance_mode", e.target.checked)} className="mr-3" />
          Maintenance active
        </label>
        <label className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
          <input type="checkbox" checked={Boolean(branding.rtl_enabled)} onChange={(e) => onFieldChange("rtl_enabled", e.target.checked)} className="mr-3" />
          RTL active
        </label>
      </div>

      <Field label="Message maintenance">
        <textarea value={branding.maintenance_message || ""} onChange={(e) => onFieldChange("maintenance_message", e.target.value)} className={`${inputClassName} min-h-28`} />
      </Field>
    </div>
  );
}