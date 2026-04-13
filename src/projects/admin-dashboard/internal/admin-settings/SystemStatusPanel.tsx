import { AdminSystemStatus } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";
import { InfoRow } from "./admin-settings.ui";

export function SystemStatusPanel({ status }: { status: AdminSystemStatus }) {
  return (
    <>
      <div className="dashboard-surface p-5 sm:p-6 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Etat applicatif</p>
        <InfoRow label="Application" value={`${status.app_name} v${status.app_version}`} />
        <InfoRow label="DB Engine" value={status.database_engine} />
        <InfoRow label="Channel layer" value={status.channel_layer_backend || "-"} />
        <InfoRow label="Redis configure" value={status.redis_url_configured ? "Oui" : "Non"} />
        <InfoRow label="Server time" value={new Date(status.server_time).toLocaleString("fr-FR")} />
        <InfoRow label="Langues actives" value={status.active_languages.join(", ")} />
        <InfoRow label="Debug" value={status.debug ? "Oui" : "Non"} />
        <InfoRow label="Maintenance" value={status.maintenance_mode ? "Active" : "Inactive"} />
      </div>

      <div className="dashboard-surface p-5 sm:p-6 space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Routes WebSocket</p>
        <div className="space-y-2">
          {status.websocket_routes.map((route) => (
            <div key={route} className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-mono text-slate-700 break-all">
              {route}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}