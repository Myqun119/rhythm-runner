import React from 'react';

// Simple decorative cloud and rhythm wave decorations using SVG
export const CloudDecorations: React.FC = () => {
  return (
    <div aria-label="decorations" style={{ position: 'absolute', pointerEvents: 'none', width: '100%', height: '100%', top: 0, left: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="none" style={{ opacity: 0.25 }}>
        {/* soft gradient clouds */}
        <ellipse cx="150" cy="120" rx="140" ry="60" fill="#FFFFFF" />
        <ellipse cx="240" cy="110" rx="100" ry="40" fill="#FFFFFF" />
        <ellipse cx="760" cy="170" rx="160" ry="70" fill="#FFFFFF" />
        <ellipse cx="820" cy="150" rx="120" ry="50" fill="#FFFFFF" />
        {/* decorative notes */}
        <g fill="#4ECDC4">
          <circle cx="320" cy="420" r="6" />
          <circle cx="360" cy="420" r="6" />
          <circle cx="400" cy="420" r="6" />
        </g>
        {/* rhythmic waves */}
        <path d="M0,520 C200,480 400,560 600,520 S 1000,480 1200,520" stroke="#FF9F4A" strokeWidth="6" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
};

export const BackgroundDecorations: React.FC = () => {
  return <CloudDecorations />;
};
