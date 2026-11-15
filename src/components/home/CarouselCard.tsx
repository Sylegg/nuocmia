"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type GoodsProduct } from "@/data/cards";
import {
  getMainCategoryName,
  getSubcategoryName,
  getVariantName,
} from "@/data/categories";
import { cn, PRODUCT_CARD_RADIUS } from "@/lib/utils";
import {
  EASE_OUT_EXPO,
  HOVER_TILT_SPRING,
  MICRO_SPRING,
  type RadialGeometry,
  computeCardVisualMetrics,
  normalizeRelativeIndex,
} from "@/motion/motionConfig";
import { useReducedMotion } from "@/motion/useReducedMotion";
import type { RectSnapshot, TransitionPhase } from "@/store/useMarketplaceStore";

export const CARD_TOP_OFFSET = 32;

interface CarouselCardProps {
  card: GoodsProduct;
  index: number;
  total: number;
  trackIndex: MotionValue<number>;
  geometry: RadialGeometry;
  isActive: boolean;
  isDetailTarget: boolean;
  transitionPhase: TransitionPhase;
  isDragging: boolean;
  onSelectInactive: (index: number) => void;
  onOpenDetail: (
    card: GoodsProduct,
    originRect: RectSnapshot,
    index: number
  ) => void;
  registerActiveEl: (el: HTMLDivElement | null) => void;
}

