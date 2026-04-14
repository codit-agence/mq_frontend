import {
  InternalPlaylistStats,
  InternalPlaylistRow,
  InternalPlaylistFilterOptions,
} from "@/src/projects/admin-dashboard/internal/services/internal-playlists.service";

export const previewPlaylistStats: InternalPlaylistStats = {
  total_playlists: 47,
  active_playlists: 38,
  playlists_by_status: [
    { status: "active", count: 38 },
    { status: "paused", count: 6 },
    { status: "archived", count: 3 },
  ],
  total_items: 342,
  items_by_type: [
    { type: "image", count: 156 },
    { type: "video", count: 124 },
    { type: "html", count: 42 },
    { type: "template", count: 20 },
  ],
};

export const previewPlaylistsRows: InternalPlaylistRow[] = [
  {
    id: "playlist_01",
    code: "PL-001",
    name: "Menu Principal - Jour",
    description: "Playlist principale pour la journée avec menu et promotions",
    tenant_id: "tenant_a",
    tenant_name: "Restaurant Luxe Casablanca",
    status: "active",
    items_count: 12,
    screens_count: 3,
    duration_seconds: 300,
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-04-13T14:30:00Z",
    scheduling_type: "time_based",
    scheduling_start: "06:00:00",
    scheduling_end: "18:00:00",
    playback_mode: "loop",
    auto_advance: true,
    interval_seconds: 25,
  },
  {
    id: "playlist_02",
    code: "PL-002",
    name: "Menu Soiree - 18h a Minuit",
    description: "Playlist soirée avec offres spéciales et ambiance",
    tenant_id: "tenant_a",
    tenant_name: "Restaurant Luxe Casablanca",
    status: "active",
    items_count: 8,
    screens_count: 3,
    duration_seconds: 240,
    created_at: "2026-03-16T10:00:00Z",
    updated_at: "2026-04-12T22:15:00Z",
    scheduling_type: "time_based",
    scheduling_start: "18:00:00",
    scheduling_end: "23:59:59",
    playback_mode: "loop",
    auto_advance: true,
    interval_seconds: 30,
  },
  {
    id: "playlist_03",
    code: "PL-003",
    name: "Promotions Speciales",
    description: "Playlist pour promotions exceptionnelles et events",
    tenant_id: "tenant_b",
    tenant_name: "Cafe Modern Rabat",
    status: "paused",
    items_count: 5,
    screens_count: 2,
    duration_seconds: 180,
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-04-10T16:45:00Z",
    scheduling_type: "continuous",
    playback_mode: "shuffle",
    auto_advance: false,
  },
  {
    id: "playlist_04",
    code: "PL-004",
    name: "Contenu Statique - Terrasse",
    description: "Images statiques pour terrasse - faible cpu",
    tenant_id: "tenant_b",
    tenant_name: "Cafe Modern Rabat",
    status: "active",
    items_count: 15,
    screens_count: 1,
    duration_seconds: 450,
    created_at: "2026-02-20T10:00:00Z",
    updated_at: "2026-04-13T09:00:00Z",
    scheduling_type: "time_based",
    scheduling_start: "07:00:00",
    scheduling_end: "22:00:00",
    playback_mode: "sequence",
    auto_advance: true,
    interval_seconds: 30,
  },
];

export const previewPlaylistFilterOptions: InternalPlaylistFilterOptions = {
  statuses: [
    { value: "active", label: "Actif" },
    { value: "paused", label: "Pause" },
    { value: "archived", label: "Archive" },
  ],
  item_types: [
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "html", label: "HTML" },
    { value: "template", label: "Template" },
  ],
  scheduling_types: [
    { value: "continuous", label: "Continu" },
    { value: "time_based", label: "Horaire" },
    { value: "date_range", label: "Periode" },
  ],
  playback_modes: [
    { value: "sequence", label: "Sequence" },
    { value: "shuffle", label: "Aleatoire" },
    { value: "loop", label: "Boucle" },
  ],
};

export function filterPreviewPlaylistRows(
  rows: InternalPlaylistRow[],
  filters: {
    search?: string;
    status?: string;
    tenant_id?: string;
    scheduling_type?: string;
  }
): InternalPlaylistRow[] {
  return rows.filter((row) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !row.name.toLowerCase().includes(searchLower) &&
        !row.code.toLowerCase().includes(searchLower) &&
        !row.tenant_name.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (filters.status && row.status !== filters.status) return false;
    if (filters.tenant_id && row.tenant_id !== filters.tenant_id) return false;
    if (filters.scheduling_type && row.scheduling_type !== filters.scheduling_type) return false;
    return true;
  });
}
