import { offersBySku, products } from "@/data/arcana";
import type { Condition, Edition, Product, ProductFace } from "@/data/arcana";

export type CartLine = { sku: string; quantity: number };
export type OrderLine = CartLine & {
  productId: string;
  name: string;
  art: string;
  edition: Edition;
  condition: Condition;
  price: number;
  face?: ProductFace;
};
export type Buyer = {
  name: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  note: string;
};
export type Shipping = "standard" | "express";
export type Payment = "cod" | "demo";
export type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled";
export type Promo = "" | "CARD10";
export type CheckoutMode = "gio-hang" | "mua-ngay";

export const shippingLabels = { standard: "Giao tiêu chuẩn", express: "Giao nhanh" };
export const paymentLabels = { cod: "COD · Thanh toán khi nhận hàng", demo: "Thanh toán mô phỏng" };
export const statusLabels = {
  pending: "Chờ xác nhận", shipping: "Đang giao", delivered: "Đã giao", cancelled: "Đã hủy",
};
export const sampleBuyer: Buyer = {
  name: "Nguyễn Minh An",
  phone: "0900000123",
  email: "minhan@example.com",
  city: "TP. Hồ Chí Minh",
  address: "12 Đường Sao Bắc, Phường Demo",
  note: "Gọi trước khi giao.",
};
export const blankBuyer: Buyer = { name: "", phone: "", email: "", city: "", address: "", note: "" };

const currency = new Intl.NumberFormat("vi-VN");
const day = new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" });
export const money = (amount: number) => `${currency.format(amount)} ₫`;
export const orderDate = (iso: string) => day.format(new Date(iso));

export function calculateTotals(
  lines: Pick<OrderLine, "quantity" | "price">[],
  promo: Promo,
  shipping: Shipping,
) {
  const subtotal = lines.reduce((total, line) => total + line.price * line.quantity, 0);
  const discount = promo === "CARD10" ? Math.min(Math.round(subtotal / 10), 50000) : 0;
  const freight = shipping === "express" ? 50000 : subtotal - discount >= 500000 ? 0 : 30000;
  return { subtotal, discount, freight, total: subtotal - discount + freight };
}

export function snapshotLines(lines: CartLine[]): OrderLine[] {
  return lines.map((line) => {
    const entry = offersBySku.get(line.sku);
    if (!entry) throw new ShopError("Một phiên bản trong đơn không còn được bán.");
    const { product, offer } = entry;
    const { offers: _offers, ...face } = product;
    return {
      ...line, productId: product.id, name: product.name, art: product.art,
      edition: offer.edition, condition: offer.condition, price: offer.price, face,
    };
  });
}

export function normalizePhone(raw: string) {
  const compact = raw.replace(/[\s.()-]/g, "");
  return compact.startsWith("+84") ? `0${compact.slice(3)}` : compact;
}

export function validPhone(raw: string) {
  return /^0\d{9}$/.test(normalizePhone(raw));
}

export function validateBuyer(buyer: Buyer) {
  const errors: Partial<Record<keyof Buyer, string>> = {};
  if (buyer.name.trim().length < 2) errors.name = "Nhập họ tên người nhận.";
  if (!validPhone(buyer.phone)) errors.phone = "Nhập số điện thoại 10 chữ số hoặc định dạng +84.";
  if (buyer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) {
    errors.email = "Nhập email theo định dạng tên@vídụ.com.";
  }
  if (buyer.city.trim().length < 2) errors.city = "Nhập tỉnh hoặc thành phố.";
  if (buyer.address.trim().length < 5) errors.address = "Nhập số nhà, tên đường và phường/xã.";
  return errors;
}

export type Order = {
  code: string;
  requestId: string;
  createdAt: string;
  status: OrderStatus;
  account: boolean;
  buyer: Buyer;
  lines: OrderLine[];
  promo: Promo;
  shipping: Shipping;
  payment: Payment;
  totals: ReturnType<typeof calculateTotals>;
};
export type ShopState = {
  inventory: Record<string, number>;
  cart: CartLine[];
  favorites: string[];
  promo: Promo;
  orders: Order[];
};

function sampleOrder(index: number, status: OrderStatus, sku: string, createdAt: string): Order {
  const lines = snapshotLines([{ sku, quantity: 1 }]);
  return {
    code: `ARC-DEMO0${index}`, requestId: `sample-${index}`, createdAt, status, account: true,
    buyer: sampleBuyer, lines, promo: "", shipping: "standard", payment: "cod",
    totals: calculateTotals(lines, "", "standard"),
  };
}

