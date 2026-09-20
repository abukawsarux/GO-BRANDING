import React from "react";
import { Navbar } from "@/components/navbar";
import { UseCases } from "@/components/landing/use-cases";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Use Cases — BrandGen",
  description: "See how small businesses, e-commerce stores, restaurants, and agencies use BrandGen.",
};

export default function UseCasesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="py-10 text-center max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Industry Solutions
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed For Real Businesses
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Whether you sell apparel, run a local restaurant, or manage product catalogs, BrandGen gives you instant brand recognition.
          </p>
        </div>
        <UseCases />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

