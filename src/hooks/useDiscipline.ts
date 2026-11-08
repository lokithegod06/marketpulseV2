"use client"

import { useQuery } from "@tanstack/react-query"

export function useDiscipline() {
  return useQuery({
    queryKey: ["discipline-score"],
    queryFn: async () => {
      const res = await fetch("/api/discipline")
      if (!res.ok) throw new Error("Failed to fetch discipline telemetry")
      return res.json()
    },
  })
}
