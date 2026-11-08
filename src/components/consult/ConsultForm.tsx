"use client";

import { useState } from "react";
import { consultRequestSchema } from "@/lib/validation";
import { InlineError } from "@/components/consult/InlineError";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "company" | "message", string>>;

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

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
      <div>
        <label className="block text-sm font-medium text-slate-700">Name</label>
        <input
          type="text"
          value={fields.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClass}
        />
        <InlineError message={fieldErrors.name} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
        />
        <InlineError message={fieldErrors.email} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            value={fields.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
          <InlineError message={fieldErrors.phone} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Company <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={fields.company}
            onChange={(e) => update("company", e.target.value)}
            className={inputClass}
          />
          <InlineError message={fieldErrors.company} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Message</label>
        <textarea
          value={fields.message}
          onChange={(e) => update("message", e.target.value)}
          rows={4}
          className={inputClass}
        />
        <InlineError message={fieldErrors.message} />
      </div>

      <InlineError message={formError ?? undefined} />

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-[#183B2B] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#132F22] disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Continue to pick a time"}
      </button>
    </form>
  );
}
