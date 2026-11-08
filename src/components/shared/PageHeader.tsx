import * as React from "react"

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-border bg-surface-base/60">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" />
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">{title}</h1>
          {subtitle && <div className="text-[11px] text-text-secondary mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
