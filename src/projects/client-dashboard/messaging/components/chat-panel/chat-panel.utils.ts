import type { ChatPanelConversation } from "./chat-panel.types";

export function getChatPanelShellClass(fullPage?: boolean) {
  return fullPage
    ? "rounded-[2rem] border border-slate-200 bg-white shadow-sm min-h-[min(80vh,640px)] flex flex-col overflow-hidden"
    : "rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 w-full max-w-[420px] h-[min(70vh,520px)] flex flex-col overflow-hidden";
}

export function filterScopedConversations(conversations: ChatPanelConversation[], tenantId: string | null) {
  return tenantId
    ? conversations.filter((conversation) => conversation.tenantId === tenantId || conversation.tenantId === null)
    : conversations.filter((conversation) => conversation.tenantId === null);
}