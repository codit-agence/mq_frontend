"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock3,
  Copy,
  ListMusic,
  Music2,
  Plus,
  Repeat,
  Save,
  Shuffle,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";

import {
  PlaylistConfigResponse,
  PlaylistConfigPayload,
  PlaylistService,
  PlaylistTimeSlot,
} from "../services/playlist.service";
import { useAudioStore } from "../store/audio.store";
import { PLAYLIST_DAYS } from "./playlist-studio/playlist-studio.constants";

type AudioTrackLite = {
  id: string;
  title: string;
  file: string;
  duration?: number;
  category?: string;
  track_type?: string;
};

type DaySlotsMap = Record<number, PlaylistTimeSlot[]>;

const DEFAULT_CATEGORY = "JAZZ";
const DEFAULT_TRACK_TYPE = "MUSIC";

function businessDayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function emptyDays(): DaySlotsMap {
  return Object.fromEntries(PLAYLIST_DAYS.map((_, index) => [index, []])) as DaySlotsMap;
}

function makeSlot(partial?: Partial<PlaylistTimeSlot>): PlaylistTimeSlot {
  return {
    id: partial?.id || crypto.randomUUID(),
    start_time: partial?.start_time || "08:00",
    end_time: partial?.end_time || "12:00",
    category: partial?.category || DEFAULT_CATEGORY,
    track_type: partial?.track_type || DEFAULT_TRACK_TYPE,
    play_mode: partial?.play_mode || "repeat",
    repeat_count: partial?.repeat_count ?? 1,
    notes: partial?.notes || "",
  };
}

function normalizeSlot(slot: Partial<PlaylistTimeSlot>): PlaylistTimeSlot {
  return makeSlot({
    ...slot,
    repeat_count: Math.max(1, Number(slot.repeat_count ?? 1)),
  });
}

function sortSlots(slots: PlaylistTimeSlot[]) {
  return [...slots].sort((a, b) => a.start_time.localeCompare(b.start_time));
}

