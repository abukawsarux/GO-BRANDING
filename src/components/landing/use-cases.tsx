import React from "react";
import {
  ShoppingBag,
  Share2,
  Store,
  Utensils,
  Shirt,
  Building2,
} from "lucide-react";

export function UseCases() {
  const cases = [
    {
      title: "Product Images",
      desc: "Brand catalog photography, packaging, and digital goods for clean marketing presentations.",
      icon: ShoppingBag,
    },
    {
      title: "Social Media",
      desc: "Maintain recognizable brand presence across Instagram reels, stories, and feed posts.",
      icon: Share2,
    },
    {
      title: "E-commerce",
      desc: "Automate watermark protection and consistent sizing for Amazon, Shopify, and Etsy stores.",
      icon: Store,
    },
    {
      title: "Restaurants",
      desc: "Showcase daily menus, culinary specials, and behind-the-scenes kitchen clips.",
      icon: Utensils,
    },
    {
      title: "Fashion & Apparel",
      desc: "High-fashion lookbooks, model shoots, and apparel details branded cleanly.",
      icon: Shirt,
    },
    {
      title: "Local Businesses",
      desc: "Contractors, clinics, and professional services stamping trust onto project photos.",
      icon: Building2,
    },
  ];

  return (
    <section className="py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Versatile Applications
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tailored For Every Industry
          </h2>
          <p className="mt-3 text-base text-slate-600">
            See how small brands and modern digital sellers use BrandGen to maintain identity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

