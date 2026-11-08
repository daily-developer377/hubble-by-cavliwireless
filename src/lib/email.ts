import { Resend } from "resend";
import { DateTime } from "luxon";

export type SendConfirmationEmailInput = {
  to: string;
  name: string;
  phone: string;
  slotStartIso: string;
  slotEndIso: string;
  timezone: string;
  meetLink: string;
  message: string;
};

export type EmailResult = "SENT" | "FAILED" | "LOGGED";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function formatWhenLine(input: SendConfirmationEmailInput) {
  const start = DateTime.fromISO(input.slotStartIso).setZone(input.timezone);
  const end = DateTime.fromISO(input.slotEndIso).setZone(input.timezone);
  return `${start.toFormat("cccc, LLLL d, yyyy 'at' h:mm a")} – ${end.toFormat("h:mm a")} (${input.timezone})`;
}

function renderConfirmationEmail(input: SendConfirmationEmailInput) {
  const whenLine = formatWhenLine(input);
  const excerpt =
    input.message.length > 160 ? `${input.message.slice(0, 160)}…` : input.message;

  const subject = "Your Hubble consultation is confirmed";
  const text = [
    `Hi ${input.name},`,
    "",
    `Your consultation with the Hubble team is confirmed for ${whenLine}.`,
    "",
    `Join with Google Meet: ${input.meetLink}`,
    "",
    `Phone: ${input.phone}`,
    "",
    `What you told us: "${excerpt}"`,
    "",
    "— Cavliwireless / Hubble",
  ].join("\n");

  return { subject, text };
}

function renderAdminNotificationEmail(input: SendConfirmationEmailInput) {
  const whenLine = formatWhenLine(input);

  const subject = `New Hubble consultation booked — ${input.name}`;
  const text = [
    `${input.name} just booked a consultation for ${whenLine}.`,
    "",
    `Email: ${input.to}`,
    `Phone: ${input.phone}`,
    "",
    `Message: "${input.message}"`,
    "",
    `Join with Google Meet: ${input.meetLink}`,
  ].join("\n");

  return { subject, text };
}

async function dispatch(to: string, subject: string, text: string): Promise<EmailResult> {
  if (!isResendConfigured()) {
    console.log(`[mock-email] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return "LOGGED";
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "consult@hubble.example";
    const { error } = await resend.emails.send({ from, to, subject, text });
    if (error) {
      console.warn(
        "[email] Resend returned an error, logging instead:",
        JSON.stringify(error, Object.getOwnPropertyNames(error)),
      );
      console.log(`[mock-email] To: ${to}\nSubject: ${subject}\n\n${text}`);
      return "FAILED";
    }
    return "SENT";
  } catch (error) {
    console.warn("[email] Resend call threw, logging instead:", error);
    console.log(`[mock-email] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return "FAILED";
  }
}

/**
 * Sends the booking confirmation email to the client. Falls back to logging
 * the rendered email to the server console when RESEND_API_KEY isn't set,
 * or when the real send fails (e.g. a Resend sandbox account that can only
 * deliver to its own verified address).
 */
export async function sendConfirmationEmail(
  input: SendConfirmationEmailInput,
): Promise<EmailResult> {
  const { subject, text } = renderConfirmationEmail(input);
  return dispatch(input.to, subject, text);
}

/**
 * Sends a separate booking notification to ADMIN_NOTIFICATION_EMAIL (if
 * set), so the business owner hears about every booking even when the
 * client confirmation above fails to send — a Resend sandbox account can
 * only deliver to its own verified address, so CCing it on the client
 * email (which goes to a different "to") gets rejected along with that
 * whole send. A standalone email keeps this delivery independent of that.
 */
export async function sendAdminNotificationEmail(
  input: SendConfirmationEmailInput,
): Promise<EmailResult | "SKIPPED"> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return "SKIPPED";

  const { subject, text } = renderAdminNotificationEmail(input);
  return dispatch(adminEmail, subject, text);
}
