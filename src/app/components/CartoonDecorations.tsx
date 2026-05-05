import React from "react";

// Lightweight cartoon-style decorative elements: clouds and music notes
export function CartoonDecorations() {
  return (
    <svg
      aria-label="Decorations"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -1 }}
    >
      {/* Soft clouds (low opacity) */}
      <g fill="#FFFFFF" fillOpacity={0.6}>
        <ellipse cx="140" cy="120" rx="120" ry="40" />
        <ellipse cx="260" cy="90" rx="180" ry="60" />
        <ellipse cx="320" cy="150" rx="140" ry="50" />
      </g>
      {/* Subtle music notes */}
      <g fill="#FFFFFF" fillOpacity={0.8} stroke="#FFFFFF" strokeWidth={2}>
        <circle cx="60" cy="420" r="4" />
        <path d="M60 420 v-22" />
        <circle cx="180" cy="450" r="4" />
        <path d="M180 450 v-28" />
        <circle cx="260" cy="410" r="4" />
        <path d="M260 410 v-24" />
      </g>
    </svg>
  );
}
