"use client";

import React, { useState } from "react";
import { RecentGeneration } from "@/types/generator";
import {
  Clock,
  Trash2,
  ArrowRight,
  MoreVertical,
  Play,
  Video,
  FolderClock,
} from "lucide-react";

interface RecentHistoryProps {
  items: RecentGeneration[];
  onSelect: (item: RecentGeneration) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function RecentHistory({
  items,
  onSelect,
  onDelete,
  onClearAll,
}: RecentHistoryProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
          <FolderClock className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Recent Generations Yet</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          When you customize and generate media, your recent edits and projects will be automatically saved here in your browser.
        </p>
      </div>
    );
  }

  // Format ratio badge label matching screenshot
  const getBadgeLabel = (item: RecentGeneration) => {
    if (item.mediaName.includes("headphone") || item.mediaName.includes("product")) return "PRODUCT";
    if (item.previewRatio === "square") return "SQUARE";
    if (item.previewRatio === "landscape") return "LANDSCAPE";
    if (item.previewRatio === "story") return "STORY";
    if (item.previewRatio === "portrait") return "PORTRAIT";
    return "CUSTOM";
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Recent Edits & Generations
            </h3>
            <p className="text-[11px] text-slate-500">
              Saved automatically in your local browser storage ({items.length}{" "}
              {items.length === 1 ? "project" : "projects"})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear history</span>
        </button>
      </div>

      {/* Grid of 5 Cards matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {items.map((item) => {
          const formattedDate = new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          const badgeLabel = getBadgeLabel(item);

          return (
            <div
              key={item.id}
              className="group relative flex flex-col justify-between overflow-visible rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs hover:border-indigo-300 hover:shadow-md transition-all"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => onSelect(item)}
                className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-950 cursor-pointer mb-2.5 group"
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.mediaName}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to a high quality fallback image
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80";
                  }}
                />

                {/* Overlaid Badges matching the design reference */}
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white backdrop-blur-xs">
                  <span>{badgeLabel}</span>
                </div>

                <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-md bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  <span>{item.formatsCount} formats</span>
                </div>

                {/* Video Play Overlay Indicator */}
                {item.mediaType === "video" && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-xs group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-white ml-0.5 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="mb-3">
                <h4
                  onClick={() => onSelect(item)}
                  className="text-xs font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                  title={item.mediaName}
                >
                  {item.mediaName}
                </h4>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{formattedDate}</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[85px]">
                    {item.branding.brandName.text || "LUMINA CO."}
                  </span>
                </div>
              </div>

              {/* Actions: Re-open in Studio + Three Dots Menu */}
              <div className="relative flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white py-1.5 text-xs font-semibold text-indigo-700 transition-colors cursor-pointer"
                >
                  <span>Re-open in Studio</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === item.id ? null : item.id);
                    }}
                    className="p-1.5 rounded-xl border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Options"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === item.id && (
                    <div
                      className="absolute right-0 bottom-full mb-1 z-30 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onSelect(item);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        <ArrowRight className="h-3 w-3 text-indigo-600" />
                        <span>Edit project</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenuId(null);
                          onDelete(item.id);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
