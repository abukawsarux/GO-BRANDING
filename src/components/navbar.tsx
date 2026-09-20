"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ShieldCheck, Bell } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Brand<span className="text-indigo-600">Gen</span>
          </span>
        </Link>

        {/* Center Nav Links to Inner Pages */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/how-it-works"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            How It Works
          </Link>
          <Link
            href="/features"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="/use-cases"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Use Cases
          </Link>
          <Link
            href="/pricing"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Pricing
          </Link>
          <Link
            href="/faq"
            className="text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            FAQ
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Link
            href="/login"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-850 transition-all hover:shadow"
          >
            <span>Create Account</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 shadow-lg">
          <div className="flex flex-col gap-2">
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
            >
              How It Works
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
            >
              Features
            </Link>
            <Link
              href="/use-cases"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
            >
              Use Cases
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-100"
            >
              FAQ
            </Link>
            <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-sm font-medium text-slate-700 rounded-lg bg-slate-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="w-full text-center py-2.5 text-sm font-medium text-white rounded-lg bg-slate-900"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

