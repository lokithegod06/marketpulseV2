"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary"
import { HoldingsTable, HoldingRow } from "@/components/portfolio/HoldingsTable"
import { AiReviewPanel } from "@/components/portfolio/AiReviewPanel"
import { PortfolioAiReview } from "@/types"

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<HoldingRow[]>([])
  const [review, setReview] = useState<PortfolioAiReview | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newSym, setNewSym] = useState("")
  const [newQty, setNewQty] = useState("")
  const [newBuy, setNewBuy] = useState("")
  const [error, setError] = useState("")

  const loadHoldings = async () => {
    const res = await fetch("/api/portfolio")
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to load your portfolio.")
    setHoldings(data.holdings || [])
  }

  useEffect(() => {
    loadHoldings().catch((err: Error) => setError(err.message))
  }, [])

  const invested = holdings.reduce((s, h) => s + h.buyPrice * h.quantity, 0)
  const currentVal = holdings.reduce((s, h) => s + h.currentPrice * h.quantity, 0)

  const handleRunAiReview = async () => {
    setLoadingAi(true)
    try {
      const res = await fetch("/api/portfolio/ai-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to review portfolio.")
      if (data.review) setReview(data.review)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to review portfolio.")
    } finally {
      setLoadingAi(false)
    }
  }

  const handleAddPosition = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSym.trim()) return
    setError("")
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: newSym.toUpperCase().trim(),
          buyPrice: Number(newBuy),
          quantity: Number(newQty),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add holding.")
      await loadHoldings()
      setNewSym("")
      setNewQty("")
      setNewBuy("")
      setShowAdd(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add holding.")
    }
  }

  const handleRemovePosition = async (id: string) => {
    setError("")
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to remove holding.")
      setHoldings((prev) => prev.filter((holding) => holding.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove holding.")
    }
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Portfolio Tracker"
        subtitle="Live prices via NSE feed · Last sync: 09:11 AM"
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowAdd(!showAdd)}
              className="bg-surface-low text-text-primary text-xs px-3.5 py-2 rounded-lg border border-border hover:border-accent-blue/40"
            >
              + Add Position
            </button>
            <button
              type="button"
              onClick={handleRunAiReview}
              disabled={loadingAi}
              className="bg-accent-blue text-[#001e2f] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#bae6fd]"
            >
              {loadingAi ? "Running Claude Review…" : "✦ AI Portfolio Review"}
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-[1500px] space-y-5 p-4 sm:p-6">
        {error && (
          <div role="alert" className="rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {error}
          </div>
        )}
        {showAdd && (
          <form
            onSubmit={handleAddPosition}
            className="bg-surface-low border border-accent-blue/40 rounded-xl p-4 flex flex-wrap items-end gap-3"
          >
            <div>
              <label className="block text-[10px] text-text-secondary mb-1">NSE Symbol</label>
              <input
                type="text"
                required
                placeholder="SBIN"
                value={newSym}
                onChange={(e) => setNewSym(e.target.value)}
                className="bg-surface-base border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-secondary mb-1">Quantity</label>
              <input
                type="number"
                required
                min="1"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                className="bg-surface-base border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary w-28"
              />
            </div>
            <div>
              <label className="block text-[10px] text-text-secondary mb-1">Buy Price (₹)</label>
              <input
                type="number"
                required
                min="0.01"
                value={newBuy}
                onChange={(e) => setNewBuy(e.target.value)}
                className="bg-surface-base border border-border rounded-lg px-3 py-1.5 text-xs font-mono text-text-primary w-32"
              />
            </div>
            <button
              type="submit"
              className="bg-accent-blue text-[#001e2f] font-semibold text-xs px-4 py-2 rounded-lg"
            >
              Save Holding
            </button>
          </form>
        )}

        <PortfolioSummary invested={invested} currentValue={currentVal} dayChange={0} />
        <HoldingsTable holdings={holdings} onRemove={handleRemovePosition} />
        {review && <AiReviewPanel review={review} />}
      </div>
    </div>
  )
}
