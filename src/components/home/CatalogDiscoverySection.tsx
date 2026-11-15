"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import { COLLECTIBLE_CARDS, CURATED_CARDS, type GoodsProduct } from "@/data/cards";
import { cn, formatPrice, getSiteScale, PRODUCT_CARD_RADIUS } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/motion/motionConfig";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";

import { ProductFilters } from "@/components/commerce/ProductFilters";
import { categoryLabel, inShopCategory } from "@/data/shop-categories";
import { getGoodsShopCategory } from "@/data/cards";
import { foldText } from "@/lib/arcana-catalog";

const curatedById = new Map(CURATED_CARDS.map((card) => [card.id, card]));

export function CatalogDiscoverySection() {
  const [category, setCategory] = useState("");
  const [favorites, setFavorites] = useState(false);
  const [query, setQuery] = useState("");

  const wishlistIds = useMarketplaceStore((s) => s.wishlistIds);
  const toggleWishlist = useMarketplaceStore((s) => s.toggleWishlist);
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const openCardDetail = useMarketplaceStore((s) => s.openCardDetail);
  const detailCardId = useMarketplaceStore((s) => s.detailCardId);
  const detailSource = useMarketplaceStore((s) => s.detailSource);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const terms = foldText(query).split(/\s+/).filter(Boolean);
  const filteredCards = COLLECTIBLE_CARDS.filter((card) => {
    const shopCategory = getGoodsShopCategory(card);
    if (category && !inShopCategory(shopCategory, category)) return false;
    if (favorites && !wishlistIds.includes(card.id)) return false;
    const text = foldText([card.name, curatedById.get(card.id)?.code, categoryLabel(shopCategory, true)].join(" "));
    return terms.every((term) => text.includes(term));
  });

  const handleOpenDetail = (card: GoodsProduct) => {
    const el = cardRefs.current[card.id];
    const rect = el?.getBoundingClientRect();
    const siteScale = getSiteScale();
    openCardDetail(
      card.id,
      "catalog",
      rect
        ? {
            top: rect.top / siteScale,
            left: rect.left / siteScale,
            width: rect.width / siteScale,
            height: rect.height / siteScale,
            borderRadius: PRODUCT_CARD_RADIUS,
          }
        : null
    );
  };

  const handleAddToCart = (e: React.MouseEvent, card: GoodsProduct) => {
    e.stopPropagation();
    addToCart(card.id, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent, cardId: string) => {
    e.stopPropagation();
    toggleWishlist(cardId);
  };

  return (
    <section id="collections-section" className="w-full bg-[#FAF7F2] py-14 sm:py-20 text-[#1A1917]">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-10">
        {/* Eyebrow Label */}
        <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[#8C827A] uppercase">
          <span className="h-[1.5px] w-5 bg-[#8C827A]" />
          <span>THE CURATED STORE</span>
        </div>

        {/* Title and Worlds Indicator */}
        <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-[-0.01em] text-[#1A1917] leading-[1.08]">
              Những lá bài đáng{" "}
              <span className="italic text-[#B6804D] font-normal">
                sở hữu.
              </span>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#766E65] font-normal">
              Tìm lá bài khiến bạn muốn dừng lại ngắm thêm một lần nữa.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <ProductFilters category={category} favorites={favorites} query={query} onCategory={setCategory} onQuery={setQuery}
            resultSummary={`${filteredCards.length} sản phẩm`}
            onFavorites={() => setFavorites((value) => !value)} />
        </div>

        {/* Product Cards Grid */}
        {filteredCards.length === 0 ? (
          <div className="mt-14 py-16 text-center">
            <p className="text-sm font-medium text-[#766E65]">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('');
                setFavorites(false);
                setQuery("");
              }}
              className="mt-4 text-xs font-semibold text-[#B6804D] hover:underline cursor-pointer"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {filteredCards.map((card, index) => {
              const isWishlisted = wishlistIds.includes(card.id);
              const curated = curatedById.get(card.id);

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: index * 0.05, ease: EASE_OUT_EXPO }}
                  onClick={() => handleOpenDetail(card)}
                  className="group relative flex flex-col cursor-pointer select-none"
                >
                  {/* Artwork Container */}
                  <div
                    ref={(el) => { cardRefs.current[card.id] = el; }}
                    data-card-origin={card.id}
                    style={{ visibility: detailSource === "catalog" && detailCardId === card.id ? "hidden" : "visible" }}
                    className="relative aspect-[3/4] w-full overflow-hidden product-card-corners bg-[#EBE5DA] border border-[#1A1917]/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
                  >
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Badge Top Left */}
                    <div className="absolute top-3 left-3 z-10">
                      {curated?.badgeType === "best-seller" && (
                        <span className="inline-block rounded-full bg-[#1E3A2F] border border-[#2D5442] px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-white uppercase shadow-sm">
                          {curated.badge}
                        </span>
                      )}
                      {curated?.badgeType === "rare" && (
                        <span className="inline-block rounded-full bg-[#1A2C3C] border border-[#2B465D] px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-white uppercase shadow-sm">
                          {curated.badge}
                        </span>
                      )}
                      {curated?.badgeType === "limited" && (
                        <span className="inline-block rounded-full bg-white border border-[#D8D0C5] px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-[#1A1917] uppercase shadow-sm">
                          {curated.badge}
                        </span>
                      )}
                      {curated?.badgeType === "favorite" && (
                        <span className="inline-block rounded-full bg-[#2D1E33] border border-[#483352] px-2.5 py-0.5 text-[9.5px] font-bold tracking-[0.1em] text-white uppercase shadow-sm">
                          {curated.badge}
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart Top Right */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, card.id)}
                      aria-label="Yêu thích thẻ này"
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 backdrop-blur-sm border border-black/5 shadow-sm transition-all hover:bg-white active:scale-90 cursor-pointer"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isWishlisted
                            ? "fill-rose-500 text-rose-500"
                            : "text-[#1A1917]"
                        )}
                      />
                    </button>

                    {/* Hover Quick View Button */}
                    <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 text-[10.5px] font-bold tracking-[0.14em] text-[#1A1917] shadow-lg border border-black/5 uppercase hover:bg-white transition-all">
                        <span>XEM NHANH</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Card Info Below Artwork */}
                  <div className="mt-3.5 flex flex-col">
                    {/* Series Code & Rating */}
                    <div className="flex items-center justify-between text-[10.5px] font-medium tracking-[0.16em] text-[#938A81] uppercase">
                      <span>{curated?.code}</span>
                      <span className="text-[#C59254] text-xs font-serif tracking-tight">
                        {curated && "★".repeat(curated.stars)}
                        {curated && "☆".repeat(Math.max(0, 5 - curated.stars))}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-editorial text-lg sm:text-[19px] font-bold text-[#1A1917] leading-snug mt-1 group-hover:text-[#B6804D] transition-colors line-clamp-1">
                      {card.name}
                    </h3>

                    {/* Element / Edition */}
                    <p className="text-xs text-[#8A8279] mt-0.5 font-normal">
                      {categoryLabel(getGoodsShopCategory(card), true)}
                    </p>

                    {/* Price & Add to Cart Action */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-bold text-base text-[#1A1917]">
                        {formatPrice(card.price)}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, card)}
                        aria-label={`Thêm ${card.name} vào giỏ hàng`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8D0C5] text-[#1A1917] transition-all hover:border-[#1A1917] hover:bg-[#1A1917] hover:text-white active:scale-90 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
