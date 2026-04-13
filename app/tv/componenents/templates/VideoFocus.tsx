import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { TenantQrBadge } from "@/src/projects/client-dashboard/tv/components/TenantQrBadge";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const VideoFocus: React.FC<Props> = ({ manifest, productIndex }) => {
  const current = manifest.products[productIndex];
  if (!current) return null;

  const primary = manifest.tenant.primary_color || "#facc15";
  const secondary = manifest.tenant.secondary_color || "#dc2626";
  const showPrices = manifest.tenant.show_prices !== false;

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <img src={getImageUrl(current.image)} alt={current.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

      <div className="relative z-10 h-full max-w-[45vw] p-12 flex flex-col justify-center text-white">
        <p className="text-xs uppercase tracking-[0.25em] font-black" style={{ color: secondary }}>
          Offre du moment
        </p>
        <h1 className="text-6xl font-black leading-tight mt-3">{current.name}</h1>
        <p className="text-xl text-slate-200 mt-4">{current.description || "Decouvrez notre selection premium."}</p>
        {showPrices && <p className="text-7xl font-black mt-8" style={{ color: primary }}>{current.price} Dh</p>}
      </div>

      <div
        className="absolute right-8 bottom-8 px-5 py-3 rounded-2xl text-white text-sm font-black uppercase tracking-widest"
        style={{ backgroundColor: secondary }}
      >
        Live Menu
      </div>

      <div className="absolute right-8 top-8 w-28 rounded-[1.5rem] bg-black/45 backdrop-blur-md border border-white/10 p-3 z-20">
        <p className="text-[9px] uppercase font-black tracking-[0.25em] text-white/60 text-center">Scan Menu</p>
        <TenantQrBadge manifest={manifest} />
      </div>
    </div>
  );
};

export default VideoFocus;
