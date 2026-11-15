"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getSiteScale, PRODUCT_CARD_RADIUS } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PackageOpen } from "lucide-react";
import { COLLECTIBLE_CARDS, type GoodsProduct } from "@/data/cards";
import { matchesCategorySelection } from "@/data/categories";
import {
  EASE_OUT_EXPO,
  getRadialGeometry,
  wrapIndex,
} from "@/motion/motionConfig";
import { useRadialCarousel } from "@/motion/useRadialCarousel";
import { useCarouselDrag } from "@/motion/useCarouselDrag";
import { useMarketplaceStore, type RectSnapshot } from "@/store/useMarketplaceStore";
import { CarouselCard, CARD_TOP_OFFSET } from "./CarouselCard";
import { Button } from "@/components/ui/Button";

interface RadialCarouselProps {
  isHidden?: boolean;
  onRegisterCenterSlotGetter: (getter: () => RectSnapshot | null) => void;
}

export function RadialCarousel({
  isHidden = false,
  onRegisterCenterSlotGetter,
}: RadialCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const activeCardElRef = useRef<HTMLDivElement | null>(null);

  const [availableHeight, setAvailableHeight] = useState(0);

  useLayoutEffect(() => {
    const section = containerRef.current;
    if (!section) return;
    const update = () => setAvailableHeight(section.clientHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const [viewportWidth, setViewportWidth] = useState(1280);

  const activeIndex = useMarketplaceStore((s) => s.activeIndex);
  const filters = useMarketplaceStore((s) => s.filters);
  const detailCardId = useMarketplaceStore((s) => s.detailCardId);
  const transitionPhase = useMarketplaceStore((s) => s.transitionPhase);
  const isSearchOpen = useMarketplaceStore((s) => s.isSearchOpen);
  const isCartOpen = useMarketplaceStore((s) => s.isCartOpen);
  const isWishlistOpen = useMarketplaceStore((s) => s.isWishlistOpen);
  const isCheckoutOpen = useMarketplaceStore((s) => s.isCheckoutOpen);
  const isAccountOpen = useMarketplaceStore((s) => s.isAccountOpen);

  const setActiveIndex = useMarketplaceStore((s) => s.setActiveIndex);
  const openCardDetail = useMarketplaceStore((s) => s.openCardDetail);
  const selectMainCategory = useMarketplaceStore((s) => s.selectMainCategory);

  const filteredProducts = useMemo(
    () =>
      COLLECTIBLE_CARDS.filter((product) =>
        matchesCategorySelection(product, {
          category: filters.category,
          subcategory: filters.subcategory,
          variant: filters.variant,
        })
      ),
    [filters.category, filters.subcategory, filters.variant]
  );

  const total = filteredProducts.length;
  const filterKey = `${filters.category}-${filters.subcategory}-${filters.variant}`;

  const isAnyOverlayOpen =
    Boolean(detailCardId) ||
    isSearchOpen ||
    isCartOpen ||
    isWishlistOpen ||
    isCheckoutOpen ||
    isAccountOpen;

  const isTransitionLocked =
    isHidden ||
    transitionPhase === "opening" ||
    transitionPhase === "detail" ||
    transitionPhase === "closing";

  const hideVisualChrome =
    transitionPhase === "opening" || transitionPhase === "detail";

  useLayoutEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    const ro = new ResizeObserver(() => setViewportWidth(window.innerWidth));
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const geometry = useMemo(
    () => getRadialGeometry(viewportWidth),
    [viewportWidth]
  );

  const stageHeight =
    geometry.cardHeight +
    (geometry.breakpoint === "mobile" ? 45 : geometry.breakpoint === "tablet" ? 65 : 75);
  const stageScale =
    availableHeight > 0
      ? Math.min(1, Math.max(0.68, (availableHeight / (stageHeight + 35)) * 0.94))
      : 0.88;

  const safeActiveIndex = total > 0 ? wrapIndex(activeIndex, total) : 0;

  const {
    trackIndex,
    stopAnimation,
    animateToVirtual,
    goToIndex,
    next,
    prev,
    handleWheel,
  } = useRadialCarousel({
    total: Math.max(1, total),
    activeIndex: safeActiveIndex,
    onActiveIndexChange: setActiveIndex,
    disabled: isTransitionLocked || total <= 1,
  });

  // Reset trackIndex smoothly to 0 whenever the active category changes
  useEffect(() => {
    stopAnimation();
    trackIndex.set(0);
    setActiveIndex(0);
  }, [filterKey, setActiveIndex, stopAnimation, trackIndex]);

  const { isDragging, wasDragged, dragHandlers } = useCarouselDrag({
    trackIndex,
    dragPixelsPerCard: geometry.dragPixelsPerCard,
    disabled: isTransitionLocked || total <= 1,
    onDragStart: stopAnimation,
    onSnapToVirtual: animateToVirtual,
  });

  // Synchronize carousel center position when detail card is active
  useEffect(() => {
    if (!detailCardId) return;
    const targetIdx = filteredProducts.findIndex((p) => p.id === detailCardId);
    if (targetIdx >= 0 && targetIdx !== safeActiveIndex) {
      stopAnimation();
      trackIndex.set(targetIdx);
      setActiveIndex(targetIdx);
    }
  }, [detailCardId, filteredProducts, safeActiveIndex, setActiveIndex, stopAnimation, trackIndex]);

  const getExactCenterSlotRect = useCallback((): RectSnapshot => {
    const container = stageRef.current ?? containerRef.current;
    const r = container?.getBoundingClientRect();
    const siteScale = getSiteScale();
    const vw = window.innerWidth / siteScale;
    const width = geometry.cardWidth * stageScale;
    const height = geometry.cardHeight * stageScale;
    const top = r ? Math.round(r.top / siteScale + CARD_TOP_OFFSET * stageScale) : 480;
    const left = Math.round((vw - width) / 2);
    return {
      top,
      left,
      width,
      height,
      borderRadius: PRODUCT_CARD_RADIUS,
    };
  }, [geometry.cardHeight, geometry.cardWidth, stageScale]);

  useEffect(() => {
    onRegisterCenterSlotGetter(getExactCenterSlotRect);
  }, [getExactCenterSlotRect, onRegisterCenterSlotGetter]);

  const activeProduct = total > 0 ? filteredProducts[safeActiveIndex] : null;

  const handleOpenActiveDetail = useCallback(
    (product: GoodsProduct, originRect: RectSnapshot, idx: number) => {
      if (wasDragged() || isTransitionLocked) return;
      const scale = getSiteScale();
      const exactRect = {
        ...originRect,
        top: originRect.top / scale,
        left: originRect.left / scale,
        width: originRect.width / scale,
        height: originRect.height / scale,
      };
      openCardDetail(product.id, "carousel", exactRect, idx);
    },
    [isTransitionLocked, openCardDetail, wasDragged]
  );


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnyOverlayOpen || isTransitionLocked || total <= 1) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAnyOverlayOpen, isTransitionLocked, next, prev, total]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return (
    <motion.section
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label="Vòng xoay sản phẩm goods"
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-end overflow-hidden pb-2 sm:pb-3"
    >
      {/* Interactive Radial Drag Stage with smooth category crossfade */}
      {total === 0 ? (
        <div
          style={{ height: stageHeight, zoom: stageScale }}
          className="mx-auto flex max-w-md flex-col items-center justify-center px-6 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#7b5b3a]/60 bg-[#e4bc83]/15 text-[#edc38a]">
            <PackageOpen className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-base font-bold text-[#f3eee5]">
            Chưa có sản phẩm trong danh mục này
          </h3>
          <p className="mt-1 text-xs text-[#aaaab6]">
            Vui lòng chọn danh mục khác hoặc quay lại tất cả sản phẩm.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => selectMainCategory("all")}
            className="mt-4"
          >
            Xem tất cả sản phẩm
          </Button>
        </div>
      ) : (
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            ref={stageRef}
            key={filterKey}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
            {...dragHandlers}
            style={{ height: stageHeight, zoom: stageScale, touchAction: "pan-y", flexShrink: 0 }}
            className={`relative mx-auto w-full select-none pt-4 ${
              total > 1
                ? isDragging
                ? "cursor-grabbing"
                : "cursor-grab"
                : "cursor-default"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <CarouselCard
                key={product.id}
                card={product}
                index={index}
                total={total}
                trackIndex={trackIndex}
                geometry={geometry}
                isActive={safeActiveIndex === index}
                isDetailTarget={detailCardId === product.id}
                transitionPhase={transitionPhase}
                isDragging={isDragging}
                onSelectInactive={goToIndex}
                onOpenDetail={handleOpenActiveDetail}
                registerActiveEl={(el) => {
                  activeCardElRef.current = el;
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <p className="sr-only" aria-live="polite">
        {activeProduct ? `Đang chọn: ${activeProduct.name}` : "Danh mục trống"}
      </p>
    </motion.section>
  );
}
