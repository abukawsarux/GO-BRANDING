import React from "react";
import { Navbar } from "@/components/navbar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "How It Works — BrandGen",
  description: "Learn how to automatically brand and resize your images and videos in 3 simple steps.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="py-10 text-center max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Step-by-Step Guide
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How BrandGen Transforms Your Content
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            No design degrees or complex editing timelines. Get publication-ready branded assets in seconds.
          </p>
        </div>
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

