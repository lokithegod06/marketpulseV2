"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { TradeRecord } from "@/types"

export function useJournal() {
  const queryClient = useQueryClient()

  const tradesQuery = useQuery<{ trades: TradeRecord[] }>({
    queryKey: ["journal-trades"],
    queryFn: async () => {
      const res = await fetch("/api/journal")
      if (!res.ok) throw new Error("Failed to fetch journal")
      return res.json()
    },
  })

  const createTrade = useMutation({
    mutationFn: async (payload: Partial<TradeRecord>) => {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to create trade")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-trades"] })
      queryClient.invalidateQueries({ queryKey: ["discipline-score"] })
    },
  })

  return { tradesQuery, createTrade }
}
