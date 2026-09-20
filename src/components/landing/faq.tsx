"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do I have to create an account or enter a credit card?",
      a: "No! You can use the generator right now on the homepage without signing up or entering any payment information. You get 3 free generations every single day.",
    },
    {
      q: "Which file formats are supported?",
      a: "We support photography in JPG, PNG, and WebP, as well as video content in MP4, MOV, and WebM format up to 50MB.",
    },
    {
      q: "Can I use my own logo and custom watermark?",
      a: "Yes. You can upload any transparent PNG, SVG, or JPG logo, set its size, position (Top Left, Top Right, Center, Bottom Left, Bottom Right), and control the opacity to make it look subtle or prominent.",
    },
    {
      q: "Can I download multiple dimensions simultaneously?",
      a: "Yes. Select all the platform presets you need (Instagram Post, Instagram Story, Facebook Post, YouTube Thumbnail, etc.) and hit Generate. You can download each format individually or click Download All.",
    },
    {
      q: "Can I use generated media for commercial purposes?",
      a: "Absolutely. All media generated through BrandGen is 100% yours to publish on social channels, client stores, paid advertisements, and marketplaces.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50/50 border-t border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Got Questions?
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Clear answers to help you start branding your media in seconds.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

