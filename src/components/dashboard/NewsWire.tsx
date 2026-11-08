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
              <span className="text-[10px] text-text-muted">{item.publishedAt}</span>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">{item.title}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
