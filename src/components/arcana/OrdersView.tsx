"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { catalogHref } from "@/lib/arcana-catalog";
import { trackingHref } from "@/lib/arcana-route";
import { cancelOrder, errorMessage, findOrder, money, normalizePhone, orderDate, validPhone } from "@/lib/arcana-shop";
import type { Order, ShopState } from "@/lib/arcana-shop";
import { Breadcrumbs } from "./ShopChrome";
import { Dialog, Icon } from "./ShopUI";
import { OrderBadge, OrderDelivery, OrderLines, Totals } from "./OrderUI";

async function copyCode(code: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch {
      // A selection-based copy also works on local-network HTTP previews.
    }
  }
  const field = document.createElement("textarea");
  field.value = code;
  field.readOnly = true;
  field.style.cssText = "position:fixed;left:-9999px;top:0";
  const previous = document.activeElement;
  document.body.append(field);
  field.select();
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
  }
}

function OrderContents({ order }: { order: Order }) {
  return <div className="order-detail-grid">
    <section className="shop-panel order-detail-panel">
      <h2>Sản phẩm đã đặt</h2>
      <OrderLines lines={order.lines} />
      <Totals totals={order.totals} promo={order.promo} />
    </section>
    <section className="shop-panel order-detail-panel">
      <h2>Thông tin giao hàng</h2>
      <OrderDelivery order={order} />
    </section>
  </div>;
}

export function SuccessView({ order }: { order: Order }) {
  const [copy, setCopy] = useState("");
  return (
    <div className="shop-width inner-page order-page">
      <Breadcrumbs items={[{ label: "Đặt hàng thành công" }]} />
      <section className="shop-panel success-banner" aria-labelledby="success-title">
        <span className="success-icon"><Icon name="check" size={29} /></span>
        <OrderBadge status={order.status} />
        <h1 id="success-title">Đặt hàng thành công!</h1>
        <p>Cảm ơn {order.buyer.name}. Dùng mã bên dưới cùng số điện thoại để tra cứu đơn.</p>
        <div className="order-code"><span>Mã đơn</span><strong>{order.code}</strong>
          <button className="icon-button" type="button" aria-label="Sao chép mã đơn" onClick={async () => {
            setCopy(await copyCode(order.code) ? "Đã sao chép mã đơn." : "Bạn có thể chọn mã đơn để sao chép.");
          }}><Icon name={copy.startsWith("Đã") ? "check" : "copy"} size={19} /></button>
        </div>
        <div className="copy-status" aria-live="polite">{copy}</div>
        <div className="success-actions">
          <a className="button button-primary" href={trackingHref(order.code)}><Icon name="package" size={18} /> Tra cứu đơn</a>
          <a className="button button-secondary" href={catalogHref()}>Tiếp tục mua sắm <Icon name="arrow" size={17} /></a>
        </div>
      </section>
      <OrderContents order={order} />
    </div>
  );
}

type Lookup = { code: string; phone: string };

