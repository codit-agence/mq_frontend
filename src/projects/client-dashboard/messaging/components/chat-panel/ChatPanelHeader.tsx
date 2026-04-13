import Link from "next/link";
import { MessageCircle, X } from "lucide-react";

export function ChatPanelHeader({
  title,
  tenantId,
  wsConnected,
  messagesHref,
  onClose,
}: {
  title: string;
  tenantId: string | null;
  wsConnected?: boolean;
  messagesHref: string;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-950 text-white">
      <div className="flex items-center gap-2 min-w-0">
        <MessageCircle size={18} className="shrink-0 text-indigo-300" />
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Messages</p>
          <p className="text-sm font-black truncate">{title}</p>
          {tenantId && (
            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400/90">
              {wsConnected ? "Temps réel" : "Hors ligne"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Link href={messagesHref} className="text-[10px] font-black uppercase tracking-wider text-indigo-200 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10">
          Plein écran
        </Link>
        {onClose ? (
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white" aria-label="Fermer">
            <X size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}