"use client"
import { QuoteItem } from "@/lib/prices"
import { useRouter } from "next/navigation"
import { useWatchlistStore } from "@/store/watchlistStore"

export function WatchlistTable({
  items,
  onRemove,
}: {
  items: QuoteItem[]
  onRemove?: (sym: string) => void
}) {
  const router = useRouter()
  const { setPrefillJournalSymbol } = useWatchlistStore()

  const handleJournal = (sym: string) => {
    setPrefillJournalSymbol(sym)
    router.push("/journal")
  }

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-3">Symbol</th>
            <th className="py-2 px-3">Sector</th>
            <th className="py-2 px-3">LTP</th>
            <th className="py-2 px-3">Change</th>
            <th className="py-2 px-3">Change %</th>
            <th className="py-2 px-3">52W High</th>
            <th className="py-2 px-3">52W Low</th>
            <th className="py-2 px-3">Volume</th>
            <th className="py-2 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {items.map((item) => {
            const up = item.change >= 0
            return (
              <tr key={item.symbol} className="border-b border-border/50 hover:bg-surface-high/40">
                <td className="py-3 px-3 font-semibold text-text-primary">{item.symbol}</td>
                <td className="py-3 px-3 text-[11px] text-text-muted">{item.sector}</td>
                <td className="py-3 px-3 font-mono">₹{item.ltp.toLocaleString("en-IN")}</td>
                <td className={`py-3 px-3 font-mono ${up ? "text-accent-green" : "text-accent-red"}`}>
                  {up ? "+" : "−"}
                  {Math.abs(item.change).toFixed(1)}
                </td>
                <td className={`py-3 px-3 font-mono ${up ? "text-accent-green" : "text-accent-red"}`}>
                  {up ? "+" : ""}
                  {item.changePct.toFixed(2)}%
                </td>
                <td className="py-3 px-3 font-mono">₹{item.high52w.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 font-mono">₹{item.low52w.toLocaleString("en-IN")}</td>
                <td className="py-3 px-3 font-mono text-text-secondary">{item.volume}</td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleJournal(item.symbol)}
                    className="px-2.5 py-1 rounded bg-surface-mid border border-border text-[10px] text-text-primary hover:border-accent-blue"
                  >
                    Journal
                  </button>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(item.symbol)}
                      className="px-2 py-1 rounded text-[10px] text-text-muted hover:text-accent-red"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={9} className="py-8 text-center text-xs text-text-muted">
                Your watchlist is empty. Add a symbol to start tracking it.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
