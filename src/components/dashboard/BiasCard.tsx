import { BiasResult } from "@/types"

export function BiasCard({
  bias,
  hasSampleInputs,
}: {
  bias: BiasResult
  hasSampleInputs: boolean
}) {
  const isBull = bias.bias === "BULLISH"
  return (
    <div
      className={`rounded-xl p-5 border transition-colors ${
        isBull
          ? "bg-accent-green/[0.03] border-accent-green/30"
          : "bg-surface-low border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-text-primary">Market Pulse Bias</h3>
        <span className="text-[10px] font-mono text-accent-green bg-accent-green/10 border border-accent-green/20 px-2.5 py-0.5 rounded-full">
          ● {bias.bias === "BULLISH" ? "Bullish" : bias.bias} ({bias.bullPercent}%)
        </span>
      </div>
      {hasSampleInputs && (
        <p className="mb-3 text-[10px] text-text-muted">
          Illustrative calculation: some market inputs are sample data.
        </p>
      )}
      <p className="text-[13px] text-text-secondary leading-relaxed mb-4">{bias.reasoning}</p>
      <div className="text-[11px] text-text-muted mb-2.5">Intraday Pivot Projections (Nifty Spot)</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0b0f19] border border-border rounded-lg p-2.5">
          <div className="text-[10px] text-text-muted">Resistance 1</div>
          <div className="text-[13px] font-mono text-accent-red mt-0.5">{bias.pivots.r1.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#0b0f19] border border-border rounded-lg p-2.5">
          <div className="text-[10px] text-text-muted">Resistance 2</div>
          <div className="text-[13px] font-mono text-accent-red mt-0.5">{bias.pivots.r2.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#0b0f19] border border-border rounded-lg p-2.5">
          <div className="text-[10px] text-text-muted">Support 1</div>
          <div className="text-[13px] font-mono text-accent-green mt-0.5">{bias.pivots.s1.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#0b0f19] border border-border rounded-lg p-2.5">
          <div className="text-[10px] text-text-muted">Support 2</div>
          <div className="text-[13px] font-mono text-accent-green mt-0.5">{bias.pivots.s2.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  )
}
