"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { COLLECTIBLE_CARDS } from "@/data/cards";
import {
  type MainCategoryId,
  type StandeeVariantId,
  type SubCategoryId,
  getProductCategoryTrail,
} from "@/data/categories";

export type TransitionPhase =
  | "idle"
  | "rotating"
  | "opening"
  | "detail"
  | "closing";
export type SortOrder = "default" | "price-asc" | "price-desc";

export interface RectSnapshot {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: number;
}

export interface CartItem {
  key: string; // productId
  cardId: string;
  quantity: number;
  unitPrice: number;
}

export interface DemoOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  shippingMethod: "Express Insured" | "Archival Priority";
  items: {
    cardId: string;
    name: string;
    categoryLabel: string;
    quantity: number;
    unitPrice: number;
    thumbnailImage: string;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: "Confirmed (Demo)";
}

export interface CatalogFilters {
  category: MainCategoryId | "all";
  subcategory: SubCategoryId | "all";
  variant: StandeeVariantId | "all";
  searchQuery: string;
  sortOrder: SortOrder;
}

export interface ToastMessage {
  id: number;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionType?: "open-cart" | "open-wishlist";
}

interface MarketplaceState {
  // Carousel & detail shared-element transition state
  activeIndex: number;
  detailCardId: string | null;
  detailSource: "carousel" | "catalog";
  transitionPhase: TransitionPhase;
  originRect: RectSnapshot | null;

  // Persistent commerce state
  cartItems: CartItem[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  demoOrders: DemoOrder[];
  promoCode: string | null;

  // Discovery filters (shared by Carousel and Catalog)
  filters: CatalogFilters;

  // UI overlays
  isSearchOpen: boolean;
  isWishlistOpen: boolean;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isAccountOpen: boolean;
  cartPulseTick: number;
  toast: ToastMessage | null;

  // Actions — Category Selection
  selectMainCategory: (category: MainCategoryId | "all") => void;
  selectSubcategory: (subcategory: SubCategoryId | "all") => void;
  selectStandeeVariant: (variant: StandeeVariantId | "all") => void;
  resetFilters: () => void;
  updateFilters: (patch: Partial<CatalogFilters>) => void;

  // Actions — Carousel & Detail
  setActiveIndex: (index: number) => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  openCardDetail: (
    cardId: string,
    source: "carousel" | "catalog",
    originRect: RectSnapshot | null,
    carouselIndex?: number
  ) => void;
  switchDetailCard: (cardId: string, carouselIndex?: number) => void;
  beginCloseDetail: () => void;
  finishCloseDetail: () => void;

  // Actions — Cart & Wishlist
  addToCart: (cardId: string, quantity?: number) => boolean;
  updateCartQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  clearPromoCode: () => void;
  toggleWishlist: (cardId: string) => void;
  placeDemoOrder: (payload: {
    customerName: string;
    email: string;
    shippingAddress: string;
    shippingMethod: "Express Insured" | "Archival Priority";
  }) => DemoOrder;

  // Actions — Overlays
  setSearchOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setAccountOpen: (open: boolean) => void;
  showToast: (toast: Omit<ToastMessage, "id">) => void;
  dismissToast: () => void;
}

const DEFAULT_FILTERS: CatalogFilters = {
  category: "all",
  subcategory: "all",
  variant: "all",
  searchQuery: "",
  sortOrder: "default",
};

const SEED_DEMO_ORDERS: DemoOrder[] = [
  {
    orderNumber: "CV-849210",
    createdAt: "Nov 04, 2026",
    customerName: "Alex Mercer",
    email: "alex.collector@cardverse.demo",
    shippingAddress: "418 Meridian Ave, Suite 4B, San Francisco, CA 94107",
    shippingMethod: "Archival Priority",
    items: [
      {
        cardId: "standee-hoa-an-lon",
        name: "Standee Hỏa Ấn Lớn",
        categoryLabel: "Đồ nhựa › Standee › Lớn",
        quantity: 1,
        unitPrice: 129000,
        thumbnailImage: "/cards/hoa-an.webp",
      },
    ],
    subtotal: 129000,
    discount: 0,
    shippingFee: 0,
    total: 129000,
    status: "Confirmed (Demo)",
  },
];

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      activeIndex: 0,
      detailCardId: null,
      detailSource: "carousel",
      transitionPhase: "idle",
      originRect: null,

