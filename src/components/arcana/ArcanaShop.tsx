"use client";

import { useEffect, useRef, useState } from "react";
import { offersBySku, productsById } from "@/data/arcana";
import { catalogHref, readFilters } from "@/lib/arcana-catalog";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { checkoutHref, navigate, successHref, useShopRoute } from "@/lib/arcana-route";
import {
  checkoutId, errorMessage, initialShop, initializeShop, readAccount, readShop, stockError,
  subscribeShop, toggleFavorite, writeAccount,
} from "@/lib/arcana-shop";
import type { CartLine, CheckoutMode } from "@/lib/arcana-shop";
import { CartView } from "./CartView";
import { CatalogView, FavoritesView } from "./CatalogView";
import { CheckoutView } from "./CheckoutView";
import { GuideView } from "./GuideView";
import { SuccessView, TrackingView } from "./OrdersView";
import { ProductView } from "./ProductView";
import { guideLinks, ShopFooter, ShopSearchDialog } from "./ShopChrome";
import { EmptyState, Icon } from "./ShopUI";

const CATALOG_KEY = "arcana.last-catalog";

type Toast = { message: string; href?: string; error?: boolean };

export function ArcanaShop({ initialView }: { initialView?: string } = {}) {
  const route = useShopRoute(initialView);

  useEffect(() => {
    if (!route.view && !initialView && route.hash === (window.location.hash || "#/")) {
      window.location.replace("/");
    }
  }, [initialView, route.hash, route.view]);

  return route.view ? <ShopContent route={route} /> : null;
}

