import type { ChatConversation } from "@/src/projects/client-dashboard/messaging/types";

export interface ChatPanelProps {
  tenantId: string | null;
  tenantName?: string;
  userLabel: string;
  fullPage?: boolean;
  messagesHref: string;
  onClose?: () => void;
  wsConnected?: boolean;
  wsSend?: (body: string) => boolean;
}

export interface ChatPanelConversation extends ChatConversation {}