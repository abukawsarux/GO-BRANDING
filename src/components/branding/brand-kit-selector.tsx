"use client";

import React, { useState, useEffect } from "react";
import { BrandKitDefinition, BrandingSettings } from "@/types/generator";
import {
  getBrandKits,
  saveBrandKit,
  applyBrandKitToBranding,
} from "@/lib/brand-kit-service";
import {
  Sparkles,
  ChevronDown,
  Check,
  Plus,
  Palette,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface BrandKitSelectorProps {
  branding: BrandingSettings;
  onChange: (branding: BrandingSettings) => void;
}

export function BrandKitSelector({ branding, onChange }: BrandKitSelectorProps) {
  const [kits, setKits] = useState<BrandKitDefinition[]>([]);
  const [selectedKitId, setSelectedKitId] = useState<string>("kit-lumina");
  const [isOpen, setIsOpen] = useState(false);
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [newKitName, setNewKitName] = useState("");

  useEffect(() => {
    const loaded = getBrandKits();
    setKits(loaded);
    if (branding.brandKitId) {
      setSelectedKitId(branding.brandKitId);
    } else {
      setSelectedKitId(loaded[0]?.id || "kit-lumina");
    }
  }, [branding.brandKitId]);

  const activeKit = kits.find((k) => k.id === selectedKitId) || kits[0];

  const handleSelectKit = (kit: BrandKitDefinition) => {
    setSelectedKitId(kit.id);
    const updated = applyBrandKitToBranding(kit, branding);
    onChange(updated);
    setIsOpen(false);
  };

  const handleSaveCurrentAsKit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKitName.trim()) return;

    const newKit: BrandKitDefinition = {
      id: `kit-custom-${Date.now()}`,
      name: newKitName.trim(),
      brandName: branding.brandName.text || newKitName.trim(),
      logoUrl: branding.logo.url,
      watermarkText: branding.watermark.text,
      watermarkImageUrl: branding.watermark.imageUrl,
      watermarkType: branding.watermark.type || "text",
      primaryColor: branding.primaryColor || "#4F46E5",
      secondaryColor: branding.secondaryColor || "#06B6D4",
      headingFont: branding.brandName.fontFamily || "Inter",
      defaultLogoPosition: branding.logo.position,
      defaultLogoSize: branding.logo.size,
      defaultOpacity: branding.logo.opacity,
    };

    const updatedKits = saveBrandKit(newKit);
    setKits(updatedKits);
    setSelectedKitId(newKit.id);
    onChange({ ...branding, brandKitId: newKit.id });
    setIsSavingCustom(false);
    setNewKitName("");
    setIsOpen(false);
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-indigo-600" />
          <span>Active Brand Kit</span>
        </label>
        <Link
          href="/dashboard/brand"
          className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          title="Open Brand Kit Manager in Dashboard"
        >
          <span>Manage Kits</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="h-6 w-6 rounded-lg flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-2xs"
              style={{ backgroundColor: activeKit?.primaryColor || "#4F46E5" }}
            >
              {activeKit?.name ? activeKit.name[0] : "B"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {activeKit?.name || "Lumina Co."}
                </span>
                {activeKit?.isDefault && (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {activeKit?.brandName || "LUMINA CO."} • {activeKit?.headingFont || "Inter"}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-40 animate-fade-in">
            <div className="max-h-56 overflow-y-auto space-y-1">
              {kits.map((kit) => {
                const isSelected = kit.id === selectedKitId;
                return (
                  <button
                    key={kit.id}
                    type="button"
                    onClick={() => handleSelectKit(kit)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50 text-indigo-900 font-semibold"
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="h-5 w-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                        style={{ backgroundColor: kit.primaryColor }}
                      >
                        {kit.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{kit.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {kit.brandName}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-indigo-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100">
              {isSavingCustom ? (
                <form onSubmit={handleSaveCurrentAsKit} className="space-y-2 p-1">
                  <input
                    type="text"
                    value={newKitName}
                    onChange={(e) => setNewKitName(e.target.value)}
                    placeholder="e.g. My Client Brand"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1 px-2 rounded-lg"
                    >
                      Save Kit
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSavingCustom(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 py-1 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSavingCustom(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/70 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Save Current as New Brand Kit</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

