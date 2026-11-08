export function ScreenerCard({
  title,
  description,
  countLabel,
  isPro,
  active,
  onRun,
}: {
  title: string
  description: string
  countLabel: string
  isPro: boolean
  active?: boolean
  onRun: () => void
}) {
  return (
    <div
      className={`bg-surface-low border rounded-xl p-5 flex flex-col justify-between transition-colors ${
        active ? "border-accent-blue" : "border-border hover:border-accent-blue/30"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-text-primary">{title}</h3>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isPro
                ? "text-accent-blue bg-accent-blue/10 border-accent-blue/20"
                : "text-accent-green bg-accent-green/10 border-accent-green/20"
            }`}
          >
            {isPro ? "PRO" : "Free"}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed mb-3">{description}</p>
        <div className="text-[11px] text-text-muted">{countLabel}</div>
      </div>
      <button
        type="button"
        onClick={onRun}
        className={`mt-4 w-full rounded-lg py-2 text-xs font-semibold transition-colors ${
          isPro
            ? "bg-accent-blue text-[#001e2f] hover:bg-[#bae6fd]"
            : "bg-surface-mid text-text-primary border border-border hover:border-accent-blue/40"
        }`}
      >
        {isPro ? "Run Pro Screener" : "Run Screener"}
      </button>
    </div>
  )
}
