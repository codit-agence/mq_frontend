import React from "react";
import { TVManifest } from "@/src/projects/client-dashboard/tv/tv.types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

interface Props {
  manifest: TVManifest;
  productIndex: number;
}

const GridPromotionTemplate: React.FC<Props> = ({ manifest, productIndex }) => {
  const products = manifest.products;
  if (!products.length) return null;

  const primary = manifest.tenant.primary_color || "#f59e0b";
  const secondary = manifest.tenant.secondary_color || "#020617";
  const rotated = [...products.slice(productIndex), ...products.slice(0, productIndex)].slice(0, 4);

  return (
    <div
      className="h-screen w-screen p-6 grid grid-cols-2 grid-rows-2 gap-4"
      style={{ background: `linear-gradient(130deg, ${secondary}, #000)` }}
    >
      {rotated.map((item) => (
        <div key={item.id} className="relative rounded-[1.5rem] overflow-hidden border border-white/10">
          <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-sm uppercase font-black tracking-widest" style={{ color: primary }}>
              {manifest.category_name}
            </p>
            <h2 className="text-2xl text-white font-black leading-tight">{item.name}</h2>
            <p className="text-lg font-black" style={{ color: primary }}>{item.price} Dh</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridPromotionTemplate;
