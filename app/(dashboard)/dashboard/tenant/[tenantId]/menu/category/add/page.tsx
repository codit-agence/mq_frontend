"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { CategoryForm } from "@/src/projects/client-dashboard/catalog/components/CategoryForm";

export default function AddCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();
  const isOwner = tenant?.role === "owner";
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as string[];

  if (readonlyMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xl">
          <h1 className="text-3xl font-black text-rose-600 mb-4">Accès restreint</h1>
          <p className="text-sm text-slate-600 mb-8">Le catalogue est verrouillé pour les clients. Seuls les propriétaires peuvent créer des catégories.</p>
          <button onClick={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)} className="px-8 py-4 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.2em]">Retour au menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 pb-40">
      <div className="flex items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Nouvelle catégorie</h1>
          <p className="text-sm text-slate-500 mt-2">Créez une nouvelle catégorie pour votre catalogue.</p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 transition"
        >
          Retour au menu
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">
            Champs obligatoires multilingues
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Pour enregistrer une categorie, vous devez remplir `Nom` dans chaque langue active ({activeLanguages.join(", ")}),
            ou modifier `Active languages` dans Parametres &gt; Design.
          </p>
        </div>
        <CategoryForm onSuccess={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)} />
      </div>
    </div>
  );
}
