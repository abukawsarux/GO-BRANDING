"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  MediaFile,
  BrandingSettings,
  OverlayPosition,
  MediaFrameTransform,
  PreviewRatio,
  FormatPreset,
} from "@/types/generator";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Disc,
  Copy,
  Play,
  Pause,
  Camera,
  Upload,
  Smartphone,
  Film,
} from "lucide-react";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

interface MediaPreviewProps {
  media: MediaFile;
  branding: BrandingSettings;
  activePreset?: FormatPreset;
  availablePresets?: FormatPreset[];
  onSelectPreset?: (preset: FormatPreset) => void;
  previewRatio?: PreviewRatio;
  aspectRatioClass?: string; // backward compat
  transform: MediaFrameTransform;
  onChangeTransform: (transform: MediaFrameTransform) => void;
  onApplyToAll?: () => void;
  onUpdateThumbnail?: (thumbUrl: string, source: "auto" | "captured" | "custom") => void;
}

export const PREVIEW_RATIO_SPECS: Record<
  PreviewRatio,
  { ratio: number; label: string; dimensions: string; cssAspect: string }
> = {
  square: { ratio: 1, label: "1:1 Square", dimensions: "1080 × 1080", cssAspect: "1 / 1" },
  portrait: { ratio: 4 / 5, label: "4:5 Portrait", dimensions: "1080 × 1350", cssAspect: "4 / 5" },
  story: { ratio: 9 / 16, label: "9:16 Story", dimensions: "1080 × 1920", cssAspect: "9 / 16" },
  landscape: { ratio: 16 / 9, label: "16:9 Landscape", dimensions: "1920 × 1080", cssAspect: "16 / 9" },
};

