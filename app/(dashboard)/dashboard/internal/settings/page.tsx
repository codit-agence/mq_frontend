"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Globe, Palette, Save, ServerCrash, ShieldCheck, Wifi } from "lucide-react";
import { adminConfigService, AdminSystemStatus, BrandingAdminOptions } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { getAccessToken } from "@/src/core/ws/authToken";
import { wsUrl } from "@/src/core/ws/buildWsUrl";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewBranding, previewNetworkChecks, previewOptions, previewStatus } from "@/src/projects/admin-dashboard/internal/preview/internal-settings.preview";
import { AppConfigSection } from "@/src/projects/admin-dashboard/internal/admin-settings/AppConfigSection";
import { BrandingSection } from "@/src/projects/admin-dashboard/internal/admin-settings/BrandingSection";
import { CmsHomeSection } from "@/src/projects/admin-dashboard/internal/admin-settings/CmsHomeSection";
import { DiagnosticsPanel } from "@/src/projects/admin-dashboard/internal/admin-settings/DiagnosticsPanel";
import { SystemStatusPanel } from "@/src/projects/admin-dashboard/internal/admin-settings/SystemStatusPanel";
import { apiBaseUrl } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.constants";
import { MetricCard } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.ui";
import { parseCmsEditorValue, serializeCmsValue } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.utils";
import { AdminBrandingState, CmsEditorKey, NetworkProbe } from "@/src/projects/admin-dashboard/internal/admin-settings/admin-settings.types";

