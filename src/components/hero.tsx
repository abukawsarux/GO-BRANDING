import React from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-3 pb-1 sm:pt-5 sm:pb-2 text-center">
      <div className="mx-auto max-w-3xl px-4">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/70 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 mb-2 shadow-2xs">
          <Sparkles className="h-3 w-3 text-indigo-600" />
          <span>Automated Media Branding & Multi-Format Resizer</span>
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 text-balance">
          Make Every Image & Video Look Like Your Brand.
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-1 max-w-xl text-xs sm:text-sm text-slate-600 text-pretty">
          Upload your media, add your logo and brand name, choose your size, and
          download ready-to-use branded content.
        </p>

        {/* Trust points */}
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> No signup required
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-500" /> 3 free daily generations
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> 8+ Social & web formats
          </span>
        </div>
      </div>
    </section>
  );
}

