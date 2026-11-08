import { PreMarketData } from "@/types"

export function GlobalMarketsRow({ data }: { data: PreMarketData }) {
  const markets = [
    {
      name: "Dow Jones",
      sub: "US Cash",
      status: data.dowStatus,
      price: data.dowPrice,
      changePts: data.dowChangePts,
      changePct: data.dowChange,
      source: data.sources?.dow ?? "Sample",
    },
    {
      name: "S&P 500",
      sub: "US Cash",
      status: data.sp500Status,
      price: data.sp500Price,
      changePts: data.sp500ChangePts,
      changePct: data.sp500Change,
      source: data.sources?.sp500 ?? "Sample",
    },
    {
      name: "Nikkei 225",
      sub: "Tokyo",
      status: data.nikkeiStatus,
      price: data.nikkeiPrice,
      changePts: data.nikkeiChangePts,
      changePct: data.nikkeiChange,
      source: data.sources?.nikkei ?? "Sample",
    },
  ]

  return (
    <>
      {markets.map((market) => (
        <div
          key={market.name}
          className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[10px] text-text-muted">{market.name}</div>
                <div className="text-[11px] text-text-secondary mt-0.5">{market.sub}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-text-muted bg-surface-mid border-border">
                {market.source}
              </span>
            </div>
            <div className="text-[22px] font-semibold font-mono text-text-primary">
              {market.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <div className={`mt-1 text-xs font-mono ${market.changePts >= 0 ? "text-accent-green" : "text-accent-red"}`}>
              {market.changePts >= 0 ? "+" : ""}{market.changePts.toFixed(2)} (
              {market.changePct >= 0 ? "+" : ""}{market.changePct.toFixed(2)}%)
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
