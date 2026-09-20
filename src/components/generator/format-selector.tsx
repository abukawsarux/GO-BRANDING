"use client";

import React, { useState } from "react";
import { FormatPreset } from "@/types/generator";
import { FORMAT_PRESETS } from "@/lib/generator-constants";
import { Check, SlidersHorizontal, Plus } from "lucide-react";

interface FormatSelectorProps {
  selectedPresetIds: string[];
  onChangeSelection: (ids: string[]) => void;
  customSize: { width: number; height: number };
  onChangeCustomSize: (size: { width: number; height: number }) => void;
  customSizeEnabled: boolean;
  onToggleCustomSize: (enabled: boolean) => void;
}

export function FormatSelector({
  selectedPresetIds,
  onChangeSelection,
  customSize,
  onChangeCustomSize,
  customSizeEnabled,
  onToggleCustomSize,
}: FormatSelectorProps) {
  const togglePreset = (id: string) => {
    if (selectedPresetIds.includes(id)) {
      if (selectedPresetIds.length > 1 || customSizeEnabled) {
        onChangeSelection(selectedPresetIds.filter((item) => item !== id));
      }
    } else {
      onChangeSelection([...selectedPresetIds, id]);
    }
  };

  const selectAll = () => {
    onChangeSelection(FORMAT_PRESETS.map((p) => p.id));
  };

  const selectPopular = () => {
    onChangeSelection(["ig-square", "ig-story", "fb-post", "yt-thumb"]);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-semibold text-slate-900">
            Select Output Formats
          </h4>
          <p className="text-xs text-slate-500">
            Choose which platform sizes you want to generate (multi-select)
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectPopular}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            Popular
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
          >
            Select All
          </button>
        </div>
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FORMAT_PRESETS.map((preset) => {
          const isSelected = selectedPresetIds.includes(preset.id);
          return (
            <div
              key={preset.id}
              onClick={() => togglePreset(preset.id)}
              className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-900">
                    {preset.name}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono">
                    {preset.width} × {preset.height}
                  </span>
                  <span className="rounded bg-slate-100 px-1 py-0.5 text-[10px] font-medium text-slate-600">
                    {preset.aspectRatio}
                  </span>
                </div>
              </div>

              {/* Checkbox indicator */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Size Accordion */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleCustomSize(!customSizeEnabled)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Custom Output Dimensions</span>
            {customSizeEnabled && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            )}
          </button>
          <button
            type="button"
            onClick={() => onToggleCustomSize(!customSizeEnabled)}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            {customSizeEnabled ? "Disable" : "+ Add Custom"}
          </button>
        </div>

        {customSizeEnabled && (
          <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Width:</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={customSize.width}
                onChange={(e) =>
                  onChangeCustomSize({
                    ...customSize,
                    width: Number(e.target.value),
                  })
                }
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 font-mono"
              />
              <span className="text-xs text-slate-400">px</span>
            </div>

            <span className="text-slate-400">×</span>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Height:</label>
              <input
                type="number"
                min="200"
                max="3840"
                value={customSize.height}
                onChange={(e) =>
                  onChangeCustomSize({
                    ...customSize,
                    height: Number(e.target.value),
                  })
                }
                className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-900 font-mono"
              />
              <span className="text-xs text-slate-400">px</span>
            </div>

            <span className="text-xs text-slate-500 ml-auto font-mono">
              Custom ({customSize.width} × {customSize.height})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

