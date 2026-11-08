"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "loaded" | "error";

export function ModelViewer({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // The custom element only exists once this module registers it, so it's
    // imported client-side only (it touches `customElements`, which SSR
    // doesn't have).
    import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleLoad = () => setStatus("loaded");
    const handleError = () => setStatus("error");

    el.addEventListener("load", handleLoad);
    el.addEventListener("error", handleError);
    return () => {
      el.removeEventListener("load", handleLoad);
      el.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-stone-200/90 bg-[#F8F9FA] shadow-lg shadow-stone-200/50 md:aspect-[4/3] flex items-center justify-center">
      {status !== "error" && (
        <model-viewer
          ref={ref}
          src={src}
          alt={alt}
          camera-controls
          auto-rotate
          loading="eager"
          reveal="auto"
          shadow-intensity="1.2"
          shadow-softness="0.8"
          exposure="1"
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />
      )}

      {/* Interactive HUD Guide */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span>Interactive 3D • Click &amp; Drag to Orbit • Scroll to Zoom</span>
      </div>

      {/* Loading Overlay */}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#F8F9FA]/90">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-[#183B2B]" />
            <span className="text-xs font-medium text-slate-500">Loading interactive 3D model…</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F8F9FA] p-6 text-center">
          <span className="text-sm font-medium text-slate-600">3D model preview unavailable in this environment.</span>
          <a
            href={src}
            className="text-xs font-semibold text-[#183B2B] underline hover:text-[#132F22]"
            target="_blank"
            rel="noreferrer"
          >
            Download model asset (.glb)
          </a>
        </div>
      )}
    </div>
  );
}
