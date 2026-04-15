"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Layers3, LayoutTemplate, MonitorSmartphone, PlaySquare, RefreshCw, ShieldAlert, Tv, Zap } from "lucide-react";
import { useInternalPreviewMode } from "@/src/projects/admin-dashboard/internal/hooks/useInternalPreviewMode";
import { previewPlaylistStats, previewPlaylistsRows } from "@/src/projects/admin-dashboard/internal/preview/internal-playlists.preview";
import { previewScreenStats, previewScreensRows } from "@/src/projects/admin-dashboard/internal/preview/internal-screens.preview";
import { previewTemplateStats, previewTemplatesRows } from "@/src/projects/admin-dashboard/internal/preview/internal-templates.preview";
import { internalPlaylistsService, InternalPlaylistRow, InternalPlaylistStats } from "@/src/projects/admin-dashboard/internal/services/internal-playlists.service";
import { internalScreensService, InternalScreenRow, InternalScreenStats } from "@/src/projects/admin-dashboard/internal/services/internal-screens.service";
import { internalTemplatesService, InternalTemplateRow, InternalTemplateStats } from "@/src/projects/admin-dashboard/internal/services/internal-templates.service";
import { CockpitHero, CockpitSectionHeading, CockpitStatCard, PreviewModeBanner } from "@/src/projects/admin-dashboard/shared/cockpit-ui";

type RegieState = {
  screenStats: InternalScreenStats | null;
  playlistStats: InternalPlaylistStats | null;
  templateStats: InternalTemplateStats | null;
  screens: InternalScreenRow[];
  playlists: InternalPlaylistRow[];
  templates: InternalTemplateRow[];
};

const initialState: RegieState = {
  screenStats: null,
  playlistStats: null,
  templateStats: null,
  screens: [],
  playlists: [],
  templates: [],
};

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

