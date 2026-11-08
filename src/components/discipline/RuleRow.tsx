export function RuleRow({
  title,
  badge,
  badgeTone,
  description,
  rightTop,
  rightBottom,
  rightPositive,
}: {
  title: string
  badge: string
  badgeTone: "red" | "green" | "blue"
  description: string
  rightTop: string
  rightBottom: string
  rightPositive?: boolean
}) {
  const badgeClasses = {
    red: "text-accent-red bg-accent-red/10 border-accent-red/20",
    green: "text-accent-green bg-accent-green/10 border-accent-green/20",
    blue: "text-accent-blue bg-accent-blue/10 border-accent-blue/20",
  }
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/50 last:border-none">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-text-primary">{title}</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeClasses[badgeTone]}`}>
            {badge}
          </span>
        </div>
        <p className="text-[11px] text-text-secondary">{description}</p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-text-muted">{rightTop}</div>
        <div className={`text-[11px] font-semibold mt-0.5 ${rightPositive ? "text-accent-green" : "text-accent-red"}`}>
          {rightBottom}
        </div>
      </div>
    </div>
  )
}
