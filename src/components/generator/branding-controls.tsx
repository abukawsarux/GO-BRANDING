"use client";

import React, { useState, useRef } from "react";
import { BrandingSettings, OverlayPosition } from "@/types/generator";
import {
  Image as ImageIcon,
  Type,
  Shield,
  Upload,
  Check,
  RotateCcw,
  Video,
  Camera,
  Film,
  Sparkles,
  Palette,
  Eye,
} from "lucide-react";
import { DEFAULT_SAMPLE_LOGO } from "@/lib/generator-constants";
import { BrandKitSelector } from "@/components/branding/brand-kit-selector";

interface BrandingControlsProps {
  branding: BrandingSettings;
  onChange: (branding: BrandingSettings) => void;
  mediaType?: "image" | "video";
  thumbnailUrl?: string;
  thumbnailSource?: "auto" | "captured" | "custom";
  onUpdateThumbnail?: (url: string, source: "auto" | "captured" | "custom") => void;
}

const FONT_OPTIONS = [
  { id: "Inter", label: "Inter (Modern Sans)" },
  { id: "Montserrat", label: "Montserrat (Geometric)" },
  { id: "Playfair Display", label: "Playfair (Classic Serif)" },
  { id: "Space Grotesk", label: "Space Grotesk (Tech)" },
  { id: "Roboto", label: "Roboto (Clean)" },
  { id: "Oswald", label: "Oswald (Condensed Bold)" },
  { id: "Poppins", label: "Poppins (Friendly)" },
];

