import {
  InternalScreenStats,
  InternalScreenRow,
  InternalScreenFilterOptions,
} from "@/src/projects/admin-dashboard/internal/services/internal-screens.service";

export const previewScreenStats: InternalScreenStats = {
  total_screens: 156,
  online_screens: 142,
  offline_screens: 12,
  screens_by_status: [
    { status: "online", count: 142 },
    { status: "offline", count: 12 },
    { status: "error", count: 2 },
  ],
  screens_by_resolution: [
    { resolution: "1920x1080", count: 98 },
    { resolution: "3840x2160", count: 34 },
    { resolution: "1024x768", count: 16 },
    { resolution: "2560x1440", count: 8 },
  ],
};

export const previewScreensRows: InternalScreenRow[] = [
  {
    id: "screen_01",
    code: "SCR-001",
    name: "Ecran Casablanca - Hall Principal",
    tenant_id: "tenant_a",
    tenant_name: "Restaurant Luxe Casablanca",
    status: "online",
    resolution: "1920x1080",
    last_heartbeat: new Date().toISOString(),
    ip_address: "192.168.1.10",
    os_info: "Android 11",
    player_version: "v2.5.1",
    screen_group: "Salle Principal",
    location: "Hall Central",
    brightness: 85,
    volume: 70,
    battery_level: undefined,
    storage_free: 8500,
    memory_available: 2048,
    cpu_usage: 32,
    temperature: 48,
    error_count: 0,
    uptime_seconds: 864000,
  },
  {
    id: "screen_02",
    code: "SCR-002",
    name: "Ecran Rabat - Terrasse",
    tenant_id: "tenant_b",
    tenant_name: "Cafe Modern Rabat",
    status: "online",
    resolution: "3840x2160",
    last_heartbeat: new Date().toISOString(),
    ip_address: "192.168.1.11",
    os_info: "Android 12",
    player_version: "v2.5.1",
    screen_group: "Terrasse",
    location: "Zone Ouest",
    brightness: 92,
    volume: 65,
    battery_level: undefined,
    storage_free: 15000,
    memory_available: 4096,
    cpu_usage: 28,
    temperature: 52,
    error_count: 0,
    uptime_seconds: 604800,
  },
  {
    id: "screen_03",
    code: "SCR-003",
    name: "Ecran Marrakech - Lobby",
    tenant_id: "tenant_a",
    tenant_name: "Restaurant Luxe Casablanca",
    status: "offline",
    resolution: "1920x1080",
    last_heartbeat: new Date(Date.now() - 3600000).toISOString(),
    ip_address: "192.168.1.12",
    os_info: "Android 11",
    player_version: "v2.5.0",
    screen_group: "Lobby",
    location: "Accueil",
    brightness: 0,
    volume: 0,
    battery_level: undefined,
    storage_free: 0,
    memory_available: 0,
    cpu_usage: 0,
    temperature: 35,
    error_count: 1,
    uptime_seconds: 0,
  },
  {
    id: "screen_04",
    code: "SCR-004",
    name: "Ecran Tangier - Restaurant",
    tenant_id: "tenant_c",
    tenant_name: "Bar & Restaurant Tanger",
    status: "online",
    resolution: "1920x1080",
    last_heartbeat: new Date().toISOString(),
    ip_address: "192.168.1.13",
    os_info: "Android 12",
    player_version: "v2.5.1",
    screen_group: "Restaurant",
    location: "Zone Diner",
    brightness: 88,
    volume: 72,
    battery_level: undefined,
    storage_free: 9200,
    memory_available: 2560,
    cpu_usage: 35,
    temperature: 50,
    error_count: 0,
    uptime_seconds: 432000,
  },
];

export const previewScreenFilterOptions: InternalScreenFilterOptions = {
  statuses: [
    { value: "online", label: "En ligne" },
    { value: "offline", label: "Hors ligne" },
    { value: "error", label: "Erreur" },
  ],
  resolutions: [
    { value: "1920x1080", label: "Full HD (1920x1080)" },
    { value: "3840x2160", label: "4K (3840x2160)" },
    { value: "1024x768", label: "XGA (1024x768)" },
    { value: "2560x1440", label: "2K (2560x1440)" },
  ],
  screen_groups: [
    { value: "Salle Principal", label: "Salle Principal" },
    { value: "Terrasse", label: "Terrasse" },
    { value: "Lobby", label: "Lobby" },
    { value: "Restaurant", label: "Restaurant" },
    { value: "Bar", label: "Bar" },
  ],
};

export function filterPreviewScreenRows(
  rows: InternalScreenRow[],
  filters: {
    search?: string;
    status?: string;
    resolution?: string;
    screen_group?: string;
  }
): InternalScreenRow[] {
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
    if (filters.resolution && row.resolution !== filters.resolution) return false;
    if (filters.screen_group && row.screen_group !== filters.screen_group) return false;
    return true;
  });
}
