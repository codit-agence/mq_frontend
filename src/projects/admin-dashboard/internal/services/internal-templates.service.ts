import api from "@/src/core/api/axios";

export interface InternalTemplateStats {
  total_templates: number;
  templates_by_category: Array<{ category: string; count: number }>;
  templates_by_resolution: Array<{ resolution: string; count: number }>;
  total_variants: number;
}

export interface InternalTemplateRow {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  resolution: string;
  thumbnail_url?: string;
  variants_count: number;
  is_active: boolean;
  is_system: boolean;
  created_at: string;
  updated_at: string;
  usage_count: number;
  recommended_duration_seconds: number;
}

export interface TemplateVariant {
  id: string;
  variant_number: number;
  name: string;
  layout_config: Record<string, any>;
  colors: {
    primary?: string;
    secondary?: string;
    text?: string;
    background?: string;
  };
  fonts: {
    title?: string;
    body?: string;
    accent?: string;
  };
  thumbnail_url?: string;
  preview_url?: string;
}

export interface InternalTemplateUpdateInput {
  name?: string;
  description?: string;
  category?: string;
  is_active?: boolean;
  recommended_duration_seconds?: number;
}

export interface TemplateVariantCreateInput {
  variant_number: number;
  name: string;
  layout_config: Record<string, any>;
  colors?: {
    primary?: string;
    secondary?: string;
    text?: string;
    background?: string;
  };
  fonts?: {
    title?: string;
    body?: string;
    accent?: string;
  };
}

export interface InternalTemplateFilterOptions {
  categories: Array<{ value: string; label: string }>;
  resolutions: Array<{ value: string; label: string }>;
}

export const internalTemplatesService = {
  getStats: async () => {
    const response = await api.get("/internal/admin/templates/stats");
    return response.data as InternalTemplateStats;
  },

  getTemplates: async (filters?: {
    search?: string;
    category?: string;
    resolution?: string;
    is_active?: boolean;
  }) => {
    const response = await api.get("/internal/admin/templates", { params: filters });
    return response.data as { count: number; results: InternalTemplateRow[] };
  },

  getTemplate: async (templateId: string) => {
    const response = await api.get(`/internal/admin/templates/${templateId}`);
    return response.data as InternalTemplateRow & { variants: TemplateVariant[] };
  },

  getFilterOptions: async () => {
    const response = await api.get("/internal/admin/templates/filter-options");
    return response.data as InternalTemplateFilterOptions;
  },

  createTemplate: async (payload: {
    name: string;
    description: string;
    category: string;
    resolution: string;
  }) => {
    const response = await api.post("/internal/admin/templates", payload);
    return response.data as InternalTemplateRow;
  },

  updateTemplate: async (templateId: string, payload: InternalTemplateUpdateInput) => {
    const response = await api.patch(`/internal/admin/templates/${templateId}`, payload);
    return response.data as InternalTemplateRow;
  },

  deleteTemplate: async (templateId: string) => {
    const response = await api.delete(`/internal/admin/templates/${templateId}`);
    return response.data;
  },

  getVariants: async (templateId: string) => {
    const response = await api.get(`/internal/admin/templates/${templateId}/variants`);
    return response.data as { count: number; results: TemplateVariant[] };
  },

  createVariant: async (templateId: string, payload: TemplateVariantCreateInput) => {
    const response = await api.post(`/internal/admin/templates/${templateId}/variants`, payload);
    return response.data as TemplateVariant;
  },

  updateVariant: async (templateId: string, variantId: string, payload: Partial<TemplateVariantCreateInput>) => {
    const response = await api.patch(`/internal/admin/templates/${templateId}/variants/${variantId}`, payload);
    return response.data as TemplateVariant;
  },

  deleteVariant: async (templateId: string, variantId: string) => {
    const response = await api.delete(`/internal/admin/templates/${templateId}/variants/${variantId}`);
    return response.data;
  },

  previewTemplate: async (templateId: string, variantId?: string) => {
    const response = await api.get(`/internal/admin/templates/${templateId}/preview`, {
      params: { variant_id: variantId },
    });
    return response.data;
  },

  duplicateTemplate: async (templateId: string) => {
    const response = await api.post(`/internal/admin/templates/${templateId}/duplicate`);
    return response.data as InternalTemplateRow;
  },
};
