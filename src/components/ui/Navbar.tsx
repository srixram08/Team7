"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DottedLogo } from "./DottedLogo";

export const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm font-sans border-b border-[#E1E8F0]">
        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo with Dotted Matrix */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <DottedLogo size={42} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-[#0B192C] leading-none">
                ReviveX
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#00A8FF] font-sans mt-1 font-bold">
                Resilience Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-[0.12em] text-[#0B192C]">
            <Link href="/student" className="hover:text-[#00A8FF] transition-colors py-2">
              Student Portal
            </Link>
            <Link href="/teacher" className="hover:text-[#00A8FF] transition-colors py-2">
              Teacher Studio
            </Link>
            <Link href="/dashboard" className="hover:text-[#00A8FF] transition-colors py-2">
              Proctor Console
            </Link>
            <Link href="/admin" className="hover:text-[#00A8FF] transition-colors py-2">
              Admin Hub
            </Link>
            <Link href="/architecture" className="hover:text-[#00A8FF] transition-colors py-2">
              Architecture
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3.5">
            <Link
              href="/login"
              className="text-xs uppercase tracking-wider font-bold text-[#0B192C] hover:text-[#00A8FF] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/student"
              className="btn-cyan !py-2.5 !px-5 !text-xs"
            >
              Launch Exam Pod
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-[#0B192C] hover:text-[#00A8FF]"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMobileOpen && (
          <div className="lg:hidden bg-white border-t border-[#E1E8F0] px-6 py-5 space-y-4 shadow-xl">
            <div className="flex flex-col space-y-3 text-xs uppercase tracking-wider font-bold text-[#0B192C]">
              <Link href="/student" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-[#F0F5FA]">Student Portal</Link>
              <Link href="/teacher" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-[#F0F5FA]">Teacher Studio</Link>
              <Link href="/dashboard" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-[#F0F5FA]">Proctor Console</Link>
              <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-[#F0F5FA]">Admin Hub</Link>
              <Link href="/architecture" onClick={() => setIsMobileOpen(false)} className="py-2 border-b border-[#F0F5FA]">Architecture</Link>
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setIsMobileOpen(false)} className="w-full text-center py-2.5 rounded-full border border-[#0B192C] text-xs uppercase font-bold text-[#0B192C]">
                Sign In
              </Link>
              <Link href="/student" onClick={() => setIsMobileOpen(false)} className="btn-cyan w-full text-center">
                Launch Exam Pod
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Dedicated layout spacer to ensure zero content clipping */}
      <div className="h-20 w-full shrink-0" aria-hidden="true" />
    </>
  );
};
