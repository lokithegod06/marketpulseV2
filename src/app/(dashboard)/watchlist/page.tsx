"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { WatchlistTable } from "@/components/watchlist/WatchlistTable"
import { QuoteItem } from "@/lib/prices"

export default function WatchlistPage() {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [symbolInput, setSymbolInput] = useState("")
  const [slotsRemaining, setSlotsRemaining] = useState(0)
  const [error, setError] = useState("")

  const loadWatchlist = async () => {
    const res = await fetch("/api/watchlist")
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to load your watchlist.")
    setItems(data.items || [])
    setSlotsRemaining(data.slotsRemaining ?? 0)
  }

  useEffect(() => {
    loadWatchlist().catch((err: Error) => setError(err.message))
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const clean = symbolInput.toUpperCase().trim()
    if (!clean) return
    if (items.some((i) => i.symbol === clean)) {
      setSymbolInput("")
      return
    }
    setError("")
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: clean }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to add symbol.")
      await loadWatchlist()
      setSymbolInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add symbol.")
    }
  }

  const handleRemove = async (sym: string) => {
    setError("")
    try {
      const res = await fetch(`/api/watchlist?symbol=${encodeURIComponent(sym)}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to remove symbol.")
      await loadWatchlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove symbol.")
    }
  }

  return (
    <div className="pb-10">
      <PageHeader
        title="Watchlist"
        subtitle={`Free: 10 stocks · Pro: 20 stocks · You have ${slotsRemaining} slots left`}
        actions={
          <form onSubmit={handleAdd} className="flex items-center gap-2">
            <input
              type="text"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="Add symbol (e.g. SBIN)…"
              className="bg-surface-base border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary w-48 focus:outline-none focus:border-accent-blue"
            />
            <button
              type="submit"
              className="bg-accent-blue text-[#001e2f] font-semibold text-xs px-3.5 py-1.5 rounded-lg hover:bg-[#bae6fd]"
            >
              + Add Stock
            </button>
          </form>
        }
      />

      <div className="p-6 max-w-[1500px] mx-auto">
        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {error}
          </div>
        )}
        <WatchlistTable items={items} onRemove={handleRemove} />
      </div>
    </div>
  )
}
