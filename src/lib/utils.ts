import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Match --product-card-radius in globals.css for layout animations.
export const PRODUCT_CARD_RADIUS = 6;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteScale() {
  return Number.parseFloat(getComputedStyle(document.body).zoom) || 1;
}

export function formatPrice(amount?: number): string {
  if (amount === undefined || Number.isNaN(amount)) return "Liên hệ";
  return `${new Intl.NumberFormat("vi-VN").format(amount)} ₫`;
}
