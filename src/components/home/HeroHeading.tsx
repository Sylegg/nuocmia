"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EASE_OUT_EXPO } from "@/motion/motionConfig";
import { useReducedMotion } from "@/motion/useReducedMotion";

interface HeroHeadingProps {
  receded: boolean;
}

export function HeroHeading({ receded }: HeroHeadingProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      animate={{
        opacity: receded ? 0.08 : 1,
        y: receded ? -12 : 0,
        scale: receded ? 0.985 : 1,
      }}
      transition={{
        duration: receded ? 0.24 : 0.28,
        ease: EASE_OUT_EXPO,
      }}
      className="hero-heading relative z-10 mx-auto w-full max-w-3xl shrink-0 px-4 text-center"
      style={{
        filter: receded && !prefersReducedMotion ? "blur(3px)" : "blur(0px)",
        transition: "filter 280ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Top Badge */}
      <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-[#7b5b3a]/70 bg-[#e4bc83]/10 px-3.5 py-1 text-[11px] font-semibold tracking-[0.18em] text-[#edc38a] uppercase backdrop-blur-md">
        <Sparkles className="h-3 w-3 text-[#f5d783]" />
        <span>SHOP PASS ĐỒ SƯU TẦM</span>
      </div>

      {/* Main Serif Headline */}
      <h1 className="hero-title font-editorial font-bold leading-[1.15] tracking-[-0.015em] text-[#f7f4ec] drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)]">
        <span className="inline-block">Tìm món bạn thích,</span>{" "}
        <span className="inline-block italic font-normal bg-gradient-to-r from-[#edd097] via-[#f7dfa5] to-[#d8a85e] bg-clip-text text-transparent drop-shadow-[0_2px_14px_rgba(237,208,151,0.25)]">
          gom đủ bộ.
        </span>
      </h1>

      {/* Editorial Introduction with balanced line breaks */}
      <div className="mx-auto mt-2.5 sm:mt-3.5 max-w-2xl px-2">
        <p className="text-[13.5px] sm:text-[15px] md:text-[16px] leading-relaxed text-[#c9cfda] font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] [text-wrap:balance]">
          <span className="block text-[#ded9ce]">
            Ghé Arcana xem <span className="text-[#f5ebd7] font-medium">đồ nhựa</span>,{" "}
            <span className="text-[#f5ebd7] font-medium">đồ giấy</span> và{" "}
            <span className="text-[#f5ebd7] font-medium">nhiều món khác</span> đang được pass.
          </span>
          <span className="block mt-1 sm:mt-1.5 text-[#edd097] font-editorial italic text-[15px] sm:text-[17px] tracking-wide">
            Biết đâu bạn tìm được món còn thiếu trong bộ sưu tập.
          </span>
        </p>
      </div>
    </motion.div>
  );
}
