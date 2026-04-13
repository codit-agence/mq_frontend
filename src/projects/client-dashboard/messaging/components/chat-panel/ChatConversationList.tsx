import type { ChatPanelConversation } from "./chat-panel.types";

export function ChatConversationList({
  fullPage,
  conversations,
  activeConversationId,
  onSelect,
}: {
  fullPage?: boolean;
  conversations: ChatPanelConversation[];
  activeConversationId?: string | null;
  onSelect: (conversationId: string) => void;
}) {
  return (
    <div
      className={`border-slate-100 bg-slate-50 overflow-y-auto shrink-0 ${
        fullPage
          ? "w-full max-h-[180px] sm:max-h-none border-b sm:border-b-0 sm:border-r sm:w-[260px]"
          : "w-[38%] min-w-[120px] border-r"
      }`}
    >
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation.id)}
          className={`w-full text-left px-3 py-3 border-b border-slate-100 text-xs font-bold transition ${
            conversation.id === activeConversationId ? "bg-white text-slate-950" : "text-slate-600 hover:bg-white/80"
          }`}
        >
          <span className="line-clamp-2">{conversation.title}</span>
          {conversation.unreadCount > 0 ? (
            <span className="mt-1 inline-block rounded-full bg-indigo-600 text-[9px] font-black text-white px-2 py-0.5">
              {conversation.unreadCount}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}