"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, Package, Layers, 
  EyeOff, Loader2, X 
} from "lucide-react";

// Components
import { CategorySidebar } from "@/src/features/catalog/components/CategorySidebar";
import { ProductCard } from "@/src/features/catalog/components/ProductCart"; 
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { CategoryForm } from "@/src/features/catalog/components/CategoryForm";
import { useCurrentTenant } from "@/src/features/account/useCurrentTenant";
import toast from "react-hot-toast";

// UI Components
const StatMiniCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white border border-slate-100 p-4 rounded-[20px] flex items-center gap-3 shadow-sm flex-1 min-w-[140px]">
    <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-10 flex items-center justify-center ${color.replace('bg-', 'text-')}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-lg font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

export default function EditPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = use(params);
  const router = useRouter();
  const { tenant } = useCurrentTenant();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const { products, categories, fetchCatalog, deleteProduct, loading } = useCatalogStore();

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySuccess = () => {
    setIsCategoryDrawerOpen(false);
    toast.success("Catégorie mise à jour");
  };

  const stats = useMemo(() => ({
    total: products.length,
    cats: categories.length,
    inactive: products.filter(p => !p.is_active).length
  }), [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCatId ? p.category_id === selectedCatId : true;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCatId, searchQuery]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await deleteProduct(productId);
      toast.success("Produit supprimé");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* --- STATS & ACTIONS SECTION --- */}
      <section className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <StatMiniCard icon={Package} label="Produits" value={stats.total} color="bg-indigo-500" />
            <StatMiniCard icon={Layers} label="Catégories" value={stats.cats} color="bg-emerald-500" />
            <StatMiniCard icon={EyeOff} label="Inactifs" value={stats.inactive} color="bg-rose-500" />
            
            <div className="hidden md:flex flex-1 justify-end gap-3">
              <button 
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="px-6 py-3 border-2 border-slate-100 rounded-[18px] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Catégorie
              </button>
              
              {categories && categories.length > 0 ? (
                <Link 
                  href={`/dashboard/tenant/${tenantId}/menu/add`}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  <Plus size={14} /> Produit
                </Link>
              ) : (
                <button 
                  onClick={() => toast.error("Veuillez d'abord créer une catégorie")}
                  className="px-6 py-3 bg-slate-100 text-slate-400 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Produit
                  <span className="ml-1 text-[8px] normal-case font-bold bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                    Ajoutez une catégorie d'abord
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        
        {/* Search & Mobile Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex md:hidden gap-2">
            <button onClick={() => setIsCategoryDrawerOpen(true)} className="flex-1 bg-white border border-slate-200 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <Plus size={14} /> Catégorie
            </button>
            {/* Logique mobile pour le bouton produit */}
            {categories.length > 0 ? (
              <Link href={`/dashboard/tenant/${tenantId}/menu/add`} className="flex-1 bg-indigo-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 text-center">
                <Plus size={14} /> Produit
              </Link>
            ) : (
              <button onClick={() => toast.error("Créez d'abord une catégorie")} className="flex-1 bg-slate-100 text-slate-400 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <Plus size={14} /> Produit
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <CategorySidebar 
              categories={categories} 
              selectedId={selectedCatId} 
              onSelect={setSelectedCatId} 
              productCount={(catId) => products.filter(p => p.category_id === catId).length}
            />
          </aside>

          {/* Grid Produits */}
          <section className="flex-1">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-100 gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mise à jour du catalogue...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    tenantId={tenantId}
                    onEdit={() => router.push(`/dashboard/tenant/${tenantId}/menu/edit/${p.id}`)}
                    onDelete={() => handleDeleteProduct(p.id)} 
                  />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>

      {/* --- CATEGORY DRAWER --- */}
      {isCategoryDrawerOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsCategoryDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black italic text-slate-900">Catégories<span className="text-indigo-600">.</span></h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Éditer le catalogue</p>
              </div>
              <button 
                onClick={() => setIsCategoryDrawerOpen(false)} 
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <CategoryForm onSuccess={handleCategorySuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const EmptyState = () => (
  <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200">
    <Package className="text-slate-200 mb-2" size={40} />
    <p className="text-slate-400 font-medium text-sm">Aucun produit trouvé</p>
  </div>
);