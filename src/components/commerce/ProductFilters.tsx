"use client";

import { ChevronDown, Heart, Search } from "lucide-react";
import type { ReactNode } from "react";
import { categoryPaths, shopGroups, type ShopCategory } from "@/data/shop-categories";

const categoryGroups: readonly ShopCategory[] = shopGroups;

export function ProductFilters({ category, favorites, query, resultSummary, actions,
  onCategory, onFavorites, onQuery }: {
  category: string;
  favorites: boolean;
  query: string;
  resultSummary: ReactNode;
  actions?: ReactNode;
  onCategory: (category: string) => void;
  onFavorites: () => void;
  onQuery: (query: string) => void;
}) {
  const path = categoryPaths.get(category) ?? [];
  const group = shopGroups.find(({ id }) => id === path[0]?.id);

  function choice(id: string, name: string, selected: boolean) {
    return <button key={id} type="button" className="product-filter-choice"
      aria-pressed={selected} onClick={() => onCategory(id)}>{name}</button>;
  }

  return (
    <div className="product-filters" aria-label="Bộ lọc sản phẩm" role="group">
      <div className="product-filter-heading">
        <div className="product-filter-row product-filter-tabs">
          {choice("", "Tất cả", !category)}
          {shopGroups.map(({ id, name }) => choice(id, name, id === group?.id))}
          <button type="button" className="product-filter-choice product-filter-favorite"
            aria-pressed={favorites} onClick={onFavorites}>
            Đã yêu thích <Heart size={15} fill={favorites ? "currentColor" : "none"} aria-hidden="true" />
          </button>
        </div>
        <p className="product-filter-results" aria-live="polite">{resultSummary}</p>
      </div>
      <div className="product-filter-controls">
        <label className="product-filter-search">
          <Search size={17} aria-hidden="true" />
          <input type="search" aria-label="Tìm trong danh sách sản phẩm" placeholder="Tìm sản phẩm…"
            maxLength={100} value={query} onChange={(event) => onQuery(event.target.value)} />
        </label>
        <div className="product-filter-options">
          <label className="product-filter-select">
            <select aria-label="Lọc theo danh mục" value={categoryPaths.has(category) ? category : ""}
              onChange={(event) => onCategory(event.target.value)}>
              <option value="">Mọi danh mục</option>
              {categoryGroups.map(({ id, name, children }) => children?.length ? (
                <optgroup key={id} label={name}>
                  <option value={id}>Tất cả {name.toLowerCase()}</option>
                  {children.flatMap((item) => [
                    <option key={item.id} value={item.id}>{item.name}</option>,
                    ...(item.children ?? []).map((child) => (
                      <option key={child.id} value={child.id} aria-label={`${item.name} ${child.name}`}>
                        {`\u00a0\u00a0\u00a0↳ ${child.name}`}
                      </option>
                    )),
                  ])}
                </optgroup>
              ) : (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </label>
        </div>
      </div>
      {actions && <div className="product-filter-actions">{actions}</div>}
    </div>
  );
}
