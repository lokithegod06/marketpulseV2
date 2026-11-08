"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"

export default function SettingsPage() {
  const [handle, setHandle] = useState("")
  const [leaderboardOpt, setLeaderboardOpt] = useState(true)
  const [maxTrades, setMaxTrades] = useState("3")
  const [maxLoss, setMaxLoss] = useState("5000")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Terminal & Guardrail Settings"
        subtitle="Manage your profile, leaderboard privacy, and daily discipline rules"
      />
      <div className="p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSave} className="bg-surface-low border border-border rounded-xl p-6 space-y-5">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Public Leaderboard Handle</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="your_trader_handle"
              className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs font-mono text-text-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Max Trades Per Day</label>
              <input
                type="number"
                value={maxTrades}
                onChange={(e) => setMaxTrades(e.target.value)}
                className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs font-mono text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Hard Daily Stop Loss (₹)</label>
              <input
                type="number"
                value={maxLoss}
                onChange={(e) => setMaxLoss(e.target.value)}
                className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs font-mono text-text-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-xs font-medium text-text-primary">Opt-in to Public All-India Leaderboard</div>
              <div className="text-[11px] text-text-muted">Show your @handle, Discipline Score, and percentile rank</div>
            </div>
            <input
              type="checkbox"
              checked={leaderboardOpt}
              onChange={(e) => setLeaderboardOpt(e.target.checked)}
              className="w-4 h-4 accent-accent-blue"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-accent-green">
              {saved ? "✓ Guardrails & profile settings updated" : ""}
            </span>
            <button
              type="submit"
              className="bg-accent-blue text-[#001e2f] font-semibold text-xs px-5 py-2 rounded-lg hover:bg-[#bae6fd]"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
