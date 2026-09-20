import { FormatPreset, BrandingSettings } from "@/types/generator";

export const FORMAT_PRESETS: FormatPreset[] = [
  {
    id: "ig-square",
    name: "Instagram Square",
    category: "Instagram",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  {
    id: "ig-portrait",
    name: "Instagram Portrait",
    category: "Instagram",
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  {
    id: "ig-story",
    name: "Instagram Story/Reel",
    category: "Instagram",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "fb-post",
    name: "Facebook Post",
    category: "Facebook",
    width: 1200,
    height: 630,
    aspectRatio: "1.91:1",
  },
  {
    id: "fb-story",
    name: "Facebook Story",
    category: "Facebook",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "yt-thumb",
    name: "YouTube Thumbnail",
    category: "YouTube",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
  },
  {
    id: "tiktok-video",
    name: "TikTok",
    category: "TikTok",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
  },
  {
    id: "web-banner",
    name: "Website Banner",
    category: "Website",
    width: 1920,
    height: 800,
    aspectRatio: "2.4:1",
  },
  {
    id: "web-square",
    name: "Website Square",
    category: "Website",
    width: 1200,
    height: 1200,
    aspectRatio: "1:1",
  },
];

export const DEFAULT_SAMPLE_LOGO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%230F172A"/><path d="M30 70V30L55 52L80 30V70" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const DEFAULT_SAMPLE_IMAGE = `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80`;

export const DEFAULT_BRANDING: BrandingSettings = {
  logo: {
    enabled: true,
    url: DEFAULT_SAMPLE_LOGO,
    size: 20,
    opacity: 90,
    position: "top-right",
  },
  brandName: {
    enabled: true,
    text: "LUMINA CO.",
    size: 20,
    opacity: 90,
    position: "bottom-left",
  },
  watermark: {
    enabled: true,
    text: "© 2026 LUMINA CO • ALL RIGHTS RESERVED",
    size: 13,
    opacity: 60,
    position: "bottom-right",
  },
};

export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return "1:1";
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.02) return "1:1";
  if (Math.abs(ratio - 16 / 9) < 0.02) return "16:9";
  if (Math.abs(ratio - 9 / 16) < 0.02) return "9:16";
  if (Math.abs(ratio - 4 / 5) < 0.02) return "4:5";
  if (Math.abs(ratio - 5 / 4) < 0.02) return "5:4";
  if (Math.abs(ratio - 1.91) < 0.05) return "1.91:1";
  if (Math.abs(ratio - 4 / 3) < 0.02) return "4:3";
  if (Math.abs(ratio - 3 / 4) < 0.02) return "3:4";
  if (Math.abs(ratio - 2.4) < 0.05) return "2.4:1";

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(Math.round(width), Math.round(height));
  const rw = Math.round(width / divisor);
  const rh = Math.round(height / divisor);
  if (rw <= 30 && rh <= 30) {
    return `${rw}:${rh}`;
  }
  return `${(width / height).toFixed(2)}:1`;
}
