"use client";

import React, { useState } from "react";
import {
  GeneratorState,
  MediaFile,
  BrandingSettings,
  FormatPreset,
  MediaFrameTransform,
} from "@/types/generator";
import {
  DEFAULT_BRANDING,
  FORMAT_PRESETS,
  DEFAULT_SAMPLE_IMAGE,
  calculateAspectRatio,
} from "@/lib/generator-constants";
import { UploadZone } from "./upload-zone";
import { MediaPreview } from "./media-preview";
import { BrandingControls } from "./branding-controls";
import { FormatSelector } from "./format-selector";
import { ProcessingState } from "./processing-state";
import { ResultCard } from "./result-card";
import { LimitReachedState } from "./limit-reached";
import { ErrorState } from "./error-state";
import {
  Sparkles,
  ArrowRight,
  FileCheck,
  X,
  Sliders,
  Maximize2,
  RefreshCw,
  Zap,
  Clock,
  Check,
  Plus,
  LayoutGrid,
  Pencil,
  Film,
} from "lucide-react";
import { RecentGeneration } from "@/types/generator";
import {
  getRecentGenerations,
  saveRecentGeneration,
  deleteRecentGeneration,
  duplicateRecentGeneration,
  clearRecentGenerations,
  createThumbnailDataUrl,
} from "@/lib/storage-history";
import { RecentHistory } from "./recent-history";

const CUSTOM_PRESETS_STORAGE_KEY = "go_branding_custom_presets";

function loadSavedCustomPresets(): FormatPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load custom presets:", e);
    return [];
  }
}

function persistCustomPresets(presets: FormatPreset[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error("Failed to save custom presets:", e);
  }
}

interface GeneratorProps {
  onStateChange?: (state: GeneratorState) => void;
}

