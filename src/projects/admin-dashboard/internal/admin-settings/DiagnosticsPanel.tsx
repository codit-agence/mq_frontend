import { StatusRow } from "./admin-settings.ui";
import { NetworkProbe } from "./admin-settings.types";
import { AdminSystemStatus } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";

export function DiagnosticsPanel({
  status,
  networkChecks,
  networkLoading,
  onRunNetworkChecks,
  onRunWebsocketCheck,
}: {
  status: AdminSystemStatus;
  networkChecks: NetworkProbe[];
  networkLoading: boolean;
  onRunNetworkChecks: () => void;
  onRunWebsocketCheck: () => void;
}) {
  return (
    <div className="dashboard-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Diagnostic</p>
          <h3 className="mt-1 text-xl font-black text-slate-950">Reseau & services</h3>
        </div>
        <button onClick={onRunNetworkChecks} disabled={networkLoading} className="rounded-xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-600 disabled:opacity-50">
          {networkLoading ? "Test..." : "Tester"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={onRunNetworkChecks} disabled={networkLoading} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-100 disabled:opacity-50">
          HTTP probes
        </button>
        <button onClick={onRunWebsocketCheck} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-100">
          WebSocket probe
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {status.checks.map((check) => (
          <StatusRow key={check.key} label={check.label} status={check.status} detail={check.detail} />
        ))}
        {networkChecks.map((check) => (
          <StatusRow key={check.key} label={check.label} status={check.ok ? "ok" : "error"} detail={`${check.detail} • ${check.durationMs} ms`} />
        ))}
      </div>
    </div>
  );
}