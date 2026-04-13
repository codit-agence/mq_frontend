export type WsSystem = "tv" | "chat" | "notification";

export interface WsEnvelope<T = Record<string, unknown>> {
  system: WsSystem;
  type: string;
  payload: T;
}
