"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { TradeForm } from "@/components/journal/TradeForm"
import { TradeTable } from "@/components/journal/TradeTable"
import { AiFeedbackPanel } from "@/components/journal/AiFeedbackPanel"
import { JournalAiFeedback, TradeRecord } from "@/types"
import { useWatchlistStore } from "@/store/watchlistStore"

const INITIAL_TRADES: TradeRecord[] = [
  {
    id: "t-1",
    date: "2026-11-05",
    time: "09:22 AM",
    symbol: "BANKNIFTY 51200 CE",
    exchange: "NSE",
    direction: "BUY",
    entryPrice: 245,
    exitPrice: 310,
    quantity: 300,
    strategyTag: "ORB Breakout",
    disciplineChecks: [],
    pnl: 19350,
    isOpen: false,
  },
  {
    id: "t-2",
    date: "2026-11-05",
    time: "10:15 AM",
    symbol: "NIFTY 24800 PE",
    exchange: "NSE",
    direction: "BUY",
    entryPrice: 116,
    exitPrice: 149,
    quantity: 400,
    strategyTag: "VWAP Fade",
    disciplineChecks: [],
    pnl: 13200,
    isOpen: false,
  },
  {
    id: "t-3",
    date: "2026-11-05",
    time: "11:40 AM",
    symbol: "TATASTEEL EQ",
    exchange: "NSE",
    direction: "BUY",
    entryPrice: 151,
    exitPrice: 171.2,
    quantity: 500,
    strategyTag: "Swing Pullback",
    disciplineChecks: [],
    pnl: 10100,
    isOpen: false,
  },
  {
    id: "t-4",
    date: "2026-11-05",
    time: "01:18 PM",
    symbol: "NIFTY 24980 CE",
    exchange: "NSE",
    direction: "BUY",
    entryPrice: 88,
    exitPrice: 74,
    quantity: 300,
    strategyTag: "Momentum Chasing",
    disciplineChecks: [],
    pnl: -4200,
    isOpen: false,
  },
]

const INITIAL_FEEDBACK: JournalAiFeedback = {
  positivePattern: {
    title: "Consistent Stop Discipline",
    detail: "3 out of 4 setups, exits were pre-planned. 85% win rate this month.",
    impactPoints: 8,
  },
  leakDetected: {
    title: "Mid-Day Overtrading",
    detail: "01:10 PM Nifty trade entered during midday chop zone. Chop Risk Flag.",
    estimatedLoss: 4200,
    flag: "MIDDAY_CHOP",
  },
  recommendation: {
    title: "Morning Window Focus",
    detail: "Limit scalping to 9:15–11:00 AM. Cap max risk per expiry at ₹3,000. Mandate 15-min desk break after any trade.",
    priority: "HIGH",
    ruleLabel: "No Trading Midday Chop",
  },
}

export default function TradeJournalPage() {
  const { prefillJournalSymbol } = useWatchlistStore()
  const [trades, setTrades] = useState<TradeRecord[]>([])
  const [feedback, setFeedback] = useState<JournalAiFeedback | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/journal")
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to load your trades.")
        setTrades(data.trades || [])
      })
      .catch((err: Error) => setError(err.message))
  }, [])

  const netPnl = trades.reduce((acc, t) => acc + Number(t.pnl || 0), 0)
  const wins = trades.filter((t) => Number(t.pnl || 0) >= 0).length
  const winRate = trades.length ? Math.round((wins / trades.length) * 100) : 0

  const handleAddTrade = (newTrade: TradeRecord) => {
    setTrades((prev) => [newTrade, ...prev])
  }

  const handleRefreshAi = async () => {
    setLoadingAi(true)
    try {
      const res = await fetch("/api/journal/ai-feedback", { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to load trade coaching.")
      if (data.feedback) setFeedback(data.feedback)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trade coaching.")
    } finally {
      setLoadingAi(false)
    }
  }

  const handleExportCsv = () => {
    const header = "Date,Time,Symbol,Direction,Qty,Entry,Exit,PnL,Strategy\n"
    const rows = trades
      .map(
        (t) =>
          `${t.date},${t.time || ""},${t.symbol},${t.direction},${t.quantity},${t.entryPrice},${t.exitPrice || ""},${t.pnl || 0},${t.strategyTag || ""}`
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "market-pulse-trades.csv"
    a.click()
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Trade Journal & Execution Log"
        subtitle="Today: Session NSE-INTRA-9824X"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-accent-green/10 border border-accent-green/20 rounded-lg px-3.5 py-1.5">
              <div className="text-[10px] text-accent-green uppercase">Net P&L</div>
              <div className="text-sm font-mono font-semibold text-accent-green">
                {netPnl >= 0 ? "+" : "−"}₹{Math.abs(netPnl).toLocaleString("en-IN")}
              </div>
            </div>
            <div className="bg-surface-low border border-border rounded-lg px-3.5 py-1.5">
              <div className="text-[10px] text-text-secondary uppercase">Win Rate</div>
              <div className="text-sm font-mono font-semibold text-accent-green">
                {winRate}% <span className="text-[10px] text-text-muted">({wins}W/{trades.length - wins}L)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="bg-surface-low text-text-primary text-xs px-3.5 py-2 rounded-lg border border-border hover:border-accent-blue/40"
            >
              Export CSV
            </button>
          </div>
        }
      />

      <div className="p-6 max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
        {error && (
          <div className="lg:col-span-12 rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {error}
          </div>
        )}
        <div className="lg:col-span-5">
          <TradeForm initialSymbol={prefillJournalSymbol} onAddTrade={handleAddTrade} />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <TradeTable trades={trades} />
          {feedback && (
            <AiFeedbackPanel feedback={feedback} onRefresh={handleRefreshAi} loading={loadingAi} />
          )}
        </div>
      </div>
    </div>
  )
}
