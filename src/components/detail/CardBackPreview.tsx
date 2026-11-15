"use client";

import { Sparkles } from "lucide-react";
import type { GoodsProduct } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { cn } from "@/lib/utils";

interface CardBackPreviewProps {
  card: GoodsProduct;
  className?: string;
}

export function CardBackPreview({ card, className }: CardBackPreviewProps) {
  const trail = getProductCategoryTrail(card).join(" › ");

  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden product-card-corners border border-[#e4bc83] bg-gradient-to-br from-[#0b0f18] via-[#101520] to-[#07090f] p-5 text-white shadow-2xl select-none",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-sm border border-[#e4bc83]/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-xs border border-[#7b5b3a]/30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-52 w-52 rounded-full border border-[#e4bc83]/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-36 w-36 rounded-full border border-amber-200/15"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-[10px] font-semibold tracking-[0.22em] text-[#edc38a] uppercase">
          Arcana Goods
        </span>
        <div className="my-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#7b5b3a] bg-[#090c14]/90 shadow-lg shadow-black/80">
          <svg
            viewBox="0 0 48 48"
            className="h-10 w-10"
            fill="none"
            aria-hidden="true"
          >
            <path d="M24 2.5 45.5 24 24 45.5 2.5 24 24 2.5Z" stroke="#e4bc83" strokeWidth="1.2" />
            <circle cx="24" cy="24" r="13" stroke="#e4bc83" strokeWidth=".7" opacity=".6" />
            <path d="m24 8 3.3 12.7L40 24l-12.7 3.3L24 40l-3.3-12.7L8 24l12.7-3.3L24 8Z" fill="#edc38a" />
            <path d="m24 15 1.8 7.2L33 24l-7.2 1.8L24 33l-1.8-7.2L15 24l7.2-1.8L24 15Z" fill="#090c14" />
            <circle cx="24" cy="24" r="1.6" fill="#e4bc83" />
          </svg>
        </div>
        <strong className="font-editorial text-2xl font-bold tracking-[0.16em] text-[#f3eee5]">
          ARCANA
        </strong>
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-[#edc38a]">
          <Sparkles className="h-3 w-3 text-[#f5d783]" />
          {trail}
        </span>
        <span className="mt-3 max-w-[200px] truncate rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[11px] text-[#aaaab6]">
          {card.name}
        </span>
      </div>
    </div>
  );
}
