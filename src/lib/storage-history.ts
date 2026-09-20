import { RecentGeneration, BrandingSettings, MediaFrameTransform } from "@/types/generator";
import { DEFAULT_BRANDING } from "./generator-constants";

const STORAGE_KEY = "branded_media_recent_generations_v2";
const LEGACY_STORAGE_KEY = "branded_media_recent_generations_v1";
const MAX_HISTORY_ITEMS = 12;

// Production clean default: no dummy mockup projects
export const DEFAULT_RECENT_PROJECTS: RecentGeneration[] = [];

export function getRecentGenerations(): RecentGeneration[] {
  if (typeof window === "undefined") return [];

  try {
    // Purge legacy dummy mockups from v1 if present
    if (localStorage.getItem(LEGACY_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter out any legacy dummy projects (proj-1 through proj-5)
    const cleaned = parsed.filter(
      (item: RecentGeneration) =>
        item &&
        item.id !== "proj-1" &&
        item.id !== "proj-2" &&
        item.id !== "proj-3" &&
        item.id !== "proj-4" &&
        item.id !== "proj-5"
    );

    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch (err) {
    console.warn("Failed to read recent generations from localStorage:", err);
    return [];
  }
}

export function saveRecentGeneration(item: RecentGeneration): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentGenerations();
    const filtered = existing.filter((g) => g.id !== item.id);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Failed to save recent generation to localStorage:", err);
    try {
      const existing = getRecentGenerations().slice(0, 3);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([item, ...existing]));
    } catch {
      // Ignore fallback error
    }
  }
}

export function duplicateRecentGeneration(id: string): RecentGeneration[] {
  if (typeof window === "undefined") return [];

  try {
    const existing = getRecentGenerations();
    const item = existing.find((g) => g.id === id);
    if (!item) return existing;

    const baseName = item.mediaName.replace(/\s*\(Copy(\s*\d+)?\)/gi, "");
    const extMatch = baseName.match(/(\.[^.]+)$/);
    const ext = extMatch ? extMatch[1] : "";
    const nameWithoutExt = extMatch ? baseName.slice(0, -ext.length) : baseName;
    const duplicatedName = `${nameWithoutExt} (Copy)${ext}`;

    const duplicate: RecentGeneration = {
      ...item,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mediaName: duplicatedName,
    };

    const updated = [duplicate, ...existing].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to duplicate generation in localStorage:", err);
    return [];
  }
}

export function deleteRecentGeneration(id: string): RecentGeneration[] {
  if (typeof window === "undefined") return [];

  try {
    const existing = getRecentGenerations();
    const updated = existing.filter((g) => g.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to delete generation from localStorage:", err);
    return [];
  }
}

export function clearRecentGenerations(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.warn("Failed to clear recent generations:", err);
  }
}

/**
 * Creates a lightweight base64 thumbnail (max 320x320) for local storage
 * Supports both video frame extraction and images.
 */
export async function createThumbnailDataUrl(
  mediaUrl: string,
  branding: BrandingSettings,
  transform?: MediaFrameTransform,
  mediaType: "image" | "video" = "image",
  customThumbnailUrl?: string
): Promise<string> {
  if (typeof window === "undefined") return mediaUrl;

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return mediaUrl;

    let mediaDrawable: CanvasImageSource | null = null;
    let imgW = 320;
    let imgH = 320;

    // 1. If custom thumbnail provided, or media is an image:
    const baseSourceUrl = customThumbnailUrl || mediaUrl;

    if (customThumbnailUrl || mediaType === "image") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = baseSourceUrl;
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.onerror = () => res();
        setTimeout(res, 2500);
      });
      if (img.width > 0 && img.height > 0) {
        mediaDrawable = img;
        imgW = img.width;
        imgH = img.height;
      }
    }

    // 2. If video and no custom thumbnail loaded yet:
    if (!mediaDrawable && mediaType === "video") {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.playsInline = true;
      video.src = mediaUrl;
      await new Promise<void>((res) => {
        video.onloadedmetadata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) * 0.1);
        };
        video.onseeked = () => res();
        video.onerror = () => res();
        setTimeout(res, 3000);
      });

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        mediaDrawable = video;
        imgW = video.videoWidth;
        imgH = video.videoHeight;
      }
    }

    if (mediaDrawable) {
      const zoom = transform?.zoom || 1.0;
      const sWidth = Math.min(imgW, imgH) / zoom;
      const sHeight = Math.min(imgW, imgH) / zoom;

      const excessX = Math.max(0, imgW - sWidth);
      const excessY = Math.max(0, imgH - sHeight);
      const normX = Math.max(0, Math.min(1, ((transform?.panX || 0) + 50) / 100));
      const normY = Math.max(0, Math.min(1, ((transform?.panY || 0) + 50) / 100));
      const sx = excessX * normX;
      const sy = excessY * normY;

      ctx.drawImage(mediaDrawable, sx, sy, sWidth, sHeight, 0, 0, 320, 320);
    } else {
      // Fallback nice dark backdrop
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, 320, 320);
    }

    // Draw logo if enabled
    if (branding.logo.enabled && branding.logo.url) {
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = branding.logo.url;
      await new Promise<void>((res) => {
        logo.onload = () => res();
        logo.onerror = () => res();
        setTimeout(res, 1500);
      });
      if (logo.width > 0) {
        ctx.globalAlpha = branding.logo.opacity / 100;
        ctx.drawImage(logo, 320 - 70, 16, 54, 54 * ((logo.height || 1) / (logo.width || 1)));
        ctx.globalAlpha = 1.0;
      }
    }

    // Draw Brand Name text if enabled
    if (branding.brandName.enabled && branding.brandName.text) {
      ctx.globalAlpha = branding.brandName.opacity / 100;
      ctx.font = "bold 14px sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(0,0,0,0.8)";
      ctx.shadowBlur = 6;
      ctx.fillText(branding.brandName.text, 16, 300);
      ctx.globalAlpha = 1.0;
    }

    return canvas.toDataURL("image/jpeg", 0.75);
  } catch (err) {
    console.warn("Failed to generate thumbnail data url:", err);
    return mediaUrl;
  }
}
