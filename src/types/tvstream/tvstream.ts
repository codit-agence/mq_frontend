export type ScreenStatus = 'NEW' | 'PENDING' | 'CONNECTED' | 'OFFLINE';

export type TVTransportMode = 'auto' | 'polling' | 'websocket';
export type TVResolvedTransportMode = 'polling' | 'websocket';
export type TVDeviceTier = 'standard' | 'light';
export type TVGpsStatus = 'unknown' | 'ok' | 'missing' | 'denied' | 'unavailable' | 'unsupported';

export interface TVDeviceInfo {
  browser_family: string;
  os_platform: string;
  screen_resolution: string;
  user_agent: string;
  app_version: string;
  preferred_transport?: TVTransportMode;
  device_memory_gb?: number;
  hardware_concurrency?: number;
  timezone?: string;
  locale?: string;
  websocket_supported?: boolean;
  polling_supported?: boolean;
  geolocation_supported?: boolean;
  max_touch_points?: number;
  network_type?: string;
  capabilities?: Record<string, unknown>;
}

export interface Screen {
  id: string;
  name: string;
  is_active: boolean;
  current_template: string;
  is_online: boolean;
  moved_alert?: boolean;
  last_ping?: string;
  total_uptime_hours?: number;
  pairing_code?: string;   // Les 6 chiffres (Phase 1)
  security_code?: string;  // Les 4 chiffres (Phase 2)
  os_platform?: string;
  screen_resolution?: string;
  preferred_transport?: TVTransportMode;
  resolved_transport?: TVResolvedTransportMode;
  device_tier?: TVDeviceTier;
  poll_interval_seconds?: number;
  gps_required?: boolean;
  last_gps_status?: TVGpsStatus;
  technical_capabilities?: Record<string, unknown> | null;
  last_runtime_snapshot?: Record<string, unknown> | null;
}

export interface TenantScreenSummary {
  total_screens: number;
  online_screens: number;
  offline_screens: number;
  moved_alert_count: number;
  last_7_days: {
    total_uptime_seconds: number;
    total_heartbeats: number;
    total_disconnects: number;
    total_errors: number;
  };
  last_30_days: {
    total_uptime_seconds: number;
    total_heartbeats: number;
    total_disconnects: number;
    total_errors: number;
  };
}

export interface ScreenCreateInput {
  name: string;
}

export interface ScreenUpdateInput {
  name?: string;
  current_template?: string;
  is_active?: boolean;
  preferred_transport?: TVTransportMode;
  poll_interval_seconds?: number;
  gps_required?: boolean;
}

