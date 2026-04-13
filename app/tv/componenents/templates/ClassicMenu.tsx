import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { TenantQrBadge } from "@/src/projects/client-dashboard/tv/components/TenantQrBadge";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const ClassicMenu: React.FC<Props> = ({ manifest, productIndex }) => {
  const current = manifest.products[productIndex];
  if (!current) return null;

  const primary = manifest.tenant.primary_color || "#34d399";
  const secondary = manifest.tenant.secondary_color || "#020617";
  const logoUrl = manifest.tenant.logo;
  const showPrices = manifest.tenant.show_prices !== false;

  return (
    <div
      className="h-screen w-screen text-white p-10 grid grid-cols-12 gap-8 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${secondary}, #0f172a)` }}
    >
      <div className="col-span-6 h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
        <img src={getImageUrl(current.image)} alt={current.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
      </div>

      <div className="col-span-4 flex flex-col justify-center space-y-8">
        <div>
          <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20" style={{ backgroundColor: `${primary}20`, color: primary }}>
            {manifest.category_name}
          </span>
          <h1 className="text-7xl font-black mt-6 leading-tight tracking-tighter italic">{current.name}</h1>
          <p className="text-2xl text-slate-400 mt-6 font-medium leading-relaxed line-clamp-3">
            {current.description || "Une experience culinaire unique preparee avec passion."}
          </p>
        </div>

        {showPrices && (
          <div>
            <p className="text-8xl font-black italic tracking-tighter" style={{ color: primary }}>
              {current.price} <span className="text-4xl uppercase opacity-80">Dh</span>
            </p>
          </div>
        )}
      </div>

      <div className="col-span-2 flex flex-col items-center justify-between py-12 px-4 rounded-[3rem] bg-white/10 backdrop-blur-md border border-white/10">
        <div className="w-24 h-24 bg-white rounded-[2rem] p-4 flex items-center justify-center shadow-xl">
          {logoUrl ? (
            <img src={getImageUrl(logoUrl)} alt="Logo" className="w-full h-full object-contain" />
          ) : (
            <span className="text-3xl">Logo</span>
          )}
        </div>

        <div className="text-center">
          <h2 className="text-xl font-black text-white uppercase break-words">{manifest.tenant.name}</h2>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-28">
            <TenantQrBadge manifest={manifest} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scanner pour commander</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicMenu;