export default function InternalRegieTvPage() {
  const { previewMode } = useInternalPreviewMode();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [state, setState] = useState<RegieState>(initialState);

  const loadData = async () => {
    if (previewMode) {
      setState({
        screenStats: previewScreenStats,
        playlistStats: previewPlaylistStats,
        templateStats: previewTemplateStats,
        screens: previewScreensRows,
        playlists: previewPlaylistsRows,
        templates: previewTemplatesRows,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [screenStats, screenRows, playlistStats, playlistRows, templateStats, templateRows] = await Promise.all([
        internalScreensService.getStats(),
        internalScreensService.getScreens(),
        internalPlaylistsService.getStats(),
        internalPlaylistsService.getPlaylists(),
        internalTemplatesService.getStats(),
        internalTemplatesService.getTemplates(),
      ]);

      setState({
        screenStats,
        playlistStats,
        templateStats,
        screens: screenRows.results,
        playlists: playlistRows.results,
        templates: templateRows.results,
      });
    } catch (error) {
      console.error("Load regie tv error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [previewMode]);

  const offlineScreens = useMemo(() => state.screens.filter((screen) => screen.status !== "online").slice(0, 5), [state.screens]);
  const activePlaylists = useMemo(() => state.playlists.filter((playlist) => playlist.status === "active").slice(0, 5), [state.playlists]);
  const topTemplates = useMemo(() => [...state.templates].sort((left, right) => right.usage_count - left.usage_count).slice(0, 4), [state.templates]);

  const summaryCards = [
    {
      label: "Parc ecrans",
      value: String(state.screenStats?.total_screens ?? 0),
      hint: `${state.screenStats?.online_screens ?? 0} en ligne`,
      icon: <MonitorSmartphone size={18} />,
    },
    {
      label: "Playlists actives",
      value: String(state.playlistStats?.active_playlists ?? 0),
      hint: `${state.playlistStats?.total_items ?? 0} items diffuses`,
      icon: <PlaySquare size={18} />,
    },
    {
      label: "Templates",
      value: String(state.templateStats?.total_templates ?? 0),
      hint: `${state.templateStats?.total_variants ?? 0} variantes`,
      icon: <LayoutTemplate size={18} />,
    },
    {
      label: "Incidents",
      value: String(offlineScreens.length),
      hint: offlineScreens.length > 0 ? "Ecrans a traiter" : "Aucun point critique", 
      icon: <ShieldAlert size={18} />,
    },
  ];

  const averagePlaylistDuration = state.playlists.length > 0
    ? formatSeconds(Math.round(state.playlists.reduce((total, playlist) => total + playlist.duration_seconds, 0) / state.playlists.length))
    : "0m 0s";

  const activeResolutions = state.screenStats?.screens_by_resolution.slice(0, 3) ?? [];
  const templateCategories = state.templateStats?.templates_by_category.slice(0, 4) ?? [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {previewMode ? (
        <PreviewModeBanner>Le cockpit Regie TV s'appuie sur des donnees simulees tant que le mode preview est actif.</PreviewModeBanner>
      ) : null}

      <CockpitHero
        badge={<><Tv size={14} /> Regie TV</>}
        title="Cockpit de diffusion, supervision et production d'ecrans."
        description="Cette page rassemble la lecture operationnelle du parc, des playlists et des templates. Elle sert d'entree metier avant les vues detaillees, sans masquer les incidents ni diluer les priorites."
        actions={
          <>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Actualisation..." : "Actualiser"}
            </button>
            <Link href="/dashboard/internal/screens" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-slate-800">
              Ouvrir supervision detaillee
              <ArrowRight size={14} />
            </Link>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <CockpitStatCard key={card.label} label={card.label} value={card.value} hint={card.hint} icon={card.icon} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="dashboard-surface p-6">
            <CockpitSectionHeading eyebrow="Priorites terrain" title="Ecrans qui demandent une action" action={<Link href="/dashboard/internal/screens" className="text-xs font-black uppercase tracking-[0.16em] text-slate-300 hover:text-white">Voir tous les ecrans</Link>} />

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Chargement des incidents...</div>
              ) : offlineScreens.length === 0 ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">Aucun ecran offline ou en erreur dans l'echantillon charge.</div>
              ) : (
                offlineScreens.map((screen) => (
                  <div key={screen.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-white">{screen.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{screen.tenant_name} • {screen.code}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${screen.status === "error" ? "bg-rose-500/15 text-rose-200" : "bg-amber-500/15 text-amber-100"}`}>
                        {screen.status}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                      <p>Groupe: <span className="font-black text-white">{screen.screen_group || "-"}</span></p>
                      <p>Resolution: <span className="font-black text-white">{screen.resolution || "-"}</span></p>
                      <p>Temperature: <span className="font-black text-white">{screen.temperature ?? 0}°C</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="dashboard-surface p-6">
              <div className="flex items-center gap-2 text-lg font-black text-white">
                <Layers3 size={18} /> Diffusion active
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {state.playlistStats?.active_playlists ?? 0} playlists actives, duree moyenne {averagePlaylistDuration}.
              </p>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="text-sm text-slate-400">Chargement playlists...</div>
                ) : activePlaylists.length === 0 ? (
                  <div className="text-sm text-slate-400">Aucune playlist active chargee.</div>
                ) : (
                  activePlaylists.map((playlist) => (
                    <div key={playlist.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-sm font-black text-white">{playlist.name}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{playlist.tenant_name}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                        <span className="rounded-full bg-slate-800 px-3 py-1">{playlist.items_count} items</span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">{playlist.screens_count} ecrans</span>
                        <span className="rounded-full bg-slate-800 px-3 py-1">{formatSeconds(playlist.duration_seconds)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/dashboard/internal/playlists" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                Ouvrir playlists
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="dashboard-surface p-6">
              <div className="flex items-center gap-2 text-lg font-black text-white">
                <LayoutTemplate size={18} /> Assets templates
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {state.templateStats?.total_templates ?? 0} templates actifs, {state.templateStats?.total_variants ?? 0} variantes disponibles.
              </p>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <div className="text-sm text-slate-400">Chargement templates...</div>
                ) : topTemplates.length === 0 ? (
                  <div className="text-sm text-slate-400">Aucun template charge.</div>
                ) : (
                  topTemplates.map((template) => (
                    <div key={template.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-white">{template.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">{template.category} • {template.resolution}</p>
                        </div>
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-200">{template.usage_count} usages</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <Link href="/dashboard/internal/templates" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-200">
                Ouvrir templates
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <Zap size={18} /> Lecture rapide
            </div>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <p>Le backend couvre deja la supervision d'ecrans, la gestion de playlists et les templates avec duplication.</p>
              <p>Le cockpit centralise les signaux prioritaires, puis laisse les actions detaillees aux modules specialises.</p>
              <p>Les actions remote existent cote ecrans, mais cette page reste volontairement non destructive: elle oriente avant d'agir.</p>
            </div>
          </div>

          <div className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <AlertTriangle size={18} /> Repartition technique
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Resolutions principales</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeResolutions.map((entry) => (
                    <span key={entry.resolution} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black text-slate-200">
                      {entry.resolution} • {entry.count}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Categories templates</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {templateCategories.map((entry) => (
                    <span key={entry.category} className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-black text-slate-200">
                      {entry.category} • {entry.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-surface p-6">
            <div className="flex items-center gap-2 text-lg font-black text-white">
              <ArrowRight size={18} /> Acces directs
            </div>
            <div className="mt-5 grid gap-3">
              <Link href="/dashboard/internal/screens" className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm font-black text-white hover:border-slate-700">
                Supervision ecrans
              </Link>
              <Link href="/dashboard/internal/playlists" className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm font-black text-white hover:border-slate-700">
                Gestion playlists
              </Link>
              <Link href="/dashboard/internal/templates" className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-4 text-sm font-black text-white hover:border-slate-700">
                Gestion templates
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}