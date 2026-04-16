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
  /** Libellé langue primaire (souvent AR si bilingue). */
  name: string;
  description: string;
  price: number;
  image: string;
  /** Présent si le tenant a ≥ 2 langues actives (ex. FR + AR). */
  name_secondary?: string;
  description_secondary?: string;
}

export interface AudioPlaylistTrack {
  url: string;
  title: string;
  duration: number;
}

export interface AudioPlaylist {
  mode: "repeat" | "shuffle";
  repeat_count: number;
  category: string;
  track_type?: string;
  slot_label?: string;
  tracks: AudioPlaylistTrack[];
}

export type TVLanguageMode = "single" | "bilingual";

export interface TVManifestTenantLanguages {
  mode: TVLanguageMode;
  /** Langue affichée en premier (priorité AR si « ar » dans les langues actives). */
  primary: string;
  secondary?: string | null;
  all: string[];
}

export interface TVManifest {
  label: string;
  category_name: string;
  /** Libellé catégorie langue secondaire (si bilingue). */
  category_name_secondary?: string | null;
  template_name: string;
  slot_duration: number;
  audio_url?: string | null;
  audio_playlist?: AudioPlaylist | null;
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
    /** URL site vitrine (si exposée par l’API) */
    website?: string | null;
    /** Langues d’affichage TV (manifest Django). */
    tv_languages?: TVManifestTenantLanguages;
    active_languages?: string[];
    default_language?: string;
    is_rtl?: boolean;
  };
  server_time: string;
}
