export type ScreenStatus = 'NEW' | 'PENDING' | 'CONNECTED' | 'OFFLINE';

export interface TVDeviceInfo {
  browser_family: string;
  os_platform: string;
  screen_resolution: string;
  user_agent: string;
  app_version: string;
}

export interface Screen {
  id: string;
  name: string;
  is_active: boolean;
  current_template: string;
  is_online: boolean;
  last_ping?: string;
  pairing_code?: string;   // Les 6 chiffres (Phase 1)
  security_code?: string;  // Les 4 chiffres (Phase 2)
  os_platform?: string;
  screen_resolution?: string;
}

export interface ScreenCreateInput {
  name: string;
}

export interface ScreenUpdateInput {
  name?: string;
  current_template?: string;
  is_active?: boolean;
}

