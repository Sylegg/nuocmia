"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";

interface HeroCarouselToggleProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function HeroCarouselToggle({ collapsed, onToggle }: HeroCarouselToggleProps) {
  const reducedMotion = useReducedMotion();
  const overlayOpen = useMarketplaceStore((state) =>
    Boolean(state.detailCardId) || state.isSearchOpen || state.isCartOpen ||
    state.isWishlistOpen || state.isCheckoutOpen || state.isAccountOpen
  );

  const label = collapsed ? "Hi\u1ec7n v\u00f2ng xoay th\u1ebb" : "\u1ea8n v\u00f2ng xoay th\u1ebb";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-20 flex justify-center">
      <AnimatePresence initial={false}>
        {!overlayOpen && (
          <motion.button
            key="hero-carousel-toggle"
            type="button"
            aria-label={label}
            title={label}
            aria-controls="hero-carousel"
            aria-expanded={!collapsed}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.85 }}
            transition={{ duration: reducedMotion ? 0 : 0.22 }}
            whileHover={reducedMotion ? undefined : { scale: 1.08, y: -3 }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            onClick={onToggle}
            className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#e4bc83]/60 bg-[#090c14]/85 text-[#edc38a] shadow-[0_4px_24px_rgba(9,12,20,0.4),0_0_20px_rgba(228,188,131,0.12)] backdrop-blur-md transition-colors hover:border-[#f5d783] hover:bg-[#171b25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edc38a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#090c14]"
          >
            <motion.span
              aria-hidden="true"
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
