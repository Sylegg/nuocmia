import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng & Tài khoản — Arcana Card Shop",
  description: "Tra cứu hành trình đơn hàng và thông tin tài khoản sưu tầm demo.",
};

export default function TrackingPage() {
  return (
    <div className="arcana-store" lang="vi">
      <ArcanaShop initialView="tra-cuu" />
    </div>
  );
}
