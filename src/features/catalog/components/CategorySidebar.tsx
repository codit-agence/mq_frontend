
import React from "react";
import { Category } from "@/src/types/catalogs/catalog_types";

interface CategorySidebarProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  productCount: (id: string) => number;
}

export const CategorySidebar = ({ 
  categories = [], // ✅ Valeur par défaut si prop est undefined
  selectedId, 
  onSelect, 
  productCount 
}: CategorySidebarProps) => {
  return (
    <aside className="lg:w-72 shrink-0">
      <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase mb-6 tracking-[0.2em] ml-2 ">
        Catégories
      </p>
      
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar select-none">
        {/* ✅ Utilisation du safe-access ou fallback */}
        {(categories || []).map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 flex items-center justify-between gap-3 px-6 py-5 rounded-[28px] transition-all border-2 ${
              selectedId === cat.id 
              ? "bg-white border-indigo-500 shadow-xl shadow-indigo-100/50 scale-[1.02]" 
              : "bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{cat.image || "🍽️"}</span>
              <span className={`font-bold text-[15px] whitespace-nowrap ${selectedId === cat.id ? "text-slate-900" : "text-slate-500"}`}>
                {cat.name}
              </span>
            </div>
            {selectedId === cat.id && (
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full">
                {productCount(cat.id)}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
};