import Link from "next/link";
import { Pause, Play, Radio, RefreshCw, Shuffle, Sparkles, Volume2 } from "lucide-react";

import { PreviewMode } from "./playlist-studio.types";

interface CurrentTrackLike {
  id: string;
  title?: string;
}

export function PlaylistPreviewPanel({
  previewMode,
  currentTrack,
  summaryTracksCount,
  openingCount,
  cruiseCount,
  tenantId,
  isSaving,
  hasConfigId,
  onSetPreviewMode,
  onSave,
}: {
  previewMode: PreviewMode;
  currentTrack: CurrentTrackLike | null;
  summaryTracksCount: number;
  openingCount: number;
  cruiseCount: number;
  tenantId: string | null;
  isSaving: boolean;
  hasConfigId: boolean;
  onSetPreviewMode: (mode: PreviewMode) => void;
  onSave: () => void;
}) {
  return (
    <aside className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Preview live</p>
            <h3 className="mt-1 text-2xl font-black">Lecture simulée</h3>
          </div>
          <div className="rounded-full bg-white/10 p-3">
            <Radio size={18} />
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-white/5 p-5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            <Sparkles size={14} />
            {previewMode === "opening" ? "Phase d'initialisation" : previewMode === "cruise" ? "Phase de croisière" : "Interruption promo"}
          </div>

          <div className="mt-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Titre en cours</p>
            <p className="mt-2 text-2xl font-black">{currentTrack?.title || "Aucune piste"}</p>
            <p className="mt-2 text-sm text-slate-300">
              {previewMode === "opening" && "Lecture de l'ouverture avant le mode aléatoire."}
              {previewMode === "cruise" && "Randomisation de la playlist B après la fin de la phase A."}
              {previewMode === "interruption" && "Pause de la musique de fond, lecture du clip promo, puis reprise."}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onSetPreviewMode("opening")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-950 transition hover:opacity-90"
            >
              <Play size={14} />
              Ouverture
            </button>
            <button
              type="button"
              onClick={() => onSetPreviewMode("cruise")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-slate-700"
            >
              <Shuffle size={14} />
              Croisière
            </button>
            <button
              type="button"
              onClick={() => onSetPreviewMode("interruption")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-rose-400"
            >
              <Pause size={14} />
              Promo
            </button>
            <button
              type="button"
              onClick={() => onSetPreviewMode("opening")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="flex items-center justify-between rounded-[22px] bg-white/5 px-4 py-3">
            <span className="text-xs font-semibold text-slate-300">WebSocket listener</span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">Prêt</span>
          </div>
          <div className="flex items-center justify-between rounded-[22px] bg-white/5 px-4 py-3">
            <span className="text-xs font-semibold text-slate-300">Reprise background</span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white">Auto</span>
          </div>
          <div className="flex items-center justify-between rounded-[22px] bg-white/5 px-4 py-3">
            <span className="text-xs font-semibold text-slate-300">Fondu enchaîné</span>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white">Option future</span>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Résumé</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">Vue d'ensemble</h3>
          </div>
          <div className="rounded-full bg-slate-100 p-3 text-slate-700">
            <Volume2 size={18} />
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pistes actives</span>
              <span className="text-sm font-black text-slate-950">{summaryTracksCount}</span>
            </div>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Ouverture</span>
              <span className="text-sm font-black text-slate-950">{openingCount}</span>
            </div>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Croisière</span>
              <span className="text-sm font-black text-slate-950">{cruiseCount}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/tenant/${tenantId || ""}/display`}
            className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-indigo-600"
          >
            Retour display
          </Link>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {isSaving ? "Enregistrement..." : hasConfigId ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>
    </aside>
  );
}