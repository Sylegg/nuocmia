"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import { getProductCategoryTrail } from "@/data/categories";
import { formatPrice } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";

export function SearchDialog() {
  const isSearchOpen = useMarketplaceStore((s) => s.isSearchOpen);
  const setSearchOpen = useMarketplaceStore((s) => s.setSearchOpen);
  const openCardDetail = useMarketplaceStore((s) => s.openCardDetail);

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [isSearchOpen, setSearchOpen]);

  useLayoutEffect(() => {
    if (!isSearchOpen) return;
    const previousFocus = document.activeElement;
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [isSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COLLECTIBLE_CARDS.slice(0, 6);
    return COLLECTIBLE_CARDS.filter((product) =>
      [
        product.name,
        ...getProductCategoryTrail(product),
        product.description ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  // Unmount the entire blocking layer on close, without waiting for an exit spring.
  return isSearchOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-16 sm:pt-24"
          role="dialog"
          aria-modal="true"
          aria-label="Tìm kiếm sản phẩm"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-[#282e3a] bg-[#101520] shadow-2xl text-[#f3eee5]"
          >
            <div className="flex items-center gap-3 border-b border-[#242a36] px-5 py-4">
              <Search className="h-4.5 w-4.5 text-[#edc38a]" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm Pola, Postcard, Card vuông, Key, Standee..."
                className="flex-1 bg-transparent text-sm text-[#f3eee5] placeholder:text-[#727685] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Đóng tìm kiếm"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#aaaab6] hover:text-[#edc38a] hover:border-[#7b5b3a] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {results.length === 0 ? (
                <p className="py-10 text-center text-sm text-[#aaaab6]">
                  Không tìm thấy sản phẩm cho &ldquo;{query}&rdquo;.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {results.map((product) => {
                    const trail = getProductCategoryTrail(product);
                    return (
                      <li key={product.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchOpen(false);
                            openCardDetail(product.id, "catalog", null);
                          }}
                          className="flex w-full items-center gap-3.5 rounded-2xl p-2.5 text-left transition-colors hover:bg-white/5 cursor-pointer"
                        >
                          <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-[#090c14] border border-white/5">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="block truncate font-editorial text-base font-bold text-[#f3eee5]">
                              {product.name}
                            </span>
                            <p className="mt-0.5 text-xs text-[#edc38a]">
                              {trail.join(" › ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <strong className="text-sm font-bold text-[#edc38a]">
                              {formatPrice(product.price)}
                            </strong>
                            <ArrowRight className="h-4 w-4 text-[#727685]" />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#242a36] bg-[#0b0f18] px-5 py-2.5 text-[11px] text-[#aaaab6]">
              <span>Tra cứu nhanh Shop Goods Arcana</span>
              <span>ESC để đóng</span>
            </div>
          </motion.div>
        </div>
  ) : null;
}
