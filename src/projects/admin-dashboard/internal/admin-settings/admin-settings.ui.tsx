import { ReactNode } from "react";

import { inputClassName } from "./admin-settings.constants";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <div className="mt-3 flex items-center gap-3">
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 rounded-xl border border-slate-200 bg-white p-1" />
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputClassName} />
      </div>
    </div>
  );
}

export function MetricCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{icon}{label}</div>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function StatusRow({ label, status, detail }: { label: string; status: string; detail: string }) {
  const tone = status === "ok" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : status === "warning" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100";
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black">{label}</p>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{status}</span>
      </div>
      <p className="mt-2 text-xs leading-6">{detail}</p>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-black text-slate-900 break-words">{value}</span>
    </div>
  );
}