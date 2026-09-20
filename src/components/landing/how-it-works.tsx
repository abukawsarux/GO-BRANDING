import React from "react";
import { Sliders, Upload, Layers } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Add Your Brand",
      desc: "Upload your business logo, customize your brand name, and position your watermark with flexible opacity and sizing.",
      icon: Sliders,
    },
    {
      num: "02",
      title: "Upload Your Content",
      desc: "Drop in your photos or videos. We support JPG, PNG, WebP, MP4, MOV, and WebM up to 50MB.",
      icon: Upload,
    },
    {
      num: "03",
      title: "Generate Everywhere",
      desc: "Select all social and web dimensions you need. Export ready-to-publish branded media in one click.",
      icon: Layers,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-slate-200/80 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Effortless Workflow
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From raw media to polished brand assets across 8+ platforms in under 30 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-black text-slate-200">
                    {step.num}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

