"use client";

import { useSyncExternalStore } from "react";
import type { CartLine, CheckoutMode } from "./arcana-shop";

const ROUTE_EVENT = "arcana:route";

function readHash() {
  if (typeof window === "undefined") return "#/";
  if (window.location.hash) return window.location.hash;
  const p = window.location.pathname;
  if (p === "/gio-hang") return "#/gio-hang";
  if (p === "/danh-muc") return "#/danh-muc";
  if (p === "/yeu-thich") return "#/yeu-thich";
  if (p === "/tra-cuu") return "#/tra-cuu";
  if (p === "/thanh-toan") return "#/thanh-toan";
  return "#/";
}

const serverHash = () => "#/";

function subscribeRoute(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  window.addEventListener(ROUTE_EVENT, callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
    window.removeEventListener(ROUTE_EVENT, callback);
  };
}

export function useShopRoute(defaultView?: string) {
  const hash = useSyncExternalStore(subscribeRoute, readHash, serverHash);
  const [path, query = ""] = hash.slice(1).split("?");
  const [rawView = "", id = "", extra = ""] = path.split("/").filter(Boolean);
  const view = rawView || defaultView || "";
  return { hash, path, view, id, extra, params: new URLSearchParams(query) };
}

export function navigate(href: string, replace = false) {
  if (readHash() === href) return;
  if (replace) window.history.replaceState(null, "", href);
  else window.history.pushState(null, "", href);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function productHref(id: string, sku?: string) {
  return `#/the/${id}${sku ? `?sku=${encodeURIComponent(sku)}` : ""}`;
}

export function checkoutHref(mode: CheckoutMode, requestId: string, line?: CartLine) {
  const params = line ? new URLSearchParams({ sku: line.sku, sl: String(line.quantity) }) : null;
  return `#/thanh-toan/${mode}/${requestId}${params ? `?${params}` : ""}`;
}

export const successHref = (code: string) => `#/thanh-cong/${code}`;
export const trackingHref = (code?: string) => `#/tra-cuu${code ? `?ma=${encodeURIComponent(code)}` : ""}`;
export const catalogHref = (query?: string) => `#/danh-muc${query ? `?${query}` : ""}`;
export const cartHref = () => `#/gio-hang`;
export const favoritesHref = () => `#/yeu-thich`;
