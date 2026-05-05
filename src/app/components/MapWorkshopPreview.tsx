import React from 'react';

type Props = {
  grid: boolean[][]; // grid[y][x] or grid[x][y]? We'll use grid[x][y] for easier access with columns as first index in generation
  cellSize?: number;
};

// Simple grid visualization: true -> obstacle, false -> empty
export default function MapWorkshopPreview({ grid, cellSize = 16 }: Props) {
  if (!grid || grid.length === 0) return null;
  // Determine dimensions: we store grid as gridWidth x gridHeight (columns x rows) in outer array length
  const width = grid.length;
  const height = grid[0]?.length ?? 0;

  const styleGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
    gap: 2,
    padding: 8,
    background: '#f6f6f6',
    border: '1px solid #e5e5e5',
    borderRadius: 6,
    width: width * (cellSize + 2) + 16,
    justifyContent: 'center',
  };

  // Render each cell; layout as rows of width columns
  const cells: JSX.Element[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const filled = grid[x][y];
      cells.push(
        <div
          key={`${x}-${y}`}
          style={{
            width: cellSize,
            height: cellSize,
            background: filled ? '#4ECDC4' : '#fff',
            border: '1px solid #ddd',
          }}
        />
      );
    }
  }

  // Since we used a 2D render order, we render as a grid by wrapping in a container that uses CSS grid
  // Rebuild grid to ensure proper layout (alternative approach would be a single 2D matrix rendering)
  return (
    <div style={styleGrid}>
      {cells}
    </div>
  );
}
