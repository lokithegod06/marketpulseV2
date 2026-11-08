import * as React from "react"

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex items-center">
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap rounded bg-surface-mid border border-border px-2 py-1 text-[10px] text-text-secondary shadow-lg z-50">
        {label}
      </span>
    </span>
  )
}
