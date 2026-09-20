export type GeneratorState =
  | "empty"
  | "file_selected"
  | "branding_editor"
  | "format_selection"
  | "generating"
  | "result"
  | "limit_reached"
  | "error";

export type OverlayPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "center"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface MediaFile {
  name: string;
  size: number;
  type: "image" | "video";
  previewUrl: string;
  width?: number;
  height?: number;
  rawFile?: File;
  thumbnailUrl?: string;
  customThumbnailUrl?: string;
  thumbnailSource?: "auto" | "captured" | "custom";
}

export interface LogoConfig {
  enabled: boolean;
  url: string;
  size: number; // percentage 10 - 40
  opacity: number; // percentage 10 - 100
  position: OverlayPosition;
}

export interface BrandNameConfig {
  enabled: boolean;
  text: string;
  size: number; // font size 12 - 40px
  opacity: number; // percentage 10 - 100
  position: OverlayPosition;
  fontFamily?: string;
  color?: string;
}

export interface WatermarkConfig {
  enabled: boolean;
  type?: "text" | "image";
  text: string;
  imageUrl?: string;
  size: number; // font size 10 - 28px or image size %
  opacity: number; // percentage 10 - 100
  position: OverlayPosition;
  fontFamily?: string;
}

export interface BrandingSettings {
  logo: LogoConfig;
  brandName: BrandNameConfig;
  watermark: WatermarkConfig;
  brandKitId?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface BrandKitDefinition {
  id: string;
  name: string;
  logoUrl?: string;
  brandName: string;
  watermarkText?: string;
  watermarkImageUrl?: string;
  watermarkType?: "text" | "image";
  primaryColor: string;
  secondaryColor: string;
  headingFont?: string;
  defaultLogoPosition?: OverlayPosition;
  defaultLogoSize?: number;
  defaultOpacity?: number;
  isDefault?: boolean;
}

export interface FormatPreset {
  id: string;
  name: string;
  category: "Instagram" | "Facebook" | "YouTube" | "Website" | "TikTok" | "Custom";
  width: number;
  height: number;
  aspectRatio: string;
  isCustom?: boolean;
}

export type ExportFileFormat = "png" | "jpg" | "webp" | "svg" | "mp4";

export type PreviewRatio = "square" | "portrait" | "story" | "landscape";

export interface MediaFrameTransform {
  zoom: number; // 1.0 to 3.0
  panX: number; // -50 to 50
  panY: number; // -50 to 50
  focalPosition?: "top" | "center" | "bottom" | "left" | "right" | "custom";
}

export interface GeneratedFormatResult {
  preset: FormatPreset;
  previewUrl: string;
  downloadUrl: string;
  fileSize: string;
}

export interface RecentGeneration {
  id: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  mediaName: string;
  mediaType: "image" | "video";
  thumbnailUrl: string; // Base64 data URL
  branding: BrandingSettings;
  transform: MediaFrameTransform;
  presetTransforms?: Record<string, MediaFrameTransform>;
  previewRatio: PreviewRatio;
  formatsCount: number;
  selectedPresetIds: string[];
  brandKitName?: string;
  customFileName?: string;
}



