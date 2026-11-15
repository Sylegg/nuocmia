"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { COLLECTIBLE_CARDS, type GoodsProduct } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { formatPrice } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";

interface CollectionShelfProps {
  currentCard: GoodsProduct;
  onSelectCard: (card: GoodsProduct) => void;
}

export function CollectionShelf({
  currentCard,
  onSelectCard,
}: CollectionShelfProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const addToCart = useMarketplaceStore((s) => s.addToCart);

  const sameSub = COLLECTIBLE_CARDS.filter(
    (c) =>
      c.id !== currentCard.id &&
      c.category === currentCard.category &&
      c.subcategory === currentCard.subcategory
  );
  const sameCategory = COLLECTIBLE_CARDS.filter(
    (c) =>
      c.id !== currentCard.id &&
      c.category === currentCard.category &&
      c.subcategory !== currentCard.subcategory
  );
  const others = COLLECTIBLE_CARDS.filter(
    (c) => c.id !== currentCard.id && c.category !== currentCard.category
  );
  const shelfProducts = [...sameSub, ...sameCategory, ...others].slice(0, 8);

  const scrollByAmount = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="mt-12 border-t border-[#242a36] pt-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.16em] text-[#edc38a] uppercase">
            Sản phẩm cùng danh mục
          </span>
          <h2 className="mt-1 font-editorial text-2xl font-bold tracking-tight text-[#f3eee5]">
            Khám phá thêm
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Cuộn sang trái"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#f3eee5] transition-colors hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Cuộn sang phải"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#f3eee5] transition-colors hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-4 overflow-x-auto pb-3 scroll-smooth"
      >
        {shelfProducts.map((item) => {
          const trail = getProductCategoryTrail(item).join(" › ");
          return (
            <div
              key={item.id}
              className="group relative w-[210px] shrink-0 overflow-hidden product-card-corners border border-[#282e3a] bg-[#0b0f18] p-3 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-[#7b5b3a] hover:shadow-black sm:w-[230px]"
            >
              <button
                type="button"
                onClick={() => onSelectCard(item)}
                className="block w-full text-left cursor-pointer"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden product-card-corners bg-[#07090f] border border-white/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="230px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    style={{ objectPosition: `50% ${item.artFocusY ?? "34%"}` }}
                  />
                </div>

                <div className="mt-3 px-1">
                  <p className="truncate text-[11px] font-medium text-[#edc38a]">
                    {trail}
                  </p>
                  <h3 className="mt-0.5 truncate font-editorial text-base font-bold text-[#f3eee5]">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#edc38a]">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>
              </button>

              {item.price !== undefined && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item.id, 1);
                  }}
                  disabled={item.stock <= 0}
                  aria-label={`Thêm ${item.name} vào giỏ`}
                  className="absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#241709] transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
