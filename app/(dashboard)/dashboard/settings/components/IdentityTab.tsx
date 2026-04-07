// IdentityTab.tsx
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
    
    // Si c'est un nouveau fichier sélectionné localement
    if (typeof logo === 'object' && logo instanceof File) {
      return URL.createObjectURL(logo);
    }
    
    // Si c'est l'URL qui vient déjà du serveur (string)
    return logo; 
  };

  return (
    <div className="space-y-8">
      {/* Section Logo avec Preview */}
      <div className="flex items-center space-x-6 p-4 bg-yellow-50/50 rounded-2xl border border-yellow-100">
        <div className="h-20 w-20 bg-white rounded-xl border shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
          {formData.logo ? (
            <img 
              src={getLogoPreview()} 
              className="object-cover h-full w-full" 
              alt="Logo preview"
              // Petit fix pour éviter de créer trop d'URLs en mémoire
              onLoad={() => { if(typeof formData.logo === 'object') URL.revokeObjectURL(getLogoPreview()!); }}
            />
          ) : (
            <span className="text-3xl text-gray-300">🏪</span>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-bold mb-2 text-yellow-800">Logo du restaurant</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => handleFile(e, 'logo')}
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 cursor-pointer transition-all"
          />
        </div>
      </div>

      {/* Champs Formulaire - Reliés au Store */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Nom de l'établissement</label>
          <input 
            type="text" 
            value={formData.name || ""} 
            onChange={(e) => setField('name', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Ville</label>
          <input 
            type="text" 
            value={formData.city || ""} 
            onChange={(e) => setField('city', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Pays</label>
          <input 
            type="text" 
            value={formData.country || "Morocco"} 
            onChange={(e) => setField('country', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1.5 text-gray-700">Adresse complète</label>
          <textarea 
            rows={2}
            value={formData.address || ""} 
            onChange={(e) => setField('address', e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}