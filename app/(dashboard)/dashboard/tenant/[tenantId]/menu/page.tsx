// app/dashboard/tenant/[tenantId]/menu/page.tsx
"use client";

import React, { useState, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Layers, EyeOff, Loader2, Plus } from "lucide-react";
import toast from "react-hot-toast";

// Composants & Stores
import { CategorySidebar } from "@/src/projects/client-dashboard/catalog/components/CategorySidebar";
import { ProductCard } from "@/src/projects/client-dashboard/catalog/components/ProductCard";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { EmptyState, LoadingState, StatMiniCard } from "@/src/projects/client-dashboard/catalog/components/UI/LocalUi";

export default function MenuPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const resolvedParams = use(params);
  const tenantId = resolvedParams.tenantId;

  // --- ÉTATS UI ---
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- STORE (Lecture seule + Actions directes) ---
  const router = useRouter();
  const { products, categories, loading, deleteProduct, deleteCategory } = useCatalogStore();
  const { formData } = useSettingsStore();
  const { tenant } = useAuthStore();
  const isOwner = tenant?.role === 'owner';
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;

  // --- LOGIQUE FILTRAGE (Optimisée pour le scale) ---
  const filteredProducts = useMemo(() => {
    const search = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchesCat = !selectedCatId || p.category_id === selectedCatId;
      const matchesSearch = !search || p.name?.toLowerCase().includes(search);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCatId, searchQuery]);

  const stats = useMemo(() => ({
    total: products.length,
    cats: categories.length,
    inactive: products.filter(p => !p.is_active).length
  }), [products, categories]);

  const catalogEnabled = false;

  // --- HANDLERS ---
  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try {
      await deleteCategory(id);
      toast.success("Supprimé");
    } catch (err) {
      toast.error("Erreur");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <header className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-wrap items-center gap-4">
          <StatMiniCard icon={Package} label="Produits" value={stats.total} color="bg-indigo-500" />
          <StatMiniCard icon={Layers} label="Catégories" value={stats.cats} color="bg-emerald-500" />
          <StatMiniCard icon={EyeOff} label="Inactifs" value={stats.inactive} color="bg-rose-500" />

          <div className="flex-1 flex flex-wrap justify-end items-center gap-3">
            {!readonlyMode && (
              <>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/tenant/${tenantId}/menu/add`)}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-black text-white transition hover:bg-indigo-700"
                >
                  <Plus size={14} />
                  Nouveau produit
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/tenant/${tenantId}/menu/category/add`)}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  <Plus size={14} />
                  Nouvelle catégorie
                </button>
              </>
            )}
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">Gestion catalogue désactivée ici</div>
          </div>
        </div>
      </header>

      {readonlyMode && (
        <div className="max-w-[1600px] mx-auto px-8 py-4">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700 text-sm font-semibold">
            Le catalogue est verrouillé pour les clients. Seuls les propriétaires peuvent modifier, créer ou supprimer des produits et catégories.
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* Barre de recherche */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <CategorySidebar 
            categories={categories} 
            selectedId={selectedCatId} 
            onSelect={setSelectedCatId} 
            onEdit={(cat) => router.push(`/dashboard/tenant/${tenantId}/menu/category/edit/${cat.id}`)}
            onDelete={readonlyMode ? () => {} : handleDeleteCategory}
            productCount={(id) => products.filter(p => p.category_id === id).length}
            showActions={!readonlyMode}
          />
          {/* section Produits */}
          <section className="flex-1">
            {loading ? <LoadingState /> : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    tenantId={tenantId}
                    onDelete={readonlyMode ? () => {} : () => deleteProduct(p.id)} 
                    disableActions={readonlyMode}
                  />
                ))}
              </div>
            ) : <EmptyState />}
          </section>
        </div>
      </main>

    </div>
  );
}