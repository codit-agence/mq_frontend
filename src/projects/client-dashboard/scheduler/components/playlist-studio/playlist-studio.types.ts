export type PlaylistBucket = "opening" | "cruise";
export type PreviewMode = "opening" | "cruise" | "interruption";

export interface PlaylistPlan {
  opening: string[];
  cruise: string[];
}

export interface PlaylistDragState {
  bucket: PlaylistBucket;
  index: number;
}