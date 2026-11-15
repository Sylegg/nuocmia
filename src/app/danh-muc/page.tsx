import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm — Arcana Card Shop",
  description: "Khám phá toàn bộ danh mục goods sưu tầm: Đồ giấy, Đồ nhựa và phụ kiện.",
};

export default function CatalogPage() {
  return (
    <div className="arcana-store" lang="vi">
      <ArcanaShop initialView="danh-muc" />
    </div>
  );
}
