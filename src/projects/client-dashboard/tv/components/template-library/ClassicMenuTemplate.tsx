import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const ClassicMenuTemplate: React.FC<Props> = ({ manifest, productIndex }) => {
  const current = manifest.products[productIndex];
  if (!current) return null;

  const primary = manifest.tenant.primary_color || "#34d399";
  const secondary = manifest.tenant.secondary_color || "#020617";

  return (
    <div
      className="h-screen w-screen text-white p-10 grid grid-cols-12 gap-8"
      style={{ background: `linear-gradient(135deg, ${secondary}, #0f172a)` }}
    >
      <div className="col-span-7 h-full rounded-[2rem] overflow-hidden border border-white/10">
        <img src={getImageUrl(current.image)} alt={current.name} className="w-full h-full object-cover" />
      </div>
      <div className="col-span-5 flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-black">{manifest.category_name}</p>
          <h1 className="text-6xl font-black mt-3 leading-tight">{current.name}</h1>
          <p className="text-xl text-slate-300 mt-4">{current.description || "Suggestion du chef"}</p>
        </div>
        <div>
          <p className="text-7xl font-black" style={{ color: primary }}>{current.price} Dh</p>
          <p className="text-sm text-slate-500 mt-2">{manifest.tenant.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ClassicMenuTemplate;
