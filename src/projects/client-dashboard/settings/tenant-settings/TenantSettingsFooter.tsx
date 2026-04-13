import type { TenantSettingsText } from "./tenant-settings.constants";

export function TenantSettingsFooter({
  isLoading,
  canSave,
  text,
  onSave,
}: {
  isLoading: boolean;
  canSave: boolean;
  text: TenantSettingsText;
  onSave: () => void;
}) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isLoading ? text.syncing : text.ready}
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={isLoading || !canSave}
          className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-[1.8rem] font-black text-sm hover:bg-black disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 shadow-2xl shadow-slate-900/20"
        >
          {isLoading ? text.saving : text.publish}
        </button>
      </div>
    </footer>
  );
}