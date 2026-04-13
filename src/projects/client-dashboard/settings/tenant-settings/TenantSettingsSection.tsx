import { ReactNode } from "react";

export function TenantSettingsSection({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center">
          <span className="text-lg">{icon}</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}