export default function InternalSettingsPage() {
  const { user } = useAuthStore();
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [branding, setBranding] = useState<AdminBrandingState | null>(null);
  const [options, setOptions] = useState<BrandingAdminOptions | null>(null);
  const [status, setStatus] = useState<AdminSystemStatus | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({
    logo: null,
    logo_dark: null,
    favicon: null,
    login_background: null,
  });
  const [networkChecks, setNetworkChecks] = useState<NetworkProbe[]>([]);
  const [networkLoading, setNetworkLoading] = useState(false);
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
      setOptions(previewOptions);
      setStatus(previewStatus);
      setNetworkChecks(previewNetworkChecks);
      setForbidden(false);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setForbidden(false);
      try {
        const [brandingData, optionsData, statusData] = await Promise.all([
          adminConfigService.getBranding(),
          adminConfigService.getBrandingOptions(),
          adminConfigService.getSystemStatus(),
        ]);
        setBranding(brandingData);
        setOptions(optionsData);
        setStatus(statusData);
      } catch (error: any) {
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setForbidden(true);
        }
        console.error("Admin config error", error);
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

  const canAccess = previewMode || (Boolean(user?.is_staff || user?.is_superuser) && !forbidden);

  const updateField = (key: string, value: unknown) => {
    setBranding((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateCmsEditor = (key: CmsEditorKey, value: string) => {
    setCmsEditors((prev) => ({ ...prev, [key]: value }));
    setCmsErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const activeLanguages = useMemo(() => branding?.active_languages || ["fr", "ar"], [branding]);

  const runNetworkChecks = async () => {
    if (previewMode) {
      setNetworkLoading(true);
      setNetworkChecks(previewNetworkChecks);
      setNetworkLoading(false);
      return;
    }

    const probes = [
      { key: "branding-public", label: "Branding public", url: `${apiBaseUrl}/branding/public` },
      { key: "auth-me", label: "Auth /me", url: `${apiBaseUrl}/auth/me` },
      { key: "admin-system", label: "Admin system", url: `${apiBaseUrl}/internal/admin/system-status` },
    ];

    setNetworkLoading(true);
    try {
      const results = await Promise.all(
        probes.map(async (probe) => {
          const started = performance.now();
          try {
            const response = await fetch(probe.url, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
              },
            });
            const durationMs = Math.round(performance.now() - started);
            return {
              key: probe.key,
              label: probe.label,
              ok: response.ok,
              durationMs,
              detail: `HTTP ${response.status}`,
            };
          } catch (error: any) {
            return {
              key: probe.key,
              label: probe.label,
              ok: false,
              durationMs: Math.round(performance.now() - started),
              detail: error?.message || "Echec reseau",
            };
          }
        })
      );
      setNetworkChecks(results);
    } finally {
      setNetworkLoading(false);
    }
  };

  const runWebsocketCheck = async () => {
    if (previewMode) {
      setNetworkChecks((prev) => [
        ...prev.filter((item) => item.key !== "ws-notifications"),
        {
          key: "ws-notifications",
          label: "WebSocket notifications",
          ok: true,
          durationMs: 21,
          detail: "Preview WebSocket simulee.",
        },
      ]);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setNetworkChecks((prev) => [
        ...prev.filter((item) => item.key !== "ws-notifications"),
        {
          key: "ws-notifications",
          label: "WebSocket notifications",
          ok: false,
          durationMs: 0,
          detail: "Token absent pour tester la socket.",
        },
      ]);
      return;
    }

    const started = performance.now();

    await new Promise<void>((resolve) => {
      let settled = false;
      const socket = new WebSocket(`${wsUrl("/ws/notifications/")}?token=${encodeURIComponent(token)}`);

      const finish = (ok: boolean, detail: string) => {
        if (settled) return;
        settled = true;
        const durationMs = Math.round(performance.now() - started);
        try {
          socket.close();
        } catch {
          // ignore close failure
        }
        setNetworkChecks((prev) => [
          ...prev.filter((item) => item.key !== "ws-notifications"),
          {
            key: "ws-notifications",
            label: "WebSocket notifications",
            ok,
            durationMs,
            detail,
          },
        ]);
        resolve();
      };

      const timer = window.setTimeout(() => finish(false, "Timeout ouverture WebSocket"), 5000);

      socket.onopen = () => {
        window.clearTimeout(timer);
        finish(true, "Connexion WebSocket ouverte.");
      };

      socket.onerror = () => {
        window.clearTimeout(timer);
        finish(false, "Erreur ouverture WebSocket.");
      };

      socket.onclose = (event) => {
        if (!settled) {
          window.clearTimeout(timer);
          finish(event.wasClean, `Socket fermee (${event.code})`);
        }
      };
    });
  };

  const saveBranding = async () => {
    if (!branding) return;
    if (previewMode) {
      alert("Mode preview actif: la sauvegarde est desactivee tant que l'auth admin n'est pas utilisee.");
      return;
    }

    const parsedCmsEntries = (Object.keys(cmsEditors) as CmsEditorKey[]).reduce((acc, key) => {
      const parsed = parseCmsEditorValue(key, cmsEditors[key]);
      if (!parsed.ok) {
        acc.errors[key] = parsed.error;
        return acc;
      }
      acc.values[key] = parsed.value;
      return acc;
    }, {
      values: {} as Record<CmsEditorKey, unknown[]>,
      errors: {} as Partial<Record<CmsEditorKey, string>>,
    });

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
      const updated = await adminConfigService.updateBranding(payload, files);
      setBranding(updated);
      setFiles({ logo: null, logo_dark: null, favicon: null, login_background: null });
    } catch (error) {
      console.error("Branding save failed", error);
      alert("Impossible d'enregistrer la configuration branding.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-sm font-black uppercase tracking-[0.2em] text-slate-400">Chargement admin config...</div>;
  }

  if (!canAccess || !branding || !options || !status) {
    return (
      <div className="p-6 md:p-10">
        <div className="rounded-[32px] border border-rose-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-black text-rose-600">Acces admin requis</h1>
          <p className="mt-3 text-sm text-slate-600">Cette page est reservee aux comptes staff ou superuser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {previewMode ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <p className="font-black uppercase tracking-[0.2em] text-[10px]">Preview interne</p>
          <p className="mt-2">Cette page est ouverte sans login uniquement pour revue du contenu. Les donnees et diagnostics affiches ici sont simules.</p>
        </section>
      ) : null}

      <section className="dashboard-surface p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-white">
              <ShieldCheck size={14} /> Admin App Config
            </div>
            <h1 className="mt-3 text-2xl md:text-4xl font-black tracking-tight text-slate-950">
              Configuration globale QALYAS
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Branding, maintenance, langues actives, diagnostic reseau et etat applicatif central.
            </p>
          </div>
          <button
            type="button"
            onClick={saveBranding}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Enregistrement..." : "Publier la config"}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MetricCard icon={<Activity size={16} />} label="Environnement" value={status.environment} />
        <MetricCard icon={<Globe size={16} />} label="Langue par defaut" value={status.default_language} />
        <MetricCard icon={<Wifi size={16} />} label="Docker" value={status.docker_detected ? "Detecte" : "Non detecte"} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="space-y-6">
          <BrandingSection branding={branding} options={options} files={files} onFieldChange={updateField} onFilesChange={setFiles} />

          <AppConfigSection branding={branding} options={options} onFieldChange={updateField} />

          <CmsHomeSection branding={branding} cmsEditors={cmsEditors} cmsErrors={cmsErrors} onFieldChange={updateField} onCmsEditorChange={updateCmsEditor} />
        </div>

        <div className="space-y-6">
          <DiagnosticsPanel status={status} networkChecks={networkChecks} networkLoading={networkLoading} onRunNetworkChecks={runNetworkChecks} onRunWebsocketCheck={runWebsocketCheck} />

          <SystemStatusPanel status={status} />
        </div>
      </section>
    </div>
  );
}
