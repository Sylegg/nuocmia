"use client";

import { ProductFilters } from "@/components/commerce/ProductFilters";
import { productsById } from "@/data/arcana";

import { catalogHref, catalogItems, emptyFilters } from "@/lib/arcana-catalog";
import type { Filters } from "@/lib/arcana-catalog";

import type { ShopState } from "@/lib/arcana-shop";
import { Breadcrumbs } from "./ShopChrome";
import { EmptyState, Icon, ProductTile } from "./ShopUI";

export function CatalogView({ filters, state, onFilter, onFavorite }: {
  filters: Filters; state: ShopState; onFilter: (filters: Filters) => void; onFavorite: (id: string) => void;
}) {
  const matches = catalogItems(filters, state);
  const clear = () => onFilter(emptyFilters);

  return (
    <div className="shop-width inner-page catalog-page">
      <Breadcrumbs items={[{ label: "Danh mục" }]} />
      <div className="page-heading"><h1>Danh mục sản phẩm</h1></div>
      <ProductFilters category={filters.category} favorites={filters.favorites === "1"} query={filters.q}
        resultSummary={<><strong>{matches.length}</strong> kết quả{filters.q && <> cho “{filters.q}”</>}</>}
        actions={Object.values(filters).some(Boolean) && <button type="button" className="text-link" onClick={clear}>Xóa bộ lọc</button>}
        onQuery={(q) => onFilter({ ...filters, q })}
        onCategory={(category) => onFilter({ ...emptyFilters, q: filters.q, category, favorites: filters.favorites,
          min: filters.min, max: filters.max, sort: filters.sort })}
        onFavorites={() => onFilter({ ...filters, favorites: filters.favorites === "1" ? "" : "1" })} />
      <section className="catalog-results mt-4" aria-label="Kết quả danh mục">
          {matches.length ? (
            <div className="product-grid catalog-grid">
              {matches.map((selection) => <ProductTile key={selection.product.id} item={selection.product} state={state}
                selection={selection} onFavorite={onFavorite} />)}
            </div>
          ) : (
            <EmptyState icon="search" title="Không tìm thấy sản phẩm"
              action={<button type="button" className="button button-primary" onClick={clear}>Xóa bộ lọc</button>}>
              Thử đổi từ khóa hoặc bỏ bớt bộ lọc.
            </EmptyState>
          )}
      </section>
    </div>
  );
}

export function FavoritesView({ state, onFavorite }: { state: ShopState; onFavorite: (id: string) => void }) {
  const saved = state.favorites.flatMap((id) => {
    const item = productsById.get(id);
    return item ? [item] : [];
  });
  return (
    <div className="shop-width inner-page">
      <Breadcrumbs items={[{ label: "Yêu thích" }]} />
      <div className="page-heading"><h1>Yêu thích</h1><p>{saved.length} sản phẩm đã lưu</p></div>
      {saved.length ? <div className="product-grid">
        {saved.map((item) => <ProductTile key={item.id} item={item} state={state} onFavorite={onFavorite} />)}
      </div> : <EmptyState icon="heart" title="Chưa có thẻ yêu thích"
        action={<a className="button button-primary" href={catalogHref()}>Khám phá thẻ <Icon name="arrow" size={17} /></a>}>
        Chạm vào biểu tượng trái tim trên thẻ để lưu vào danh sách.
      </EmptyState>}
    </div>
  );
}
