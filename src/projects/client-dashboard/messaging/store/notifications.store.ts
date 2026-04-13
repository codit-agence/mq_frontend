import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DashboardNotification } from "../types";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface NotificationsState {
  items: DashboardNotification[];
  add: (
    n: Omit<DashboardNotification, "id" | "read" | "createdAt"> & {
      read?: boolean;
      id?: string;
    }
  ) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
  unreadCount: () => number;
  seedDemo: (tenantId: string | null) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (payload) => {
        const id = payload.id ?? newId();
        set((s) => {
          if (s.items.some((i) => i.id === id)) return s;
          const item: DashboardNotification = {
            id,
            read: payload.read ?? false,
            createdAt: new Date().toISOString(),
            tenantId: payload.tenantId,
            title: payload.title,
            body: payload.body,
            type: payload.type,
            actionUrl: payload.actionUrl,
          };
          return { items: [item, ...s.items].slice(0, 200) };
        });
      },

      markRead: (id) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
        })),

      markAllRead: () =>
        set((s) => ({
          items: s.items.map((i) => ({ ...i, read: true })),
        })),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clear: () => set({ items: [] }),

      unreadCount: () => get().items.filter((i) => !i.read).length,

      seedDemo: (tenantId) => {
        const { items } = get();
        if (items.length > 0) return;
        const now = new Date().toISOString();
        set({
          items: [
            {
              id: newId(),
              tenantId,
              title: "Bienvenue sur les notifications",
              body: "Vous recevrez ici alertes système, messages équipe et rappels. Branchez une API plus tard via messaging.service.",
              type: "info",
              read: false,
              createdAt: now,
            },
            {
              id: newId(),
              tenantId,
              title: "Playlist enregistrée",
              body: "Astuce : les événements réels viendront du backend (WebSocket ou polling).",
              type: "success",
              read: true,
              createdAt: now,
            },
          ],
        });
      },
    }),
    {
      name: "mq-dashboard-notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
