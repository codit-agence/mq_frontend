import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ChatConversation, ChatMessage } from "../types";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const MAX_MESSAGES_PER_CONV = 80;

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  setActive: (id: string | null) => void;
  ensureSupportConversation: (tenantId: string | null, tenantName?: string) => string;
  sendMessage: (conversationId: string, body: string, ownLabel: string) => void;
  appendFromSocket: (
    tenantId: string | null,
    currentUserId: string | undefined,
    data: {
      id: string;
      body: string;
      user_label: string;
      user_id: string;
      created_at: string;
    }
  ) => void;
  markConversationRead: (conversationId: string) => void;
  unreadTotal: () => number;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      setActive: (id) => {
        // Optimisation : Ne change le state que si l'ID est différent
        if (get().activeConversationId === id) return;
        set({ activeConversationId: id });
        if (id) get().markConversationRead(id);
      },

      ensureSupportConversation: (tenantId, tenantName) => {
        const state = get();
        const existing = state.conversations.find(
          (c) => c.tenantId === tenantId && c.title.startsWith("Support")
        );
        
        if (existing) return existing.id;

        const id = newId();
        const now = new Date().toISOString();
        const title = tenantId
          ? `Support · ${tenantName || "Établissement"}`
          : "Support SmartDisplay";

        const welcome: ChatMessage = {
          id: newId(),
          conversationId: id,
          senderId: "system",
          senderLabel: "Équipe",
          body: tenantId
            ? "Bonjour ! Posez votre question ici."
            : "Bonjour ! Espace support global.",
          createdAt: now,
          isOwn: false,
        };

        const conv: ChatConversation = {
          id,
          tenantId,
          title,
          subtitle: "Réponse sous 24h",
          updatedAt: now,
          unreadCount: 0,
          messages: [welcome],
        };

        set((s) => ({ 
          conversations: [conv, ...s.conversations]
        }));
        
        return id;
      },

      appendFromSocket: (tenantId, currentUserId, data) => {
        const convId = get().ensureSupportConversation(tenantId);
        const isOwn = Boolean(currentUserId && data.user_id === currentUserId);
        
        set((s) => {
          // Vérification si le message existe déjà pour éviter les doublons en RAM
          const conversation = s.conversations.find(c => c.id === convId);
          if (conversation?.messages.some(m => m.id === data.id)) return s;

          return {
            conversations: s.conversations.map((c) => {
              if (c.id !== convId) return c;
              
              const msg: ChatMessage = {
                id: data.id,
                conversationId: convId,
                senderId: data.user_id,
                senderLabel: data.user_label,
                body: data.body,
                createdAt: data.created_at,
                isOwn,
              };

              // On limite strictement le nombre de messages pour la RAM de la TV
              const nextMsgs = [...c.messages, msg].slice(-MAX_MESSAGES_PER_CONV);
              
              // Si on est déjà sur cette conversation, on ne marque pas en "non lu"
              const shouldIncrement = !isOwn && s.activeConversationId !== convId;

              return {
                ...c,
                messages: nextMsgs,
                updatedAt: data.created_at,
                unreadCount: shouldIncrement ? c.unreadCount + 1 : 0,
              };
            }),
          };
        });
      },

      sendMessage: (conversationId, body, ownLabel) => {
        const trimmed = body.trim();
        if (!trimmed) return;

        const now = new Date().toISOString();
        const msg: ChatMessage = {
          id: newId(),
          conversationId,
          senderId: "me",
          senderLabel: ownLabel,
          body: trimmed,
          createdAt: now,
          isOwn: true,
        };

        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return {
              ...c,
              messages: [...c.messages, msg].slice(-MAX_MESSAGES_PER_CONV),
              updatedAt: now,
              unreadCount: 0,
            };
          }),
        }));
      },

      markConversationRead: (conversationId) => {
        const convs = get().conversations;
        const target = convs.find(c => c.id === conversationId);

        // ✅ RÉPARATION CRUCIALE : Stop la boucle infinie ici
        if (!target || target.unreadCount === 0) return;

        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        }));
      },

      unreadTotal: () =>
        get().conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
    }),
    {
      name: "mq-dashboard-chat",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        conversations: s.conversations.map((c) => ({
          ...c,
          // Persistance légère : on ne garde que les messages en local
          messages: c.messages.slice(-MAX_MESSAGES_PER_CONV),
        })),
        activeConversationId: s.activeConversationId,
      }),
    }
  )
);