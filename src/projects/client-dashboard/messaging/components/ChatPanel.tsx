"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../store/chat.store";
import { MessagingService } from "../services/messaging.service";
import { ChatConversationList } from "./chat-panel/ChatConversationList";
import { ChatPanelHeader } from "./chat-panel/ChatPanelHeader";
import { ChatMessagesPane } from "./chat-panel/ChatMessagesPane";
import type { ChatPanelProps } from "./chat-panel/chat-panel.types";
import { filterScopedConversations, getChatPanelShellClass } from "./chat-panel/chat-panel.utils";

export function ChatPanel({ tenantId, tenantName, userLabel, fullPage, messagesHref, onClose, wsConnected, wsSend }: ChatPanelProps) {
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActive);
  const ensureSupport = useChatStore((s) => s.ensureSupportConversation);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markRead = useChatStore((s) => s.markConversationRead);

  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const scoped = useMemo(() => filterScopedConversations(conversations, tenantId), [conversations, tenantId]);

  useEffect(() => {
    const id = ensureSupport(tenantId, tenantName);
    const { activeConversationId, conversations } = useChatStore.getState();
    const list = filterScopedConversations(conversations, tenantId);
    if (!activeConversationId || !list.some((c) => c.id === activeConversationId)) {
      setActive(id);
    }
  }, [tenantId, tenantName, ensureSupport, setActive]);

  const active = scoped.find((c) => c.id === activeId) || scoped[0];

  useEffect(() => {
    if (active) markRead(active.id);
  }, [active, markRead]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length]);

  const handleSend = () => {
    if (!active) return;
    const trimmed = draft.trim();
    if (!trimmed) return;

    if (tenantId && wsSend && wsConnected) {
      if (wsSend(trimmed)) {
        setDraft("");
        return;
      }
    }

    sendMessage(active.id, trimmed, userLabel);
    setDraft("");
    if (!tenantId || !wsConnected) {
      window.setTimeout(() => {
        MessagingService.simulateIncomingReply(
          active.id,
          "Merci pour votre message. Un conseiller pourra répondre ici une fois l’API branchée."
        );
      }, 900);
    }
  };

  const shell = getChatPanelShellClass(fullPage);

  return (
    <div className={shell}>
      <ChatPanelHeader title={active?.title ?? "Chat"} tenantId={tenantId} wsConnected={wsConnected} messagesHref={messagesHref} onClose={onClose} />

      <div className={`flex flex-1 min-h-0 ${fullPage ? "flex-col sm:flex-row" : "flex-row"}`}>
        <ChatConversationList fullPage={fullPage} conversations={scoped} activeConversationId={active?.id} onSelect={setActive} />

        <ChatMessagesPane listRef={listRef} activeConversation={active} draft={draft} onDraftChange={setDraft} onSend={handleSend} />
      </div>
    </div>
  );
}
