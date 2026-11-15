"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { writeAccount } from "@/lib/arcana-shop";
import { useMarketplaceStore } from "@/store/useMarketplaceStore";
import { ArcanaLogo } from "@/components/layout/ArcanaLogo";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  initialMode?: "login" | "register";
  onSuccess?: () => void;
  isModal?: boolean;
}

export function AuthCard({
  initialMode = "login",
  onSuccess,
  isModal = false,
}: AuthCardProps) {
  const router = useRouter();
  const showToast = useMarketplaceStore((s) => s.showToast);
  const setAccountOpen = useMarketplaceStore((s) => s.setAccountOpen);

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    if (pass.length >= 9 && /[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["", "Yếu", "Khá", "Vững chắc"];
  const strengthColors = ["", "#ef4444", "#f59e0b", "#10b981"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "login") {
      if (!email.trim()) {
        setErrorMsg("Vui lòng nhập tên tài khoản.");
        return;
      }
      if (!password) {
        setErrorMsg("Vui lòng nhập mật khẩu.");
        return;
      }
    } else {
      if (!username.trim()) {
        setErrorMsg("Vui lòng nhập tên tài khoản.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Vui lòng nhập địa chỉ Email hợp lệ.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Mật khẩu cần ít nhất 6 ký tự.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Mật khẩu xác nhận không trùng khớp.");
        return;
      }
      if (!agreeTerms) {
        setErrorMsg("Vui lòng đồng ý với Điều lệ Hội đồng Arcana.");
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      writeAccount(true);
      window.dispatchEvent(new Event("storage"));

      showToast({
        title: mode === "login" ? "Đăng nhập thành công!" : "Tạo tài khoản thành công!",
        subtitle:
          mode === "login"
            ? "Chào mừng Nhà Lữ Hành trở lại thế giới Arcana."
            : "Khế ước hội viên Arcana đã được thiết lập thành công.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        setAccountOpen(false);
        router.push("/");
      }
    }, 600);
  };

  // 1-Click Demo Login
  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      writeAccount(true);
      window.dispatchEvent(new Event("storage"));

      showToast({
        title: "Đăng nhập Demo thành công!",
        subtitle: "Đang trải nghiệm với danh xưng Nhà Lữ Hành Huyền Thoại.",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        setAccountOpen(false);
        router.push("/");
      }
    }, 400);
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-[#7b5b3a]/60 bg-[#0a1219]/90 p-6 sm:p-9 shadow-2xl backdrop-blur-2xl transition-all",
        "border-t-[#f5d783]/60 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_36px_rgba(228,188,131,0.12)]",
        isModal ? "max-w-md" : "max-w-lg mx-auto"
      )}
    >
      {/* Background celestial ornament */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(228,188,131,0.15),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(33,70,75,0.3),transparent_70%)] blur-2xl"
      />

      {/* Header Emblem & Title */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e4bc83]/30 bg-[#0d1c25]/80 p-2 shadow-lg backdrop-blur-md">
          <ArcanaLogo className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(245,215,131,0.5)]" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#7b5b3a]/70 bg-[#e4bc83]/10 px-3 py-0.5 text-[10.5px] font-semibold tracking-[0.2em] text-[#edc38a] uppercase backdrop-blur-md mb-2">
          <Sparkles className="h-3 w-3 text-[#f5d783]" />
          <span>HỘI ĐỒNG MA PHÁP ARCANA</span>
        </div>

        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#f3eee5]">
          {mode === "login" ? "Đăng nhập" : "Đăng ký"}
        </h1>
      </div>

      {/* 2-in-1 Segmented Switcher */}
      <div className="relative z-10 mt-6 grid grid-cols-2 rounded-full border border-[#7b5b3a]/50 bg-[#070e14]/90 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMsg("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
            mode === "login"
              ? "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#090c14] shadow-md shadow-amber-950/40"
              : "text-[#aaaab6] hover:text-[#f3eee5]"
          )}
        >
          <LogIn className="h-4 w-4" />
          <span>Đăng nhập</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMsg("");
          }}
          className={cn(
            "flex items-center justify-center gap-2 rounded-full py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
            mode === "register"
              ? "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#090c14] shadow-md shadow-amber-950/40"
              : "text-[#aaaab6] hover:text-[#f3eee5]"
          )}
        >
          <UserPlus className="h-4 w-4" />
          <span>Đăng ký</span>
        </button>
      </div>

      {/* Form Content with Animation */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-3.5 py-2.5 text-xs text-rose-200"
          >
            {errorMsg}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === "register" && (
            <motion.div
              key="field-username"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              <label className="text-xs font-medium text-[#c9bfb2]">
                Tên tài khoản
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ví dụ: Kael_Arcana"
                  className="h-11 w-full rounded-xl border border-[#2d3a46] bg-[#070e14]/70 pl-10 pr-4 text-xs sm:text-sm text-[#f3eee5] placeholder:text-[#525f6e] focus:border-[#edc38a] focus:outline-none focus:ring-1 focus:ring-[#edc38a]/50 transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Username / Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#c9bfb2]">
            {mode === "login" ? "Tên tài khoản" : "Địa chỉ Email"}
          </label>
          <div className="relative">
            {mode === "login" ? (
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
            ) : (
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
            )}
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === "login" ? "Nhập tên tài khoản" : "dia_chi_email@arcana.vn"}
              className="h-11 w-full rounded-xl border border-[#2d3a46] bg-[#070e14]/70 pl-10 pr-4 text-xs sm:text-sm text-[#f3eee5] placeholder:text-[#525f6e] focus:border-[#edc38a] focus:outline-none focus:ring-1 focus:ring-[#edc38a]/50 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-[#c9bfb2]">Mật khẩu</label>
            {mode === "login" && (
              <button
                type="button"
                onClick={() =>
                  showToast({
                    title: "Khôi phục mật khẩu",
                    subtitle: "Hệ thống đã gửi liên kết khôi phục đến email của bạn.",
                  })
                }
                className="text-[11px] text-[#edc38a] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="h-11 w-full rounded-xl border border-[#2d3a46] bg-[#070e14]/70 pl-10 pr-10 text-xs sm:text-sm text-[#f3eee5] placeholder:text-[#525f6e] focus:border-[#edc38a] focus:outline-none focus:ring-1 focus:ring-[#edc38a]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c94a0] hover:text-[#f3eee5] cursor-pointer"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Meter (Chỉ hiển thị khi Đăng ký) */}
          {mode === "register" && password && (
            <div className="mt-1.5 space-y-1">
              <div className="flex h-1 w-full gap-1 overflow-hidden rounded-full bg-[#1b2631]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: strength >= 1 ? "33.33%" : "0%",
                    backgroundColor: strengthColors[strength],
                  }}
                />
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: strength >= 2 ? "33.33%" : "0%",
                    backgroundColor: strengthColors[strength],
                  }}
                />
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: strength >= 3 ? "33.33%" : "0%",
                    backgroundColor: strengthColors[strength],
                  }}
                />
              </div>
              <div className="flex justify-between text-[10.5px] text-[#8c94a0]">
                <span>Độ vững mật khẩu:</span>
                <span style={{ color: strengthColors[strength] }} className="font-semibold">
                  {strengthLabels[strength]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field (Khi Đăng ký) */}
        <AnimatePresence mode="wait">
          {mode === "register" && (
            <motion.div
              key="field-confirm-pass"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              <label className="text-xs font-medium text-[#c9bfb2]">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c94a0]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-xl border border-[#2d3a46] bg-[#070e14]/70 pl-10 pr-4 text-xs sm:text-sm text-[#f3eee5] placeholder:text-[#525f6e] focus:border-[#edc38a] focus:outline-none focus:ring-1 focus:ring-[#edc38a]/50 transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkbox Options */}
        <div className="flex items-center justify-between text-xs text-[#aaaab6] pt-1">
          {mode === "login" ? (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#384857] bg-[#070e14] text-[#edc38a] focus:ring-0 cursor-pointer accent-[#edc38a]"
              />
              <span>Ghi nhớ phiên đăng nhập</span>
            </label>
          ) : (
            <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] leading-relaxed">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 mt-0.5 rounded border-[#384857] bg-[#070e14] text-[#edc38a] focus:ring-0 cursor-pointer accent-[#edc38a]"
              />
              <span>
                Tôi đồng ý với các{" "}
                <span className="text-[#edc38a] hover:underline">Điều lệ Hội đồng Arcana</span>
              </span>
            </label>
          )}
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f5d783] via-[#edc38a] to-[#cea063] px-6 text-sm font-bold text-[#090c14] shadow-[0_4px_24px_rgba(237,197,146,0.35)] transition-all hover:scale-[1.01] hover:brightness-110 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[#090c14] border-t-transparent" />
          ) : (
            <>
              {mode === "login" ? (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Đăng ký</span>
                </>
              )}
            </>
          )}
        </button>

        {/* 1-Click Quick Demo Sign In */}
        <div className="pt-2">
          <div className="relative flex items-center justify-center py-2">
            <span className="absolute inset-x-0 h-px bg-[#263542]" />
            <span className="relative bg-[#0a1219] px-3 text-[11px] uppercase tracking-wider text-[#738290]">
              Hoặc trải nghiệm nhanh
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={isLoading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#7b5b3a]/60 bg-[#0d1c25]/80 px-4 text-xs font-semibold text-[#f3eee5] shadow-sm backdrop-blur-md transition-all hover:border-[#edc38a] hover:bg-[#152e3e]/90 active:scale-[0.98] cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-[#f5d783]" />
            <span>Đăng nhập 1-chạm (Tài khoản Demo Arcana)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
