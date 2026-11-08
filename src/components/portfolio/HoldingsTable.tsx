"use client"
import { useState } from "react"

export interface HoldingRow {
  id: string
  symbol: string
  sector: string
  quantity: number
  buyPrice: number
  currentPrice: number
  dayChangePct: number
}

export function HoldingsTable({
  holdings,
  onRemove,
}: {
  holdings: HoldingRow[]
  onRemove?: (id: string) => void
}) {
  const [tab, setTab] = useState<"ALL" | "GAIN" | "LOSS">("ALL")

  const rows = holdings.filter((h) => {
    const pnl = (h.currentPrice - h.buyPrice) * h.quantity
    if (tab === "GAIN") return pnl >= 0
    if (tab === "LOSS") return pnl < 0
    return true
  })

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-text-primary">Holdings</h3>
        <div className="flex gap-1 bg-surface-base p-1 rounded-lg border border-border text-[11px]">
          <button
            type="button"
            onClick={() => setTab("ALL")}
            className={`px-3 py-1 rounded ${tab === "ALL" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setTab("GAIN")}
            className={`px-3 py-1 rounded ${tab === "GAIN" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            Gainers
          </button>
          <button
            type="button"
            onClick={() => setTab("LOSS")}
            className={`px-3 py-1 rounded ${tab === "LOSS" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            Losers
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-3">Stock</th>
            <th className="py-2 px-3">Sector</th>
            <th className="py-2 px-3">Qty</th>
            <th className="py-2 px-3">Buy Price</th>
            <th className="py-2 px-3">Current</th>
            <th className="py-2 px-3">P&L</th>
            <th className="py-2 px-3">P&L %</th>
            <th className="py-2 px-3">Day Change</th>
            <th className="py-2 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {rows.map((h) => {
            const pnl = (h.currentPrice - h.buyPrice) * h.quantity
            const pnlPct = ((h.currentPrice - h.buyPrice) / h.buyPrice) * 100
            const isGain = pnl >= 0
            return (
              <tr key={h.id} className="border-b border-border/50 hover:bg-surface-high/40">
                <td className="py-3 px-3 font-semibold text-text-primary">{h.symbol}</td>
                <td className="py-3 px-3 text-[11px] text-text-muted">{h.sector}</td>
                <td className="py-3 px-3 font-mono">{h.quantity}</td>
                <td className="py-3 px-3 font-mono">₹{h.buyPrice.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 font-mono">₹{h.currentPrice.toLocaleString("en-IN")}</td>
                <td className={`py-3 px-3 font-mono ${isGain ? "text-accent-green" : "text-accent-red"}`}>
                  {isGain ? "+" : "−"}₹{Math.abs(pnl).toLocaleString("en-IN")}
                </td>
                <td className={`py-3 px-3 font-mono ${isGain ? "text-accent-green" : "text-accent-red"}`}>
                  {isGain ? "+" : ""}
                  {pnlPct.toFixed(1)}%
                </td>
                <td className={`py-3 px-3 font-mono ${h.dayChangePct >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                  {h.dayChangePct >= 0 ? "+" : ""}
                  {h.dayChangePct.toFixed(2)}%
                </td>
                <td className="py-3 px-3 text-right">
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(h.id)}
                      className="text-[11px] text-text-muted hover:text-accent-red"
                      aria-label={`Remove ${h.symbol}`}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={9} className="py-8 text-center text-xs text-text-muted">
                Your portfolio is empty. Add a position to start tracking it.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}
