import Link from "next/link"
import { PageHeader } from "@/components/shared/PageHeader"

export default function TradeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="pb-10">
      <PageHeader
        title={`Trade Audit Record #${params.id}`}
        subtitle="Detailed execution breakdown & post-trade reflection"
        actions={
          <Link
            href="/journal"
            className="px-3.5 py-1.5 rounded-lg bg-surface-low border border-border text-xs text-text-primary"
          >
            ← Back to Journal
          </Link>
        }
      />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-surface-low border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono font-semibold text-accent-green">BANKNIFTY 29AUG 51200 CE</span>
            <span className="text-xs font-mono text-accent-green">+₹19,350.00</span>
          </div>
          <p className="text-xs text-text-secondary">
            All 5 pre-trade discipline checks passed. Executed on candle close above VWAP + R1 pivot confluence.
          </p>
        </div>
      </div>
    </div>
  )
}
