"use client";

import React from "react";
import Image from "next/image";
// ✅ Import de Link depuis Next.js
import Link from "next/link"; 
// ✅ Retire Link de lucide-react
import { Edit3, Pencil, Trash2 } from "lucide-react"; 
import { Product, ProductUpdate } from "@/src/types/catalogs/catalog_types";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

interface ProductCardProps {
  product: Product;
  tenantId: string; 
  categoryIcon?: string;
  onEdit: (product: ProductUpdate) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ 
  product, 
  categoryIcon, 
  tenantId,
  onEdit, 
  onDelete 
}: ProductCardProps) => {
  return (
    <div className="group bg-slate-50 rounded-[35px] p-2 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
      <div className="p-4 flex flex-col h-full">
        
        {/* --- ZONE IMAGE --- */}
        <div className="relative w-full h-40 bg-white rounded-[28px] overflow-hidden mb-4 border border-slate-100">
          {product.image ? (
            <Image 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl grayscale opacity-30 bg-slate-50">
              {categoryIcon || "🍔"}
            </div>
          )}
          
          {!product.is_active && (
            <div className="absolute top-3 right-3 bg-rose-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
              Épuisé
            </div>
          )}
        </div>
        
        {/* --- INFOS PRODUIT --- */}
        <div className="flex-1 px-1">
          <h4 className="font-black text-slate-900 text-base mb-1 truncate">
            {product.name}
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mb-4 line-clamp-2 h-8">
            {product.description || "Aucune description fournie pour ce plat."}
          </p>
          
          <div className="flex flex-col gap-4 pt-2 border-t border-slate-100/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-600 italic">
                {product.price} <small className="text-[10px] uppercase not-italic opacity-70">MAD</small>
              </span>
            </div>

            {/* --- ACTIONS CORRIGÉES --- */}
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/tenant/${tenantId}/menu/edit/${product.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Edit3 size={14} />
                Modifier
              </Link>
                
              <button 
                onClick={() => onDelete(product.id)}
                className="p-3 bg-white text-slate-400 rounded-xl border border-slate-100 hover:text-rose-500 hover:border-rose-200 shadow-sm transition-all active:scale-90"
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};