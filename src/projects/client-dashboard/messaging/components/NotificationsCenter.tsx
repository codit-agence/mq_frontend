"use client";

import { useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useNotificationsStore } from "../store/notifications.store";
import type { DashboardNotification } from "../types";

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function badge(t: DashboardNotification["type"]) {
  const map: Record<DashboardNotification["type"], string> = {
    info: "bg-slate-100 text-slate-800",
    success: "bg-emerald-100 text-emerald-900",
    warning: "bg-amber-100 text-amber-900",
    system: "bg-violet-100 text-violet-900",
  };
  return map[t];
}

export function NotificationsCenter({
  tenantId,
  backHref,
}: {
  tenantId: string | null;
  backHref: string;
}) {
  const items = useNotificationsStore((s) => s.items);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const remove = useNotificationsStore((s) => s.remove);
  const seedDemo = useNotificationsStore((s) => s.seedDemo);

  useEffect(() => {
    seedDemo(tenantId);
  }, [tenantId, seedDemo]);

  const scoped = tenantId
    ? items.filter((i) => i.tenantId === tenantId || i.tenantId === null)
    : items;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-indigo-600">
            <Bell size={14} />
            Centre de notifications
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-slate-950">
            Alertes et rappels
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 leading-relaxed">
            Historique local (persisté dans le navigateur). Remplacez par des appels API dans{" "}
            <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">messaging.service.ts</code>.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={backHref}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-slate-700 hover:bg-slate-50"
          >
            Retour
          </Link>
          <button
            type="button"
            onClick={() => markAllRead()}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-white hover:bg-indigo-600"
          >
            <CheckCheck size={14} /> Tout lu
          </button>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden shadow-sm">
        {scoped.length === 0 ? (
          <p className="p-12 text-center text-slate-500 text-sm">Aucune notification</p>
        ) : (
          scoped.map((n) => (
            <div
              key={n.id}
              className={`p-5 md:p-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between ${n.read ? "bg-white" : "bg-indigo-50/40"}`}
            >
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-black text-slate-950">{n.title}</h2>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badge(n.type)}`}>
                    {n.type}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{n.body}</p>
                <p className="text-xs text-slate-400">{formatTime(n.createdAt)}</p>
                {n.actionUrl && (
                  <Link href={n.actionUrl} className="text-xs font-black uppercase text-indigo-600 hover:underline">
                    Ouvrir le lien
                  </Link>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {!n.read && (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-50"
                  >
                    <Check size={14} /> Lu
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(n.id)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
