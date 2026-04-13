"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatPanel } from "./ChatPanel";
import { useChatStore } from "../store/chat.store";
import { useDashboardChatSocket } from "../ws/useDashboardChatSocket";

export function ChatWidget({
  tenantId,
  tenantName,
  userLabel,
  userId,
  messagesHref,
}: {
  tenantId: string | null;
  tenantName?: string;
  userLabel: string;
  userId?: string;
  messagesHref: string;
}) {
  const [open, setOpen] = useState(false);
  const { connected: wsConnected, send: wsSend } = useDashboardChatSocket(tenantId, userId);
  const unread = useChatStore((s) => {
    const convs = tenantId
      ? s.conversations.filter((c) => c.tenantId === tenantId || c.tenantId === null)
      : s.conversations.filter((c) => c.tenantId === null);
    return convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/30 hover:bg-indigo-600 transition md:bottom-8 md:right-8"
        aria-expanded={open}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle size={24} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-[10px] font-black flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[54] bg-slate-900/20 md:bg-transparent"
            aria-label="Fermer le fond"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-24 right-5 z-[55] md:bottom-28 md:right-8 w-[min(100vw-2.5rem,420px)]">
            <ChatPanel
              tenantId={tenantId}
              tenantName={tenantName}
              userLabel={userLabel}
              messagesHref={messagesHref}
              onClose={() => setOpen(false)}
              wsConnected={wsConnected}
              wsSend={wsSend}
            />
          </div>
        </>
      )}
    </>
  );
}
