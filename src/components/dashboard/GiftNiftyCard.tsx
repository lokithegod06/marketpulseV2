import { PreMarketData } from "@/types"

export function GiftNiftyCard({ data }: { data: PreMarketData }) {
  const quote = data.giftNiftyQuote
  const positive = (quote?.changePct ?? 0) >= 0
  const changeColor = positive ? "text-accent-green" : "text-accent-red"

  return (
    <div className="bg-surface-low border border-border rounded-xl p-5 hover:border-accent-blue/20 transition-colors">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">GIFT NIFTY 50 FUTURES</div>
          <div className="mt-0.5 text-[13px] font-semibold text-text-primary">NSE International Exchange</div>
        </div>
        <span className="rounded-full border border-border bg-surface-mid px-2 py-0.5 text-[10px] font-mono text-text-muted">
          {quote?.source || "No live quote"}
        </span>
      </div>
      {quote ? (
        <>
          <div className="text-[28px] font-semibold font-mono tracking-tight text-text-primary">
            {quote.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`mt-1.5 text-xs font-mono font-medium ${changeColor}`}>
            {quote.changePoints >= 0 ? "+" : ""}{quote.changePoints.toFixed(2)} pts (
            {quote.changePct >= 0 ? "+" : ""}{quote.changePct.toFixed(2)}%)
          </div>
          <div className="mt-4 border-t border-border/60 pt-3">
            <div className="text-[10px] text-text-muted">Change vs previous close · includes the extended session after 3:30 PM IST</div>
            <div className="mt-1 text-[11px] text-text-secondary">
              Previous close {quote.previousClose.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              {" · "}Quote fetched {new Date(quote.updatedAt).toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "2-digit",
                minute: "2-digit",
              })} IST
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-border/60 bg-surface-base p-3 text-xs leading-relaxed text-text-secondary">
          GIFT Nifty has no quote available from the connected market-data source right now. The Nifty 50 spot card is shown separately; it is not substituted for GIFT Nifty.
        </div>
      )}
    </div>
  )
}
