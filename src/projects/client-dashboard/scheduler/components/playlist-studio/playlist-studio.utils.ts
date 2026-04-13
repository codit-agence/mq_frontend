import { PLAYLIST_DAYS } from "./playlist-studio.constants";
import { PlaylistPlan } from "./playlist-studio.types";

export function businessDayIndex(date = new Date()) {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function emptyPlan(): PlaylistPlan {
  return { opening: [], cruise: [] };
}

export function normalizePlan(trackIds: string[], plan?: PlaylistPlan | null): PlaylistPlan {
  const opening = (plan?.opening || []).filter((id) => trackIds.includes(id));
  const cruise = (plan?.cruise || []).filter((id) => trackIds.includes(id));
  const seen = new Set([...opening, ...cruise]);
  const fallback = trackIds.filter((id) => !seen.has(id));

  return {
    opening: Array.from(new Set(opening.length > 0 ? opening : trackIds.slice(0, 1))),
    cruise: Array.from(new Set([...cruise, ...fallback].filter((id) => !opening.includes(id)))),
  };
}

export function buildDefaultPlans(trackIds: string[]) {
  return PLAYLIST_DAYS.reduce<Record<number, PlaylistPlan>>((acc, _, index) => {
    const base = normalizePlan(trackIds, emptyPlan());
    acc[index] = {
      opening: [...base.opening],
      cruise: [...base.cruise],
    };
    return acc;
  }, {});
}

export function moveItem(list: string[], fromIndex: number, toIndex: number) {
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  if (!item) return next;
  next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
  return next;
}