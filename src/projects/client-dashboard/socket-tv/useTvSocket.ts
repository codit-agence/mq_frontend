"use client";

import { useEffect, useRef } from "react";
import { wsUrl } from "@/src/core/ws/buildWsUrl";
import type { WsEnvelope } from "@/src/core/ws/types";

/**
 * Système TV — WebSocket dédié écran (token matériel, pas JWT utilisateur).
 */
export function useTvSocket(
  screenToken: string | null | undefined,
  onMessage: (envelope: WsEnvelope) => void
) {
  const cb = useRef(onMessage);
  cb.current = onMessage;

  useEffect(() => {
    if (!screenToken) return;

    const url = wsUrl(`/ws/tv/${encodeURIComponent(screenToken)}/`);
    const socket = new WebSocket(url);

    socket.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as WsEnvelope;
        cb.current(data);
      } catch {
        /* ignore */
      }
    };

    return () => {
      socket.close();
    };
  }, [screenToken]);
}
