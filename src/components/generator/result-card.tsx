"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import {
  MediaFile,
  BrandingSettings,
  FormatPreset,
  ExportFileFormat,
  MediaFrameTransform,
  OverlayPosition,
} from "@/types/generator";
import {
  Download,
  Check,
  ArrowLeft,
  RotateCcw,
  Layers,
  FileType,
  Eye,
  Archive,
  Edit3,
  Loader2,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  X,
  Camera,
  Clock,
  Pencil,
  MoreVertical,
  Globe,
  Film,
  Smartphone,
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

function TikTokIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46V10.7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.13z"/>
    </svg>
  );
}

function getPlatformIcon(preset: FormatPreset) {
  const cat = (preset.category || "").toLowerCase();
  const name = (preset.name || "").toLowerCase();

  if (cat === "instagram" || name.includes("instagram")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xs shrink-0">
        <InstagramIcon className="h-4 w-4" />
      </div>
    );
  }
  if (cat === "facebook" || name.includes("facebook")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs shrink-0">
        <FacebookIcon className="h-4 w-4" />
      </div>
    );
  }
  if (cat === "youtube" || name.includes("youtube")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-2xs shrink-0">
        <YoutubeIcon className="h-4 w-4" />
      </div>
    );
  }
  if (cat === "tiktok" || name.includes("tiktok")) {
    return (
      <div className="h-7 w-7 rounded-lg bg-black flex items-center justify-center text-white shadow-2xs shrink-0">
        <TikTokIcon className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-2xs shrink-0">
      <Globe className="h-4 w-4" />
    </div>
  );
}

interface ResultCardProps {
  media: MediaFile;
  branding: BrandingSettings;
  selectedPresets: FormatPreset[];
  transform: MediaFrameTransform;
  presetTransforms?: Record<string, MediaFrameTransform>;
  onReset: () => void;
  onEdit: () => void;
}

