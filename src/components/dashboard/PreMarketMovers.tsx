"use client"

import { PreMarketMover } from "@/types"
import { useRouter } from "next/navigation"
import { useWatchlistStore } from "@/store/watchlistStore"

export function PreMarketMovers({ movers }: { movers: PreMarketMover[] }) {
  const router = useRouter()
  const { setPrefillJournalSymbol } = useWatchlistStore()

  const handleBuyLimit = (symbol: string) => {
    setPrefillJournalSymbol(symbol)
    router.push("/journal")
  }

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-text-primary">Pre-Market Movers & Gap Setups</h3>
          <span className="text-[10px] text-text-muted">Sample data</span>
        </div>
        <div className="flex gap-1 bg-surface-base p-1 rounded-lg border border-border text-[11px]">
          <span className="px-3 py-1 rounded bg-surface-mid text-text-primary font-medium">Equity F&O</span>
          <span className="px-3 py-1 text-text-secondary">Indices</span>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[580px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-2">Symbol</th>
            <th className="py-2 px-2">Price</th>
            <th className="py-2 px-2">Gap %</th>
            <th className="py-2 px-2">Vol</th>
            <th className="py-2 px-2">Catalyst</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {movers.map((m) => (
            <tr key={m.symbol} className="border-b border-border/50 hover:bg-surface-high/40">
              <td className="py-3 px-2">
                <div className="font-semibold text-text-primary">{m.symbol}</div>
                <div className="text-[10px] text-text-muted">{m.sector}</div>
              </td>
              <td className="py-3 px-2 font-mono">₹{m.price.toFixed(2)}</td>
              <td className="py-3 px-2 font-mono text-accent-green">+{m.gapPct.toFixed(2)}%</td>
              <td className="py-3 px-2 font-mono text-accent-green">{m.volumeMultiple}</td>
              <td className="py-3 px-2 text-[11px] text-text-secondary">{m.catalyst}</td>
              <td className="py-3 px-2 text-right">
                <button
                  onClick={() => handleBuyLimit(m.symbol)}
                  className="bg-accent-blue text-[#001e2f] font-semibold text-[10px] px-2.5 py-1 rounded hover:bg-[#bae6fd] transition-colors"
                >
                  Buy Lmt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
