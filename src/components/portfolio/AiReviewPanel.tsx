import { PortfolioAiReview } from "@/types"

export function AiReviewPanel({ review }: { review: PortfolioAiReview }) {
  return (
    <div className="bg-surface-mid/80 border border-accent-blue/20 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-accent-blue text-sm">✦</span>
          <h3 className="text-[13px] font-semibold text-text-primary">AI Portfolio Analysis</h3>
        </div>
        <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2.5 py-0.5 rounded-full">
          Generated 09:11 AM
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-wider text-accent-green uppercase mb-1.5">
            ✓ STRONG POSITIONS
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{review.strongPositions.detail}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-accent-red uppercase mb-1.5">
            ⚠ UNDERPERFORMERS
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{review.underperformers.detail}</p>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-wider text-accent-blue uppercase mb-1.5">
            ◎ CONCENTRATION RISK
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{review.concentrationRisk.detail}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
        <span>
          <strong className="text-text-secondary">Top Action:</strong> {review.topAction}
        </span>
        <span>
          Disclaimer: AI fundamental observations based on Claude training knowledge, not SEBI-registered investment advice.
        </span>
      </div>
    </div>
  )
}
