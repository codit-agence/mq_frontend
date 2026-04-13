import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { Clock, CloudSun, MoonStar, QrCode } from "lucide-react";
import { TenantQrBadge } from "@/src/projects/client-dashboard/tv/components/TenantQrBadge";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const DisplayTemplate: React.FC<Props> = ({ manifest, productIndex }) => {
  const primary = manifest.tenant.primary_color || "#22c55e";
  const secondary = manifest.tenant.secondary_color || "#0f172a";
  const brandName = manifest.tenant.name_override || manifest.tenant.name || "Mon Etablissement";
  const showPrices = manifest.tenant.show_prices !== false;
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const products = manifest.products.length
    ? [...manifest.products.slice(productIndex), ...manifest.products.slice(0, productIndex)].slice(0, 4)
    : [];

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white grid"
      style={{
        gridTemplateColumns: "1fr 20%",
        gridTemplateRows: "10% 1fr 10%",
        background: `linear-gradient(140deg, ${secondary}, #000)`,
      }}
    >
      <header
        className="col-start-1 row-start-1 border-b border-white/10 flex items-center justify-between bg-black/35"
        style={{ paddingInline: "clamp(10px, 1.6vw, 24px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white overflow-hidden">
            <img src={getImageUrl(manifest.tenant.logo) || "/mq/petitdejeuner.jpg"} alt="logo" className="h-full w-full object-cover" />
          </div>
          <p className="font-black truncate" style={{ fontSize: "clamp(12px, 1.6vw, 24px)" }}>{brandName}</p>
        </div>
        <p className="font-bold text-slate-200 truncate" style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}>{manifest.category_name}</p>
      </header>

      <aside
        className="col-start-2 row-start-1 row-span-3 border-l border-white/10 bg-black/45 flex flex-col justify-between min-h-0"
        style={{ padding: "clamp(8px, 1.2vw, 16px)" }}
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-white/10 border border-white/15 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Clock size={12} /> Heure
            </p>
            <p className="mt-1 text-lg font-black">{now}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <QrCode size={12} /> QR Entreprise
            </p>
            <TenantQrBadge manifest={manifest} />
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <CloudSun size={12} /> Meteo
            </p>
            <p className="mt-1 text-sm font-bold">24C - Soleil</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/15 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <MoonStar size={12} /> Priere
            </p>
            <p className="mt-1 text-sm font-bold">Maghrib 19:02</p>
          </div>
        </div>
      </aside>

      <main
        className="col-start-1 row-start-2 grid grid-cols-2 grid-rows-2 min-h-0"
        style={{ padding: "clamp(10px, 1.2vw, 20px)", gap: "clamp(8px, 1vw, 16px)" }}
      >
        {products.map((item) => (
          <div key={item.id} className="relative rounded-[1.25rem] overflow-hidden border border-white/10">
            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-3">
              <p className="font-black leading-tight" style={{ fontSize: "clamp(12px, 1.8vw, 28px)" }}>{item.name}</p>
              {showPrices && <p className="font-black" style={{ color: primary, fontSize: "clamp(11px, 1.2vw, 16px)" }}>{item.price} Dh</p>}
            </div>
          </div>
        ))}
      </main>

      <footer className="col-start-1 row-start-3 border-t border-white/10 bg-black/60 overflow-hidden">
        <div className="h-full flex items-center whitespace-nowrap tv-ticker">
          <span className="px-8 text-sm font-black" style={{ color: primary }}>
            {brandName} - Promotions en cours - Consultez notre menu digital
          </span>
          <span className="px-8 text-sm font-black" style={{ color: primary }}>
            {brandName} - Promotions en cours - Consultez notre menu digital
          </span>
        </div>
      </footer>

      <style jsx>{`
        .tv-ticker {
          animation: tv-ticker 20s linear infinite;
          width: max-content;
        }
        @keyframes tv-ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default DisplayTemplate;
