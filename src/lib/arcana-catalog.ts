import { categories, collections, elements, products, rarities } from "@/data/arcana";
import type { Product } from "@/data/arcana";
import { categoryLabel, categoryPaths, inShopCategory } from "@/data/shop-categories";
import { stockOf } from "./arcana-shop";
import type { ShopState } from "./arcana-shop";

export type Filters = {
  favorites: string;
  q: string;
  category: string;
  type: string;
  element: string;
  rarity: string;
  collection: string;
  min: string;
  max: string;
  stock: string;
  sort: string;
};

export const emptyFilters: Filters = {
  favorites: "",
  q: "", category: "", type: "", element: "", rarity: "", collection: "", min: "", max: "", stock: "", sort: "",
};

const filterNames = Object.keys(emptyFilters) as (keyof Filters)[];

export function readFilters(params: URLSearchParams): Filters {
  const category = params.get("category") ?? "";
  return {
    favorites: params.get("favorites") === "1" ? "1" : "",
    q: (params.get("q") ?? "").slice(0, 100),
    category: categoryPaths.has(category) ? category : matchingKey(category, categories),
    type: matchingKey(params.get("type"), categories),
    element: matchingKey(params.get("element"), elements),
    rarity: matchingKey(params.get("rarity"), rarities),
    collection: matchingKey(params.get("collection"), collections),
    min: numberParam(params.get("min")),
    max: numberParam(params.get("max")),
    stock: params.get("stock") === "1" ? "1" : "",
    sort: matchingKey(params.get("sort"), { asc: true, desc: true }),
  };
}

function matchingKey(key: string | null, options: object) {
  return key && Object.hasOwn(options, key) ? key : "";
}

function numberParam(value: string | null) {
  return value && /^\d{1,9}$/.test(value) ? value : "";
}

export function catalogHref(filters: Partial<Filters> = {}) {
  const params = new URLSearchParams();
  for (const key of filterNames) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  return `#/danh-muc${params.size ? `?${params}` : ""}`;
}

export function foldText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").trim();
}

export type CatalogItem = { product: Product; price: number; sku: string; from: boolean };

export function catalogItems(filters: Filters, state: ShopState): CatalogItem[] {
  const terms = foldText(filters.q).split(/\s+/).filter(Boolean);
  const min = filters.min === "" ? 0 : Number(filters.min);
  const max = filters.max === "" ? Infinity : Number(filters.max);

  const matches = products.flatMap((item) => {
    if (filters.favorites === "1" && !state.favorites.includes(item.id)) return [];
    const shopCategory = item.shopCategory ?? (item.category === "phu-kien" ? "khac" : "postcard");
    const matchesCategory = categoryPaths.has(filters.category)
      ? inShopCategory(shopCategory, filters.category)
      : item.category === filters.category;
    if ((filters.category && !matchesCategory)
      || (filters.type && item.category !== filters.type)
      || (filters.element && item.element !== filters.element)
      || (filters.rarity && item.rarity !== filters.rarity)
      || (filters.collection && item.collection !== filters.collection)) return [];

    const text = foldText([item.name, item.code, collections[item.collection].name, categoryLabel(shopCategory, true),
      ...item.offers.map((offer) => offer.sku)].join(" "));
    if (!terms.every((term) => text.includes(term))) return [];

    const eligible = item.offers.filter((offer) => offer.price >= min && offer.price <= max);
    const available = eligible.filter((offer) => stockOf(state, offer.sku) > 0);
    const choices = available.length || filters.stock ? available : eligible;
    const sorted = [...choices].sort((a, b) => a.price - b.price);
    if (!sorted.length) return [];
    return [{
      product: item, price: sorted[0].price, sku: sorted[0].sku,
      from: sorted.some((offer) => offer.price !== sorted[0].price),
    }];
  });

  if (filters.sort === "asc") return matches.sort((a, b) => a.price - b.price);
  if (filters.sort === "desc") return matches.sort((a, b) => b.price - a.price);
  return matches;
}
