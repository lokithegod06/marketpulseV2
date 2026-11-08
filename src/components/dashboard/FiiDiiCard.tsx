import { PreMarketData } from "@/types"

export function FiiDiiCard({ data }: { data: PreMarketData }) {
  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="text-[13px] font-semibold text-text-primary">Institutional Flows</div>
        <span className="text-[10px] text-text-muted">
          {data.sources?.institutionalFlows ?? "Sample"} · Previous Close
        </span>
      </div>
      <table className="w-full text-[11px] border-collapse">
        <thead>
          <tr className="border-b border-border text-text-secondary uppercase text-[10px]">
            <th className="py-1.5 px-2 text-left"></th>
            <th className="py-1.5 px-2 text-left">Cash (Cr)</th>
            <th className="py-1.5 px-2 text-left">Futures</th>
            <th className="py-1.5 px-2 text-left">Bias</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/50">
            <td className="py-2.5 px-2 font-semibold text-text-primary">FII</td>
            <td className="py-2.5 px-2 font-mono text-accent-red">−₹{Math.abs(data.fiiCash).toFixed(2)}</td>
            <td className="py-2.5 px-2 font-mono text-accent-green">+{data.fiiFutures.toLocaleString("en-IN")} L</td>
            <td className="py-2.5 px-2">
              <span className="text-[10px] font-mono text-text-secondary bg-surface-mid border border-border px-2 py-0.5 rounded-full">
                Mild Long
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2.5 px-2 font-semibold text-text-primary">DII</td>
            <td className="py-2.5 px-2 font-mono text-accent-green">+₹{data.diiCash.toLocaleString("en-IN")}</td>
            <td className="py-2.5 px-2 font-mono text-accent-green">+{data.diiFutures.toLocaleString("en-IN")} L</td>
            <td className="py-2.5 px-2">
              <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">
                Strong Buy
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-3 p-2.5 bg-surface-base rounded-lg border border-border">
        <div className="text-[10px] text-text-muted">Net Cash Inflow</div>
        <div className="text-base font-mono font-semibold text-accent-green mt-0.5">
          +₹{data.netCashInflow.toLocaleString("en-IN")} Cr
        </div>
        <span className="inline-block mt-1 text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded">
          ACCUMULATION
        </span>
      </div>
    </div>
  )
}
