


export interface TVScreen {
    id: number;
    token: string;
    name: string;
    is_active: boolean;
    created_at: string;
}



export interface TVConfig {
  tenant_name: string;
  screen_name: string;
  //menu_data: any[]; // On précisera le type Menu plus tard
}
export interface WSMessage {
  action: 'CONNECT_SUCCESS' | 'SHOW_MENU' | 'RELOAD';
  payload: TVConfig ; // payload peut être de différents types selon l'action
}
