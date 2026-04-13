"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken } from "@/src/core/ws/authToken";
import { wsUrl } from "@/src/core/ws/buildWsUrl";
import type { WsEnvelope } from "@/src/core/ws/types";
import { useChatStore } from "../store/chat.store";

/**
 * Système chat — WebSocket par tenant (JWT en query).
 */
export function useDashboardChatSocket(
  tenantId: string | null,
  currentUserId: string | undefined
) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const appendRef = useRef(useChatStore.getState().appendFromSocket);

  useEffect(() => {
    appendRef.current = useChatStore.getState().appendFromSocket;
  });

  useEffect(() => {
    if (!tenantId || typeof window === "undefined") {
      setConnected(false);
      return;
    }

    const token = getAccessToken();
    if (!token) {
      setConnected(false);
      return;
    }

    const url = `${wsUrl(`/ws/chat/${encodeURIComponent(tenantId)}/`)}?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setConnected(true);
    socket.onclose = () => setConnected(false);

    socket.onmessage = (ev) => {
      try {
        const env = JSON.parse(ev.data as string) as WsEnvelope<{
          id?: string;
          body?: string;
          user_label?: string;
          user_id?: string;
          created_at?: string;
        }>;
        if (env.system !== "chat" || env.type !== "message") return;
        const p = env.payload;
        if (!p.id || !p.body || !p.user_id || !p.created_at) return;
        appendRef.current(tenantId, currentUserId, {
          id: p.id,
          body: p.body,
          user_label: p.user_label || p.user_id,
          user_id: p.user_id,
          created_at: p.created_at,
        });
      } catch {
        /* ignore */
      }
    };

    return () => {
      socket.close();
      socketRef.current = null;
      setConnected(false);
    };
  }, [tenantId, currentUserId]);

  const send = useCallback((body: string) => {
    const s = socketRef.current;
    if (!s || s.readyState !== WebSocket.OPEN) return false;
    s.send(JSON.stringify({ type: "message", body, room_key: "support" }));
    return true;
  }, []);

  return { connected, send };
}
