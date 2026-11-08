"use client"

import { useQuery } from "@tanstack/react-query"
import { QuoteItem } from "@/lib/prices"

export function usePrices(symbols: string[], intervalMs = 15000) {
  return useQuery<{ prices: Record<string, QuoteItem>; timestamp: string }>({
    queryKey: ["prices", symbols.join(",")],
    queryFn: async () => {
      const res = await fetch("/api/prices/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbols }),
      })
      if (!res.ok) throw new Error("Failed to fetch prices")
      return res.json()
    },
    refetchInterval: intervalMs,
  })
}
