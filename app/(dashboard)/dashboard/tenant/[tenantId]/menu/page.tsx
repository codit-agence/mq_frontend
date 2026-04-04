"use client";

import React, { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, Search, ArrowLeft, Package, Layers, 
  EyeOff, Settings2, Loader2, X 
} from "lucide-react";

// Components
import { CategorySidebar } from "@/src/features/catalog/components/CategorySidebar";
import { ProductCard } from "@/src/features/catalog/components/ProductCart"; 
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { CategoryForm } from "@/src/features/catalog/components/CategoryForm";

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

export default function MenuPage({ params }: { params: Promise<{ tenantId: string }> }) {
  // Déballe l'ID du tenant depuis les params
  const { tenantId } = use(params);
  const router = useRouter();
  const { tenant } = useAuthStore();
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const { products, categories, fetchCatalog, deleteProduct, loading } = useCatalogStore();

  // Synchronisation initiale
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");


  // Fermeture automatique du drawer
  const handleCategorySuccess = () => {
    setIsCategoryDrawerOpen(false);
  };

  // Stats calculées
  const stats = useMemo(() => ({
    total: products.length,
    cats: categories.length,
    inactive: products.filter(p => !p.is_active).length
  }), [products, categories]);

  // Filtrage intelligent
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCatId ? p.category_id === selectedCatId : true;
      const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCatId, searchQuery]);

  // Handler de suppression avec confirmation (Sécurité Backend)
  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await deleteProduct(productId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[50]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all border border-slate-100"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-8 w-[1px] bg-slate-100 mx-2" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm uppercase shadow-inner">
                {tenant?.name ? tenant.name.charAt(0) : "M"}
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-slate-900 text-sm md:text-base uppercase tracking-tight leading-none">
                  {tenant?.name || "Chargement..."}
                </h1>
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                  Menu Manager
                </span>
              </div>
            </div>
          </div>
          
          <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings2 size={20} />
          </button>
        </div>
      </header>

      {/* --- STATS SECTION --- */}
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
               <Link 
                href={`/dashboard/tenant/${tenantId}/menu/add`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
               >
                 <Plus size={14} /> Produit
               </Link>
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
            <Link href={`/dashboard/tenant/${tenantId}/menu/add`} className="flex-1 bg-indigo-600 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
              <Plus size={14} /> Produit
            </Link>
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
          </div>

          {/* Grid Produits */}
          <section className="flex-1">
  {loading ? (
    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-100 gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mise à jour du catalogue...</p>
    </div>
  ) : filteredProducts.length > 0 ? ( // Correction ici
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
    <p className="text-slate-400 font-medium">Aucun produit trouvé</p>
  </div>
);