const COLOR_SWATCHES = [
  { hex: "#ffffff", label: "White" },
  { hex: "#0f172a", label: "Charcoal" },
  { hex: "#4f46e5", label: "Indigo" },
  { hex: "#f59e0b", label: "Gold" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#ec4899", label: "Pink" },
];

export function BrandingControls({
  branding,
  onChange,
  mediaType = "image",
  thumbnailUrl,
  thumbnailSource = "auto",
  onUpdateThumbnail,
}: BrandingControlsProps) {
  const [activeTab, setActiveTab] = useState<"logo" | "brandName" | "watermark" | "thumbnail">("logo");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const watermarkImgInputRef = useRef<HTMLInputElement>(null);
  const customThumbInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onChange({
        ...branding,
        logo: {
          ...branding.logo,
          url,
          enabled: true,
        },
      });
    }
  };

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      onChange({
        ...branding,
        watermark: {
          ...branding.watermark,
          type: "image",
          imageUrl: url,
          enabled: true,
        },
      });
    }
  };

  // 9-Grid Position Selector matching reference mockup
  const PositionSelector = ({
    value,
    onChangePos,
  }: {
    value: OverlayPosition;
    onChangePos: (pos: OverlayPosition) => void;
  }) => {
    const gridButtons: { id: OverlayPosition; label: string }[] = [
      { id: "top-left", label: "Top Left" },
      { id: "top-center", label: "Top Center" },
      { id: "top-right", label: "Top Right" },
      { id: "middle-left", label: "Middle Left" },
      { id: "center", label: "Center" },
      { id: "middle-right", label: "Middle Right" },
      { id: "bottom-left", label: "Bottom Left" },
      { id: "bottom-center", label: "Bottom Center" },
      { id: "bottom-right", label: "Bottom Right" },
    ];

    return (
      <div className="grid grid-cols-3 gap-1.5">
        {gridButtons.map((btn) => {
          const isSelected = value === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => onChangePos(btn.id)}
              className={`py-2 px-1 text-[11px] font-medium rounded-xl transition-all text-center border cursor-pointer ${
                isSelected
                  ? "bg-indigo-50/80 border-indigo-300 text-indigo-700 font-bold shadow-2xs"
                  : "bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100/90 hover:text-slate-900"
              }`}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Brand Kit Selector at the Top */}
      <BrandKitSelector branding={branding} onChange={onChange} />

      {/* Branding Controls Header matching mockup */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-2xs">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Branding Controls</h3>
          <p className="text-[11px] text-slate-500">Customize your brand elements and make it yours</p>
        </div>
      </div>

      {/* Control Tabs matching mockup */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("logo")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "logo"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5 text-indigo-600" />
          <span>Logo</span>
          {branding.logo.enabled && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brandName")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "brandName"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Type className="h-3.5 w-3.5 text-indigo-600" />
          <span>Brand Name</span>
          {branding.brandName.enabled && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("watermark")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === "watermark"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shield className="h-3.5 w-3.5 text-indigo-600" />
          <span>Watermark</span>
          {branding.watermark.enabled && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        {mediaType === "video" && (
          <button
            type="button"
            onClick={() => setActiveTab("thumbnail")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "thumbnail"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="h-3.5 w-3.5 text-indigo-600" />
            <span>Thumbnail</span>
            {thumbnailUrl && (
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            )}
          </button>
        )}
      </div>

      {/* --- TAB CONTENT: LOGO --- */}
      {activeTab === "logo" && (
        <div className="mt-3.5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Enable Brand Logo</h4>
              <p className="text-xs text-slate-500">Show logo on generated media</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={branding.logo.enabled}
                onChange={(e) =>
                  onChange({
                    ...branding,
                    logo: { ...branding.logo, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Logo Upload / Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Logo Asset
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-2xs">
                <img
                  src={branding.logo.url || DEFAULT_SAMPLE_LOGO}
                  alt="Logo preview"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5 text-slate-500" />
                  Upload Logo
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...branding,
                      logo: { ...branding.logo, url: DEFAULT_SAMPLE_LOGO, enabled: true },
                    })
                  }
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Use Sample
                </button>
              </div>
            </div>
          </div>

          {/* Logo Size */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Size</span>
              <span className="font-mono text-slate-500">{branding.logo.size}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              value={branding.logo.size}
              onChange={(e) =>
                onChange({
                  ...branding,
                  logo: { ...branding.logo, size: Number(e.target.value) },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Logo Opacity */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Opacity</span>
              <span className="font-mono text-slate-500">{branding.logo.opacity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="100"
              value={branding.logo.opacity}
              onChange={(e) =>
                onChange({
                  ...branding,
                  logo: { ...branding.logo, opacity: Number(e.target.value) },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Logo Position */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Position
            </label>
            <PositionSelector
              value={branding.logo.position}
              onChangePos={(pos) =>
                onChange({
                  ...branding,
                  logo: { ...branding.logo, position: pos },
                })
              }
            />
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: BRAND NAME (Matching Screenshot) --- */}
      {activeTab === "brandName" && (
        <div className="mt-3.5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Enable Brand Name</h4>
              <p className="text-xs text-slate-500">Show brand text label on media</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={branding.brandName.enabled}
                onChange={(e) =>
                  onChange({
                    ...branding,
                    brandName: { ...branding.brandName, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Brand Name Text
            </label>
            <input
              type="text"
              value={branding.brandName.text}
              onChange={(e) =>
                onChange({
                  ...branding,
                  brandName: { ...branding.brandName, text: e.target.value },
                })
              }
              placeholder="e.g. LUMINA CO."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs font-semibold"
            />
          </div>

          {/* Font & Color Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Font Family Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Font Style
              </label>
              <select
                value={branding.brandName.fontFamily || "Inter"}
                onChange={(e) =>
                  onChange({
                    ...branding,
                    brandName: { ...branding.brandName, fontFamily: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none shadow-2xs cursor-pointer"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Color Swatches */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Text Color
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_SWATCHES.map((color) => {
                  const isSelected = (branding.brandName.color || "#ffffff").toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...branding,
                          brandName: { ...branding.brandName, color: color.hex },
                        })
                      }
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                      className={`h-6 w-6 rounded-full border border-slate-300 transition-transform cursor-pointer ${
                        isSelected ? "ring-2 ring-indigo-500 ring-offset-1 scale-110" : "hover:scale-105"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Text Size</span>
              <span className="font-mono text-slate-500">{branding.brandName.size}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="36"
              value={branding.brandName.size}
              onChange={(e) =>
                onChange({
                  ...branding,
                  brandName: {
                    ...branding.brandName,
                    size: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Opacity</span>
              <span className="font-mono text-slate-500">{branding.brandName.opacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={branding.brandName.opacity}
              onChange={(e) =>
                onChange({
                  ...branding,
                  brandName: {
                    ...branding.brandName,
                    opacity: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Position
            </label>
            <PositionSelector
              value={branding.brandName.position}
              onChangePos={(pos) =>
                onChange({
                  ...branding,
                  brandName: { ...branding.brandName, position: pos },
                })
              }
            />
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: WATERMARK --- */}
      {activeTab === "watermark" && (
        <div className="mt-3.5 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Enable Watermark</h4>
              <p className="text-xs text-slate-500">Copyright, handle, or badge</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={branding.watermark.enabled}
                onChange={(e) =>
                  onChange({
                    ...branding,
                    watermark: { ...branding.watermark, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Watermark Mode: Text vs. Image */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...branding,
                  watermark: { ...branding.watermark, type: "text" },
                })
              }
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                (branding.watermark.type || "text") === "text"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Text Watermark
            </button>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...branding,
                  watermark: { ...branding.watermark, type: "image" },
                })
              }
              className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                branding.watermark.type === "image"
                  ? "bg-white text-indigo-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Badge / Image
            </button>
          </div>

          {/* Text Mode */}
          {(branding.watermark.type || "text") === "text" ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Watermark Notice Text
              </label>
              <input
                type="text"
                value={branding.watermark.text}
                onChange={(e) =>
                  onChange({
                    ...branding,
                    watermark: { ...branding.watermark, text: e.target.value },
                  })
                }
                placeholder="e.g. © 2026 LUMINA CO • ALL RIGHTS RESERVED"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none shadow-2xs font-mono"
              />
            </div>
          ) : (
            /* Image Badge Mode */
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Watermark Badge Asset
              </label>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-1 overflow-hidden shadow-2xs">
                  {branding.watermark.imageUrl ? (
                    <img
                      src={branding.watermark.imageUrl}
                      alt="Watermark badge"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Shield className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={watermarkImgInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleWatermarkImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => watermarkImgInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-slate-500" />
                    <span>Upload Badge PNG</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Size */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Size</span>
              <span className="font-mono text-slate-500">{branding.watermark.size}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={branding.watermark.size}
              onChange={(e) =>
                onChange({
                  ...branding,
                  watermark: {
                    ...branding.watermark,
                    size: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
              <span>Opacity</span>
              <span className="font-mono text-slate-500">{branding.watermark.opacity}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="95"
              value={branding.watermark.opacity}
              onChange={(e) =>
                onChange({
                  ...branding,
                  watermark: {
                    ...branding.watermark,
                    opacity: Number(e.target.value),
                  },
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Position
            </label>
            <PositionSelector
              value={branding.watermark.position}
              onChangePos={(pos) =>
                onChange({
                  ...branding,
                  watermark: { ...branding.watermark, position: pos },
                })
              }
            />
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: VIDEO THUMBNAIL --- */}
      {activeTab === "thumbnail" && mediaType === "video" && (
        <div className="mt-3.5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Video Thumbnail / Cover</h4>
              <p className="text-xs text-slate-500">
                Choose the cover image shown on social media and cards
              </p>
            </div>
            <span className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 capitalize">
              {thumbnailSource === "custom"
                ? "Custom Image"
                : thumbnailSource === "captured"
                ? "Captured Frame"
                : "Auto Frame"}
            </span>
          </div>

          {/* Current Thumbnail Preview */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-950 shadow-inner">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Video thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  <Camera className="h-6 w-6" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <input
                ref={customThumbInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    onUpdateThumbnail?.(url, "custom");
                  }
                }}
              />

              <button
                type="button"
                onClick={() => customThumbInputRef.current?.click()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-slate-500" />
                <span>Upload Custom Thumbnail</span>
              </button>

              {thumbnailSource !== "auto" && (
                <button
                  type="button"
                  onClick={() => onUpdateThumbnail?.("", "auto")}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Auto Video Frame</span>
                </button>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-3 text-xs text-indigo-900">
            <p className="font-semibold mb-0.5 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Capture from Video Player:</span>
            </p>
            <p className="text-[11px] text-indigo-700">
              You can play or scrub the video in the preview on the left and click <strong>&quot;Capture Current Frame&quot;</strong> to set any second as the thumbnail!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