      cartItems: [],
      wishlistIds: ["pola-bang-nguyet", "standee-hoa-an-lon"],
      recentlyViewedIds: ["pola-bang-nguyet", "standee-hoa-an-lon"],
      demoOrders: SEED_DEMO_ORDERS,
      promoCode: null,

      filters: DEFAULT_FILTERS,

      isSearchOpen: false,
      isWishlistOpen: false,
      isCartOpen: false,
      isCheckoutOpen: false,
      isAccountOpen: false,
      cartPulseTick: 0,
      toast: null,

      selectMainCategory: (category) =>
        set((state) => ({
          activeIndex: 0,
          filters: {
            ...state.filters,
            category,
            subcategory: "all",
            variant: "all",
          },
        })),

      selectSubcategory: (subcategory) =>
        set((state) => ({
          activeIndex: 0,
          filters: {
            ...state.filters,
            subcategory,
            variant: "all",
          },
        })),

      selectStandeeVariant: (variant) =>
        set((state) => ({
          activeIndex: 0,
          filters: {
            ...state.filters,
            variant,
          },
        })),

      updateFilters: (patch) =>
        set((state) => ({
          filters: { ...state.filters, ...patch },
        })),

      resetFilters: () => set({ activeIndex: 0, filters: DEFAULT_FILTERS }),

      setActiveIndex: (index) => set({ activeIndex: index }),

      setTransitionPhase: (phase) => set({ transitionPhase: phase }),

      openCardDetail: (cardId, source, originRect, carouselIndex) => {
        const state = get();
        if (
          state.transitionPhase === "opening" ||
          state.transitionPhase === "closing"
        ) {
          return;
        }
        const recentlyViewed = [
          cardId,
          ...state.recentlyViewedIds.filter((id) => id !== cardId),
        ].slice(0, 8);

        set({
          detailCardId: cardId,
          detailSource: source,
          originRect,
          transitionPhase: "opening",
          recentlyViewedIds: recentlyViewed,
          ...(carouselIndex !== undefined && carouselIndex >= 0
            ? { activeIndex: carouselIndex }
            : {}),
        });
      },

      switchDetailCard: (cardId, carouselIndex) => {
        const state = get();
        const recentlyViewed = [
          cardId,
          ...state.recentlyViewedIds.filter((id) => id !== cardId),
        ].slice(0, 8);
        set({
          detailCardId: cardId,
          recentlyViewedIds: recentlyViewed,
          ...(carouselIndex !== undefined && carouselIndex >= 0
            ? { activeIndex: carouselIndex }
            : {}),
        });
      },

      beginCloseDetail: () => {
        const state = get();
        if (!state.detailCardId || state.transitionPhase === "closing") return;
        set({ transitionPhase: "closing" });
      },

      finishCloseDetail: () => {
        set({
          detailCardId: null,
          originRect: null,
          transitionPhase: "idle",
        });
      },

      addToCart: (cardId, quantity = 1) => {
        const product = COLLECTIBLE_CARDS.find((c) => c.id === cardId);
        if (!product || product.stock <= 0 || product.price === undefined) {
          return false;
        }

        const key = cardId;
        const unitPrice = product.price;
        const state = get();
        const existing = state.cartItems.find((item) => item.key === key);

        const currentQty = existing?.quantity ?? 0;
        const availableRemaining = Math.max(0, product.stock - currentQty);
        if (availableRemaining <= 0) {
          get().showToast({
            title: "Đã đạt giới hạn tồn kho",
            subtitle: `Sản phẩm ${product.name} chỉ còn ${product.stock} chiếc.`,
            actionLabel: "Xem giỏ",
            actionType: "open-cart",
          });
          return false;
        }

        const qtyToAdd = Math.min(quantity, availableRemaining);
        const nextCart = existing
          ? state.cartItems.map((item) =>
              item.key === key
                ? { ...item, quantity: item.quantity + qtyToAdd }
                : item
            )
          : [...state.cartItems, { key, cardId, quantity: qtyToAdd, unitPrice }];

        set({
          cartItems: nextCart,
          cartPulseTick: state.cartPulseTick + 1,
        });

        get().showToast({
          title: `Đã thêm ${product.name}`,
          subtitle: `${getProductCategoryTrail(product).join(" › ")} · SL ${qtyToAdd}`,
          actionLabel: "Mở giỏ",
          actionType: "open-cart",
        });
        return true;
      },

