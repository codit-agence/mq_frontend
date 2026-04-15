"use client";

import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { ChatPanel } from "@/src/projects/client-dashboard/messaging/components/ChatPanel";
import { useDashboardChatSocket } from "@/src/projects/client-dashboard/messaging/ws/useDashboardChatSocket";

export interface MessagesPageViewProps {
  tenantId?: string | null;
}

export function MessagesPageView({ tenantId }: MessagesPageViewProps) {
  const scoped = typeof tenantId === "string" && tenantId.length > 0 ? tenantId : null;
  const { user, tenant } = useAuthStore();
  const userLabel =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Moi";

  const { connected: wsConnected, send: wsSend } = useDashboardChatSocket(scoped, user?.id);

  const messagesHref = scoped ? `/dashboard/tenant/${scoped}/messages` : "/dashboard/messages";

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Messages</h1>
        <p className="mt-2 text-sm text-slate-500">
          {scoped ? (
            <>
              WebSocket : <strong>{wsConnected ? "connecté" : "déconnecté"}</strong> (Redis + Channels requis côté
              serveur).
            </>
          ) : (
            <>Support global (hors tenant). Le widget flottant est masqué sur cette page.</>
          )}
        </p>
      </div>
      <ChatPanel
        tenantId={scoped}
        tenantName={scoped ? tenant?.name : undefined}
        userLabel={userLabel}
        fullPage
        messagesHref={messagesHref}
        wsConnected={scoped ? wsConnected : undefined}
        wsSend={scoped ? wsSend : undefined}
      />
    </div>
  );
}
