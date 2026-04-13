import React, { useEffect } from 'react';
import { useTvStreamStore } from '@/src/projects/client-dashboard/tvstream/store/tvstream.store';
import ScreenCard from './ScreenCard';

const ScreenList: React.FC = () => {
  const { screens, isLoading, loadScreens } = useTvStreamStore();

  useEffect(() => {
    loadScreens();
    // Optionnel : Rafraîchir la liste toutes les minutes pour l'état "is_online"
    const interval = setInterval(loadScreens, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="loader">Chargement du parc...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Écrans</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Ajouter un écran
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screens.map(screen => (
          <ScreenCard key={screen.id} screen={screen} />
        ))}
      </div>
    </div>
  );
};

export default ScreenList;