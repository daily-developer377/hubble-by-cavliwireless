import { DateTime } from "luxon";

const DISPLAY_ZONE = "Asia/Kolkata";

export function ConsultConfirmation({
  booking,
  email,
}: {
  booking: { slotStart: string; slotEnd: string; meetLink: string };
  email: string;
}) {
  const start = DateTime.fromISO(booking.slotStart).setZone(DISPLAY_ZONE);
  const end = DateTime.fromISO(booking.slotEnd).setZone(DISPLAY_ZONE);

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
      <a
        href={booking.meetLink}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
      >
        Join Google Meet
      </a>
      <p className="mt-4 text-xs text-slate-500">
        A confirmation email with this invite has been sent to {email}.
      </p>
    </div>
  );
}
