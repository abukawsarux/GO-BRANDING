"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  Square,
  Sparkles,
  Gift,
  Film,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { MediaFile } from "@/types/generator";
import { extractVideoFrame } from "@/lib/video-thumbnail";

interface UploadZoneProps {
  onFileSelected: (media: MediaFile) => void;
  generationsRemaining: number;
}

const SUPPORTED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"];
const MAX_FILE_SIZE_MB = 100;

export function UploadZone({ onFileSelected, generationsRemaining }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // 1. File extension & format validation
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const isVideo = file.type.startsWith("video/") || ["mp4", "mov", "webm"].includes(ext);
    const isImage = file.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(ext);

    if (!isImage && !isVideo) {
      setErrorMessage(
        `Unsupported file type (.${ext || "unknown"}). Please upload a JPG, PNG, WebP, MP4, MOV, or WebM file.`
      );
      return;
    }

    // 2. File size check (Max 100MB)
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    // 3. Simulated progress for UX feedback
    setUploadProgress(25);
    const previewUrl = URL.createObjectURL(file);

    try {
      if (isVideo) {
        setUploadProgress(50);
        let extractedThumb: string | undefined = undefined;
        try {
          extractedThumb = await extractVideoFrame(previewUrl, 0.5);
        } catch (err) {
          console.warn("Could not extract initial frame:", err);
        }

        setUploadProgress(80);
        const vid = document.createElement("video");
        vid.onloadedmetadata = () => {
          setUploadProgress(100);
          setTimeout(() => {
            setUploadProgress(null);
            onFileSelected({
              name: file.name,
              size: file.size,
              type: "video",
              previewUrl,
              rawFile: file,
              width: vid.videoWidth || 1920,
              height: vid.videoHeight || 1080,
              thumbnailUrl: extractedThumb,
              thumbnailSource: "auto",
            });
          }, 200);
        };
        vid.onerror = () => {
          setUploadProgress(null);
          setErrorMessage("Failed to read video metadata. Please check the file codec.");
        };
        vid.src = previewUrl;
      } else {
        setUploadProgress(65);
        const img = new Image();
        img.onload = () => {
          setUploadProgress(100);
          setTimeout(() => {
            setUploadProgress(null);
            onFileSelected({
              name: file.name,
              size: file.size,
              type: "image",
              previewUrl,
              rawFile: file,
              width: img.naturalWidth || 1080,
              height: img.naturalHeight || 1350,
            });
          }, 200);
        };
        img.onerror = () => {
          setUploadProgress(null);
          setErrorMessage("Failed to decode image. The file may be damaged.");
        };
        img.src = previewUrl;
      }
    } catch (err) {
      setUploadProgress(null);
      setErrorMessage("An unexpected error occurred while processing the file. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sampleType: "product" | "video" | "sneaker" | "travel") => {
    if (sampleType === "product") {
      onFileSelected({
        name: "lumina-headphone.jpg",
        size: 1420000,
        type: "image",
        previewUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        width: 1200,
        height: 1200,
      });
    } else if (sampleType === "video") {
      onFileSelected({
        name: "brand-campaign-promo.mp4",
        size: 3200000,
        type: "video",
        previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        width: 1920,
        height: 1080,
        thumbnailSource: "auto",
      });
    } else if (sampleType === "sneaker") {
      onFileSelected({
        name: "sneaker-ad-720w.jpg",
        size: 1650000,
        type: "image",
        previewUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        width: 1200,
        height: 1200,
      });
    } else {
      onFileSelected({
        name: "travel-story.jpg",
        size: 1530000,
        type: "image",
        previewUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        width: 1080,
        height: 1920,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Error Alert Box */}
      {errorMessage && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-rose-800 shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="rounded-lg p-1 text-rose-600 hover:bg-rose-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 1. Main Upload Container (2-column layout matching reference mockup) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left / Center Area: Dashed Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploadProgress && fileInputRef.current?.click()}
            className={`lg:col-span-8 group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                : "border-indigo-200/90 hover:border-indigo-400 bg-slate-50/40 hover:bg-slate-50/70"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            {uploadProgress !== null ? (
              /* Upload Progress State */
              <div className="w-full max-w-sm flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <h4 className="text-base font-bold text-slate-900">Loading Media...</h4>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">{uploadProgress}%</span>
              </div>
            ) : (
              /* Regular Idle / Drop State */
              <>
                {/* Cloud Upload Icon Badge */}
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 transition-transform group-hover:scale-105 shadow-2xs">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 16 4-4 4 4" />
                  </svg>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Upload your image or video
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md">
                  Drag and drop your file here, or click to browse from your device
                </p>

                {/* Primary Browse Files Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all hover:shadow cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Browse Files</span>
                </button>

                {/* Supported Formats Chips */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-600 mr-1">Supported:</span>
                  {SUPPORTED_EXTENSIONS.map((format) => (
                    <span
                      key={format}
                      className="rounded-md bg-white px-2.5 py-1 font-semibold text-slate-700 border border-slate-200/90 shadow-2xs uppercase"
                    >
                      {format}
                    </span>
                  ))}
                  <span className="text-slate-400 ml-1">(Up to 100MB)</span>
                </div>
              </>
            )}
          </div>

          {/* Right Column: Main Title & 3 Feature highlights */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-4.5 lg:pl-5 lg:border-l lg:border-slate-200/70">
            {/* Main Headline & Subtitle matching user request */}
            <div className="space-y-1.5 pb-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/80 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 shadow-2xs">
                <Sparkles className="h-3 w-3 text-indigo-600" />
                <span>Automated Media Branding</span>
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 leading-snug">
                Make Every Image & Video Look Like Your Brand.
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add your logo, watermark and brand styling across all social formats in seconds.
              </p>
            </div>

            {/* Feature 1 */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shrink-0 border border-indigo-100/60 shadow-2xs">
                <ImageIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Add your logo & brand
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Keep your brand consistent everywhere
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100/60 shadow-2xs">
                <Square className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Choose multi-format sizes
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Instagram, YouTube, TikTok, Facebook & Web
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100/60 shadow-2xs">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Generate instantly
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Export high-res images and MP4 videos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Free Generations Strip & Sample Shortcuts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 px-6 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Gift className="h-4 w-4" />
          </div>
          <span>
            <strong className="text-slate-900">{generationsRemaining} free generations</strong> every day — no account required.
          </span>
        </div>

        {/* Or try a sample buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Or try a sample:</span>
          <button
            type="button"
            onClick={() => handleSampleSelect("product")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            Product Photo
          </button>
          <button
            type="button"
            onClick={() => handleSampleSelect("video")}
            className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
          >
            <Film className="h-3 w-3" />
            <span>Sample Video (MP4)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSampleSelect("sneaker")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            Sneaker Ad
          </button>
          <button
            type="button"
            onClick={() => handleSampleSelect("travel")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-2xs cursor-pointer"
          >
            Travel Post
          </button>
        </div>
      </div>
    </div>
  );
}
