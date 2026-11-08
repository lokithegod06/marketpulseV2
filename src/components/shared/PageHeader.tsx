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
    <div className="flex flex-col items-stretch justify-between gap-3 border-b border-border bg-surface-base/60 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_0_3px_rgba(52,211,153,0.2)]" />
        <div>
          <h1 className="text-[15px] font-semibold text-text-primary">{title}</h1>
          {subtitle && <div className="text-[11px] text-text-secondary mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
    </div>
  )
}
