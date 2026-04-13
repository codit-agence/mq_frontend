"use client";

import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { ChatPanel } from "@/src/projects/client-dashboard/messaging/components/ChatPanel";

export default function GlobalMessagesPage() {
  const { user } = useAuthStore();
  const userLabel =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || "Moi";

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">Messages</h1>
        <p className="mt-2 text-sm text-slate-500">
          Support global (hors tenant). Le widget flottant est masqué sur cette page.
        </p>
      </div>
      <ChatPanel
        tenantId={null}
        userLabel={userLabel}
        fullPage
        messagesHref="/dashboard/messages"
      />
    </div>
  );
}
