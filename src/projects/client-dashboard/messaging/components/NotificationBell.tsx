"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { useNotificationsStore } from "../store/notifications.store";
import type { DashboardNotification } from "../types";

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function typeStyles(t: DashboardNotification["type"]) {
  switch (t) {
    case "success":
      return "bg-emerald-50 text-emerald-800 border-emerald-100";
    case "warning":
      return "bg-amber-50 text-amber-900 border-amber-100";
    case "system":
      return "bg-violet-50 text-violet-900 border-violet-100";
    default:
      return "bg-slate-50 text-slate-800 border-slate-100";
  }
}

export function NotificationBell({
  tenantId,
  notificationsHref,
}: {
  tenantId: string | null;
  notificationsHref: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const remove = useNotificationsStore((s) => s.remove);
  const seedDemo = useNotificationsStore((s) => s.seedDemo);

  const scoped = tenantId
    ? items.filter((i) => i.tenantId === tenantId || i.tenantId === null)
    : items;

  const unread = scoped.filter((i) => !i.read).length;

  useEffect(() => {
    seedDemo(tenantId);
  }, [tenantId, seedDemo]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
        aria-expanded={open}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[min(100vw-2rem,380px)] rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 z-[60] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Notifications
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => markAllRead()}
                className="p-2 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition"
                title="Tout marquer lu"
              >
                <CheckCheck size={16} />
              </button>
            </div>
          </div>

          <div className="max-h-[min(70vh,360px)] overflow-y-auto">
            {scoped.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Aucune notification</p>
            ) : (
              scoped.slice(0, 12).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-slate-50 ${n.read ? "opacity-70" : "bg-indigo-50/30"}`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-slate-300" : "bg-indigo-600"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-black text-slate-900 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                      <span
                        className={`inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeStyles(n.type)}`}
                      >
                        {n.type}
                      </span>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {n.body}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {!n.read && (
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800"
                          >
                            <Check size={12} /> Lu
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(n.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-slate-400 hover:text-rose-600"
                        >
                          <Trash2 size={12} /> Supprimer
                        </button>
                        {n.actionUrl && (
                          <Link
                            href={n.actionUrl}
                            className="text-[10px] font-black uppercase tracking-wider text-slate-700 hover:text-indigo-600"
                            onClick={() => setOpen(false)}
                          >
                            Ouvrir
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-slate-100 bg-white">
            <Link
              href={notificationsHref}
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-black uppercase tracking-[0.15em] text-indigo-600 hover:text-indigo-800"
            >
              Centre de notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
