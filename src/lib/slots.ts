import { DateTime } from "luxon";

const ZONE = process.env.CONSULT_TIMEZONE || "Asia/Kolkata";
const BUSINESS_HOURS = [10, 11, 12, 13, 14, 15, 16]; // slot start hours, IST
const DAYS_AHEAD = 10;

export type CandidateSlot = {
  start: string; // ISO 8601
  end: string; // ISO 8601
};

/**
 * Generates the full set of bookable (but not yet filtered-by-booking)
 * slots for the next DAYS_AHEAD calendar days: weekdays only, one hour
 * each, 10:00-17:00 in CONSULT_TIMEZONE. Slots already in the past are
 * excluded.
 */
export function generateCandidateSlots(now: DateTime = DateTime.now().setZone(ZONE)): CandidateSlot[] {
  const slots: CandidateSlot[] = [];
  const today = now.setZone(ZONE).startOf("day");

  for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
    const day = today.plus({ days: dayOffset });
    if (day.weekday === 6 || day.weekday === 7) continue; // Sat/Sun (Luxon: Mon=1..Sun=7)

    for (const hour of BUSINESS_HOURS) {
      const start = day.set({ hour, minute: 0, second: 0, millisecond: 0 });
      const end = start.plus({ hours: 1 });
      if (start <= now) continue;
      slots.push({ start: start.toUTC().toISO()!, end: end.toUTC().toISO()! });
    }
  }

  return slots;
}

export function getConsultTimezone() {
  return ZONE;
}
