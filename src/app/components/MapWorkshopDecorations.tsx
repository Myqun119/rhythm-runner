import React from 'react';

// Cartoon decorations for Map Workshop header/background
export default function MapWorkshopDecorations() {
  return (
    <div aria-label="decorations" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 180, pointerEvents: 'none', zIndex: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 800 180" preserveAspectRatio="none">
        {/* Soft clouds */}
        <ellipse cx="120" cy="60" rx="80" ry="28" fill="#FFFFFF" opacity="0.9"/>
        <ellipse cx="160" cy="60" rx="60" ry="22" fill="#FFFFFF" opacity="0.9"/>
        <ellipse cx="200" cy="60" rx="80" ry="28" fill="#FFFFFF" opacity="0.9"/>
        <ellipse cx="680" cy="40" rx="90" ry="30" fill="#FFFFFF" opacity="0.95"/>
        <ellipse cx="740" cy="42" rx="60" ry="22" fill="#FFFFFF" opacity="0.95"/>
        <ellipse cx="700" cy="38" rx="50" ry="20" fill="#FFFFFF" opacity="0.95"/>
        {/* Music notes */}
        <text x="60" y="150" font-family="Arial" font-size="28">♪</text>
        <text x="90" y="140" font-family="Arial" font-size="20">♪</text>
        <text x="120" y="150" font-family="Arial" font-size="28">♫</text>
        {/* Soft rhythm waves */}
        <path d="M0,110 Q40,100 80,110 T160,110 T240,110 T320,110" fill="transparent" stroke="#4ECDC4" strokeWidth="3" opacity="0.25" />
        <path d="M0,130 Q40,120 80,130 T160,130 T240,130 T320,130" fill="transparent" stroke="#FFD966" strokeWidth="3" opacity="0.25" />
      </svg>
    </div>
  );
}