function normalizeDays(raw: unknown, tracks: AudioTrackLite[]): DaySlotsMap {
  const base = emptyDays();
  const categoryByTrackId = new Map(tracks.map((t) => [t.id, t.category || DEFAULT_CATEGORY]));
  const typeByTrackId = new Map(tracks.map((t) => [t.id, t.track_type || DEFAULT_TRACK_TYPE]));

  if (!raw || typeof raw !== "object") return base;

  const days = raw as Record<string, unknown>;
  PLAYLIST_DAYS.forEach((_, index) => {
    const day = days[String(index)];
    if (Array.isArray(day)) {
      base[index] = sortSlots(day.map((slot) => normalizeSlot(slot as Partial<PlaylistTimeSlot>)));
      return;
    }

    if (day && typeof day === "object") {
      const legacy = day as { opening?: string[]; cruise?: string[] };
      const slots: PlaylistTimeSlot[] = [];
      if (legacy.opening?.length) {
        const first = legacy.opening[0];
        slots.push(
          makeSlot({
            start_time: "08:00",
            end_time: "12:00",
            category: categoryByTrackId.get(first) || DEFAULT_CATEGORY,
            track_type: typeByTrackId.get(first) || DEFAULT_TRACK_TYPE,
            play_mode: "repeat",
            repeat_count: Math.max(1, legacy.opening.length),
            notes: "Importé depuis l'ancienne playlist d'ouverture.",
          })
        );
      }
      if (legacy.cruise?.length) {
        const first = legacy.cruise[0];
        slots.push(
          makeSlot({
            start_time: "12:00",
            end_time: "23:00",
            category: categoryByTrackId.get(first) || DEFAULT_CATEGORY,
            track_type: typeByTrackId.get(first) || DEFAULT_TRACK_TYPE,
            play_mode: "shuffle",
            repeat_count: 1,
            notes: "Importé depuis l'ancienne playlist croisière.",
          })
        );
      }
      base[index] = sortSlots(slots);
    }
  });

  return base;
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-slate-400";

export default function PlaylistStudio({ tenantId: tenantIdProp }: { tenantId?: string }) {
  const params = useParams<{ tenantId?: string }>();
  const { tenant } = useAuthStore();
  const { tracks, fetchTracks } = useAudioStore();
  const tenantId = tenantIdProp || params?.tenantId || tenant?.id || null;

  const [selectedDay, setSelectedDay] = useState<number>(businessDayIndex());
  const [configId, setConfigId] = useState<string | null>(null);
  const [configName, setConfigName] = useState("Playlist principale");
  const [plans, setPlans] = useState<DaySlotsMap>(emptyDays());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTracks(tenantId);
  }, [fetchTracks, tenantId]);

  const typedTracks = tracks as AudioTrackLite[];

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config: PlaylistConfigResponse = await PlaylistService.getConfig(tenantId);
        setConfigId(config.id);
        setConfigName(config.name || "Playlist principale");
        setSelectedDay(Number(config.active_day ?? businessDayIndex()));
        setPlans(normalizeDays(config.plan?.days, typedTracks));
      } catch (error) {
        setPlans(emptyDays());
        console.warn("Playlist config non trouvée, initialisation du planning.", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId) {
      loadConfig();
    }
  }, [tenantId, typedTracks]);

  const categories = useMemo(
    () => Array.from(new Set(typedTracks.map((track) => track.category).filter(Boolean))).sort(),
    [typedTracks]
  );
  const trackTypes = useMemo(
    () => Array.from(new Set(typedTracks.map((track) => track.track_type).filter(Boolean))).sort(),
    [typedTracks]
  );
  const daySlots = sortSlots(plans[selectedDay] || []);

  const updateSlotsForDay = (dayIndex: number, slots: PlaylistTimeSlot[]) => {
    setPlans((previous) => ({
      ...previous,
      [dayIndex]: sortSlots(slots.map(normalizeSlot)),
    }));
  };

  const patchSlot = (slotId: string, patch: Partial<PlaylistTimeSlot>) => {
    updateSlotsForDay(
      selectedDay,
      daySlots.map((slot) => (slot.id === slotId ? normalizeSlot({ ...slot, ...patch }) : slot))
    );
  };

  const addSlot = () => {
    const lastSlot = daySlots[daySlots.length - 1];
    const nextStart = lastSlot?.end_time || "08:00";
    updateSlotsForDay(selectedDay, [
      ...daySlots,
      makeSlot({
        start_time: nextStart,
        end_time: nextStart < "20:00" ? "23:00" : "23:59",
        category: categories[0] || DEFAULT_CATEGORY,
        track_type: trackTypes[0] || DEFAULT_TRACK_TYPE,
      }),
    ]);
  };

  const duplicateToAllWeek = () => {
    setPlans(() =>
      Object.fromEntries(
        PLAYLIST_DAYS.map((_, index) => [
          index,
          daySlots.map((slot) => makeSlot({ ...slot })),
        ])
      ) as DaySlotsMap
    );
    toast.success("Planning du jour dupliqué sur toute la semaine");
  };

  const removeSlot = (slotId: string) => {
    updateSlotsForDay(
      selectedDay,
      daySlots.filter((slot) => slot.id !== slotId)
    );
  };

  const moveSlot = (slotId: string, direction: -1 | 1) => {
    const index = daySlots.findIndex((slot) => slot.id === slotId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= daySlots.length) return;
    const next = [...daySlots];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    updateSlotsForDay(selectedDay, next);
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const payload: PlaylistConfigPayload = {
        name: configName.trim() || "Playlist principale",
        active_day: selectedDay,
        plan: {
          version: 2,
          days: Object.fromEntries(
            PLAYLIST_DAYS.map((_, index) => [
              String(index),
              sortSlots((plans[index] || []).map(normalizeSlot)),
            ])
          ),
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

  const availableByCategory = useMemo(
    () =>
      categories.map((category) => ({
        category,
        tracks: typedTracks.filter((track) => (track.category || DEFAULT_CATEGORY) === category),
      })),
    [categories, typedTracks]
  );

  const summary = useMemo(() => {
    const usedCategories = new Set(daySlots.map((slot) => slot.category));
    const repeatSlots = daySlots.filter((slot) => slot.play_mode === "repeat").length;
    const shuffleSlots = daySlots.filter((slot) => slot.play_mode === "shuffle").length;
    return {
      totalSlots: daySlots.length,
      usedCategories: usedCategories.size,
      repeatSlots,
      shuffleSlots,
    };
  }, [daySlots]);

  const selectedCategoryTracks = useMemo(() => {
    const categoriesForDay = Array.from(new Set(daySlots.map((slot) => slot.category)));
    return typedTracks.filter((track) => categoriesForDay.includes(track.category || DEFAULT_CATEGORY));
  }, [daySlots, typedTracks]);

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

  return (
    <div className="space-y-8 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="rounded-[36px] border border-slate-200 bg-white p-6 md:p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white">
              <Music2 size={14} />
              Playlist Designer
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950">
                Programme musical par créneaux et par catégorie.
              </h2>
              <p className="mt-3 max-w-3xl text-sm md:text-base leading-7 text-slate-500">
                Définis la musique selon les heures de la journée : par exemple 08:00 à 12:00 catégorie A en boucle,
                puis 12:00 à 18:00 catégorie B en mode aléatoire. Le planning est enregistré par jour de la semaine.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ConceptCard title="Créneaux" value="Matin / midi / soir" />
            <ConceptCard title="Sélection" value="Catégorie + type" />
            <ConceptCard title="Lecture" value="Boucle ou aléatoire" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Configuration</p>
                <input
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-black text-slate-950 outline-none focus:border-slate-400"
                  placeholder="Nom de la playlist"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {PLAYLIST_DAYS.map((day, index) => {
                  const active = selectedDay === index;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(index)}
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition ${
                        active ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={<Clock3 size={14} />} label="Créneaux" value={summary.totalSlots} />
              <MetricCard icon={<ListMusic size={14} />} label="Catégories" value={summary.usedCategories} />
              <MetricCard icon={<Repeat size={14} />} label="Boucles" value={summary.repeatSlots} />
              <MetricCard icon={<Shuffle size={14} />} label="Aléatoire" value={summary.shuffleSlots} />
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Planning du jour</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">
                  {PLAYLIST_DAYS[selectedDay]} · créneaux de diffusion musicale
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addSlot}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white"
                >
                  <Plus size={14} />
                  Ajouter un créneau
                </button>
                <button
                  type="button"
                  onClick={duplicateToAllWeek}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700"
                >
                  <Copy size={14} />
                  Appliquer à la semaine
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {daySlots.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Aucun créneau défini</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Commence par ajouter une plage horaire pour définir quelle catégorie joue et comment elle se répète.
                  </p>
                </div>
              ) : (
                daySlots.map((slot, index) => {
                  const matchingTracks = typedTracks.filter(
                    (track) =>
                      (track.category || DEFAULT_CATEGORY) === slot.category &&
                      (track.track_type || DEFAULT_TRACK_TYPE) === slot.track_type
                  );

                  return (
                    <div
                      key={slot.id}
                      className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 md:p-5 shadow-sm"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                              Créneau {index + 1}
                            </p>
                            <p className="mt-1 text-lg font-black text-slate-950">
                              {slot.start_time} - {slot.end_time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => moveSlot(slot.id, -1)}
                              className="rounded-full bg-white p-2 text-slate-500"
                              title="Monter"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSlot(slot.id, 1)}
                              className="rounded-full bg-white p-2 text-slate-500"
                              title="Descendre"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSlot(slot.id)}
                              className="rounded-full bg-rose-50 p-2 text-rose-600"
                              title="Supprimer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
                          <Field label="Début">
                            <input
                              type="time"
                              value={slot.start_time}
                              onChange={(e) => patchSlot(slot.id, { start_time: e.target.value })}
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Fin">
                            <input
                              type="time"
                              value={slot.end_time}
                              onChange={(e) => patchSlot(slot.id, { end_time: e.target.value })}
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Catégorie">
                            <select
                              value={slot.category}
                              onChange={(e) => patchSlot(slot.id, { category: e.target.value })}
                              className={inputClass}
                            >
                              {(categories.length ? categories : [DEFAULT_CATEGORY]).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Type">
                            <select
                              value={slot.track_type}
                              onChange={(e) => patchSlot(slot.id, { track_type: e.target.value })}
                              className={inputClass}
                            >
                              {(trackTypes.length ? trackTypes : [DEFAULT_TRACK_TYPE]).map((trackType) => (
                                <option key={trackType} value={trackType}>
                                  {trackType}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label="Lecture">
                            <select
                              value={slot.play_mode}
                              onChange={(e) =>
                                patchSlot(slot.id, { play_mode: e.target.value as PlaylistTimeSlot["play_mode"] })
                              }
                              className={inputClass}
                            >
                              <option value="repeat">Repeat</option>
                              <option value="shuffle">Shuffle</option>
                            </select>
                          </Field>
                          <Field label="Répétitions">
                            <input
                              type="number"
                              min={1}
                              max={99}
                              value={slot.repeat_count}
                              disabled={slot.play_mode !== "repeat"}
                              onChange={(e) => patchSlot(slot.id, { repeat_count: Number(e.target.value || 1) })}
                              className={`${inputClass} disabled:opacity-50`}
                            />
                          </Field>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
                          <div className="rounded-[22px] bg-white p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Note opérationnelle</p>
                            <textarea
                              value={slot.notes || ""}
                              onChange={(e) => patchSlot(slot.id, { notes: e.target.value })}
                              placeholder="Ex: ambiance petit-déjeuner, volume doux, clientèle business."
                              className="mt-3 h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                            />
                          </div>

                          <div className="rounded-[22px] bg-white p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Aperçu de la sélection</p>
                            <p className="mt-2 text-sm font-black text-slate-950">
                              {matchingTracks.length} piste(s) pour {slot.category} / {slot.track_type}
                            </p>
                            <div className="mt-3 space-y-2">
                              {matchingTracks.slice(0, 4).map((track) => (
                                <div key={track.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                                  {track.title}
                                </div>
                              ))}
                              {matchingTracks.length === 0 && (
                                <p className="rounded-2xl bg-amber-50 px-3 py-3 text-sm text-amber-700">
                                  Aucune piste disponible pour ce couple catégorie / type.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Résumé live</p>
                <h3 className="mt-1 text-2xl font-black">Lecture de la journée</h3>
              </div>
              <div className="rounded-full bg-white/10 p-3">
                <CalendarDays size={18} />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {daySlots.map((slot) => (
                <div key={slot.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-300">
                        {slot.start_time} - {slot.end_time}
                      </p>
                      <p className="mt-1 text-lg font-black">{slot.category}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {slot.play_mode === "repeat" ? `Repeat x${slot.repeat_count}` : "Shuffle"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{slot.track_type}</p>
                </div>
              ))}
              {daySlots.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                  Aucun créneau configuré pour ce jour.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Bibliothèque disponible</p>
                <h3 className="mt-1 text-xl font-black text-slate-950">Catégories assignées</h3>
              </div>
              <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                <ListMusic size={18} />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {availableByCategory.map((group) => (
                <div key={group.category} className="rounded-[24px] bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-950">{group.category}</span>
                    <span className="text-xs font-semibold text-slate-500">{group.tracks.length} pistes</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.tracks.slice(0, 3).map((track) => (
                      <span key={track.id} className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600">
                        {track.title}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {!availableByCategory.length && (
                <div className="rounded-[24px] bg-slate-50 p-4 text-sm text-slate-500">
                  Aucune piste audio disponible pour ce tenant.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/dashboard/tenant/${tenantId || ""}/display`}
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-indigo-600"
              >
                Retour display
              </Link>
              <button
                type="button"
                onClick={saveConfig}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-emerald-400 disabled:opacity-60"
              >
                <Save size={14} />
                {isSaving ? "Enregistrement..." : configId ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>

            {selectedCategoryTracks.length > 0 && (
              <div className="mt-6 rounded-[24px] border border-slate-200 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Impact du jour</p>
                <p className="mt-2 text-sm text-slate-600">
                  {selectedCategoryTracks.length} piste(s) potentiellement jouées aujourd’hui sur les catégories planifiées.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[24px] bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function ConceptCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-50 px-5 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{title}</p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}
