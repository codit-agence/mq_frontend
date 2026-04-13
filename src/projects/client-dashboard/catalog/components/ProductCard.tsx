"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link"; 
import { Edit3, Trash2, CameraOff } from "lucide-react"; 
import { Product } from "@/src/types/catalogs/catalog_types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

interface ProductCardProps {
  product: Product;
  tenantId: string; 
  onDelete: (id: string) => void;
  disableActions?: boolean;
}

export const ProductCard = ({ product, tenantId, onDelete, disableActions = false }: ProductCardProps) => {
  return (
    <div className="group bg-slate-50 rounded-[35px] p-2 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
      <div className="p-4 flex flex-col h-full">
        
        {/* --- ZONE IMAGE --- */}
        <div className="relative w-full h-44 bg-white rounded-[28px] overflow-hidden mb-4 border border-slate-100">
          {product.image ? (
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
               
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-200">
              <CameraOff size={32} strokeWidth={1} />
              <span className="text-[8px] font-black uppercase mt-2 opacity-50">Pas d'image</span>
            </div>
          )}
          
          {/* Badge Statut */}
          {!product.is_active && (
            <div className="absolute top-3 right-3 bg-rose-500/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Épuisé
            </div>
          )}
        </div>
        
        {/* --- INFOS PRODUIT --- */}
        <div className="flex-1 px-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-black text-slate-900 text-base truncate flex-1">
              {product.name}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mb-4 line-clamp-2 h-8 leading-relaxed">
            {product.description || "Aucune description pour ce délice."}
          </p>
          
          <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-indigo-600 italic">
                {product.price} <small className="text-[10px] uppercase not-italic opacity-60">Mad</small>
              </span>
            </div>

            {/* --- ACTIONS --- */}
            {disableActions ? (
              <div className="flex items-center justify-center py-3.5 rounded-2xl border border-slate-200 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                Gestion désactivée
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/tenant/${tenantId}/menu/edit/${product.id}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-300 active:scale-95"
                >
                  <Edit3 size={14} />
                  Modifier
                </Link>
                
                <button 
                  onClick={() => onDelete(product.id)}
                  className="p-3.5 bg-white text-slate-300 rounded-2xl border border-slate-100 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 shadow-sm transition-all active:scale-90"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};