import { NewsItem } from "@/types"

export function NewsWire({
  items,
  source,
}: {
  items: NewsItem[]
  source: string
}) {
  return (
    <div className="bg-surface-low border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-text-primary">Institutional Wire</h3>
        <span className="text-[10px] text-text-muted">{source}</span>
      </div>
      <div className="divide-y divide-border/50">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="block py-3 hover:pl-1 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-accent-blue uppercase tracking-wider">
                  {item.source}
                </span>
                {item.catalyst && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-mid border border-border text-text-secondary">
                    {item.catalyst}
                  </span>
                )}
              </div>
              <time
                dateTime={item.publishedAt}
                title={new Date(item.publishedAt).toLocaleString()}
                className="text-[10px] text-text-muted"
              >
                {formatPublishedAt(item.publishedAt)}
              </time>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.title}</p>
          </a>
        ))}
      </div>
      {items.length === 0 && (
        <p className="py-5 text-xs text-text-muted">
          No recent headlines are available from the configured RSS feeds.
        </p>
      )}
    </div>
  )
}

function formatPublishedAt(value: string) {
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) return "Date unavailable"
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000))
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
