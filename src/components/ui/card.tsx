import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
