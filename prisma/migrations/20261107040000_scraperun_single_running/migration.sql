-- Enforces at most one RUNNING ScrapeRun at a time at the database level,
-- so the trigger endpoint can rely on a unique-constraint violation (the
-- same pattern used for Booking.slotStart) instead of a check-then-insert
-- race between the "is one already running?" read and the insert.
CREATE UNIQUE INDEX "ScrapeRun_single_running_idx" ON "ScrapeRun" (status)
WHERE status = 'RUNNING';
