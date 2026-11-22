import Parser from "rss-parser"
import { NewsItem } from "@/types"
import { cacheGet, cacheSet } from "./redis"
import { callClaude, isClaudeConfigured } from "./claude"
import { NEWS_SCORING_SYSTEM } from "./prompts"

const parser = new Parser()
const NEWS_CACHE_KEY = "news:feed:v3"
const RAW_NEWS_CACHE_KEY = "news:headlines:v1"
const MAX_NEWS_AGE_MS = 48 * 60 * 60 * 1000

export const RSS_FEEDS = [
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/MCtopnews.xml" },
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
  { source: "Mint", url: "https://www.livemint.com/rss/markets" },
  { source: "Business Standard", url: "https://www.business-standard.com/rss/markets-106.rss" },
  { source: "Financial Express", url: "https://www.financialexpress.com/market/feed/" },
]

export type MarketHeadline = {
  id: string
  source: string
  title: string
  link: string
  publishedAt: string
}

type CuratedNews = {
  items: NewsItem[]
  source: string
}

type DatedHeadline = {
  id: string
  source: string
  title: string
  link: string
  publishedAt: string
  publishedTime: number
}

async function fetchXHeadlines(): Promise<DatedHeadline[]> {
  const bearerToken = process.env.X_BEARER_TOKEN
  if (!bearerToken) return []

  const query = '(Nifty OR BankNifty OR RBI OR SEBI OR "Indian markets" OR NSE) lang:en -is:retweet'
  const url = new URL("https://api.x.com/2/tweets/search/recent")
  url.searchParams.set("query", query)
  url.searchParams.set("max_results", "20")
  url.searchParams.set("tweet.fields", "created_at,public_metrics")
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  })
  if (!response.ok) {
    throw new Error(`X API returned ${response.status}`)
  }

  const payload = (await response.json()) as {
    data?: { id: string; text: string; created_at?: string }[]
  }
  return (payload.data || []).flatMap((tweet) => {
    const publishedTime = tweet.created_at ? Date.parse(tweet.created_at) : Number.NaN
    if (!Number.isFinite(publishedTime)) return []
    return [{
      id: `X-${tweet.id}`,
      source: "X",
      title: tweet.text,
      link: `https://x.com/i/web/status/${tweet.id}`,
      publishedAt: new Date(publishedTime).toISOString(),
      publishedTime,
    }]
  })
}

export async function getRecentMarketHeadlines(): Promise<MarketHeadline[]> {
  const cached = await cacheGet<MarketHeadline[]>(RAW_NEWS_CACHE_KEY)
  if (cached) return cached

  const now = Date.now()
  const feedHeadlines = await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url)
        return parsed.items.flatMap((item, index) => {
          if (!item.title) return []
          const date = item.isoDate || item.pubDate
          const publishedTime = date ? Date.parse(date) : Number.NaN
          if (
            !Number.isFinite(publishedTime) ||
            publishedTime > now + 5 * 60 * 1000 ||
            now - publishedTime > MAX_NEWS_AGE_MS
          ) {
            return []
          }
          return [{
            id: `${feed.source}-${item.guid || item.link || index}`,
            source: feed.source,
            title: item.title,
            link: item.link || feed.url,
            publishedAt: new Date(publishedTime).toISOString(),
            publishedTime,
          }]
        })
      } catch (error) {
        console.error(`News feed failed (${feed.source}):`, error)
        return []
      }
    })
  )

  let socialHeadlines: DatedHeadline[] = []
  try {
    socialHeadlines = await fetchXHeadlines()
  } catch (error) {
    console.error("X news fetch failed:", error)
  }

  const headlines = [...feedHeadlines.flat(), ...socialHeadlines]
    .sort((a, b) => b.publishedTime - a.publishedTime)
    .slice(0, 40)
    .map(({ publishedTime: _publishedTime, ...headline }) => headline)

  await cacheSet(RAW_NEWS_CACHE_KEY, headlines, 300)
  return headlines
}

export async function getCuratedNewsWithSource(): Promise<CuratedNews> {
  const cached = await cacheGet<CuratedNews>(NEWS_CACHE_KEY)
  if (cached) return cached

  const recentHeadlines = (await getRecentMarketHeadlines()).slice(0, 10)

  if (recentHeadlines.length > 0) {
    let scores: { id: string; score: number; catalyst: string | null }[] = []
    if (isClaudeConfigured()) {
      try {
        const rawJson = await callClaude(
          NEWS_SCORING_SYSTEM,
          JSON.stringify(recentHeadlines.map(({ id, title }) => ({ id, title })))
        )
        const jsonMatch = rawJson.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error("AI returned no news scores")
        scores = (JSON.parse(jsonMatch[0]) as {
          scores: { id: string; score: number; catalyst: string | null }[]
        }).scores
      } catch (error) {
        console.error("AI news scoring failed:", error)
        scores = []
      }
    }

    const items = recentHeadlines
      .map((headline) => {
        const match = scores.find((score) => score.id === headline.id)
        return {
          ...headline,
          score: match?.score ?? 6,
          catalyst: match?.catalyst ?? null,
        }
      })
      .filter((headline) => headline.score >= 5)
      .slice(0, 5)

    if (items.length > 0) {
      const result: CuratedNews = {
        items,
        source: Array.from(new Set(items.map((item) => item.source))).join(" · "),
      }
      await cacheSet(NEWS_CACHE_KEY, result, 300)
      return result
    }
  }

  const result: CuratedNews = { items: [], source: "No recent headlines" }
  await cacheSet(NEWS_CACHE_KEY, result, 120)
  return result
}

export async function getCuratedNews(): Promise<NewsItem[]> {
  return (await getCuratedNewsWithSource()).items
}
