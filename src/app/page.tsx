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
      <section id="consult" className="w-full border-t border-slate-200 bg-slate-50 px-6 sm:px-10 lg:px-14 xl:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col justify-start lg:col-span-4 xl:col-span-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#183B2B]">
              Direct Engineering Consultation
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Consult Now
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Tell us about your project requirements and select a convenient time — we&apos;ll send
              a Google Meet invite straight to your team with our IoT systems architects.
            </p>
            <div className="mt-8 hidden flex-col gap-4 border-t border-slate-200/80 pt-6 text-xs text-slate-500 lg:flex">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#183B2B]">
                  ✓
                </span>
                <span>Hardware feasibility &amp; link budgeting</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#183B2B]">
                  ✓
                </span>
                <span>Custom antenna &amp; PCB integration guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 font-bold text-[#183B2B]">
                  ✓
                </span>
                <span>Volume deployment &amp; telemetry architecture</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <ConsultWizard />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
