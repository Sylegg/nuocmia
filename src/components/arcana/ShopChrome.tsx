"use client";

import type { FormEvent } from "react";
import { ArcanaMark, Brand, Dialog, Icon } from "./ShopUI";

export const guideLinks = {
  "mua-hang": "Hướng dẫn mua hàng",
  "giao-hang": "Giao hàng",
  "doi-tra": "Đổi trả",
  "cau-hoi": "Câu hỏi thường gặp",
} as const;

export function ShopSearchDialog({ query, onDismiss, onSearch }: {
  query: string;
  onDismiss: () => void;
  onSearch: (query: string) => void;
}) {
  return (
    <Dialog className="shop-search-dialog" label="Tìm kiếm sản phẩm" onDismiss={onDismiss}>
      {(close) => {
        function submit(event: FormEvent<HTMLFormElement>) {
          event.preventDefault();
          const text = String(new FormData(event.currentTarget).get("q") ?? "").trim();
          close();
          onSearch(text);
        }

        return (
          <form className="shop-search-form" role="search" onSubmit={submit}>
            <input type="search" name="q" defaultValue={query} maxLength={100} autoFocus
              placeholder="Tìm sản phẩm, mã hoặc bộ sưu tập" aria-label="Tìm sản phẩm, mã hoặc bộ sưu tập" />
            <button className="icon-button" type="submit" aria-label="Tìm kiếm"><Icon name="search" size={19} /></button>
            <button className="icon-button" type="button" onClick={close} aria-label="Đóng tìm kiếm"><Icon name="close" size={19} /></button>
          </form>
        );
      }}
    </Dialog>
  );
}

export function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-width footer-inner">
        <div className="footer-brand">
          <Brand />
          <p>Thẻ bài, đồ giấy và đồ nhựa sưu tầm.</p>
        </div>
        <nav aria-label="Hỗ trợ mua hàng" className="footer-links">
          <a href="/">Về CARDVERSE</a>
          {Object.entries(guideLinks).map(([id, label]) => <a href={`#/huong-dan/${id}`} key={id}>{label}</a>)}
        </nav>
        <div className="footer-bottom"><span>© Arcana Card Shop</span><span><ArcanaMark /> Cửa hàng demo</span></div>
      </div>
    </footer>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Vị trí trang">
      <a href="/">Trang chủ</a>
      {items.map(({ label, href }, index) => <span key={index}>
        <Icon name="chevron" size={12} />
        {href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}
      </span>)}
    </nav>
  );
}

