import { cacheGet, cacheSet } from "./redis"
import { getRecentMarketHeadlines } from "./rss"
import { callClaude, isClaudeConfigured } from "./claude"
import { MARKET_HOT_PICKS_SYSTEM } from "./prompts"
import { MarketHotPicksDigest, MarketHotPick } from "@/types"

type MarketSession = MarketHotPicksDigest["session"]

function getIstDateKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

function getCacheKey(session: MarketSession) {
  return `market-hot-picks:${getIstDateKey()}:${session.toLowerCase()}`
}

function parsePicks(response: string, headlines: Awaited<ReturnType<typeof getRecentMarketHeadlines>>) {
  const jsonMatch = response.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("AI returned no market-picks JSON")
  const parsed = JSON.parse(jsonMatch[0]) as {
    picks?: { headlineId?: string; whyItMatters?: string; possibleImpact?: string; watchFor?: string }[]
  }
  if (!Array.isArray(parsed.picks)) throw new Error("AI returned an invalid picks list")

  const headlinesById = new Map(headlines.map((headline) => [headline.id, headline]))
  const seen = new Set<string>()
  const picks: MarketHotPick[] = []
  for (const pick of parsed.picks) {
    if (
      !pick.headlineId ||
      seen.has(pick.headlineId) ||
      typeof pick.whyItMatters !== "string" ||
      typeof pick.possibleImpact !== "string" ||
      typeof pick.watchFor !== "string"
    ) {
      continue
    }
    const headline = headlinesById.get(pick.headlineId)
    if (!headline) continue
    seen.add(headline.id)
    picks.push({
      ...headline,
      headlineId: headline.id,
      whyItMatters: pick.whyItMatters,
      possibleImpact: pick.possibleImpact,
      watchFor: pick.watchFor,
    })
    if (picks.length === 5) break
  }
  return picks
}

export async function getMarketHotPicks(session: MarketSession) {
  return cacheGet<MarketHotPicksDigest>(getCacheKey(session))
}

export async function generateMarketHotPicks(session: MarketSession) {
  const key = getCacheKey(session)
  const existing = await cacheGet<MarketHotPicksDigest>(key)
  if (existing) return existing
  if (!isClaudeConfigured()) throw new Error("GROQ_API_KEY is not configured")

  const headlines = await getRecentMarketHeadlines()
  if (headlines.length === 0) throw new Error("No recent headlines are available from the configured sources")

  const rawResponse = await callClaude(
    MARKET_HOT_PICKS_SYSTEM,
    `Session: ${session}\nCurrent time: ${new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "full",
      timeStyle: "short",
    })} IST\nHeadlines:\n${JSON.stringify(headlines)}`
  )

  const digest: MarketHotPicksDigest = {
    session,
    generatedAt: new Date().toISOString(),
    items: parsePicks(rawResponse, headlines),
  }
  await cacheSet(key, digest, 36 * 60 * 60)
  return digest
}
