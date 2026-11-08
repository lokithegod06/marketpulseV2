import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "green" | "blue" | "red" | "yellow" | "neutral"
}

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  const tones = {
    green: "text-accent-green bg-accent-green/10 border-accent-green/20",
    blue: "text-accent-blue bg-accent-blue/10 border-accent-blue/20",
    red: "text-accent-red bg-accent-red/10 border-accent-red/20",
    yellow: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20",
    neutral: "text-text-secondary bg-surface-mid border-border",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-full border",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
