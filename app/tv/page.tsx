"use client";
import React from 'react';
import { useTVHeartbeat } from '@/src/features/tvapp/hook/useTvHeartBeat';
import { useTVStore } from '@/src/features/tvapp/store/tvapp.store';
import TemplateManager from './componenents/TemplateManager';
import PairingScreen from './componenents/PairingScreen';

const TVApp: React.FC = () => {
  const { accessToken, template } = useTVStore();

  // On active le "pouls" automatique (uniquement si on a un token)
  useTVHeartbeat(30000); // 30 secondes

  if (!accessToken) {
    // Écran de bienvenue avec les codes 6 et 4 chiffres
    return <PairingScreen />;
  }

  return (
    <div className="tv-container">
      {/* Ce composant affichera le template choisi (Menu, Promo, etc.) */}
      <TemplateManager type={template} />
    </div>
  );
};

export default TVApp;