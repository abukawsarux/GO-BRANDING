"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Sparkles, Layers } from "lucide-react";

interface ProcessingStateProps {
  onComplete: () => void;
  formatCount: number;
}

const STEPS = [
  { id: 1, label: "Analyzing source media & dimensions", duration: 700 },
  { id: 2, label: "Applying logo & custom watermark", duration: 900 },
  { id: 3, label: "Rendering multi-platform aspect ratios", duration: 900 },
  { id: 4, label: "Optimizing export files for download", duration: 600 },
];

export function ProcessingState({ onComplete, formatCount }: ProcessingStateProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgress(40);
    }, 700);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgress(75);
    }, 1600);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgress(95);
    }, 2500);

    const timer4 = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {/* Animated icon badge */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm animate-pulse">
          <Sparkles className="h-9 w-9 text-indigo-600" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white shadow-md">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        Generating Your Branded Media...
      </h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">
        Creating {formatCount} high-resolution formats with your logo and watermark
      </p>

      {/* Progress Bar */}
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Processing</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-left">
        <div className="space-y-3.5">
          {STEPS.map((step, idx) => {
            const isFinished = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={step.id} className="flex items-center gap-3">
                {isFinished ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-300 shrink-0" />
                )}

                <span
                  className={`text-xs font-medium ${
                    isCurrent
                      ? "text-slate-900 font-semibold"
                      : isFinished
                      ? "text-slate-700 line-through opacity-70"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

