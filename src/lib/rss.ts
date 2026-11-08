// src/lib/rss.ts
import Parser from "rss-parser"
import { NewsItem } from "@/types"
import { cacheGet, cacheSet } from "./redis"
import { callClaude, isClaudeConfigured } from "./claude"
import { NEWS_SCORING_SYSTEM } from "./prompts"

const parser = new Parser()

export const RSS_FEEDS = [
  { source: "Moneycontrol", url: "https://www.moneycontrol.com/rss/MCtopnews.xml" },
  { source: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms" },
]

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-1",
    source: "Moneycontrol",
    title: "RBI Monetary Policy stance hints at stable liquidity; credit growth resilient across top PSU lenders.",
    link: "https://www.moneycontrol.com/news/business/markets/",
    publishedAt: "12m ago",
    score: 9,
    catalyst: "RBI",
  },
  {
    id: "news-2",
    source: "Reuters",
    title: "Crude oil Brent drops 1.4% to $77.20/bbl easing OMCs and airline margins considerably.",
    link: "https://www.reuters.com/markets/commodities/",
    publishedAt: "24m ago",
    score: 8,
    catalyst: "CRUDE",
  },
  {
    id: "news-3",
    source: "Bloomberg",
    title: "US Fed Chair remarks signal steady rate trajectory; Nasdaq rallies 1.1% in after-hours.",
    link: "https://www.bloomberg.com/markets",
    publishedAt: "45m ago",
    score: 9,
    catalyst: "GLOBAL",
  },
  {
    id: "news-4",
    source: "Economic Times",
    title: "TCS & Infosys secure multi-year cloud modernisation orders in Europe — Q2 guidance upgrade likely.",
    link: "https://economictimes.indiatimes.com/markets",
    publishedAt: "1h ago",
    score: 8,
    catalyst: "EARNINGS",
  },
  {
    id: "news-5",
    source: "NSE Dispatch",
    title: "DIIs record 14th consecutive session of net equity inflows (+₹2,845 Cr), absorbing FII cash selling.",
    link: "https://www.nseindia.com/reports/fii-dii",
    publishedAt: "1h 20m ago",
    score: 9,
    catalyst: "FII_FLOW",
  },
]

export async function getCuratedNewsWithSource(): Promise<{
  items: NewsItem[]
  source: "RSS feeds" | "Sample data"
}> {
  const cached = await cacheGet<{
    items: NewsItem[]
    source: "RSS feeds" | "Sample data"
  }>("news:feed:v2")
  if (cached) return cached

  const rawHeadlines: {
    id: string
    source: string
    title: string
    link: string
    publishedAt: string
  }[] = []

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      parsed.items.slice(0, 4).forEach((item, idx) => {
        if (item.title) {
          rawHeadlines.push({
            id: `${feed.source}-${idx}`,
            source: feed.source,
            title: item.title,
            link: item.link || feed.url,
            publishedAt: item.isoDate || item.pubDate || "Date unavailable",
          })
        }
      })
    } catch {
      continue
    }
  }

  if (rawHeadlines.length > 0) {
    let scores: { id: string; score: number; catalyst: string | null }[] = []
    if (isClaudeConfigured()) {
      try {
        const rawJson = await callClaude(
          NEWS_SCORING_SYSTEM,
          JSON.stringify(rawHeadlines.map((headline) => ({
            id: headline.id,
            title: headline.title,
          })))
        )
        scores = (JSON.parse(rawJson) as {
          scores: { id: string; score: number; catalyst: string | null }[]
        }).scores
      } catch {
        scores = []
      }
    }

    const items = rawHeadlines
      .map((headline) => {
        const match = scores.find((score) => score.id === headline.id)
        return {
          ...headline,
          score: match?.score ?? 6,
          catalyst: match?.catalyst ?? null,
        }
      })
      .filter((headline) => headline.score >= 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    if (items.length > 0) {
      const result = { items, source: "RSS feeds" as const }
      await cacheSet("news:feed:v2", result, 900)
      return result
    }
  }

  const result = { items: DEFAULT_NEWS_ITEMS, source: "Sample data" as const }
  await cacheSet("news:feed:v2", result, 900)
  return result
}

export async function getCuratedNews(): Promise<NewsItem[]> {
  return (await getCuratedNewsWithSource()).items
}
