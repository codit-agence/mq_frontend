import React from 'react';

const GridPromotion: React.FC = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', height: '100vh', gap: '10px', padding: '10px', background: '#000' }}>
      <div style={{ background: 'url(/promo1.jpg) center/cover', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', width: '100%', padding: '10px' }}>Offre Limitée -50%</div>
      </div>
      <div style={{ background: 'url(/promo2.jpg) center/cover' }}></div>
      <div style={{ background: 'url(/promo3.jpg) center/cover' }}></div>
      <div style={{ background: 'url(/promo4.jpg) center/cover' }}></div>
    </div>
  );
};

export default GridPromotion;