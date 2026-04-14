"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { ChatPanel } from "@/src/projects/client-dashboard/messaging/components/ChatPanel";
import { useDashboardChatSocket } from "@/src/projects/client-dashboard/messaging/ws/useDashboardChatSocket";

export default function TenantMessagesPage() {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = typeof params?.tenantId === "string" ? params.tenantId : null;
  const { user, tenant } = useAuthStore();
  const userLabel =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Moi";

  const { connected: wsConnected, send: wsSend } = useDashboardChatSocket(tenantId, user?.id);

  const href = tenantId ? `/dashboard/tenant/${tenantId}/messages` : "/dashboard/messages";

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Messages</h1>
        <p className="mt-2 text-sm text-slate-500">
          WebSocket : <strong>{wsConnected ? "connecté" : "déconnecté"}</strong> (Redis + Channels requis côté serveur).
        </p>
      </div>
      <ChatPanel
        tenantId={tenantId}
        tenantName={tenant?.name}
        userLabel={userLabel}
        fullPage
        messagesHref={href}
        wsConnected={wsConnected}
        wsSend={wsSend}
      />
    </div>
  );
}
