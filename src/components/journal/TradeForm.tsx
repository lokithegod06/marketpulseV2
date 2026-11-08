"use client"
import { useState, useEffect } from "react"
import { DisciplineChecklist } from "./DisciplineChecklist"
import { DisciplineCheckItem, TradeDirection, TradeRecord } from "@/types"

const DEFAULT_CHECKS: DisciplineCheckItem[] = [
  { label: "Followed pre-defined hard stop loss", checked: false },
  { label: "Confirmed candle close before execution", checked: false },
  { label: "Position sized safely within portfolio limits", checked: false },
  { label: "Did not enter during midday chop (11:30–1:15 PM)", checked: false },
  { label: "Did not revenge-trade after a loss", checked: false },
]

export function TradeForm({
  initialSymbol,
  onAddTrade,
}: {
  initialSymbol?: string | null
  onAddTrade: (trade: TradeRecord) => void
}) {
  const [direction, setDirection] = useState<TradeDirection>("BUY")
  const [symbol, setSymbol] = useState(initialSymbol || "")
  const [entryPrice, setEntryPrice] = useState("")
  const [exitPrice, setExitPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [lots, setLots] = useState(1)
  const [strategyTag, setStrategyTag] = useState("")
  const [checks, setChecks] = useState<DisciplineCheckItem[]>(DEFAULT_CHECKS)
  const [notes, setNotes] = useState("")
  const [submissionError, setSubmissionError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialSymbol) {
      setSymbol(initialSymbol)
    }
  }, [initialSymbol])

  const entryNum = parseFloat(entryPrice) || 0
  const exitNum = parseFloat(exitPrice) || 0
  const qtyNum = parseInt(quantity, 10) || 0
  const deltaPts = direction === "BUY" ? exitNum - entryNum : entryNum - exitNum
  const deltaPct = entryNum > 0 ? (deltaPts / entryNum) * 100 : 0
  const realizedPnl = exitPrice ? deltaPts * qtyNum : 0

  const handleToggleCheck = (idx: number) => {
    setChecks((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, checked: !c.checked } : c))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSubmissionError("")
    const payload = {
      symbol,
      direction,
      entryPrice: entryNum,
      exitPrice: exitPrice ? exitNum : undefined,
      quantity: qtyNum,
      lots,
      strategyTag,
      disciplineChecks: checks,
      notes,
    }
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || "Failed to save trade.")
      }
      onAddTrade(json.trade)
      setSymbol("")
      setEntryPrice("")
      setExitPrice("")
      setQuantity("")
      setStrategyTag("")
      setNotes("")
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Failed to save trade.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-low border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-text-primary">Log New Trade</h3>
        <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">
          ● NSE Live
        </span>
      </div>
      {submissionError && (
        <p role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-2 text-xs text-accent-red">
          {submissionError}
        </p>
      )}

      <div>
        <label className="text-[11px] text-text-secondary block mb-1.5">Direction</label>
        <div className="grid grid-cols-2 bg-surface-base border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setDirection("BUY")}
            className={`py-2 text-xs font-semibold transition-colors ${
              direction === "BUY" ? "bg-surface-mid text-accent-blue" : "text-text-secondary"
            }`}
          >
            BUY (LONG)
          </button>
          <button
            type="button"
            onClick={() => setDirection("SELL")}
            className={`py-2 text-xs font-semibold transition-colors ${
              direction === "SELL" ? "bg-surface-mid text-accent-red" : "text-text-secondary"
            }`}
          >
            SELL (SHORT)
          </button>
        </div>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary block mb-1">Symbol / Strike</label>
        <div className="text-[11px] font-mono text-accent-blue mb-1.5">{symbol}</div>
        <input
          type="text"
          required
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-surface-base border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-blue"
        />
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div>
          <label className="text-[11px] text-text-secondary block mb-1">Entry (₹)</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.05"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full bg-surface-base border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary"
          />
        </div>
        <div>
          <label className="text-[11px] text-text-secondary block mb-1">Exit (₹)</label>
          <input
            type="number"
            min="0.01"
            step="0.05"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="w-full bg-surface-base border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary"
          />
        </div>
        <div>
          <label className="text-[11px] text-text-secondary block mb-1">Quantity</label>
          <input
            type="number"
            required
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-surface-base border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary block mb-1.5">Lots</label>
        <div className="flex gap-2">
          {[
            { l: 1, q: 75 },
            { l: 2, q: 150 },
            { l: 4, q: 300 },
            { l: 8, q: 600 },
          ].map((preset) => (
            <button
              key={preset.l}
              type="button"
              onClick={() => {
                setLots(preset.l)
                setQuantity(String(preset.q))
              }}
              className={`px-3 py-1 rounded text-[11px] font-mono border transition-colors ${
                lots === preset.l
                  ? "bg-surface-mid border-accent-blue text-accent-blue font-semibold"
                  : "bg-surface-base border-border text-text-secondary"
              }`}
            >
              {preset.l}L ({preset.q})
            </button>
          ))}
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border ${
          realizedPnl >= 0
            ? "bg-accent-green/5 border-accent-green/20"
            : "bg-accent-red/5 border-accent-red/20"
        }`}
      >
        <div className="text-[11px] text-text-muted">Realized Delta</div>
        <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
          Delta: {deltaPts >= 0 ? "+" : ""}
          {deltaPts.toFixed(2)} pts ({deltaPct.toFixed(2)}%)
        </div>
        <div
          className={`text-xl font-mono font-bold mt-1 ${
            realizedPnl >= 0 ? "text-accent-green" : "text-accent-red"
          }`}
        >
          {realizedPnl >= 0 ? "+" : "−"}₹{Math.abs(realizedPnl).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </div>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary block mb-1">Strategy Playbook</label>
        <select
          value={strategyTag}
          onChange={(e) => setStrategyTag(e.target.value)}
          className="w-full bg-surface-base border border-border rounded-lg px-3 py-2 text-xs text-text-primary"
        >
          <option>Opening Range Breakout (ORB)</option>
          <option>VWAP Fade</option>
          <option>Momentum Chasing</option>
          <option>Iron Condor</option>
          <option>Swing Pullback</option>
        </select>
      </div>

      <div>
        <label className="text-[11px] text-text-secondary block mb-1">Discipline Checklist</label>
        <DisciplineChecklist items={checks} onToggle={handleToggleCheck} />
      </div>

      <div>
        <label className="text-[11px] text-text-secondary block mb-1">Notes & Thesis</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-surface-base border border-border rounded-lg p-3 text-xs text-text-primary resize-none focus:outline-none focus:border-accent-blue"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-2.5 rounded-lg bg-accent-blue text-[#001e2f] font-semibold text-xs hover:bg-[#bae6fd] transition-colors disabled:opacity-60"
      >
        {saving ? "Saving Trade…" : "Save & Audit Trade"}
      </button>
    </form>
  )
}
