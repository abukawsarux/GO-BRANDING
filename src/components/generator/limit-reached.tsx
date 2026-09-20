"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ZapOff, ArrowRight, RotateCcw } from "lucide-react";

interface LimitReachedStateProps {
  onResetQuota: () => void;
}

export function LimitReachedState({ onResetQuota }: LimitReachedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Icon Badge */}
      <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 shadow-xs">
        <ZapOff className="h-10 w-10" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 mb-4">
        Daily Usage Limit Reached
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        You&apos;ve used your 3 free generations for today.
      </h3>

      <p className="mt-3 max-w-md text-sm text-slate-600 text-pretty">
        Free anonymous users receive 3 generations every 24 hours. Create an account
        to get unlimited exports, save custom brand kits, and access high-resolution
        formats.
      </p>

      {/* Primary Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:shadow"
        >
          <span>Create Free Account</span>
          <ArrowRight className="h-4 w-4 text-indigo-400" />
        </Link>
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          View Plans
        </a>
      </div>

      {/* Dev / Test helper */}
      <div className="mt-10 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onResetQuota}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset Free Quota (Demo Testing)</span>
        </button>
      </div>
    </div>
  );
}

