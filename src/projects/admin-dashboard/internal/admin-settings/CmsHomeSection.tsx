import { Globe } from "lucide-react";

import { cmsEditorLabels, inputClassName } from "./admin-settings.constants";
import { Field } from "./admin-settings.ui";
import { AdminBrandingState, CmsEditorKey } from "./admin-settings.types";

interface CmsHomeSectionProps {
  branding: AdminBrandingState;
  cmsEditors: Record<CmsEditorKey, string>;
  cmsErrors: Partial<Record<CmsEditorKey, string>>;
  onFieldChange: (key: string, value: unknown) => void;
  onCmsEditorChange: (key: CmsEditorKey, value: string) => void;
}

export function CmsHomeSection({ branding, cmsEditors, cmsErrors, onFieldChange, onCmsEditorChange }: CmsHomeSectionProps) {
  return (
    <div className="dashboard-surface p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
        <Globe size={18} /> CMS accueil public
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Badge home">
          <input value={branding.home_badge || ""} onChange={(e) => onFieldChange("home_badge", e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Label blog">
          <input value={branding.home_blog_label || ""} onChange={(e) => onFieldChange("home_blog_label", e.target.value)} className={inputClassName} />
        </Field>
      </div>

      <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
        Les blocs ci-dessous pilotent la home publique bilingue. Chaque champ attend un JSON de type tableau pour garder un format souple tant que le CMS n'a pas encore d'editeur structure plus fin.
      </p>

      {(Object.keys(cmsEditorLabels) as CmsEditorKey[]).map((key) => (
        <Field key={key} label={cmsEditorLabels[key]}>
          <textarea
            value={cmsEditors[key]}
            onChange={(e) => onCmsEditorChange(key, e.target.value)}
            className={`${inputClassName} min-h-52 font-mono text-xs leading-6`}
            spellCheck={false}
          />
          {cmsErrors[key] ? <p className="text-xs font-semibold text-rose-600">{cmsErrors[key]}</p> : null}
        </Field>
      ))}
    </div>
  );
}