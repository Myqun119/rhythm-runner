import React from 'react';

type MapItem = {
  id: number;
  name: string;
  creator: string;
  downloads: number;
  rating: number;
  difficulty: string;
  color: string;
};

export default function MapCard({ item, onClick }: { item: MapItem; onClick?: () => void }) {
  const color = item.color;
  return (
    <div onClick={onClick} className="mapw-card" style={{ cursor: 'pointer' }}>
      <div className="mapw-card-cover" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }} />
      <div className="mapw-card-content" style={{ padding: 12 }}>
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        <div style={{ fontSize: 12, color: '#666' }}>{item.creator}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
          <span>Downloads: {item.downloads}</span>
          <span>Rating: {item.rating.toFixed(1)}</span>
        </div>
        <div className="mapw-chip" style={{ display: 'inline-block', marginTop: 8 }}>{item.difficulty}</div>
      </div>
    </div>
  );
}
