export type NotificationType = "info" | "success" | "warning" | "system";

export interface DashboardNotification {
  id: string;
  tenantId: string | null;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderLabel: string;
  body: string;
  createdAt: string;
  isOwn: boolean;
}

export interface ChatConversation {
  id: string;
  tenantId: string | null;
  title: string;
  subtitle?: string;
  updatedAt: string;
  unreadCount: number;
  messages: ChatMessage[];
}