export function TrackingView({ state, ready, prefilledCode, account, setAccount, focusAccount, showHistory }: {
  state: ShopState; ready: boolean; prefilledCode: string; account: boolean; setAccount: (value: boolean) => void;
  focusAccount: boolean; showHistory: boolean;
}) {
  const [code, setCode] = useState(prefilledCode);
  const [phone, setPhone] = useState("");
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const inFlight = useRef(false);
  const resultRef = useRef<HTMLElement>(null);
  const accountRef = useRef<HTMLElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const history = account ? state.orders.filter((order) => order.account) : [];
  const result = selected ? history.find((order) => order.code === selected) : lookup ? findOrder(state, lookup.code, lookup.phone) : undefined;

  useEffect(() => {
    if (!focusAccount && !showHistory) return;
    const frame = requestAnimationFrame(() => {
      const target = showHistory ? historyRef.current ?? accountRef.current : accountRef.current;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusAccount, showHistory, account]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSelected("");
    setLookup(null);
    setCancelError("");
    if (!code.trim()) {
      setError("Nhập mã đơn hàng.");
      return;
    }
    if (!validPhone(phone)) {
      setError("Nhập số điện thoại 10 chữ số đã dùng khi đặt hàng.");
      return;
    }
    const query = { code: code.trim().toUpperCase(), phone: normalizePhone(phone) };
    if (!findOrder(state, query.code, query.phone)) {
      setError("Không tìm thấy đơn. Kiểm tra lại mã đơn và số điện thoại.");
      return;
    }
    setError("");
    setLookup(query);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "nearest" }));
  }

  async function cancel(close: () => void) {
    if (!result || inFlight.current) return;
    inFlight.current = true;
    setCancelling(true);
    setCancelError("");
    try {
      await cancelOrder(result.code, result.buyer.phone);
    } catch (error) {
      setCancelError(errorMessage(error));
    } finally {
      inFlight.current = false;
      setCancelling(false);
      close();
    }
  }

  return (
    <div className="shop-width inner-page tracking-page">
      <Breadcrumbs items={[{ label: "Tra cứu đơn" }]} />
      <div className="page-heading"><h1>Tra cứu đơn</h1><p>Xem thông tin và trạng thái đơn hàng Arcana.</p></div>
      <div className="tracking-layout">
        <form className="shop-panel tracking-form" onSubmit={submit} noValidate>
          <div className="panel-heading"><Icon name="package" size={20} /><h2>Tìm đơn hàng</h2></div>
          <label className="field"><span>Mã đơn</span>
            <input value={code} maxLength={30} placeholder="Ví dụ ARC-DEMO01" autoCapitalize="characters" spellCheck={false}
              onChange={(event) => { setCode(event.target.value); setError(""); }} />
          </label>
          <label className="field"><span>Số điện thoại</span>
            <input type="tel" autoComplete="tel" maxLength={25} placeholder="Số điện thoại khi đặt" value={phone}
              onChange={(event) => { setPhone(event.target.value); setError(""); }} />
          </label>
          {error && <p className="inline-error" role="alert">{error}</p>}
          <button type="submit" className="button button-primary" disabled={!ready}><Icon name="search" size={18} /> Tra cứu đơn</button>
        </form>
        <section className="shop-panel tracking-account" tabIndex={-1} ref={accountRef}>
          <div className="panel-heading"><Icon name="user" size={20} /><h2>Tài khoản demo</h2></div>
          {account ? <>
            <div className="account-bar" ref={historyRef} tabIndex={-1}><span>Lịch sử đơn hàng</span>
              <button className="text-link" type="button" onClick={() => { setSelected(""); setAccount(false); }}>Thoát tài khoản demo</button>
            </div>
            <ul className="account-orders">
              {history.map((order) => <li key={order.code}>
                <button type="button" aria-label={`Xem đơn ${order.code}`} onClick={() => {
                  setSelected(order.code);
                  setCancelError("");
                  requestAnimationFrame(() => resultRef.current?.scrollIntoView({ block: "nearest" }));
                }}>
                  <span><strong>{order.code}</strong><small>{orderDate(order.createdAt)} · {money(order.totals.total)}</small></span>
                  <OrderBadge status={order.status} /><Icon name="chevron" size={15} />
                </button>
              </li>)}
            </ul>
          </> : <>
            <p>Xem đơn mẫu và các đơn bạn đặt khi đang dùng tài khoản demo.</p>
            <button className="button button-secondary" type="button" disabled={!ready} onClick={() => setAccount(true)}>
              Vào tài khoản demo <Icon name="arrow" size={17} />
            </button>
          </>}
        </section>
      </div>
      {result && <section className="tracking-result" ref={resultRef} aria-label="Chi tiết đơn hàng">
        <div className="tracking-result-heading">
          <div><h2>Đơn {result.code}</h2><OrderBadge status={result.status} /></div>
          {result.status === "pending" && <button className="button button-danger" type="button" onClick={() => setConfirm(true)}>Hủy đơn</button>}
        </div>
        {cancelError && <p className="inline-error" role="alert">{cancelError}</p>}
        <OrderContents order={result} />
      </section>}
      {confirm && result && <Dialog className="confirm-dialog" label="Xác nhận hủy đơn" onDismiss={() => setConfirm(false)}>
        {(close) => <div className="confirm-content">
          <h2>Hủy đơn {result.code}?</h2>
          <p>Các sản phẩm trong đơn sẽ được trả lại kho.</p>
          <div>
            <button type="button" autoFocus className="button button-secondary" onClick={close} disabled={cancelling}>Giữ đơn</button>
            <button type="button" className="button button-danger" onClick={() => void cancel(close)} disabled={cancelling}>
              {cancelling ? "Đang hủy…" : "Xác nhận hủy"}
            </button>
          </div>
        </div>}
      </Dialog>}
    </div>
  );
}
