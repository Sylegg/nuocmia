import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng — Arcana Card Shop",
  description: "Xác nhận địa chỉ và hoàn tất đặt hàng demo.",
};

export default function CheckoutPage() {
  return (
    <div className="arcana-store" lang="vi">
      <ArcanaShop initialView="thanh-toan" />
    </div>
  );
}
