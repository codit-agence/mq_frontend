import React from 'react';

import { useTvStreamStore } from '@/src/projects/client-dashboard/tvstream/store/tvstream.store';
import { Screen } from '@/src/types/tvstream/tvstream';

interface Props {
  screen: Screen;
}

const ScreenCard: React.FC<Props> = ({ screen }) => {
  const { updateScreen } = useTvStreamStore();

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateScreen(screen.id, { current_template: e.target.value });
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${screen.is_online ? 'border-green-500' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{screen.name}</h3>
          <p className="text-xs text-gray-500">ID: {screen.id.slice(0, 8)}...</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${screen.is_online ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {screen.is_online ? '● En ligne' : '○ Hors ligne'}
        </span>
      </div>

      {/* Zone d'appairage si pas encore connecté */}
      {screen.pairing_code && !screen.is_online && (
        <div className="bg-blue-50 p-2 rounded mb-4 text-center">
          <p className="text-xs text-blue-600 font-semibold">Code d'appairage</p>
          <p className="text-xl font-mono font-bold tracking-widest">{screen.pairing_code}</p>
        </div>
      )}

      {/* Sélecteur de Template en temps réel */}
      <div className="mt-4">
        <label className="text-sm font-medium text-gray-700">Template actif</label>
        <select 
          value={screen.current_template}
          onChange={handleTemplateChange}
          className="w-full mt-1 border rounded p-2 text-sm"
        >
          <option value="classic">Menu Classique</option>
          <option value="grid">Grille Promo</option>
          <option value="video_focus">Vidéo Publicitaire</option>
        </select>
      </div>

      {/* Infos techniques (L'étude de parc) */}
      <div className="mt-4 pt-4 border-t text-xs text-gray-400 grid grid-cols-2 gap-2">
        <div>OS: {screen.os_platform || 'N/A'}</div>
        <div>Res: {screen.screen_resolution || 'N/A'}</div>
        <div>Transport: {screen.resolved_transport || 'N/A'}</div>
        <div>Profil: {screen.device_tier || 'N/A'}</div>
        <div>GPS: {screen.last_gps_status || 'N/A'}</div>
        <div>GPS requis: {screen.gps_required ? 'Oui' : 'Non'}</div>
      </div>
    </div>
  );
};

export default ScreenCard;