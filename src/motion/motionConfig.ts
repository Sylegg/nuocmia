/**
 * CARDVERSE Motion Design System
 * Tuned around the "premium" spring preset requested:
 * stiffness = 115, damping = 24, mass = 0.9
 * Smooth, cohesive, natural deceleration with zero overshoot jitter.
 */

export const PREMIUM_SPRING = {
  type: "spring" as const,
  stiffness: 115,
  damping: 24,
  mass: 0.9,
  restDelta: 0.01,
  restSpeed: 0.5,
};

export const FLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 135,
  damping: 25,
  mass: 0.9,
  restDelta: 0.35,
  restSpeed: 2,
};

export const MICRO_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 26,
  mass: 0.65,
};

export const HOVER_TILT_SPRING = {
  stiffness: 240,
  damping: 24,
  mass: 0.6,
};

export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATIONS = {
  micro: 0.16,
  hover: 0.22,
  drawer: 0.34,
  recede: 0.28,
  detailReveal: 0.42,
} as const;

export interface RadialGeometry {
  breakpoint: "mobile" | "tablet" | "desktop";
  cardWidth: number;
  cardHeight: number;
  radiusX: number;
  radiusY: number;
  angleStepDeg: number;
  rotationStepDeg: number;
  maxVisibleOffset: number;
  dragPixelsPerCard: number;
}

export function getRadialGeometry(viewportWidth: number): RadialGeometry {
  if (viewportWidth < 768) {
    const compact = viewportWidth < 390;
    return {
      breakpoint: "mobile",
      cardWidth: compact ? 186 : 206,
      cardHeight: compact ? 250 : 276,
      radiusX: compact ? 330 : 380,
      radiusY: compact ? 300 : 340,
      angleStepDeg: 21,
      rotationStepDeg: 13,
      maxVisibleOffset: 2.6,
      dragPixelsPerCard: 135,
    };
  }

  if (viewportWidth < 1024) {
    return {
      breakpoint: "tablet",
      cardWidth: 226,
      cardHeight: 302,
      radiusX: 590,
      radiusY: 540,
      angleStepDeg: 16.5,
      rotationStepDeg: 13.5,
      maxVisibleOffset: 3.6,
      dragPixelsPerCard: 165,
    };
  }

  const wide = viewportWidth >= 1400;
  return {
    breakpoint: "desktop",
    cardWidth: wide ? 260 : 246,
    cardHeight: wide ? 348 : 328,
    radiusX: wide ? 860 : 750,
    radiusY: wide ? 820 : 720,
    angleStepDeg: wide ? 14.5 : 15,
    rotationStepDeg: 14,
    maxVisibleOffset: 4.6,
    dragPixelsPerCard: 195,
  };
}

/**
 * Shortest signed modular distance between a card index and a continuous track index.
 * Ensures wrapping from the last card to the first is completely seamless.
 */
export function normalizeRelativeIndex(
  cardIndex: number,
  virtualIndex: number,
  total: number
): number {
  if (total <= 0) return 0;
  let diff = (((cardIndex - virtualIndex) % total) + total) % total;
  if (diff > total / 2) {
    diff -= total;
  }
  return diff;
}

export function wrapIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  return ((index % total) + total) % total;
}

/**
 * Compute continuous visual attenuation curves based on distance from center.
 */
export function computeCardVisualMetrics(rel: number, maxVisibleOffset: number) {
  const abs = Math.abs(rel);

  // Scale curve: 1.0 -> 0.85 -> 0.72 -> 0.62 -> 0.56
  let scale: number;
  if (abs <= 1) {
    scale = 1 - abs * 0.15;
  } else if (abs <= 2) {
    scale = 0.85 - (abs - 1) * 0.13;
  } else {
    scale = Math.max(0.55, 0.72 - (abs - 2) * 0.08);
  }

  // Opacity curve: 1.0 -> 0.76 -> 0.44 -> 0.22 -> 0.0
  let opacity: number;
  if (abs <= 1) {
    opacity = 1 - abs * 0.24;
  } else if (abs <= 2) {
    opacity = 0.76 - (abs - 1) * 0.32;
  } else if (abs <= 3) {
    opacity = 0.44 - (abs - 2) * 0.22;
  } else {
    const fadeSpan = Math.max(0.4, maxVisibleOffset - 3);
    opacity = Math.max(0, 0.22 * (1 - (abs - 3) / fadeSpan));
  }

  // Saturation: 1.0 -> 0.60 -> 0.28 -> 0.12
  let saturation: number;
  if (abs <= 1) {
    saturation = 1 - abs * 0.4;
  } else if (abs <= 2) {
    saturation = 0.6 - (abs - 1) * 0.32;
  } else {
    saturation = Math.max(0.1, 0.28 - (abs - 2) * 0.16);
  }

  // Subtle blur capped at 3px to preserve GPU frame budgets
  const blur = abs <= 0.15 ? 0 : Math.min(3, abs * 0.9);

  // Depth ordering
  const zIndex = Math.round(50 - abs * 10);

  return { scale, opacity, saturation, blur, zIndex };
}
