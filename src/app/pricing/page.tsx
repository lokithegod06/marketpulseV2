"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, ArrowLeft } from "lucide-react"

export default function PricingPage() {
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly")
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  const handleSubscribe = async () => {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billingCycle: cycle }),
    })
    const data = await res.json()
    if (data.mode === "LIVE" && data.shortUrl) {
      window.location.href = data.shortUrl
    } else {
      setStatusMsg(data.message || "Razorpay checkout initialized in Demo Mode.")
    }
  }

  return (
    <div className="min-h-screen bg-surface-base text-text-primary p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Market Pulse Home
        </Link>

        <div className="text-center mb-10">
          <div className="text-xs font-mono text-accent-blue uppercase tracking-widest mb-2">
            RAZORPAY SUBSCRIPTION CHECKOUT
          </div>
          <h1 className="text-3xl font-bold">Upgrade to Market Pulse Pro</h1>
          <p className="text-xs text-text-secondary mt-2">
            Instant activation via Razorpay Subscriptions webhook (`/api/subscriptions/webhook`).
          </p>

          <div className="inline-flex items-center gap-2 bg-surface-low border border-border p-1 rounded-lg mt-6 text-xs">
            <button
              type="button"
              onClick={() => setCycle("monthly")}
              className={`px-4 py-1.5 rounded-md ${cycle === "monthly" ? "bg-surface-mid text-accent-blue font-semibold" : "text-text-secondary"}`}
            >
              Monthly Billing (₹999 + GST)
            </button>
            <button
              type="button"
              onClick={() => setCycle("annual")}
              className={`px-4 py-1.5 rounded-md ${cycle === "annual" ? "bg-surface-mid text-accent-green font-semibold" : "text-text-secondary"}`}
            >
              Annual Billing (₹8,999 + GST · Save 25%)
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mb-8 p-4 rounded-xl bg-accent-blue/10 border border-accent-blue/30 text-xs text-accent-blue">
            {statusMsg}
          </div>
        )}

        <div className="bg-surface-low border-2 border-accent-blue/50 rounded-2xl p-8 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Market Pulse Pro Terminal</h2>
            <span className="text-[10px] font-mono bg-accent-green/10 text-accent-green border border-accent-green/20 px-2.5 py-0.5 rounded-full">
              ALL 8 MODULES UNLOCKED
            </span>
          </div>
          <div className="text-3xl font-mono font-bold text-text-primary mb-6">
            {cycle === "monthly" ? "₹999 / month" : "₹8,999 / year"}
            <span className="text-xs text-text-muted font-sans font-normal ml-2">+ 18% GST</span>
          </div>

          <ul className="space-y-3 text-xs text-text-secondary mb-8">
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Live Pre-Market Gift Nifty, India VIX, FII/DII Flows &amp; Market Pulse Bias
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Unlimited Trade Journal + Claude Sonnet 4.6 Post-Session Behavioral Audit
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Full Discipline Score (0–100), Hard Guardrails &amp; All-India Leaderboard
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Portfolio Tracker with AI Fundamental &amp; Concentration Risk Review
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Custom ChartInk Deep-Filter Screeners (OI+PCR, Sector Rotation, Gamma Squeeze)
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Full Access to All 6 Pro Strategy Courses &amp; 20-Stock Live Watchlist
            </li>
            <li className="flex items-center gap-2.5 text-text-primary">
              <Check className="w-4 h-4 text-accent-green" />
              Connect with real traders for trade analysis through the Experts page
            </li>
          </ul>

          <button
            type="button"
            onClick={handleSubscribe}
            className="w-full py-3 rounded-lg bg-accent-blue text-[#001e2f] font-semibold text-xs hover:bg-[#bae6fd] transition-colors"
          >
            Proceed to Razorpay Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
