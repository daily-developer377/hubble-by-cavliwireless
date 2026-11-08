"use client";

import { useEffect, useRef, useState } from "react";

type Status = "loading" | "loaded" | "error";

export function ModelViewer({ src, alt }: { src: string; alt: string }) {
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
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm md:aspect-video">
      {status !== "error" && (
        <model-viewer
          ref={ref}
          src={src}
          alt={alt}
          camera-controls
          auto-rotate
          loading="eager"
          reveal="auto"
          shadow-intensity="1"
          exposure="1"
          className="h-full w-full"
        />
      )}

      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-50/90">
          <div className="flex flex-col items-center gap-3">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            <span className="text-xs text-slate-500">Loading 3D model…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50 text-center">
          <span className="text-sm text-slate-500">3D model could not be loaded.</span>
          <a
            href={src}
            className="text-xs text-indigo-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            Open the .glb file directly
          </a>
        </div>
      )}
    </div>
  );
}
