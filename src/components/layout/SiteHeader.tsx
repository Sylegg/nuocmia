"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import Link from "next/link";
import { ChevronDown, Gift, Heart, History, LogIn, LogOut, Search, ShoppingBag, Sparkles, Store, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { readAccount, readShop, subscribeShop, writeAccount } from "@/lib/arcana-shop";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { MICRO_SPRING } from "@/motion/motionConfig";
import { ArcanaHeaderArt } from "./ArcanaHeaderArt";
import { ArcanaLogo } from "./ArcanaLogo";

type HeaderProps = {
  account: boolean;
  cartCount: number;
  currentView?: string;
  catalogHref: string;
  onSearch: () => void;
  onLogout: () => void;
  onNavigate?: (href: string) => void;
  dimmed?: boolean;
};

export function HomeHeader() {
  const [account, setAccount] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState(false);
  const transitionPhase = useMarketplaceStore((s) => s.transitionPhase);
  const setSearchOpen = useMarketplaceStore((s) => s.setSearchOpen);

  useEffect(() => {
    function sync() {
      try {
        setAccount(readAccount());
        setCartCount(readShop().cart.reduce((sum, item) => sum + item.quantity, 0));
      } catch {
        // The header remains usable when browser storage is blocked.
      }
    }
    sync();
    window.addEventListener("pageshow", sync);
    const unsubscribe = subscribeShop(sync);
    return () => {
      window.removeEventListener("pageshow", sync);
      unsubscribe();
    };
  }, []);

  return (
    <>
      <SiteHeader
        account={account}
        cartCount={cartCount}
        catalogHref="/danh-muc"
        onSearch={() => setSearchOpen(true)}
        onLogout={() => {
          try {
            writeAccount(false);
            setAccount(false);
            setError(false);
          } catch {
            setError(true);
          }
        }}
        dimmed={transitionPhase === "opening" || transitionPhase === "detail"}
      />
      {error && <p role="alert" className="fixed right-4 top-24 z-40 rounded-lg bg-[#291d1f] p-3">Không thể đăng xuất. Vui lòng thử lại.</p>}
    </>
  );
}

export function SiteHeader({
  account, cartCount, currentView, catalogHref, onSearch, onLogout, onNavigate, dimmed = false,
}: HeaderProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const setAccountOpen = useMarketplaceStore((s) => s.setAccountOpen);
  const infoRef = useRef<HTMLDivElement>(null);
  const infoButton = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!infoOpen) return;
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !infoRef.current?.contains(event.target)) setInfoOpen(false);
    }
    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setInfoOpen(false);
      infoButton.current?.focus();
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [infoOpen]);

  function shopHref(view: string) {
    return currentView ? "#/" + view : "/" + view;
  }

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setInfoOpen(false);
    const href = event.currentTarget.getAttribute("href");
    if (href?.startsWith("#/") && onNavigate) {
      event.preventDefault();
      onNavigate(href);
    }
  }

  return (
    <motion.header initial={false} animate={{ opacity: dimmed ? 0.45 : 1 }}
      transition={MICRO_SPRING} className="arcana-header-frame sticky top-0 z-30 w-full">
      <ArcanaHeaderArt />
      <nav className="arcana-header-content" aria-label="Điều hướng chính">
        <div className="arcana-header-group">
          <Link href="/" aria-label="Arcana Card Shop · Trang chủ" className="arcana-header-brand group">
            <ArcanaLogo className="arcana-header-logo" />
            <span className="arcana-header-wordmark font-editorial">ARCANA</span>
          </Link>
          <a
            className="arcana-header-link arcana-header-shop"
            href={catalogHref}
            onClick={navigate}
            aria-current={currentView === "danh-muc" ? "page" : undefined}
          >
            <Store className="arcana-header-icon" />
            <span className="arcana-header-label">Cửa hàng</span>
          </a>
        </div>

        <div className="arcana-header-group">
          {/* Tìm kiếm */}
          <button
            type="button"
            className="arcana-header-link"
            onClick={() => { setInfoOpen(false); onSearch(); }}
            aria-label="Tìm kiếm sản phẩm"
            aria-haspopup="dialog"
          >
            <Search className="arcana-header-icon" />
            <span className="arcana-header-label">Tìm kiếm</span>
            <kbd className="arcana-header-kbd hidden xl:inline-flex">⌘K</kbd>
          </button>

          {/* Quà tặng & Sự kiện (Giveaway) */}
          <button
            type="button"
            className="arcana-header-link"
            onClick={() => { setInfoOpen(false); dialogRef.current?.showModal(); }}
            aria-label="Quà tặng & Sự kiện"
            aria-haspopup="dialog"
          >
            <Gift className="arcana-header-icon arcana-gift-icon" />
            <span className="arcana-header-label">Quà tặng</span>
            <span className="arcana-header-dot" aria-hidden="true" />
          </button>

          {/* User / Account Hub - Icon hình người thay vì info */}
          <div className="relative" ref={infoRef}>
            <button
              ref={infoButton}
              type="button"
              className="arcana-header-link arcana-header-info-btn"
              aria-expanded={infoOpen}
              aria-label="Tài khoản & Tiện ích"
              aria-controls="arcana-info"
              onClick={() => setInfoOpen(!infoOpen)}
            >
              <User className="arcana-header-icon" />
              <ChevronDown className={`arcana-info-chevron transition-transform duration-300 ${infoOpen ? "rotate-180" : ""}`} />
              {cartCount > 0 && (
                <span className="arcana-header-badge">{cartCount}</span>
              )}
            </button>

            <div id="arcana-info" className="arcana-info-panel" hidden={!infoOpen}>
              <div className="arcana-info-header">
                <span className="text-[11px] font-semibold tracking-wider text-[#edc38a] uppercase flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#f5d783]" /> Tiện ích Arcana
                </span>
              </div>
              {account ? (
                <a href={currentView ? "#/tra-cuu?tai-khoan=1" : "/tra-cuu#/tra-cuu?tai-khoan=1"} onClick={navigate}>
                  <User className="h-4 w-4 text-[#edc38a]" /> Chi tiết tài khoản
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setInfoOpen(false);
                    setAccountOpen(true);
                  }}
                >
                  <LogIn className="h-4 w-4 text-[#edc38a]" /> Đăng nhập / Đăng ký
                </button>
              )}
              <a href={shopHref("gio-hang")} onClick={navigate}>
                <ShoppingBag className="h-4 w-4 text-[#edc38a]" /> Đơn hàng
                <span className="arcana-info-count">{cartCount}</span>
              </a>
              {account && (
                <a href={currentView ? "#/tra-cuu?lich-su=1" : "/tra-cuu#/tra-cuu?lich-su=1"} onClick={navigate}>
                  <History className="h-4 w-4 text-[#edc38a]" /> Lịch sử đơn hàng
                </a>
              )}
              <a href={shopHref("yeu-thich")} onClick={navigate}>
                <Heart className="h-4 w-4 text-rose-400" /> Danh sách yêu thích
              </a>
              {account && (
                <button
                  type="button"
                  onClick={() => {
                    setInfoOpen(false);
                    infoButton.current?.focus();
                    onLogout();
                  }}
                >
                  <LogOut className="h-4 w-4 text-[#aaaab6]" /> Đăng xuất
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <dialog
        className="arcana-info-dialog"
        ref={dialogRef}
        aria-labelledby="arcana-notice-title"
        onClick={(event) => { if (event.target === event.currentTarget) dialogRef.current?.close(); }}
      >
        <div>
          <button
            type="button"
            className="arcana-header-link arcana-notice-close"
            aria-label="Đóng"
            onClick={() => dialogRef.current?.close()}
          >
            <X />
          </button>
          <h2 id="arcana-notice-title" className="font-editorial text-[#edc38a]">Sự Kiện & Quà Tặng</h2>
          <p className="mt-2 text-sm text-[#c9bfb2] leading-relaxed">
            Hiện tại chưa có sự kiện giveaway nào đang diễn ra. Hãy tiếp tục khám phá các tạo tác Arcana để nhận thông báo sớm nhất!
          </p>
        </div>
      </dialog>
    </motion.header>
  );
}
