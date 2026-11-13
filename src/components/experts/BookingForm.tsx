"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { CONTACT_EMAIL } from "@/lib/contact"

export function BookingForm() {
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fields = [
      ["Name", formData.get("name")],
      ["Email", formData.get("email")],
      ["Phone (optional)", formData.get("phone") || "Not provided"],
      ["Preferred date", formData.get("date")],
      ["Preferred time", formData.get("time")],
      ["What would you like to analyze?", formData.get("focus")],
    ]
    const body = fields.map(([label, value]) => `${label}: ${value}`).join("\n")
    const subject = encodeURIComponent("Pro Trade Analysis Slot Request")

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`
    setNotice("Your email app should open with a booking request draft. Send the email to complete your request.")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-low p-6 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-text-primary">Request a slot</h2>
      <p className="mt-1 text-xs leading-5 text-text-secondary">
        Share your preferred time. We will confirm availability by email.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-xs text-text-secondary">
          Name
          <input
            required
            name="name"
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue"
          />
        </label>
        <label className="text-xs text-text-secondary">
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue"
          />
        </label>
        <label className="text-xs text-text-secondary">
          Phone <span className="text-text-muted">(optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue"
          />
        </label>
        <label className="text-xs text-text-secondary">
          Preferred date
          <input
            required
            name="date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue"
          />
        </label>
        <label className="text-xs text-text-secondary sm:col-span-2">
          Preferred time
          <select
            required
            name="time"
            defaultValue=""
            className="mt-1.5 w-full rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs text-text-primary outline-none focus:border-accent-blue"
          >
            <option value="" disabled>Select a time window</option>
            <option>Morning (9 AM–12 PM IST)</option>
            <option>Afternoon (12 PM–3 PM IST)</option>
            <option>Evening (after 3 PM IST)</option>
          </select>
        </label>
        <label className="text-xs text-text-secondary sm:col-span-2">
          What would you like to analyze?
          <textarea
            required
            name="focus"
            rows={4}
            placeholder="For example: review my trade journal, strategy rules, or recent trades."
            className="mt-1.5 w-full resize-y rounded-lg border border-border bg-surface-base px-3 py-2.5 text-xs leading-5 text-text-primary outline-none placeholder:text-text-muted focus:border-accent-blue"
          />
        </label>
      </div>

      {notice && (
        <p role="status" className="mt-4 rounded-lg border border-accent-green/20 bg-accent-green/10 px-3 py-2 text-xs leading-5 text-accent-green">
          {notice} If it did not open, email{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      )}

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-blue px-5 py-3 text-xs font-semibold text-[#051321] transition-colors hover:bg-[#bae6fd]"
      >
        Email slot request
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-[10px] leading-4 text-text-muted">
        This opens an email draft to {CONTACT_EMAIL}; your slot is not confirmed until we reply.
      </p>
    </form>
  )
}