      updateCartQuantity: (key, quantity) => {
        const state = get();
        const target = state.cartItems.find((i) => i.key === key);
        if (!target) return;

        if (quantity <= 0) {
          set({ cartItems: state.cartItems.filter((i) => i.key !== key) });
          return;
        }

        const product = COLLECTIBLE_CARDS.find((c) => c.id === target.cardId);
        const maxStock = product?.stock ?? 99;
        const clamped = Math.min(quantity, maxStock);

        set({
          cartItems: state.cartItems.map((item) =>
            item.key === key ? { ...item, quantity: clamped } : item
          ),
        });
      },

      removeFromCart: (key) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.key !== key),
        })),

      clearCart: () => set({ cartItems: [], promoCode: null }),

      applyPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === "LEGEND10" || normalized === "CARDVERSE10") {
          set({ promoCode: normalized });
          return {
            ok: true,
            message: `Áp dụng mã ${normalized} — giảm 10%!`,
          };
        }
        return { ok: false, message: "Mã không hợp lệ. Thử LEGEND10." };
      },

      clearPromoCode: () => set({ promoCode: null }),

      toggleWishlist: (cardId) => {
        const state = get();
        const product = COLLECTIBLE_CARDS.find((c) => c.id === cardId);
        const exists = state.wishlistIds.includes(cardId);
        const nextWishlist = exists
          ? state.wishlistIds.filter((id) => id !== cardId)
          : [cardId, ...state.wishlistIds];

        set({ wishlistIds: nextWishlist });

        if (product) {
          get().showToast({
            title: exists
              ? `Đã bỏ lưu ${product.name}`
              : `Đã lưu ${product.name}`,
            actionLabel: "Đã lưu",
            actionType: "open-wishlist",
          });
        }
      },

      placeDemoOrder: ({
        customerName,
        email,
        shippingAddress,
        shippingMethod,
      }) => {
        const state = get();
        const items = state.cartItems
          .map((ci) => {
            const product = COLLECTIBLE_CARDS.find((c) => c.id === ci.cardId);
            if (!product) return null;
            return {
              cardId: product.id,
              name: product.name,
              categoryLabel: getProductCategoryTrail(product).join(" › "),
              quantity: ci.quantity,
              unitPrice: ci.unitPrice,
              thumbnailImage: product.image,
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null);

        const subtotal = items.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0
        );
        const discount = state.promoCode ? Math.round(subtotal * 0.1) : 0;
        const shippingFee =
          shippingMethod === "Express Insured"
            ? 35000
            : subtotal >= 300000
              ? 0
              : 20000;
        const total = Math.max(0, subtotal - discount + shippingFee);

        const order: DemoOrder = {
          orderNumber: `CV-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          customerName,
          email,
          shippingAddress,
          shippingMethod,
          items,
          subtotal,
          discount,
          shippingFee,
          total,
          status: "Confirmed (Demo)",
        };

        set({
          demoOrders: [order, ...state.demoOrders],
          cartItems: [],
          promoCode: null,
        });

        return order;
      },

      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      setCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setAccountOpen: (open) => set({ isAccountOpen: open }),

      showToast: (toast) =>
        set({
          toast: { ...toast, id: Date.now() },
        }),

      dismissToast: () => set({ toast: null }),
    }),
    {
      name: "cardverse-goods-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistIds: state.wishlistIds,
        recentlyViewedIds: state.recentlyViewedIds,
        demoOrders: state.demoOrders,
        promoCode: state.promoCode,
      }),
    }
  )
);
