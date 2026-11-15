"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Heart, Package, Tag, UserCheck } from "lucide-react";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { cn, formatPrice } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { Drawer } from "@/components/ui/Drawer";

export function AccountDrawer() {
  const isAccountOpen = useMarketplaceStore((s) => s.isAccountOpen);
  const demoOrders = useMarketplaceStore((s) => s.demoOrders);
  const recentlyViewedIds = useMarketplaceStore((s) => s.recentlyViewedIds);
  const wishlistIds = useMarketplaceStore((s) => s.wishlistIds);

  const setAccountOpen = useMarketplaceStore((s) => s.setAccountOpen);
  const openCardDetail = useMarketplaceStore((s) => s.openCardDetail);

  const [tab, setTab] = useState<"orders" | "recent" | "wishlist">("orders");

  const recentProducts = recentlyViewedIds
    .map((id) => COLLECTIBLE_CARDS.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const savedProducts = COLLECTIBLE_CARDS.filter((c) =>
    wishlistIds.includes(c.id)
  );

  return (
    <Drawer
      open={isAccountOpen}
      onClose={() => setAccountOpen(false)}
      title="Tài khoản sưu tầm"
      subtitle="Hồ sơ thành viên Arcana · Lưu trữ cục bộ"
    >
      {/* Profile Card */}
      <div className="rounded-2xl border border-[#7b5b3a]/60 bg-gradient-to-br from-[#1b1712] via-[#101520] to-[#0f1923] p-4 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e4bc83]/20 to-[#101520] border border-[#e4bc83]/50 text-[#edc38a] shadow-inner">
            <UserCheck className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <strong className="text-sm font-bold text-[#f3eee5]">
                Minh Anh
              </strong>
              <span className="rounded-full bg-[#e4bc83]/15 px-2 py-0.5 text-[10px] font-semibold text-[#edc38a] border border-[#e4bc83]/40">
                Nhà Sưu Tầm
              </span>
            </div>
            <p className="text-xs text-[#9aa0ae]">
              minhanh.arcana@collector.demo
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-3 gap-1.5 rounded-full bg-[#0b0f18] p-1 border border-[#282e3a]">
        {[
          { id: "orders" as const, label: "Đơn hàng", icon: Package },
          { id: "recent" as const, label: "Đã xem", icon: Clock },
          { id: "wishlist" as const, label: "Đã lưu", icon: Heart },
        ].map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium transition-all cursor-pointer",
                active
                  ? "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#241709] font-bold shadow-md shadow-[#edc38a]/20"
                  : "text-[#9aa0ae] hover:text-[#f3eee5]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-5">
        {tab === "orders" && (
          <div className="space-y-3">
            {demoOrders.map((order) => (
              <div
                key={order.orderNumber}
                className="rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="font-mono text-xs font-bold text-[#edc38a]">
                    {order.orderNumber}
                  </strong>
                  <span className="rounded-full bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#9aa0ae]">
                  {order.createdAt} · {order.shippingMethod}
                </p>

                <ul className="mt-3 space-y-2 border-t border-[#282e3a]/70 pt-2.5">
                  {order.items.map((item, idx) => (
                    <li
                      key={`${order.orderNumber}-${idx}`}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="block truncate font-medium text-[#f3eee5]">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-[11px] text-[#727685]">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <span className="shrink-0 font-semibold text-[#edc38a]">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex justify-between border-t border-[#282e3a]/70 pt-2 text-xs font-bold text-[#f3eee5]">
                  <span>Tổng đơn</span>
                  <span className="text-[#edc38a]">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recent" && (
          <div className="space-y-2.5">
            {recentProducts.length === 0 ? (
              <p className="py-10 text-center text-xs text-[#9aa0ae]">
                Chưa có sản phẩm nào được xem gần đây.
              </p>
            ) : (
              recentProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    openCardDetail(product.id, "catalog", null);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-2.5 text-left transition-colors hover:bg-[#141b29] hover:border-[#7b5b3a]/70 cursor-pointer"
                >
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#181f2f] border border-[#282e3a]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#f3eee5]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#9aa0ae]">
                      {getProductCategoryTrail(product).join(" › ")}
                    </p>
                  </div>
                  <strong className="text-xs font-bold text-[#edc38a]">
                    {formatPrice(product.price)}
                  </strong>
                </button>
              ))
            )}
          </div>
        )}

        {tab === "wishlist" && (
          <div className="space-y-2.5">
            {savedProducts.length === 0 ? (
              <p className="py-10 text-center text-xs text-[#9aa0ae]">
                Chưa có sản phẩm nào trong mục yêu thích.
              </p>
            ) : (
              savedProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    setAccountOpen(false);
                    openCardDetail(product.id, "catalog", null);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-2.5 text-left transition-colors hover:bg-[#141b29] hover:border-[#7b5b3a]/70 cursor-pointer"
                >
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#181f2f] border border-[#282e3a]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#f3eee5]">
                      {product.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-[#9aa0ae]">
                      <Tag className="h-3 w-3 text-[#edc38a]" />
                      {getProductCategoryTrail(product).join(" › ")}
                    </p>
                  </div>
                  <strong className="text-xs font-bold text-[#edc38a]">
                    {formatPrice(product.price)}
                  </strong>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}