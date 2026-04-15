"use client";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { getTenantSettingsTabsText } from "@/src/projects/client-dashboard/settings/tenant-settings/tenant-settings.constants";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { useEffect, useMemo, useState } from "react";

export default function BusinessTab() {
  const { formData, setNestedField } = useSettingsStore();
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const t = useMemo(() => getTenantSettingsTabsText(locale).business, [locale]);
  const [openingHoursText, setOpeningHoursText] = useState("{}");
  const socialLinks: Record<string, string> = formData.business?.social_links || {};

  useEffect(() => {
    setOpeningHoursText(JSON.stringify(formData.business?.opening_hours || {}, null, 2));
  }, [formData.business?.opening_hours]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic text-yellow-600">{t.commercialNameOverride}</label>
          <input
            value={formData.business?.name_override || ""}
            onChange={(e) => setNestedField("business", "name_override", e.target.value)}
            placeholder={formData.name}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-800 outline-none focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.menuCurrency}</label>
          <input
            value={formData.business?.currency || "MAD"}
            onChange={(e) => setNestedField("business", "currency", e.target.value.toUpperCase())}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-center"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.businessDescription}</label>
        <textarea
          value={formData.business?.description || ""}
          onChange={(e) => setNestedField("business", "description", e.target.value)}
          className="w-full p-5 bg-slate-50 border-none rounded-[2rem] font-medium min-h-[120px] outline-none"
          placeholder={t.businessDescriptionPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.phone}</label>
          <input
            value={formData.business?.tel || ""}
            onChange={(e) => setNestedField("business", "tel", e.target.value)}
            placeholder={t.phonePlaceholder}
            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-yellow-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.hoursJson}</label>
          <textarea
            value={openingHoursText}
            onChange={(e) => setOpeningHoursText(e.target.value)}
            onBlur={() => {
              try {
                const parsed = JSON.parse(openingHoursText || "{}");
                setNestedField("business", "opening_hours", parsed);
              } catch {
                // Keep last valid value.
              }
            }}
            className="w-full p-4 bg-slate-50 rounded-2xl font-mono text-xs border-2 border-transparent focus:border-yellow-500 outline-none min-h-[120px]"
            placeholder={t.hoursJsonPlaceholder}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">{t.socialNetworks}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["instagram", "facebook", "whatsapp", "website"].map((key) => (
            <input
              key={key}
              value={socialLinks[key] || ""}
              onChange={(e) =>
                setNestedField("business", "social_links", {
                  ...socialLinks,
                  [key]: e.target.value,
                })
              }
              placeholder={key}
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl font-bold outline-none focus:border-yellow-500"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "show_prices", label: t.showPrices, icon: "💰" },
          { key: "show_images", label: t.showImages, icon: "🖼️" },
        ].map((item) => (
          <div key={item.key} className="p-6 bg-white border-2 border-slate-50 rounded-[2rem] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <p className="font-bold text-slate-700">{item.label}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const k = item.key as "show_prices" | "show_images";
                const on = formData.business?.[k] !== false;
                setNestedField("business", k, !on);
              }}
              className={`w-12 h-6 rounded-full transition-all ${formData.business?.[item.key as "show_prices" | "show_images"] !== false ? "bg-yellow-500" : "bg-slate-200"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${formData.business?.[item.key as "show_prices" | "show_images"] !== false ? "translate-x-6" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
