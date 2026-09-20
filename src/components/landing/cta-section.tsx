"use client";

import React from "react";
import { Sparkles, ArrowUp } from "lucide-react";

export function CtaSection() {
  const scrollToGenerator = () => {
    const el = document.getElementById("generator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm mb-6 border border-white/10">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>No Credit Card • 3 Daily Free Generations</span>
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-balance">
          Ready to make your content look branded?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-base text-slate-300 text-pretty">
          Drop your image or video in right now and get watermark-protected,
          perfectly sized content in seconds.
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={scrollToGenerator}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105"
          >
            <span>Start Creating</span>
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

