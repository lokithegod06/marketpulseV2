import { create } from "zustand"

interface WatchlistState {
  symbols: string[]
  prefillJournalSymbol: string | null
  addSymbol: (sym: string) => void
  removeSymbol: (sym: string) => void
  setPrefillJournalSymbol: (sym: string | null) => void
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  symbols: [
    "NIFTY 50",
    "BANKNIFTY",
    "RELIANCE",
    "HDFCBANK",
    "TATASTEEL",
    "INFY",
    "WIPRO",
    "BHARTIARTL",
  ],
  prefillJournalSymbol: null,
  addSymbol: (sym) =>
    set((state) => {
      const clean = sym.toUpperCase().trim()
      if (!clean || state.symbols.includes(clean)) return state
      return { symbols: [...state.symbols, clean] }
    }),
  removeSymbol: (sym) =>
    set((state) => ({
      symbols: state.symbols.filter((s) => s !== sym.toUpperCase().trim()),
    })),
  setPrefillJournalSymbol: (sym) => set({ prefillJournalSymbol: sym }),
}))
