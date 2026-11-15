"use client";

import { useEffect, useRef } from "react";
import { ArcanaLogo } from "@/components/layout/ArcanaLogo";
import type { CSSProperties, ReactNode } from "react";
import { categories, collections, elements, rarities } from "@/data/arcana";
import { categoryLabel } from "@/data/shop-categories";
import type { Edition, Product, ProductFace } from "@/data/arcana";
import { availableOffers, money, stockOf } from "@/lib/arcana-shop";
import type { ShopState } from "@/lib/arcana-shop";
import { productHref } from "@/lib/arcana-route";
import type { CatalogItem } from "@/lib/arcana-catalog";

const icons = {
  search: "M21 21l-4.4-4.4M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  grid: "M3.5 3.5h6.25v6.25H3.5zm10.75 0h6.25v6.25h-6.25zM3.5 14.25h6.25v6.25H3.5zm10.75 0h6.25v6.25h-6.25z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z",
  bag: "M5 7h14l1 14H4L5 7Zm4 2V6a3 3 0 0 1 6 0v3",
  package: "M12 3 3 7.5v9l9 4.5 9-4.5v-9L12 3Zm-9 4.5 9 4.5 9-4.5M12 12v9m4.5-11.25-9-4.5",
  arrow: "M4 12h15m-6-6 6 6-6 6",
  back: "M20 12H5m6 6-6-6 6-6",
  chevron: "m9 6 6 6-6 6",
  down: "m6 9 6 6 6-6",
  swords: "m3 3 4.5 1 12 12-3.5 3.5-12-12L3 3Zm10 7 3.5-3.5L21 3l-1 4.5-3.5 3.5M8.5 15.5l-4 4m-1-2 3 3m10-1.5 2.5 2.5m-1.5-6 3 3",
  bolt: "m13 2-9 12h7l-1 8 10-12h-7l1-8Z",
  shield: "M12 22s7-3.5 7-11V5l-7-3-7 3v6c0 7.5 7 11 7 11Zm-3-10 2 2 4-4",
  box: "M3 7.5 6 3h12l3 4.5V21H3V7.5Zm0 0h18m-12 4h6",
  flame: "M12 22c4 0 7-3.1 7-7.2 0-4.2-3.5-7.5-6.6-10.8.1 3-1 4.9-3 6.2C9 8.8 8.3 8 7.6 7.4 6.2 9.5 5 12.1 5 14.8 5 19 8 22 12 22Zm0 0c-1.8 0-3.1-1.3-3.1-3 0-1.6 1.1-3 3.1-5 2 2 3.1 3.4 3.1 5 0 1.7-1.3 3-3.1 3Z",
  snow: "M12 2v20M3.34 7l17.32 10M3.34 17 20.66 7M9 4l3 3 3-3m-6 16 3-3 3 3M3.7 10.6l4.1-1.1L6.7 5.4m10.6 13.2-1.1-4.1 4.1-1.1m-13.6 5.2 1.1-4.1-4.1-1.1m16.6-2.8-4.1-1.1 1.1-4.1",
  leaf: "M20 4C11 4 5 7 5 13a6 6 0 0 0 6 6c6 0 9-6 9-15ZM4 21l10-10",
  moon: "M20.5 14a8.7 8.7 0 0 1-10.5-10.5A8.8 8.8 0 1 0 20.5 14Z",
  sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19m0-14-1.4 1.4M6.4 17.6 5 19m12-7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
  diamond: "m12 2 8 10-8 10-8-10 8-10Z",
  sparkles: "M12 2c0 6 4 10 10 10-6 0-10 4-10 10 0-6-4-10-10-10 6 0 10-4 10-10Z",
  close: "m6 6 12 12M18 6 6 18",
  filter: "M4 6h16M4 12h16M4 18h16M8 4v4m8 2v4m-6 2v4",
  check: "m5 12 4 4L19 6",
  minus: "M5 12h14",
  plus: "M5 12h14m-7-7v14",
  expand: "M9 4H4v5m11-5h5v5m0 6v5h-5M4 15v5h5",
  truck: "M2 5h13v13H2V5Zm13 5h4l3 4v4h-7m-5 1a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  copy: "M8 8h12v12H8V8Zm8-3V4H4v12h1",
  card: "M3 5h18v14H3V5Zm0 5h18m-14 5h4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-14a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  info: "M12 11v6m0-10h.01m9.99 5a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  trash: "M3 6h18M5 6l1 14h12l1-14M9 6V3h6v3m-5 4v6m4-6v6",
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, size = 20, filled = false }: { name: IconName; size?: number; filled?: boolean }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.65"
      strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name]} />
    </svg>
  );
}

export function ArcanaMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 48 48" fill="none">
      <path d="M24 2.5 45.5 24 24 45.5 2.5 24 24 2.5Z" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="24" cy="24" r="13.1" stroke="currentColor" strokeWidth=".7" opacity=".6" />
      <path d="m24 8 3.3 12.7L40 24l-12.7 3.3L24 40l-3.3-12.7L8 24l12.7-3.3L24 8Z" fill="currentColor" />
      <path d="m24 15 1.8 7.2L33 24l-7.2 1.8L24 33l-1.8-7.2L15 24l7.2-1.8L24 15Z" fill="#0d111b" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function Brand() {
  return (
    <a className="arcana-brand" href="/" aria-label="Arcana Card Shop · Trang chủ">
      <ArcanaLogo className="brand-mark" />
      <span><strong>ARCANA</strong><small>CARD SHOP</small></span>
    </a>
  );
}

