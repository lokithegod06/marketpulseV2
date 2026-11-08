"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/PageHeader"
import { WatchlistTable } from "@/components/watchlist/WatchlistTable"
import { QuoteItem } from "@/lib/prices"

export default function WatchlistPage() {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [symbolInput, setSymbolInput] = useState("")
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAdding, setIsAdding] = useState(false)

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
      setError("That symbol is already in your watchlist.")
      return
    }
    setError("")
    setSuccess("")
    setIsAdding(true)
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
      setSuccess(`${clean} added to your watchlist.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add symbol.")
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (sym: string) => {
    setError("")
    setSuccess("")
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
        subtitle={`Free: 10 stocks · Pro: 20 stocks · ${
          slotsRemaining === null ? "Loading available slots…" : `You have ${slotsRemaining} slots left`
        }`}
      />

      <div className="mx-auto max-w-[1500px] p-4 sm:p-6">
        <form
          onSubmit={handleAdd}
          className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-surface-low p-4"
        >
          <label className="flex min-w-[220px] flex-1 flex-col gap-1.5">
            <span className="text-[11px] font-medium text-text-secondary">Add a stock to your watchlist</span>
            <input
              type="text"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
              placeholder="NSE symbol, e.g. SBIN"
              autoComplete="off"
              className="w-full rounded-lg border border-border bg-surface-base px-3 py-2 text-xs text-text-primary focus:border-accent-blue focus:outline-none"
            />
          </label>
          <button
            type="submit"
            disabled={isAdding || !symbolInput.trim() || slotsRemaining === 0}
            className="rounded-lg bg-accent-blue px-4 py-2 text-xs font-semibold text-[#001e2f] hover:bg-[#bae6fd] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAdding
              ? "Adding…"
              : slotsRemaining === 0
                ? "Watchlist full"
                : "Add to watchlist"}
          </button>
        </form>
        {error && (
          <div role="alert" className="mb-4 rounded-lg border border-accent-red/30 bg-accent-red/10 p-3 text-xs text-accent-red">
            {error}
          </div>
        )}
        {success && (
          <div role="status" className="mb-4 rounded-lg border border-accent-green/30 bg-accent-green/10 p-3 text-xs text-accent-green">
            {success}
          </div>
        )}
        <WatchlistTable items={items} onRemove={handleRemove} />
      </div>
    </div>
  )
}
