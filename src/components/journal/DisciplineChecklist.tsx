"use client"
import { DisciplineCheckItem } from "@/types"

export function DisciplineChecklist({
  items,
  onToggle,
}: {
  items: DisciplineCheckItem[]
  onToggle: (index: number) => void
}) {
  return (
    <div className="space-y-1.5">
      {items.map((item, idx) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onToggle(idx)}
          className="w-full flex items-center gap-2.5 py-1 text-left"
        >
          <span
            className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
              item.checked
                ? "bg-accent-blue/20 border-accent-blue text-accent-blue"
                : "border-border bg-surface-base text-transparent"
            }`}
          >
            ✓
          </span>
          <span className="text-xs text-text-secondary">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