function ShopContent({ route }: { route: ReturnType<typeof useShopRoute> }) {
  const [state, setState] = useState(initialShop);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [account, setAccount] = useState(false);
  const [lastCatalog, setLastCatalog] = useState(catalogHref());
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(route.path);
  const inCatalog = route.view === "danh-muc";
  const filters = readFilters(route.params);
  const currentCatalog = inCatalog ? catalogHref(filters) : lastCatalog;

  useEffect(() => {
    let disposed = false;
    function sync() {
      if (disposed) return;
      try {
        setState(readShop());
        setReady(true);
        setStorageError("");
      } catch (error) {
        setReady(false);
        setStorageError(errorMessage(error));
      }
    }
    const stop = subscribeShop(sync);
    try {
      const savedCatalog = sessionStorage.getItem(CATALOG_KEY);
      if (savedCatalog?.startsWith("#/danh-muc")) setLastCatalog(savedCatalog);
      setAccount(readAccount());
    } catch {
      // The catalog URL and guest checkout still work without session storage.
    }
    void initializeShop().then(sync).catch((error) => {
      if (!disposed) setStorageError(errorMessage(error));
    });
    return () => { disposed = true; stop(); };
  }, []);

  useEffect(() => {
    if (!inCatalog) return;
    setLastCatalog(currentCatalog);
    try {
      sessionStorage.setItem(CATALOG_KEY, currentCatalog);
    } catch {
      // The filters remain in the URL.
    }
  }, [inCatalog, currentCatalog]);

  useEffect(() => {
    if (previousPath.current === route.path) return;
    previousPath.current = route.path;
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
  }, [route.path]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 4400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const previousOrder = route.view === "thanh-toan"
    ? state.orders.find((order) => order.requestId === route.extra) : undefined;

  useEffect(() => {
    if (previousOrder) navigate(successHref(previousOrder.code), true);
  }, [previousOrder]);

  function changeAccount(value: boolean) {
    try {
      writeAccount(value);
      setAccount(value);
    } catch (error) {
      setToast({ message: errorMessage(error), error: true });
    }
  }

  async function favorite(id: string) {
    try {
      const saved = await toggleFavorite(id);
      setToast({ message: saved ? "Đã lưu vào yêu thích." : "Đã bỏ lưu sản phẩm.", href: saved ? "#/yeu-thich" : undefined });
    } catch (error) {
      setToast({ message: errorMessage(error), error: true });
    }
  }

  function beginCheckout(mode: CheckoutMode, line?: CartLine) {
    const issue = stockError(line ? [line] : state.cart, state);
    if (issue) {
      setToast({ message: issue, error: true });
      return;
    }
    setToast(null);
    navigate(checkoutHref(mode, checkoutId(), line));
  }

  const item = route.view === "the" ? productsById.get(route.id) : undefined;
  const order = route.view === "thanh-cong" ? state.orders.find(({ code }) => code === route.id) : undefined;
  const isCheckout = route.view === "thanh-toan"
    && (route.id === "gio-hang" || route.id === "mua-ngay") && /^[a-f0-9]{24}$/.test(route.extra);
  const guide = route.view === "huong-dan" && Object.hasOwn(guideLinks, route.id)
    ? route.id as keyof typeof guideLinks : undefined;
  const sku = route.params.get("sku");
  const instant = sku && offersBySku.has(sku) ? { sku, quantity: Number(route.params.get("sl")) } : null;
  const notFound = <div className="shop-width inner-page">
    <EmptyState icon="search" title="Không tìm thấy trang"
      action={<a className="button button-primary" href={catalogHref()}>Về danh mục <Icon name="arrow" size={17} /></a>}>
      Mở danh mục để tiếp tục mua sắm.
    </EmptyState>
  </div>;

  let page = notFound;
  if (inCatalog) page = <CatalogView filters={filters} state={state} onFavorite={favorite} onFilter={(next) => navigate(catalogHref(next), true)} />;
  else if (item) page = <ProductView key={route.hash} item={item} initialSku={sku} state={state} ready={ready}
    catalog={currentCatalog} onFavorite={favorite} onBuyNow={(line) => beginCheckout("mua-ngay", line)}
    onAdded={() => setToast({ message: "Đã thêm vào giỏ hàng.", href: "#/gio-hang" })} />;
  else if (route.view === "yeu-thich") page = <FavoritesView state={state} onFavorite={favorite} />;
  else if (route.view === "gio-hang") page = <CartView state={state} ready={ready} onCheckout={() => beginCheckout("gio-hang")} />;
  else if (isCheckout) page = previousOrder ? <p className="shop-width loading-page">Đang mở đơn hàng…</p> :
    <CheckoutView key={route.extra} state={state} ready={ready} mode={route.id as CheckoutMode}
      requestId={route.extra} instant={instant} account={account} />;
  else if (order) page = <SuccessView key={order.code} order={order} />;
  else if (route.view === "thanh-cong" && !ready && !storageError) page = <p className="shop-width loading-page">Đang tải đơn hàng…</p>;
  else if (route.view === "tra-cuu") page = <TrackingView key={route.hash} state={state} ready={ready}
    prefilledCode={(route.params.get("ma") ?? "").slice(0, 30)} account={account} setAccount={changeAccount}
    focusAccount={route.params.get("tai-khoan") === "1"}
    showHistory={route.params.get("lich-su") === "1"} />;
  else if (guide) page = <GuideView id={guide} />;

  return (
    <>
      <a className="skip-link" href="#noi-dung" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>Đến nội dung</a>
      <SiteHeader
        currentView={route.view}
        account={account}
        catalogHref={currentCatalog}
        cartCount={state.cart.reduce((sum, line) => sum + line.quantity, 0)}
        onLogout={() => changeAccount(false)}
        onSearch={() => setSearchOpen(true)}
        onNavigate={navigate}
      />
      <main id="noi-dung" tabIndex={-1} ref={main}>
        {storageError && <div className="storage-error" role="alert">{storageError}</div>}
        {page}
      </main>
      <ShopFooter />
      {searchOpen && <ShopSearchDialog query={inCatalog ? filters.q : ""}
        onDismiss={() => setSearchOpen(false)}
        onSearch={(q) => navigate(catalogHref({ ...(inCatalog ? filters : {}), q }))} />}
      {toast && <aside className={`shop-toast ${toast.error ? "toast-error" : ""}`} role={toast.error ? "alert" : "status"}>
        <Icon name={toast.error ? "info" : "check"} size={19} />
        <span>{toast.message}</span>
        {toast.href && <a className="text-link" href={toast.href} onClick={() => setToast(null)}>Xem <Icon name="arrow" size={15} /></a>}
        <button className="icon-button" type="button" aria-label="Đóng thông báo" onClick={() => setToast(null)}><Icon name="close" size={17} /></button>
      </aside>}
    </>
  );
}
