import React from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Perfect for quick branding and trying the tool out.",
      features: [
        "3 generations every day",
        "No account required",
        "All 8 platform aspect ratios",
        "JPG & PNG exports",
        "Standard resolution",
      ],
      cta: "Start Free",
      href: "#generator",
      popular: false,
    },
    {
      name: "Starter",
      price: "$19",
      period: "per month",
      desc: "Ideal for growing e-commerce sellers and local shops.",
      features: [
        "Unlimited generations",
        "Save 5 Brand Kit profiles",
        "Full 4K Ultra HD exports",
        "MP4 video watermarking",
        "Custom dimension exports",
        "Priority processing queue",
      ],
      cta: "Get Started",
      href: "/signup",
      popular: true,
    },
    {
      name: "Business",
      price: "$49",
      period: "per month",
      desc: "For digital agencies and multi-brand operators.",
      features: [
        "Unlimited generations & team seats",
        "Unlimited Brand Kits",
        "Batch multi-file ZIP downloads",
        "Video 4K 60fps rendering",
        "Dedicated API access",
        "24/7 Priority support",
      ],
      cta: "Contact Sales",
      href: "/signup",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Transparent Plans
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Simple, Predictable Pricing
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Generate 3 times daily for free. Upgrade whenever your business is ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-3xl p-8 transition-all ${
                plan.popular
                  ? "border-2 border-indigo-600 bg-white shadow-xl shadow-indigo-100 scale-105 z-10"
                  : "border border-slate-200 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-bold text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-2 text-xs text-slate-500 min-h-[32px]">
                  {plan.desc}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="mt-8 space-y-3.5 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link
                  href={plan.href}
                  className={`block w-full rounded-xl py-3 text-center text-sm font-bold transition-all ${
                    plan.popular
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

