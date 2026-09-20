import React from "react";
import { Navbar } from "@/components/navbar";
import { FAQ } from "@/components/landing/faq";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Frequently Asked Questions — BrandGen",
  description: "Find answers to common questions about BrandGen, formats, limits, and branding.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="py-10 text-center max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Help & Resources
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need to know about the product, file formats, and daily limits.
          </p>
        </div>
        <FAQ />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

