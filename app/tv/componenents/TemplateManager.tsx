import React from 'react';
import ClassicMenu from './templates/ClassicMenu';
import GridPromotion from './templates/GridPromotion';
import VideoFocus from './templates/VideoFocus';
// Importe tes différents designs ici


interface Props {
  type: string;
}

const TemplateManager: React.FC<Props> = ({ type }) => {
  // Logique de sélection du composant visuel
  switch (type) {
    case 'classic':
      return <ClassicMenu />;
    case 'grid':
      return <GridPromotion />;
    case 'video_focus':
      return <VideoFocus />;
    default:
      // Fallback si le template n'existe pas encore côté Front
      return (
        <div style={{ color: 'white', padding: '20px' }}>
          <h1>Template "{type}" en cours de chargement...</h1>
        </div>
      );
  }
};

export default TemplateManager;