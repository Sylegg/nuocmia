"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { AuthCard } from "./AuthCard";
import { EASE_OUT_EXPO } from "@/motion/motionConfig";

export function AuthModal() {
  const isAccountOpen = useMarketplaceStore((s) => s.isAccountOpen);
  const setAccountOpen = useMarketplaceStore((s) => s.setAccountOpen);

  useEffect(() => {
    if (!isAccountOpen) return;

    // Khóa hoàn toàn cuộn trang nền ngoài: cố định vị trí cuộn hiện tại của body
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const scrollbarGap = Math.max(0, window.innerWidth - html.clientWidth);

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    // Chặn hoàn toàn sự kiện cuộn/lăn chuột ra trang nền ngoài
    const preventOuterScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      const modalContent = document.getElementById("auth-modal-dialog");
      if (modalContent && modalContent.contains(target)) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", preventOuterScroll, { passive: false });
    window.addEventListener("touchmove", preventOuterScroll, { passive: false });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      body.style.paddingRight = prevBodyPaddingRight;
      window.scrollTo(0, scrollY);
      window.removeEventListener("wheel", preventOuterScroll);
      window.removeEventListener("touchmove", preventOuterScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountOpen, setAccountOpen]);

  return (
    <AnimatePresence>
      {isAccountOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 overflow-y-auto overscroll-contain"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop - ngăn hoàn toàn sự kiện cuộn xuống trang ngoài */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setAccountOpen(false)}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 bg-[#050910]/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            id="auth-modal-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="relative z-10 my-auto w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setAccountOpen(false)}
              className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#7b5b3a]/70 bg-[#0c1822] text-[#aaaab6] shadow-xl hover:border-[#edc38a] hover:text-[#f3eee5] active:scale-95 transition-all cursor-pointer"
              aria-label="Đóng bảng đăng nhập"
            >
              <X className="h-4 w-4" />
            </button>

            <AuthCard isModal onSuccess={() => setAccountOpen(false)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
