"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import {
  PREMIUM_SPRING,
  normalizeRelativeIndex,
  wrapIndex,
} from "./motionConfig";
import { useReducedMotion } from "./useReducedMotion";

interface UseRadialCarouselOptions {
  total: number;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  disabled?: boolean;
}

export function useRadialCarousel({
  total,
  activeIndex,
  onActiveIndexChange,
  disabled = false,
}: UseRadialCarouselOptions) {
  const prefersReducedMotion = useReducedMotion();
  const trackIndex = useMotionValue(activeIndex);
  const animRef = useRef<AnimationPlaybackControls | null>(null);
  const lastWheelAtRef = useRef(0);
  const internalSyncRef = useRef(false);

  const stopAnimation = useCallback(() => {
    if (animRef.current) {
      animRef.current.stop();
      animRef.current = null;
    }
  }, []);

  const animateToVirtual = useCallback(
    (virtualTarget: number) => {
      stopAnimation();
      const wrapped = wrapIndex(virtualTarget, total);
      internalSyncRef.current = true;
      onActiveIndexChange(wrapped);

      if (prefersReducedMotion) {
        trackIndex.set(virtualTarget);
        return;
      }

      animRef.current = animate(trackIndex, virtualTarget, {
        ...PREMIUM_SPRING,
        onComplete: () => {
          animRef.current = null;
        },
      });
    },
    [onActiveIndexChange, prefersReducedMotion, stopAnimation, total, trackIndex]
  );

  // Sync external activeIndex changes (e.g., switching card inside detail view)
  useEffect(() => {
    if (internalSyncRef.current) {
      internalSyncRef.current = false;
      return;
    }
    const currentRounded = Math.round(trackIndex.get());
    const wrappedCurrent = wrapIndex(currentRounded, total);
    if (wrappedCurrent !== activeIndex) {
      const delta = normalizeRelativeIndex(activeIndex, currentRounded, total);
      const nextVirtual = currentRounded + delta;
      stopAnimation();
      trackIndex.set(nextVirtual);
    }
  }, [activeIndex, stopAnimation, total, trackIndex]);

  const goToIndex = useCallback(
    (targetWrappedIndex: number) => {
      if (disabled || total <= 0) return;
      const currentVirtual = trackIndex.get();
      const currentNearest = Math.round(currentVirtual);
      const delta = normalizeRelativeIndex(targetWrappedIndex, currentNearest, total);
      animateToVirtual(currentNearest + delta);
    },
    [animateToVirtual, disabled, total, trackIndex]
  );

  const stepBy = useCallback(
    (delta: number) => {
      if (disabled || total <= 0) return;
      const currentNearest = Math.round(trackIndex.get());
      animateToVirtual(currentNearest + delta);
    },
    [animateToVirtual, disabled, total, trackIndex]
  );

  const next = useCallback(() => stepBy(1), [stepBy]);
  const prev = useCallback(() => stepBy(-1), [stepBy]);

  // Scoped horizontal wheel handler (never hijacks vertical page scrolling)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (disabled) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX <= absY * 1.25 || absX < 20) return;

      e.preventDefault();
      const now = performance.now();
      if (now - lastWheelAtRef.current < 320) return;
      lastWheelAtRef.current = now;

      if (e.deltaX > 0) next();
      else prev();
    },
    [disabled, next, prev]
  );

  useEffect(() => () => stopAnimation(), [stopAnimation]);

  return {
    trackIndex,
    stopAnimation,
    animateToVirtual,
    goToIndex,
    stepBy,
    next,
    prev,
    handleWheel,
  };
}
