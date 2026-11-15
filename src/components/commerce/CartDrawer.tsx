"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { formatPrice } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const isCartOpen = useMarketplaceStore((s) => s.isCartOpen);
  const cartItems = useMarketplaceStore((s) => s.cartItems);
  const promoCode = useMarketplaceStore((s) => s.promoCode);
  const setCartOpen = useMarketplaceStore((s) => s.setCartOpen);
  const updateCartQuantity = useMarketplaceStore((s) => s.updateCartQuantity);
  const removeFromCart = useMarketplaceStore((s) => s.removeFromCart);
  const applyPromoCode = useMarketplaceStore((s) => s.applyPromoCode);
  const clearPromoCode = useMarketplaceStore((s) => s.clearPromoCode);
  const setCheckoutOpen = useMarketplaceStore((s) => s.setCheckoutOpen);

  const [promoInput, setPromoInput] = useState("");
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const enrichedItems = cartItems
    .map((ci) => {
      const product = COLLECTIBLE_CARDS.find((c) => c.id === ci.cardId);
      if (!product) return null;
      return { ...ci, product };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discount = promoCode ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal === 0 ? 0 : subtotal >= 300000 ? 0 : 20000;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res.message);
    if (res.ok) setPromoInput("");
  };

  return (
    <Drawer
      open={isCartOpen}
      onClose={() => setCartOpen(false)}
      title="Giỏ hàng Arcana"
      subtitle={
        enrichedItems.length > 0
          ? `${enrichedItems.reduce((s, i) => s + i.quantity, 0)} sản phẩm đang chờ đặt`
          : "Chưa có sản phẩm trong giỏ"
      }
      footer={
        enrichedItems.length > 0 ? (
          <div className="space-y-3">
            <dl className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#aaaab6]">
                <dt>Tạm tính</dt>
                <dd className="font-medium text-[#f3eee5]">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <dt>Ưu đãi ({promoCode})</dt>
                  <dd className="font-semibold">-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between text-[#aaaab6]">
                <dt>Vận chuyển tiêu chuẩn</dt>
                <dd className="font-medium text-[#f3eee5]">
                  {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[#242a36] pt-2 text-sm font-bold text-[#f3eee5]">
                <dt>Tổng dự kiến</dt>
                <dd className="text-[#edc38a]">{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Tiếp tục đặt hàng (Demo)
            </Button>
          </div>
        ) : undefined
      }
    >
      {enrichedItems.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#7b5b3a]/60 bg-[#e4bc83]/15 text-[#edc38a]">
            <ShoppingBag className="h-6 w-6" />
          </span>
          <h3 className="mt-4 font-editorial text-2xl font-bold text-[#f3eee5]">
            Giỏ hàng đang trống
          </h3>
          <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#aaaab6]">
            Chọn sản phẩm từ vòng xoay nổi bật hoặc danh sách bên dưới để thêm vào giỏ hàng.
          </p>
          <Button
            variant="secondary"
            onClick={() => setCartOpen(false)}
            className="mt-5"
          >
            Khám phá Goods
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {enrichedItems.map((item) => {
              const canIncrement = item.quantity < item.product.stock;
              const categoryTrail = getProductCategoryTrail(item.product);

              return (
                <li
                  key={item.key}
                  className="flex gap-3.5 rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-3 text-[#f3eee5]"
                >
                  <div className="relative h-24 w-[70px] shrink-0 overflow-hidden rounded-xl bg-[#090c14] border border-white/5">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="70px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate font-editorial text-base font-bold text-[#f3eee5]">
                          {item.product.name}
                        </h4>
                        <p className="mt-0.5 text-[11px] font-medium text-[#edc38a]">
                          {categoryTrail.join(" › ")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Xóa ${item.product.name}`}
                        className="text-[#727685] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex h-8 items-center rounded-full border border-[#282e3a] bg-[#101520] px-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.key, item.quantity - 1)
                          }
                          aria-label="Giảm số lượng"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#f3eee5] hover:bg-white/10 cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-semibold tabular-nums text-[#f3eee5]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={!canIncrement}
                          onClick={() =>
                            updateCartQuantity(item.key, item.quantity + 1)
                          }
                          aria-label="Tăng số lượng"
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#f3eee5] hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <strong className="text-sm font-bold text-[#edc38a]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Promo Code */}
          <div className="rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-3.5">
            {promoCode ? (
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                  <Tag className="h-3.5 w-3.5" />
                  Đang áp dụng {promoCode} (-10%)
                </span>
                <button
                  type="button"
                  onClick={clearPromoCode}
                  className="text-[#aaaab6] hover:text-[#f3eee5] cursor-pointer"
                >
                  Gỡ mã
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Mã giảm giá (thử LEGEND10)"
                    className="h-9 flex-1 rounded-full border border-[#282e3a] bg-[#101520] px-3.5 text-xs text-[#f3eee5] placeholder:text-[#727685] focus:border-[#edc38a] focus:outline-none"
                  />
                  <Button type="submit" size="sm" variant="secondary">
                    Áp dụng
                  </Button>
                </div>
                {promoFeedback && (
                  <p className="px-1 text-[11px] text-[#aaaab6]">
                    {promoFeedback}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
