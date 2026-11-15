"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  RotateCw,
  ShoppingBag,
  X,
  ZoomIn,
} from "lucide-react";
import { COLLECTIBLE_CARDS, type GoodsProduct } from "@/data/cards";
import {
  getMainCategoryName,
  getSubcategoryName,
  getVariantName,
} from "@/data/categories";
import { cn, formatPrice, getSiteScale, PRODUCT_CARD_RADIUS } from "@/lib/utils";
import {
  EASE_OUT_EXPO,
  FLIGHT_SPRING,
  HOVER_TILT_SPRING,
  PREMIUM_SPRING,
} from "@/motion/motionConfig";
import { useReducedMotion } from "@/motion/useReducedMotion";
import {
  useMarketplaceStore,
  type RectSnapshot,
} from "@/store/useMarketplaceStore";
import { Button } from "@/components/ui/Button";
import { CardBackPreview } from "./CardBackPreview";
import { CollectionShelf } from "./CollectionShelf";
import { TwoSidedCardFaces } from "./TwoSidedCard3D";

interface ProductDetailOverlayProps {
  getCenterSlotRect: () => RectSnapshot | null;
}

export function ProductDetailOverlay({
  getCenterSlotRect,
}: ProductDetailOverlayProps) {
  const prefersReducedMotion = useReducedMotion();

  const detailCardId = useMarketplaceStore((s) => s.detailCardId);
  const transitionPhase = useMarketplaceStore((s) => s.transitionPhase);
  const originRect = useMarketplaceStore((s) => s.originRect);
  const wishlistIds = useMarketplaceStore((s) => s.wishlistIds);
  const cartItems = useMarketplaceStore((s) => s.cartItems);

  const setTransitionPhase = useMarketplaceStore((s) => s.setTransitionPhase);
  const switchDetailCard = useMarketplaceStore((s) => s.switchDetailCard);
  const finishCloseDetail = useMarketplaceStore((s) => s.finishCloseDetail);
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const toggleWishlist = useMarketplaceStore((s) => s.toggleWishlist);

  const product = useMemo(
    () => COLLECTIBLE_CARDS.find((c) => c.id === detailCardId) ?? null,
    [detailCardId]
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const staticCardRef = useRef<HTMLDivElement | null>(null);
  const closingFromPopstateRef = useRef(false);
  const pushedHistoryRef = useRef(false);
  const handleRequestCloseRef = useRef<() => void>(() => {});

  const [targetCardRect, setTargetCardRect] = useState<RectSnapshot>({
    top: 88,
    left: 500,
    width: 292,
    height: 389,
    borderRadius: PRODUCT_CARD_RADIUS,
  });
  const [measuredCardId, setMeasuredCardId] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, HOVER_TILT_SPRING);
  const tiltY = useSpring(rawTiltY, HOVER_TILT_SPRING);

  const computeCenteredCardRect = useCallback((): RectSnapshot => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const isMobile = vw < 640;
    const width = isMobile ? 236 : vw < 1024 ? 264 : 292;
    const height = Math.round((width * 4) / 3);
    const left = Math.round((vw / getSiteScale() - width) / 2);
    const top = isMobile ? 74 : 88;
    const borderRadius = PRODUCT_CARD_RADIUS;
    return { top, left, width, height, borderRadius };
  }, []);

  useLayoutEffect(() => {
    if (!product) return;
    setQuantity(1);
    setIsCardFlipped(false);
    setIsZoomOpen(false);
    setJustAdded(false);
    rawTiltX.set(0);
    rawTiltY.set(0);
    setTargetCardRect(computeCenteredCardRect());
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [product, computeCenteredCardRect, rawTiltX, rawTiltY]);

  // Measure the rendered destination before mounting the flight, including on first open.
  useLayoutEffect(() => {
    if (!product) {
      setMeasuredCardId(null);
      return;
    }
    const rect = staticCardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const scale = getSiteScale();
    setTargetCardRect((previous) => ({
      ...previous,
      top: rect.top / scale,
      left: rect.left / scale,
    }));
    setMeasuredCardId(product.id);
  }, [product, targetCardRect.width, targetCardRect.height]);

  useEffect(() => {
    if (!product) return;
    const onResize = () => setTargetCardRect(computeCenteredCardRect());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [product, computeCenteredCardRect]);

  useEffect(() => {
    if (!detailCardId) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = "hidden";
    // Lock viewport scrolling without making body a scroll container for the sticky video.
    body.style.overflow = "clip";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap / getSiteScale()}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [detailCardId]);

  const handleRequestClose = useCallback(() => {
    const state = useMarketplaceStore.getState();
    if (!state.detailCardId || state.transitionPhase === "closing") return;

    setIsZoomOpen(false);
    // Return control to the page immediately rather than waiting for a closing flight.
    finishCloseDetail();

    if (
      !closingFromPopstateRef.current &&
      window.location.hash.startsWith("#card-")
    ) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
    pushedHistoryRef.current = false;
    closingFromPopstateRef.current = false;
  }, [finishCloseDetail]);

  useEffect(() => {
    handleRequestCloseRef.current = handleRequestClose;
  }, [handleRequestClose]);

  useEffect(() => {
    if (!product) {
      pushedHistoryRef.current = false;
      return;
    }
    const hash = `#card-${product.slug}`;
    if (!pushedHistoryRef.current) {
      pushedHistoryRef.current = true;
      if (window.location.hash !== hash) {
        window.history.pushState({ cardverseDetail: product.id }, "", hash);
      }
    } else if (window.location.hash !== hash) {
      window.history.replaceState({ cardverseDetail: product.id }, "", hash);
    }

    const onPopState = () => {
      if (useMarketplaceStore.getState().detailCardId) {
        closingFromPopstateRef.current = true;
        handleRequestCloseRef.current();
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [product]);

  // Safety failsafe: guarantee opening/closing phases can never hang
  useEffect(() => {
    if (transitionPhase !== "opening" && transitionPhase !== "closing") return;
    const timer = window.setTimeout(() => {
      const current = useMarketplaceStore.getState().transitionPhase;
      if (current === "opening") {
        setTransitionPhase("detail");
      } else if (current === "closing") {
        finishCloseDetail();
      }
    }, transitionPhase === "closing" ? 1600 : 1800);
    return () => window.clearTimeout(timer);
  }, [finishCloseDetail, setTransitionPhase, transitionPhase]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (isZoomOpen) {
        setIsZoomOpen(false);
      } else {
        handleRequestClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, handleRequestClose, isZoomOpen]);

  useEffect(() => {
    if (!prefersReducedMotion) return;
    if (transitionPhase === "opening") {
      setTransitionPhase("detail");
    } else if (transitionPhase === "closing") {
      finishCloseDetail();
    }
  }, [
    finishCloseDetail,
    prefersReducedMotion,
    setTransitionPhase,
    transitionPhase,
  ]);

  if (!product) return null;

  const mainCategoryName = getMainCategoryName(product.category);
  const subcategoryName = getSubcategoryName(
    product.category,
    product.subcategory
  );
  const standeeVariantName = getVariantName(
    product.category,
    product.subcategory,
    product.variant
  );

  const isWishlisted = wishlistIds.includes(product.id);
  const inCartQty = cartItems
    .filter((i) => i.cardId === product.id)
    .reduce((sum, i) => sum + i.quantity, 0);
  const remainingStock = Math.max(0, product.stock - inCartQty);

  const handleAdd = () => {
    const ok = addToCart(product.id, quantity);
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1400);
    }
  };

  const handleSwitchCard = (nextProduct: GoodsProduct) => {
    switchDetailCard(nextProduct.id);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !isSettledDetail) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rawTiltY.set(px * 9);
    rawTiltX.set(-py * 9);
  };

  const handleCardPointerLeave = () => {
    rawTiltX.set(0);
    rawTiltY.set(0);
  };

  const isOpening = transitionPhase === "opening";
  const isClosing = transitionPhase === "closing";
  const isSettledDetail = transitionPhase === "detail";

  const fallbackOrigin: RectSnapshot = originRect ?? {
    top: targetCardRect.top + 60,
    left: targetCardRect.left,
    width: Math.round(targetCardRect.width * 0.85),
    height: Math.round(targetCardRect.height * 0.85),
    borderRadius: PRODUCT_CARD_RADIUS,
  };

  const flyingStartRect = fallbackOrigin;
  const flyingEndRect = targetCardRect;

  const baseWidth = Math.max(1, targetCardRect.width);
  const baseHeight = Math.max(1, targetCardRect.height);

  const rawFromX = flyingStartRect.left + flyingStartRect.width / 2 - baseWidth / 2;
  const fromY = flyingStartRect.top + flyingStartRect.height / 2 - baseHeight / 2;
  const fromScaleX = flyingStartRect.width / baseWidth;
  const fromScaleY = flyingStartRect.height / baseHeight;

  const rawToX = flyingEndRect.left + flyingEndRect.width / 2 - baseWidth / 2;
  const toY = flyingEndRect.top + flyingEndRect.height / 2 - baseHeight / 2;
  const toScaleX = flyingEndRect.width / baseWidth;
  const toScaleY = flyingEndRect.height / baseHeight;

  const fromX = rawFromX;
  const toX = rawToX;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`Chi tiết ${product.name}`}
    >
      {/* Dark Luxury Celestial Glass Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: isClosing ? 0.24 : 0.24, ease: EASE_OUT_EXPO }}
        onClick={handleRequestClose}
        className="fixed inset-0 bg-[#090c14]/88 backdrop-blur-md"
      />

      {/* Ambient Gold & Deep Celestial Aura Behind Top-Centered Card */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: isClosing ? 0.22 : 0.28 }}
        className="pointer-events-none fixed inset-x-0 top-0 h-[540px] bg-[radial-gradient(50%_60%_at_50%_38%,rgba(228,188,131,0.12),rgba(22,59,99,0.32)_45%,transparent_75%)]"
      />

      {/* Decorative opening flight; any interaction cancels it immediately. */}
      {isOpening && measuredCardId === product.id && !prefersReducedMotion && (
        <motion.div
          key={`${product.id}-${isClosing ? "close" : "open"}`}
          initial={{
            x: fromX,
            y: fromY,
            scaleX: fromScaleX,
            scaleY: fromScaleY,
          }}
          animate={{
            x: toX,
            y: toY,
            scaleX: toScaleX,
            scaleY: toScaleY,
          }}
          transition={FLIGHT_SPRING}
          onAnimationComplete={() => {
            if (useMarketplaceStore.getState().transitionPhase === "opening") {
              setTransitionPhase("detail");
            }
          }}
          style={{
            top: 0,
            left: 0,
            width: baseWidth,
            height: baseHeight,
            transformOrigin: "50% 50%",
            perspective: 1300,
            willChange: "transform",
          }}
          className="pointer-events-none fixed z-30"
        >
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 720 }}
            transition={FLIGHT_SPRING}
            style={{ transformStyle: "preserve-3d", willChange: "transform" }}
            className="relative h-full w-full"
          >
            <TwoSidedCardFaces
              card={product}
              borderRadius={flyingEndRect.borderRadius}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Detail controls and scrolling remain available during the opening flight. */}
      <div
        ref={scrollContainerRef}
        onPointerDownCapture={() => {
          if (isOpening) setTransitionPhase("detail");
        }}
        onKeyDownCapture={() => {
          if (isOpening) setTransitionPhase("detail");
        }}
        onScrollCapture={() => {
          if (isOpening) setTransitionPhase("detail");
        }}
        className="relative z-20 h-full w-full overflow-y-auto overscroll-contain pb-20"
      >
        {/* Top Floating Controls Bar */}
        <motion.div
          initial={false}
          animate={{ opacity: isClosing ? 0 : 1, y: isClosing ? -8 : 0 }}
          transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
          className="mx-auto flex h-[74px] max-w-[1120px] items-center justify-between px-4 sm:h-[88px] sm:px-6"
        >
          <button
            type="button"
            onClick={handleRequestClose}
            className="inline-flex items-center gap-2 rounded-full border border-[#363643] bg-[#101520]/90 px-4 py-2 text-xs font-semibold text-[#f3eee5] shadow-lg backdrop-blur-md transition-all hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại vòng xoay
          </button>

          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Đóng chi tiết sản phẩm"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#363643] bg-[#101520]/90 text-[#aaaab6] shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-[#7b5b3a] hover:text-[#edc38a] active:scale-95 cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </motion.div>

        {/* Centered Interactive 2-Sided Card Stage */}
        <div className="flex flex-col items-center px-4">
          <div
            ref={staticCardRef}
            style={{
              width: targetCardRect.width,
              height: targetCardRect.height,
              perspective: 1300,
              opacity: isSettledDetail || prefersReducedMotion ? 1 : 0,
            }}
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
            onClick={() => setIsCardFlipped((prev) => !prev)}
            role="button"
            tabIndex={0}
            aria-label={`Lật mặt trước/sau của ${product.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsCardFlipped((prev) => !prev);
              }
            }}
            className="relative cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#163B63] focus-visible:ring-offset-4 product-card-corners"
          >
            <motion.div
              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
              transition={PREMIUM_SPRING}
              style={{
                rotateX: prefersReducedMotion ? 0 : tiltX,
                transformStyle: "preserve-3d",
              }}
              className="relative h-full w-full"
            >
              <motion.div
                style={{
                  rotateY: prefersReducedMotion ? 0 : tiltY,
                  transformStyle: "preserve-3d",
                }}
                className="relative h-full w-full"
              >
                <TwoSidedCardFaces
                  card={product}
                  borderRadius={targetCardRect.borderRadius}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Front / Back / Zoom Controls */}
          <motion.div
            initial={false}
            animate={{
              opacity: isClosing ? 0 : 1,
              y: isClosing ? 8 : 0,
            }}
            transition={{
              duration: 0.3,
              delay: isSettledDetail ? 0.04 : 0,
              ease: EASE_OUT_EXPO,
            }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#282e3a] bg-[#101520]/90 p-1.5 shadow-xl backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setIsCardFlipped(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                !isCardFlipped
                  ? "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#241709] font-bold shadow-md shadow-amber-950/40"
                  : "text-[#aaaab6] hover:text-[#f3eee5]"
              )}
            >
              Mặt trước
            </button>
            <button
              type="button"
              onClick={() => setIsCardFlipped(true)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                isCardFlipped
                  ? "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#241709] font-bold shadow-md shadow-amber-950/40"
                  : "text-[#aaaab6] hover:text-[#f3eee5]"
              )}
            >
              <RotateCw className="h-3 w-3" />
              Mặt sau
            </button>
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              aria-label="Phóng to hình ảnh"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#363643] bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-[#f3eee5] transition-colors hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
            >
              <ZoomIn className="h-3.5 w-3.5" />
              Phóng to
            </button>
          </motion.div>
        </div>

        {/* Product Info Panel (strictly scoped to goods category & product fields) */}
        <motion.div
          initial={false}
          animate={{
            opacity: isClosing ? 0 : 1,
            y: isClosing ? 14 : 0,
          }}
          transition={{
            duration: isClosing ? 0.18 : 0.42,
            delay: isClosing ? 0 : 0.2,
            ease: EASE_OUT_EXPO,
          }}
          className="mx-auto mt-8 w-[calc(100%-24px)] max-w-[1040px] rounded-[28px] border border-[#282e3a] bg-[#101520]/95 p-6 text-[#f3eee5] shadow-2xl backdrop-blur-xl sm:w-[92vw] sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left: Category hierarchy, Name, Description */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#7b5b3a]/80 bg-[#e4bc83]/15 px-3 py-0.5 text-xs font-semibold text-[#edc38a]">
                  {mainCategoryName}
                </span>
                {subcategoryName && (
                  <span className="rounded-full border border-[#282e3a] bg-[#0b0f18] px-3 py-0.5 text-xs font-semibold text-[#f3eee5]">
                    {subcategoryName}
                  </span>
                )}
                {standeeVariantName && (
                  <span className="rounded-full border border-emerald-800/80 bg-emerald-950/60 px-3 py-0.5 text-xs font-semibold text-emerald-300">
                    Loại {standeeVariantName}
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-editorial text-3xl font-bold tracking-tight text-[#f3eee5] sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {product.description && (
                <p className="mt-4 text-sm leading-relaxed text-[#aaaab6] sm:text-base">
                  {product.description}
                </p>
              )}

              {/* Exact Category Classification Info */}
              <dl className="mt-7 grid grid-cols-1 gap-3 border-t border-[#242a36] pt-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#282e3a] bg-[#0b0f18] px-4 py-3">
                  <dt className="text-[11px] font-medium text-[#727685] uppercase">
                    Danh mục chính
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-[#f3eee5]">
                    {mainCategoryName}
                  </dd>
                </div>

                {subcategoryName && (
                  <div className="rounded-2xl border border-[#282e3a] bg-[#0b0f18] px-4 py-3">
                    <dt className="text-[11px] font-medium text-[#727685] uppercase">
                      Danh mục con
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#f3eee5]">
                      {subcategoryName}
                    </dd>
                  </div>
                )}

                {standeeVariantName && (
                  <div className="rounded-2xl border border-emerald-900/60 bg-[#0c1814] px-4 py-3">
                    <dt className="text-[11px] font-medium text-[#7ca592] uppercase">
                      Phân loại Standee
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-emerald-300">
                      {standeeVariantName}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Right: Price & Cart / Wishlist Controls */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#282e3a] bg-[#0b0f18]/90 p-5 sm:p-7 lg:col-span-5">
              <div>
                {product.price !== undefined && (
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-3xl font-bold tracking-tight text-[#edc38a]">
                      {formatPrice(product.price)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        remainingStock > 0
                          ? "border border-emerald-800/70 bg-emerald-950/70 text-emerald-300"
                          : "border border-rose-900/70 bg-rose-950/70 text-rose-300"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {remainingStock > 0
                        ? `Còn ${remainingStock} sản phẩm`
                        : "Hết hàng"}
                    </span>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="inline-flex h-12 items-center rounded-full border border-[#282e3a] bg-[#101520] px-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Giảm số lượng"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#f3eee5] transition-colors hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold tabular-nums text-[#f3eee5]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) =>
                          Math.min(Math.max(1, remainingStock), q + 1)
                        )
                      }
                      disabled={quantity >= remainingStock}
                      aria-label="Tăng số lượng"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#f3eee5] transition-colors hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAdd}
                    disabled={remainingStock <= 0 || product.price === undefined}
                    className="min-w-[160px] flex-1"
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        Đã thêm vào giỏ
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Thêm vào giỏ
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      isWishlisted ? "Bỏ lưu sản phẩm" : "Lưu sản phẩm"
                    }
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all cursor-pointer",
                      isWishlisted
                        ? "border-rose-500/80 bg-rose-950/80 text-rose-400"
                        : "border-[#363643] bg-white/5 text-[#aaaab6] hover:border-[#7b5b3a] hover:text-[#edc38a]"
                    )}
                  >
                    <Heart
                      className={cn(
                        "h-4.5 w-4.5",
                        isWishlisted && "fill-current"
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <CollectionShelf
            currentCard={product}
            onSelectCard={handleSwitchCard}
          />
        </motion.div>
      </div>

      {/* High-Resolution Zoom Lightbox */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={PREMIUM_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[420px] overflow-hidden rounded-[26px] border border-[#282e3a] bg-[#101520] p-3.5 shadow-2xl text-[#f3eee5]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden product-card-corners border border-white/5">
                {isCardFlipped ? (
                  <CardBackPreview card={product} />
                ) : (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="420px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between px-2 pb-1">
                <div>
                  <p className="font-editorial text-base font-bold text-[#f3eee5]">
                    {product.name} ({isCardFlipped ? "Mặt sau" : "Mặt trước"})
                  </p>
                  <p className="text-xs text-[#edc38a]">
                    {mainCategoryName}
                    {subcategoryName ? ` › ${subcategoryName}` : ""}
                    {standeeVariantName ? ` › ${standeeVariantName}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(false)}
                  aria-label="Đóng phóng to"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#aaaab6] transition-colors hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
