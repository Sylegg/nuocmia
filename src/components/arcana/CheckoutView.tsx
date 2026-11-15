"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { catalogHref } from "@/lib/arcana-catalog";
import { navigate, successHref } from "@/lib/arcana-route";
import {
  blankBuyer, calculateTotals, errorMessage, money, placeOrder, sampleBuyer,
  snapshotLines, stockError, validateBuyer,
} from "@/lib/arcana-shop";
import type { Buyer, CartLine, CheckoutMode, Payment, Shipping, ShopState } from "@/lib/arcana-shop";
import { Breadcrumbs } from "./ShopChrome";
import { EmptyState, Icon } from "./ShopUI";
import { OrderLines, Totals } from "./OrderUI";

const buyerFields = [
  { name: "name", label: "Họ và tên", type: "text", autoComplete: "name", placeholder: "Nguyễn Minh An", length: 100 },
  { name: "phone", label: "Số điện thoại", type: "tel", autoComplete: "tel", placeholder: "0900000123", length: 25 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "minhan@example.com", length: 120, optional: true },
  { name: "city", label: "Tỉnh / thành phố", type: "text", autoComplete: "address-level1", placeholder: "TP. Hồ Chí Minh", length: 80 },
  { name: "address", label: "Địa chỉ", type: "text", autoComplete: "street-address", placeholder: "Số nhà, tên đường, phường/xã", length: 240, wide: true },
] as const;

