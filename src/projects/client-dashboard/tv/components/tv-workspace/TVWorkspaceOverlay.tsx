interface TVWorkspaceOverlayProps {
  pageName: string;
  displayName: string;
  logoSrc: string;
}

export function TVWorkspaceOverlay({ pageName, displayName, logoSrc }: TVWorkspaceOverlayProps) {
  return (
    <div className="absolute top-4 left-4 z-50 bg-black/65 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white overflow-hidden">
        <img src={logoSrc} alt="logo" className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">{pageName}</p>
        <p className="text-sm font-black">{displayName}</p>
      </div>
    </div>
  );
}