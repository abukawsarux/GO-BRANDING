import React from "react";
import { Navbar } from "@/components/navbar";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Pricing Plans — BrandGen",
  description: "Transparent pricing for BrandGen. Start for free with 3 daily generations.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="py-10 text-center max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Plans & Upgrades
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Start completely free without an account. Upgrade when your content needs scale.
          </p>
        </div>
        <Pricing />
        <FAQ />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
