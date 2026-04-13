import { Palette } from "lucide-react";

import { BrandingAdminOptions } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";
import { inputClassName } from "./admin-settings.constants";
import { ColorField, Field } from "./admin-settings.ui";
import { AdminBrandingState } from "./admin-settings.types";

interface BrandingSectionProps {
  branding: AdminBrandingState;
  options: BrandingAdminOptions;
  files: Record<string, File | null>;
  onFieldChange: (key: string, value: unknown) => void;
  onFilesChange: (updater: (prev: Record<string, File | null>) => Record<string, File | null>) => void;
}

export function BrandingSection({ branding, options, onFieldChange, onFilesChange }: BrandingSectionProps) {
  return (
    <div className="dashboard-surface p-5 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 text-slate-900 font-black text-lg">
        <Palette size={18} /> Branding principal
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nom application">
          <input value={branding.app_name || ""} onChange={(e) => onFieldChange("app_name", e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Nom court">
          <input value={branding.app_short_name || ""} onChange={(e) => onFieldChange("app_short_name", e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Tagline">
          <input value={branding.tagline || ""} onChange={(e) => onFieldChange("tagline", e.target.value)} className={inputClassName} />
        </Field>
        <Field label="Theme">
          <select value={branding.app_theme || "clean"} onChange={(e) => onFieldChange("app_theme", e.target.value)} className={inputClassName}>
            {options.app_themes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ColorField label="Primary" value={branding.primary_color} onChange={(value) => onFieldChange("primary_color", value)} />
        <ColorField label="Secondary" value={branding.secondary_color} onChange={(value) => onFieldChange("secondary_color", value)} />
        <ColorField label="Accent" value={branding.accent_color} onChange={(value) => onFieldChange("accent_color", value)} />
        <ColorField label="Background" value={branding.app_background_color} onChange={(value) => onFieldChange("app_background_color", value)} />
        <ColorField label="Text" value={branding.text_color} onChange={(value) => onFieldChange("text_color", value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Font latin">
          <select value={branding.latin_font_family || "Poppins"} onChange={(e) => onFieldChange("latin_font_family", e.target.value)} className={inputClassName}>
            {options.recommended_latin_fonts.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Font arabe">
          <select value={branding.arabic_font_family || "Cairo"} onChange={(e) => onFieldChange("arabic_font_family", e.target.value)} className={inputClassName}>
            {options.recommended_arabic_fonts.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
        <Field label="Font TV">
          <select value={branding.tv_font_family || "Cairo"} onChange={(e) => onFieldChange("tv_font_family", e.target.value)} className={inputClassName}>
            {options.recommended_tv_fonts.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Logo">
          <input type="file" accept="image/*" onChange={(e) => onFilesChange((prev) => ({ ...prev, logo: e.target.files?.[0] || null }))} className={`${inputClassName} file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-black file:text-white`} />
        </Field>
        <Field label="Favicon">
          <input type="file" accept="image/*" onChange={(e) => onFilesChange((prev) => ({ ...prev, favicon: e.target.files?.[0] || null }))} className={`${inputClassName} file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-black file:text-white`} />
        </Field>
      </div>
    </div>
  );
}