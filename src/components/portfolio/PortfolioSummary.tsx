export function PortfolioSummary({
  invested,
  currentValue,
  dayChange,
}: {
  invested: number
  currentValue: number
  dayChange: number
}) {
  const totalPnl = currentValue - invested
  const totalPnlPct = invested > 0 ? (totalPnl / invested) * 100 : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-surface-low border border-border rounded-xl p-5">
        <div className="text-[11px] text-text-secondary">Total Invested</div>
        <div className="text-[22px] font-semibold font-mono text-text-primary mt-1">
          ₹{invested.toLocaleString("en-IN")}
        </div>
      </div>
      <div className="bg-surface-low border border-border rounded-xl p-5">
        <div className="text-[11px] text-text-secondary">Current Value</div>
        <div className="text-[22px] font-semibold font-mono text-accent-green mt-1">
          ₹{currentValue.toLocaleString("en-IN")}
        </div>
      </div>
      <div className="bg-surface-low border border-border rounded-xl p-5">
        <div className="text-[11px] text-text-secondary">Total P&L</div>
        <div className="text-[22px] font-semibold font-mono text-accent-green mt-1">
          +₹{totalPnl.toLocaleString("en-IN")}
        </div>
        <div className="text-xs font-mono text-accent-green mt-0.5">+{totalPnlPct.toFixed(2)}%</div>
      </div>
      <div className="bg-surface-low border border-border rounded-xl p-5">
        <div className="text-[11px] text-text-secondary">Day&apos;s Change</div>
        <div className="text-[22px] font-semibold font-mono text-accent-green mt-1">
          +₹{dayChange.toLocaleString("en-IN")}
        </div>
        <div className="text-xs font-mono text-accent-green mt-0.5">+1.42% today</div>
      </div>
    </div>
  )
}
