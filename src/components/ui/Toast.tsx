"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { EASE_OUT_EXPO } from "@/motion/motionConfig";

export function ToastBanner() {
  const toast = useMarketplaceStore((s) => s.toast);
  const dismissToast = useMarketplaceStore((s) => s.dismissToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dismissToast(), 3800);
    return () => clearTimeout(timer);
  }, [toast, dismissToast]);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex max-w-sm justify-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[#7b5b3a]/70 bg-[#101520]/95 px-4 py-3 shadow-xl shadow-black/60 backdrop-blur-md"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e4bc83]/20 text-[#edc38a]">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#f3eee5]">
                {toast.title}
              </p>
              {toast.subtitle && (
                <p className="truncate text-xs text-[#aaaab6]">{toast.subtitle}</p>
              )}
            </div>
            {toast.actionLabel && (
              <a
                href={toast.actionType === "open-cart" ? "/gio-hang" : "/yeu-thich"}
                onClick={() => dismissToast()}
                className="shrink-0 rounded-full bg-gradient-to-r from-[#edc592] to-[#cea063] px-3 py-1 text-xs font-bold text-[#241709] transition-transform hover:scale-105"
              >
                {toast.actionLabel}
              </a>
            )}
            <button
              type="button"
              onClick={dismissToast}
              aria-label="Đóng thông báo"
              className="rounded-full p-1 text-[#aaaab6] transition-colors hover:text-[#f3eee5] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
