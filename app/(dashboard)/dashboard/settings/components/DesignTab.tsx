"use client";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";

export default function DesignTab() {
  const { formData, setNestedField } = useSettingsStore();
  const colors = ["#EAB308", "#EF4444", "#3B82F6", "#10B981", "#111827", "#0EA5E9"];
  const languages = ["fr", "en", "ar", "es"] as const;
  const templates = [
    { id: "standard", label: "Standard" },
    { id: "full_promo", label: "Full Promo" },
    { id: "branded", label: "Branded" },
    { id: "tvplayer", label: "TV Player" },
    { id: "display", label: "Display" },
  ];

  const normalizeTemplate = (value?: string) => {
    if (!value) return "tvplayer";
    if (value === "classic") return "tvplayer";
    if (value === "grid" || value === "video_focus" || value === "focus") return "display";
    return value;
  };

  const display = formData.display || {};
  const activeLanguages = display.active_languages || ["fr"];
  const defaultLanguage = display.default_language || "fr";
  const selectedTemplate = normalizeTemplate(display.template);

  const toggleLanguage = (lang: string) => {
    const current = new Set(activeLanguages);
    if (current.has(lang)) {
      if (current.size === 1) return;
      current.delete(lang);
    } else {
      current.add(lang);
    }
    const updated = Array.from(current);
    setNestedField("display", "active_languages", updated);
    if (!updated.includes(defaultLanguage)) {
      setNestedField("display", "default_language", updated[0]);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] space-y-4">
        <p className="font-black text-slate-800">Template client</p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setNestedField("display", "template", template.id)}
              className={`py-4 rounded-2xl border-2 font-black text-sm transition ${
                selectedTemplate === template.id
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem]">
          <label className="text-[10px] font-black text-slate-400 uppercase">Couleur Primaire</label>
          <div className="flex flex-wrap gap-4">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setNestedField("display", "primary_color", c)}
                style={{ backgroundColor: c }}
                className={`w-12 h-12 rounded-2xl shadow-lg transition-all ${display.primary_color === c ? "ring-4 ring-white scale-110" : "hover:scale-105"}`}
              />
            ))}
            <input
              type="color"
              className="w-12 h-12 rounded-2xl cursor-pointer bg-white p-1"
              value={display.primary_color || "#EAB308"}
              onChange={(e) => setNestedField("display", "primary_color", e.target.value)}
            />
          </div>

          <label className="text-[10px] font-black text-slate-400 uppercase">Couleur Secondaire</label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              className="w-12 h-12 rounded-2xl cursor-pointer bg-white p-1"
              value={display.secondary_color || "#F9FAFB"}
              onChange={(e) => setNestedField("display", "secondary_color", e.target.value)}
            />
            <input
              value={display.secondary_color || "#F9FAFB"}
              onChange={(e) => setNestedField("display", "secondary_color", e.target.value)}
              className="w-full p-3 bg-white rounded-xl font-bold border-2 border-slate-100 outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white border-2 border-slate-100 rounded-[2rem] space-y-4">
            <p className="font-black text-slate-800">Configuration des Langues</p>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  className={`py-3 rounded-2xl font-black text-sm transition ${activeLanguages.includes(lang) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50">
              <label className="text-[10px] font-black text-slate-400 uppercase">Langue par défaut</label>
              <select
                value={defaultLanguage}
                onChange={(e) => setNestedField("display", "default_language", e.target.value)}
                className="w-full mt-2 p-3 bg-slate-50 rounded-xl font-bold outline-none"
              >
                {activeLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang === "ar" ? "العربية" : lang.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
