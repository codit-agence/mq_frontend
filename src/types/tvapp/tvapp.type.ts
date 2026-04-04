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
  security_code: string; // Les 4 chiffres à afficher sur la TV
}

export interface HeartbeatResponse {
  status: 'active' | 'paused' | 'reboot';
  current_template: string;
  needs_refresh: boolean;
}