import { PreMarketData } from "@/types"

export function PreMarketCard({ data }: { data: PreMarketData }) {
  const changeColor = data.giftNiftyChangePts >= 0 ? "text-accent-green" : "text-accent-red"

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] text-text-muted font-medium uppercase tracking-wider">NIFTY 50 SPOT</div>
          <div className="text-[13px] font-semibold text-text-primary mt-0.5">Nifty 50 Index</div>
        </div>
        <span className="text-[10px] font-mono text-text-muted bg-surface-mid border border-border px-2 py-0.5 rounded-full">
          {data.sources?.nifty ?? "Sample"}
        </span>
      </div>
      <div className="text-[28px] font-semibold font-mono text-text-primary tracking-tight">
        {data.giftNiftyPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </div>
      <div className={`mt-1.5 text-xs font-mono font-medium ${changeColor}`}>
        {data.giftNiftyChangePts >= 0 ? "+" : ""}{data.giftNiftyChangePts.toFixed(2)} pts (
        {data.giftNiftyChange >= 0 ? "+" : ""}{data.giftNiftyChange.toFixed(2)}%)
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
        <div>
          <div className="text-[10px] text-text-muted">Day High</div>
          <div className="mt-0.5 text-xs font-mono text-text-primary">{data.giftNiftyHigh.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted">Day Low</div>
          <div className="mt-0.5 text-xs font-mono text-text-primary">{data.giftNiftyLow.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <div className="text-[10px] text-text-muted">Previous Close</div>
          <div className="mt-0.5 text-xs font-mono text-text-primary">
            {data.giftNiftyClose.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  )
}
