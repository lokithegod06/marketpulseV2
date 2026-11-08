import * as React from "react"
import { cn } from "@/lib/utils"

export function DataTable({ className, children }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-left", className)}>{children}</table>
    </div>
  )
}
