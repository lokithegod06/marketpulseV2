"use client"
import * as React from "react"

export function ToastBanner({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  if (!message) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-surface-mid border border-accent-blue/30 text-text-primary px-4 py-2.5 rounded-lg shadow-xl text-xs">
      <span className="w-2 h-2 rounded-full bg-accent-green" />
      <span>{message}</span>
      <button onClick={onDismiss} className="text-text-secondary hover:text-text-primary ml-2">
        ✕
      </button>
    </div>
  )
}
