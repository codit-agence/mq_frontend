// IdentityTab.tsx
"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";

export default function IdentityTab() {
  const { formData, setField } = useSettingsStore();
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files?.[0]) {
      setField(field, e.target.files[0]);
    }
  };

  const getLogoPreview = () => {
    const logo = formData.logo as any; 
    if (!logo) return null;
    if (typeof logo === 'object' && logo instanceof File) {
      return URL.createObjectURL(logo);
    }
    return logo; 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 1. SECTION LOGO */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600 text-xs">🖼️</span>
          Image de marque
        </h3>
        <div className="flex items-center space-x-6 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-24 w-24 bg-white rounded-2xl border shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
            {formData.logo ? (
              <img 
                src={getLogoPreview()} 
                className="object-cover h-full w-full" 
                alt="Logo preview"
              />
            ) : (
              <span className="text-4xl text-gray-200">🏪</span>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-2 text-gray-700">Logo officiel</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFile(e, 'logo')}
              className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer transition-all"
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">Format carré recommandé (PNG ou JPG)</p>
          </div>
        </div>
      </section>

      {/* 2. SECTION IDENTIFICATION (SLUG) */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600 text-xs">🔗</span>
          Lien de votre menu
        </h3>
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 shadow-lg">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Adresse publique (Slug)</label>
          <div className="flex items-center text-gray-400 font-mono text-sm overflow-hidden">
            <span className="opacity-50">smartmenu.ma/</span>
            <span className="font-bold text-yellow-500">{formData.slug || "votre-restaurant"}</span>
            <span className="ml-auto text-[9px] bg-white/10 text-white/50 px-2 py-1 rounded-md border border-white/5 whitespace-nowrap">
              VÉRIFIÉ & FIXE
            </span>
          </div>
        </div>
      </section>

      {/* 3. INFORMATIONS GÉNÉRALES */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-green-100 p-1.5 rounded-lg text-green-600 text-xs">📝</span>
          Détails de l'établissement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Nom de l'établissement</label>
            <input 
              type="text" 
              value={formData.name || ""} 
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Ex: Le Petit Bistro"
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Ville</label>
            <input 
              type="text" 
              value={formData.city || ""} 
              onChange={(e) => setField('city', e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Pays</label>
            <input 
              type="text" 
              value={formData.country || "Morocco"} 
              onChange={(e) => setField('country', e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1.5 text-gray-700">Adresse complète</label>
            <textarea 
              rows={3}
              value={formData.address || ""} 
              onChange={(e) => setField('address', e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:bg-white outline-none transition-all shadow-sm resize-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}