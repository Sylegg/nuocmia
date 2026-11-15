"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { categories, collections, elements } from "@/data/arcana";
import { categoryLabel } from "@/data/shop-categories";
import type { Product } from "@/data/arcana";
import { addToCart, errorMessage, money, relatedProducts, stockOf } from "@/lib/arcana-shop";
import type { CartLine, ShopState } from "@/lib/arcana-shop";
import { Breadcrumbs } from "./ShopChrome";
import { CardFace, Dialog, Icon, ProductTile, RarityTag, StockLabel } from "./ShopUI";

export function ProductView({ item, initialSku, state, ready, catalog, onFavorite, onBuyNow, onAdded }: {
  item: Product; initialSku: string | null; state: ShopState; ready: boolean; catalog: string;
  onFavorite: (id: string) => void; onBuyNow: (line: CartLine) => void; onAdded: () => void;
}) {
  const [sku, setSku] = useState(() => (item.offers.find((offer) => offer.sku === initialSku) ?? item.offers[0]).sku);
  const [quantity, setQuantity] = useState("1");
  const [side, setSide] = useState<"front" | "back">("front");
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const offer = item.offers.find((option) => option.sku === sku)!;
  const stock = stockOf(state, sku);
  const editions = [...new Set(item.offers.map((option) => option.edition))];
  const conditions = item.offers.filter((option) => option.edition === offer.edition);
  const amount = Number(quantity);
  const validQuantity = Number.isSafeInteger(amount) && amount >= 1 && amount <= stock;
  const saved = state.favorites.includes(item.id);
  const inCart = state.cart.find((line) => line.sku === sku)?.quantity ?? 0;
  const element = elements[item.element];

  function selectOffer(next: string) {
    setSku(next);
    setQuantity("1");
    setError("");
    setSide("front");
  }

  async function add() {
    if (!validQuantity || adding) return;
    setAdding(true);
    setError("");
    try {
      await addToCart({ sku, quantity: amount });
      onAdded();
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="shop-width inner-page product-page" style={{ "--element": element.color } as CSSProperties}>
      <Breadcrumbs items={[{ label: "Danh mục", href: catalog }, { label: item.name }]} />
      <a className="back-link" href={catalog}><Icon name="back" size={17} /> Quay lại danh mục</a>
      <div className="product-layout">
        <header className="product-intro">
          {!item.shopCategory && <div className="product-tags">
            <RarityTag item={item} />
            <span className="element-tag"><Icon name={element.icon} size={15} /> Hệ {element.name}</span>
          </div>}
          <h1 id="product-name">{item.name}</h1>
          <p className="product-subtitle">{item.shopCategory ? categoryLabel(item.shopCategory, true) : categories[item.category].name} <span>·</span> Bộ {collections[item.collection].name} <span>·</span> {item.code}</p>
          <div className="product-price">
            <strong>{money(offer.price)}</strong><StockLabel quantity={stock} />
          </div>
        </header>
        <section className="product-gallery" aria-label="Ảnh sản phẩm">
          <div className="gallery-stage">
            <button className="gallery-art" type="button" aria-label={`Phóng to ảnh ${side === "front" ? "mặt trước" : "mặt sau"}`} onClick={() => setZoom(true)}>
              <CardFace item={item} edition={offer.edition} side={side} eager />
            </button>
            <button className="icon-button zoom-trigger" type="button" aria-label="Phóng to ảnh" onClick={() => setZoom(true)}><Icon name="expand" /></button>
          </div>
          <div className="gallery-controls" role="group" aria-label="Chọn mặt sản phẩm">
            {(["front", "back"] as const).map((face) => (
              <button className={`gallery-choice ${side === face ? "selected" : ""}`} key={face} type="button"
                onClick={() => setSide(face)} aria-pressed={side === face}>
                <div className="gallery-mini"><CardFace item={item} edition={offer.edition} side={face} /></div>
                <span>{face === "front" ? "Mặt trước" : "Mặt sau"}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="product-details" aria-label="Lựa chọn mua hàng">
          <p className="product-description">{item.description}</p>
          <p className="sku-label">SKU <code>{offer.sku}</code></p>
          <fieldset className="edition-group">
            <legend>Phiên bản</legend>
            <div className="edition-options">
              {editions.map((edition) => {
                const options = item.offers.filter((option) => option.edition === edition);
                const inStock = options.find((option) => stockOf(state, option.sku) > 0);
                const sameCondition = options.find((option) => option.condition === offer.condition);
                const next = sameCondition && stockOf(state, sameCondition.sku) > 0 ? sameCondition : inStock ?? sameCondition ?? options[0];
                return <label className={`edition-option ${edition === offer.edition ? "selected" : ""}`} key={edition}>
                  <input type="radio" name="edition" value={edition} checked={edition === offer.edition} onChange={() => selectOffer(next.sku)} />
                  <span>{edition === "Foil" && <Icon name="sparkles" size={14} />}{edition}</span>
                  {!inStock && <small>Hết hàng</small>}
                </label>;
              })}
            </div>
          </fieldset>
          <div className="variant-fields">
            <div className="field"><label htmlFor="product-condition">Tình trạng</label>
              <select id="product-condition" value={sku} onChange={(event) => selectOffer(event.target.value)}>
                {conditions.map((option) => <option value={option.sku} key={option.sku}>{option.condition}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="product-quantity">Số lượng</label>
              <div className="stepper">
                <button type="button" aria-label="Giảm số lượng" disabled={amount <= 1 || !stock}
                  onClick={() => { setQuantity(String(Math.max(1, Math.min(stock, amount - 1)))); setError(""); }}><Icon name="minus" size={16} /></button>
                <input id="product-quantity" inputMode="numeric" type="text" maxLength={3} value={quantity} disabled={!stock}
                  aria-invalid={!!stock && !validQuantity} onChange={(event) => { setQuantity(event.target.value.replace(/\D/g, "")); setError(""); }} />
                <button type="button" aria-label="Tăng số lượng" disabled={amount >= stock}
                  onClick={() => { setQuantity(String(amount + 1)); setError(""); }}><Icon name="plus" size={16} /></button>
              </div>
            </div>
          </div>
          {stock > 0 && !validQuantity && <p className="inline-error" role="alert">Chọn số lượng từ 1 đến {stock}.</p>}
          {error && <p className="inline-error" role="alert">{error}</p>}
          {inCart > 0 && <p className="in-cart-note">Đã có {inCart} sản phẩm của SKU này trong giỏ.</p>}
          <div className="buy-actions">
            <button className="button button-primary" type="button" disabled={!ready || !validQuantity || adding} onClick={add}>
              <Icon name="bag" size={19} /> Thêm vào giỏ
            </button>
            <button className="button button-secondary" type="button" disabled={!ready || !validQuantity || adding}
              onClick={() => onBuyNow({ sku, quantity: amount })}>Mua ngay <Icon name="arrow" size={17} /></button>
          </div>
          <button className={`favorite-action text-link ${saved ? "is-favorite" : ""}`} type="button" aria-pressed={saved}
            onClick={() => onFavorite(item.id)}><Icon name="heart" size={18} filled={saved} /> {saved ? "Bỏ lưu yêu thích" : "Lưu yêu thích"}</button>
        </section>
      </div>
      <section className="shop-panel card-specs" aria-labelledby="specs-title">
        <h2 id="specs-title">{item.category === "phu-kien" ? "Thông tin sản phẩm" : "Thông tin thẻ"}</h2>
        {item.category === "nhan-vat" ? (
          <>
            <div className="spec-line"><span>{item.hp} HP</span><span><Icon name={element.icon} size={16} /> Hệ {element.name}</span></div>
            <div className="skill-grid">{item.skills.map((skill) => (
              <div className="skill-block" key={skill.name}>
                <div><Icon name="sparkles" size={17} /><h3>{skill.name}</h3>{skill.damage && <b>{skill.damage}</b>}</div>
                <p>{skill.description}</p>
              </div>
            ))}</div>
          </>
        ) : item.category === "phu-kien" ? (
          <dl className="spec-table">
            <div><dt>Chất liệu</dt><dd>{item.material}</dd></div>
            <div><dt>Kích thước</dt><dd>{item.size}</dd></div>
            <div><dt>Số món trong gói</dt><dd>{item.pack}</dd></div>
          </dl>
        ) : (
          <dl className="spec-table"><div><dt>Chi phí sử dụng</dt><dd>{item.cost} năng lượng</dd></div><div><dt>Hiệu ứng</dt><dd>{item.effect}</dd></div></dl>
        )}
      </section>
      <section className="home-section related-section" aria-labelledby="related-title">
        <div className="section-heading"><h2 id="related-title">Sản phẩm liên quan</h2></div>
        <div className="product-grid">
          {relatedProducts(item).map((product) => <ProductTile key={product.id} item={product} state={state} onFavorite={onFavorite} />)}
        </div>
      </section>
      {zoom && <Dialog className="zoom-dialog" label={`Ảnh ${item.name}`} onDismiss={() => setZoom(false)}>
        {(close) => <div className="zoom-content">
          <div><span>{side === "front" ? "Mặt trước" : "Mặt sau"} · {offer.edition}</span>
            <button autoFocus className="icon-button" type="button" onClick={close} aria-label="Đóng ảnh"><Icon name="close" /></button></div>
          <div className="zoom-card"><CardFace item={item} edition={offer.edition} side={side} eager /></div>
        </div>}
      </Dialog>}
    </div>
  );
}
