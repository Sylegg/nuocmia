"use client";

import { Sparkles } from "lucide-react";


import { shopGroups } from "@/data/shop-categories";
import { catalogHref } from "@/lib/arcana-catalog";


export function Footer() {
  return (
    <footer className="border-t border-[#282e3a] bg-[#06080e] relative z-10 text-[#f3eee5]">
      <div className="mx-auto flex max-w-[1380px] flex-col justify-between gap-10 px-4 py-14 sm:px-6 md:flex-row lg:px-10">
        <div className="max-w-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#edc592] to-[#cea063] text-sm font-black text-[#241709] shadow-md shadow-[#edc38a]/20">
              ✦
            </span>
            <div className="flex flex-col">
              <span className="font-['Cormorant_Garamond',serif] text-lg font-bold tracking-[0.2em] text-[#f3eee5]">
                ARCANA CARD SHOP
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-[#cea063]">
                Bộ Sưu Tập Huyền Thoại
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-[#9aa0ae]">
            Cửa hàng goods sưu tầm theo phân loại chuẩn: Đồ giấy (Pola, Postcard, Card vuông), Đồ nhựa (Key, Standee Lớn/Nhỏ) và Khác. Tích hợp trải nghiệm 3D Arcana tương tác mượt mà.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-['Cormorant_Garamond',serif] text-sm font-bold tracking-wider text-[#edc38a] uppercase">
              Danh mục Goods
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#9aa0ae]">
              <li>
                <a href="/danh-muc" className="hover:text-[#edc38a]">Tất cả sản phẩm</a>
              </li>
              {shopGroups.map((group) => (
                <li key={group.id}>
                  <a href={`/danh-muc${catalogHref({ category: group.id })}`} className="hover:text-[#edc38a]">
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-['Cormorant_Garamond',serif] text-sm font-bold tracking-wider text-[#edc38a] uppercase">
              Tiện ích mua sắm
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-[#9aa0ae]">
              <li>
                <a
                  href="/yeu-thich"
                  className="hover:text-[#edc38a] transition-colors"
                >
                  Trang Yêu thích ↗
                </a>
              </li>
              <li>
                <a
                  href="/gio-hang"
                  className="hover:text-[#edc38a] transition-colors"
                >
                  Trang Giỏ hàng ↗
                </a>
              </li>
              <li>
                <a
                  href="/tra-cuu"
                  className="hover:text-[#edc38a] transition-colors"
                >
                  Trang Đơn hàng &amp; Tra cứu ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-['Cormorant_Garamond',serif] text-sm font-bold tracking-wider text-[#edc38a] uppercase">
              Kho Arcana
            </h3>
            <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-[#9aa0ae]">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#edc38a]" />
              <span>
                Mã{" "}
                <code className="rounded border border-[#7b5b3a]/70 bg-[#101520] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#edc38a]">
                  ARCANA10
                </code>{" "}
                giảm 10% khi thanh toán thử.
              </span>
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-[#9aa0ae]">
              <li>
                <a className="hover:text-[#edc38a] transition-colors" href="/shop#/danh-muc">
                  Danh mục Arcana Store ↗
                </a>
              </li>
              <li>
                <a className="hover:text-[#edc38a] transition-colors" href="/shop#/gio-hang">
                  Giỏ hàng Arcana Store ↗
                </a>
              </li>
              <li>
                <a className="hover:text-[#edc38a] transition-colors" href="/shop#/tra-cuu">
                  Tra cứu đơn Arcana Store ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#282e3a]/80 bg-[#04060a]">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-[11px] text-[#727685] sm:px-6 lg:px-10">
          <span>© 2026 ARCANA CARD SHOP. Bộ Sưu Tập Thần Thoại &amp; Goods Sưu Tầm.</span>
          <span>Đồng bộ hoàn chỉnh Dark Luxury · Dữ liệu lưu cục bộ</span>
        </div>
      </div>
    </footer>
  );
}
