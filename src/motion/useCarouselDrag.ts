"use client";

import { useCallback, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

interface UseCarouselDragOptions {
  trackIndex: MotionValue<number>;
  dragPixelsPerCard: number;
  disabled?: boolean;
  onDragStart?: () => void;
  onSnapToVirtual: (virtualTarget: number) => void;
}

interface VelocitySample {
  x: number;
  t: number;
}

export function useCarouselDrag({
  trackIndex,
  dragPixelsPerCard,
  disabled = false,
  onDragStart,
  onSnapToVirtual,
}: UseCarouselDragOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const activePointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTrackRef = useRef(0);
  const didDragRef = useRef(false);
  const lockAxisRef = useRef<"none" | "x" | "y">("none");
  const samplesRef = useRef<VelocitySample[]>([]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (disabled) return;
      // Ignore right click or interactive buttons inside controls
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-carousel-control='true']")) return;

      activePointerIdRef.current = e.pointerId;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      startTrackRef.current = trackIndex.get();
      didDragRef.current = false;
      lockAxisRef.current = "none";
      samplesRef.current = [{ x: e.clientX, t: performance.now() }];
    },
    [disabled, trackIndex]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (activePointerIdRef.current !== e.pointerId || disabled) return;

      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;

      if (lockAxisRef.current === "none") {
        if (Math.hypot(dx, dy) < 7) return;
        if (Math.abs(dy) > Math.abs(dx) * 1.15 && e.pointerType !== "mouse") {
          // Yield to vertical scroll on touch devices
          lockAxisRef.current = "y";
          activePointerIdRef.current = null;
          return;
        }
        lockAxisRef.current = "x";
        didDragRef.current = true;
        setIsDragging(true);
        onDragStart?.();
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Ignore if capture is unsupported
        }
      }

      if (lockAxisRef.current !== "x") return;

      const nextTrack = startTrackRef.current - dx / dragPixelsPerCard;
      trackIndex.set(nextTrack);

      const now = performance.now();
      samplesRef.current.push({ x: e.clientX, t: now });
      // Keep samples within last 90ms for accurate release velocity
      samplesRef.current = samplesRef.current.filter((s) => now - s.t <= 90);
    },
    [disabled, dragPixelsPerCard, onDragStart, trackIndex]
  );

  const finishDrag = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      activePointerIdRef.current = null;

      if (!didDragRef.current) {
        setIsDragging(false);
        return;
      }

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }

      setIsDragging(false);

      const samples = samplesRef.current;
      let velocityCardsPerSec = 0;
      if (samples.length >= 2) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0.008) {
          const vxPxPerSec = (last.x - first.x) / dt;
          velocityCardsPerSec = -vxPxPerSec / dragPixelsPerCard;
        }
      }

      // Clamp momentum projection so a fast flick advances smoothly without wild overshooting
      const clampedMomentum = Math.max(-1.6, Math.min(1.6, velocityCardsPerSec * 0.16));
      const snapTarget = Math.round(trackIndex.get() + clampedMomentum);
      onSnapToVirtual(snapTarget);

      // Reset didDrag slightly after click phase fires
      requestAnimationFrame(() => {
        didDragRef.current = false;
      });
    },
    [dragPixelsPerCard, onSnapToVirtual, trackIndex]
  );

  const wasDragged = useCallback(() => didDragRef.current, []);

  return {
    isDragging,
    wasDragged,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onPointerCancel: finishDrag,
    },
  };
}
