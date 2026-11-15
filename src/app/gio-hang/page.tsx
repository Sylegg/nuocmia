import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Giỏ hàng — Arcana Card Shop",
  description: "Xem và quản lý các sản phẩm goods sưu tầm trong giỏ hàng.",
};

export default function CartPage() {
  return (
    <div className="arcana-store" lang="vi">
      <ArcanaShop initialView="gio-hang" />
    </div>
  );
}
