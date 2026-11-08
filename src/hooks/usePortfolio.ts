"use client"

import { useQuery } from "@tanstack/react-query"

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio-holdings"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio")
      if (!res.ok) throw new Error("Failed to fetch portfolio")
      return res.json()
    },
    refetchInterval: 60000,
  })
}
