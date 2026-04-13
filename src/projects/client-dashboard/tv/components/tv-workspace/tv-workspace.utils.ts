export const normalizeTemplate = (value?: string) => {
  if (!value) return "tvplayer";
  if (value === "classic") return "tvplayer";
  if (value === "grid" || value === "video_focus" || value === "focus") return "display";
  return value;
};