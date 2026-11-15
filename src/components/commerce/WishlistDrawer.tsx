"use client";

import Image from "next/image";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { formatPrice } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function WishlistDrawer() {
  const isWishlistOpen = useMarketplaceStore((s) => s.isWishlistOpen);
  const wishlistIds = useMarketplaceStore((s) => s.wishlistIds);
  const setWishlistOpen = useMarketplaceStore((s) => s.setWishlistOpen);
  const toggleWishlist = useMarketplaceStore((s) => s.toggleWishlist);
  const addToCart = useMarketplaceStore((s) => s.addToCart);
  const openCardDetail = useMarketplaceStore((s) => s.openCardDetail);

  const savedProducts = COLLECTIBLE_CARDS.filter((c) =>
    wishlistIds.includes(c.id)
  );

  return (
    <Drawer
      open={isWishlistOpen}
      onClose={() => setWishlistOpen(false)}
      title="Danh sách yêu thích"
      subtitle={`${savedProducts.length} sản phẩm đã lưu`}
    >
      {savedProducts.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#7b5b3a]/60 bg-[#e4bc83]/15 text-[#edc38a]">
            <Heart className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-editorial text-2xl font-bold text-[#f3eee5]">
            Chưa có sản phẩm yêu thích
          </h3>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#aaaab6]">
            Nhấn nút tim trên sản phẩm bạn thích để lưu lại và xem nhanh bất cứ lúc nào.
          </p>
          <Button
            variant="secondary"
            onClick={() => setWishlistOpen(false)}
            className="mt-5"
          >
            Tiếp tục xem sản phẩm
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {savedProducts.map((product) => {
            const trail = getProductCategoryTrail(product);
            return (
              <li
                key={product.id}
                className="flex gap-3.5 rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-3 text-[#f3eee5]"
              >
                <button
                  type="button"
                  onClick={() => {
                    setWishlistOpen(false);
                    openCardDetail(product.id, "catalog", null);
                  }}
                  className="relative h-24 w-[70px] shrink-0 overflow-hidden rounded-xl bg-[#090c14] border border-white/5 cursor-pointer"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                </button>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setWishlistOpen(false);
                          openCardDetail(product.id, "catalog", null);
                        }}
                        className="truncate text-left font-editorial text-base font-bold text-[#f3eee5] hover:text-[#edc38a] cursor-pointer"
                      >
                        {product.name}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Bỏ lưu ${product.name}`}
                        className="text-[#727685] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-[#edc38a]">
                      {trail.join(" › ")}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between">
                    <strong className="text-sm font-bold text-[#edc38a]">
                      {formatPrice(product.price)}
                    </strong>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={
                        product.stock <= 0 || product.price === undefined
                      }
                      onClick={() => addToCart(product.id, 1)}
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
