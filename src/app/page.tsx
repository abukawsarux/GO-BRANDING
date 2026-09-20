"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Generator } from "@/components/generator/generator";
import { Footer } from "@/components/footer";
import { GeneratorState } from "@/types/generator";

export default function HomePage() {
  const [currentState, setCurrentState] = useState<GeneratorState>("empty");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* 1. Header Navigation */}
      <Navbar />

      {/* 2. Main Service within Viewport Area */}
      <main className="flex-1 flex flex-col justify-start py-4 sm:py-6">
        <Generator onStateChange={setCurrentState} />
      </main>

      {/* 3. Compact Bottom Footer */}
      <Footer />
    </div>
  );
}

