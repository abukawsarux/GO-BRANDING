import React from "react";
import {
  Sparkles,
  Film,
  Maximize,
  Shield,
  Layers,
  DownloadCloud,
} from "lucide-react";

export function Features() {
  const featureList = [
    {
      title: "Automatic Branding",
      desc: "Smart placement of your company logo and typography without manual alignment hassles.",
      icon: Sparkles,
    },
    {
      title: "Image & Video",
      desc: "Seamless support for both static high-res photography and motion video content.",
      icon: Film,
    },
    {
      title: "Multiple Sizes",
      desc: "Pre-configured pixel-perfect presets for Instagram, Facebook, YouTube, and website banners.",
      icon: Maximize,
    },
    {
      title: "Watermark",
      desc: "Protect your intellectual property with subtle, customizable copyright text and opacity.",
      icon: Shield,
    },
    {
      title: "Batch Generation",
      desc: "Select 8+ social formats simultaneously and process them in a single generation cycle.",
      icon: Layers,
    },
    {
      title: "Easy Download",
      desc: "Save individual formats instantly or trigger Download All to receive your packaged bundle.",
      icon: DownloadCloud,
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Engineered For Speed
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Features Built For Modern Creators
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to turn standard product media into consistent branded assets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-slate-200/80 p-7 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-indigo-600 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