export function CarouselCard({
  card,
  index,
  total,
  trackIndex,
  geometry,
  isActive,
  isDetailTarget,
  transitionPhase,
  isDragging,
  onSelectInactive,
  onOpenDetail,
  registerActiveEl,
}: CarouselCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardInnerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, HOVER_TILT_SPRING);
  const tiltY = useSpring(rawTiltY, HOVER_TILT_SPRING);

  const rel = useTransform(trackIndex, (v) =>
    normalizeRelativeIndex(index, v, total)
  );

  const x = useTransform(rel, (r) => {
    const rad = (r * geometry.angleStepDeg * Math.PI) / 180;
    return geometry.radiusX * Math.sin(rad);
  });

  const y = useTransform(rel, (r) => {
    const rad = (r * geometry.angleStepDeg * Math.PI) / 180;
    return geometry.radiusY * (1 - Math.cos(rad));
  });

  const rotate = useTransform(rel, (r) => r * geometry.rotationStepDeg);

  const scale = useTransform(
    rel,
    (r) => computeCardVisualMetrics(r, geometry.maxVisibleOffset).scale
  );

  const baseOpacity = useTransform(
    rel,
    (r) => computeCardVisualMetrics(r, geometry.maxVisibleOffset).opacity
  );

  const zIndex = useTransform(
    rel,
    (r) => computeCardVisualMetrics(r, geometry.maxVisibleOffset).zIndex
  );

  const filter = useTransform(rel, (r) => {
    const { saturation, blur } = computeCardVisualMetrics(
      r,
      geometry.maxVisibleOffset
    );
    if (blur <= 0.05 && saturation >= 0.98) return "none";
    return `saturate(${saturation.toFixed(2)}) blur(${blur.toFixed(2)}px)`;
  });

  const pointerEvents = useTransform(rel, (r) =>
    Math.abs(r) > geometry.maxVisibleOffset - 0.15 ? "none" : "auto"
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isActive || isDragging || prefersReducedMotion) return;
      const el = cardInnerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rawTiltY.set(px * 8);
      rawTiltX.set(-py * 8);
    },
    [isActive, isDragging, prefersReducedMotion, rawTiltX, rawTiltY]
  );

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    rawTiltX.set(0);
    rawTiltY.set(0);
  }, [rawTiltX, rawTiltY]);

  const handleClick = useCallback(() => {
    if (isDragging) return;
    if (!isActive) {
      onSelectInactive(index);
      return;
    }
    const el = cardInnerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onOpenDetail(
      card,
      {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
        borderRadius: PRODUCT_CARD_RADIUS,
      },
      index
    );
  }, [card, index, isActive, isDragging, onOpenDetail, onSelectInactive]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      cardInnerRef.current = node;
      if (isActive) {
        registerActiveEl(node);
      }
    },
    [isActive, registerActiveEl]
  );

  const isDetailReceded =
    transitionPhase === "opening" || transitionPhase === "detail";

  const hideSourceCard =
    isDetailTarget &&
    (transitionPhase === "opening" ||
      transitionPhase === "detail" ||
      transitionPhase === "closing");

  const mainName = getMainCategoryName(card.category);
  const subName = getSubcategoryName(card.category, card.subcategory);
  const variantName = getVariantName(
    card.category,
    card.subcategory,
    card.variant
  );
  const subBadge = variantName ? `${subName} · ${variantName}` : subName;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: CARD_TOP_OFFSET,
        left: "50%",
        width: geometry.cardWidth,
        height: geometry.cardHeight,
        marginLeft: -geometry.cardWidth / 2,
        x,
        y,
        rotate,
        scale,
        opacity: baseOpacity,
        zIndex,
        filter,
        pointerEvents,
        transformOrigin: "50% 60%",
        willChange: "transform, opacity",
      }}
      className="select-none"
    >
      <motion.div
        animate={{
          opacity: hideSourceCard ? 0 : isDetailReceded && !isDetailTarget ? 0 : 1,
          scale: isDetailReceded && !isDetailTarget ? 0.9 : 1,
        }}
        transition={{
          duration: isDetailReceded ? 0.24 : 0,
          ease: EASE_OUT_EXPO,
        }}
        style={{
          visibility: hideSourceCard ? "hidden" : "visible",
        }}
        className="relative h-full w-full"
      >
        {/* Inner Hover / Tilt / Press Element */}
        <motion.div
          ref={setRef}
          role="button"
          tabIndex={isActive ? 0 : -1}
          aria-label={
            isActive
              ? `Xem chi tiết ${card.name}`
              : `Chọn ${card.name}`
          }
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          onPointerEnter={() => setHovered(true)}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          animate={{
            y: isActive && hovered && !isDragging ? -7 : 0,
            scale:
              isActive && hovered && !isDragging
                ? 1.032
                : !isActive && hovered && !isDragging
                  ? 1.015
                  : 1,
          }}
          whileTap={{ scale: 0.98 }}
          transition={MICRO_SPRING}
          style={{
            rotateX: isActive && !prefersReducedMotion ? tiltX : 0,
            rotateY: isActive && !prefersReducedMotion ? tiltY : 0,
            transformPerspective: 900,
          }}
          className={cn(
            "group relative h-full w-full cursor-pointer overflow-hidden product-card-corners bg-[#101826] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4bc83] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090c14]",
            isActive
              ? "border border-[#e4bc83] ring-1 ring-[#e4bc83]/50 shadow-[0_0_36px_rgba(228,188,131,0.22),0_24px_56px_-14px_rgba(0,0,0,0.85)]"
              : "border border-[#282e3a] ring-1 ring-white/10 shadow-[0_14px_30px_-14px_rgba(0,0,0,0.7)]"
          )}
        >
          <Image
            src={card.image}
            alt={card.name}
            fill
            sizes="(max-width: 768px) 210px, 270px"
            priority={isActive || Math.abs(index) <= 2}
            draggable={false}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            style={{ objectPosition: `50% ${card.artFocusY ?? "34%"}` }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 product-card-corners ring-1 ring-inset ring-white/30"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-t from-[#0B111A]/95 via-[#0B111A]/55 to-transparent"
          />

          {/* Product Bottom Metadata */}
          <motion.div
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0.7,
              y: isActive ? 0 : 4,
            }}
            transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
            className="absolute inset-x-0 bottom-0 p-4 text-left text-white"
          >
            <span className="text-[10px] font-medium tracking-[0.08em] text-[#edc38a] uppercase">
              {subBadge ? `${mainName} · ${subBadge}` : mainName}
            </span>

            <h3 className="mt-1 truncate font-editorial text-[20px] font-bold leading-tight tracking-tight text-[#f3eee5]">
              {card.name}
            </h3>

          </motion.div>

          {!isActive && (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-white/10 transition-opacity duration-200",
                hovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
