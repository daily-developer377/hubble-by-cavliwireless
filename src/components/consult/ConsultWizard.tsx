"use client";

import { useState } from "react";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { SlotPicker } from "@/components/consult/SlotPicker";
import { ConsultConfirmation } from "@/components/consult/ConsultConfirmation";

type Step = "form" | "slots" | "success";
type Slot = { start: string; end: string };
type Booking = {
  slotStart: string;
  slotEnd: string;
  meetLink: string;
};

export function ConsultWizard() {
  const [step, setStep] = useState<Step>("form");
  const [consultRequestId, setConsultRequestId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [slotError, setSlotError] = useState<string | undefined>(undefined);
  const [confirming, setConfirming] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  // Bumping this forces SlotPicker to refetch after a 409 (slot taken).
  const [slotsRefreshKey, setSlotsRefreshKey] = useState(0);

  async function handleSelectSlot(slot: Slot) {
    if (!consultRequestId) return;
    setConfirming(true);
    setSlotError(undefined);

    try {
      const res = await fetch(`/api/consult/${consultRequestId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotStart: slot.start, slotEnd: slot.end }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setSlotError("That slot was just booked — pick another time below.");
        setSlotsRefreshKey((key) => key + 1);
        return;
      }

      if (!res.ok) {
        setSlotError(data.error || "Something went wrong confirming that slot. Please try again.");
        return;
      }

      setBooking(data.booking);
      setStep("success");
    } catch {
      setSlotError("Network error — please check your connection and try again.");
    } finally {
      setConfirming(false);
    }
  }

  if (step === "success" && booking) {
    return <ConsultConfirmation booking={booking} email={email} />;
  }

  if (step === "slots") {
    return (
      <div>
        {confirming ? (
          <p className="text-sm text-slate-500">Confirming your slot…</p>
        ) : (
          <SlotPicker key={slotsRefreshKey} onSelect={handleSelectSlot} errorMessage={slotError} />
        )}
      </div>
    );
  }

  return (
    <ConsultForm
      onSubmitted={(id, submittedEmail) => {
        setConsultRequestId(id);
        setEmail(submittedEmail);
        setStep("slots");
      }}
    />
  );
}