export function CardFace({ item, edition = "Standard", side = "front", eager = false }: {
  item: ProductFace; edition?: Edition; side?: "front" | "back"; eager?: boolean;
}) {
  const element = elements[item.element];
  const isBack = side === "back";
  if (item.shopCategory) return (
    <div aria-hidden="true" className="merch-art" data-format={item.shopCategory}>
      <div className={`merch-print ${isBack ? "merch-print-back" : ""}`}>
        {isBack ? <ArcanaMark /> :
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={item.art} alt="" loading={eager ? "eager" : "lazy"} draggable={false} width={311} height={311} />}
      </div>
    </div>
  );
  return (
    <div aria-hidden="true" className={`card-face ${isBack ? "card-back" : ""} ${edition === "Foil" ? "card-foil" : ""}`}
      style={{ "--element": element.color } as CSSProperties}>
      {isBack ? (
        <div className="card-back-frame">
          <div className="back-orbit back-orbit-large" />
          <div className="back-orbit back-orbit-small" />
          <div className="back-center">
            <ArcanaMark />
            <strong>ARCANA</strong>
            <span>{collections[item.collection].name}</span>
          </div>
          <span className="back-star back-star-top">✦</span>
          <span className="back-star back-star-bottom">✦</span>
        </div>
      ) : (
        <div className="card-face-frame">
          <div className="face-header">
            <span>{categories[item.category].name}</span>
            <span className="face-element"><Icon name={element.icon} size={13} /></span>
          </div>
          <div className="face-art">
            {/* Local WebP artwork is already sized for the illustrated window. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.art} alt="" draggable={false} loading={eager ? "eager" : "lazy"} width={311} height={311} />
          </div>
          <div className="face-body">
            <div className="face-name">
              <strong>{item.name}</strong>
              {item.category === "nhan-vat" && <span>{item.hp} HP</span>}
              {"cost" in item && <span>{item.cost} NL</span>}
            </div>
            <div className="face-rules">
              {item.category === "nhan-vat" ? item.skills.map((skill) => (
                <div className="face-skill" key={skill.name}><span>✦</span><b>{skill.name}</b><em>{skill.damage ?? "✧"}</em></div>
              )) : item.category === "phu-kien" ? (
                <><div>{item.material}</div><div>{item.pack}</div></>
              ) : <div>{item.effect}</div>}
            </div>
          </div>
          <div className="face-footer">
            <span>{item.code} · {collections[item.collection].name}</span>
            <span>{edition === "Foil" ? "✦ FOIL" : "✧"}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function RarityTag({ item }: { item: Product }) {
  const rarity = rarities[item.rarity];
  return <span className="rarity-tag" style={{ "--rarity": rarity.color } as CSSProperties}><Icon name="diamond" size={12} />{rarity.name}</span>;
}

export function StockLabel({ quantity }: { quantity: number }) {
  return <span className={`stock-label ${quantity ? "" : "stock-empty"}`}><i />{quantity ? `Còn ${quantity} sản phẩm` : "Hết hàng"}</span>;
}

export function ProductTile({ item, state, selection, onFavorite }: {
  item: Product; state: ShopState; selection?: CatalogItem; onFavorite: (id: string) => void;
}) {
  const options = availableOffers(item, state);
  const cheapest = options.reduce((a, b) => a.price <= b.price ? a : b);
  const price = selection?.price ?? cheapest.price;
  const from = selection?.from ?? options.some((offer) => offer.price !== price);
  const sku = selection?.sku;
  const edition = item.offers.find((offer) => offer.sku === sku)?.edition ?? item.offers[0].edition;
  const soldOut = !item.offers.some((offer) => stockOf(state, offer.sku) > 0);
  const saved = state.favorites.includes(item.id);
  const element = elements[item.element];

  return (
    <article className="product-tile" style={{ "--element": element.color } as CSSProperties}>
      <a className="tile-link" href={productHref(item.id, sku)} aria-label={`Xem ${item.name}`}>
        <div className="tile-media">
          {item.shopCategory ? <span className="rarity-tag merch-tag">{categoryLabel(item.shopCategory)}</span> : <RarityTag item={item} />}
          <div className="tile-card"><CardFace item={item} edition={edition} /></div>
        </div>
        <div className="tile-info">
          <div className="tile-meta"><span>{collections[item.collection].name}</span>{!item.shopCategory &&
            <span><Icon name={element.icon} size={14} /> {element.name}</span>}</div>
          <h3>{item.name}</h3>
          <div className="tile-price">
            <span>{from && <small>Từ </small>}{money(price)}</span>
            {soldOut ? <span className="tile-sold-out">Hết hàng</span> : <Icon name="arrow" size={17} />}
          </div>
        </div>
      </a>
      <button type="button" className={`tile-favorite icon-button ${saved ? "is-favorite" : ""}`}
        aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${item.name}`} aria-pressed={saved} onClick={() => onFavorite(item.id)}>
        <Icon name="heart" size={17} filled={saved} />
      </button>
    </article>
  );
}

export function EmptyState({ icon, title, children, action }: { icon: IconName; title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={26} /></span>
      <h2>{title}</h2>
      <p>{children}</p>
      {action}
    </section>
  );
}

export function Dialog({ className, label, onDismiss, children }: {
  className?: string; label: string; onDismiss: () => void; children: (close: () => void) => ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (ref.current && !ref.current.open) ref.current.showModal();
  }, []);
  function close() {
    ref.current?.close();
    onDismiss();
  }
  return (
    <dialog ref={ref} className={`shop-dialog ${className ?? ""}`} aria-label={label}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      {children(close)}
    </dialog>
  );
}
