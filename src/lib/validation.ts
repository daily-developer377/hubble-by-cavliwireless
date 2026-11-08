import { z } from "zod";

// Only `company` is optional; name, email, phone, and message are all required.
export const consultRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  company: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required"),
});

export type ConsultRequestInput = z.infer<typeof consultRequestSchema>;

export const confirmBookingSchema = z.object({
  slotStart: z.string().trim().min(1, "Select a time slot"),
  slotEnd: z.string().trim().min(1, "Select a time slot"),
});

export type ConfirmBookingInput = z.infer<typeof confirmBookingSchema>;
