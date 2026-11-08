import { create } from "zustand"

interface UiState {
  searchQuery: string
  dayUnrealizedPnl: number | null
  disciplineScore: number | null
  setSearchQuery: (q: string) => void
  setDayUnrealizedPnl: (val: number | null) => void
  setDisciplineScore: (val: number) => void
}

export const useUiStore = create<UiState>((set) => ({
  searchQuery: "",
  dayUnrealizedPnl: null,
  disciplineScore: null,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDayUnrealizedPnl: (dayUnrealizedPnl) => set({ dayUnrealizedPnl }),
  setDisciplineScore: (disciplineScore) => set({ disciplineScore }),
}))
