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
      <InlineError message={errorMessage} />
      {Array.from(byDay.entries()).map(([day, daySlots]) => (
        <div key={day}>
          <p className="mb-2 text-sm font-medium text-slate-700">{day}</p>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelect(slot)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
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
