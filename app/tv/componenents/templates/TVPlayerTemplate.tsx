import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { Clock, QrCode, Phone } from "lucide-react";
import { TenantQrBadge } from "@/src/projects/client-dashboard/tv/components/TenantQrBadge";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const TVPlayerTemplate: React.FC<Props> = ({ manifest, productIndex }) => {
  const current = manifest.products[productIndex];
  if (!current) return null;

  const primary = manifest.tenant.primary_color || "#22c55e";
  const secondary = manifest.tenant.secondary_color || "#0f172a";
  const brandName = manifest.tenant.name_override || manifest.tenant.name || "Mon Etablissement";
  const showPrices = manifest.tenant.show_prices !== false;
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className="h-screen w-screen overflow-hidden text-white grid"
      style={{
        gridTemplateColumns: "1fr 20%",
        gridTemplateRows: "10% 1fr 10%",
        background: `linear-gradient(135deg, ${secondary}, #020617)`,
      }}
    >
      <header
        className="col-start-1 row-start-1 border-b border-white/10 flex items-center justify-between bg-black/35"
        style={{ paddingInline: "clamp(10px, 1.6vw, 24px)" }}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white overflow-hidden">
            <img src={getImageUrl(manifest.tenant.logo)} alt="logo" className="h-full w-full object-cover" />
          </div>
          <p className="font-black truncate" style={{ fontSize: "clamp(12px, 1.6vw, 24px)" }}>{brandName}</p>
        </div>
        <p className="font-bold text-slate-200 truncate" style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}>{manifest.category_name}</p>
      </header>

      <aside
        className="col-start-2 row-start-1 row-span-3 border-l border-white/10 bg-black/40 flex flex-col justify-between min-h-0"
        style={{ padding: "clamp(8px, 1.2vw, 16px)" }}
      >
        <div className="space-y-3">
          <div className="rounded-xl bg-white/10 border border-white/15 p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-300">Etat</p>
            <p className="mt-1 text-sm font-black text-emerald-300">En ligne</p>
          </div>
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
              <Phone size={12} /> Contact
            </p>
            <p className="mt-1 text-sm font-bold">{manifest.tenant.tel || manifest.tenant.phone || "-"}</p>
          </div>
        </div>
      </aside>

      <main
        className="col-start-1 row-start-2 grid grid-cols-12 min-h-0"
        style={{ padding: "clamp(10px, 1.4vw, 24px)", gap: "clamp(8px, 1.2vw, 24px)" }}
      >
        <div className="col-span-7 rounded-[1.5rem] overflow-hidden border border-white/10">
          <img src={getImageUrl(current.image)} alt={current.name} className="h-full w-full object-cover" />
        </div>
        <div className="col-span-5 flex flex-col justify-between min-h-0">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300 font-black">Produit du moment</p>
            <h1 className="font-black mt-3 leading-tight" style={{ fontSize: "clamp(18px, 4vw, 56px)" }}>{current.name}</h1>
            <p className="text-slate-200 mt-3" style={{ fontSize: "clamp(12px, 1.4vw, 22px)" }}>
              {current.description || "Selection du chef"}
            </p>
          </div>
          {showPrices && (
            <p className="font-black" style={{ color: primary, fontSize: "clamp(24px, 4.5vw, 68px)" }}>
              {current.price} Dh
            </p>
          )}
        </div>
      </main>

      <footer className="col-start-1 row-start-3 border-t border-white/10 bg-black/60 overflow-hidden">
        <div className="h-full flex items-center whitespace-nowrap tv-ticker">
          <span className="px-8 text-sm font-black" style={{ color: primary }}>
            Bienvenue chez {brandName} - Menu digital en direct - Bon appetit
          </span>
          <span className="px-8 text-sm font-black" style={{ color: primary }}>
            Bienvenue chez {brandName} - Menu digital en direct - Bon appetit
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

export default TVPlayerTemplate;
