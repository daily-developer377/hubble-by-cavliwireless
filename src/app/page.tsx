import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/landing/Hero";
import { ProductGrid } from "@/components/landing/ProductGrid";
import { ConsultWizard } from "@/components/consult/ConsultWizard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      slug: true,
      name: true,
      tagline: true,
      category: true,
      heroImageUrl: true,
    },
  });

  return (
    <>
      <Hero />
      <ProductGrid products={products} />
      <section id="consult" className="w-full border-t border-stone-200/80 bg-[#FAF8F5]/80 px-6 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16 items-start">
          {/* Left Column: Direct Engineering Consultation Showcase */}
          <div className="flex flex-col justify-start lg:col-span-5 xl:col-span-5">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#183B2B]/20 bg-[#183B2B]/5 px-3 py-1 text-xs font-semibold text-[#183B2B] self-start">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Direct Engineering Consultation</span>
            </div>

            {/* Headline & Subtitle */}
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[40px] lg:leading-[1.15]">
              Consult Now
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Tell us about your project requirements and select a convenient time — we&apos;ll send
              a Google Meet invite straight to your team with our IoT systems architects.
            </p>

            {/* Key Engineering Pillars - Modern Interactive Cards */}
            <div className="mt-8 flex flex-col gap-3.5">
              {/* Pillar 1 */}
              <div className="group rounded-2xl border border-stone-200/80 bg-white/90 p-4 transition-all duration-200 hover:border-[#183B2B]/40 hover:bg-white hover:shadow-sm">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#183B2B] transition-colors group-hover:bg-[#183B2B] group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4.5 w-4.5"
                    >
                      <path d="M12 20h.01" />
                      <path d="M2 20h.01" />
                      <path d="M22 20h.01" />
                      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
                      <path d="M5 12.5a10 10 0 0 1 14 0" />
                      <path d="M1.5 8.5a15 15 0 0 1 21 0" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Hardware Feasibility &amp; Link Budgeting
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      Cellular link margin calculations, antenna sensitivity, and low-power battery life profiling.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="group rounded-2xl border border-stone-200/80 bg-white/90 p-4 transition-all duration-200 hover:border-[#183B2B]/40 hover:bg-white hover:shadow-sm">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#183B2B] transition-colors group-hover:bg-[#183B2B] group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4.5 w-4.5"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="4" />
                      <path d="M9 2v4" />
                      <path d="M15 2v4" />
                      <path d="M9 18v4" />
                      <path d="M15 18v4" />
                      <path d="M2 9h4" />
                      <path d="M2 15h4" />
                      <path d="M18 9h4" />
                      <path d="M18 15h4" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Custom Antenna &amp; PCB Integration Guidance
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      RF trace routing reviews, ground plane isolation, impedance tuning, and enclosure clearance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="group rounded-2xl border border-stone-200/80 bg-white/90 p-4 transition-all duration-200 hover:border-[#183B2B]/40 hover:bg-white hover:shadow-sm">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#183B2B] transition-colors group-hover:bg-[#183B2B] group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4.5 w-4.5"
                    >
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                      <path d="M12 12v9" />
                      <path d="m8 17 4 4 4-4" />
                    </svg>
                  </span>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Volume Deployment &amp; Telemetry Architecture
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      MQTT/CoAP telemetry payloads, store-and-forward buffering, and secure zero-touch onboarding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Engineering Assurance Box */}
            <div className="mt-6 rounded-2xl border border-stone-200/90 bg-white/70 p-4.5 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#183B2B] font-bold text-sm">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-900">
                    Direct Architect Dialogue • No Sales Fluff
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Google Meet calendar invite delivered straight to your inbox upon slot selection.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Wizard Form Card */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-xl shadow-stone-200/50 sm:p-8 lg:p-10">
              <ConsultWizard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
