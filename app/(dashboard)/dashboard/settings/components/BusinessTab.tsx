"use client";
import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";
import { useEffect, useState } from "react";

export default function BusinessTab() {
  const { formData, setField } = useSettingsStore();
  const [preview, setPreview] = useState<string | null>(null);

  const isFile = (value: any): value is File => value instanceof File;

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

  const updateSocial = (platform: string, url: string) => {
    const currentLinks = formData.tenant_settings?.social_links || {};
    updateSettings({
      social_links: { ...currentLinks, [platform]: url }
    });
  };

  useEffect(() => {
    const img = formData.tenant_settings?.cover_image;
    if (isFile(img)) {
      const objectUrl = URL.createObjectURL(img);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(typeof img === 'string' ? img : null);
  }, [formData.tenant_settings?.cover_image]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* 1. SECTION VENTE & DEVISE */}
      <section className="bg-white p-1 rounded-2xl">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600 text-xs">💰</span>
          Paramètres de vente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Devise du menu</label>
            <select 
              value={formData.tenant_settings?.currency || "MAD"}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.label} ({c.symbol})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm self-end">
            <label htmlFor="show_prices" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Afficher les prix aux clients
            </label>
            <input 
              type="checkbox"
              id="show_prices"
              checked={formData.tenant_settings?.show_prices ?? true}
              onChange={(e) => updateSettings({ show_prices: e.target.checked })}
              className="w-6 h-6 accent-yellow-500 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. SECTION IMAGE DE COUVERTURE */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600 text-xs">🖼️</span>
          Bannière du profil
        </h3>
        <div className="relative h-48 w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group hover:border-yellow-400 transition-colors">
          {preview ? (
            <>
              <img src={preview} className="object-cover w-full h-full" alt="Cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-bold bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30">Changer l'image</p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="text-3xl block mb-2">📸</span>
              <p className="text-gray-400 text-sm font-medium">Recommandé : 1200 x 400px</p>
            </div>
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

      {/* 3. SECTION HORAIRES */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-green-100 p-1.5 rounded-lg text-green-600 text-xs">🕒</span>
          Disponibilité
        </h3>
        <div className="flex gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">OUVERTURE</label>
            <input 
              type="time" 
              value={formData.tenant_settings?.work_start || "09:00"}
              onChange={(e) => updateSettings({ work_start: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">FERMETURE</label>
            <input 
              type="time" 
              value={formData.tenant_settings?.work_end || "23:00"}
              onChange={(e) => updateSettings({ work_end: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-yellow-500 outline-none" 
            />
          </div>
        </div>
      </section>

      {/* 4. SECTION RÉSEAUX SOCIAUX */}
      <section>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="bg-pink-100 p-1.5 rounded-lg text-pink-600 text-xs">📱</span>
          Réseaux Sociaux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📸</span>
             <input 
                placeholder="Lien Instagram"
                value={formData.tenant_settings?.social_links?.instagram || ""}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              />
          </div>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🌐</span>
             <input 
                placeholder="Lien Facebook / Site web"
                value={formData.tenant_settings?.social_links?.facebook || ""}
                onChange={(e) => updateSocial('facebook', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
          </div>
        </div>
      </section>
    </div>
  );
}