import { ArrowUpDown, MoveVertical } from "lucide-react";

import { PlaylistBucket, PlaylistDragState } from "./playlist-studio.types";

interface PlaylistTrackLike {
  id: string;
  title?: string;
  file?: string;
}

interface PlaylistBucketsPanelProps {
  openingTracks: PlaylistTrackLike[];
  cruiseTracks: PlaylistTrackLike[];
  onMoveAcrossBuckets: (trackId: string, targetBucket: PlaylistBucket) => void;
  onReorderBucket: (bucket: PlaylistBucket, fromIndex: number, toIndex: number) => void;
  onDrop: (bucket: PlaylistBucket, targetIndex: number) => void;
  onDragStart: (dragState: PlaylistDragState) => void;
  onDragEnd: () => void;
}

const bucketSections = [
  { bucket: "opening" as const, title: "Playlist A - Ouverture", description: "Lecture d'accueil avant la croisière." },
  { bucket: "cruise" as const, title: "Playlist B - Croisière", description: "Lecture aléatoire après la phase A." },
];

export function PlaylistBucketsPanel({
  openingTracks,
  cruiseTracks,
  onMoveAcrossBuckets,
  onReorderBucket,
  onDrop,
  onDragStart,
  onDragEnd,
}: PlaylistBucketsPanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {bucketSections.map((section) => {
        const list = section.bucket === "opening" ? openingTracks : cruiseTracks;
        return (
          <div
            key={section.bucket}
            className="rounded-[32px] border border-slate-200 bg-white p-5 md:p-6"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onDrop(section.bucket, list.length);
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">{section.title}</p>
                <p className="mt-1 text-sm text-slate-500">{section.description}</p>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                {list.length} pistes
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {list.map((track, index) => (
                <div
                  key={track.id}
                  draggable
                  onDragStart={() => onDragStart({ bucket: section.bucket, index })}
                  onDragEnd={onDragEnd}
                  onDrop={(event) => {
                    event.preventDefault();
                    onDrop(section.bucket, index);
                  }}
                  onDragOver={(event) => event.preventDefault()}
                  className="group flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 hover:border-slate-300 hover:bg-slate-100 transition"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                      <MoveVertical size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-950">{track.title}</p>
                      <p className="truncate text-[11px] text-slate-500">{track.file}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onMoveAcrossBuckets(track.id, section.bucket === "opening" ? "cruise" : "opening")}
                      className="rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 hover:bg-slate-900 hover:text-white transition"
                    >
                      Basculer
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorderBucket(section.bucket, index, Math.max(0, index - 1))}
                      className="rounded-full bg-white p-2 text-slate-500 hover:bg-slate-900 hover:text-white transition"
                      title="Monter"
                    >
                      <ArrowUpDown size={14} className="rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Aucune piste dans cette phase</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}