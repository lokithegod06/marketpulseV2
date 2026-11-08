import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-accent-blue text-[#001e2f] font-semibold hover:bg-[#bae6fd]",
      secondary: "bg-surface-low text-text-primary border border-border hover:border-accent-blue/40",
      ghost: "bg-transparent text-text-secondary hover:bg-surface-low hover:text-text-primary",
      danger: "bg-accent-red/10 text-accent-red border border-accent-red/30 hover:bg-accent-red/20",
    }
    const sizes = {
      sm: "px-2.5 py-1 text-xs rounded-md",
      md: "px-4 py-2 text-xs rounded-lg",
      lg: "px-6 py-3 text-sm rounded-lg",
    }
    return (
      <button
        ref={ref}
        className={cn("inline-flex items-center justify-center transition-colors disabled:opacity-50", variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
