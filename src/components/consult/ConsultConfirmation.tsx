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
    <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/50 p-6 sm:p-8">
      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#183B2B] text-xs text-white">
          ✓
        </span>
        You&apos;re booked for consultation
      </p>
      <p className="mt-3 text-xl font-bold text-slate-900">
        {start.toFormat("cccc, LLLL d, yyyy")}
      </p>
      <p className="text-sm text-slate-600 mt-1">
        {start.toFormat("h:mm a")} – {end.toFormat("h:mm a")} ({DISPLAY_ZONE})
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <a
          href={booking.meetLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#183B2B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#132F22] hover:shadow-md transition-all active:scale-[0.98]"
        >
          <span>Join Google Meet</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M15 10l5-5v14l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="2" y="6" width="13" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:border-stone-400 hover:bg-stone-50 active:scale-[0.98] cursor-pointer"
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
          className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-2xs transition hover:border-stone-400 hover:bg-stone-50 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <rect x="3" y="5" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add to calendar
        </a>
      </div>
      <p className="mt-4 text-xs text-slate-500">
        A confirmation email with this invite and Google Meet link has been sent to {email}.
      </p>
    </div>
  );
}
