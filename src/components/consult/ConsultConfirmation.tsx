"use client";

import { useState } from "react";
import { DateTime } from "luxon";

const DISPLAY_ZONE = "Asia/Kolkata";

function buildGoogleCalendarUrl(booking: { slotStart: string; slotEnd: string; meetLink: string }) {
  const toUtcStamp = (iso: string) => DateTime.fromISO(iso).toUTC().toFormat("yyyyLLdd'T'HHmmss'Z'");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Hubble Consultation — Cavliwireless",
    dates: `${toUtcStamp(booking.slotStart)}/${toUtcStamp(booking.slotEnd)}`,
    details: `Join with Google Meet: ${booking.meetLink}`,
    location: booking.meetLink,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function ConsultConfirmation({
  booking,
  email,
}: {
  booking: { slotStart: string; slotEnd: string; meetLink: string };
  email: string;
}) {
  const start = DateTime.fromISO(booking.slotStart).setZone(DISPLAY_ZONE);
  const end = DateTime.fromISO(booking.slotEnd).setZone(DISPLAY_ZONE);
  const [copied, setCopied] = useState(false);

  const googleCalendarUrl = buildGoogleCalendarUrl(booking);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(booking.meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be denied (permissions, insecure context); the
      // link is still visible via "Join Google Meet" as a fallback.
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
      <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
          ✓
        </span>
        You&apos;re booked.
      </p>
      <p className="mt-3 text-lg font-semibold text-slate-900">
        {start.toFormat("cccc, LLLL d, yyyy")}
      </p>
      <p className="text-sm text-slate-600">
        {start.toFormat("h:mm a")} – {end.toFormat("h:mm a")} ({DISPLAY_ZONE})
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a
          href={booking.meetLink}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Join Google Meet
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <rect x="9" y="9" width="12" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {copied ? "Copied!" : "Copy link"}
        </button>
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs transition hover:border-slate-400 hover:bg-slate-50"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <rect x="3" y="5" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add to calendar
        </a>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        A confirmation email with this invite has been sent to {email}.
      </p>
    </div>
  );
}
