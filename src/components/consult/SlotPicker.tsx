"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { InlineError } from "@/components/consult/InlineError";

type Slot = { start: string; end: string };

// Slots are generated server-side in Asia/Kolkata business hours (see
// lib/slots.ts); displaying them in that same zone here, rather than the
// viewer's local zone, keeps the times shown consistent with what the
// backend actually scheduled.
const DISPLAY_ZONE = "Asia/Kolkata";

export function SlotPicker({
  onSelect,
  errorMessage,
}: {
  onSelect: (slot: Slot) => void;
  errorMessage?: string;
}) {
  // `status` is only ever set from the fetch's .then/.catch callbacks (or
  // directly inside the Retry button's own click handler) — never
  // synchronously in the effect body itself, which is what the
  // react-hooks/set-state-in-effect rule wants: the initial "loading"
  // state comes from useState's initializer, not an effect-body reset.
  const [status, setStatus] = useState<"loading" | "error" | "ready">("loading");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/consult/slots")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load slots");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  if (status === "error") {
    return (
      <div>
        <InlineError message="Couldn't load available times. Please try again." />
        <button
          type="button"
          onClick={() => {
            setStatus("loading");
            setReloadToken((token) => token + 1);
          }}
          className="mt-2 text-sm font-medium text-indigo-600 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "loading") {
    return <p className="text-sm text-slate-500">Loading available times…</p>;
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No slots available right now — please check back soon.
      </p>
    );
  }

  const byDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    const dayKey = DateTime.fromISO(slot.start).setZone(DISPLAY_ZONE).toFormat("cccc, LLLL d");
    if (!byDay.has(dayKey)) byDay.set(dayKey, []);
    byDay.get(dayKey)!.push(slot);
  }

  return (
    <div className="space-y-6">
      {/* Wizard Step 2 Header */}
      <div className="mb-6 flex items-center justify-between border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#183B2B]">
            Step 2 of 2
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            Select Your Convenient Time Slot
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Times displayed in {DISPLAY_ZONE}
          </p>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="h-2 w-6 rounded-full bg-[#183B2B]" />
        </div>
      </div>

      <InlineError message={errorMessage} />
      {Array.from(byDay.entries()).map(([day, daySlots]) => (
        <div key={day}>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-700">{day}</p>
          <div className="flex flex-wrap gap-2.5">
            {daySlots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot)}
                className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-[#183B2B] hover:bg-[#183B2B]/5 hover:text-[#183B2B] hover:shadow-2xs active:scale-95 cursor-pointer"
              >
                {DateTime.fromISO(slot.start).setZone(DISPLAY_ZONE).toFormat("h:mm a")}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
