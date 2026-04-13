"use client";

import { useEffect, useRef } from "react";
import { getAccessToken } from "@/src/core/ws/authToken";
import { wsUrl } from "@/src/core/ws/buildWsUrl";
import type { WsEnvelope } from "@/src/core/ws/types";
import { useNotificationsStore } from "../store/notifications.store";
import type { NotificationType } from "../types";

function mapNotifType(t: string | undefined): NotificationType {
  if (t === "success" || t === "warning" || t === "system") return t;
  return "info";
}

/**
 * Système notifications — flux utilisateur (JWT en query).
 */
export function useDashboardNotificationSocket(enabled: boolean) {
  const ingestRef = useRef(useNotificationsStore.getState());

  useEffect(() => {
    ingestRef.current = useNotificationsStore.getState();
  });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const token = getAccessToken();
    if (!token) return;

    const url = `${wsUrl("/ws/notifications/")}?token=${encodeURIComponent(token)}`;
    const socket = new WebSocket(url);

    socket.onmessage = (ev) => {
      try {
        const env = JSON.parse(ev.data as string) as WsEnvelope<{
          id?: string;
          title?: string;
          body?: string;
          type?: string;
          tenant_id?: string | null;
        }>;
        if (env.system !== "notification" || env.type !== "new") return;
        const p = env.payload;
        if (!p.title || !p.body) return;
        ingestRef.current.add({
          id: p.id,
          tenantId: p.tenant_id ?? null,
          title: p.title,
          body: p.body,
          type: mapNotifType(p.type),
          read: false,
        });
      } catch {
        /* ignore */
      }
    };

    return () => {
      socket.close();
    };
  }, [enabled]);
}
