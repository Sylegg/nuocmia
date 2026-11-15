import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Danh sách yêu thích — Arcana Card Shop",
  description: "Các sản phẩm goods sưu tầm bạn đã lưu lại.",
};

export default function WishlistPage() {
  return (
    <div className="arcana-store" lang="vi">
      <ArcanaShop initialView="yeu-thich" />
    </div>
  );
}
