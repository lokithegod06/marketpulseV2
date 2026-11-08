import Parser from "rss-parser"
import { NewsItem } from "@/types"
import { cacheGet, cacheSet } from "./redis"
import { callClaude, isClaudeConfigured } from "./claude"
import { NEWS_SCORING_SYSTEM } from "./prompts"

const parser = new Parser()
const NEWS_CACHE_KEY = "news:feed:v3"
const MAX_NEWS_AGE_MS = 48 * 60 * 60 * 1000

export const RSS_FEEDS = [
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/MCtopnews.xml" },
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
]

type CuratedNews = {
  items: NewsItem[]
  source: "RSS feeds" | "No recent headlines"
}

type DatedHeadline = {
  id: string
  source: string
  title: string
  link: string
  publishedAt: string
  publishedTime: number
}

export async function getCuratedNewsWithSource(): Promise<CuratedNews> {
  const cached = await cacheGet<CuratedNews>(NEWS_CACHE_KEY)
  if (cached) return cached

  const now = Date.now()
  const rawHeadlines: DatedHeadline[] = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      parsed.items.forEach((item, index) => {
        if (!item.title) return
        const publishedAt = item.isoDate || item.pubDate
        const publishedTime = publishedAt ? Date.parse(publishedAt) : Number.NaN
        if (
          !Number.isFinite(publishedTime) ||
          publishedTime > now + 5 * 60 * 1000 ||
          now - publishedTime > MAX_NEWS_AGE_MS
        ) {
          return
        }

        rawHeadlines.push({
          id: `${feed.source}-${item.guid || item.link || index}`,
          source: feed.source,
          title: item.title,
          link: item.link || feed.url,
          publishedAt: new Date(publishedTime).toISOString(),
          publishedTime,
        })
      })
    } catch {
      continue
    }
  }

  rawHeadlines.sort((a, b) => b.publishedTime - a.publishedTime)
  const recentHeadlines = rawHeadlines.slice(0, 10)

  if (recentHeadlines.length > 0) {
    let scores: { id: string; score: number; catalyst: string | null }[] = []
    if (isClaudeConfigured()) {
      try {
        const rawJson = await callClaude(
          NEWS_SCORING_SYSTEM,
          JSON.stringify(recentHeadlines.map(({ id, title }) => ({ id, title })))
        )
        scores = (JSON.parse(rawJson) as {
          scores: { id: string; score: number; catalyst: string | null }[]
        }).scores
      } catch {
        scores = []
      }
    }

    const items = recentHeadlines
      .map(({ publishedTime: _publishedTime, ...headline }) => {
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
      const result: CuratedNews = { items, source: "RSS feeds" }
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
