"use client";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { getTenantSettingsTabsText } from "@/src/projects/client-dashboard/settings/tenant-settings/tenant-settings.constants";
import { resolveTenantDisplayName } from "@/src/projects/client-dashboard/tenant/tenant-display";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { useEffect, useMemo, useState } from "react";

export default function IdentityTab() {
  const { formData, setField, setNestedField } = useSettingsStore();
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const t = useMemo(() => getTenantSettingsTabsText(locale).identity, [locale]);
  const dateLocale = locale === "ar" ? "ar-MA" : "fr-FR";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  // Gestion intelligente de la prévisualisation du logo
  useEffect(() => {
    const logo = formData.business?.logo;

    if (!logo) {
      setPreviewUrl(null);
      return;
    }

    if (logo instanceof File) {
      const objectUrl = URL.createObjectURL(logo);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Nettoyage mémoire
    }

    if (typeof logo === 'string') {
      setPreviewUrl(getImageUrl(logo));
    }
  }, [formData.business?.logo]);

  useEffect(() => {
    const cover = formData.business?.cover_image;

    if (!cover) {
      setCoverPreviewUrl(null);
      return;
    }

    if (cover instanceof File) {
      const objectUrl = URL.createObjectURL(cover);
      setCoverPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    if (typeof cover === "string") {
      setCoverPreviewUrl(getImageUrl(cover));
    }
  }, [formData.business?.cover_image]);

  const tenantCreatedAt = formData.created_at ? new Date(formData.created_at) : null;
  const registrationDate = formData.registration_date ? new Date(formData.registration_date) : null;
  const businessCreatedAt = formData.business?.created_at ? new Date(formData.business.created_at) : null;
  const referenceDate = registrationDate || tenantCreatedAt || businessCreatedAt;
  const subscriptionEnd = referenceDate ? new Date(referenceDate) : null;
  if (subscriptionEnd) {
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 5);
  }

  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const remainingDays = subscriptionEnd
    ? Math.ceil((subscriptionEnd.getTime() - now.getTime()) / msPerDay)
    : null;

  const tenantDisplayName = resolveTenantDisplayName(formData) || t.establishmentFallback;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
        <div className="relative group">
          <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white transition-transform group-hover:scale-105">
            {previewUrl ? (
              <img src={previewUrl} className="w-full h-full object-cover" alt={t.logoAlt} />
            ) : (
              <span className="text-4xl">🍽️</span>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-yellow-500 text-white p-3 rounded-2xl cursor-pointer shadow-xl hover:bg-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
            </svg>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => setNestedField('business', 'logo', e.target.files?.[0] || null)} 
            />
          </label>
        </div>
        <div className="text-center md:text-left space-y-1">
          <h2 className="text-2xl font-black text-slate-800">{tenantDisplayName}</h2>
          <p className="text-yellow-600 font-bold tracking-tight">@{formData.slug}</p>
          <div className="px-3 py-1 bg-white inline-block rounded-full text-[10px] font-black uppercase text-slate-400 border border-slate-200">
            {formData.business_type || t.partnerFallback}
          </div>
          {formData.business?.name_override ? (
            <p className="text-xs font-bold text-slate-500">
              {t.legalNamePrefix} {formData.name || "-"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <p className="text-[10px] font-black uppercase text-slate-400">{t.registrationDate}</p>
          <p className="text-sm font-bold text-slate-700 mt-1">
            {referenceDate ? referenceDate.toLocaleDateString(dateLocale) : t.na}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <p className="text-[10px] font-black uppercase text-slate-400">{t.deadlineFiveMonths}</p>
          <p className="text-sm font-bold text-slate-700 mt-1">
            {subscriptionEnd ? subscriptionEnd.toLocaleDateString(dateLocale) : t.na}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white">
          <p className="text-[10px] font-black uppercase text-slate-400">{t.remainingDays}</p>
          <p className={`text-sm font-black mt-1 ${remainingDays !== null && remainingDays <= 10 ? "text-red-600" : "text-emerald-600"}`}>
            {remainingDays === null ? t.na : `${remainingDays} ${t.daysSuffix}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.localization}</label>
          <div className="flex gap-2">
            <input 
              placeholder={t.cityPlaceholder}
              value={formData.city || ""} 
              onChange={(e) => setField('city', e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-yellow-500 outline-none transition-all" 
            />
            <input 
              placeholder={t.countryPlaceholder}
              value={formData.country || ""} 
              onChange={(e) => setField('country', e.target.value)}
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-yellow-500 outline-none transition-all" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.address}</label>
          <input 
            value={formData.business?.address || ""} 
            onChange={(e) => setNestedField('business', 'address', e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-yellow-500 outline-none transition-all" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.coverImage}</label>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-4">
          <div className="w-full h-44 rounded-[1.5rem] overflow-hidden bg-slate-100 flex items-center justify-center">
            {coverPreviewUrl ? (
              <img src={coverPreviewUrl} className="w-full h-full object-cover" alt={t.coverAlt} />
            ) : (
              <p className="text-sm font-bold text-slate-400">{t.noCover}</p>
            )}
          </div>
          <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black cursor-pointer">
            {t.chooseCover}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setNestedField("business", "cover_image", e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
