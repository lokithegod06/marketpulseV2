import { ChartinkResult } from "@/types"

export function ScreenerResults({
  title,
  results,
  source,
}: {
  title: string
  results: ChartinkResult[]
  source: string
}) {
  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 mt-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-text-primary">
          Scan Output: <span className="text-accent-blue">{title}</span>
        </h3>
        <span className="text-[10px] font-mono text-text-muted">{source}</span>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border text-[10px] text-text-secondary uppercase">
            <th className="py-2 px-3">NSE Symbol</th>
            <th className="py-2 px-3">Company / Signal</th>
            <th className="py-2 px-3">LTP (₹)</th>
            <th className="py-2 px-3">Change %</th>
            <th className="py-2 px-3">Volume</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {results.map((r) => (
            <tr key={r.nsecode} className="border-b border-border/50 hover:bg-surface-high/40">
              <td className="py-3 px-3 font-semibold text-text-primary font-mono">{r.nsecode}</td>
              <td className="py-3 px-3 text-text-secondary">{r.company_name}</td>
              <td className="py-3 px-3 font-mono">₹{r.close.toLocaleString("en-IN")}</td>
              <td className="py-3 px-3 font-mono text-accent-green">
                +{ (r.per_chg ?? 1.5).toFixed(2) }%
              </td>
              <td className="py-3 px-3 font-mono text-text-secondary">
                {(r.volume / 1_000_000).toFixed(2)}M
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
