"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, Globe2, Newspaper, Rows3, Save, Sparkles } from "lucide-react";
import { cmsEditorLabels, inputClassName } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.constants";
import { AdminBrandingState, CmsEditorKey } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.types";
import { Field, MetricCard } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.ui";
import { parseCmsEditorValue, serializeCmsValue } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.utils";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewBranding } from "@/src/projects/admin-dashboard/internal/preview/internal-settings.preview";
import { adminConfigService } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";
import { CockpitHero, PreviewModeBanner } from "@/src/projects/admin-dashboard/shared/cockpit-ui";
import { isInternalAccount } from "@/src/projects/client-dashboard/account/auth-routing";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";

const cmsKeys = Object.keys(cmsEditorLabels) as CmsEditorKey[];

function getArrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getPreviewExcerpt(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) {
    return "Aucune entree pour le moment.";
  }

  const serialized = JSON.stringify(value[0]);
  return serialized.length > 140 ? `${serialized.slice(0, 137)}...` : serialized;
}

export default function InternalContentPage() {
  const { user, tenant } = useAuthStore();
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [branding, setBranding] = useState<AdminBrandingState | null>(null);
  const [cmsEditors, setCmsEditors] = useState<Record<CmsEditorKey, string>>({
    site_navigation: "[]",
    site_services: "[]",
    site_offers: "[]",
    site_highlights: "[]",
    site_hero_slides: "[]",
  });
  const [cmsErrors, setCmsErrors] = useState<Partial<Record<CmsEditorKey, string>>>({});

  useEffect(() => {
    if (previewMode) {
      setBranding(previewBranding);
      setForbidden(false);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setForbidden(false);
      try {
        const brandingData = await adminConfigService.getBranding();
        setBranding(brandingData);
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setForbidden(true);
        }
        console.error("Internal content load error", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [previewMode]);

  useEffect(() => {
    if (!branding) return;

    setCmsEditors({
      site_navigation: serializeCmsValue(branding.site_navigation),
      site_services: serializeCmsValue(branding.site_services),
      site_offers: serializeCmsValue(branding.site_offers),
      site_highlights: serializeCmsValue(branding.site_highlights),
      site_hero_slides: serializeCmsValue(branding.site_hero_slides),
    });
    setCmsErrors({});
  }, [branding]);

  const canAccess = previewMode || (isInternalAccount({ user, tenant }) && !forbidden);
  const activeLanguages = useMemo(() => branding?.active_languages || ["fr", "ar"], [branding]);

  const metrics = useMemo(() => {
    if (!branding) {
      return [];
    }

    return [
      { icon: <Rows3 size={16} />, label: "Navigation", value: String(getArrayValue(branding.site_navigation).length) },
      { icon: <Sparkles size={16} />, label: "Services", value: String(getArrayValue(branding.site_services).length) },
      { icon: <FileText size={16} />, label: "Offres", value: String(getArrayValue(branding.site_offers).length) },
      { icon: <Globe2 size={16} />, label: "Slides hero", value: String(getArrayValue(branding.site_hero_slides).length) },
    ];
  }, [branding]);

  const updateField = (key: string, value: unknown) => {
    setBranding((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateCmsEditor = (key: CmsEditorKey, value: string) => {
    setCmsEditors((prev) => ({ ...prev, [key]: value }));
    setCmsErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const saveContent = async () => {
    if (!branding) return;
    if (previewMode) {
      alert("Mode preview actif: la sauvegarde est desactivee sans authentification admin reelle.");
      return;
    }

    const parsedCmsEntries = cmsKeys.reduce(
      (acc, key) => {
        const parsed = parseCmsEditorValue(key, cmsEditors[key]);
        if (!parsed.ok) {
          acc.errors[key] = parsed.error;
          return acc;
        }

        acc.values[key] = parsed.value;
        return acc;
      },
      {
        values: {} as Record<CmsEditorKey, unknown[]>,
        errors: {} as Partial<Record<CmsEditorKey, string>>,
      }
    );

    if (Object.keys(parsedCmsEntries.errors).length > 0) {
      setCmsErrors(parsedCmsEntries.errors);
      alert("Certains blocs CMS contiennent un JSON invalide. Corrigez les champs indiques avant de publier.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        app_name: branding.app_name,
        app_short_name: branding.app_short_name,
        tagline: branding.tagline,
        primary_color: branding.primary_color,
        secondary_color: branding.secondary_color,
        accent_color: branding.accent_color,
        app_background_color: branding.app_background_color,
        text_color: branding.text_color,
        border_radius_px: Number(branding.border_radius_px || 14),
        app_theme: branding.app_theme,
        latin_font_family: branding.latin_font_family,
        arabic_font_family: branding.arabic_font_family,
        tv_font_family: branding.tv_font_family,
        default_language: branding.default_language,
        active_languages: activeLanguages,
        rtl_enabled: Boolean(branding.rtl_enabled),
        login_title: branding.login_title,
        login_subtitle: branding.login_subtitle,
        login_layout: branding.login_layout,
        show_register_button: Boolean(branding.show_register_button),
        show_forgot_password: Boolean(branding.show_forgot_password),
        home_badge: branding.home_badge,
        home_blog_label: branding.home_blog_label,
        site_navigation: parsedCmsEntries.values.site_navigation,
        site_services: parsedCmsEntries.values.site_services,
        site_offers: parsedCmsEntries.values.site_offers,
        site_highlights: parsedCmsEntries.values.site_highlights,
        site_hero_slides: parsedCmsEntries.values.site_hero_slides,
        maintenance_mode: Boolean(branding.maintenance_mode),
        maintenance_message: branding.maintenance_message,
        support_email: branding.support_email,
        support_phone: branding.support_phone,
        seo_meta_title: branding.seo_meta_title,
        seo_meta_description: branding.seo_meta_description,
      };

      const updated = await adminConfigService.updateBranding(payload);
      setBranding(updated);
    } catch (error) {
      console.error("Internal content save failed", error);
      alert("Impossible d'enregistrer le contenu public.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Chargement content admin...</div>;
  }

  if (!canAccess || !branding) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-[32px] border border-rose-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-rose-600">Acces admin requis</h1>
          <p className="mt-3 text-sm text-slate-600">Cette page est reservee aux comptes internes et au mode preview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {previewMode ? (
        <PreviewModeBanner>Cette page montre le cockpit content sans login reel. Les donnees affichees sont simulees.</PreviewModeBanner>
      ) : null}

      <CockpitHero
        badge={<><Newspaper size={14} /> Content control</>}
        title="Pilotage editorial du site public"
        description="Cette zone gere le contenu deja servi par l'API branding: badge home, label blog, navigation, services, offres, highlights et hero slides."
        actions={
          <>
            <Link href="/dashboard/internal/settings" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100">
              Voir config app
            </Link>
            <button
              type="button"
              onClick={saveContent}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              <Save size={15} />
              {saving ? "Publication..." : "Publier le contenu"}
            </button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {metrics.map((item) => (
          <MetricCard key={item.label} icon={item.icon} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="dashboard-surface space-y-5 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Globe2 size={18} /> Identite editoriale
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Badge home">
                <input value={branding.home_badge || ""} onChange={(e) => updateField("home_badge", e.target.value)} className={inputClassName} />
              </Field>
              <Field label="Label blog">
                <input value={branding.home_blog_label || ""} onChange={(e) => updateField("home_blog_label", e.target.value)} className={inputClassName} />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Langue par defaut">
                <input value={branding.default_language || "fr"} onChange={(e) => updateField("default_language", e.target.value)} className={inputClassName} />
              </Field>
              <Field label="Langues actives">
                <input value={activeLanguages.join(", ")} readOnly className={inputClassName} />
              </Field>
            </div>
          </div>

          <div className="dashboard-surface space-y-5 p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Rows3 size={18} /> Blocs CMS publics
            </div>
            <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-600">
              Le backend attend encore des tableaux JSON pour chaque zone editoriale. Cette page reste volontairement honnete: pas de faux editeur blog tant que l'API n'existe pas.
            </p>

            {cmsKeys.map((key) => (
              <Field key={key} label={cmsEditorLabels[key]}>
                <textarea
                  value={cmsEditors[key]}
                  onChange={(e) => updateCmsEditor(key, e.target.value)}
                  className={`${inputClassName} min-h-44 font-mono text-xs leading-6`}
                  spellCheck={false}
                />
                {cmsErrors[key] ? <p className="text-xs font-semibold text-rose-600">{cmsErrors[key]}</p> : null}
              </Field>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-surface p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Sparkles size={18} /> Lecture metier
            </div>
            <div className="mt-5 space-y-3">
              {cmsKeys.map((key) => (
                <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-slate-900">{cmsEditorLabels[key]}</p>
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                      {getArrayValue(branding[key]).length} items
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-slate-600">{getPreviewExcerpt(branding[key])}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-surface p-5 sm:p-6">
            <div className="flex items-center gap-2 text-lg font-black text-slate-900">
              <FileText size={18} /> Couverture actuelle
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
              <p>Ce domaine couvre deja l'accueil public, les offres et les highlights.</p>
              <p>Le blog editorial complet reste a venir tant qu'aucun endpoint dedie articles/categories n'est expose.</p>
              <p>Les assets medias restent pilotes ailleurs: il n'existe pas encore de vraie banque media globale pour le contenu.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}