export function MediaPreview({
  media,
  branding,
  activePreset,
  availablePresets,
  onSelectPreset,
  previewRatio = "square",
  transform,
  onChangeTransform,
  onApplyToAll,
  onUpdateThumbnail,
}: MediaPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const customFileRef = useRef<HTMLInputElement>(null);

  const [containerBounds, setContainerBounds] = useState({ width: 480, height: 320 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });

  // Video playback & scrubbing state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [captureFeedback, setCaptureFeedback] = useState<string | null>(null);

  // Measure container dimensions dynamically to calculate exact pixel dimensions for real aspect ratio
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerBounds({
          width: Math.max(120, Math.floor(rect.width - 24)),
          height: Math.max(120, Math.floor(rect.height - 24)),
        });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Compute exact pixel width & height that perfectly preserves real geometric ratio
  const activeSpec = PREVIEW_RATIO_SPECS[previewRatio] || PREVIEW_RATIO_SPECS.square;
  const targetRatio = activePreset ? activePreset.width / activePreset.height : activeSpec.ratio;
  const label = activePreset ? activePreset.name : activeSpec.label;
  const dimensions = activePreset ? `${activePreset.width} × ${activePreset.height}` : activeSpec.dimensions;
  const cssAspect = activePreset ? `${activePreset.width} / ${activePreset.height}` : activeSpec.cssAspect;

  let frameWidth = containerBounds.width;
  let frameHeight = containerBounds.height;

  if (containerBounds.width / containerBounds.height > targetRatio) {
    // Container is wider than aspect ratio -> clamp height, scale width
    frameHeight = containerBounds.height;
    frameWidth = Math.round(containerBounds.height * targetRatio);
  } else {
    // Container is narrower than aspect ratio -> clamp width, scale height
    frameWidth = containerBounds.width;
    frameHeight = Math.round(containerBounds.width / targetRatio);
  }

  // Overlay CSS positions
  const getPositionClass = (position: OverlayPosition): string => {
    switch (position) {
      case "top-left":
        return "top-2.5 left-2.5 text-left items-start";
      case "top-center":
        return "top-2.5 left-1/2 -translate-x-1/2 text-center items-center";
      case "top-right":
        return "top-2.5 right-2.5 text-right items-end";
      case "middle-left":
        return "top-1/2 left-2.5 -translate-y-1/2 text-left items-start";
      case "center":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center";
      case "middle-right":
        return "top-1/2 right-2.5 -translate-y-1/2 text-right items-end";
      case "bottom-left":
        return "bottom-2.5 left-2.5 text-left items-start";
      case "bottom-center":
        return "bottom-2.5 left-1/2 -translate-x-1/2 text-center items-center";
      case "bottom-right":
        return "bottom-2.5 right-2.5 text-right items-end";
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center items-center";
    }
  };

  // Focal position presets (Top, Center, Bottom, Left, Right)
  const setFocalPosition = (pos: "top" | "center" | "bottom" | "left" | "right") => {
    let panX = 0;
    let panY = 0;

    switch (pos) {
      case "top":
        panX = 0;
        panY = -50;
        break;
      case "center":
        panX = 0;
        panY = 0;
        break;
      case "bottom":
        panX = 0;
        panY = 50;
        break;
      case "left":
        panX = -50;
        panY = 0;
        break;
      case "right":
        panX = 50;
        panY = 0;
        break;
    }

    onChangeTransform({
      ...transform,
      panX,
      panY,
      focalPosition: pos,
    });
  };

  // Drag handlers for manual positioning
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      panX: transform.panX,
      panY: transform.panY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = (e.clientX - dragStart.x) * 0.25;
    const deltaY = (e.clientY - dragStart.y) * 0.25;

    const newPanX = Math.max(-50, Math.min(50, Math.round(dragStart.panX + deltaX)));
    const newPanY = Math.max(-50, Math.min(50, Math.round(dragStart.panY + deltaY)));

    onChangeTransform({
      ...transform,
      panX: newPanX,
      panY: newPanY,
      focalPosition: "custom",
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: transform.panX,
        panY: transform.panY,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientX - dragStart.x) * 0.25;
    const deltaY = (e.touches[0].clientY - dragStart.y) * 0.25;

    onChangeTransform({
      ...transform,
      panX: Math.max(-50, Math.min(50, Math.round(dragStart.panX + deltaX))),
      panY: Math.max(-50, Math.min(50, Math.round(dragStart.panY + deltaY))),
      focalPosition: "custom",
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (newZoom: number) => {
    const clamped = Math.max(1.0, Math.min(3.0, Math.round(newZoom * 10) / 10));
    onChangeTransform({
      ...transform,
      zoom: clamped,
    });
  };

  // Calculate object position percentage from pan (-50 to 50 maps to 0% to 100%)
  const objPosX = Math.max(0, Math.min(100, transform.panX + 50));
  const objPosY = Math.max(0, Math.min(100, transform.panY + 50));

  const activeFocal =
    transform.focalPosition ||
    (transform.panY === -50 && transform.panX === 0
      ? "top"
      : transform.panY === 50 && transform.panX === 0
      ? "bottom"
      : transform.panX === 0 && transform.panY === 0
      ? "center"
      : transform.panX === -50 && transform.panY === 0
      ? "left"
      : transform.panX === 50 && transform.panY === 0
      ? "right"
      : "custom");

  // Tabs horizontal grab & scroll
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isTabsDragging, setIsTabsDragging] = useState(false);
  const tabsDragState = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
  });

  const handleTabsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = tabsContainerRef.current;
    if (!container) return;
    tabsDragState.current = {
      isDown: true,
      startX: e.pageX - container.offsetLeft,
      scrollLeft: container.scrollLeft,
      hasMoved: false,
    };
    setIsTabsDragging(true);
  };

  const handleTabsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tabsDragState.current.isDown) return;
    const container = tabsContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - tabsDragState.current.startX) * 1.5;
    if (Math.abs(walk) > 4) {
      tabsDragState.current.hasMoved = true;
    }
    container.scrollLeft = tabsDragState.current.scrollLeft - walk;
  };

  const handleTabsMouseUpOrLeave = () => {
    tabsDragState.current.isDown = false;
    setIsTabsDragging(false);
  };

  const handleTabClick = (preset: FormatPreset, e: React.MouseEvent) => {
    if (tabsDragState.current.hasMoved) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onSelectPreset?.(preset);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Live Branding Preview Header matching mockup */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-2xs">
          <InstagramIcon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Live Branding Preview</h3>
          <p className="text-[11px] text-slate-500">
            See how your media will look with your branding in real-time
          </p>
        </div>
      </div>

      {/* Platform Framing Switcher Tabs - Grab & Drag to scroll, scrollbar removed */}
      {availablePresets && availablePresets.length > 0 && onSelectPreset && (
        <div
          ref={tabsContainerRef}
          onMouseDown={handleTabsMouseDown}
          onMouseMove={handleTabsMouseMove}
          onMouseUp={handleTabsMouseUpOrLeave}
          onMouseLeave={handleTabsMouseUpOrLeave}
          onWheel={(e) => {
            if (tabsContainerRef.current && e.deltaY !== 0) {
              tabsContainerRef.current.scrollLeft += e.deltaY;
            }
          }}
          className={`flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            isTabsDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {availablePresets.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                draggable={false}
                onClick={(e) => handleTabClick(preset, e)}
                className={`flex items-center justify-between gap-3 rounded-2xl p-2.5 px-3.5 text-xs transition-all shrink-0 select-none ${
                  isTabsDragging ? "cursor-grabbing pointer-events-auto" : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-2 border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs ring-2 ring-indigo-500/20"
                    : "border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs"
                }`}
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  {preset.category === "Instagram" ? (
                    <InstagramIcon className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-purple-500"}`} />
                  ) : preset.category === "Facebook" ? (
                    <FacebookIcon className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-blue-600"}`} />
                  ) : preset.category === "YouTube" ? (
                    <YoutubeIcon className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-rose-600"}`} />
                  ) : preset.category === "TikTok" ? (
                    <Film className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-slate-800"}`} />
                  ) : (
                    <Smartphone className={`h-4 w-4 ${isSelected ? "text-indigo-600" : "text-emerald-600"}`} />
                  )}
                  <span className="truncate max-w-[110px]">{preset.name}</span>
                </div>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono pointer-events-none ${
                    isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {preset.aspectRatio}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Media Viewport Workbench - Fixed Height, Perfectly Centers Real Ratio Frame */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative mx-auto w-full h-[320px] sm:h-[350px] overflow-hidden rounded-2xl border border-slate-300 bg-slate-950/95 shadow-inner select-none flex items-center justify-center p-3 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Real Aspect Ratio Preview Frame - Mathematically Exact Dimensions */}
        <div
          style={{
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            aspectRatio: activeSpec.cssAspect,
          }}
          className="relative overflow-hidden rounded-xl border-2 border-indigo-500/60 shadow-2xl bg-black transition-all duration-200 flex items-center justify-center shrink-0"
        >
          {/* Media Background - FILLS 100% OF THIS REAL RATIO FRAME */}
          {media.type === "video" ? (
            <video
              ref={videoRef}
              src={media.previewUrl}
              poster={media.thumbnailUrl || undefined}
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setVideoDuration(videoRef.current.duration || 0);
                }
              }}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setVideoCurrentTime(videoRef.current.currentTime);
                }
              }}
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none transition-all duration-75"
              style={{
                objectPosition: `${objPosX}% ${objPosY}%`,
                transform: `scale(${transform.zoom})`,
                transformOrigin: `${objPosX}% ${objPosY}%`,
              }}
            />
          ) : (
            <img
              src={media.previewUrl}
              alt="Source preview"
              className="absolute inset-0 h-full w-full object-cover select-none pointer-events-none transition-all duration-75"
              draggable={false}
              style={{
                objectPosition: `${objPosX}% ${objPosY}%`,
                transform: `scale(${transform.zoom})`,
                transformOrigin: `${objPosX}% ${objPosY}%`,
              }}
            />
          )}

          {/* --- BRANDING OVERLAYS (Positioned relative to the real ratio frame) --- */}

          {/* 1. Logo Overlay */}
          {branding.logo.enabled && branding.logo.url && (
            <div
              className={`absolute pointer-events-none z-20 flex transition-all duration-150 ${getPositionClass(
                branding.logo.position
              )}`}
              style={{
                opacity: branding.logo.opacity / 100,
              }}
            >
              <div
                className="drop-shadow-md rounded-lg overflow-hidden bg-white/10 backdrop-blur-xs p-1"
                style={{
                  width: `${branding.logo.size * 3.5}px`,
                  maxWidth: "110px",
                  minWidth: "32px",
                }}
              >
                <img
                  src={branding.logo.url}
                  alt="Brand logo"
                  className="w-full h-auto object-contain max-h-14"
                />
              </div>
            </div>
          )}

          {/* 2. Brand Name Overlay */}
          {branding.brandName.enabled && branding.brandName.text && (
            <div
              className={`absolute pointer-events-none z-20 flex flex-col transition-all duration-150 ${getPositionClass(
                branding.brandName.position
              )}`}
              style={{
                opacity: branding.brandName.opacity / 100,
              }}
            >
              <span
                className="font-bold tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-xs leading-none"
                style={{
                  fontSize: `${Math.max(10, branding.brandName.size * 0.65)}px`,
                }}
              >
                {branding.brandName.text}
              </span>
            </div>
          )}

          {/* 3. Watermark Overlay */}
          {branding.watermark.enabled && branding.watermark.text && (
            <div
              className={`absolute pointer-events-none z-20 flex transition-all duration-150 ${getPositionClass(
                branding.watermark.position
              )}`}
              style={{
                opacity: branding.watermark.opacity / 100,
              }}
            >
              <span
                className="font-mono font-medium tracking-tight text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] bg-black/40 px-1.5 py-0.5 rounded text-[9px] leading-none select-none"
                style={{
                  fontSize: `${Math.max(8, branding.watermark.size * 0.65)}px`,
                }}
              >
                {branding.watermark.text}
              </span>
            </div>
          )}

          {/* Format & Dimensions Watermark Badge on the Frame */}
          <div className="absolute bottom-1.5 right-1.5 z-10 pointer-events-none rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-white/80 backdrop-blur-xs flex items-center gap-1">
            <span>{dimensions}</span>
            {activeFocal !== "center" && (
              <span className="text-amber-400 capitalize">• {activeFocal}</span>
            )}
          </div>
        </div>

        {/* Top Badges: Active Format / Ratio Indicator & Drag Hint */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-2 pointer-events-none">
          <span className="flex items-center gap-1 rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs backdrop-blur-xs">
            {label}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-xs">
            <Move className="h-3 w-3 text-indigo-300" />
            <span>Drag to pan</span>
          </span>
        </div>
      </div>

      {/* --- 2-ROW POSITION & ZOOM TOOLBAR MATCHING MOCKUP --- */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 text-xs shadow-xs">
        {/* Row 1: Position Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <span className="text-xs font-semibold text-slate-700 min-w-[55px]">
            Position:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setFocalPosition("top")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFocal === "top"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronUp className="h-3.5 w-3.5" />
              <span>Top</span>
            </button>

            <button
              type="button"
              onClick={() => setFocalPosition("center")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFocal === "center"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Disc className="h-3.5 w-3.5" />
              <span>Center</span>
            </button>

            <button
              type="button"
              onClick={() => setFocalPosition("bottom")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFocal === "bottom"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronDown className="h-3.5 w-3.5" />
              <span>Bottom</span>
            </button>

            <button
              type="button"
              onClick={() => setFocalPosition("left")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFocal === "left"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Left</span>
            </button>

            <button
              type="button"
              onClick={() => setFocalPosition("right")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFocal === "right"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
              <span>Right</span>
            </button>
          </div>
        </div>

        {/* Row 2: Zoom Slider & Actions */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 min-w-[55px]">
              Zoom:
            </span>
            <ZoomOut className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={transform.zoom}
              onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-indigo-600 cursor-pointer"
            />
            <ZoomIn className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-mono text-xs font-bold text-slate-800 min-w-[28px]">
              {transform.zoom.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onChangeTransform({
                  zoom: 1.0,
                  panX: 0,
                  panY: 0,
                  focalPosition: "center",
                });
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>

            {onApplyToAll && (
              <button
                type="button"
                onClick={onApplyToAll}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Apply to all</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Video Playback & Thumbnail Capture Toolbar */}
      {media.type === "video" && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-2 px-3 text-xs text-slate-800 shadow-2xs">
          {/* Play/Pause & Scrubber */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={() => {
                const vid = videoRef.current;
                if (!vid) return;
                if (vid.paused) {
                  vid.play();
                  setIsVideoPlaying(true);
                } else {
                  vid.pause();
                  setIsVideoPlaying(false);
                }
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer shrink-0"
              title={isVideoPlaying ? "Pause video" : "Play video"}
            >
              {isVideoPlaying ? (
                <Pause className="h-3.5 w-3.5 fill-white" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
              )}
            </button>

            {/* Timeline slider */}
            <input
              type="range"
              min={0}
              max={videoDuration || 10}
              step={0.1}
              value={videoCurrentTime}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setVideoCurrentTime(t);
                if (videoRef.current) {
                  videoRef.current.currentTime = t;
                }
              }}
              className="w-full accent-indigo-600 cursor-pointer"
            />

            <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
              {Math.floor(videoCurrentTime)}s / {Math.floor(videoDuration || 0)}s
            </span>
          </div>

          {/* Capture Frame & Custom Upload */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const vid = videoRef.current;
                if (!vid) return;
                try {
                  const canvas = document.createElement("canvas");
                  canvas.width = vid.videoWidth || 640;
                  canvas.height = vid.videoHeight || 360;
                  const ctx = canvas.getContext("2d");
                  if (ctx) {
                    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                    onUpdateThumbnail?.(dataUrl, "captured");
                    setCaptureFeedback("Thumbnail captured!");
                    setTimeout(() => setCaptureFeedback(null), 2500);
                  }
                } catch (err) {
                  console.warn("Could not capture frame:", err);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-700 transition-all shadow-2xs cursor-pointer"
              title="Capture this video frame as thumbnail"
            >
              <Camera className="h-3.5 w-3.5" />
              <span>Capture Frame</span>
            </button>

            <input
              ref={customFileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const url = URL.createObjectURL(file);
                  onUpdateThumbnail?.(url, "custom");
                  setCaptureFeedback("Custom thumbnail set!");
                  setTimeout(() => setCaptureFeedback(null), 2500);
                }
              }}
            />

            <button
              type="button"
              onClick={() => customFileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              title="Upload custom image as thumbnail"
            >
              <Upload className="h-3 w-3 text-slate-500" />
              <span>Upload Cover</span>
            </button>

            {captureFeedback && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md animate-in fade-in">
                {captureFeedback}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

}