export const initialShop: ShopState = {
  inventory: Object.fromEntries([...offersBySku].map(([sku, { offer }]) => [sku, offer.stock])),
  cart: [],
  favorites: [],
  promo: "",
  orders: [
    sampleOrder(2, "shipping", "CL-003-ST", "2026-11-10T09:00:00+07:00"),
    sampleOrder(1, "delivered", "HT-016-ST", "2026-11-03T09:00:00+07:00"),
  ],
};

const STORE_KEY = "arcana.shop.v1";
const STORE_EVENT = "arcana:store";
const ACCOUNT_KEY = "arcana.demo-account";

export class ShopError extends Error {}

export function errorMessage(error: unknown) {
  return error instanceof ShopError ? error.message : "Không thể lưu dữ liệu demo. Kiểm tra quyền lưu trữ của trình duyệt rồi thử lại.";
}

export function readShop(): ShopState {
  const raw = localStorage.getItem(STORE_KEY);
  return raw === null ? initialShop : JSON.parse(raw);
}

export function subscribeShop(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORE_KEY || event.key === null) onChange();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORE_EVENT, onChange);
  };
}

export function readAccount() {
  return sessionStorage.getItem(ACCOUNT_KEY) === "true";
}

export function writeAccount(active: boolean) {
  if (active) sessionStorage.setItem(ACCOUNT_KEY, "true");
  else sessionStorage.removeItem(ACCOUNT_KEY);
}

let lockDatabase: Promise<IDBDatabase> | undefined;

function openLockDatabase() {
  lockDatabase ??= new Promise((resolve, reject) => {
    const request = indexedDB.open("arcana-shop-lock", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("transactions");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return lockDatabase;
}

// A read/write transaction serializes tabs on local-network HTTP, where Web Locks is unavailable.
async function withStoreLock<T>(update: () => T): Promise<T> {
  if (navigator.locks) return navigator.locks.request(STORE_KEY, update);
  const db = await openLockDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("transactions", "readwrite");
    const request = transaction.objectStore("transactions").get(STORE_KEY);
    let result: T;
    request.onsuccess = () => {
      try {
        result = update();
      } catch (error) {
        transaction.abort();
        reject(error);
      }
    };
    transaction.oncomplete = () => resolve(result);
    transaction.onabort = () => reject(transaction.error);
  });
}

function mutate<T>(operation: (current: ShopState) => [ShopState, T]): Promise<T> {
  return withStoreLock(() => {
    const raw = localStorage.getItem(STORE_KEY);
    const current: ShopState = raw === null ? initialShop : JSON.parse(raw);
    const [next, result] = operation(current);
    if (raw === null || next !== current) {
      localStorage.setItem(STORE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(STORE_EVENT));
    }
    return result;
  });
}

export const initializeShop = () => mutate((state) => [state, state]);

export function stockOf(state: ShopState, sku: string) {
  // An existing browser may not have inventory entries for newly added SKUs.
  return state.inventory[sku] ?? initialShop.inventory[sku] ?? 0;
}

export function availableOffers(item: Product, state: ShopState) {
  const available = item.offers.filter((offer) => stockOf(state, offer.sku) > 0);
  return available.length ? available : item.offers;
}

export function stockError(lines: CartLine[], state: ShopState) {
  if (lines.length === 0) return "Chưa có sản phẩm để đặt hàng.";
  const quantities = new Map<string, number>();
  for (const line of lines) {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) return "Số lượng phải là số nguyên từ 1.";
    quantities.set(line.sku, (quantities.get(line.sku) ?? 0) + line.quantity);
  }
  for (const [sku, quantity] of quantities) {
    const entry = offersBySku.get(sku);
    if (!entry) return "Một phiên bản trong đơn không còn được bán.";
    const stock = stockOf(state, sku);
    if (quantity > stock) {
      const label = `${entry.product.name} – ${entry.offer.edition} (${entry.offer.condition})`;
      return stock === 0 ? `${label} đã hết hàng.` : `${label} chỉ còn ${stock} sản phẩm.`;
    }
  }
  return "";
}

export function addToCart(line: CartLine) {
  return mutate((state) => {
    if (!Number.isSafeInteger(line.quantity) || line.quantity < 1) throw new ShopError("Nhập số lượng từ 1.");
    const current = state.cart.find(({ sku }) => sku === line.sku);
    const next = { ...line, quantity: line.quantity + (current?.quantity ?? 0) };
    const error = stockError([next], state);
    if (error) throw new ShopError(error);
    const cart = current ? state.cart.map((row) => row.sku === line.sku ? next : row) : [...state.cart, line];
    return [{ ...state, cart }, undefined];
  });
}

export function changeCartQuantity(sku: string, change: -1 | 1) {
  return mutate((state) => {
    const line = state.cart.find((row) => row.sku === sku);
    if (!line || line.quantity + change < 1) return [state, undefined];
    const next = { ...line, quantity: line.quantity + change };
    const error = change > 0 ? stockError([next], state) : "";
    if (error) throw new ShopError(error);
    const cart = state.cart.map((row) => row.sku === sku ? next : row);
    return [{ ...state, cart }, undefined];
  });
}

