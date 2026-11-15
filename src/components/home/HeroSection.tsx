"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { useMarketplaceStore, type RectSnapshot } from "@/store/useMarketplaceStore";
import { Starfield } from "@/components/Starfield";
import { HeroHeading } from "./HeroHeading";
import { RadialCarousel } from "./RadialCarousel";
import { HeroCarouselToggle } from "./HeroCarouselToggle";

interface HeroSectionProps {
  onRegisterCenterSlotGetter: (getter: () => RectSnapshot | null) => void;
}

export function HeroSection({ onRegisterCenterSlotGetter }: HeroSectionProps) {
  const [cardsHidden, setCardsHidden] = useState(false);
  const reducedMotion = useReducedMotion();
  const transitionPhase = useMarketplaceStore((s) => s.transitionPhase);
  const receded =
    transitionPhase === "opening" || transitionPhase === "detail";

  return (
    <div
      id="top"
      className="hero-viewport relative flex flex-col overflow-hidden border-b border-[#282e3a]/60 bg-[#090c14]"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(9,12,20,0.48) 0%, rgba(9,12,20,0.22) 50%, rgba(9,12,20,0.6) 100%), url("/hero.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Starfield />

      {/* Subtle radial celestial aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(228,188,131,0.08),transparent_70%)]"
      />

      <HeroHeading receded={receded} />

      <motion.div
        id="hero-carousel"
        aria-hidden={cardsHidden}
        inert={cardsHidden}
        initial={false}
        animate={{ opacity: cardsHidden ? 0 : 1, y: cardsHidden && !reducedMotion ? 48 : 0, scale: cardsHidden && !reducedMotion ? 0.96 : 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex min-h-0 flex-1 flex-col"
        style={{ pointerEvents: cardsHidden ? "none" : "auto" }}
      >
        <RadialCarousel isHidden={cardsHidden} onRegisterCenterSlotGetter={onRegisterCenterSlotGetter} />
      </motion.div>
      <HeroCarouselToggle collapsed={cardsHidden} onToggle={() => setCardsHidden((hidden) => !hidden)} />
    </div>
  );
}
