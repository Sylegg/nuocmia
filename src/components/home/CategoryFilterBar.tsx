"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  SHOP_CATEGORIES,
  type MainCategoryId,
  type StandeeVariantId,
  type SubCategoryId,
} from "@/data/categories";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/motion/motionConfig";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";

const INDICATOR_TRANSITION = {
  duration: 0.3,
  ease: EASE_OUT_EXPO,
};

const SUBROW_TRANSITION = {
  duration: 0.24,
  ease: EASE_OUT_EXPO,
};

export function CategoryFilterBar({
  align = "center",
  scopeId = "hero",
}: {
  align?: "center" | "left";
  scopeId?: string;
} = {}) {
  const filters = useMarketplaceStore((s) => s.filters);
  const selectMainCategory = useMarketplaceStore((s) => s.selectMainCategory);
  const selectSubcategory = useMarketplaceStore((s) => s.selectSubcategory);
  const selectStandeeVariant = useMarketplaceStore(
    (s) => s.selectStandeeVariant
  );

  const mainTabs: { id: MainCategoryId | "all"; name: string }[] = [
    { id: "all", name: "Tất cả" },
    ...SHOP_CATEGORIES.map((c) => ({
      id: c.id as MainCategoryId,
      name: c.name,
    })),
  ];

  const activeMainNode = SHOP_CATEGORIES.find(
    (c) => c.id === filters.category
  );
  const subcategories = activeMainNode?.children ?? [];

  const activeSubNode = subcategories.find(
    (sub) => sub.id === filters.subcategory
  );
  const standeeVariants = activeSubNode?.children ?? [];

  return (
    <div
      data-carousel-control="true"
      className={cn(
        "relative z-20 flex flex-col gap-2.5",
        align === "center"
          ? "mx-auto mt-6 max-w-3xl items-center px-4"
          : "items-start"
      )}
    >
      {/* Main Category Bar */}
      <div
        role="tablist"
        aria-label="Danh mục sản phẩm chính"
        className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#282e3a] bg-[#101520]/90 p-1.5 shadow-xl backdrop-blur-md"
      >
        {mainTabs.map((tab) => {
          const active = filters.category === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectMainCategory(tab.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 sm:px-5 sm:text-[13px] cursor-pointer",
                active
                  ? "text-[#241709] font-bold"
                  : "text-[#aaaab6] hover:text-[#f3eee5]"
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${scopeId}-category-main-indicator`}
                  transition={INDICATOR_TRANSITION}
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#edc592] to-[#cea063] shadow-md shadow-amber-950/50"
                />
              )}
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Subcategory Bar (Đồ giấy / Đồ nhựa) */}
      <AnimatePresence mode="wait">
        {subcategories.length > 0 && (
          <motion.div
            key={`sub-${filters.category}`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={SUBROW_TRANSITION}
            role="tablist"
            aria-label="Danh mục con"
            className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-[#282e3a] bg-[#0d111a]/90 p-1 shadow-md backdrop-blur-sm"
          >
            {[
              {
                id: "all" as const,
                name:
                  filters.category === "paper"
                    ? "Tất cả đồ giấy"
                    : "Tất cả đồ nhựa",
              },
              ...subcategories.map((sub) => ({
                id: sub.id as SubCategoryId,
                name: sub.name,
              })),
            ].map((sub) => {
              const active = filters.subcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectSubcategory(sub.id)}
                  className={cn(
                    "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer",
                    active
                      ? "text-[#edc38a] font-semibold"
                      : "text-[#8a8a9a] hover:text-[#f3eee5]"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId={`${scopeId}-category-sub-indicator`}
                      transition={INDICATOR_TRANSITION}
                      className="absolute inset-0 -z-10 rounded-full border border-[#7b5b3a]/70 bg-[#e4bc83]/15 shadow-sm"
                    />
                  )}
                  {sub.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standee Size Variant Bar (Lớn / Nhỏ) */}
      <AnimatePresence mode="wait">
        {filters.category === "plastic" &&
          filters.subcategory === "standee" &&
          standeeVariants.length > 0 && (
            <motion.div
              key="standee-variants"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={SUBROW_TRANSITION}
              role="tablist"
              aria-label="Phân loại Standee"
              className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-emerald-900/60 bg-[#0c1814]/90 p-1 backdrop-blur-sm"
            >
              {[
                { id: "all" as const, name: "Tất cả Standee" },
                ...standeeVariants.map((v) => ({
                  id: v.id as StandeeVariantId,
                  name: v.name,
                })),
              ].map((variant) => {
                const active = filters.variant === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectStandeeVariant(variant.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1 text-xs font-medium transition-colors duration-200 cursor-pointer",
                      active
                        ? "text-emerald-300 font-semibold"
                        : "text-[#7ca592] hover:text-emerald-200"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId={`${scopeId}-category-variant-indicator`}
                        transition={INDICATOR_TRANSITION}
                        className="absolute inset-0 -z-10 rounded-full border border-emerald-600/50 bg-emerald-950/80 shadow-2xs"
                      />
                    )}
                    {variant.name}
                  </button>
                );
              })}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
