"use client";

import Image from "next/image";
import type { GoodsProduct } from "@/data/cards";
import {
  getMainCategoryName,
  getSubcategoryName,
  getVariantName,
} from "@/data/categories";
import { cn, formatPrice, PRODUCT_CARD_RADIUS } from "@/lib/utils";
import { CardBackPreview } from "./CardBackPreview";

interface TwoSidedCardFacesProps {
  card: GoodsProduct;
  borderRadius?: number;
  className?: string;
}

/**
 * Renders both the Front and Back faces inside a `preserve-3d` parent.
 * Front sits at rotateY(0deg), Back sits at rotateY(180deg).
 */
export function TwoSidedCardFaces({
  card,
  borderRadius = PRODUCT_CARD_RADIUS,
  className,
}: TwoSidedCardFacesProps) {
  const mainName = getMainCategoryName(card.category);
  const subName = getSubcategoryName(card.category, card.subcategory);
  const variantName = getVariantName(
    card.category,
    card.subcategory,
    card.variant
  );
  const subBadge = variantName ? `${subName} · ${variantName}` : subName;

  return (
    <>
      {/* FRONT FACE */}
      <div
        style={{
          borderRadius,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(0deg) translateZ(1px)",
        }}
        className={cn(
          "absolute inset-0 overflow-hidden bg-[#101826] border border-[#e4bc83] ring-1 ring-[#e4bc83]/40 shadow-[0_0_40px_rgba(228,188,131,0.22),0_28px_64px_-16px_rgba(0,0,0,0.85)]",
          className
        )}
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          priority
          sizes="(max-width: 640px) 240px, 310px"
          className="object-cover"
          style={{ objectPosition: `50% ${card.artFocusY ?? "34%"}` }}
        />

        <div
          aria-hidden="true"
          style={{ borderRadius }}
          className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/20"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[#090c14] via-[#090c14]/60 to-transparent"
        />

        {/* Top Badges */}
        <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2">
          <span className="rounded-full border border-[#7b5b3a]/80 bg-[#090c14]/90 px-3 py-0.5 text-[10px] font-bold text-[#edc38a] backdrop-blur-md">
            {mainName}
          </span>
          {card.price !== undefined && (
            <span className="rounded-full bg-gradient-to-r from-[#edc592] to-[#cea063] px-2.5 py-0.5 text-[11px] font-bold text-[#241709] shadow-md shadow-amber-950/50">
              {formatPrice(card.price)}
            </span>
          )}
        </div>

        {/* Bottom Metadata */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-left text-white sm:p-5">
          {subBadge && (
            <span className="inline-flex rounded-full border border-[#7b5b3a]/70 bg-[#101520]/80 px-2.5 py-0.5 text-[10px] font-semibold text-[#edc38a] backdrop-blur-md">
              {subBadge}
            </span>
          )}

          <h3 className="mt-2 truncate font-editorial text-2xl font-bold leading-tight tracking-tight text-[#f3eee5]">
            {card.name}
          </h3>
        </div>
      </div>

      {/* BACK FACE */}
      <div
        style={{
          borderRadius,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg) translateZ(1px)",
        }}
        className="absolute inset-0 overflow-hidden shadow-[0_28px_64px_-16px_rgba(0,0,0,0.85)]"
      >
        <CardBackPreview card={card} />
      </div>
    </>
  );
}
