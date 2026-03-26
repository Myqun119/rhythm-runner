import React, { useEffect, useMemo, useRef, useState } from "react";
import { BackgroundDecorations } from "./Decorations";

type Action = "Idle" | "Run" | "Jump" | "Slide";

type FramesMap = Record<Action, HTMLImageElement[]>;

// Bundle sprite assets from repo root (`SE_project/png/`) so dev/prod path differences won't break loading.
// This glob is resolved by Vite at build time.
const localSpriteModules = import.meta.glob("../../../../png/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const localSpriteUrlByFileName: Record<string, string> = Object.fromEntries(
  Object.entries(localSpriteModules).map(([key, url]) => {
    const fileName = key.split("/").pop()!;
    return [fileName, url];
  }),
);

const SPRITE_FRAMES = 10;
const FRAME_DURATION_MS = 90;

const NATURAL_SPRITE_W = 232;
const NATURAL_SPRITE_H = 439;

function getSpriteFile(action: Action, frameIndex: number) {
  const idx = String(frameIndex).padStart(3, "0");
  return `${action}__${idx}.png`;
}

function createImage(src: string) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return img;
}

async function loadImageWithCandidates(fileName: string) {
  const candidates: string[] = [];

  // Prefer bundler-resolved URL (works in local dev without relying on static server path).
  if (localSpriteUrlByFileName[fileName]) {
    candidates.push(localSpriteUrlByFileName[fileName]);
  }

  // As requested by the spec (deployment static path).
  candidates.push(`/SE_project/png/${fileName}`);

  // Additional dev fallback if your server exposes repo-root `png/`.
  candidates.push(`/png/${fileName}`);

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      const img = createImage(candidate);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load: ${candidate}`));
      });
      return img;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error(`Failed to load sprite: ${fileName}`);
}

export function GameCanvas({ onExit }: { onExit?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [ready, setReady] = useState(false);

  const actions = useMemo<Action[]>(() => ["Idle", "Run", "Jump", "Slide"], []);
  const framesRef = useRef<FramesMap>({
    Idle: [],
    Run: [],
    Jump: [],
    Slide: [],
  });

  // Game state stored in refs to keep 60fps without React re-render per frame.
  const stateRef = useRef({
    action: "Idle" as Action,
    prevAction: "Idle" as Action,
    animTimeMs: 0,

    // Physics
    onGround: true,
    posY: 0, // 0 = ground, negative = upward
    velY: 0,

    // Slide
    slideTimeLeftMs: 0,

    // Input edge triggers
    pendingJump: false,
    pendingSlide: false,
    runHeld: false,

    // Rendering metrics (computed in resize)
    cssW: 0,
    cssH: 0,
    dpr: 1,
    groundBottomY: 0,
    drawW: 0,
    drawH: 0,

    lastTs: 0,
    rafId: 0 as unknown as number,
  });

  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const nextFrames = {
        Idle: [] as HTMLImageElement[],
        Run: [] as HTMLImageElement[],
        Jump: [] as HTMLImageElement[],
        Slide: [] as HTMLImageElement[],
      };

      for (const action of actions) {
        const arr: HTMLImageElement[] = [];
        for (let i = 0; i < SPRITE_FRAMES; i++) {
          const file = getSpriteFile(action, i);
          const img = await loadImageWithCandidates(file);
          arr.push(img);
        }
        nextFrames[action] = arr;
      }

      if (cancelled) return;
      framesRef.current = nextFrames;
      setReady(true);
    }

    preload().catch(() => {
      // If sprites fail to load, keep `ready=false` so we don't animate with missing assets.
      // (In dev, you can open the browser console to see which URL failed.)
    });

    return () => {
      cancelled = true;
    };
  }, [actions]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent page scroll when pressing Space/Arrow keys.
      if (
        e.code === "Space" ||
        e.code === "ArrowUp" ||
        e.code === "ArrowDown" ||
        e.code === "ArrowRight"
      ) {
        e.preventDefault();
      }

      const s = stateRef.current;
      if (e.code === "ArrowUp" || e.code === "Space") {
        s.pendingJump = true;
      }
      if (e.code === "ArrowDown") {
        s.pendingSlide = true;
      }
      if (e.code === "ArrowRight" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        s.runHeld = true;
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "Space") {
        // No need to handle.
      }
      if (e.code === "ArrowDown") {
        // Cancel slide early if user releases Down.
        stateRef.current.pendingSlide = false;
      }
      if (e.code === "ArrowRight" || e.code === "ShiftLeft" || e.code === "ShiftRight") {
        stateRef.current.runHeld = false;
      }
    };

    const onBlur = () => {
      stateRef.current.pendingJump = false;
      stateRef.current.pendingSlide = false;
      stateRef.current.runHeld = false;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false } as AddEventListenerOptions);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown as any);
      window.removeEventListener("keyup", onKeyUp as any);
      window.removeEventListener("blur", onBlur as any);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const s = stateRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);

      s.cssW = cssW;
      s.cssH = cssH;
      s.dpr = dpr;

      // Character scale & ground line.
      s.drawH = cssH * 0.52;
      s.drawW = (s.drawH / NATURAL_SPRITE_H) * NATURAL_SPRITE_W;

      // Fixed X coordinate (spec).
      // We'll treat ground as bottom of the character.
      s.groundBottomY = cssH * 0.86;
    };

    updateSize();

    const ro = new ResizeObserver(() => updateSize());
    ro.observe(container);

    const gravity = 2300; // px/s^2
    const jumpVel = 760; // px/s
    const slideDurationMs = 380;

    const frameLoop = (ts: number) => {
      s.rafId = requestAnimationFrame(frameLoop) as unknown as number;

      if (!s.lastTs) s.lastTs = ts;
      const dtMs = ts - s.lastTs;
      s.lastTs = ts;
      const dt = Math.min(0.04, dtMs / 1000); // Clamp to avoid huge jumps.

      // Consume edge-triggered inputs.
      const jumpRequested = s.pendingJump;
      const slideRequested = s.pendingSlide;
      s.pendingJump = false;
      s.pendingSlide = false;

      // Slide: only if grounded and not already sliding.
      if (slideRequested && s.onGround) {
        s.slideTimeLeftMs = slideDurationMs;
      }

      if (jumpRequested) {
        // Jump cancels slide if it's currently active.
        s.slideTimeLeftMs = 0;
        if (s.onGround) {
          s.onGround = false;
          s.action = "Jump";
          s.velY = -jumpVel;
        }
      }

      // Update slide timer.
      if (s.slideTimeLeftMs > 0) {
        s.slideTimeLeftMs -= dtMs;
        if (s.slideTimeLeftMs <= 0) {
          s.slideTimeLeftMs = 0;
        }
      }

      // Physics update for jump.
      if (!s.onGround) {
        s.velY += gravity * dt;
        s.posY += s.velY * dt;

        if (s.posY >= 0) {
          s.posY = 0;
          s.velY = 0;
          s.onGround = true;
        }
      }

      // Decide current animation action.
      if (!s.onGround) {
        s.action = "Jump";
      } else if (s.slideTimeLeftMs > 0) {
        s.action = "Slide";
      } else if (s.runHeld) {
        s.action = "Run";
      } else {
        s.action = "Idle";
      }

      // Animation timing
      if (s.action !== s.prevAction) {
        s.prevAction = s.action;
        s.animTimeMs = 0;
      } else {
        s.animTimeMs += dtMs;
      }

      const frameIndex = Math.floor(s.animTimeMs / FRAME_DURATION_MS) % SPRITE_FRAMES;

      // Draw
      const cssW = s.cssW;
      const cssH = s.cssH;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const x = cssW * 0.26;
      const slideYOffset = s.action === "Slide" ? s.drawH * 0.05 : 0;
      const bottomY = s.groundBottomY;
      const topY = bottomY + s.posY + slideYOffset - s.drawH;

      ctx.imageSmoothingEnabled = true;
      const frameImg = framesRef.current[s.action][frameIndex];
      if (frameImg) {
        ctx.drawImage(frameImg, x, topY, s.drawW, s.drawH);
      }
    };

    s.lastTs = 0;
    s.rafId = requestAnimationFrame(frameLoop) as unknown as number;

    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.rafId as unknown as number);
    };
  }, [ready]);

  // UI wrapper only; all 60fps drawing is in the canvas.
  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full max-w-[393px] mx-auto overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #FFF9E6, #E6F9F7)",
      }}
    >
      <BackgroundDecorations />
      <canvas
        ref={canvasRef}
        className="relative z-10 block"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onExit}
          style={{
            backgroundColor: "white",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: 9999,
            padding: "10px 14px",
            color: "#4ECDC4",
            border: "2px solid #4ECDC4",
          }}
        >
          返回菜单
        </button>
      </div>
    </div>
  );
}

