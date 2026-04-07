"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";

export default function DesignTab() {
  const { formData, setField } = useSettingsStore();

  const updateDisplay = (updates: any) => {
    setField('display_settings', {
      ...(formData.display_settings || {}),
      ...updates
    });
  };

  const primaryColor = formData.display_settings?.primary_color || "#EAB308";

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
          <span className="bg-purple-100 p-1.5 rounded-lg text-purple-600 text-xs">🎨</span>
          Style & Apparence
        </h3>
        <p className="text-sm text-gray-500">Configurez l'ambiance visuelle de votre menu digital.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CONFIGURATION COLUMN */}
        <div className="space-y-6">
          {/* Couleur de la marque */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">Couleur principale</label>
            <div className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-gray-200">
              <input 
                type="color" 
                value={primaryColor}
                onChange={(e) => updateDisplay({ primary_color: e.target.value })}
                className="h-12 w-12 border-none rounded-lg cursor-pointer bg-transparent"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase">Code Hex</span>
                <span className="text-sm font-mono font-bold uppercase">{primaryColor}</span>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">Modèle d'affichage</label>
            <div className="space-y-2">
              {[
                { id: 'modern', name: 'Moderne', desc: 'Grille d\'images dynamique' },
                { id: 'classic', name: 'Classique', desc: 'Liste épurée type brasserie' },
                { id: 'luxury', name: 'Luxe', desc: 'Minimaliste & élégant' },
              ].map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => updateDisplay({ template: tpl.id })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    (formData.display_settings?.template || 'modern') === tpl.id
                    ? "bg-white border-yellow-500 shadow-md ring-2 ring-yellow-500/10"
                    : "bg-white/50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800">{tpl.name}</p>
                    <p className="text-[11px] text-gray-500">{tpl.desc}</p>
                  </div>
                  {(formData.display_settings?.template || 'modern') === tpl.id && (
                    <span className="text-yellow-500 text-xl">✨</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PREVIEW COLUMN (PRO) */}
        <div className="flex flex-col justify-center bg-gray-900 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl min-h-[300px]">
            {/* Décoration d'arrière-plan */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full"></div>
            
            <p className="text-[10px] font-bold text-gray-500 mb-6 uppercase tracking-widest">Aperçu en temps réel</p>
            
            <div className="space-y-6">
                {/* Simulation d'un élément du menu */}
                <div className="bg-white rounded-2xl p-4 shadow-lg mx-auto max-w-[220px]">
                    <div className="w-full h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center text-2xl">🍕</div>
                    <div className="h-3 w-2/3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-gray-100 rounded mb-4"></div>
                    
                    {/* LE BOUTON QUI CHANGE DE COULEUR */}
                    <button 
                        style={{ backgroundColor: primaryColor }}
                        className="w-full py-2 rounded-lg text-white text-[10px] font-bold shadow-sm transition-all duration-300"
                    >
                        AJOUTER AU PANIER
                    </button>
                </div>
                
                <p className="text-xs text-gray-400 italic">
                    Le modèle <span className="text-white font-bold">"{formData.display_settings?.template || 'modern'}"</span> est actif
                </p>
            </div>
        </div>

      </div>

      {/* OPTIONS AVANCÉES (Typographie & Langue) */}
      <section className="pt-6 border-t border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-semibold mb-2 text-gray-700">Police de caractères (Font)</label>
               <select 
                  value={formData.display_settings?.font_family || "Inter"}
                  onChange={(e) => updateDisplay({ font_family: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
               >
                  <option value="Inter">Inter (Moderne)</option>
                  <option value="Poppins">Poppins (Arrondi)</option>
                  <option value="Playfair Display">Playfair (Luxe)</option>
               </select>
            </div>
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl self-end">
               <input 
                  type="checkbox"
                  id="is_rtl"
                  checked={formData.display_settings?.is_rtl || false}
                  onChange={(e) => updateDisplay({ is_rtl: e.target.checked })}
                  className="w-5 h-5 accent-yellow-500 rounded"
               />
               <label htmlFor="is_rtl" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Activer le mode Arabe (RTL)
               </label>
            </div>
         </div>
      </section>
    </div>
  );
}