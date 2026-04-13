export type TVControlTransport = "polling" | "websocket";
export type TVDeviceTier = "standard" | "light";

export interface TVState {
  screenId: string | null;
  accessToken: string | null;
  isPaired: boolean;
  currentTemplate: string;
  deviceName: string;
}

export interface TVInitResponse {
  status: string;
  screen_id: string;
  message: string;
  security_code: string;
  transport_mode?: TVControlTransport;
  device_tier?: TVDeviceTier;
  gps_required?: boolean;
  poll_interval_seconds?: number;
}

export interface TVCheckStatusResponse {
  is_paired: boolean;
  access_token?: string | null;
  screen_name?: string | null;
  current_template?: string | null;
  security_code?: string | null;
  transport_mode?: TVControlTransport;
  device_tier?: TVDeviceTier;
  gps_required?: boolean;
  poll_interval_seconds?: number;
}

export interface HeartbeatResponse {
  command: "PLAY" | "PAUSE" | "REBOOT" | "REFRESH";
  current_template: string;
  needs_refresh: boolean;
  moved_alert?: boolean;
  transport_mode: TVControlTransport;
  device_tier: TVDeviceTier;
  poll_interval_seconds: number;
  gps_required: boolean;
}

export interface TVManifestProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface TVManifest {
  label: string;
  category_name: string;
  template_name: string;
  slot_duration: number;
  audio_url?: string | null;
  audio_playlist?: string[] | null;
  products: TVManifestProduct[];
  tenant: {
    name: string;
    logo?: string | null;
    phone?: string | null;
    show_prices?: boolean;
    tel?: string | null;
    opening_hours?: Record<string, unknown> | null;
    social_links?: string[] | Record<string, string> | null;
    created_at?: string | null;
    cover_image?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    name_override?: string | null;
    qr_slug?: string | null;
    qr_is_active?: boolean | null;
    public_landing_url?: string | null;
    qr_redirect_url?: string | null;
  };
  server_time: string;
}
