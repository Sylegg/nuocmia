import type { Metadata, Viewport } from "next";
import "./arcana-fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCANA CARD SHOP — Shop pass đồ sưu tầm",
  description:
    "Ghé Arcana xem đồ nhựa, đồ giấy và nhiều món khác đang được pass.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090c14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-[#090c14] text-[#f3eee5] antialiased">
        {children}
      </body>
    </html>
  );
}
