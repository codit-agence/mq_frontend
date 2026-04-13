import { CloudSun, MonitorSmartphone, MoonStar, Palette, QrCode } from "lucide-react";

interface TVWorkspaceControlsProps {
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  tickerMessage: string;
  selectedTemplate: string;
  templateOptions: Array<{ label: string; value: string; description: string }>;
  showQr: boolean;
  showWeather: boolean;
  showPrayer: boolean;
  onDisplayNameChange: (value: string) => void;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onTickerMessageChange: (value: string) => void;
  onTemplateChange: (value: string) => void;
  onToggleQr: () => void;
  onToggleWeather: () => void;
  onTogglePrayer: () => void;
}

export function TVWorkspaceControls({
  displayName,
  primaryColor,
  secondaryColor,
  tickerMessage,
  selectedTemplate,
  templateOptions,
  showQr,
  showWeather,
  showPrayer,
  onDisplayNameChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onTickerMessageChange,
  onTemplateChange,
  onToggleQr,
  onToggleWeather,
  onTogglePrayer,
}: TVWorkspaceControlsProps) {
  return (
    <>
      <div className="absolute right-4 top-4 z-50 w-[340px] rounded-2xl border border-white/15 bg-black/70 backdrop-blur p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-black">
          <Palette size={16} className="text-emerald-400" />
          Personnalisation TV
        </div>

        <label className="block text-xs text-slate-300">
          Nom de l'ecran
          <input
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="Mon Ecran"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs text-slate-300">
            Couleur client
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-white/10 border border-white/15 p-1"
            />
          </label>
          <label className="block text-xs text-slate-300">
            Couleur fond
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onSecondaryColorChange(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg bg-white/10 border border-white/15 p-1"
            />
          </label>
        </div>

        <label className="block text-xs text-slate-300">
          Message defilant
          <input
            value={tickerMessage}
            onChange={(e) => onTickerMessageChange(e.target.value)}
            className="mt-1 w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </label>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wider text-slate-300">Zone droite</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button className={`rounded-lg border px-2 py-2 ${showQr ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"}`} onClick={onToggleQr}>QR</button>
            <button className={`rounded-lg border px-2 py-2 ${showWeather ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"}`} onClick={onToggleWeather}>Meteo</button>
            <button className={`rounded-lg border px-2 py-2 ${showPrayer ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"}`} onClick={onTogglePrayer}>Priere</button>
          </div>
        </div>
      </div>

      <div className="absolute right-4 bottom-20 z-50 w-[340px] rounded-2xl border border-white/15 bg-black/65 backdrop-blur p-3 space-y-2">
        <p className="text-xs uppercase tracking-wider text-slate-300">Liste templates (preview reel TV)</p>
        <div className="space-y-2">
          {templateOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTemplateChange(option.value)}
              className={`w-full text-left rounded-xl border px-3 py-2 ${selectedTemplate === option.value ? "border-emerald-400 bg-emerald-500/15" : "border-white/15 bg-white/5"}`}
            >
              <p className="text-sm font-black">{option.label}</p>
              <p className="text-xs text-slate-300">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute right-4 bottom-4 z-50 w-[340px] rounded-2xl border border-white/15 bg-black/60 backdrop-blur p-3 space-y-2">
        <p className="text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <MonitorSmartphone size={14} />
          Widgets preview (UI)
        </p>
        <div className="grid grid-cols-1 gap-2 text-sm">
          {showQr && (
            <div className="rounded-lg bg-white/10 border border-white/15 p-2 flex items-center gap-2">
              <QrCode size={16} className="text-emerald-400" />
              QR Entreprise actif
            </div>
          )}
          {showWeather && (
            <div className="rounded-lg bg-white/10 border border-white/15 p-2 flex items-center gap-2">
              <CloudSun size={16} className="text-sky-300" />
              Meteo active (Casablanca 24C)
            </div>
          )}
          {showPrayer && (
            <div className="rounded-lg bg-white/10 border border-white/15 p-2 flex items-center gap-2">
              <MoonStar size={16} className="text-amber-300" />
              Priere active (prochain: Maghrib)
            </div>
          )}
        </div>
      </div>
    </>
  );
}