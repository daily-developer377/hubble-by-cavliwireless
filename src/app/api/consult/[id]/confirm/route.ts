import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { confirmBookingSchema } from "@/lib/validation";
import { createMeetEvent } from "@/lib/calendar";
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email";
import { getConsultTimezone } from "@/lib/slots";

export async function POST(
  request: Request,
  context: RouteContext<"/api/consult/[id]/confirm">,
) {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = confirmBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const consultRequest = await prisma.consultRequest.findUnique({ where: { id } });
  if (!consultRequest) {
    return NextResponse.json({ error: "Consult request not found" }, { status: 404 });
  }

  const { slotStart, slotEnd } = parsed.data;
  const timezone = getConsultTimezone();

  // Create the booking row first, directly (not read-then-write): the DB's
  // unique constraint on slotStart is what makes this race-safe under
  // concurrent requests for the same slot.
  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        consultRequestId: consultRequest.id,
        slotStart: new Date(slotStart),
        slotEnd: new Date(slotEnd),
        timezone,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "slot_taken" }, { status: 409 });
    }
    throw error;
  }

  await prisma.consultRequest.update({
    where: { id: consultRequest.id },
    data: { status: "SLOT_SELECTED" },
  });

  // External calls happen after the booking row already exists, so a
  // Calendar/email hiccup degrades this one booking to mock/log mode
  // instead of losing the confirmed slot.
  const meetEvent = await createMeetEvent({
    summary: `Hubble consultation with ${consultRequest.name}`,
    description: consultRequest.message,
    attendeeEmail: consultRequest.email,
    startIso: booking.slotStart.toISOString(),
    endIso: booking.slotEnd.toISOString(),
    timezone,
  });

  const confirmationEmailInput = {
    to: consultRequest.email,
    name: consultRequest.name,
    phone: consultRequest.phone ?? "",
    slotStartIso: booking.slotStart.toISOString(),
    slotEndIso: booking.slotEnd.toISOString(),
    timezone,
    meetLink: meetEvent.meetLink,
    message: consultRequest.message,
  };

  const emailStatus = await sendConfirmationEmail(confirmationEmailInput);
  // Sent independently of the client email above so a business-owner
  // notification still goes out even when that one fails to send.
  await sendAdminNotificationEmail(confirmationEmailInput);

  const [updatedBooking] = await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: {
        googleEventId: meetEvent.eventId,
        googleMeetLink: meetEvent.meetLink,
        calendarMode: meetEvent.mode,
        emailStatus,
      },
    }),
    prisma.consultRequest.update({
      where: { id: consultRequest.id },
      data: { status: "CONFIRMED" },
    }),
  ]);

  return NextResponse.json({
    booking: {
      id: updatedBooking.id,
      slotStart: updatedBooking.slotStart.toISOString(),
      slotEnd: updatedBooking.slotEnd.toISOString(),
      timezone: updatedBooking.timezone,
      meetLink: updatedBooking.googleMeetLink,
      calendarMode: updatedBooking.calendarMode,
      emailStatus: updatedBooking.emailStatus,
    },
  });
}
