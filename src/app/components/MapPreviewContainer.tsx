import React from 'react';
import MapWorkshopPreview from './MapWorkshopPreview';

type Props = {
  grid: boolean[][] | null;
  zoom?: number;
};

export default function MapPreviewContainer({ grid, zoom = 1.0 }: Props) {
  const wrapperStyle: React.CSSProperties = {
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    width: 'fit-content',
  };
  return (
    <div style={{ overflow: 'auto', border: '1px solid #ddd', padding: 8, borderRadius: 6 }}>
      <div style={wrapperStyle}>
        <MapWorkshopPreview grid={grid ?? [[]]} cellSize={12} />
      </div>
    </div>
  );
}
