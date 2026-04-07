"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";
import { useEffect, useState } from "react";

export default function BusinessTab() {
  const { formData, setField } = useSettingsStore();
  const [preview, setPreview] = useState<string | null>(null);

  const isFile = (value: any): value is File => {
  return value instanceof File;
  };// Helper pour mettre à jour l'objet imbriqué tenant_settings

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

  // Gestion intelligente de la preview
  useEffect(() => {
   const img = formData.tenant_settings?.cover_image;

  if (isFile(img)) {
    const objectUrl = URL.createObjectURL(img);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

    if (typeof img === 'string') {
      setPreview(img);
    } else {
      setPreview(null);
    }
  }, [formData.tenant_settings?.cover_image]);

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
              className="w-5 h-5 accent-yellow-500 rounded"
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
          {preview ? (
            <img src={preview} className="object-cover w-full h-full" alt="Cover" />
          ) : (
            <p className="text-gray-400 text-sm">Cliquez pour ajouter une bannière</p>
          )}
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
        <h3 className="text-lg font-semibold">🕒 Horaires de service</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Ouverture</label>
            <input 
              type="time" 
              value={formData.tenant_settings?.work_start || "09:00"}
              onChange={(e) => updateSettings({ work_start: e.target.value })}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-yellow-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Fermeture</label>
            <input 
              type="time" 
              value={formData.tenant_settings?.work_end || "23:00"}
              onChange={(e) => updateSettings({ work_end: e.target.value })}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-yellow-500 outline-none" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}