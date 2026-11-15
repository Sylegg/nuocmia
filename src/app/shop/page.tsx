import type { Metadata } from "next";
import { ArcanaShop } from "@/components/arcana/ArcanaShop";
import "../arcana-store.css";

export const metadata: Metadata = {
  title: "Arcana Card Shop — Danh mục và đặt hàng",
  description: "Mua thẻ bài, đồ giấy và đồ nhựa sưu tầm trong bản demo Arcana.",
};

export default function ShopPage() {
  return <div className="arcana-store" lang="vi"><ArcanaShop /></div>;
}
