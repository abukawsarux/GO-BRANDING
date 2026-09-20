import React from "react";
import { Navbar } from "@/components/navbar";
import { Features } from "@/components/landing/features";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Features — BrandGen",
  description: "Explore all features of BrandGen: automatic branding, multiple sizes, image & video support, and batch generation.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <div className="py-10 text-center max-w-3xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Platform Capabilities
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Performance Media Branding Features
          </h1>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Built from the ground up for modern businesses, e-commerce sellers, and social media creators.
          </p>
        </div>
        <Features />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

