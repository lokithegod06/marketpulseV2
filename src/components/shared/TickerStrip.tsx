"use client"

const TICKER_ITEMS = [
  { label: "NIFTY 50", value: "24,312.15", change: "+0.42%", up: true },
  { label: "BANK NIFTY", value: "51,348.80", change: "+0.86%", up: true },
  { label: "INDIA VIX", value: "12.45", change: "−4.23%", up: false },
  { label: "DOW JONES", value: "40,834.97", change: "+0.60%", up: true },
  { label: "S&P 500", value: "5,592.18", change: "+0.76%", up: true },
  { label: "NIKKEI 225", value: "38,362.53", change: "+0.82%", up: true },
  { label: "USD/INR", value: "83.85", change: "−0.08%", up: false },
  { label: "CRUDE OIL", value: "$77.20", change: "−1.4%", up: false },
]

export function TickerStrip() {
  return (
    <div className="flex min-h-[32px] select-none items-center gap-4 overflow-x-auto border-b border-border bg-surface-base px-3 py-1.5 sm:gap-6 sm:px-6">
      {TICKER_ITEMS.map((item, idx) => (
        <div key={item.label} className="flex shrink-0 items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[10px] text-text-secondary font-medium tracking-wider">
              {item.label}
            </span>
            <span
              className={`text-[11px] font-mono font-medium ${
                item.up ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {item.value}
            </span>
            <span
              className={`text-[10px] font-mono ${
                item.up ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {item.change}
            </span>
          </div>
          {idx < TICKER_ITEMS.length - 1 && (
            <span className="text-border text-xs">·</span>
          )}
        </div>
      ))}
    </div>
  )
}
