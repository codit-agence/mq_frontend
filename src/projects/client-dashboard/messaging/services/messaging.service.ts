import type { DashboardNotification } from "../types";
import { useNotificationsStore } from "../store/notifications.store";
import { useChatStore } from "../store/chat.store";

/**
 * Couche prête pour remplacer par des appels axios + WebSocket.
 * Aujourd’hui : déclenchements locaux (store) pour démo UI.
 */
export const MessagingService = {
  async fetchNotifications(_tenantId: string | null): Promise<DashboardNotification[]> {
    return useNotificationsStore.getState().items;
  },

  pushLocalNotification(
    payload: Omit<DashboardNotification, "id" | "read" | "createdAt"> & { read?: boolean }
  ) {
    useNotificationsStore.getState().add(payload);
  },

  simulateIncomingReply(conversationId: string, text: string) {
    const id = `${Date.now()}-r`;
    const createdAt = new Date().toISOString();
    useChatStore.setState((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== conversationId) return c;
        const msg = {
          id,
          conversationId,
          senderId: "agent",
          senderLabel: "Support",
          body: text,
          createdAt,
          isOwn: false,
        };
        const isActive = s.activeConversationId === conversationId;
        return {
          ...c,
          messages: [...c.messages, msg].slice(-80),
          updatedAt: createdAt,
          unreadCount: isActive ? 0 : c.unreadCount + 1,
        };
      }),
    }));
  },
};