export function removeCartLine(sku: string) {
  return mutate((state) => {
    const cart = state.cart.filter((row) => row.sku !== sku);
    return [{ ...state, cart, promo: cart.length ? state.promo : "" }, undefined];
  });
}

export function applyPromo(raw: string) {
  return mutate((state) => {
    const promo = raw.trim().toUpperCase();
    if (promo !== "" && promo !== "CARD10") throw new ShopError("Mã ưu đãi không hợp lệ. Bạn có thể thử CARD10.");
    return [{ ...state, promo }, undefined];
  });
}

export function toggleFavorite(id: string) {
  return mutate((state) => {
    const saved = !state.favorites.includes(id);
    const favorites = saved ? [...state.favorites, id] : state.favorites.filter((item) => item !== id);
    return [{ ...state, favorites }, saved];
  });
}

export function checkoutId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

type PlaceOrderInput = {
  requestId: string;
  mode: CheckoutMode;
  lines: CartLine[];
  promo: Promo;
  shipping: Shipping;
  payment: Payment;
  simulateFailure: boolean;
  buyer: Buyer;
  account: boolean;
};

export function placeOrder(input: PlaceOrderInput) {
  return mutate((state) => {
    const previous = state.orders.find((order) => order.requestId === input.requestId);
    if (previous) return [state, previous];

    if (Object.keys(validateBuyer(input.buyer)).length) throw new ShopError("Kiểm tra thông tin người nhận.");
    if (input.mode === "gio-hang" && (
      JSON.stringify(state.cart) !== JSON.stringify(input.lines) || state.promo !== input.promo
    )) {
      throw new ShopError("Giỏ hàng vừa thay đổi. Vui lòng kiểm tra lại đơn trước khi xác nhận.");
    }
    const error = stockError(input.lines, state);
    if (error) throw new ShopError(error);
    if (input.payment === "demo" && input.simulateFailure) {
      throw new ShopError("Thanh toán mô phỏng thất bại. Chọn kết quả Thành công hoặc đổi sang COD rồi thử lại.");
    }

    const lines = snapshotLines(input.lines);
    let code = `ARC-${checkoutId().slice(0, 10).toUpperCase()}`;
    while (state.orders.some((order) => order.code === code)) {
      code = `ARC-${checkoutId().slice(0, 10).toUpperCase()}`;
    }
    const buyer = {
      ...input.buyer,
      name: input.buyer.name.trim(),
      phone: normalizePhone(input.buyer.phone),
      email: input.buyer.email.trim(),
      city: input.buyer.city.trim(),
      address: input.buyer.address.trim(),
      note: input.buyer.note.trim(),
    };
    const order: Order = {
      code, requestId: input.requestId, createdAt: new Date().toISOString(), status: "pending",
      account: input.account, buyer, lines, promo: input.promo, shipping: input.shipping, payment: input.payment,
      totals: calculateTotals(lines, input.promo, input.shipping),
    };
    const inventory = { ...state.inventory };
    for (const { sku, quantity } of lines) inventory[sku] = (inventory[sku] ?? stockOf(state, sku)) - quantity;
    return [{
      ...state, inventory, orders: [order, ...state.orders],
      cart: input.mode === "gio-hang" ? [] : state.cart,
      promo: input.mode === "gio-hang" ? "" : state.promo,
    }, order];
  });
}

export function findOrder(state: ShopState, code: string, phone: string) {
  return state.orders.find((order) => order.code === code.trim().toUpperCase() && order.buyer.phone === normalizePhone(phone));
}

export function cancelOrder(code: string, phone: string) {
  return mutate((state) => {
    const order = findOrder(state, code, phone);
    if (!order) throw new ShopError("Không tìm thấy đơn hàng.");
    if (order.status === "cancelled") return [state, order];
    if (order.status !== "pending") throw new ShopError("Chỉ có thể hủy đơn đang chờ xác nhận.");
    const cancelled: Order = { ...order, status: "cancelled" };
    const inventory = { ...state.inventory };
    for (const { sku, quantity } of order.lines) inventory[sku] = (inventory[sku] ?? stockOf(state, sku)) + quantity;
    const orders = state.orders.map((row) => row.code === order.code ? cancelled : row);
    return [{ ...state, inventory, orders }, cancelled];
  });
}

export function relatedProducts(item: Product) {
  return products.filter((candidate) => candidate.id !== item.id)
    .sort((a, b) => relevance(b, item) - relevance(a, item)).slice(0, 4);
}

function relevance(candidate: Product, item: Product) {
  return Number(candidate.collection === item.collection) * 2 + Number(candidate.category === item.category);
}
