"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"

export default function SettingsPage() {
  const [handle, setHandle] = useState("")
  const [leaderboardOpt, setLeaderboardOpt] = useState(true)
  const [maxTrades, setMaxTrades] = useState("3")
  const [maxLoss, setMaxLoss] = useState("5000")
  const [tradingStart, setTradingStart] = useState("09:15")
  const [tradingEnd, setTradingEnd] = useState("15:15")
  const [minRiskReward, setMinRiskReward] = useState("1")
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/settings")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load settings.")
        setHandle(data.handle || "")
        setLeaderboardOpt(data.leaderboardOpt)
        setMaxTrades(String(data.maxTrades))
        setMaxLoss(String(data.maxLoss))
        setTradingStart(data.tradingStart)
        setTradingEnd(data.tradingEnd)
        setMinRiskReward(String(data.minRiskReward))
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          leaderboardOpt,
          maxTrades: Number(maxTrades),
          maxLoss: Number(maxLoss),
          tradingStart,
          tradingEnd,
          minRiskReward: Number(minRiskReward),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save settings.")
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.")
    }
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Terminal & Guardrail Settings"
        subtitle="Manage your profile, leaderboard privacy, and daily discipline rules"
      />
      <div className="mx-auto max-w-3xl p-4 sm:p-6">
        <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-border bg-surface-low p-4 sm:p-6">
          {error && (
            <div role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
              {error}
            </div>
          )}
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
                min="1"
                step="any"
                value={maxLoss}
                onChange={(e) => setMaxLoss(e.target.value)}
                className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs font-mono text-text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Trading Start Time</label>
              <input
                type="time"
                value={tradingStart}
                onChange={(e) => setTradingStart(e.target.value)}
                className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Trading End Time</label>
              <input
                type="time"
                value={tradingEnd}
                onChange={(e) => setTradingEnd(e.target.value)}
                className="w-full bg-surface-base border border-border rounded-lg px-3.5 py-2 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Minimum Risk : Reward</label>
              <input
                type="number"
                min="0.1"
                step="any"
                value={minRiskReward}
                onChange={(e) => setMinRiskReward(e.target.value)}
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
              className="bg-accent-blue text-accent-contrast font-semibold text-xs px-5 py-2 rounded-lg hover:brightness-110"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