export function CheckoutView({ state, ready, mode, requestId, instant, account }: {
  state: ShopState; ready: boolean; mode: CheckoutMode; requestId: string; instant: CartLine | null; account: boolean;
}) {
  const [buyer, setBuyer] = useState<Buyer>(blankBuyer);
  const [errors, setErrors] = useState<ReturnType<typeof validateBuyer>>({});
  const [shipping, setShipping] = useState<Shipping>("standard");
  const [payment, setPayment] = useState<Payment>("cod");
  const [simulation, setSimulation] = useState("success");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);
  const fromCart = mode === "gio-hang";
  const cart = fromCart ? state.cart : instant ? [instant] : [];
  const lines = snapshotLines(cart);
  const promo = fromCart ? state.promo : "";
  const totals = calculateTotals(lines, promo, shipping);
  const standardFee = calculateTotals(lines, promo, "standard").freight;
  const stockIssue = stockError(cart, state);

  function update(field: keyof Buyer, value: string) {
    setBuyer((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !ready || stockIssue) return;
    setError("");
    const validation = validateBuyer(buyer);
    setErrors(validation);
    const first = Object.keys(validation)[0];
    if (first) {
      document.getElementById(`buyer-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setPending(true);
    try {
      const order = await placeOrder({
        requestId, mode, lines: cart, promo, shipping, payment, simulateFailure: simulation === "failure", buyer, account,
      });
      navigate(successHref(order.code), true);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <div className="shop-width inner-page checkout-page">
      <Breadcrumbs items={[...(fromCart ? [{ label: "Giỏ hàng", href: "#/gio-hang" }] : []), { label: "Thanh toán" }]} />
      <div className="page-heading"><h1>Thanh toán</h1><p>{account ? "Đơn sẽ xuất hiện trong lịch sử tài khoản demo." : "Đặt hàng với tư cách khách."}</p></div>
      {lines.length ? <form className="checkout-layout" noValidate onSubmit={submit}>
        <div className="checkout-fields">
          <section className="shop-panel checkout-panel" aria-labelledby="recipient-heading">
            <div className="panel-heading"><Icon name="user" size={19} /><h2 id="recipient-heading">Thông tin người nhận</h2></div>
            <div className="demo-hint">
              <Icon name="info" size={17} />
              <p>Dùng tên, số điện thoại và địa chỉ giả lập để thử đặt hàng.</p>
              <button className="text-link" type="button" onClick={() => { setBuyer(sampleBuyer); setErrors({}); }}>Điền thông tin mẫu</button>
            </div>
            <div className="buyer-grid">
              {buyerFields.map((field) => <label className={`field ${"wide" in field ? "field-wide" : ""}`} key={field.name}>
                <span>{field.label} {"optional" in field ? <small>(tùy chọn)</small> : <b>*</b>}</span>
                <input id={`buyer-${field.name}`} type={field.type} autoComplete={field.autoComplete} value={buyer[field.name]}
                  maxLength={field.length} placeholder={field.placeholder} required={!("optional" in field)}
                  aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined}
                  onChange={(event) => update(field.name, event.target.value)} />
                {errors[field.name] && <small className="inline-error" id={`error-${field.name}`}>{errors[field.name]}</small>}
              </label>)}
              <label className="field field-wide">
                <span>Ghi chú <small>(tùy chọn)</small></span>
                <textarea id="buyer-note" rows={2} maxLength={500} placeholder="Ví dụ gọi trước khi giao" value={buyer.note} onChange={(event) => update("note", event.target.value)} />
              </label>
            </div>
          </section>
          <fieldset className="shop-panel checkout-panel choice-panel">
            <legend><span className="panel-heading"><Icon name="truck" size={19} /> Phương thức giao hàng</span></legend>
            <label className={`radio-card ${shipping === "standard" ? "selected" : ""}`}>
              <input type="radio" name="shipping" value="standard" checked={shipping === "standard"} onChange={() => setShipping("standard")} />
              <span><strong>Giao tiêu chuẩn</strong><small>Miễn phí từ 500.000 ₫ tiền hàng sau ưu đãi</small></span>
              <b>{standardFee ? money(standardFee) : "Miễn phí"}</b>
            </label>
            <label className={`radio-card ${shipping === "express" ? "selected" : ""}`}>
              <input type="radio" name="shipping" value="express" checked={shipping === "express"} onChange={() => setShipping("express")} />
              <span><strong>Giao nhanh</strong></span><b>{money(50000)}</b>
            </label>
          </fieldset>
          <fieldset className="shop-panel checkout-panel choice-panel">
            <legend><span className="panel-heading"><Icon name="card" size={19} /> Phương thức thanh toán</span></legend>
            <label className={`radio-card ${payment === "cod" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => { setPayment("cod"); setError(""); }} />
              <span><strong>COD</strong><small>Thanh toán khi nhận hàng</small></span>
            </label>
            <label className={`radio-card ${payment === "demo" ? "selected" : ""}`}>
              <input type="radio" name="payment" value="demo" checked={payment === "demo"} onChange={() => { setPayment("demo"); setError(""); }} />
              <span><strong>Thanh toán mô phỏng</strong><small>Thanh toán demo, không phát sinh giao dịch thật</small></span>
            </label>
            {payment === "demo" && <div className="field simulation-field">
              <label htmlFor="demo-result">Kết quả thanh toán demo</label>
              <select id="demo-result" value={simulation} onChange={(event) => { setSimulation(event.target.value); setError(""); }}>
                <option value="success">Thành công</option><option value="failure">Thất bại</option>
              </select>
            </div>}
          </fieldset>
        </div>
        <aside className="shop-panel summary-panel" aria-label="Kiểm tra đơn hàng">
          <h2>Kiểm tra đơn hàng</h2>
          <OrderLines lines={lines} />
          <Totals totals={totals} promo={promo} />
          {stockIssue && <p className="inline-error" role="alert">{stockIssue}</p>}
          {error && <p className="inline-error payment-error" role="alert">{error}</p>}
          <button className="button button-primary full-width" type="submit" disabled={!ready || !!stockIssue || pending}>
            {pending ? "Đang xác nhận…" : "Xác nhận đặt hàng"} <Icon name="arrow" size={18} />
          </button>
        </aside>
      </form> : <EmptyState icon="bag" title="Chưa có sản phẩm để thanh toán"
        action={<a className="button button-primary" href={fromCart ? "#/gio-hang" : catalogHref()}>{fromCart ? "Về giỏ hàng" : "Quay lại danh mục"}</a>}>
        Chọn sản phẩm và số lượng trước khi đặt hàng.
      </EmptyState>}
    </div>
  );
}
