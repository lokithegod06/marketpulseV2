import { PreMarketData } from "@/types"

export function FiiDiiCard({ data }: { data: PreMarketData }) {
  const flowsAvailable = data.fiiCash !== null && data.diiCash !== null
  const net = data.netCashInflow
  const netLabel =
    net === null ? "Unavailable" : net > 0 ? "Net buying" : net < 0 ? "Net selling" : "Balanced"
  const netColor =
    net === null || net === 0
      ? "text-text-secondary"
      : net > 0
        ? "text-accent-green"
        : "text-accent-red"
  const formatNet = (value: number | null) => {
    if (value === null) return "—"
    const sign = value > 0 ? "+" : value < 0 ? "−" : ""
    return `${sign}₹${Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-semibold text-text-primary">Institutional Flows</div>
        <span className="text-[10px] text-text-muted">
          {flowsAvailable
            ? `NSE India${data.institutionalFlowsDate ? ` · ${data.institutionalFlowsDate}` : ""}`
            : "NSE data unavailable"}
        </span>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-border text-text-secondary uppercase text-[10px]">
              <th className="py-1.5 px-2 text-left"></th>
              <th className="py-1.5 px-2 text-right">Net cash (₹ Cr)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2.5 px-2 font-semibold text-text-primary">FII</td>
              <td className={`py-2.5 px-2 text-right font-mono ${data.fiiCash === null ? "text-text-muted" : data.fiiCash >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                {formatNet(data.fiiCash)}
              </td>
            </tr>
            <tr>
              <td className="py-2.5 px-2 font-semibold text-text-primary">DII</td>
              <td className={`py-2.5 px-2 text-right font-mono ${data.diiCash === null ? "text-text-muted" : data.diiCash >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                {formatNet(data.diiCash)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 p-2.5 bg-surface-base rounded-lg border border-border">
        <div className="text-[10px] text-text-muted">Net Cash Inflow (₹ Cr)</div>
        <div className={`text-base font-mono font-semibold ${netColor} mt-0.5`}>
          {formatNet(net)}
        </div>
        <span className="inline-block mt-1 text-[10px] font-mono text-text-secondary bg-surface-mid border border-border px-2 py-0.5 rounded">
          {netLabel}
        </span>
      </div>
    </div>
  )
}
