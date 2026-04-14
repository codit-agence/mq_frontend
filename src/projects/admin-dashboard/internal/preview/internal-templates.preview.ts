import {
  InternalTemplateStats,
  InternalTemplateRow,
  InternalTemplateFilterOptions,
} from "@/src/projects/admin-dashboard/internal/services/internal-templates.service";

export const previewTemplateStats: InternalTemplateStats = {
  total_templates: 24,
  templates_by_category: [
    { category: "Menu", count: 8 },
    { category: "Promotions", count: 6 },
    { category: "Live Data", count: 5 },
    { category: "Slides", count: 5 },
  ],
  templates_by_resolution: [
    { resolution: "1920x1080", count: 16 },
    { resolution: "3840x2160", count: 5 },
    { resolution: "1024x768", count: 3 },
  ],
  total_variants: 68,
};

export const previewTemplatesRows: InternalTemplateRow[] = [
  {
    id: "template_01",
    code: "TPL-MENU-001",
    name: "Classic Menu Board",
    description: "Template classique de menu avec 4 sections",
    category: "Menu",
    resolution: "1920x1080",
    variants_count: 3,
    is_active: true,
    is_system: true,
    created_at: "2026-01-10T10:00:00Z",
    updated_at: "2026-04-05T14:00:00Z",
    usage_count: 12,
    recommended_duration_seconds: 25,
  },
  {
    id: "template_02",
    code: "TPL-MENU-002",
    name: "Modern Grid Menu",
    description: "Template moderne avec grille de 6 items",
    category: "Menu",
    resolution: "1920x1080",
    variants_count: 4,
    is_active: true,
    is_system: true,
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-04-10T09:30:00Z",
    usage_count: 8,
    recommended_duration_seconds: 30,
  },
  {
    id: "template_03",
    code: "TPL-PROMO-001",
    name: "Single Promotion Banner",
    description: "Banniere simple pour promotion unique",
    category: "Promotions",
    resolution: "1920x1080",
    variants_count: 5,
    is_active: true,
    is_system: false,
    created_at: "2026-03-01T10:00:00Z",
    updated_at: "2026-04-12T11:15:00Z",
    usage_count: 24,
    recommended_duration_seconds: 20,
  },
  {
    id: "template_04",
    code: "TPL-LIVE-001",
    name: "Real-time Weather & Clock",
    description: "Affichage meteo et heure actualisees",
    category: "Live Data",
    resolution: "1920x1080",
    variants_count: 2,
    is_active: true,
    is_system: true,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-04-13T08:00:00Z",
    usage_count: 5,
    recommended_duration_seconds: 60,
  },
  {
    id: "template_05",
    code: "TPL-SLIDE-001",
    name: "Full Screen Image Slide",
    description: "Slide plein ecran avec transition",
    category: "Slides",
    resolution: "3840x2160",
    variants_count: 1,
    is_active: true,
    is_system: true,
    created_at: "2026-02-05T10:00:00Z",
    updated_at: "2026-04-08T15:45:00Z",
    usage_count: 3,
    recommended_duration_seconds: 35,
  },
  {
    id: "template_06",
    code: "TPL-PROMO-002",
    name: "Double Promotion Grid",
    description: "Grille 2x1 pour promotions cote a cote",
    category: "Promotions",
    resolution: "1920x1080",
    variants_count: 3,
    is_active: true,
    is_system: false,
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-04-11T13:20:00Z",
    usage_count: 18,
    recommended_duration_seconds: 25,
  },
];

export const previewTemplateFilterOptions: InternalTemplateFilterOptions = {
  categories: [
    { value: "Menu", label: "Menu" },
    { value: "Promotions", label: "Promotions" },
    { value: "Live Data", label: "Donnees en temps reel" },
    { value: "Slides", label: "Slides" },
    { value: "Alerts", label: "Alertes" },
  ],
  resolutions: [
    { value: "1920x1080", label: "Full HD (1920x1080)" },
    { value: "3840x2160", label: "4K (3840x2160)" },
    { value: "1024x768", label: "XGA (1024x768)" },
  ],
};

export function filterPreviewTemplateRows(
  rows: InternalTemplateRow[],
  filters: {
    search?: string;
    category?: string;
    resolution?: string;
    is_active?: boolean;
  }
): InternalTemplateRow[] {
  return rows.filter((row) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !row.name.toLowerCase().includes(searchLower) &&
        !row.code.toLowerCase().includes(searchLower) &&
        !row.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (filters.category && row.category !== filters.category) return false;
    if (filters.resolution && row.resolution !== filters.resolution) return false;
    if (filters.is_active !== undefined && row.is_active !== filters.is_active) return false;
    return true;
  });
}
