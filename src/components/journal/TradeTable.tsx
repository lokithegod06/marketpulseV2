"use client"
import { useState } from "react"
import { TradeRecord } from "@/types"

export function TradeTable({ trades }: { trades: TradeRecord[] }) {
  const [filter, setFilter] = useState<"ALL" | "WIN" | "LOSS">("ALL")

  const filtered = trades.filter((t) => {
    const p = Number(t.pnl || 0)
    if (filter === "WIN") return p >= 0
    if (filter === "LOSS") return p < 0
    return true
  })

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-text-primary">Today&apos;s Executed Trades</h3>
        <div className="flex gap-1 bg-surface-base p-1 rounded-lg border border-border text-[11px]">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded ${filter === "ALL" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            All ({trades.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("WIN")}
            className={`px-3 py-1 rounded ${filter === "WIN" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            Winning
          </button>
          <button
            type="button"
            onClick={() => setFilter("LOSS")}
            className={`px-3 py-1 rounded ${filter === "LOSS" ? "bg-surface-mid text-text-primary" : "text-text-secondary"}`}
          >
            Losing
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-2">Time</th>
            <th className="py-2 px-2">Instrument</th>
            <th className="py-2 px-2">Setup</th>
            <th className="py-2 px-2">Qty</th>
            <th className="py-2 px-2">Entry</th>
            <th className="py-2 px-2">P&L</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {filtered.map((t) => {
            const pnlVal = Number(t.pnl || 0)
            const isWin = pnlVal >= 0
            return (
              <tr key={t.id} className="border-b border-border/50 hover:bg-surface-high/40">
                <td className="py-3 px-2 font-mono text-[11px] text-text-secondary">
                  {t.time || "09:22 AM"}
                </td>
                <td className="py-3 px-2">
                  <span className={`font-semibold text-[11px] ${isWin ? "text-accent-green" : "text-accent-red"}`}>
                    ● {t.symbol}
                  </span>
                </td>
                <td className="py-3 px-2 text-[11px] text-text-secondary">{t.strategyTag || "ORB Breakout"}</td>
                <td className="py-3 px-2 font-mono">{t.quantity}</td>
                <td className="py-3 px-2 font-mono">₹{Number(t.entryPrice).toFixed(0)}</td>
                <td className={`py-3 px-2 font-mono font-medium ${isWin ? "text-accent-green" : "text-accent-red"}`}>
                  {isWin ? "+" : "−"}₹{Math.abs(pnlVal).toLocaleString("en-IN")}
                </td>
              </tr>
            )
          })}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-xs text-text-muted">
                No trades yet. Log your first trade to start your journal.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  )
}
