import { useSettingsStore } from "../../../../../src/features/settings/store/useSettingStore";

export default function BusinessTab() {
  const { formData, setField } = useSettingsStore();

  const currencies = [
    { code: 'MAD', symbol: 'DH', label: 'Dirham Marocain' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'USD', symbol: '$', label: 'Dollar US' },
  ];

  const updateSettings = (updates: any) => {
    setField('tenant_settings', {
      ...(formData.tenant_settings || {}),
      ...updates
    });
  };

  // Helper corrigé pour éviter l'erreur instanceof
  const getCoverPreview = () => {
    // On cast en 'any' pour que TS accepte le test instanceof
    const img = formData.tenant_settings?.cover_image as any;
    
    if (!img) return null;

    // Vérification sécurisée
    if (typeof img === 'object' && img instanceof File) {
      return URL.createObjectURL(img);
    }
    
    // Si c'est déjà une string (URL du serveur)
    return img as string;
  };

  return (
    <div className="space-y-8">
      {/* Section Devise & Prix */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          💰 Paramètres de vente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Devise affichée</label>
            <select 
              value={formData.tenant_settings?.currency || "MAD"}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-yellow-500"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-3 pt-6">
            <input 
              type="checkbox"
              id="show_prices"
              checked={formData.tenant_settings?.show_prices ?? true}
              onChange={(e) => updateSettings({ show_prices: e.target.checked })}
              className="w-5 h-5 accent-yellow-500"
            />
            <label htmlFor="show_prices" className="text-sm font-medium cursor-pointer">
              Afficher les prix
            </label>
          </div>
        </div>
      </section>

      {/* Section Image de Couverture */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">🖼️ Image de couverture</h3>
        <div className="relative h-40 w-full bg-gray-100 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden group">
          {formData.tenant_settings?.cover_image ? (
            <img 
              src={getCoverPreview() || ""} 
              className="object-cover w-full h-full"
              alt="Cover"
            />
          ) : (
            <p className="text-gray-400 text-sm">Cliquez pour ajouter une bannière</p>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-white text-xs font-bold bg-black/50 px-4 py-2 rounded-full">Modifier</span>
          </div>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) updateSettings({ cover_image: file });
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </section>

      {/* Section Horaires */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">🕒 Horaires</h3>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="time" 
            value={formData.tenant_settings?.work_start || "09:00"}
            onChange={(e) => updateSettings({ work_start: e.target.value })}
            className="p-3 border rounded-xl" 
          />
          <input 
            type="time" 
            value={formData.tenant_settings?.work_end || "23:00"}
            onChange={(e) => updateSettings({ work_end: e.target.value })}
            className="p-3 border rounded-xl" 
          />
        </div>
      </section>
    </div>
  );
}