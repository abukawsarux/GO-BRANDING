"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Palette,
  Layers,
  Clock,
  ArrowRight,
  Copy,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Play,
  Share2,
  CheckCircle2,
  Sliders,
} from "lucide-react";
import { RecentGeneration } from "@/types/generator";
import {
  getRecentGenerations,
  duplicateRecentGeneration,
  deleteRecentGeneration,
} from "@/lib/storage-history";
import { FORMAT_PRESETS, DEFAULT_BRANDING } from "@/lib/generator-constants";
import { getBrandKits } from "@/lib/brand-kit-service";

interface DashboardOverviewProps {
  workspaceName: string;
  brandName: string;
  credits: number;
}

export function DashboardOverview({
  workspaceName,
  brandName,
  credits,
}: DashboardOverviewProps) {
  const router = useRouter();
  const [recentProjects, setRecentProjects] = useState<RecentGeneration[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeBrandKitName, setActiveBrandKitName] = useState("Lumina Co.");

  useEffect(() => {
    setMounted(true);
    const items = getRecentGenerations();
    setRecentProjects(items);

    const kits = getBrandKits();
    if (kits.length > 0) {
      setActiveBrandKitName(kits[0].name);
    }
  }, []);

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = duplicateRecentGeneration(id);
    setRecentProjects(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteRecentGeneration(id);
    setRecentProjects(updated);
  };

  const handleOpenStudio = (item?: RecentGeneration) => {
    if (item) {
      // Navigate to studio
      router.push("/");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Banner with Primary CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>SaaS Content Production Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to {workspaceName}
            </h1>
            <p className="text-sm text-slate-300">
              Transform high-res photos and 4K videos into perfectly branded, multi-format social assets across Instagram, YouTube, TikTok, and Facebook.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/brand"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <Palette className="h-4 w-4 text-indigo-300" />
              <span>Brand Kits</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>+ Create New Project</span>
            </Link>
          </div>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/3 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Projects */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {mounted ? recentProjects.length : 0}
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              {recentProjects.length > 0 ? "Active in storage" : "No saved projects"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Re-open and edit any generation anytime.
          </p>
        </div>

        {/* Metric 2: Active Brand Kit */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Brand
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Palette className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900 truncate">
              {activeBrandKitName || brandName || "LUMINA CO."}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Logo & Watermark sync active</span>
          </div>
        </div>

        {/* Metric 3: Multi-Platform Presets */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Output Formats
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {FORMAT_PRESETS.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">presets ready</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            1:1, 9:16, 16:9, 4:5 + custom ratios
          </p>
        </div>

        {/* Metric 4: Credit Quota */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Export Plan
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {credits}
            </span>
            <span className="text-xs text-slate-500 font-medium">Exports Remaining</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
            <ShieldCheck className="h-3 w-3" />
            <span>High-res downloads enabled</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Two-Column: Active Brand Kit Summary + Supported Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Brand Identity Overview Card (1 col) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Brand Identity</h2>
                  <p className="text-[11px] text-slate-500">Default branding applied to generations</p>
                </div>
              </div>
              <Link
                href="/dashboard/brand"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Edit Kit →
              </Link>
            </div>

            <div className="mt-5 space-y-4">
              {/* Logo Preview */}
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white font-black text-xl shadow-xs shrink-0">
                  M
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {DEFAULT_BRANDING.brandName.text}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    Typography: {DEFAULT_BRANDING.brandName.fontFamily || "Inter"} • Color: #FFFFFF
                  </span>
                </div>
              </div>

              {/* Watermark Preview */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Default Watermark
                </span>
                <p className="text-xs font-semibold text-slate-700 font-mono truncate">
                  {DEFAULT_BRANDING.watermark.text}
                </p>
              </div>

              {/* Color Swatches */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Palette Colors
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-slate-900 shadow-2xs" />
                    <span>#0F172A</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-indigo-600 shadow-2xs" />
                    <span>#6366F1</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-2xs" />
                    <span>#10B981</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100">
            <Link
              href="/dashboard/brand"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-xs font-bold text-slate-800 transition-colors"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Customize Brand Kit Settings</span>
            </Link>
          </div>
        </div>

        {/* Multi-Format Matrix (2 cols) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Share2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Supported Output Formats</h2>
                  <p className="text-[11px] text-slate-500">Simultaneous export presets ready for one-click generation</p>
                </div>
              </div>
              <Link
                href="/"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Launch Studio →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FORMAT_PRESETS.slice(0, 6).map((preset) => (
                <Link
                  key={preset.id}
                  href="/"
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {preset.name}
                      </span>
                      <span className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 font-mono">
                        {preset.aspectRatio}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {preset.width} × {preset.height} px
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-semibold text-slate-600">
                    <span className="capitalize text-slate-400">{preset.category}</span>
                    <span className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Use Preset <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Independent framing & zoom controls for every aspect ratio</span>
            </span>
            <Link
              href="/"
              className="font-bold text-indigo-600 hover:text-indigo-700"
            >
              Explore all formats →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Studio Projects
            </h2>
            <p className="text-xs text-slate-500">
              Resume editing or duplicate any recent media branding project
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Project</span>
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No Projects Saved Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Upload your first image or video in the Studio to automatically create and preview your branded assets.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
            >
              Open Studio Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentProjects.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div
                    onClick={() => router.push("/")}
                    className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 cursor-pointer mb-2.5"
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.mediaName}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute top-2 left-2 z-10 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
                      {item.previewRatio || "SQUARE"}
                    </div>
                    <div className="absolute top-2 right-2 z-10 rounded-md bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                      {item.formatsCount} formats
                    </div>
                    {item.mediaType === "video" && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white">
                          <Play className="h-3.5 w-3.5 fill-white ml-0.5 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-2.5">
                    <h4
                      onClick={() => router.push("/")}
                      className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                      title={item.mediaName}
                    >
                      {item.mediaName}
                    </h4>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                      <span>{formattedDate}</span>
                      <span className="font-semibold text-slate-700 truncate max-w-[85px]">
                        {item.branding?.brandName?.text || "LUMINA CO."}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white py-1.5 text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
                    >
                      <span>Open in Studio</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(item.id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

