import React from 'react';

export default function MapWorkshopTopNav() {
  return (
    <nav className="rw-topnav" style={{
      display: 'flex', gap: 12, padding: '12px 18px',
      background: 'linear-gradient(135deg, #FFD966 0%, #4ECDC4 100%)',
      color: '#1b1b1b', position: 'sticky', top: 0, zIndex: 5,
      borderRadius: '0 0 12px 12px', boxShadow: '0 6px 14px rgba(0,0,0,0.04)'
    }}>
      <a href="#" style={{ textDecoration: 'none', color: '#1b1b1b', fontWeight: 700 }}>首页</a>
      <a href="#" style={{ textDecoration: 'none', color: '#1b1b1b', fontWeight: 700 }}>地图工坊</a>
      <a href="#" style={{ textDecoration: 'none', color: '#1b1b1b', fontWeight: 700 }}>编辑器</a>
    </nav>
  );
}