export function ResultCard({
  media,
  branding,
  selectedPresets,
  transform,
  presetTransforms,
  onReset,
  onEdit,
}: ResultCardProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadAllActive, setDownloadAllActive] = useState(false);
  const [zipProgress, setZipProgress] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ExportFileFormat>(
    media.type === "video" ? "mp4" : "png"
  );
  const [videoRenderProgress, setVideoRenderProgress] = useState<Record<string, number>>({});
  const [renderedPreviews, setRenderedPreviews] = useState<Record<string, string>>({});
  const [downloadedPresetIds, setDownloadedPresetIds] = useState<Set<string>>(new Set());

  // Individual video play states & audio mute states
  const [playingPresets, setPlayingPresets] = useState<Record<string, boolean>>({});
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [previewModalPreset, setPreviewModalPreset] = useState<FormatPreset | null>(null);
  const [openMenuPresetId, setOpenMenuPresetId] = useState<string | null>(null);
  const videoRefs = React.useRef<Record<string, HTMLVideoElement | null>>({});

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!openMenuPresetId) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-dropdown-menu]")) {
        setOpenMenuPresetId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [openMenuPresetId]);

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

  const togglePlay = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[presetId];
    if (!vid) return;

    if (vid.paused) {
      vid.play().catch(() => {});
      setPlayingPresets((prev) => ({ ...prev, [presetId]: true }));
    } else {
      vid.pause();
      setPlayingPresets((prev) => ({ ...prev, [presetId]: false }));
    }
  };

  const toggleMute = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRefs.current[presetId];
    if (!vid) return;
    vid.muted = !vid.muted;
    setMutedMap((prev) => ({ ...prev, [presetId]: vid.muted }));
  };

  // Default custom file name from brand name or uploaded file
  const defaultFileName = (
    branding.brandName.text?.trim()
      ? branding.brandName.text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : media.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-")
  ) || "branded-media";

  const [fileName, setFileName] = useState(defaultFileName);

  // Helper to draw canvas with exact user zoom and pan framing for that specific preset
  const drawBrandedCanvas = async (preset: FormatPreset): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement("canvas");
    canvas.width = preset.width;
    canvas.height = preset.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    let mediaDrawable: CanvasImageSource;
    let imgWidth = 1200;
    let imgHeight = 1200;

    if (media.type === "video") {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.src = media.previewUrl;
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) * 0.1);
        };
        video.onseeked = () => resolve();
        video.onerror = () => resolve();
        setTimeout(resolve, 2000);
      });
      mediaDrawable = video;
      imgWidth = video.videoWidth || 1280;
      imgHeight = video.videoHeight || 720;
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = media.previewUrl;
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
      mediaDrawable = img;
      imgWidth = img.width || 1200;
      imgHeight = img.height || 1200;
    }

    const imgRatio = imgWidth / imgHeight;
    const targetRatio = preset.width / preset.height;

    let baseWidth = imgWidth;
    let baseHeight = imgHeight;
    if (imgRatio > targetRatio) {
      baseWidth = imgHeight * targetRatio;
    } else {
      baseHeight = imgWidth / targetRatio;
    }

    // Use THAT preset's custom framing, falling back to general transform
    const effectiveTransform = presetTransforms?.[preset.id] || transform || {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      focalPosition: "center",
    };

    // Apply exact user Zoom (1.0 to 3.0) for this specific preset
    const zoom = effectiveTransform.zoom || 1.0;
    const sWidth = baseWidth / zoom;
    const sHeight = baseHeight / zoom;

    // Available excess pixels to pan (panX and panY: -50 to +50, mapping to 0% to 100%)
    const excessX = Math.max(0, imgWidth - sWidth);
    const excessY = Math.max(0, imgHeight - sHeight);
    const normX = Math.max(0, Math.min(1, ((effectiveTransform.panX || 0) + 50) / 100));
    const normY = Math.max(0, Math.min(1, ((effectiveTransform.panY || 0) + 50) / 100));
    const sx = excessX * normX;
    const sy = excessY * normY;

    ctx.drawImage(mediaDrawable, sx, sy, sWidth, sHeight, 0, 0, preset.width, preset.height);

    // Draw Brand Logo if enabled
    if (branding.logo.enabled && branding.logo.url) {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = branding.logo.url;

      await new Promise((res) => {
        logoImg.onload = res;
        logoImg.onerror = res;
      });

      const logoWidth = (preset.width * (branding.logo.size / 100)) * 0.8;
      const logoAspect = (logoImg.width || 1) / (logoImg.height || 1);
      const logoHeight = logoWidth / logoAspect;

      ctx.save();
      ctx.globalAlpha = branding.logo.opacity / 100;

      let lx = preset.width - logoWidth - 40;
      let ly = 40;
      if (branding.logo.position === "top-left") {
        lx = 40;
        ly = 40;
      } else if (branding.logo.position === "bottom-left") {
        lx = 40;
        ly = preset.height - logoHeight - 40;
      } else if (branding.logo.position === "bottom-right") {
        lx = preset.width - logoWidth - 40;
        ly = preset.height - logoHeight - 40;
      } else if (branding.logo.position === "center") {
        lx = (preset.width - logoWidth) / 2;
        ly = (preset.height - logoHeight) / 2;
      }

      ctx.drawImage(logoImg, lx, ly, logoWidth, logoHeight);
      ctx.restore();
    }

    // Draw Brand Name text if enabled
    if (branding.brandName.enabled && branding.brandName.text) {
      ctx.save();
      ctx.globalAlpha = branding.brandName.opacity / 100;
      const scaledFontSize = Math.round((preset.width / 1080) * branding.brandName.size * 2);
      ctx.font = `bold ${scaledFontSize}px sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      let bx = 40;
      let by = preset.height - 40;
      if (branding.brandName.position === "top-left") {
        bx = 40;
        by = 40 + scaledFontSize;
      } else if (branding.brandName.position === "top-right") {
        ctx.textAlign = "right";
        bx = preset.width - 40;
        by = 40 + scaledFontSize;
      } else if (branding.brandName.position === "bottom-right") {
        ctx.textAlign = "right";
        bx = preset.width - 40;
        by = preset.height - 40;
      } else if (branding.brandName.position === "center") {
        ctx.textAlign = "center";
        bx = preset.width / 2;
        by = preset.height / 2;
      }

      ctx.fillText(branding.brandName.text, bx, by);
      ctx.restore();
    }

    // Draw Watermark text if enabled
    if (branding.watermark.enabled && branding.watermark.text) {
      ctx.save();
      ctx.globalAlpha = branding.watermark.opacity / 100;
      const scaledWmSize = Math.round((preset.width / 1080) * branding.watermark.size * 1.8);
      ctx.font = `500 ${scaledWmSize}px monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 8;

      let wx = preset.width - 40;
      let wy = preset.height - 40;
      ctx.textAlign = "right";

      if (branding.watermark.position === "top-left") {
        ctx.textAlign = "left";
        wx = 40;
        wy = 40 + scaledWmSize;
      } else if (branding.watermark.position === "top-right") {
        ctx.textAlign = "right";
        wx = preset.width - 40;
        wy = 40 + scaledWmSize;
      } else if (branding.watermark.position === "bottom-left") {
        ctx.textAlign = "left";
        wx = 40;
        wy = preset.height - 40;
      } else if (branding.watermark.position === "center") {
        ctx.textAlign = "center";
        wx = preset.width / 2;
        wy = preset.height / 2;
      }

      ctx.fillText(branding.watermark.text, wx, wy);
      ctx.restore();
    }

    return canvas;
  };

  // Generate real rendered snapshots for every selected format
  useEffect(() => {
    let isMounted = true;
    const renderSnapshots = async () => {
      const map: Record<string, string> = {};
      for (const preset of selectedPresets) {
        try {
          const canvas = await drawBrandedCanvas(preset);
          map[preset.id] = canvas.toDataURL("image/jpeg", 0.88);
        } catch (err) {
          console.error("Snapshot render error:", err);
        }
      }
      if (isMounted) {
        setRenderedPreviews(map);
      }
    };

    renderSnapshots();
    return () => {
      isMounted = false;
    };
  }, [selectedPresets, media.previewUrl, branding, transform, presetTransforms]);

  // Helper to record and export a branded .mp4 video for a preset
  const recordBrandedVideoBlob = async (
    preset: FormatPreset,
    onProgress?: (percent: number) => void
  ): Promise<Blob> => {
    let targetW = preset.width;
    let targetH = preset.height;
    if (targetW > 1920 || targetH > 1920) {
      const scale = 1920 / Math.max(targetW, targetH);
      targetW = Math.round((targetW * scale) / 2) * 2;
      targetH = Math.round((targetH * scale) / 2) * 2;
    } else {
      targetW = Math.round(targetW / 2) * 2;
      targetH = Math.round(targetH / 2) * 2;
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context unavailable");

    let videoEl: HTMLVideoElement | null = null;
    let imageEl: HTMLImageElement | null = null;
    let srcW = 1200;
    let srcH = 1200;

    if (media.type === "video") {
      videoEl = document.createElement("video");
      videoEl.crossOrigin = "anonymous";
      videoEl.playsInline = true;
      videoEl.muted = true;
      videoEl.src = media.previewUrl;
      await new Promise<void>((resolve) => {
        videoEl!.onloadedmetadata = () => resolve();
        videoEl!.onerror = () => resolve();
        setTimeout(resolve, 2500);
      });
      srcW = videoEl.videoWidth || 1280;
      srcH = videoEl.videoHeight || 720;
    } else {
      imageEl = new Image();
      imageEl.crossOrigin = "anonymous";
      imageEl.src = media.previewUrl;
      await new Promise<void>((resolve) => {
        imageEl!.onload = () => resolve();
        imageEl!.onerror = () => resolve();
      });
      srcW = imageEl.width || 1200;
      srcH = imageEl.height || 1200;
    }

    let logoImg: HTMLImageElement | null = null;
    if (branding.logo.enabled && branding.logo.url) {
      logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      logoImg.src = branding.logo.url;
      await new Promise((res) => {
        logoImg!.onload = res;
        logoImg!.onerror = res;
      });
    }

    const stream = canvas.captureStream(30);

    const preferredTypes = [
      "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
      "video/mp4;codecs=avc1",
      "video/mp4",
      "video/webm;codecs=h264",
      "video/webm;codecs=vp9",
      "video/webm",
    ];

    let chosenMime = "video/mp4";
    for (const t of preferredTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) {
        chosenMime = t;
        break;
      }
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: chosenMime,
      videoBitsPerSecond: 8000000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    const srcRatio = srcW / srcH;
    const targetRatio = targetW / targetH;
    let baseW = srcW;
    let baseH = srcH;
    if (srcRatio > targetRatio) {
      baseW = srcH * targetRatio;
    } else {
      baseH = srcW / targetRatio;
    }

    const effectiveTransform = presetTransforms?.[preset.id] || transform || {
      zoom: 1.0,
      panX: 0,
      panY: 0,
      focalPosition: "center",
    };
    const zoom = effectiveTransform.zoom || 1.0;
    const sWidth = baseW / zoom;
    const sHeight = baseH / zoom;
    const excessX = Math.max(0, srcW - sWidth);
    const excessY = Math.max(0, srcH - sHeight);
    const normX = Math.max(0, Math.min(1, ((effectiveTransform.panX || 0) + 50) / 100));
    const normY = Math.max(0, Math.min(1, ((effectiveTransform.panY || 0) + 50) / 100));
    const sx = excessX * normX;
    const sy = excessY * normY;

    const renderFrame = (progress: number) => {
      ctx.clearRect(0, 0, targetW, targetH);

      if (videoEl) {
        ctx.drawImage(videoEl, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);
      } else if (imageEl) {
        const motionZoom = zoom * (1 + progress * 0.04);
        const mW = baseW / motionZoom;
        const mH = baseH / motionZoom;
        const mExcessX = Math.max(0, srcW - mW);
        const mExcessY = Math.max(0, srcH - mH);
        const msx = mExcessX * normX;
        const msy = mExcessY * normY;
        ctx.drawImage(imageEl, msx, msy, mW, mH, 0, 0, targetW, targetH);
      }

      // Draw Logo
      if (logoImg && branding.logo.enabled) {
        const logoWidth = targetW * (branding.logo.size / 100) * 0.8;
        const logoAspect = (logoImg.width || 1) / (logoImg.height || 1);
        const logoHeight = logoWidth / logoAspect;
        ctx.save();
        ctx.globalAlpha = branding.logo.opacity / 100;
        let lx = targetW - logoWidth - 40;
        let ly = 40;
        if (branding.logo.position === "top-left") { lx = 40; ly = 40; }
        else if (branding.logo.position === "bottom-left") { lx = 40; ly = targetH - logoHeight - 40; }
        else if (branding.logo.position === "bottom-right") { lx = targetW - logoWidth - 40; ly = targetH - logoHeight - 40; }
        else if (branding.logo.position === "center") { lx = (targetW - logoWidth) / 2; ly = (targetH - logoHeight) / 2; }
        ctx.drawImage(logoImg, lx, ly, logoWidth, logoHeight);
        ctx.restore();
      }

      // Draw Brand Name
      if (branding.brandName.enabled && branding.brandName.text) {
        ctx.save();
        ctx.globalAlpha = branding.brandName.opacity / 100;
        const scaledFontSize = Math.max(16, Math.round((targetW / 1080) * branding.brandName.size * 1.5));
        ctx.font = `bold ${scaledFontSize}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = 8;
        let bnx = 40;
        let bny = targetH - 40;
        if (branding.brandName.position === "top-left") { ctx.textAlign = "left"; bnx = 40; bny = 40 + scaledFontSize; }
        else if (branding.brandName.position === "top-right") { ctx.textAlign = "right"; bnx = targetW - 40; bny = 40 + scaledFontSize; }
        else if (branding.brandName.position === "bottom-right") { ctx.textAlign = "right"; bnx = targetW - 40; bny = targetH - 40; }
        else if (branding.brandName.position === "bottom-left") { ctx.textAlign = "left"; bnx = 40; bny = targetH - 40; }
        else if (branding.brandName.position === "center") { ctx.textAlign = "center"; bnx = targetW / 2; bny = targetH / 2; }
        ctx.fillText(branding.brandName.text, bnx, bny);
        ctx.restore();
      }

      // Draw Watermark
      if (branding.watermark.enabled && branding.watermark.text) {
        ctx.save();
        ctx.globalAlpha = branding.watermark.opacity / 100;
        const scaledWmSize = Math.max(12, Math.round((targetW / 1080) * branding.watermark.size * 1.3));
        ctx.font = `500 ${scaledWmSize}px sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
        ctx.shadowBlur = 6;
        let wx = targetW - 40;
        let wy = targetH - 40;
        if (branding.watermark.position === "top-left") { ctx.textAlign = "left"; wx = 40; wy = 40 + scaledWmSize; }
        else if (branding.watermark.position === "top-right") { ctx.textAlign = "right"; wx = targetW - 40; wy = 40 + scaledWmSize; }
        else if (branding.watermark.position === "bottom-left") { ctx.textAlign = "left"; wx = 40; wy = targetH - 40; }
        else if (branding.watermark.position === "center") { ctx.textAlign = "center"; wx = targetW / 2; wy = targetH / 2; }
        else { ctx.textAlign = "right"; wx = targetW - 40; wy = targetH - 40; }
        ctx.fillText(branding.watermark.text, wx, wy);
        ctx.restore();
      }
    };

    const durationSec = videoEl
      ? Math.min(Math.max(videoEl.duration || 5, 1), 60)
      : 4;

    const fps = 30;
    const totalFrames = Math.round(durationSec * fps);

    recorder.start(250);

    if (videoEl) {
      videoEl.currentTime = 0;
      await videoEl.play().catch(() => {});
    }

    let frameCount = 0;
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        frameCount++;
        const prog = Math.min(1, frameCount / totalFrames);
        onProgress?.(Math.round(prog * 100));
        renderFrame(prog);

        if (frameCount >= totalFrames || (videoEl && videoEl.ended)) {
          clearInterval(interval);
          if (videoEl) videoEl.pause();
          resolve();
        }
      }, 1000 / fps);
    });

    const finalBlob = await new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunks, { type: "video/mp4" }));
      };
      recorder.stop();
    });

    stream.getTracks().forEach((t) => t.stop());

    return finalBlob;
  };

  // Helper to download format as PNG, JPG, WebP, SVG, or MP4
  const handleDownloadFormat = async (preset: FormatPreset, formatOverride?: ExportFileFormat) => {
    const fileFormat = formatOverride || selectedFormat;
    setDownloadingId(preset.id);

    const cleanName = (fileName.trim() || "branded-media")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

    try {
      if (fileFormat === "mp4") {
        // Record and download branded MP4 video
        setVideoRenderProgress((prev) => ({ ...prev, [preset.id]: 0 }));
        const videoBlob = await recordBrandedVideoBlob(preset, (pct) => {
          setVideoRenderProgress((prev) => ({ ...prev, [preset.id]: pct }));
        });
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cleanName}-${preset.id}-${preset.width}x${preset.height}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (fileFormat === "svg") {
        // Generate Vector SVG file
        const canvas = await drawBrandedCanvas(preset);
        const dataUrl = canvas.toDataURL("image/png");

        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${preset.width}" height="${preset.height}" viewBox="0 0 ${preset.width} ${preset.height}">
  <title>${cleanName} - ${preset.name}</title>
  <image href="${dataUrl}" width="${preset.width}" height="${preset.height}" />
</svg>`;

        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cleanName}-${preset.id}-${preset.width}x${preset.height}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Canvas export (PNG, JPEG, WebP)
        const canvas = await drawBrandedCanvas(preset);
        let mimeType = "image/png";
        let ext = "png";

        if (fileFormat === "jpg") {
          mimeType = "image/jpeg";
          ext = "jpg";
        } else if (fileFormat === "webp") {
          mimeType = "image/webp";
          ext = "webp";
        }

        const dataUrl = canvas.toDataURL(mimeType, 0.92);
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${cleanName}-${preset.id}-${preset.width}x${preset.height}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // Mark this preset as downloaded
      setDownloadedPresetIds((prev) => new Set(prev).add(preset.id));
    } catch (err) {
      console.error("Download failed, fallback to raw media url", err);
      const a = document.createElement("a");
      a.href = media.previewUrl;
      a.download = `${cleanName}-${preset.id}.${fileFormat}`;
      a.click();
    } finally {
      setTimeout(() => setDownloadingId(null), 400);
    }
  };

  // Download all generated formats packed inside a single ZIP file
  const handleDownloadZip = async () => {
    setDownloadAllActive(true);
    setZipProgress("0%");

    const cleanName = (fileName.trim() || "branded-media")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

    try {
      const zip = new JSZip();
      const folder = zip.folder(cleanName) || zip;

      for (let i = 0; i < selectedPresets.length; i++) {
        const preset = selectedPresets[i];
        setZipProgress(`${i + 1}/${selectedPresets.length}`);

        if (selectedFormat === "mp4") {
          setZipProgress(`${i + 1}/${selectedPresets.length} (Rendering MP4...)`);
          const videoBlob = await recordBrandedVideoBlob(preset, (pct) => {
            setZipProgress(`${i + 1}/${selectedPresets.length} (${pct}%)`);
          });
          folder.file(`${cleanName}-${preset.id}-${preset.width}x${preset.height}.mp4`, videoBlob);
        } else if (selectedFormat === "svg") {
          const canvas = await drawBrandedCanvas(preset);
          const dataUrl = canvas.toDataURL("image/png");
          const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${preset.width}" height="${preset.height}" viewBox="0 0 ${preset.width} ${preset.height}">
  <title>${cleanName} - ${preset.name}</title>
  <image href="${dataUrl}" width="${preset.width}" height="${preset.height}" />
</svg>`;
          folder.file(`${cleanName}-${preset.id}-${preset.width}x${preset.height}.svg`, svgContent);
        } else {
          const canvas = await drawBrandedCanvas(preset);
          let mimeType = "image/png";
          let ext = "png";

          if (selectedFormat === "jpg") {
            mimeType = "image/jpeg";
            ext = "jpg";
          } else if (selectedFormat === "webp") {
            mimeType = "image/webp";
            ext = "webp";
          }

          const blob = await new Promise<Blob | null>((resolve) => {
            canvas.toBlob((b) => resolve(b), mimeType, 0.92);
          });

          if (blob) {
            folder.file(`${cleanName}-${preset.id}-${preset.width}x${preset.height}.${ext}`, blob);
          }
        }

        // Mark all as downloaded
        setDownloadedPresetIds((prev) => new Set(prev).add(preset.id));
      }

      setZipProgress("Packaging ZIP...");
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cleanName}-${selectedFormat}-all-formats.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation error:", err);
    } finally {
      setDownloadAllActive(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar matching Reference Mockup */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        {/* Left Section: Status & Ready Summary */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <Check className="h-6 w-6 stroke-[3]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Your branded media is ready!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {selectedPresets.length} formats rendered with custom per-platform framing & branding.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Generated in 24 seconds</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span>{selectedPresets.length} formats ready</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: All action controls on ONE single line */}
        <div className="flex flex-wrap lg:flex-nowrap items-end gap-2.5 sm:gap-3 shrink-0">
          {/* Project Name Input */}
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              Project name
            </label>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs h-[38px]">
              <Pencil className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, "-"))}
                placeholder="fashion-legacy"
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none w-28 sm:w-36"
                title="Custom file name prefix for downloads"
              />
            </div>
          </div>

          {/* Format Selector */}
          <div>
            <label className="text-[11px] font-medium text-slate-500 block mb-1">
              Format
            </label>
            <div className="flex items-center gap-1 bg-slate-50/80 border border-slate-200 rounded-xl p-1 shadow-2xs h-[38px]">
              {(["png", "jpg", "webp", "svg", "mp4"] as ExportFileFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                    selectedFormat === fmt
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs h-[38px] cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5 text-slate-500" />
              <span>Edit</span>
            </button>
          </div>

          {/* Download All (ZIP) Button on the exact same row */}
          <div>
            <button
              type="button"
              onClick={handleDownloadZip}
              disabled={downloadAllActive}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-sm shadow-indigo-100 transition-all disabled:opacity-75 cursor-pointer whitespace-nowrap h-[38px]"
            >
              {downloadAllActive ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Packaging ZIP {zipProgress ? `(${zipProgress})` : "..."}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Download All (ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Generated Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {selectedPresets.map((preset) => {
          const isDownloading = downloadingId === preset.id;
          const isDownloaded = downloadedPresetIds.has(preset.id);
          const formatTransform = presetTransforms?.[preset.id] || transform || {
            zoom: 1.0,
            panX: 0,
            panY: 0,
            focalPosition: "center",
          };
          const cardObjPosX = Math.max(0, Math.min(100, (formatTransform?.panX || 0) + 50));
          const cardObjPosY = Math.max(0, Math.min(100, (formatTransform?.panY || 0) + 50));

          return (
            <div
              key={preset.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Card Header matching reference mockup */}
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {getPlatformIcon(preset)}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {preset.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                      <span>
                        {preset.width} × {preset.height}
                      </span>
                      <span>•</span>
                      <span>
                        {preset.aspectRatio}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 capitalize">
                    {formatTransform.focalPosition || "center"}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 capitalize">
                    {preset.category}
                  </span>
                </div>
              </div>

              {/* Real Aspect Ratio Preview Stage */}
              <div className="relative w-full h-[220px] rounded-xl bg-slate-950 p-2 flex items-center justify-center mb-4 border border-slate-200/80 shadow-inner overflow-hidden select-none">
                {/* The Real Ratio Frame */}
                <div
                  style={{
                    aspectRatio: `${preset.width} / ${preset.height}`,
                  }}
                  className="relative h-full max-h-full max-w-full rounded-lg overflow-hidden border border-indigo-500/40 shadow-md bg-black flex items-center justify-center shrink-0 group cursor-pointer"
                  onClick={(e) => {
                    if (media.type === "video") togglePlay(preset.id, e);
                  }}
                >
                  {media.type === "video" ? (
                    <>
                      {/* Live Video Element with Exact Per-Preset Framing */}
                      <video
                        ref={(el) => {
                          videoRefs.current[preset.id] = el;
                        }}
                        src={media.previewUrl}
                        poster={media.thumbnailUrl || undefined}
                        playsInline
                        loop
                        muted={mutedMap[preset.id] ?? true}
                        className="absolute inset-0 h-full w-full object-cover select-none"
                        style={{
                          objectPosition: `${cardObjPosX}% ${cardObjPosY}%`,
                          transform: `scale(${formatTransform?.zoom || 1})`,
                          transformOrigin: `${cardObjPosX}% ${cardObjPosY}%`,
                        }}
                        onPlay={() => setPlayingPresets((prev) => ({ ...prev, [preset.id]: true }))}
                        onPause={() => setPlayingPresets((prev) => ({ ...prev, [preset.id]: false }))}
                      />

                      {/* Branding Overlays on top of the live video */}
                      {branding.logo.enabled && branding.logo.url && (
                        <div
                          className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                            branding.logo.position
                          )}`}
                          style={{ opacity: branding.logo.opacity / 100 }}
                        >
                          <div
                            className="drop-shadow-md rounded bg-white/10 backdrop-blur-2xs p-0.5"
                            style={{
                              width: `${Math.max(22, Math.min(55, preset.width * (branding.logo.size / 100) * 0.15))}px`,
                            }}
                          >
                            <img
                              src={branding.logo.url}
                              alt="Logo"
                              className="max-h-5 w-auto object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {branding.brandName.enabled && branding.brandName.text && (
                        <div
                          className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                            branding.brandName.position
                          )}`}
                          style={{ opacity: branding.brandName.opacity / 100 }}
                        >
                          <div className="bg-black/50 backdrop-blur-2xs px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold text-white tracking-wider leading-none shadow-sm">
                            {branding.brandName.text}
                          </div>
                        </div>
                      )}

                      {branding.watermark.enabled && branding.watermark.text && (
                        <div
                          className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                            branding.watermark.position
                          )}`}
                          style={{ opacity: branding.watermark.opacity / 100 }}
                        >
                          <div className="bg-black/40 backdrop-blur-2xs px-1.5 py-0.5 rounded text-[7px] font-medium text-white/90 leading-none shadow-xs">
                            {branding.watermark.text}
                          </div>
                        </div>
                      )}

                      {/* Floating Play / Pause Overlay */}
                      <div
                        className={`absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-200 ${
                          playingPresets[preset.id]
                            ? "opacity-0 hover:opacity-100 bg-black/25"
                            : "opacity-100 bg-black/35"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => togglePlay(preset.id, e)}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          title={playingPresets[preset.id] ? "Pause video" : "Play video"}
                        >
                          {playingPresets[preset.id] ? (
                            <Pause className="h-5 w-5 fill-white" />
                          ) : (
                            <Play className="h-5 w-5 fill-white ml-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Top Left [VIDEO] Badge & Status */}
                      <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 pointer-events-none">
                        <span className="flex items-center gap-1 rounded bg-black/80 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                          <Video className="h-2.5 w-2.5 text-indigo-400" />
                          <span>VIDEO</span>
                        </span>
                        {playingPresets[preset.id] && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </div>

                      {/* Top Right: Sound Mute & Expand Preview Buttons */}
                      <div className="absolute top-2 right-2 z-30 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => toggleMute(preset.id, e)}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-black/75 hover:bg-black/95 text-white shadow-xs transition-colors cursor-pointer"
                          title={mutedMap[preset.id] ?? true ? "Unmute audio" : "Mute audio"}
                        >
                          {mutedMap[preset.id] ?? true ? (
                            <VolumeX className="h-3 w-3 text-slate-300" />
                          ) : (
                            <Volume2 className="h-3 w-3 text-emerald-400" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalPreset(preset);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-black/75 hover:bg-black/95 text-white shadow-xs transition-colors cursor-pointer"
                          title="Open large preview modal"
                        >
                          <Maximize2 className="h-3 w-3 text-slate-300" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Image Static Preview */
                    <>
                      {renderedPreviews[preset.id] ? (
                        <img
                          src={renderedPreviews[preset.id]}
                          alt={preset.name}
                          className="h-full w-full object-contain select-none"
                        />
                      ) : (
                        <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
                          <img
                            src={media.previewUrl}
                            alt={preset.name}
                            className="absolute inset-0 h-full w-full object-cover select-none"
                            style={{
                              objectPosition: `${cardObjPosX}% ${cardObjPosY}%`,
                              transform: `scale(${formatTransform?.zoom || 1})`,
                              transformOrigin: `${cardObjPosX}% ${cardObjPosY}%`,
                            }}
                          />
                          {branding.logo.enabled && branding.logo.url && (
                            <div className="absolute top-2 right-2 max-w-[25%] bg-white/20 backdrop-blur-xs p-0.5 rounded z-10">
                              <img
                                src={branding.logo.url}
                                alt="Logo"
                                className="max-h-5 w-auto object-contain"
                              />
                            </div>
                          )}
                          {branding.brandName.enabled && branding.brandName.text && (
                            <div className="absolute bottom-2 left-2 bg-black/40 px-1.5 py-0.5 rounded text-[9px] font-bold text-white tracking-wider z-10 leading-none">
                              {branding.brandName.text}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Real Aspect Ratio Pill Badge */}
                  <div className="absolute bottom-1 right-1 pointer-events-none rounded bg-black/75 px-1 py-0.5 text-[8px] font-mono font-semibold text-white/90 z-20">
                    {preset.aspectRatio}
                  </div>
                </div>
              </div>

              {/* Card Action Row: Lavender Download Button + 3-dots Menu Button */}
              <div className="relative mt-auto flex items-center gap-2" data-dropdown-menu>
                {isDownloading ? (
                  <button
                    type="button"
                    disabled
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50/70 py-2 px-3 text-xs sm:text-sm font-semibold text-indigo-500 cursor-not-allowed h-[38px]"
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    <span className="truncate">
                      {selectedFormat === "mp4" && videoRenderProgress[preset.id] !== undefined
                        ? `Rendering (${videoRenderProgress[preset.id]}%)...`
                        : "Downloading..."}
                    </span>
                  </button>
                ) : isDownloaded ? (
                  <button
                    type="button"
                    onClick={() => handleDownloadFormat(preset)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-2 px-3 text-xs sm:text-sm font-semibold text-emerald-800 transition-all shadow-2xs group cursor-pointer h-[38px]"
                    title="Click to download this format again"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-emerald-600 transition-transform group-hover:-rotate-45" />
                    <span className="truncate">Download {selectedFormat.toUpperCase()}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDownloadFormat(preset)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-3 text-xs sm:text-sm font-bold transition-colors shadow-2xs cursor-pointer h-[38px]"
                  >
                    <Download className="h-4 w-4 text-indigo-600 stroke-[2.5]" />
                    <span className="truncate">Download {selectedFormat.toUpperCase()}</span>
                  </button>
                )}

                {/* 3-dots Menu Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuPresetId(openMenuPresetId === preset.id ? null : preset.id);
                    }}
                    className={`h-[38px] w-[38px] flex items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer ${
                      openMenuPresetId === preset.id ? "bg-slate-100 ring-2 ring-indigo-500/20" : "bg-white"
                    }`}
                    title="More export options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {/* Dropdown Options */}
                  {openMenuPresetId === preset.id && (
                    <div
                      className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Download As
                      </div>
                      {(["png", "jpg", "webp", "svg"] as ExportFileFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => {
                            setOpenMenuPresetId(null);
                            handleDownloadFormat(preset, fmt);
                          }}
                          className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>{fmt.toUpperCase()} Image</span>
                          {selectedFormat === fmt && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                        </button>
                      ))}

                      {media.type === "video" && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPresetId(null);
                              handleDownloadFormat(preset, "mp4");
                            }}
                            className="flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>MP4 Video</span>
                            {selectedFormat === "mp4" && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuPresetId(null);
                              handleDownloadFormat(preset, "jpg");
                            }}
                            className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <Camera className="h-3.5 w-3.5 text-slate-400" />
                            <span>Thumbnail Frame</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Return Option */}
      <div className="flex items-center justify-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Upload Another Image or Video</span>
        </button>
      </div>

      {/* Large High-Res Video/Image Preview Modal */}
      {previewModalPreset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setPreviewModalPreset(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Video className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {previewModalPreset.name} Preview
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {previewModalPreset.width} × {previewModalPreset.height} • {previewModalPreset.aspectRatio}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewModalPreset(null)}
                className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Video Viewport */}
            <div className="relative w-full h-[60vh] max-h-[480px] flex items-center justify-center bg-black rounded-2xl overflow-hidden p-2">
              <div
                style={{
                  aspectRatio: `${previewModalPreset.width} / ${previewModalPreset.height}`,
                }}
                className="relative h-full max-h-full max-w-full rounded-xl overflow-hidden border border-indigo-500/50 bg-black flex items-center justify-center"
              >
                {media.type === "video" ? (
                  <video
                    src={media.previewUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      objectPosition: `${Math.max(
                        0,
                        Math.min(100, (presetTransforms?.[previewModalPreset.id]?.panX || 0) + 50)
                      )}% ${Math.max(
                        0,
                        Math.min(100, (presetTransforms?.[previewModalPreset.id]?.panY || 0) + 50)
                      )}%`,
                      transform: `scale(${presetTransforms?.[previewModalPreset.id]?.zoom || 1})`,
                      transformOrigin: `${Math.max(
                        0,
                        Math.min(100, (presetTransforms?.[previewModalPreset.id]?.panX || 0) + 50)
                      )}% ${Math.max(
                        0,
                        Math.min(100, (presetTransforms?.[previewModalPreset.id]?.panY || 0) + 50)
                      )}%`,
                    }}
                  />
                ) : (
                  <img
                    src={renderedPreviews[previewModalPreset.id] || media.previewUrl}
                    alt={previewModalPreset.name}
                    className="h-full w-full object-contain"
                  />
                )}

                {/* Modal Branding Overlays if video */}
                {media.type === "video" && branding.logo.enabled && branding.logo.url && (
                  <div
                    className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                      branding.logo.position
                    )}`}
                    style={{ opacity: branding.logo.opacity / 100 }}
                  >
                    <div className="bg-white/10 backdrop-blur-2xs p-1 rounded">
                      <img
                        src={branding.logo.url}
                        alt="Logo"
                        className="max-h-8 w-auto object-contain"
                      />
                    </div>
                  </div>
                )}

                {media.type === "video" && branding.brandName.enabled && branding.brandName.text && (
                  <div
                    className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                      branding.brandName.position
                    )}`}
                    style={{ opacity: branding.brandName.opacity / 100 }}
                  >
                    <div className="bg-black/50 px-2 py-1 rounded text-xs font-bold text-white tracking-wider">
                      {branding.brandName.text}
                    </div>
                  </div>
                )}

                {media.type === "video" && branding.watermark.enabled && branding.watermark.text && (
                  <div
                    className={`absolute pointer-events-none z-20 flex ${getPositionClass(
                      branding.watermark.position
                    )}`}
                    style={{ opacity: branding.watermark.opacity / 100 }}
                  >
                    <div className="bg-black/40 px-2 py-0.5 rounded text-[10px] text-white/90">
                      {branding.watermark.text}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                Framed specifically for {previewModalPreset.name} ({previewModalPreset.category})
              </span>

              <button
                type="button"
                onClick={() => {
                  handleDownloadFormat(previewModalPreset);
                  setPreviewModalPreset(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download .{selectedFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
