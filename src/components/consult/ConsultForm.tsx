"use client";

import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { consultRequestSchema } from "@/lib/validation";
import { InlineError } from "@/components/consult/InlineError";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "company" | "message", string>>;

const inputClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-stone-50/60 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#183B2B] focus:bg-white focus:ring-2 focus:ring-[#183B2B]/15";

export function ConsultForm({
  onSubmitted,
}: {
  onSubmitted: (consultRequestId: string, email: string) => void;
}) {
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof fields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = consultRequestSchema.safeParse(fields);
    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors as FieldErrors);
      return;
    }
    setFieldErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data.fieldErrors || {});
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }

      onSubmitted(data.consultRequestId, parsed.data.email);
    } catch {
      setFormError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Wizard Step 1 Header */}
      <div className="mb-6 flex items-center justify-between border-b border-stone-200/80 pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#183B2B]">
            Step 1 of 2
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            Project &amp; Team Details
          </h3>
        </div>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-6 rounded-full bg-[#183B2B]" />
          <span className="h-2 w-2 rounded-full bg-stone-200" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Alex Morgan"
          className={inputClass}
        />
        <InlineError message={fieldErrors.name} />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Email <span className="text-rose-500">*</span>
        </label>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="e.g. alex@company.com"
          className={inputClass}
        />
        <InlineError message={fieldErrors.email} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Phone
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            className={inputClass}
          />
          <InlineError message={fieldErrors.phone} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Company <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={fields.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="e.g. Fleet Dynamics Corp."
            className={inputClass}
          />
          <InlineError message={fieldErrors.company} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          placeholder="Describe your hardware requirements, target volumes, frequency bands, or telemetry pipeline..."
          className={inputClass}
        />
        <InlineError message={fieldErrors.message} />
      </div>

      <InlineError message={formError ?? undefined} />

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#183B2B] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#132F22] hover:shadow-md active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          <span>{submitting ? "Submitting…" : "Continue to pick a time"}</span>
          <LuArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  );
}
