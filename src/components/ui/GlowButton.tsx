"use client";

import React from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "warning" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  id?: string;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  icon,
  disabled = false,
  type = "button",
  id,
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs font-semibold",
    md: "px-6 py-2.5 text-sm font-bold",
    lg: "px-8 py-3.5 text-base font-bold",
  };

  const variantClasses = {
    primary:
      "bg-[#2E5B28] text-white font-bold shadow-[0_4px_16px_rgba(46,91,40,0.25)] hover:shadow-[0_8px_24px_rgba(46,91,40,0.35)] hover:bg-[#3C7335] border border-[#2E5B28]",
    secondary:
      "bg-[#E8F3E7] text-[#2E5B28] border border-[#D6E5D4] hover:border-[#2E5B28] hover:bg-[#D6E5D4]",
    danger:
      "bg-[#FEE2E2] text-[#DC2626] font-bold border border-[#FCA5A5] hover:bg-[#DC2626] hover:text-white hover:shadow-[0_4px_15px_rgba(220,38,38,0.3)]",
    warning:
      "bg-[#FEF3C7] text-[#D97706] font-bold border border-[#FCD34D] hover:bg-[#D97706] hover:text-white",
    outline:
      "bg-white text-[#2E5B28] border border-[#D6E5D4] hover:border-[#2E5B28] hover:bg-[#E8F3E7]",
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full font-sans transition-all duration-200 ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed shadow-none" : "cursor-pointer"
      } ${className}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
