import type { Metadata } from "next";
import { HomeHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Starfield } from "@/components/Starfield";
import { AuthCard } from "@/components/auth/AuthCard";
import { ToastBanner } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Đăng nhập & Đăng ký — Arcana Card Shop",
  description: "Đăng nhập hoặc đăng ký tài khoản mới để sở hữu và lưu giữ các tác phẩm thẻ bài ma thuật huyền thoại.",
};

export default function LoginPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#090c14] text-[#f3eee5] flex flex-col justify-between">
      {/* Background Starfield & Subtle Celestial Aura */}
      <Starfield />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_25%,rgba(228,188,131,0.08),transparent_75%)]"
      />

      {/* Synchronized Header */}
      <HomeHeader />

      {/* Main Form Centerpiece */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:py-16">
        <AuthCard initialMode="login" />
      </main>

      {/* Footer & Toast */}
      <div className="relative z-10">
        <Footer />
      </div>

      <ToastBanner />
    </div>
  );
}
