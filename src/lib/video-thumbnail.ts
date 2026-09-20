/**
 * Utility to extract a snapshot frame from a video file or blob URL.
 */
export async function extractVideoFrame(
  videoSrc: string,
  seekTime: number = 0.5,
  maxWidth: number = 720
): Promise<string> {
  if (typeof window === "undefined") return "";

  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = videoSrc;

    let resolved = false;

    const cleanup = () => {
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch {
        // ignore cleanup error
      }
    };

    const captureFrame = () => {
      if (resolved) return;
      try {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 360;
        const scale = Math.min(1, maxWidth / Math.max(vw, 1));
        const w = Math.round(vw * scale);
        const h = Math.round(vh * scale);

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(w, 160);
        canvas.height = Math.max(h, 160);
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolved = true;
          cleanup();
          resolve(dataUrl);
          return;
        }
      } catch (err) {
        console.warn("Could not capture video frame:", err);
      }
      resolved = true;
      cleanup();
      resolve("");
    };

    video.onloadedmetadata = () => {
      const targetTime = Math.min(
        seekTime,
        video.duration && !isNaN(video.duration) && video.duration > 0.1
          ? video.duration * 0.1
          : 0.1
      );
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      captureFrame();
    };

    video.onerror = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve("");
      }
    };

    // Fallback timeout after 3.5 seconds
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve("");
      }
    }, 3500);
  });
}

