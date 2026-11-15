"use client";

import { money, orderDate, paymentLabels, shippingLabels, statusLabels } from "@/lib/arcana-shop";
import type { Order, OrderLine, OrderStatus, Promo, calculateTotals } from "@/lib/arcana-shop";
import { CardFace } from "./ShopUI";

export function LineImage({ line }: { line: OrderLine }) {
  if (line.face) return <div className="order-line-image"><CardFace item={line.face} edition={line.edition} /></div>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="order-line-image" src={line.art} alt="" width={48} height={67} />;
}

export function OrderLines({ lines }: { lines: OrderLine[] }) {
  return (
    <ul className="order-lines">
      {lines.map((line) => <li key={line.sku}>
        <LineImage line={line} />
        <div className="order-line-meta"><strong>{line.name}</strong><span>{line.edition} · {line.condition} · SL {line.quantity}</span></div>
        <b>{money(line.price * line.quantity)}</b>
      </li>)}
    </ul>
  );
}

export function Totals({ totals, promo, estimate = false }: {
  totals: ReturnType<typeof calculateTotals>; promo: Promo; estimate?: boolean;
}) {
  return (
    <dl className="order-totals">
      <div><dt>Tạm tính</dt><dd>{money(totals.subtotal)}</dd></div>
      <div className={promo ? "discount-row" : ""}><dt>Ưu đãi {promo && <span>({promo})</span>}</dt>
        <dd>{promo ? "−" : ""}{money(totals.discount)}</dd>
      </div>
      <div><dt>{estimate ? "Phí giao hàng dự kiến" : "Phí giao hàng"}</dt>
        <dd>{totals.freight ? money(totals.freight) : "Miễn phí"}</dd>
      </div>
      <div className="order-total"><dt>Tổng tiền</dt><dd>{money(totals.total)}</dd></div>
    </dl>
  );
}

export function OrderBadge({ status }: { status: OrderStatus }) {
  return <span className={`order-status status-${status}`}><i />{statusLabels[status]}</span>;
}

export function OrderDelivery({ order }: { order: Order }) {
  return (
    <dl className="delivery-facts">
      <div><dt>Người nhận</dt><dd>{order.buyer.name} · {order.buyer.phone}</dd></div>
      <div><dt>Địa chỉ giao hàng</dt><dd>{order.buyer.address}, {order.buyer.city}</dd></div>
      {order.buyer.email && <div><dt>Email</dt><dd>{order.buyer.email}</dd></div>}
      {order.buyer.note && <div><dt>Ghi chú</dt><dd>{order.buyer.note}</dd></div>}
      <div><dt>Giao hàng</dt><dd>{shippingLabels[order.shipping]}</dd></div>
      <div><dt>Thanh toán</dt><dd>{paymentLabels[order.payment]}</dd></div>
      <div><dt>Ngày đặt</dt><dd>{orderDate(order.createdAt)}</dd></div>
    </dl>
  );
}
