import { randomBytes, randomUUID } from "node:crypto";
import { google } from "googleapis";

export type CreateMeetEventInput = {
  summary: string;
  description: string;
  attendeeEmail: string;
  startIso: string;
  endIso: string;
  timezone: string;
};

export type CreateMeetEventResult = {
  eventId: string;
  meetLink: string;
  mode: "REAL" | "MOCK";
};

export function isGoogleConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN,
  );
}

function mockEvent(): CreateMeetEventResult {
  const eventId = `mock_${randomUUID()}`;
  const meetLink = `https://meet.google.com/mock-${randomBytes(4).toString("hex")}`;
  return { eventId, meetLink, mode: "MOCK" };
}

async function realCreateMeetEvent(
  input: CreateMeetEventInput,
): Promise<CreateMeetEventResult> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
    conferenceDataVersion: 1,
    requestBody: {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startIso, timeZone: input.timezone },
      end: { dateTime: input.endIso, timeZone: input.timezone },
      attendees: [{ email: input.attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const eventId = response.data.id;
  const meetLink = response.data.hangoutLink;
  if (!eventId || !meetLink) {
    throw new Error("Google Calendar response was missing an event id or Meet link");
  }

  return { eventId, meetLink, mode: "REAL" };
}

/**
 * Creates a Calendar event with a Google Meet link. Falls back to a mock
 * event (no external call) when Google credentials aren't configured, or
 * when the real call throws — see README "Google Calendar / Meet" for why
 * a booking should never be lost over a Calendar API hiccup.
 */
export async function createMeetEvent(
  input: CreateMeetEventInput,
): Promise<CreateMeetEventResult> {
  if (!isGoogleConfigured()) {
    return mockEvent();
  }

  try {
    return await realCreateMeetEvent(input);
  } catch (error) {
    console.warn("[calendar] real Google Calendar call failed, falling back to mock:", error);
    return mockEvent();
  }
}
