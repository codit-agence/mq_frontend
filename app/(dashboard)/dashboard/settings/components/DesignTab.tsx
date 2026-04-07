import { useSettingsStore } from "@/src/features/settings/store/useSettingStore";

export default function DesignTab() {
  const { formData, setField } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Identité Visuelle</h3>
        <p className="text-sm text-gray-500">Personnalisez l'apparence de votre page publique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Couleur Primaire */}
        <div>
          <label className="block text-sm font-medium mb-2">Couleur de la marque</label>
          <div className="flex items-center space-x-3">
            <input 
              type="color" 
              value={formData.primary_color || "#EAB308"}
              onChange={(e) => setField('primary_color', e.target.value)}
              className="h-10 w-10 border-none rounded-lg cursor-pointer"
            />
            <span className="text-sm font-mono uppercase">{formData.primary_color || "#EAB308"}</span>
          </div>
        </div>

        {/* Template */}
        <div>
          <label className="block text-sm font-medium mb-2">Modèle de page (Template)</label>
          <select 
            value={formData.display_settings?.template || "modern"}
            onChange={(e) => setField('template', e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm"
          >
            <option value="modern">Moderne (Grille)</option>
            <option value="classic">Classique (Liste)</option>
            <option value="luxury">Luxe (Minimaliste)</option>
          </select>
        </div>
      </div>
    </div>
  );
}