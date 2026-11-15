"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { catalogHref } from "@/lib/arcana-catalog";
import { productHref } from "@/lib/arcana-route";
import {
  applyPromo, calculateTotals, changeCartQuantity, errorMessage, money, removeCartLine,
  snapshotLines, stockError, stockOf,
} from "@/lib/arcana-shop";
import type { ShopState } from "@/lib/arcana-shop";
import { Breadcrumbs } from "./ShopChrome";
import { EmptyState, Icon } from "./ShopUI";
import { LineImage, Totals } from "./OrderUI";

export function CartView({ state, ready, onCheckout }: { state: ShopState; ready: boolean; onCheckout: () => void }) {
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [error, setError] = useState("");
  const lines = snapshotLines(state.cart);
  const units = lines.reduce((count, line) => count + line.quantity, 0);
  const totals = calculateTotals(lines, state.promo, "standard");
  const stockIssue = stockError(state.cart, state);

  async function change(operation: () => Promise<void>) {
    setError("");
    try {
      await operation();
    } catch (error) {
      setError(errorMessage(error));
    }
  }

  async function promo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPromoError("");
    if (!promoInput.trim()) {
      setPromoError("Nhập mã ưu đãi để áp dụng.");
      return;
    }
    try {
      await applyPromo(promoInput);
      setPromoInput("");
    } catch (error) {
      setPromoError(errorMessage(error));
    }
  }

  return (
    <div className="shop-width inner-page cart-page">
      <Breadcrumbs items={[{ label: "Giỏ hàng" }]} />
      <div className="page-heading"><h1>Giỏ hàng</h1><p>{units} sản phẩm trong giỏ</p></div>
      {lines.length ? <div className="cart-layout">
        <section className="shop-panel cart-panel" aria-label="Sản phẩm trong giỏ">
          <div className="cart-columns"><span>Sản phẩm</span><span>Số lượng</span><span>Thành tiền</span></div>
          <ul className="cart-list">
            {lines.map((line) => {
              const stock = stockOf(state, line.sku);
              return <li className="cart-line" key={line.sku}>
                <div className="cart-product">
                  <a className="cart-image-link" href={productHref(line.productId, line.sku)} aria-label={`Xem ${line.name}`}><LineImage line={line} /></a>
                  <div><a href={productHref(line.productId, line.sku)}><strong>{line.name}</strong></a>
                    <span>{line.edition} · {line.condition}</span><small>{money(line.price)} / sản phẩm</small>
                    {line.quantity > stock && <small className="inline-error">{stock ? `Còn ${stock} sản phẩm` : "Hết hàng"}</small>}
                  </div>
                </div>
                <div className="stepper cart-stepper">
                  <button type="button" aria-label={`Giảm số lượng ${line.name} – ${line.edition} (${line.condition})`}
                    disabled={line.quantity <= 1} onClick={() => void change(() => changeCartQuantity(line.sku, -1))}><Icon name="minus" size={15} /></button>
                  <output aria-label={`Số lượng ${line.name} – ${line.edition} (${line.condition})`}>{line.quantity}</output>
                  <button type="button" aria-label={`Tăng số lượng ${line.name} – ${line.edition} (${line.condition})`}
                    disabled={line.quantity >= stock} onClick={() => void change(() => changeCartQuantity(line.sku, 1))}><Icon name="plus" size={15} /></button>
                </div>
                <strong className="cart-line-total">{money(line.price * line.quantity)}</strong>
                <button className="icon-button cart-remove" type="button" aria-label={`Xóa ${line.name} – ${line.edition} (${line.condition})`}
                  onClick={() => void change(() => removeCartLine(line.sku))}><Icon name="trash" size={17} /></button>
              </li>;
            })}
          </ul>
          {error && <p className="inline-error" role="alert">{error}</p>}
          <a className="text-link continue-link" href={catalogHref()}><Icon name="back" size={17} /> Tiếp tục mua sắm</a>
        </section>
        <aside className="shop-panel summary-panel" aria-label="Tổng giỏ hàng">
          <h2>Tổng giỏ hàng</h2>
          <form className="promo-form" onSubmit={promo}>
            <label htmlFor="promo-code">Mã ưu đãi</label>
            <div className="promo-input">
              <input id="promo-code" placeholder="Nhập mã" value={promoInput} maxLength={30}
                aria-invalid={!!promoError} onChange={(event) => { setPromoInput(event.target.value); setPromoError(""); }} />
              <button className="button button-secondary" type="submit">Áp dụng</button>
            </div>
            {promoError && <p className="inline-error" role="alert">{promoError}</p>}
            {state.promo ? <div className="promo-applied">
              <span><Icon name="check" size={15} /> Đã áp dụng {state.promo}</span>
              <button className="text-link" type="button" onClick={() => void change(() => applyPromo(""))}>Bỏ mã</button>
            </div> : <small>Thử CARD10 để giảm 10%, tối đa 50.000 ₫.</small>}
          </form>
          <Totals totals={totals} promo={state.promo} estimate />
          {stockIssue && <p className="inline-error" role="alert">{stockIssue} Điều chỉnh giỏ để tiếp tục.</p>}
          <button className="button button-primary full-width" type="button" disabled={!ready || !!stockIssue} onClick={onCheckout}>
            Tiến hành thanh toán <Icon name="arrow" size={18} />
          </button>
        </aside>
      </div> : <EmptyState icon="bag" title="Giỏ hàng của bạn đang trống"
        action={<a className="button button-primary" href={catalogHref()}>Quay lại danh mục <Icon name="arrow" size={17} /></a>}>
        Khám phá bộ sưu tập Arcana và thêm thẻ bạn thích vào giỏ.
      </EmptyState>}
    </div>
  );
}
