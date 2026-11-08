import { JournalAiFeedback } from "@/types"

export function AiFeedbackPanel({
  feedback,
  onRefresh,
  loading,
}: {
  feedback: JournalAiFeedback
  onRefresh?: () => void
  loading?: boolean
}) {
  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[13px] font-semibold text-text-primary">Execution & Behavioral Intelligence</h3>
          <p className="text-[11px] text-text-muted mt-0.5">
            Quantitative audit across intraday positions · Claude Sonnet 4.6
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="px-3 py-1 rounded-lg bg-surface-mid border border-border text-xs text-accent-blue hover:border-accent-blue/40"
            >
              {loading ? "Analyzing…" : "Get AI Feedback"}
            </button>
          )}
          <span className="text-[10px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2.5 py-1 rounded-full">
            Score: 92/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-surface-mid/80 border border-accent-green/20 rounded-xl p-4">
          <div className="text-[9px] font-bold tracking-wider text-accent-green uppercase mb-1.5">
            ✓ POSITIVE PATTERN
          </div>
          <div className="text-xs font-semibold text-text-primary mb-1">{feedback.positivePattern.title}</div>
          <p className="text-[11px] text-text-secondary leading-relaxed">{feedback.positivePattern.detail}</p>
          <div className="mt-2.5 text-[10px] font-mono text-accent-green">
            Impact: +{feedback.positivePattern.impactPoints} pts · No Revenge Trading
          </div>
        </div>

        <div className="bg-surface-mid/80 border border-accent-red/20 rounded-xl p-4">
          <div className="text-[9px] font-bold tracking-wider text-accent-red uppercase mb-1.5">
            ⚠ LEAK DETECTED
          </div>
          <div className="text-xs font-semibold text-text-primary mb-1">{feedback.leakDetected.title}</div>
          <p className="text-[11px] text-text-secondary leading-relaxed">{feedback.leakDetected.detail}</p>
          <div className="mt-2.5 text-[10px] font-mono text-accent-red">
            Estimated Leak: −₹{feedback.leakDetected.estimatedLoss.toLocaleString("en-IN")} ({feedback.leakDetected.flag})
          </div>
        </div>

        <div className="bg-surface-mid/80 border border-accent-blue/20 rounded-xl p-4">
          <div className="text-[9px] font-bold tracking-wider text-accent-blue uppercase mb-1.5">
            ◎ RECOMMENDATION
          </div>
          <div className="text-xs font-semibold text-text-primary mb-1">{feedback.recommendation.title}</div>
          <p className="text-[11px] text-text-secondary leading-relaxed">{feedback.recommendation.detail}</p>
          <div className="mt-2.5 text-[10px] font-mono text-accent-blue">
            Priority: {feedback.recommendation.priority} · Rule Active
          </div>
        </div>
      </div>
    </div>
  )
}
