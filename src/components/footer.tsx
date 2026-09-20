import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white py-6 text-slate-500 text-xs">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand logo & copyright */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            Brand<span className="text-indigo-600">Gen</span>
          </span>
          <span className="text-slate-400 ml-2 text-xs">
            © 2026 BrandGen. All rights reserved.
          </span>
        </div>

        {/* Right: Nav Links & Social Icons */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-slate-600 text-xs font-medium">
          <Link href="/how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </Link>
          <Link href="/features" className="hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/use-cases" className="hover:text-slate-900 transition-colors">
            Use Cases
          </Link>
          <Link href="/pricing" className="hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="hover:text-slate-900 transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-slate-900 transition-colors">
            Contact
          </Link>

          {/* Social Icons matching mockup */}
          <div className="flex items-center gap-3 ml-1 sm:ml-3 text-slate-400 border-l border-slate-200 pl-4">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 transition-colors"
              aria-label="X"
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 transition-colors"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4 fill-none stroke-currentColor stroke-width-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 transition-colors"
              aria-label="YouTube"
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.32a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
