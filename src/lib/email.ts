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

function renderEmail(input: SendConfirmationEmailInput) {
  const start = DateTime.fromISO(input.slotStartIso).setZone(input.timezone);
  const end = DateTime.fromISO(input.slotEndIso).setZone(input.timezone);
  const whenLine = `${start.toFormat("cccc, LLLL d, yyyy 'at' h:mm a")} – ${end.toFormat("h:mm a")} (${input.timezone})`;
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

/**
 * Sends the booking confirmation email via Resend, CCing
 * ADMIN_NOTIFICATION_EMAIL (if set) so the business owner sees every
 * booking without a second send. Falls back to logging the rendered email
 * to the server console when RESEND_API_KEY isn't set, or when the real
 * send throws.
 */
export async function sendConfirmationEmail(
  input: SendConfirmationEmailInput,
): Promise<EmailResult> {
  const { subject, text } = renderEmail(input);
  const cc = process.env.ADMIN_NOTIFICATION_EMAIL || undefined;

  if (!isResendConfigured()) {
    console.log(
      `[mock-email] To: ${input.to}${cc ? ` (cc: ${cc})` : ""}\nSubject: ${subject}\n\n${text}`,
    );
    return "LOGGED";
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM_EMAIL || "consult@hubble.example";
    const { error } = await resend.emails.send({ from, to: input.to, cc, subject, text });
    if (error) {
      console.warn("[email] Resend returned an error, logging instead:", error);
      console.log(`[mock-email] To: ${input.to}\nSubject: ${subject}\n\n${text}`);
      return "FAILED";
    }
    return "SENT";
  } catch (error) {
    console.warn("[email] Resend call threw, logging instead:", error);
    console.log(`[mock-email] To: ${input.to}\nSubject: ${subject}\n\n${text}`);
    return "FAILED";
  }
}
