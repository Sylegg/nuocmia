"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "gold";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    const variantClasses = {
      primary:
        "bg-gradient-to-r from-[#edc592] to-[#cea063] text-[#241709] font-bold border border-[#e3bb84] hover:brightness-105 shadow-md shadow-amber-950/40 active:scale-[0.98]",
      secondary:
        "bg-white/5 text-[#f3eee5] border border-[#363643] hover:border-[#7b5b3a] hover:text-[#e4bc83] hover:bg-[#ebba7e0b] active:scale-[0.98]",
      outline:
        "border border-[#282e3a] bg-[#101520] text-[#f3eee5] hover:border-[#7b5b3a] hover:text-[#e4bc83] active:scale-[0.98]",
      ghost:
        "bg-transparent text-[#aaaab6] hover:text-[#f3eee5] hover:bg-white/5 active:scale-[0.98]",
      gold:
        "bg-[#e4bc83] text-[#1b1207] font-bold hover:bg-[#edc38a] shadow-md shadow-amber-950/40 active:scale-[0.98]",
    }[variant];

    const sizeClasses = {
      sm: "h-9 px-3.5 text-xs rounded-full",
      md: "h-11 px-5 text-sm rounded-full",
      lg: "h-12 px-6 text-sm rounded-full",
      icon: "h-10 w-10 rounded-full",
    }[size];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4bc83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090c14] disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
          variantClasses,
          sizeClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
