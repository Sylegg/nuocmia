"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Lock, ShieldCheck, X } from "lucide-react";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { cn, formatPrice } from "@/lib/utils";
import { PREMIUM_SPRING } from "@/motion/motionConfig";
import { type DemoOrder, useMarketplaceStore } from "@/store/useMarketplaceStore";
import { Button } from "@/components/ui/Button";

export function CheckoutModal() {
  const isCheckoutOpen = useMarketplaceStore((s) => s.isCheckoutOpen);
  const cartItems = useMarketplaceStore((s) => s.cartItems);
  const promoCode = useMarketplaceStore((s) => s.promoCode);
  const setCheckoutOpen = useMarketplaceStore((s) => s.setCheckoutOpen);
  const placeDemoOrder = useMarketplaceStore((s) => s.placeDemoOrder);
  const setAccountOpen = useMarketplaceStore((s) => s.setAccountOpen);

  const [customerName, setCustomerName] = useState("Minh Anh");
  const [email, setEmail] = useState("minhanh.collector@cardverse.demo");
  const [shippingAddress, setShippingAddress] = useState(
    "128 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
  );
  const [shippingMethod, setShippingMethod] = useState<
    "Archival Priority" | "Express Insured"
  >("Archival Priority");
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  useEffect(() => {
    if (!isCheckoutOpen) {
      setConfirmedOrder(null);
      setError(null);
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCheckoutOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCheckoutOpen, setCheckoutOpen]);

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
  const shippingFee =
    shippingMethod === "Express Insured"
      ? 35000
      : subtotal >= 300000
        ? 0
        : 20000;
  const total = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !email.includes("@") ||
      shippingAddress.trim().length < 8
    ) {
      setError("Vui lòng nhập đầy đủ họ tên, email và địa chỉ nhận hàng.");
      return;
    }
    if (enrichedItems.length === 0) {
      setError("Giỏ hàng hiện đang trống.");
      return;
    }

    setError(null);
    const order = placeDemoOrder({
      customerName: customerName.trim(),
      email: email.trim(),
      shippingAddress: shippingAddress.trim(),
      shippingMethod,
    });
    setConfirmedOrder(order);
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Thanh toán mô phỏng"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={PREMIUM_SPRING}
            className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#282e3a] bg-[#101520] p-6 shadow-2xl text-[#f3eee5] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#242a36] pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7b5b3a]/70 bg-[#e4bc83]/15 px-3 py-0.5 text-[11px] font-semibold text-[#edc38a]">
                  <Lock className="h-3 w-3" />
                  Đặt hàng mô phỏng (Demo) — Không thu phí thật
                </span>
                <h2 className="mt-2 font-editorial text-3xl font-bold tracking-tight text-[#f3eee5]">
                  {confirmedOrder
                    ? "Đã ghi nhận đơn hàng Arcana"
                    : "Thông tin giao nhận"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Đóng thanh toán"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#aaaab6] hover:border-[#7b5b3a] hover:text-[#edc38a] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {confirmedOrder ? (
              <div className="py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-600/50 bg-emerald-950/60 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-4 font-editorial text-3xl font-bold text-[#f3eee5]">
                  Cảm ơn bạn, {confirmedOrder.customerName}
                </h3>
                <p className="mt-1 text-sm text-[#aaaab6]">
                  Đơn hàng mô phỏng đã được lưu vào lịch sử tài khoản trên trình duyệt.
                </p>

                <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-2xl border border-dashed border-[#7b5b3a] bg-[#0b0f18] px-5 py-2.5">
                  <span className="text-xs text-[#aaaab6]">Mã đơn Demo #</span>
                  <strong className="font-mono text-base font-bold text-[#edc38a]">
                    {confirmedOrder.orderNumber}
                  </strong>
                </div>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#282e3a] bg-[#0b0f18] p-4 text-left text-xs">
                  <div className="flex justify-between text-[#aaaab6]">
                    <span>Vận chuyển</span>
                    <span className="font-medium text-[#f3eee5]">
                      {confirmedOrder.shippingMethod}
                    </span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-[#aaaab6]">
                    <span>Số lượng</span>
                    <span className="font-medium text-[#f3eee5]">
                      {confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)}{" "}
                      sản phẩm
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-[#242a36] pt-2 text-sm font-bold text-[#f3eee5]">
                    <span>Tổng đơn</span>
                    <span className="text-[#edc38a]">
                      {formatPrice(confirmedOrder.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setCheckoutOpen(false);
                      setAccountOpen(true);
                    }}
                  >
                    Xem lịch sử đơn Demo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCheckoutOpen(false)}
                  >
                    Quay lại cửa hàng
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-8 md:grid-cols-12"
              >
                <div className="space-y-4 md:col-span-7">
                  <div>
                    <label className="block text-xs font-semibold text-[#f3eee5]">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#282e3a] bg-[#0b0f18] px-3.5 text-sm text-[#f3eee5] focus:border-[#edc38a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f3eee5]">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#282e3a] bg-[#0b0f18] px-3.5 text-sm text-[#f3eee5] focus:border-[#edc38a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#f3eee5]">
                      Địa chỉ giao hàng
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#282e3a] bg-[#0b0f18] p-3 text-sm text-[#f3eee5] focus:border-[#edc38a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#f3eee5]">
                      Hình thức giao hàng
                    </span>
                    <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
                      {(
                        [
                          {
                            id: "Archival Priority" as const,
                            desc: "2–4 ngày · Miễn phí từ 300.000₫",
                            cost: subtotal >= 300000 ? "Miễn phí" : "20.000₫",
                          },
                          {
                            id: "Express Insured" as const,
                            desc: "Giao nhanh đóng gói chống sốc",
                            cost: "35.000₫",
                          },
                        ] as const
                      ).map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setShippingMethod(method.id)}
                          className={cn(
                            "rounded-2xl border p-3 text-left transition-all cursor-pointer",
                            shippingMethod === method.id
                              ? "border-[#edc38a] bg-[#e4bc83]/15 text-[#f3eee5]"
                              : "border-[#282e3a] bg-[#0b0f18] text-[#aaaab6] hover:border-[#363643]"
                          )}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-[#f3eee5]">
                            <span>{method.id}</span>
                            <span className="text-[#edc38a]">{method.cost}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-[#aaaab6]">
                            {method.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>
                      Chế độ demo: nhấn xác nhận sẽ tạo đơn mẫu trong trình duyệt mà không thực hiện giao dịch thẻ thật.
                    </span>
                  </div>

                  {error && (
                    <p className="text-xs font-medium text-rose-400">{error}</p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="flex flex-col justify-between rounded-3xl border border-[#282e3a] bg-[#0b0f18] p-5 md:col-span-5">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-[#f3eee5]">
                      Tóm tắt đơn hàng
                    </h3>
                    <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto pr-1">
                      {enrichedItems.map((item) => (
                        <li key={item.key} className="flex items-center gap-3">
                          <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-[#090c14] border border-white/5">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-[#f3eee5]">
                              {item.product.name}
                            </p>
                            <p className="text-[11px] text-[#edc38a]">
                              {getProductCategoryTrail(item.product).join(" › ")} ×{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-[#f3eee5]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <dl className="mt-4 space-y-1.5 border-t border-[#242a36] pt-3 text-xs">
                      <div className="flex justify-between text-[#aaaab6]">
                        <dt>Tạm tính</dt>
                        <dd>{formatPrice(subtotal)}</dd>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <dt>Giảm giá ({promoCode})</dt>
                          <dd>-{formatPrice(discount)}</dd>
                        </div>
                      )}
                      <div className="flex justify-between text-[#aaaab6]">
                        <dt>Vận chuyển</dt>
                        <dd>
                          {shippingFee === 0
                            ? "Miễn phí"
                            : formatPrice(shippingFee)}
                        </dd>
                      </div>
                      <div className="flex justify-between border-t border-[#242a36] pt-2 text-base font-bold text-[#f3eee5]">
                        <dt>Tổng cộng</dt>
                        <dd className="text-[#edc38a]">{formatPrice(total)}</dd>
                      </div>
                    </dl>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={enrichedItems.length === 0}
                    className="mt-6 w-full"
                  >
                    Xác nhận đơn Demo
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
