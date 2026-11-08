"use client";

import { useState } from "react";
import Link from "next/link";
import { ModelViewer } from "@/components/product/ModelViewer";

const b2bCapabilities = [
  {
    title: "Global Deployment",
    subtitle: "Pre-certified for 150+ cellular networks",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-[#183B2B]"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "IP67 Field Rugged",
    subtitle: "Waterproof, dustproof & shock-tested",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-[#183B2B]"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "End-to-End Encrypted",
    subtitle: "Hardware-level telemetry security",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-[#183B2B]"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "24/7 Enterprise Support",
    subtitle: "Direct access to IoT architects",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-[#183B2B]"
      >
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
    ),
  },
];

// Interactive device hotspots mapped to the hardware composition
const hotspots = [
  {
    id: "edge-gateway",
    label: "Hubble Edge Gateway",
    detail: "BLE/LoRa sensor aggregation & cellular uplink",
    href: "/products/hubble-edge-gateway",
    top: "32%",
    left: "50%",
  },
  {
    id: "tracker",
    label: "Hubble C41 QS Tracker",
    detail: "Fleet telematics with active OLED display",
    href: "/products/hubble-c41-qs",
    top: "54%",
    left: "74%",
  },
  {
    id: "sensor-hub",
    label: "Hubble Sensor Hub",
    detail: "IP67 environmental & vibration puck",
    href: "/products/hubble-sensor-hub",
    top: "72%",
    left: "37%",
  },
  {
    id: "c100",
    label: "Hubble C100 Module",
    detail: "Compact SMD LTE Cat-1 cellular connectivity",
    href: "/products/hubble-c100",
    top: "62%",
    left: "24%",
  },
];

export function Hero() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [show3DModal, setShow3DModal] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] text-slate-900 border-b border-stone-200/60">
      {/* Subtle warm ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-100/30 via-emerald-50/20 to-transparent blur-3xl"
      />

      {/* Fluid full-width container with responsive horizontal padding */}
      <div className="w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-8 pb-14 sm:pt-12 sm:pb-20">
        {/* Main 2-column Hero Grid */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start lg:col-span-6 xl:col-span-6">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-300/80 bg-white/90 px-3.5 py-1 text-xs font-semibold tracking-wide text-slate-700 shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#183B2B]" />
              </span>
              <span>CAVLIWIRELESS HARDWARE</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[50px] xl:text-[56px] leading-[1.12]">
              Elevate Your Operations{" "}
              <span className="block text-[#183B2B] sm:inline">
                with Premium Products
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="mt-5 text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl">
              Discover carefully curated IoT hardware designed for quality, precision,
              and everyday enterprise scale.
            </p>

            {/* CTA Buttons Row */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <Link
                href="#products"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#183B2B] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#132F22] hover:gap-3"
              >
                <span>Explore Products</span>
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                href="#consult"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white/80 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-2xs backdrop-blur-xs transition hover:border-slate-800 hover:bg-white"
              >
                Consult Now
              </Link>
            </div>
          </div>

          {/* Right Column: Curated Still Life Photography & Badges */}
          <div className="relative w-full lg:col-span-6 xl:col-span-6">
            <div className="group relative overflow-hidden rounded-3xl bg-[#F4F1EA] shadow-xl shadow-stone-900/5 ring-1 ring-stone-900/5">
              {/* Main Curated Product Photography */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero/hubble-hero-devices.jpg"
                alt="Hubble IoT hardware collection: Edge Gateway, C41 QS Tracker, Sensor Hub, and C100 Module"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              />

              {/* Interactive Device Hotspot Pins */}
              {hotspots.map((pin) => {
                const isActive = activeHotspot === pin.id;
                return (
                  <div
                    key={pin.id}
                    style={{ top: pin.top, left: pin.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 hidden sm:block"
                    onMouseEnter={() => setActiveHotspot(pin.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                  >
                    <button
                      type="button"
                      aria-label={`View ${pin.label}`}
                      onClick={() => setActiveHotspot(isActive ? null : pin.id)}
                      className="group/pin relative flex h-7 w-7 items-center justify-center"
                    >
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#183B2B] text-[10px] font-bold text-white shadow-md transition-transform group-hover/pin:scale-125">
                        +
                      </span>
                    </button>

                    {/* Tooltip Card */}
                    {isActive && (
                      <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 rounded-xl border border-stone-200 bg-white/95 p-2.5 shadow-xl backdrop-blur-md transition-all z-30">
                        <p className="text-xs font-semibold text-slate-900">
                          {pin.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
                          {pin.detail}
                        </p>
                        <Link
                          href={pin.href}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#183B2B] hover:underline"
                        >
                          Learn more →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 3D Model Quick Preview Floating Trigger */}
              <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 z-20">
                <button
                  type="button"
                  onClick={() => setShow3DModal(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white hover:text-[#183B2B]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-3.5 w-3.5 text-[#183B2B]"
                  >
                    <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
                    <path d="M12 12v10" />
                    <path d="M12 12L3 7" />
                    <path d="M12 12l9-5" />
                  </svg>
                  <span>Interactive 3D Viewer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature / B2B Capability Bar */}
        <div className="mt-14 sm:mt-18 border-t border-stone-200/80 pt-8 sm:pt-10">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {b2bCapabilities.map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-stone-100 border border-stone-200/60 shadow-2xs">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for 3D Interactive Model Viewer */}
      {show3DModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Hubble C41 QS Tracker — Interactive 3D Model
                </h2>
                <p className="text-xs text-slate-500">
                  Click and drag to rotate, pinch or scroll to zoom
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShow3DModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-stone-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <ModelViewer
                src="/models/c41-qs.glb"
                alt="Hubble C41 QS Tracker 3D Model"
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-stone-200">
              <span className="text-xs text-slate-500">
                IP67-rated enclosure • Multi-constellation GNSS
              </span>
              <Link
                href="/products/hubble-c41-qs"
                className="rounded-lg bg-[#183B2B] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#132F22]"
                onClick={() => setShow3DModal(false)}
              >
                Go to Product Page →
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
