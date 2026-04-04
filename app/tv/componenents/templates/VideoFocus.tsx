import React from 'react';

const VideoFocus: React.FC = () => {
  return (
    <div style={{ background: 'black', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <video 
        autoPlay 
        muted 
        loop 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src="/ads/brand_video.mp4" type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>
      <div style={{ position: 'absolute', bottom: 20, right: 20, background: 'red', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>
        EN DIRECT
      </div>
    </div>
  );
};

export default VideoFocus;