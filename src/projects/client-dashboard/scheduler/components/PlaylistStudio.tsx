"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Music2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAudioStore } from "../store/audio.store";
import { useSchedulerStore } from "../store/schedule.store";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { PlaylistConfigResponse, PlaylistService } from "../services/playlist.service";
import { PlaylistBucketsPanel } from "./playlist-studio/PlaylistBucketsPanel";
import { PLAYLIST_DAYS } from "./playlist-studio/playlist-studio.constants";
import { PlaylistPreviewPanel } from "./playlist-studio/PlaylistPreviewPanel";
import { PlaylistSchedulesPanel } from "./playlist-studio/PlaylistSchedulesPanel";
import { PlaylistStudioHeader } from "./playlist-studio/PlaylistStudioHeader";
import { PlaylistBucket, PlaylistDragState, PlaylistPlan, PreviewMode } from "./playlist-studio/playlist-studio.types";
import { buildDefaultPlans, businessDayIndex, emptyPlan, moveItem, normalizePlan } from "./playlist-studio/playlist-studio.utils";

export default function PlaylistStudio({ tenantId: tenantIdProp }: { tenantId?: string }) {
  const params = useParams<{ tenantId?: string }>();
  const { tenant } = useAuthStore();
  const { tracks, fetchTracks } = useAudioStore();
  const { schedules, fetchSchedules } = useSchedulerStore();

  const tenantId = tenantIdProp || params?.tenantId || tenant?.id || null;

  const [selectedDay, setSelectedDay] = useState<number>(businessDayIndex());
  const [previewMode, setPreviewMode] = useState<PreviewMode>("opening");
  const [configId, setConfigId] = useState<string | null>(null);
  const [configName, setConfigName] = useState("Playlist principale");
  const [interruptMode, setInterruptMode] = useState("resume");
  const [crossfadeSeconds, setCrossfadeSeconds] = useState(2);
  const [listener, setListener] = useState("websocket");
  const [plans, setPlans] = useState<Record<number, PlaylistPlan>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dragging, setDragging] = useState<PlaylistDragState | null>(null);

  useEffect(() => {
    fetchTracks();
    fetchSchedules();
  }, [fetchTracks, fetchSchedules]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config: PlaylistConfigResponse = await PlaylistService.getConfig(tenantId);
        setConfigId(config.id);
        setConfigName(config.name || "Playlist principale");
        setSelectedDay(Number(config.active_day ?? businessDayIndex()));
        setInterruptMode(config.plan?.interrupt?.mode || "resume");
        setCrossfadeSeconds(Number(config.plan?.interrupt?.crossfade_seconds ?? 2));
        setListener(config.plan?.interrupt?.listener || "websocket");

        const dayPlans = config.plan?.days || {};
        const trackIds = tracks.map((track) => track.id);
        const merged = buildDefaultPlans(trackIds);
        PLAYLIST_DAYS.forEach((_, index) => {
          const raw = dayPlans[String(index)] || emptyPlan();
          merged[index] = normalizePlan(trackIds, raw);
        });
        setPlans(merged);
      } catch (error) {
        const trackIds = tracks.map((track) => track.id);
        setPlans(buildDefaultPlans(trackIds));
        console.warn("Playlist config non trouvée, on initialise par défaut.", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tracks.length >= 0) {
      loadConfig();
    }
  }, [tracks, tenantId]);

  const trackIds = useMemo(() => tracks.map((track) => track.id), [tracks]);

  useEffect(() => {
    if (!Object.keys(plans).length || !trackIds.length) return;
    setPlans((previous) => {
      const next: Record<number, PlaylistPlan> = {};
      PLAYLIST_DAYS.forEach((_, index) => {
        next[index] = normalizePlan(trackIds, previous[index]);
      });
      return next;
    });
  }, [trackIds]);

  const dayPlan = plans[selectedDay] || emptyPlan();

  const openingTracks = useMemo(
    () => dayPlan.opening.map((id) => tracks.find((track) => track.id === id)).filter(Boolean),
    [dayPlan.opening, tracks]
  );
  const cruiseTracks = useMemo(
    () => dayPlan.cruise.map((id) => tracks.find((track) => track.id === id)).filter(Boolean),
    [dayPlan.cruise, tracks]
  );

  const currentTrack = useMemo(() => {
    if (previewMode === "opening") return openingTracks[0] || cruiseTracks[0] || null;
    if (previewMode === "cruise") return cruiseTracks[0] || openingTracks[0] || null;
    return { id: "promo-demo", title: "Clip promo", file: "" };
  }, [cruiseTracks, openingTracks, previewMode]);

  const daySchedules = useMemo(
    () => schedules.filter((schedule) => (schedule.days_of_week || []).includes(selectedDay)),
    [schedules, selectedDay]
  );

  const updateDayPlan = (updater: (plan: PlaylistPlan) => PlaylistPlan) => {
    setPlans((previous) => {
      const base = previous[selectedDay] || emptyPlan();
      const updated = updater(base);
      return {
        ...previous,
        [selectedDay]: normalizePlan(trackIds, updated),
      };
    });
  };

  const moveAcrossBuckets = (trackId: string, targetBucket: PlaylistBucket) => {
    updateDayPlan((plan) => {
      const opening = plan.opening.filter((id) => id !== trackId);
      const cruise = plan.cruise.filter((id) => id !== trackId);
      return targetBucket === "opening"
        ? { opening: [...opening, trackId], cruise }
        : { opening, cruise: [...cruise, trackId] };
    });
  };

  const reorderBucket = (bucket: PlaylistBucket, fromIndex: number, toIndex: number) => {
    updateDayPlan((plan) => ({
      opening: bucket === "opening" ? moveItem(plan.opening, fromIndex, toIndex) : plan.opening,
      cruise: bucket === "cruise" ? moveItem(plan.cruise, fromIndex, toIndex) : plan.cruise,
    }));
  };

  const handleDrop = (bucket: PlaylistBucket, targetIndex: number) => {
    if (!dragging) return;
    updateDayPlan((plan) => {
      if (dragging.bucket === bucket) {
        const source = bucket === "opening" ? [...plan.opening] : [...plan.cruise];
        const [item] = source.splice(dragging.index, 1);
        if (!item) return plan;
        const insertIndex = dragging.index < targetIndex ? targetIndex - 1 : targetIndex;
        source.splice(Math.max(0, Math.min(insertIndex, source.length)), 0, item);
        return bucket === "opening"
          ? { opening: source, cruise: plan.cruise }
          : { opening: plan.opening, cruise: source };
      }

      const source = dragging.bucket === "opening" ? [...plan.opening] : [...plan.cruise];
      const target = bucket === "opening" ? [...plan.opening] : [...plan.cruise];
      const [item] = source.splice(dragging.index, 1);
      if (!item) return plan;
      target.splice(targetIndex, 0, item);
      return bucket === "opening"
        ? { opening: target, cruise: source }
        : { opening: source, cruise: target };
    });
    setDragging(null);
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const payload = {
        name: configName.trim() || "Playlist principale",
        active_day: selectedDay,
        plan: {
          days: Object.fromEntries(
            PLAYLIST_DAYS.map((_, index) => [
              String(index),
              normalizePlan(trackIds, plans[index] || emptyPlan()),
            ])
          ),
          interrupt: {
            mode: interruptMode,
            crossfade_seconds: crossfadeSeconds,
            listener,
          },
        },
      };
      const saved = await PlaylistService.saveConfig(payload, tenantId);
      setConfigId(saved.id);
      toast.success("Playlist enregistrée");
    } catch (error) {
      console.error(error);
      toast.error("Impossible d'enregistrer la playlist");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 md:p-10 bg-slate-50">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Chargement playlist</p>
          <div className="mt-4 h-3 w-40 rounded-full bg-slate-100" />
          <div className="mt-3 h-3 w-64 rounded-full bg-slate-100" />
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-48 rounded-[28px] bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const summaryTracks = tracks.filter((track) => dayPlan.opening.includes(track.id) || dayPlan.cruise.includes(track.id));

  return (
    <div className="space-y-8 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="rounded-[36px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              <Music2 size={14} />
              Playlist Studio
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Ouverture, croisière et interruption promo.
              </h2>
              <p className="mt-3 max-w-3xl text-sm md:text-base leading-7 text-slate-500">
                Playlist A au démarrage, playlist B en croisière aléatoire, et gestion d’interruption via WebSocket.
                Le tout reste maintenant enregistré côté backend.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Phase 1</p>
              <p className="mt-2 text-lg font-black text-slate-950">Playlist A</p>
              <p className="text-xs text-slate-500">Ouverture</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Phase 2</p>
              <p className="mt-2 text-lg font-black text-slate-950">Playlist B</p>
              <p className="text-xs text-slate-500">Random / croisière</p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Listener</p>
              <p className="mt-2 text-lg font-black text-slate-950">Interruption</p>
              <p className="text-xs text-slate-500">Promo / reprise</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="space-y-6">
          <PlaylistStudioHeader
            configName={configName}
            selectedDay={selectedDay}
            days={PLAYLIST_DAYS}
            daySchedulesCount={daySchedules.length}
            openingCount={dayPlan.opening.length}
            cruiseCount={dayPlan.cruise.length}
            onConfigNameChange={setConfigName}
            onSelectDay={setSelectedDay}
          />

          <PlaylistBucketsPanel
            openingTracks={openingTracks as Array<{ id: string; title?: string; file?: string }>}
            cruiseTracks={cruiseTracks as Array<{ id: string; title?: string; file?: string }>}
            onMoveAcrossBuckets={moveAcrossBuckets}
            onReorderBucket={reorderBucket}
            onDrop={handleDrop}
            onDragStart={setDragging}
            onDragEnd={() => setDragging(null)}
          />

          <PlaylistSchedulesPanel daySchedules={daySchedules} />
        </div>

        <PlaylistPreviewPanel
          previewMode={previewMode}
          currentTrack={currentTrack}
          summaryTracksCount={summaryTracks.length}
          openingCount={dayPlan.opening.length}
          cruiseCount={dayPlan.cruise.length}
          tenantId={tenantId}
          isSaving={isSaving}
          hasConfigId={Boolean(configId)}
          onSetPreviewMode={setPreviewMode}
          onSave={saveConfig}
        />
      </div>
    </div>
  );
}
