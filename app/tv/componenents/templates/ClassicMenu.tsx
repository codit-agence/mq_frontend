import React from 'react';

const ClassicMenu: React.FC = () => {
  const items = [
    { id: 1, name: "Burger Maison", price: "12.50€" },
    { id: 2, name: "Salade César", price: "10.00€" },
    { id: 3, name: "Pizza Regina", price: "14.00€" }
  ];

  return (
    <div className="menu-classic" style={{ background: '#2c3e50', color: 'white', height: '100vh', padding: '40px' }}>
      <h1 style={{ borderBottom: '2px solid gold', paddingBottom: '10px' }}>🍽️ Carte du Jour</h1>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
        {items.map(item => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', marginBottom: '15px' }}>
            <span>{item.name}</span>
            <span style={{ color: 'gold' }}>{item.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassicMenu;