"use client";

import React from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onReset: () => void;
}

export function ErrorState({
  message = "Something went wrong while generating your media. Please try again.",
  onRetry,
  onReset,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        Generation Failed
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-600 text-pretty">
        {message}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Upload Another File</span>
        </button>
      </div>
    </div>
  );
}

