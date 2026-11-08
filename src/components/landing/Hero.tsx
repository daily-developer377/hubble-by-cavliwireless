export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-glow">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          Cavliwireless
        </span>

        <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Hubble connects your hardware to the field{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            and the field back to you.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-base text-slate-600 sm:text-lg">
          GPS/IoT trackers, cellular modules, edge gateways, and fleet telemetry — built to deploy
          fast and report reliably.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#products"
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
          >
            Explore products
          </a>
          <a
            href="#consult"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
          >
            Consult Now
          </a>
        </div>

        <dl className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-8">
          <div>
            <dt className="text-xs text-slate-500">Products</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">5</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">3D viewer</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">Every page</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Booking</dt>
            <dd className="mt-1 text-2xl font-semibold text-slate-900">Live</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
