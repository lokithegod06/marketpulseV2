export function ScoreBars() {
  const bars = [
    { label: "⊖ Overtrading Resistance", score: 94, color: "bg-accent-green", text: "text-accent-green" },
    { label: "◎ Risk Management & Sizing", score: 90, color: "bg-accent-green", text: "text-accent-green" },
    { label: "⏱ Patience (Setup Selectivity)", score: 82, color: "bg-accent-blue", text: "text-accent-blue" },
    { label: "⊗ Emotional Exit Control", score: 86, color: "bg-accent-blue", text: "text-accent-blue" },
  ]
  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">{b.label}</span>
            <span className={`font-mono ${b.text}`}>{b.score}/100</span>
          </div>
          <div className="h-1 bg-border rounded-full overflow-hidden">
            <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.score}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}
