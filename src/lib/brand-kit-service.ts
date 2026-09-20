import { BrandKitDefinition, BrandingSettings } from "@/types/generator";
import { DEFAULT_SAMPLE_LOGO, DEFAULT_BRANDING } from "./generator-constants";

const BRAND_KIT_STORAGE_KEY = "brandgen_user_brand_kits_v1";

export const BUILTIN_BRAND_KITS: BrandKitDefinition[] = [
  {
    id: "kit-lumina",
    name: "Lumina Co.",
    brandName: "LUMINA CO.",
    logoUrl: DEFAULT_SAMPLE_LOGO,
    watermarkText: "© 2026 LUMINA CO • ALL RIGHTS RESERVED",
    watermarkType: "text",
    primaryColor: "#4F46E5",
    secondaryColor: "#06B6D4",
    headingFont: "Inter",
    defaultLogoPosition: "top-right",
    defaultLogoSize: 20,
    defaultOpacity: 90,
    isDefault: true,
  },
  {
    id: "kit-brandgen",
    name: "BrandGen Studio",
    brandName: "BRANDGEN",
    logoUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%234338CA"/><path d="M50 20L60 40L80 50L60 60L50 80L40 60L20 50L40 40Z" fill="white"/></svg>`,
    watermarkText: "BRANDGEN • POWERED BY BRANDGEN.AI",
    watermarkType: "text",
    primaryColor: "#4338CA",
    secondaryColor: "#818CF8",
    headingFont: "Space Grotesk",
    defaultLogoPosition: "top-right",
    defaultLogoSize: 22,
    defaultOpacity: 95,
  },
  {
    id: "kit-minimal-dark",
    name: "Minimalist Noir",
    brandName: "NOIR STUDIO",
    logoUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23000000"/><circle cx="50" cy="50" r="24" stroke="white" stroke-width="6"/></svg>`,
    watermarkText: "© NOIR STUDIO • ALL RIGHTS RESERVED",
    watermarkType: "text",
    primaryColor: "#09090B",
    secondaryColor: "#71717A",
    headingFont: "Montserrat",
    defaultLogoPosition: "top-left",
    defaultLogoSize: 18,
    defaultOpacity: 85,
  },
  {
    id: "kit-vibrant-creator",
    name: "Vibrant Social",
    brandName: "CREATOR LABS",
    logoUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="%23EC4899"/><path d="M35 30H65V70H35Z" stroke="white" stroke-width="8" stroke-linejoin="round"/></svg>`,
    watermarkText: "@CREATORLABS • #CREATORCONTENT",
    watermarkType: "text",
    primaryColor: "#EC4899",
    secondaryColor: "#F59E0B",
    headingFont: "Poppins",
    defaultLogoPosition: "bottom-left",
    defaultLogoSize: 24,
    defaultOpacity: 90,
  },
];

export function getBrandKits(): BrandKitDefinition[] {
  if (typeof window === "undefined") return BUILTIN_BRAND_KITS;

  try {
    const raw = localStorage.getItem(BRAND_KIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(BUILTIN_BRAND_KITS));
      return BUILTIN_BRAND_KITS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : BUILTIN_BRAND_KITS;
  } catch (err) {
    console.warn("Failed to read brand kits from localStorage:", err);
    return BUILTIN_BRAND_KITS;
  }
}

export function saveBrandKit(kit: BrandKitDefinition): BrandKitDefinition[] {
  if (typeof window === "undefined") return BUILTIN_BRAND_KITS;

  try {
    const existing = getBrandKits();
    const filtered = existing.filter((k) => k.id !== kit.id);
    const updated = [kit, ...filtered];
    localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn("Failed to save brand kit:", err);
    return BUILTIN_BRAND_KITS;
  }
}

export function deleteBrandKit(id: string): BrandKitDefinition[] {
  if (typeof window === "undefined") return BUILTIN_BRAND_KITS;

  try {
    const existing = getBrandKits();
    const updated = existing.filter((k) => k.id !== id);
    const finalKits = updated.length > 0 ? updated : BUILTIN_BRAND_KITS;
    localStorage.setItem(BRAND_KIT_STORAGE_KEY, JSON.stringify(finalKits));
    return finalKits;
  } catch (err) {
    console.warn("Failed to delete brand kit:", err);
    return BUILTIN_BRAND_KITS;
  }
}

export function applyBrandKitToBranding(
  kit: BrandKitDefinition,
  current: BrandingSettings
): BrandingSettings {
  return {
    ...current,
    brandKitId: kit.id,
    primaryColor: kit.primaryColor,
    secondaryColor: kit.secondaryColor,
    logo: {
      ...current.logo,
      enabled: true,
      url: kit.logoUrl || current.logo.url || DEFAULT_SAMPLE_LOGO,
      position: kit.defaultLogoPosition || current.logo.position || "top-right",
      size: kit.defaultLogoSize || current.logo.size || 20,
      opacity: kit.defaultOpacity || current.logo.opacity || 90,
    },
    brandName: {
      ...current.brandName,
      enabled: true,
      text: kit.brandName,
      fontFamily: kit.headingFont || current.brandName.fontFamily || "Inter",
      color: "#ffffff",
      opacity: kit.defaultOpacity || current.brandName.opacity || 90,
    },
    watermark: {
      ...current.watermark,
      enabled: Boolean(kit.watermarkText || kit.watermarkImageUrl),
      type: kit.watermarkType || "text",
      text: kit.watermarkText || current.watermark.text || "",
      imageUrl: kit.watermarkImageUrl || "",
      opacity: 65,
    },
  };
}

