import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";
import { ExhibitorTicker } from "@/components/layout/ExhibitorTicker";

type ExhibitorRow = {
  companyName: string;
  country: string;
};

export function Footer({ exhibitors }: { exhibitors: ExhibitorRow[] }) {
  return (
    <footer className="relative w-full overflow-hidden border-t border-emerald-950/70 bg-[#0B130E] text-slate-300">
      {/* Ambient Top Glow for subtle hardware depth */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-24 h-72 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(24,59,43,0.45),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full px-6 sm:px-10 lg:px-14 xl:px-16 pt-16 sm:pt-20 pb-12">
        {/* Main Footer Top Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Brand Column (Col 1-5) */}
          <div className="flex flex-col items-start lg:col-span-5">
            {/* Same Logo as used in the Header */}
            <Link href="/" className="group flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#183B2B] text-white shadow-sm ring-1 ring-white/15 transition-transform duration-200 group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-emerald-400">
                  Hubble
                </span>
                <span className="text-xs font-medium text-emerald-400/90">
                  by Cavliwireless
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Enterprise cellular IoT telemetry hardware, edge gateways, and connectivity modules.
              Field-certified for volume global deployments across 150+ networks.
            </p>

            {/* Quick Badges */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                150+ Networks Pre-Certified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                IP67 Industrial Standard
              </span>
            </div>
          </div>

          {/* Hardware Suite Links (Col 6-8) */}
          <div className="flex flex-col lg:col-span-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Featured Hardware
            </span>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/products/hubble-c41-qs"
                  className="text-slate-400 transition hover:text-white"
                >
                  Hubble C41 QS Tracker
                </Link>
              </li>
              <li>
                <Link
                  href="/products/hubble-c100"
                  className="text-slate-400 transition hover:text-white"
                >
                  Hubble C100 Cellular Module
                </Link>
              </li>
              <li>
                <Link
                  href="/products/hubble-edge-gateway"
                  className="text-slate-400 transition hover:text-white"
                >
                  Hubble Edge Gateway
                </Link>
              </li>
              <li>
                <Link
                  href="/products/hubble-sensor-hub"
                  className="text-slate-400 transition hover:text-white"
                >
                  Hubble Sensor Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/products/hubble-fleet-dashboard"
                  className="text-slate-400 transition hover:text-white"
                >
                  Hubble Fleet Dashboard Unit
                </Link>
              </li>
            </ul>
          </div>

          {/* Engineering & Direct Consultation (Col 9-12) */}
          <div className="flex flex-col lg:col-span-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Direct Engineering
            </span>
            <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Have questions on antenna layout, link budgeting, or volume provisioning?
            </p>
            <div className="mt-4">
              <Link
                href="/#consult"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#183B2B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm ring-1 ring-white/10 transition hover:bg-[#132F22] hover:shadow-md active:scale-95"
              >
                <span>Consult with Architects</span>
                <LuArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Google Meet invite sent instantly upon booking.
            </p>
          </div>
        </div>

        {/* Live Exhibitor Marquee Slider Section */}
        <div className="mt-14 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Live Exhibitor Directory
              </span>
              <span className="text-xs text-slate-500">• Electronica &amp; Productronica India (Bangalore 2026)</span>
            </div>
            <span className="text-[11px] text-slate-500 self-start sm:self-auto font-mono">
              Live Scraped Feed
            </span>
          </div>

          {/* Modern Glassmorphic Slider */}
          <ExhibitorTicker exhibitors={exhibitors} />
        </div>

        {/* Bottom Copyright and Pipeline Status */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Cavliwireless. Hubble product data shown here is
            seed/demo content.
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Exhibitor data synced via POST /api/scrape/exhibitors</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