export function Generator({ onStateChange }: GeneratorProps = {}) {
  // Generator State
  const [state, setStateRaw] = useState<GeneratorState>("empty");

  const setState = (newState: GeneratorState) => {
    setStateRaw(newState);
    onStateChange?.(newState);
  };

  const [media, setMedia] = useState<MediaFile | null>(null);
  const [branding, setBranding] = useState<BrandingSettings>(DEFAULT_BRANDING);
  const [selectedPresetIds, setSelectedPresetIds] = useState<string[]>([
    "ig-square",
    "ig-story",
    "fb-post",
    "yt-thumb",
  ]);
  const [activePresetId, setActivePresetId] = useState<string>("ig-square");
  const [presetTransforms, setPresetTransforms] = useState<Record<string, MediaFrameTransform>>({
    "ig-square": { zoom: 1.0, panX: 0, panY: 0, focalPosition: "center" },
    "ig-story": { zoom: 1.0, panX: 0, panY: 0, focalPosition: "center" },
    "fb-post": { zoom: 1.0, panX: 0, panY: 0, focalPosition: "center" },
    "yt-thumb": { zoom: 1.0, panX: 0, panY: 0, focalPosition: "center" },
  });

  const [customPresets, setCustomPresets] = useState<FormatPreset[]>([]);
  const [customSize, setCustomSize] = useState({ width: 1080, height: 1920 });
  const [customSizeName, setCustomSizeName] = useState("");
  const [customSizeEnabled, setCustomSizeEnabled] = useState(false);
  const [customAddedFeedback, setCustomAddedFeedback] = useState(false);

  const [freeGenerations, setFreeGenerations] = useState<number>(3);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [previewRatio, setPreviewRatio] = useState<"square" | "portrait" | "story" | "landscape">("square");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>("");

  // Local Storage Recent Generations & Custom Formats
  const [recentItems, setRecentItems] = useState<RecentGeneration[]>([]);
  const [showRecentModal, setShowRecentModal] = useState(false);

  React.useEffect(() => {
    setRecentItems(getRecentGenerations());
    const saved = loadSavedCustomPresets();
    if (saved && saved.length > 0) {
      setCustomPresets(saved);
      setSelectedPresetIds((prev) => {
        const toAdd = saved.map((p) => p.id).filter((id) => !prev.includes(id));
        return [...prev, ...toAdd];
      });
    }
  }, []);

  // Combined list of all available presets (built-in + user-saved custom formats)
  const allPresets: FormatPreset[] = [...FORMAT_PRESETS, ...customPresets];

  // Get active selected preset objects
  const activePresets: FormatPreset[] = allPresets.filter((p) =>
    selectedPresetIds.includes(p.id)
  );

  // Current active preset being framed
  const currentPreset =
    activePresets.find((p) => p.id === activePresetId) ||
    activePresets[0] ||
    FORMAT_PRESETS[0];

  const currentTransform = presetTransforms[currentPreset.id] || {
    zoom: 1.0,
    panX: 0,
    panY: 0,
    focalPosition: "center",
  };

  // Handle per-preset transform change
  const handleTransformChange = (newTransform: MediaFrameTransform) => {
    setPresetTransforms((prev) => ({
      ...prev,
      [currentPreset.id]: newTransform,
    }));
  };

  // Copy current preset framing to all other formats
  const handleApplyFramingToAll = () => {
    const nextMap: Record<string, MediaFrameTransform> = {};
    for (const p of allPresets) {
      nextMap[p.id] = { ...currentTransform };
    }
    setPresetTransforms(nextMap);
  };

  // Add custom format preset (persists in localStorage until removed)
  const handleAddCustomPreset = () => {
    const w = Math.max(100, Math.min(8000, Number(customSize.width) || 1080));
    const h = Math.max(100, Math.min(8000, Number(customSize.height) || 1920));
    const ratio = calculateAspectRatio(w, h);
    const finalName = customSizeName.trim() || `Custom ${w}×${h}`;

    const newPreset: FormatPreset = {
      id: `custom-${Date.now()}`,
      name: finalName,
      category: "Custom",
      width: w,
      height: h,
      aspectRatio: ratio,
      isCustom: true,
    };

    const updated = [...customPresets, newPreset];
    setCustomPresets(updated);
    persistCustomPresets(updated);

    // Automatically check / tick in Formats
    setSelectedPresetIds((prev) => [...prev, newPreset.id]);

    // Initial framing
    setPresetTransforms((prev) => ({
      ...prev,
      [newPreset.id]: { ...currentTransform },
    }));

    // Switch framing preview to this new format
    setActivePresetId(newPreset.id);

    // Reset name field for next entry
    setCustomSizeName("");

    // Show feedback
    setCustomAddedFeedback(true);
    setTimeout(() => setCustomAddedFeedback(false), 3000);
  };

  // Delete / remove custom format preset
  const handleDeleteCustomPreset = (presetId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = customPresets.filter((p) => p.id !== presetId);
    setCustomPresets(updated);
    persistCustomPresets(updated);

    setSelectedPresetIds((prev) => prev.filter((id) => id !== presetId));

    if (activePresetId === presetId) {
      const fallback = FORMAT_PRESETS[0];
      if (fallback) setActivePresetId(fallback.id);
    }
  };

  // Handle File Selection
  const handleFileSelected = (selectedMedia: MediaFile) => {
    setMedia(selectedMedia);
    setState("branding_editor");
  };

  // Trigger Generation
  const handleStartGeneration = async () => {
    if (freeGenerations <= 0) {
      setState("limit_reached");
      return;
    }

    // Auto-save to LocalStorage Recent History with per-preset framing
    if (media) {
      try {
        const thumb = await createThumbnailDataUrl(
          media.previewUrl,
          branding,
          currentTransform,
          media.type,
          media.thumbnailUrl
        );
        const genItem: RecentGeneration = {
          id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          createdAt: new Date().toISOString(),
          mediaName: media.name,
          mediaType: media.type,
          thumbnailUrl: thumb,
          branding,
          transform: currentTransform,
          presetTransforms,
          previewRatio,
          formatsCount: activePresets.length,
          selectedPresetIds,
        };
        saveRecentGeneration(genItem);
        setRecentItems(getRecentGenerations());
      } catch (err) {
        console.warn("Could not save to recent history:", err);
      }
    }

    // Deduct credit
    setFreeGenerations((prev) => Math.max(0, prev - 1));
    setState("generating");
  };

  // Load an item from Recent History
  const handleSelectRecent = (item: RecentGeneration) => {
    setMedia({
      name: item.mediaName,
      size: 1250000,
      type: item.mediaType,
      previewUrl: item.thumbnailUrl,
    });
    setBranding(item.branding);
    if (item.presetTransforms) {
      setPresetTransforms(item.presetTransforms);
    } else if (item.transform) {
      const fallbackMap: Record<string, MediaFrameTransform> = {};
      for (const p of FORMAT_PRESETS) {
        fallbackMap[p.id] = { ...item.transform };
      }
      setPresetTransforms(fallbackMap);
    }
    setPreviewRatio(item.previewRatio || "square");
    if (item.selectedPresetIds && item.selectedPresetIds.length > 0) {
      setSelectedPresetIds(item.selectedPresetIds);
      setActivePresetId(item.selectedPresetIds[0]);
    }
    setShowRecentModal(false);
    setState("branding_editor");
  };

  const handleDuplicateRecent = (item: RecentGeneration) => {
    const updated = duplicateRecentGeneration(item.id);
    setRecentItems(updated);
  };

  const handleDeleteRecent = (id: string) => {
    const updated = deleteRecentGeneration(id);
    setRecentItems(updated);
  };

  const handleClearAllRecent = () => {
    clearRecentGenerations();
    setRecentItems([]);
  };

  // Reset to initial
  const handleReset = () => {
    setMedia(null);
    setState("empty");
  };

  const [activePlatformFilter, setActivePlatformFilter] = useState<string>("All");

  const handleUpdateThumbnail = (thumbUrl: string, source: "auto" | "captured" | "custom") => {
    if (!media) return;
    setMedia({
      ...media,
      thumbnailUrl: thumbUrl,
      thumbnailSource: source,
    });
  };

  return (
    <div id="generator" className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-2">
      {/* Top Status & Preview Size Filter Bar matching reference image */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-5 py-2.5 text-xs text-slate-600 shadow-2xs">
        {/* Left: Active State & Recent History */}
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Active State:</span>
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="capitalize font-semibold">
                {state === "empty"
                  ? "Ready"
                  : state === "branding_editor"
                  ? "Branding Editor"
                  : state.replace(/_/g, " ")}
              </span>
            </span>
          </div>

          <span className="text-slate-300">|</span>

          <button
            type="button"
            onClick={() => setShowRecentModal(true)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            title="Click to view and load your recent saved projects"
          >
            <Clock className="h-4 w-4 text-slate-700" />
            <span className="font-bold text-slate-800">Recent History</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white shadow-2xs">
              {recentItems.length}
            </span>
          </button>
        </div>

        {/* Right: Preview size category buttons matching mockup */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 mr-1">Preview size:</span>
          {["All", "Instagram", "YouTube", "Facebook", "TikTok", "Web", "Custom"].map((platform) => {
            const isSelected = activePlatformFilter === platform;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => {
                  const next = isSelected && platform !== "All" ? "All" : platform;
                  setActivePlatformFilter(next);

                  if (next === "Instagram") {
                    setPreviewRatio("square");
                    const found = allPresets.find(
                      (p) => p.category?.toLowerCase() === "instagram" || p.name.toLowerCase().includes("instagram")
                    );
                    if (found) setActivePresetId(found.id);
                  } else if (next === "YouTube") {
                    setPreviewRatio("landscape");
                    const found = allPresets.find(
                      (p) => p.category?.toLowerCase() === "youtube" || p.name.toLowerCase().includes("youtube")
                    );
                    if (found) setActivePresetId(found.id);
                  } else if (next === "TikTok") {
                    setPreviewRatio("story");
                    const found = allPresets.find(
                      (p) => p.category?.toLowerCase() === "tiktok" || p.name.toLowerCase().includes("tiktok")
                    );
                    if (found) setActivePresetId(found.id);
                  } else if (next === "Facebook") {
                    setPreviewRatio("portrait");
                    const found = allPresets.find(
                      (p) => p.category?.toLowerCase() === "facebook" || p.name.toLowerCase().includes("facebook")
                    );
                    if (found) setActivePresetId(found.id);
                  } else if (next === "Web") {
                    setPreviewRatio("landscape");
                    const found = allPresets.find(
                      (p) => p.category?.toLowerCase() === "web" || p.name.toLowerCase().includes("website")
                    );
                    if (found) setActivePresetId(found.id);
                  } else if (next === "Custom") {
                    const found = allPresets.find((p) => p.isCustom);
                    if (found) setActivePresetId(found.id);
                  }
                }}
                className={`rounded-xl px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-slate-950 text-white font-semibold shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                }`}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* State 1: EMPTY VIEW - Seamless layout matching reference mockup */}
      {state === "empty" && (
        <div className="space-y-6">
          {activePlatformFilter !== "All" && (
            <div className="flex items-center justify-between rounded-2xl bg-indigo-50/80 border border-indigo-100 px-4 py-2.5 text-xs text-indigo-700 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>
                  Target Platform Filter: <strong className="font-bold text-indigo-900">{activePlatformFilter}</strong>. Upload an image or video to focus framing on {activePlatformFilter}.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePlatformFilter("All")}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-900 underline cursor-pointer"
              >
                Show All Platforms
              </button>
            </div>
          )}
          <UploadZone
            onFileSelected={handleFileSelected}
            generationsRemaining={freeGenerations}
          />
          {recentItems.length > 0 && (
            <RecentHistory
              items={recentItems}
              onSelect={handleSelectRecent}
              onDuplicate={handleDuplicateRecent}
              onDelete={handleDeleteRecent}
              onClearAll={handleClearAllRecent}
            />
          )}
        </div>
      )}

      {/* State 2, 3, 4, etc. Active Workspace in white card */}
      {state !== "empty" && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-100/70">

        {/* State 2, 3, 4: FILE SELECTED / BRANDING EDITOR / FORMAT SELECTION */}
        {(state === "file_selected" ||
          state === "branding_editor" ||
          state === "format_selection") &&
          media && (
            <div className="space-y-5">
              {/* Media Header Card matching reference mockup */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Square Media Thumbnail */}
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    {media.type === "video" ? (
                      media.thumbnailUrl ? (
                        <img
                          src={media.thumbnailUrl}
                          alt={media.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-900 text-white">
                          <Film className="h-5 w-5" />
                        </div>
                      )
                    ) : (
                      <img
                        src={media.previewUrl}
                        alt={media.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Filename with inline edit & metadata */}
                  <div className="min-w-0 flex-1">
                    {isEditingName ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (nameInput.trim() && media) {
                                setMedia({ ...media, name: nameInput.trim() });
                              }
                              setIsEditingName(false);
                            } else if (e.key === "Escape") {
                              setIsEditingName(false);
                            }
                          }}
                          autoFocus
                          className="rounded-lg border border-indigo-400 bg-indigo-50/40 px-2 py-0.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (nameInput.trim() && media) {
                              setMedia({ ...media, name: nameInput.trim() });
                            }
                            setIsEditingName(false);
                          }}
                          className="rounded-md bg-indigo-600 p-1 text-white hover:bg-indigo-700 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {media.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setNameInput(media.name);
                            setIsEditingName(true);
                          }}
                          title="Edit file name"
                          className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 font-medium">
                      {(media.size / (1024 * 1024)).toFixed(2)} MB • {media.width || 1080} × {media.height || 1350} • {media.type === "video" ? "MP4" : (media.name.split('.').pop() || "JPG").toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Change File Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Change File
                  </button>
                </div>
              </div>

              {/* 2-Column Editor: Preview & Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Large Live Media Preview */}
                <div className="lg:col-span-7">
                  <MediaPreview
                    media={media}
                    branding={branding}
                    activePreset={currentPreset}
                    availablePresets={activePresets}
                    allAvailablePresets={allPresets}
                    onSelectPreset={(preset) => {
                      setActivePresetId(preset.id);
                      if (preset.aspectRatio === "1:1") setPreviewRatio("square");
                      else if (preset.aspectRatio === "4:5") setPreviewRatio("portrait");
                      else if (preset.aspectRatio === "9:16") setPreviewRatio("story");
                      else setPreviewRatio("landscape");
                    }}
                    onAddPreset={(preset) => {
                      if (!selectedPresetIds.includes(preset.id)) {
                        setSelectedPresetIds([...selectedPresetIds, preset.id]);
                      }
                      setActivePresetId(preset.id);
                      if (preset.aspectRatio === "1:1") setPreviewRatio("square");
                      else if (preset.aspectRatio === "4:5") setPreviewRatio("portrait");
                      else if (preset.aspectRatio === "9:16") setPreviewRatio("story");
                      else setPreviewRatio("landscape");
                    }}
                    onRemovePreset={(presetId) => {
                      if (selectedPresetIds.length > 1) {
                        const updated = selectedPresetIds.filter((id) => id !== presetId);
                        setSelectedPresetIds(updated);
                        if (activePresetId === presetId) {
                          setActivePresetId(updated[0]);
                        }
                      }
                    }}
                    previewRatio={previewRatio}
                    transform={currentTransform}
                    onChangeTransform={handleTransformChange}
                    onApplyToAll={handleApplyFramingToAll}
                    onUpdateThumbnail={handleUpdateThumbnail}
                  />
                </div>

                {/* Right: Branding Controls */}
                <div className="lg:col-span-5">
                  <BrandingControls
                    branding={branding}
                    onChange={setBranding}
                    mediaType={media.type}
                    thumbnailUrl={media.thumbnailUrl}
                    thumbnailSource={media.thumbnailSource}
                    onUpdateThumbnail={handleUpdateThumbnail}
                  />
                </div>
              </div>

              {/* Compact Unified Bottom Bar: Output Formats & Generate Action */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                  {/* Output Formats Header & Multi-select chips */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2.5 mr-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <LayoutGrid className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Formats</h4>
                        <p className="text-[11px] text-slate-500">Choose the best format for your content</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Standard Built-in Presets */}
                      {FORMAT_PRESETS.map((preset) => {
                        const isSelected = selectedPresetIds.includes(preset.id);
                        const isActive = isSelected && currentPreset.id === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              if (!isSelected) {
                                setSelectedPresetIds([...selectedPresetIds, preset.id]);
                                setActivePresetId(preset.id);
                              } else if (!isActive) {
                                setActivePresetId(preset.id);
                              } else if (selectedPresetIds.length > 1) {
                                const updated = selectedPresetIds.filter((id) => id !== preset.id);
                                setSelectedPresetIds(updated);
                                setActivePresetId(updated[0]);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                              isActive
                                ? "bg-slate-950 border-indigo-500 text-white ring-2 ring-indigo-500/50 shadow-sm"
                                : isSelected
                                ? "bg-slate-900 border-slate-900 text-white shadow-2xs hover:bg-slate-800"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            <span className={isSelected ? "text-indigo-400 font-bold" : "text-slate-400 font-bold"}>
                              {isSelected ? "✓" : "+"}
                            </span>
                            <span>{preset.name}</span>
                            <span
                              className={`text-[10px] font-mono ${
                                isSelected ? "text-slate-400" : "text-slate-400"
                              }`}
                            >
                              ({preset.aspectRatio})
                            </span>
                            {isActive && (
                              <span className="ml-0.5 rounded bg-indigo-600 px-1 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                                Active
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {/* User Saved Custom Presets (Stay until deleted) */}
                      {customPresets.map((preset) => {
                        const isSelected = selectedPresetIds.includes(preset.id);
                        const isActive = isSelected && currentPreset.id === preset.id;
                        return (
                          <div
                            key={preset.id}
                            className={`group inline-flex items-center rounded-xl text-xs font-semibold transition-all border shadow-2xs overflow-hidden ${
                              isActive
                                ? "bg-slate-950 border-indigo-500 text-white ring-2 ring-indigo-500/50 shadow-sm"
                                : isSelected
                                ? "bg-slate-900 border-slate-900 text-white shadow-2xs hover:bg-slate-800"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                            }`}
                          >
                            {/* Toggle selection or activate */}
                            <button
                              type="button"
                              onClick={() => {
                                if (!isSelected) {
                                  setSelectedPresetIds([...selectedPresetIds, preset.id]);
                                  setActivePresetId(preset.id);
                                } else if (!isActive) {
                                  setActivePresetId(preset.id);
                                } else if (selectedPresetIds.length > 1) {
                                  const updated = selectedPresetIds.filter((id) => id !== preset.id);
                                  setSelectedPresetIds(updated);
                                  setActivePresetId(updated[0]);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 cursor-pointer"
                            >
                              <span className={isSelected ? "text-indigo-400 font-bold" : "text-slate-400 font-bold"}>
                                {isSelected ? "✓" : "+"}
                              </span>
                              <span>{preset.name}</span>
                              <span className="text-[10px] font-mono text-slate-400">
                                ({preset.aspectRatio})
                              </span>
                              {isActive && (
                                <span className="ml-0.5 rounded bg-indigo-600 px-1 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                                  Active
                                </span>
                              )}
                            </button>

                            {/* Delete/remove custom format */}
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomPreset(preset.id, e)}
                              title={`Remove "${preset.name}" from formats`}
                              className={`px-2 py-1.5 transition-colors cursor-pointer border-l ${
                                isSelected
                                  ? "border-slate-800 text-slate-400 hover:bg-rose-500 hover:text-white"
                                  : "border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              }`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Toggle Custom Dimensions Bar */}
                      <button
                        type="button"
                        onClick={() => setCustomSizeEnabled(!customSizeEnabled)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                          customSizeEnabled
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                            : "border-dashed border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-600"
                        }`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Custom</span>
                      </button>

                      {/* Quick All / Popular buttons */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 ml-1">
                        <button
                          type="button"
                          onClick={() => setSelectedPresetIds(allPresets.map((p) => p.id))}
                          className="hover:text-slate-900 underline font-medium cursor-pointer"
                        >
                          All Formats
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPresetIds(["ig-square", "ig-story", "fb-post", "yt-thumb"])
                          }
                          className="hover:text-slate-900 underline font-medium cursor-pointer"
                        >
                          Popular
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Generate CTA */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-slate-900">
                        {activePresets.length} {activePresets.length === 1 ? "format" : "formats"} ready
                      </p>
                      <p className="text-[10px] text-emerald-600 font-semibold">
                        {freeGenerations} free generations left
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartGeneration}
                      disabled={activePresets.length === 0}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate {activePresets.length} {activePresets.length === 1 ? "Format" : "Formats"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Custom Dimensions Form */}
                {customSizeEnabled && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Custom Dimensions:</span>
                    </span>

                    {/* Name Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Name:</label>
                      <input
                        type="text"
                        placeholder="e.g. TikTok Reel"
                        value={customSizeName}
                        onChange={(e) => setCustomSizeName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddCustomPreset();
                        }}
                        className="w-32 sm:w-40 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Width Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Width:</label>
                      <input
                        type="number"
                        min="100"
                        max="8000"
                        value={customSize.width}
                        onChange={(e) =>
                          setCustomSize({ ...customSize, width: Number(e.target.value) || 0 })
                        }
                        className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-slate-400">px</span>
                    </div>

                    <span className="text-slate-400">×</span>

                    {/* Height Input */}
                    <div className="flex items-center gap-1.5">
                      <label className="text-slate-500 font-medium">Height:</label>
                      <input
                        type="number"
                        min="100"
                        max="8000"
                        value={customSize.height}
                        onChange={(e) =>
                          setCustomSize({ ...customSize, height: Number(e.target.value) || 0 })
                        }
                        className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="text-slate-400">px</span>
                    </div>

                    {/* Calculated Ratio Badge */}
                    <div className="flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                      <span>Ratio:</span>
                      <span className="font-bold text-indigo-600">
                        {calculateAspectRatio(customSize.width, customSize.height)}
                      </span>
                    </div>

                    {/* Add to Formats Button */}
                    <button
                      type="button"
                      onClick={handleAddCustomPreset}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>Add to Formats</span>
                    </button>

                    {/* Success Toast */}
                    {customAddedFeedback && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-fade-in">
                        <Check className="h-3.5 w-3.5" /> Added to formats!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* State 5: GENERATING (PROCESSING) */}
        {state === "generating" && (
          <ProcessingState
            formatCount={activePresets.length}
            onComplete={() => setState("result")}
          />
        )}

        {/* State 6: RESULT */}
        {state === "result" && media && (
          <ResultCard
            media={media}
            branding={branding}
            selectedPresets={
              !activePlatformFilter || activePlatformFilter === "All"
                ? activePresets
                : (() => {
                    const filtered = activePresets.filter((preset) => {
                      const cat = (preset.category || "").toLowerCase();
                      const name = (preset.name || "").toLowerCase();
                      const filter = activePlatformFilter.toLowerCase();
                      if (filter === "custom") return preset.isCustom;
                      if (filter === "web") return cat === "web" || name.includes("website");
                      return cat === filter || name.includes(filter);
                    });
                    return filtered.length > 0 ? filtered : activePresets;
                  })()
            }
            transform={currentTransform}
            presetTransforms={presetTransforms}
            onReset={handleReset}
            onEdit={() => setState("branding_editor")}
          />
        )}

        {/* State 7: DAILY LIMIT REACHED */}
        {state === "limit_reached" && (
          <LimitReachedState
            onResetQuota={() => {
              setFreeGenerations(3);
              setState("empty");
            }}
          />
        )}

        {/* State 8: ERROR */}
        {state === "error" && (
          <ErrorState
            message={errorMessage || undefined}
            onRetry={() => setState("generating")}
            onReset={handleReset}
          />
        )}
      </div>
      )}

      {/* Recent Creations Floating Modal */}
      {showRecentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Your Recent Projects</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRecentModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <RecentHistory
              items={recentItems}
              onSelect={handleSelectRecent}
              onDuplicate={handleDuplicateRecent}
              onDelete={handleDeleteRecent}
              onClearAll={handleClearAllRecent}
            />
          </div>
        </div>
      )}
    </div>
  );
}

