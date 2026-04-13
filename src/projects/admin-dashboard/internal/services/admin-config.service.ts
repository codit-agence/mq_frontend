import api from "@/src/core/api/axios";

export interface AdminDiagnosticCheck {
  key: string;
  label: string;
  status: string;
  detail: string;
}

export interface AdminSystemStatus {
  app_name: string;
  app_version: string;
  environment: string;
  debug: boolean;
  docker_detected: boolean;
  maintenance_mode: boolean;
  default_language: string;
  active_languages: string[];
  support_email: string;
  support_phone: string;
  database_engine: string;
  channel_layer_backend: string;
  redis_url_configured: boolean;
  websocket_routes: string[];
  server_time: string;
  checks: AdminDiagnosticCheck[];
}

export interface BrandingOptionItem {
  value: string;
  label: string;
}

export interface BrandingAdminOptions {
  app_themes: BrandingOptionItem[];
  login_layouts: BrandingOptionItem[];
  recommended_latin_fonts: string[];
  recommended_arabic_fonts: string[];
  recommended_tv_fonts: string[];
  languages: BrandingOptionItem[];
}

export const adminConfigService = {
  async getBranding() {
    const response = await api.get("/internal/admin/branding");
    return response.data;
  },

  async getBrandingOptions(): Promise<BrandingAdminOptions> {
    const response = await api.get("/internal/admin/branding/options");
    return response.data;
  },

  async getSystemStatus(): Promise<AdminSystemStatus> {
    const response = await api.get("/internal/admin/system-status");
    return response.data;
  },

  async updateBranding(payload: Record<string, unknown>, files?: Record<string, File | null>) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    Object.entries(files || {}).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    const response = await api.post("/internal/admin/branding", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};