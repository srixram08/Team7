"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Zap, Terminal, Menu, X, UserCheck, Server, Layers, LogIn } from "lucide-react";
import { GlowButton } from "./GlowButton";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Proctor Console", href: "/dashboard", icon: <Terminal className="h-3.5 w-3.5" /> },
    { label: "Student Exam", href: "/student", icon: <UserCheck className="h-3.5 w-3.5" /> },
    { label: "Admin Hub", href: "/admin", icon: <Server className="h-3.5 w-3.5" /> },
    { label: "Architecture Spec", href: "/architecture", icon: <Layers className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#D6E5D4] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2E5B28] to-[#4E8B46] text-white shadow-[0_4px_14px_rgba(46,91,40,0.3)] transition-transform duration-300 group-hover:scale-105">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 font-heading text-xl font-extrabold tracking-tight text-[#162215]">
              <span>ReviveX</span>
              <span className="rounded-full border border-[#D6E5D4] bg-[#E8F3E7] px-2 py-0.5 text-[10px] font-mono font-bold text-[#2E5B28]">
                v2.4
              </span>
            </div>
            <span className="font-mono text-[9px] tracking-widest text-[#586B56] uppercase">
              Autonomous Resilient Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-wider font-bold text-[#586B56] hover:text-[#2E5B28] transition-colors duration-200"
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login">
            <GlowButton variant="outline" size="sm" icon={<LogIn className="h-3.5 w-3.5" />}>
              Sign In
            </GlowButton>
          </Link>
          <Link href="/demo">
            <GlowButton variant="primary" size="sm">
              Launch Platform
            </GlowButton>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[#586B56] hover:text-[#2E5B28] lg:hidden"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-[#D6E5D4] bg-white px-4 pt-2 pb-6 lg:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 font-sans text-sm uppercase tracking-wider font-bold text-[#586B56] hover:text-[#2E5B28] py-1"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <GlowButton variant="outline" size="md" className="w-full">
                  Sign In
                </GlowButton>
              </Link>
              <Link href="/demo" onClick={() => setIsMobileMenuOpen(false)}>
                <GlowButton variant="primary" size="md" className="w-full">
                  Launch Console
                </GlowButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
