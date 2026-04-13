import { Send } from "lucide-react";
import { RefObject } from "react";

import type { ChatPanelConversation } from "./chat-panel.types";

export function ChatMessagesPane({
  listRef,
  activeConversation,
  draft,
  onDraftChange,
  onSend,
}: {
  listRef: RefObject<HTMLDivElement | null>;
  activeConversation?: ChatPanelConversation;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activeConversation?.messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                message.isOwn ? "bg-indigo-600 text-white rounded-br-md" : "bg-slate-100 text-slate-900 rounded-bl-md"
              }`}
            >
              <p className="text-[10px] font-black uppercase tracking-wider opacity-70 mb-1">{message.senderLabel}</p>
              <p>{message.body}</p>
              <p className="text-[10px] mt-1 opacity-60">
                {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50/80">
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Écrire un message…"
            className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!draft.trim()}
            className="shrink-0 rounded-xl bg-slate-950 text-white px-3 py-2.5 hover:bg-indigo-600 disabled:opacity-40 transition"
            aria-label="Envoyer"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}