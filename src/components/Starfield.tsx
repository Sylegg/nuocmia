import React from "react";

function createPrng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(
  count: number,
  blurPx: number,
  minAlpha: number,
  maxAlpha: number,
  seed: number
): string {
  const rand = createPrng(seed);
  const shadows: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = (rand() * 100).toFixed(2);
    const y = (rand() * 100).toFixed(2);
    const alpha = (minAlpha + rand() * (maxAlpha - minAlpha)).toFixed(3);
    shadows.push(`${x}vw ${y}vh ${blurPx}px 0 rgba(255,255,255,${alpha})`);
  }
  return shadows.join(",");
}

const STARFIELD_A = buildStars(150, 0, 0.05, 0.3, 20260912);
const STARFIELD_B = buildStars(18, 1.2, 0.35, 0.7, 9122026);

export function Starfield() {
  return (
    <div className="bg" aria-hidden="true">
      <div id="stA" className="stars" style={{ boxShadow: STARFIELD_A }} />
      <div id="stB" className="stars" style={{ boxShadow: STARFIELD_B }} />
    </div>
  );
}

