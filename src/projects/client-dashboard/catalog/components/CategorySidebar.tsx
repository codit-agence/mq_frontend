"use client";

import React from "react";
import { Category } from "@/src/types/catalogs/catalog_types";
import { Edit3, Trash2 } from "lucide-react";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

interface CategorySidebarProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onEdit: (cat: Category) => void;      // ✅ Action pour modifier
  onDelete: (id: string) => void;        // ✅ Action pour supprimer
  productCount: (id: string) => number;
  showActions?: boolean;
}

export const CategorySidebar = ({ 
  categories = [], 
  selectedId,
  onSelect, 
  onEdit,
  onDelete,
  productCount,
  showActions = true,
}: CategorySidebarProps) => {
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const text = locale === "ar"
    ? {
        title: "التصنيفات",
        reset: "إعادة الضبط",
        edit: "تعديل",
        delete: "حذف",
        empty: "لا توجد مجموعات\nمهيأة",
      }
    : {
        title: "Categories",
        reset: "Reinitialiser",
        edit: "Modifier",
        delete: "Supprimer",
        empty: "Aucun groupe\nconfigure",
      };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="flex items-center justify-between mb-6 px-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {text.title}
        </p>
        {selectedId && (
          <button 
            onClick={() => onSelect(null)}
            className="text-[9px] font-black text-indigo-600 uppercase hover:underline animate-in fade-in"
          >
            {text.reset}
          </button>
        )}
      </div>
      
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar select-none">
        {categories.map((cat) => (
          <div key={cat.id} className="relative group flex-shrink-0 lg:w-full">
            <button
              onClick={() => onSelect(cat.id)}
              className={`w-full flex items-center justify-between gap-3 px-6 py-5 rounded-[28px] transition-all border-2 ${
                selectedId === cat.id 
                ? "bg-white border-indigo-500 shadow-xl shadow-indigo-100/50 scale-[1.02]" 
                : "bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl transition-transform group-hover:scale-110 duration-300">
                  {cat.image || "🍽️"}
                </span>
                <span className={`font-bold text-[14px] whitespace-nowrap transition-colors ${
                  selectedId === cat.id ? "text-slate-900" : "text-slate-500"
                }`}>
                  {cat.name}
                </span>
              </div>
              
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-colors ${
                selectedId === cat.id ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
              }`}>
                {productCount(cat.id)}
              </span>
            </button>

            {showActions && (
              <div className="absolute top-1/2 -translate-y-1/2 -right-2 hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-300 z-10 pl-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(cat); }}
                  className="p-2.5 bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all"
                  title={text.edit}
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(cat.id); }}
                  className="p-2.5 bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-rose-600 hover:scale-110 transition-all"
                  title={text.delete}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[35px] bg-slate-50/50">
            <p className="text-[10px] font-black text-slate-300 uppercase leading-relaxed tracking-widest">
              {text.empty.split("\n")[0]}<br/>{text.empty.split("\n")[1]}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};