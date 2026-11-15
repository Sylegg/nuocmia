"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { backdropVariants, drawerSlideVariants } from "@/motion/animationVariants";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  widthClass = "max-w-md",
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;

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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          <motion.aside
            variants={drawerSlideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 flex h-full w-full ${widthClass} flex-col border-l border-[#282e3a] bg-[#101520]/95 text-[#f3eee5] shadow-2xl backdrop-blur-2xl`}
          >
            <div className="flex items-start justify-between border-b border-[#242a36] px-6 py-5">
              <div>
                <h2 className="font-editorial text-2xl font-bold tracking-tight text-[#f3eee5]">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-0.5 text-xs text-[#aaaab6]">{subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={`Đóng ${title}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#363643] bg-white/5 text-[#aaaab6] transition-colors hover:border-[#7b5b3a] hover:text-[#e4bc83] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="border-t border-[#242a36] bg-[#0b0f18]/90 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
