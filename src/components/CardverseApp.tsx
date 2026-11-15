"use client";

import { useCallback, useRef } from "react";
import { MotionConfig } from "framer-motion";
import type { RectSnapshot } from "@/store/useMarketplaceStore";
import { HomeHeader } from "./layout/SiteHeader";
import { Footer } from "./layout/Footer";
import { HeroSection } from "./home/HeroSection";
import { CatalogDiscoverySection } from "./home/CatalogDiscoverySection";
import { ProductDetailOverlay } from "./detail/ProductDetailOverlay";
import { SearchDialog } from "./commerce/SearchDialog";
import { AuthModal } from "./auth/AuthModal";
import { ToastBanner } from "./ui/Toast";

export function CardverseApp() {
  const centerSlotGetterRef = useRef<() => RectSnapshot | null>(() => null);

  const handleRegisterCenterSlotGetter = useCallback(
    (getter: () => RectSnapshot | null) => {
      centerSlotGetterRef.current = getter;
    },
    []
  );

  const getCenterSlotRect = useCallback(
    () => centerSlotGetterRef.current(),
    []
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate min-h-screen bg-[#090c14] text-[#f3eee5]">
        <HomeHeader />

        <main className="relative z-10">
          <HeroSection
            onRegisterCenterSlotGetter={handleRegisterCenterSlotGetter}
          />
          <div className="relative bg-[#FAF7F2] text-[#1A1917]">
            <CatalogDiscoverySection />
          </div>
        </main>

        <div className="relative z-10">
          <Footer />
        </div>

        {/* Shared-Element 3D Two-Turn Flip Detail View */}
        <ProductDetailOverlay getCenterSlotRect={getCenterSlotRect} />

        {/* Quick Search Dialog, Auth Modal & Notification Toast */}
        <SearchDialog />
        <AuthModal />
        <ToastBanner />
      </div>
    </MotionConfig>
  );
}
