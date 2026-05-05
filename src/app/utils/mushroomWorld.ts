export type MushroomKind = "umbrella" | "cone";
export type Mushroom3D = {
  worldX: number;
  kind: MushroomKind;
  scale: number;
  color: string;
};

// Draw a mushroom-like obstacle in world space, projected to screen coords outside
export function drawMushroom(
  ctx: CanvasRenderingContext2D,
  screenX: number,
  groundY: number,
  scale: number,
  kind: MushroomKind,
  color: string
) {
  ctx.save();
  if (kind === "umbrella") {
    const w = 6 * scale;
    const h = 40 * scale;
    ctx.fillStyle = color;
    ctx.fillRect(screenX, groundY - h, w, h);
    ctx.beginPath();
    ctx.arc(screenX + w / 2, groundY - h, 20 * scale, Math.PI, 0, false);
    ctx.fillStyle = "#FFFDE1";
    ctx.fill();
  } else {
    const w = 14 * scale;
    const h = 60 * scale;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(screenX, groundY - h);
    ctx.lineTo(screenX + w, groundY - h + 6 * scale);
    ctx.lineTo(screenX, groundY);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#FFFDE1";
    ctx.beginPath();
    ctx.arc(screenX + w / 2, groundY - h, w * 0.8, Math.PI, 0, true);
    ctx.fill();
  }
  ctx.restore();
}

export function generateMushrooms(totalSegments: number, segmentWidth: number): Mushroom3D[] {
  const mushrooms: Mushroom3D[] = [];
  const cream = "#FFF9E1";
  for (let s = 0; s < totalSegments; s++) {
    const baseX = s * segmentWidth + 200;
    for (let i = 0; i < 6; i++) {
      const worldX = baseX + i * (segmentWidth / 6) + (Math.random() * 60 - 30);
      const kind: MushroomKind = Math.random() < 0.5 ? "umbrella" : "cone";
      const scale = 0.8 + Math.random() * 0.9;
      const color = cream;
      mushrooms.push({ worldX, kind, scale, color });
    }
  }
  return mushrooms;
}
