import { PreMarketData } from "@/types"

export function VixCard({ data }: { data: PreMarketData }) {
  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold text-text-primary">India VIX</div>
          <span className="text-[10px] text-text-muted">{data.sources?.vix ?? "Sample"}</span>
        </div>
        <div className="text-[11px] text-text-secondary mt-0.5">Volatility Gauge</div>
      </div>
      <div className="text-[28px] font-semibold font-mono text-text-primary">{data.vix.toFixed(2)}</div>
      <div className={`text-xs font-mono mt-1 ${data.vixChangePts >= 0 ? "text-accent-green" : "text-accent-red"}`}>
        {data.vixChangePts > 0 ? "+" : ""}
        {data.vixChangePts.toFixed(2)} ({data.vixChange.toFixed(2)}%)
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-[10px] mb-1.5">
          <span className="text-text-muted">Sample Historical Percentile</span>
          <span className="text-accent-blue font-semibold">{data.vixPercentile}th Percentile</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full"
            style={{ width: `${data.vixPercentile}%` }}
          />
        </div>
      </div>
      <p className="mt-4 text-[11px] text-text-secondary leading-relaxed">
        Percentile and regime commentary are illustrative, not calculated from a live historical series.
      </p>
    </div>
  )
}
